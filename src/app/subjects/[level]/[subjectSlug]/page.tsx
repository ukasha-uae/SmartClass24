
'use client';

import { getSubjectBySlug } from '@/lib/jhs-data';
import { getPrimarySubjectBySlug } from '@/lib/primary-data';
import { getSHSSubjectBySlug, getSHSLesson } from '@/lib/shs-data';
import { notFound, useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCollection, useFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Topic, Lesson } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import CreativeLoading from '@/components/CreativeLoading';
import { useEffect, useState, useMemo } from 'react';

type EducationLevel = 'Primary' | 'JHS' | 'SHS';
type TopicWithLessons = Topic & { lessons: Lesson[] };

export default function SubjectPage() {
  const params = useParams();
  const levelParam = params.level as string;
  const subjectSlug = params.subjectSlug as string;
  const { firestore } = useFirebase();
  
  // Get education level from URL parameter first (more reliable)
  const getLevelFromParam = (): EducationLevel => {
    const level = levelParam?.toLowerCase();
    if (level === 'primary') return 'Primary';
    if (level === 'shs') return 'SHS';
    return 'JHS';
  };
  
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(getLevelFromParam());

  // Sync with localStorage and update if URL param changes
  useEffect(() => {
    const levelFromParam = getLevelFromParam();
    setEducationLevel(levelFromParam);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('userEducationLevel', levelFromParam);
    }
  }, [levelParam]);

  // Get subject info based on education level
  const subjectInfo = educationLevel === 'Primary' 
    ? getPrimarySubjectBySlug(subjectSlug)
    : educationLevel === 'SHS'
    ? getSHSSubjectBySlug(subjectSlug)
    : getSubjectBySlug(subjectSlug);

  const topicsQuery = useMemo(
    () => (firestore ? collection(firestore, `subjects/${subjectSlug}/topics`) : null),
    [firestore, subjectSlug]
  );
  const { data: topics, isLoading: isLoadingTopics } = useCollection<Topic>(topicsQuery);

  const [topicsWithLessons, setTopicsWithLessons] = useState<Record<string, TopicWithLessons[]>>({});
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Handle Primary School subjects
      if (educationLevel === 'Primary' && subjectInfo) {
        setIsLoadingLessons(true);
        const primaryData: Record<string, TopicWithLessons[]> = {
          'Class 1': [],
          'Class 2': [],
          'Class 3': [],
          'Class 4': [],
          'Class 5': [],
          'Class 6': [],
        };

        // Group topics by grade level
        (subjectInfo as any).topics?.forEach((topic: any) => {
          const level = topic.gradeLevel || 'Class 1';
          if (primaryData[level]) {
            primaryData[level].push({
              ...topic,
              title: topic.name,
              lessons: topic.lessons || [] // Use lessons from topic data
            } as TopicWithLessons);
          }
        });

        setTopicsWithLessons(primaryData);
        setIsLoadingLessons(false);
        return;
      }

      // Handle SHS subjects
      if (educationLevel === 'SHS' && subjectInfo) {
        setIsLoadingLessons(true);
        const shsData: Record<string, TopicWithLessons[]> = {
          'SHS 1': [],
          'SHS 2': [],
          'SHS 3': [],
        };

        // Group topics by grade level
        // For SHS, check if there's a detailed lesson that matches this topic
        (subjectInfo as any).topics?.forEach((topic: any) => {
          // Extract SHS level from gradeLevel field (e.g., "SHS 1 - Algebra" -> "SHS 1")
          const gradeLevelMatch = topic.gradeLevel?.match(/SHS\s+(1|2|3)/);
          const level = gradeLevelMatch ? `SHS ${gradeLevelMatch[1]}` : 'SHS 1';
          
          if (shsData[level]) {
            // Try to get the detailed lesson from shs-lessons-data.ts
            // The topic slug might be "shs3-factorization" but the lesson slug is "factorization"
            const detailedLesson = getSHSLesson(subjectSlug, topic.slug, topic.slug);
            const lessonSlug = detailedLesson ? detailedLesson.slug : topic.slug;
            
            shsData[level].push({
              id: topic.id,
              slug: topic.slug,
              title: topic.name,
              name: topic.name,
              lessons: [{
                id: detailedLesson?.id || topic.id,
                slug: lessonSlug, // Use the actual lesson slug
                title: topic.name,
                description: `Learn about ${topic.name}`
              }]
            } as TopicWithLessons);
          }
        });

        setTopicsWithLessons(shsData);
        setIsLoadingLessons(false);
        return;
      }

      // If we have topics from Firestore, try to load their lessons
      if (topics && topics.length > 0 && firestore) {
        setIsLoadingLessons(true);
        const allTopicsWithLessons: Record<string, TopicWithLessons[]> = {
          'JHS 1': [],
          'JHS 2': [],
          'JHS 3': [],
        };

        try {
          for (const topic of topics) {
            const lessonsColRef = collection(firestore, `subjects/${subjectSlug}/topics/${topic.slug}/lessons`);
            const lessonsSnapshot = await getDocs(lessonsColRef);
            const lessons = lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
            const topicWithLessons = { ...topic, lessons };
            
            const level = (topic as any).jhsLevel || 'JHS 1'; // Fallback level
            if (allTopicsWithLessons[level]) {
              allTopicsWithLessons[level].push(topicWithLessons);
            }
          }
          setTopicsWithLessons(allTopicsWithLessons);
        } catch (e) {
          console.error("Error loading from Firestore, falling back to local", e);
          // Fallback logic below will run if we don't return here, 
          // but we need to be careful about state updates.
        }
        setIsLoadingLessons(false);
        return; 
      }

      // Fallback: If Firestore is loading, wait.
      if (isLoadingTopics && firestore) {
        return;
      }

      // Fallback: If no topics from Firestore (or error/loading finished), use local data
      if (subjectInfo) {
        console.log("Using local subject data");
        const localData: Record<string, TopicWithLessons[]> = {
          'JHS 1': [],
          'JHS 2': [],
          'JHS 3': [],
        };
        
        subjectInfo.curriculum.forEach(levelData => {
            const level = levelData.level;
            if (localData[level]) {
                localData[level] = levelData.topics.map(t => ({
                    ...t,
                    lessons: t.lessons || []
                })) as TopicWithLessons[];
            }
        });
        setTopicsWithLessons(localData);
        setIsLoadingLessons(false);
      }
    };

    loadData();
  }, [topics, firestore, subjectSlug, isLoadingTopics, educationLevel, subjectInfo]);


  if (!subjectInfo) {
    notFound();
  }

  const curriculumLevels = educationLevel === 'Primary'
    ? ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6']
    : educationLevel === 'SHS'
    ? ['SHS 1', 'SHS 2', 'SHS 3']
    : ['JHS 1', 'JHS 2', 'JHS 3'];

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      {/* Back to Subjects Button */}
      <Link href={`/subjects/${levelParam}`}>
        <Button variant="ghost" className="mb-4 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Subjects
        </Button>
      </Link>

      <div className="flex items-center space-x-4 mb-8">
        {(subjectInfo as any).icon ? (
          <subjectInfo.icon className="h-12 w-12 text-primary" />
        ) : (
          <BookOpen className="h-12 w-12 text-primary" />
        )}
        <div>
          <h1 className="text-4xl font-bold font-headline">{subjectInfo.name}</h1>
          <p className="text-muted-foreground">{subjectInfo.description || 'Explore topics and lessons'}</p>
          {educationLevel === 'Primary' && (
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium">
              Primary School
            </span>
          )}
        </div>
      </div>

      <Tabs defaultValue={curriculumLevels[0]} className="w-full">
        <TabsList className={`grid w-full ${educationLevel === 'Primary' ? 'grid-cols-6' : 'grid-cols-3'}`}>
          {curriculumLevels.map((level) => (
            <TabsTrigger key={level} value={level}>
              {level}
            </TabsTrigger>
          ))}
        </TabsList>
        {(isLoadingTopics || isLoadingLessons) ? (
            curriculumLevels.map((level) => (
              <TabsContent key={level} value={level}>
                <CreativeLoading />
              </TabsContent>
            ))
          ) : (
            curriculumLevels.map((level) => (
              <TabsContent key={level} value={level}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {topicsWithLessons[level]?.map((topic) => (
                  <Card key={topic.id} className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-start">
                        <BookOpen className="h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                        <span>{topic.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-2">
                        {topic.lessons.map((lesson) => (
                          <li key={lesson.id}>
                            {/* 
                              IMPORTANT: For SHS, topics ARE lessons (no nested structure).
                              Both topicSlug and lessonSlug use lesson.slug to ensure proper routing.
                              The lesson page handles when topicSlug === lessonSlug correctly.
                              DO NOT change this back to ${topic.slug}/${lesson.slug}
                            */}
                            <Link
                              href={`/subjects/${levelParam}/${subjectSlug}/${lesson.slug}/${lesson.slug}`}
                              className="text-primary hover:underline"
                            >
                              {lesson.title}
                            </Link>
                          </li>
                        ))}
                         {topic.lessons.length === 0 && <p className="text-sm text-muted-foreground">No lessons yet.</p>}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
               {(!topicsWithLessons[level] || topicsWithLessons[level].length === 0) && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No topics found for {level}.</p>
                  </div>
                )}
            </TabsContent>
          ))
        )}
      </Tabs>
    </div>
  );
}
