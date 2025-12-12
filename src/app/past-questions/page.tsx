'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowRight, BrainCircuit, BookOpen, Search, Award, ExternalLink } from "lucide-react";
import Link from "next/link";
import { subjects } from '@/lib/jhs-data';
import { coreSubjects } from '@/lib/shs-data';
import { useState, useMemo } from 'react';
import CampusSelector from '@/components/CampusSelector';

interface PastQuestion {
  question: string;
  solution: string;
  subject: string;
  subjectSlug: string;
  topic: string;
  topicSlug: string;
  lesson: string;
  lessonSlug: string;
  lessonId: string;
}

export default function PastQuestionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [educationLevel, setEducationLevel] = useState<'JHS' | 'SHS'>('JHS');

  // Aggregate all past questions from lessons based on education level
  const allPastQuestions = useMemo(() => {
    const questions: PastQuestion[] = [];
    
    const currentSubjects = educationLevel === 'JHS' ? subjects : coreSubjects;
    
    currentSubjects.forEach(subject => {
      if (educationLevel === 'JHS' && 'curriculum' in subject) {
        // JHS structure with curriculum levels
        subject.curriculum.forEach((curriculumLevel: any) => {
          curriculumLevel.topics.forEach((topic: any) => {
            topic.lessons.forEach((lesson: any) => {
              if (lesson.pastQuestions && lesson.pastQuestions.length > 0) {
                lesson.pastQuestions.forEach((pq: any) => {
                  questions.push({
                    ...pq,
                    subject: subject.name,
                    subjectSlug: subject.slug,
                    topic: topic.title,
                    topicSlug: topic.slug,
                    lesson: lesson.title,
                    lessonSlug: lesson.slug,
                    lessonId: lesson.id
                  });
                });
              }
            });
          });
        });
      } else if (educationLevel === 'SHS' && 'topics' in subject) {
        // SHS structure with topics directly
        subject.topics.forEach((topic: any) => {
          // For SHS, topics don't have lessons in the same way, so we'll treat topics as lesson containers
          // This is a placeholder - you may need to adjust based on actual SHS data structure
          questions.push({
            question: `${topic.name} - Practice Questions`,
            solution: 'Check WASSCE past papers for detailed solutions',
            subject: subject.name,
            subjectSlug: subject.slug,
            topic: topic.name,
            topicSlug: topic.slug,
            lesson: topic.name,
            lessonSlug: topic.slug,
            lessonId: topic.id
          });
        });
      }
    });
    
    return questions;
  }, [educationLevel]);

  // Filter questions by search and subject
  const filteredQuestions = useMemo(() => {
    return allPastQuestions.filter(q => {
      const matchesSearch = searchQuery === '' || 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.lesson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSubject = selectedSubject === 'all' || q.subject === selectedSubject;
      
      return matchesSearch && matchesSubject;
    });
  }, [allPastQuestions, searchQuery, selectedSubject]);

  // Get unique subjects with past questions
  const subjectsWithQuestions = useMemo(() => {
    const subjectSet = new Set(allPastQuestions.map(q => q.subject));
    return Array.from(subjectSet);
  }, [allPastQuestions]);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 pb-20">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-bold font-headline mb-2">
              {educationLevel === 'JHS' ? 'BECE' : 'WASSCE'} Past Questions
            </h1>
            <p className="text-muted-foreground">
              Comprehensive database of {allPastQuestions.length} {educationLevel === 'JHS' ? 'BECE' : 'WASSCE'} past questions
            </p>
          </div>
          <CampusSelector onLevelChange={(level: 'Primary' | 'JHS' | 'SHS') => setEducationLevel(level as 'JHS' | 'SHS')} defaultLevel={educationLevel} />
        </div>
      </div>

      {/* Adaptive Quiz Card */}
      <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            Adaptive AI Quiz
          </CardTitle>
          <CardDescription>
            Generate a personalized quiz based on your strengths and weaknesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg">
            <Link href="/quiz">
              Create Adaptive Quiz
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions, topics, or lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects ({allPastQuestions.length})</SelectItem>
            {subjectsWithQuestions.map(subject => (
              <SelectItem key={subject} value={subject}>
                {subject} ({allPastQuestions.filter(q => q.subject === subject).length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Award className="h-4 w-4" />
        <span>Showing {filteredQuestions.length} questions</span>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No past questions found</p>
          </Card>
        ) : (
          filteredQuestions.map((q, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
              <CardHeader>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary">{q.subject}</Badge>
                      <Badge variant="outline">{q.topic}</Badge>
                      <span className="text-xs text-muted-foreground">• {q.lesson}</span>
                    </div>
                    <CardTitle className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                      {q.question}
                    </CardTitle>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/subjects/jhs/${q.subjectSlug}/${q.topicSlug}/${q.lessonSlug}`}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Lesson
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <details className="group">
                  <summary className="cursor-pointer font-medium text-primary hover:underline">
                    View Solution
                  </summary>
                  <div className="mt-3 p-4 bg-muted rounded-lg border-l-2 border-amber-500">
                    <p className="text-sm">{q.solution}</p>
                  </div>
                </details>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
    )
}
