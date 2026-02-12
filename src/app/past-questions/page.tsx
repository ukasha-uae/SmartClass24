"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pastQuestions, type PastQuestion } from '@/lib/past-questions';
import { BookOpen, Calendar, Trophy, CheckCircle2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocalization } from '@/hooks/useLocalization';

export default function PastQuestionsPage() {
  const { getSecondaryExam, country } = useLocalization();
  const examName = getSecondaryExam();
  
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedQuestion, setSelectedQuestion] = useState<PastQuestion | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const subjects = ['All', ...Array.from(new Set(pastQuestions.map(q => q.subject)))];
  const years = ['All', ...Array.from(new Set(pastQuestions.map(q => q.year.toString()))).sort().reverse()];

  const filteredQuestions = pastQuestions.filter(q => 
    (selectedSubject === 'All' || q.subject === selectedSubject) &&
    (selectedYear === 'All' || q.year.toString() === selectedYear)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="h-10 w-10 text-amber-600 dark:text-amber-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
            {country ? `${examName} Past Questions` : 'Past Questions'}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {country 
            ? `Step-by-step solutions to ${examName} past questions. Master exam techniques with detailed explanations.`
            : 'Step-by-step solutions to exam past questions. Master exam techniques with detailed explanations.'
          }
        </p>
        {!country && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
            💡 Select your country from the header to see region-specific content
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map(subject => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(selectedSubject !== 'All' || selectedYear !== 'All') && (
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedSubject('All');
              setSelectedYear('All');
              setSelectedQuestion(null);
              setShowSolution(false);
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-violet-600" />
            <div>
              <p className="text-2xl font-bold">{filteredQuestions.length}</p>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{years.length - 1}</p>
              <p className="text-sm text-muted-foreground">Years Covered</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-amber-600" />
            <div>
              <p className="text-2xl font-bold">{subjects.length - 1}</p>
              <p className="text-sm text-muted-foreground">Subjects</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">100%</p>
              <p className="text-sm text-muted-foreground">Solutions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questions List or Selected Question */}
      {!selectedQuestion ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((question) => (
            <Card 
              key={question.id} 
              className="hover:shadow-xl transition-all cursor-pointer hover:scale-105"
              onClick={() => {
                setSelectedQuestion(question);
                setShowSolution(false);
                setCurrentStep(0);
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary">{question.year}</Badge>
                  <Badge className={
                    question.questionType === 'Theory' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400' :
                    question.questionType === 'MCQ' ? 'bg-green-500/10 text-green-700 dark:text-green-400' :
                    'bg-purple-500/10 text-purple-700 dark:text-purple-400'
                  }>
                    {question.questionType}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{question.subject}</CardTitle>
                <CardDescription className="font-medium">{question.topic}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm line-clamp-2 mb-3">{question.question}</div>
                <Button className="w-full" size="sm">
                  Solve Step-by-Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => {
              setSelectedQuestion(null);
              setShowSolution(false);
            }}
          >
            ← Back to Questions
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">{selectedQuestion.year}</Badge>
                <Badge>{selectedQuestion.questionType}</Badge>
                <Badge variant="outline">{selectedQuestion.subject}</Badge>
              </div>
              <CardTitle className="text-2xl">{selectedQuestion.topic}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question */}
              <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription className="text-base font-medium">
                  {selectedQuestion.question}
                </AlertDescription>
              </Alert>

              {/* Show Solution Button */}
              {!showSolution && (
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setShowSolution(true)}
                >
                  Solve Step-by-Step
                </Button>
              )}

              {/* Solution Steps - Progressive Reveal */}
              {showSolution && (
                <div className="space-y-4">
                  {/* Progress Indicator */}
                  <div className="flex items-center justify-between mb-6 p-4 bg-violet-500/5 rounded-lg border border-violet-200 dark:border-violet-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-violet-600" />
                      <span className="font-semibold">
                        Step {currentStep + 1} of {selectedQuestion.steps.length + 1}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentStep === selectedQuestion.steps.length ? 'Final Answer' : selectedQuestion.steps[currentStep]?.title}
                    </div>
                  </div>

                  {/* Current Step Display */}
                  {currentStep < selectedQuestion.steps.length ? (
                    <Card className="bg-violet-500/5 border-violet-200 dark:border-violet-800">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm">
                            {currentStep + 1}
                          </div>
                          {selectedQuestion.steps[currentStep].title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-base">{selectedQuestion.steps[currentStep].explanation}</div>
                      </CardContent>
                    </Card>
                  ) : (
                    // Final Answer Display
                    <Card className="bg-green-500/5 border-green-200 dark:border-green-800">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                          Final Answer
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-base font-semibold">{selectedQuestion.finalAnswer}</div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                    >
                      ← Previous Step
                    </Button>
                    
                    {currentStep < selectedQuestion.steps.length ? (
                      <Button 
                        className="flex-1 bg-violet-600 hover:bg-violet-700"
                        onClick={() => setCurrentStep(currentStep + 1)}
                      >
                        Next Step →
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setShowSolution(false);
                          setCurrentStep(0);
                        }}
                      >
                        ✓ Understood
                      </Button>
                    )}
                  </div>

                  {/* Optional: All Steps Preview (collapsed) */}
                  <details className="mt-6">
                    <summary className="cursor-pointer text-sm text-violet-600 hover:text-violet-700 font-medium">
                      View All Steps at Once
                    </summary>
                    <div className="space-y-3 mt-4">
                      {selectedQuestion.steps.map((step, index) => (
                        <Card key={index} className="bg-muted/30">
                          <CardHeader className="py-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xs">
                                {index + 1}
                              </div>
                              {step.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-2">
                            <div className="text-sm text-muted-foreground">{step.explanation}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </details>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {filteredQuestions.length === 0 && !selectedQuestion && (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No questions found with selected filters</p>
        </div>
      )}
    </div>
  );
}
