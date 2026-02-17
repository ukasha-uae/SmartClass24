
'use client';

import { getSubjectBySlug } from '@/lib/jhs-data';
import { getPrimarySubjectBySlug } from '@/lib/primary-data';
import { getSHSSubjectBySlug, getSHSLesson } from '@/lib/shs-data';
import { notFound, useParams } from 'next/navigation';
import { useLocalization } from '@/hooks/useLocalization';
import { useTenant } from '@/hooks/useTenant';
import {
  resolveCurriculumId,
  resolveCurriculumLevel,
  hasMappedTopicsForSubject,
  isTopicInCurriculum,
} from '@/lib/curriculum-mapping';
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
import React, { useEffect, useState, useMemo } from 'react';

type EducationLevel = 'Primary' | 'JHS' | 'SHS';
type TopicWithLessons = Topic & { lessons: Lesson[] };

export default function SubjectPage() {
  const params = useParams();
  const levelParam = params.level as string;
  const subjectSlug = params.subjectSlug as string;
  const { firestore } = useFirebase();
  const { country } = useLocalization();
  const { tenant } = useTenant();
  
  // Country-specific color theming
  const getCountryColors = () => {
    if (country?.id === 'nigeria') {
      return {
        primary: 'from-green-600 to-green-700',
        accent: 'from-emerald-500 to-green-600',
        badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        flag: '🇳🇬'
      };
    } else if (country?.id === 'ghana') {
      return {
        primary: 'from-red-600 to-red-700',
        accent: 'from-green-600 to-green-700',
        badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        flag: '🇬🇭'
      };
    }
    return {
      primary: 'from-blue-600 to-indigo-600',
      accent: 'from-violet-500 to-purple-600',
      badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      flag: '🌍'
    };
  };
  
  const colors = getCountryColors();
  
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
      // Wait for country to load
      if (!country) return;
      
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
        const baseName = country?.academicStructure.seniorSecondary.name || 'SHS';
        const shsData: Record<string, TopicWithLessons[]> = {
          [`${baseName} 1`]: [],
          [`${baseName} 2`]: [],
          [`${baseName} 3`]: [],
        };

        // Helper function to extract level number
        const getLevelNumber = (dataLevel: string): number | null => {
          const match = dataLevel.match(/(\d+)/);
          return match ? parseInt(match[1]) : null;
        };

        // Curriculum mapping: prefer tenant curriculumId, else country-based (e.g. Ghana WASSCE); filter topics by mapping per level
        const curriculumId = resolveCurriculumId(tenant, country?.id ?? null);

        // Group topics by grade level
        // For SHS, check if there's a detailed lesson that matches this topic
        (subjectInfo as any).topics?.forEach((topic: any) => {
          // Extract level number from gradeLevel field (e.g., "SHS 1 - Algebra" -> 1, "SSS 2 - Chemistry" -> 2)
          const gradeLevelMatch = topic.gradeLevel?.match(/(\d+)/);
          const levelNum = gradeLevelMatch ? parseInt(gradeLevelMatch[1]) : 1;
          const displayLevel = `${baseName} ${levelNum}`;
          const resolvedLevel = curriculumId ? resolveCurriculumLevel(curriculumId, displayLevel) : displayLevel;

          if (shsData[displayLevel]) {
            // If curriculum mapping exists, only show topics that are in the mapping for this subject+level
            if (curriculumId && hasMappedTopicsForSubject(curriculumId, resolvedLevel, subjectSlug)) {
              if (!isTopicInCurriculum(curriculumId, resolvedLevel, topic.slug, subjectSlug)) return;
            }

            // Try to get the detailed lesson from shs-lessons-data.ts
            // The topic slug might be "shs3-factorization" but the lesson slug is "factorization"
            const detailedLesson = getSHSLesson(subjectSlug, topic.slug, topic.slug);
            const lessonSlug = detailedLesson ? detailedLesson.slug : topic.slug;
            
            shsData[displayLevel].push({
              id: topic.id,
              slug: topic.slug,
              title: topic.name,
              name: topic.name,
              lessons: detailedLesson ? [{
                id: detailedLesson.id,
                slug: lessonSlug,
                title: detailedLesson.title || topic.name,
                objectives: detailedLesson.objectives || [],
                introduction: detailedLesson.introduction || '',
                keyConcepts: detailedLesson.keyConcepts || [],
                activities: detailedLesson.activities || { type: 'exercises', questions: [] },
                pastQuestions: detailedLesson.pastQuestions || [],
                summary: detailedLesson.summary || '',
              }] : []
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
        const baseName = country?.academicStructure.juniorSecondary.name || 'JHS';
        const allTopicsWithLessons: Record<string, TopicWithLessons[]> = {
          [`${baseName} 1`]: [],
          [`${baseName} 2`]: [],
          [`${baseName} 3`]: [],
        };

        try {
          // Helper to extract level number and create display level
          const getLevelNumber = (levelStr: string): number | null => {
            const match = levelStr.match(/(\d+)/);
            return match ? parseInt(match[1]) : null;
          };
          
          for (const topic of topics) {
            const lessonsColRef = collection(firestore, `subjects/${subjectSlug}/topics/${topic.slug}/lessons`);
            const lessonsSnapshot = await getDocs(lessonsColRef);
            const lessons = lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
            const topicWithLessons = { ...topic, lessons };
            
            // Extract level from topic data (e.g., "JHS 1" → 1)
            const dataLevel = (topic as any).jhsLevel || 'JHS 1';
            const levelNum = getLevelNumber(dataLevel);
            
            if (levelNum) {
              const displayLevel = `${baseName} ${levelNum}`;
              if (allTopicsWithLessons[displayLevel]) {
                allTopicsWithLessons[displayLevel].push(topicWithLessons);
              }
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
        const baseName = country.academicStructure.juniorSecondary.name;
        
        // Create display keys with country-specific names
        const localData: Record<string, TopicWithLessons[]> = {
          [`${baseName} 1`]: [],
          [`${baseName} 2`]: [],
          [`${baseName} 3`]: [],
        };
        
        // Map data file levels to display levels based on level number
        const getLevelNumber = (dataLevel: string): number | null => {
          const match = dataLevel.match(/(\d+)/);
          return match ? parseInt(match[1]) : null;
        };
        
        // Type guard: check if subjectInfo has curriculum (JHS Subject type)
        if ('curriculum' in subjectInfo && Array.isArray(subjectInfo.curriculum)) {
          subjectInfo.curriculum.forEach((levelData: any) => {
            const levelNum = getLevelNumber(levelData.level);
            
            if (levelNum) {
              const displayLevel = `${baseName} ${levelNum}`;
              if (localData[displayLevel]) {
                localData[displayLevel] = levelData.topics.map((t: any) => ({
                  ...t,
                  lessons: t.lessons || []
                })) as TopicWithLessons[];
              }
            }
          });
        }
        
        setTopicsWithLessons(localData);
        setIsLoadingLessons(false);
      }
    };

    loadData();
  }, [topics, firestore, subjectSlug, isLoadingTopics, educationLevel, subjectInfo, country]);


  if (!subjectInfo) {
    notFound();
  }

  // Get country-specific level names
  const getJuniorLevelName = (num: number) => {
    if (educationLevel === 'Primary') return `Class ${num}`;
    if (educationLevel === 'SHS') {
      const baseName = country?.academicStructure.seniorSecondary.name || 'SHS';
      return `${baseName} ${num}`;
    }
    const baseName = country?.academicStructure.juniorSecondary.name || 'JHS';
    return `${baseName} ${num}`;
  };

  const curriculumLevels = educationLevel === 'Primary'
    ? ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6']
    : educationLevel === 'SHS'
    ? [getJuniorLevelName(1), getJuniorLevelName(2), getJuniorLevelName(3)]
    : [getJuniorLevelName(1), getJuniorLevelName(2), getJuniorLevelName(3)];

  return (
    <div className="relative min-h-screen">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br ${colors.primary} opacity-10 rounded-full blur-3xl animate-float`} />
        <div className={`absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr ${colors.accent} opacity-10 rounded-full blur-3xl`} style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        {/* Back to Subjects Button */}
        <Link href={`/subjects/${levelParam}`}>
          <Button variant="ghost" className="mb-6 -ml-2 hover:translate-x-1 transition-transform">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Subjects
          </Button>
        </Link>

        {/* Enhanced Header Section */}
        <div className="mb-8 animate-fadeInUp">
          <div className="flex items-start gap-6">
            {'icon' in subjectInfo && subjectInfo.icon ? (
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${colors.primary} shadow-lg`}>
                {React.createElement(subjectInfo.icon, { className: "h-12 w-12 text-white" })}
              </div>
            ) : (
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${colors.primary} shadow-lg`}>
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className={`text-4xl md:text-5xl font-bold font-headline bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
                  {subjectInfo.name}
                </h1>
                <span className="text-2xl">{colors.flag}</span>
              </div>
              <p className="text-muted-foreground text-lg mb-3">{subjectInfo.description || 'Explore topics and lessons'}</p>
              <div className="flex gap-2">
                <span className={`inline-block px-3 py-1 rounded-full ${colors.badge} text-sm font-medium`}>
                  {educationLevel === 'Primary' 
                    ? 'Primary School' 
                    : educationLevel === 'SHS' 
                    ? country?.academicStructure.seniorSecondary.name || 'SHS'
                    : country?.academicStructure.juniorSecondary.name || 'JHS'}
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {country?.name || 'International'} Curriculum
                </span>
              </div>
            </div>
          </div>
        </div>

      <Tabs key={`${country?.id}-${educationLevel}`} defaultValue={curriculumLevels[0]} className="w-full">
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
                {topicsWithLessons[level]?.map((topic, index) => (
                  <Card key={topic.id} className="h-full flex flex-col hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden border-2 hover:border-primary/50 animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.primary} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    <CardHeader className="relative z-10">
                      <CardTitle className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${colors.primary} shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <span className="group-hover:text-primary transition-colors">{topic.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow relative z-10">
                      <ul className="space-y-3">
                        {topic.lessons.map((lesson) => {
                          // IMPORTANT: URL structure differs by education level
                          // - JHS: /subjects/jhs/{subjectSlug}/{topicSlug}/{lessonSlug}
                          // - SHS: /subjects/shs/{subjectSlug}/{lessonSlug}/{lessonSlug} (topics ARE lessons)
                          const lessonUrl = educationLevel === 'SHS'
                            ? `/subjects/${levelParam}/${subjectSlug}/${lesson.slug}/${lesson.slug}`
                            : `/subjects/${levelParam}/${subjectSlug}/${topic.slug}/${lesson.slug}`;
                          
                          return (
                            <li key={lesson.id}>
                              <Link
                                href={lessonUrl}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gradient-to-r ${colors.accent} hover:text-white transition-all duration-300 group/lesson`}
                              >
                                <span className="text-sm">📚</span>
                                <span className="text-sm flex-1">{lesson.title}</span>
                                <ArrowLeft className="h-3 w-3 rotate-180 opacity-0 group-hover/lesson:opacity-100 group-hover/lesson:translate-x-1 transition-all" />
                              </Link>
                            </li>
                          );
                        })}
                         {topic.lessons.length === 0 && <p className="text-sm text-muted-foreground italic">No lessons yet.</p>}
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
    </div>
  );
}
