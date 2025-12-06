'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateLessonCode, generateLessonSummary, validateLessonData } from '@/lib/code-generator';
import LessonEditor from '@/components/admin/LessonEditor';
import QuestionBuilder from '@/components/admin/QuestionBuilder';
import type { Lesson, Quiz } from '@/lib/types';
import { Copy, CheckCircle, AlertCircle, Code, FileText, Save, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CourseBuilderPage() {
  const [activeTab, setActiveTab] = useState('editor');
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

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast({
        title: 'Copied!',
        description: 'Code copied to clipboard'
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please copy manually',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Course Builder</h1>
        <p className="text-muted-foreground">
          Create and edit lesson content, then export to TypeScript code
        </p>
      </div>

      <div className="mb-4 flex gap-2">
        <Button onClick={loadSampleData} variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Load Sample Data
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
                      <Button onClick={handleCopyCode} variant="outline" size="sm">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Copy this code and paste it into your jhs-data.ts file
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
                    <strong>Next Steps:</strong>
                    <ol className="mt-2 list-decimal list-inside space-y-1">
                      <li>Copy the generated code above</li>
                      <li>Open <code className="bg-muted px-1 rounded">src/lib/jhs-data.ts</code></li>
                      <li>Find the appropriate location in the lessons array</li>
                      <li>Paste the code</li>
                      <li>Save and restart the dev server</li>
                    </ol>
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
