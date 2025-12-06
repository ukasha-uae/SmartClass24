'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateLessonCode, generateLessonSummary, validateLessonData } from '@/lib/code-generator';
import LessonEditor from '@/components/admin/LessonEditor';
import QuestionBuilder from '@/components/admin/QuestionBuilder';
import type { Lesson, Quiz, Topic } from '@/lib/types';
import { Copy, CheckCircle, AlertCircle, Code, FileText, Save, Eye, FolderOpen, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { subjects } from '@/lib/jhs-data';

export default function CourseBuilderPage() {
  const [activeTab, setActiveTab] = useState('editor');
  const [availableLessons, setAvailableLessons] = useState<Array<{id: string, title: string, subject: string, topic: string}>>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [lesson, setLesson] = useState<Partial<Lesson>>({
    id: '',
    slug: '',
    title: '',
    objectives: [],
    introduction: '',
    keyConcepts: [],
    activities: {
      type: 'exercises',
      questions: []
    },
    pastQuestions: [],
    endOfLessonQuiz: [],
    summary: ''
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [summary, setSummary] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { toast } = useToast();

  // Load available lessons on mount
  useEffect(() => {
    const lessons: Array<{id: string, title: string, subject: string, topic: string}> = [];
    subjects.forEach(subject => {
      subject.curriculum.forEach(curriculumLevel => {
        curriculumLevel.topics.forEach((topic: Topic) => {
          topic.lessons.forEach((lesson: Lesson) => {
            lessons.push({
              id: lesson.id,
              title: lesson.title,
              subject: subject.name,
              topic: topic.title
            });
          });
        });
      });
    });
    setAvailableLessons(lessons);
  }, []);

  const updateActivitiesQuestions = (questions: Quiz[]) => {
    setLesson({
      ...lesson,
      activities: {
        type: 'exercises',
        questions
      }
    });
  };

  const updateEndQuizQuestions = (questions: Quiz[]) => {
    setLesson({
      ...lesson,
      endOfLessonQuiz: questions
    });
  };

  const handleGenerateCode = () => {
    // Validate first
    const validation = validateLessonData(lesson);
    setValidationErrors(validation.errors);

    if (!validation.valid) {
      toast({
        title: 'Validation Failed',
        description: `Found ${validation.errors.length} error(s)`,
        variant: 'destructive'
      });
      setActiveTab('export');
      return;
    }

    // Generate code
    const code = generateLessonCode(lesson);
    setGeneratedCode(code);

    // Generate summary
    const summaryText = generateLessonSummary(lesson);
    setSummary(summaryText);

    setActiveTab('export');
    toast({
      title: 'Code Generated Successfully',
      description: 'Your TypeScript code is ready to copy'
    });
  };

  const loadExistingLesson = (lessonId: string) => {
    if (!lessonId) return;

    let foundLesson: Lesson | null = null;
    
    for (const subject of subjects) {
      for (const curriculumLevel of subject.curriculum) {
        for (const topic of curriculumLevel.topics) {
          const lesson = topic.lessons.find((l: Lesson) => l.id === lessonId);
          if (lesson) {
            foundLesson = lesson;
            break;
          }
        }
        if (foundLesson) break;
      }
      if (foundLesson) break;
    }

    if (foundLesson) {
      setLesson(foundLesson);
      setSelectedLessonId(lessonId);
      toast({
        title: 'Lesson Loaded',
        description: `Loaded: ${foundLesson.title}`
      });
    }
  };

  const loadSampleData = () => {
    setLesson({
      id: 'eng104-2',
      slug: 'test-lesson',
      title: 'Test Lesson - Sample',
      objectives: [
        'Understand the basic concepts',
        'Apply knowledge in practical scenarios',
        'Master the fundamental skills'
      ],
      introduction: 'This is a test lesson to demonstrate the code generator. It includes properly escaped text with "quotes" and other special characters.',
      keyConcepts: [
        {
          title: '1. First Concept',
          content: 'This is the content of the first concept. It can include:\n\n• Bullet points\n• Multiple paragraphs\n• Special characters like "quotes" and apostrophes\n\nExample: The student\'s work was excellent.'
        },
        {
          title: '2. Second Concept',
          content: 'More detailed information about the second concept goes here.'
        }
      ],
      activities: {
        type: 'exercises',
        questions: [
          {
            type: 'mcq',
            question: 'What is the capital of Ghana?',
            options: ['Accra', 'Kumasi', 'Tamale', 'Takoradi'],
            answer: 'Accra',
            explanation: 'Accra is the capital and largest city of Ghana.'
          },
          {
            type: 'fillblank',
            question: 'Fill in the blank',
            sentence: 'The _____ is the largest planet in our solar system.',
            answer: 'Jupiter',
            alternatives: ['jupiter'],
            explanation: 'Jupiter is indeed the largest planet.'
          },
          {
            type: 'matching',
            question: 'Match the items',
            pairs: [
              { left: 'Monday', right: 'First day' },
              { left: 'Friday', right: 'Last working day' }
            ],
            explanation: 'Match days with their descriptions.'
          }
        ]
      },
      pastQuestions: [
        {
          question: 'Sample BECE question here?',
          solution: 'This is the solution to the sample question.'
        }
      ],
      endOfLessonQuiz: [
        {
          type: 'mcq',
          question: 'Final assessment question?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          answer: 'Option B',
          explanation: 'Option B is correct because...'
        }
      ],
      summary: 'This is a comprehensive summary of everything covered in the lesson.'
    });
    toast({
      title: 'Sample Data Loaded',
      description: 'You can now edit and customize the sample lesson'
    });
  };

  const handleSaveToFile = async () => {
    if (!generatedCode) {
      toast({
        title: 'No Code Generated',
        description: 'Generate code first before saving',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch('/api/save-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lessonCode: generatedCode,
          lessonId: lesson.id 
        })
      });

      if (response.ok) {
        toast({
          title: 'Saved!',
          description: 'Lesson saved to jhs-data.ts'
        });
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      toast({
        title: 'Auto-save not available',
        description: 'Copy the code and paste manually into jhs-data.ts',
        variant: 'destructive'
      });
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast({
        title: 'Copied!',
        description: 'Code copied to clipboard. Paste into jhs-data.ts at the lesson location.'
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please copy manually',
        variant: 'destructive'
      });
    }
  };

  // Filter lessons based on search query
  const filteredLessons = availableLessons.filter(lesson => {
    const query = searchQuery.toLowerCase();
    return (
      lesson.title.toLowerCase().includes(query) ||
      lesson.subject.toLowerCase().includes(query) ||
      lesson.topic.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Course Builder</h1>
        <p className="text-muted-foreground">
          Create and edit lesson content, then export to TypeScript code
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <div className="flex-1 max-w-md">
          <Select value={selectedLessonId} onValueChange={loadExistingLesson}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Load existing lesson..." />
            </SelectTrigger>
            <SelectContent className="max-h-[400px]">
              <div className="p-2 sticky top-0 bg-background border-b">
                <input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              {filteredLessons.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No lessons found
                </div>
              ) : (
                filteredLessons.map(lesson => (
                  <SelectItem key={lesson.id} value={lesson.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{lesson.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {lesson.subject} → {lesson.topic}
                      </span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => { setLesson({ id: '', slug: '', title: '', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'exercises', questions: [] }, pastQuestions: [], endOfLessonQuiz: [], summary: '' }); setSelectedLessonId(''); }} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          New Lesson
        </Button>
        <Button onClick={loadSampleData} variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Sample Data
        </Button>
        <Button onClick={handleGenerateCode} variant="default">
          <Code className="mr-2 h-4 w-4" />
          Generate Code
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="editor">Lesson Content</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="quiz">End Quiz</TabsTrigger>
          <TabsTrigger value="export">Export Code</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6 mt-6">
          <LessonEditor lesson={lesson} onChange={setLesson} />
        </TabsContent>

        <TabsContent value="activities" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Practice Activities</CardTitle>
              <CardDescription>
                Create interactive questions for students to practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuestionBuilder
                questions={(lesson.activities as any)?.questions || []}
                onChange={updateActivitiesQuestions}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>End of Lesson Quiz</CardTitle>
              <CardDescription>
                Create assessment questions to test understanding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuestionBuilder
                questions={lesson.endOfLessonQuiz || []}
                onChange={updateEndQuizQuestions}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Export Controls
                  </CardTitle>
                  <CardDescription>
                    Validate and export your lesson code
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleGenerateCode} className="w-full" size="lg">
                    <Code className="mr-2 h-4 w-4" />
                    Generate TypeScript Code
                  </Button>

                  {validationErrors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Validation Errors:</strong>
                        <ul className="mt-2 list-disc list-inside">
                          {validationErrors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {summary && (
                    <Card className="bg-muted">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Lesson Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs whitespace-pre-wrap font-mono">
                          {summary}
                        </pre>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Generated Code */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Generated TypeScript Code
                    </span>
                    {generatedCode && (
                      <div className="flex gap-2">
                        <Button onClick={handleCopyCode} variant="outline" size="sm">
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Code
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Copy this code and paste it into jhs-data.ts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!generatedCode ? (
                    <div className="text-center text-muted-foreground py-12">
                      <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Click "Generate TypeScript Code" to see the output</p>
                    </div>
                  ) : (
                    <Textarea
                      value={generatedCode}
                      readOnly
                      className="font-mono text-xs min-h-[600px]"
                    />
                  )}
                </CardContent>
              </Card>

              {generatedCode && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>How to Update jhs-data.ts:</strong>
                    <ol className="mt-2 list-decimal list-inside space-y-2 text-sm">
                      <li>Click <strong>"Copy Code"</strong> button above</li>
                      <li>Open <code className="bg-muted px-1 py-0.5 rounded text-xs">src/lib/jhs-data.ts</code></li>
                      <li>
                        <strong>For NEW lessons:</strong> Navigate to the appropriate subject → curriculum level → topic, 
                        and add the code to the <code className="bg-muted px-1 rounded text-xs">lessons: []</code> array
                      </li>
                      <li>
                        <strong>For EDITING:</strong> Use Ctrl+F to search for <code className="bg-muted px-1 rounded text-xs">id: '{lesson.id}'</code>, 
                        select the entire lesson object (from opening brace to closing brace + comma), and replace with the new code
                      </li>
                      <li>Save the file - changes will appear immediately (hot reload)</li>
                    </ol>
                    <p className="mt-3 text-xs text-muted-foreground">
                      💡 <strong>Tip:</strong> Each lesson object starts with <code className="bg-muted px-1 rounded">{'{'}</code> and ends with <code className="bg-muted px-1 rounded">{'},'}</code>
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
