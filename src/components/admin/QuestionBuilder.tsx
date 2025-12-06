'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import MediaUploader from './MediaUploader';
import type { Quiz, Media } from '@/lib/types';

type QuestionBuilderProps = {
  questions: Quiz[];
  onChange: (questions: Quiz[]) => void;
};

export default function QuestionBuilder({ questions, onChange }: QuestionBuilderProps) {
  const addQuestion = (type: Quiz['type']) => {
    let newQuestion: Quiz;
    
    switch (type) {
      case 'mcq':
        newQuestion = {
          type: 'mcq',
          question: '',
          options: ['', '', '', ''],
          answer: '',
          explanation: ''
        };
        break;
      case 'truefalse':
        newQuestion = {
          type: 'truefalse',
          statement: '',
          answer: 'true'
        };
        break;
      case 'multiple_select':
        newQuestion = {
          type: 'multiple_select',
          question: '',
          options: ['', '', '', ''],
          answers: [],
          explanation: ''
        };
        break;
      case 'fillblank':
        newQuestion = {
          type: 'fillblank',
          sentence: 'The _____ is',
          answer: '',
          alternatives: [],
          explanation: ''
        };
        break;
      case 'matching':
        newQuestion = {
          type: 'matching',
          question: '',
          pairs: [
            { left: '', right: '' },
            { left: '', right: '' }
          ],
          explanation: ''
        };
        break;
      case 'ordering':
        newQuestion = {
          type: 'ordering',
          items: ['', ''],
          correctOrder: [0, 1]
        };
        break;
      default:
        return;
    }
    
    onChange([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<Quiz>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates } as Quiz;
    onChange(updated);
  };

  const deleteQuestion = (index: number) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === questions.length - 1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...questions];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Questions ({questions.length})
        </h3>
        <Select onValueChange={(value) => addQuestion(value as Quiz['type'])}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Add Question" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mcq">Multiple Choice</SelectItem>
            <SelectItem value="truefalse">True/False</SelectItem>
            <SelectItem value="multiple_select">Multiple Select</SelectItem>
            <SelectItem value="fillblank">Fill in the Blank</SelectItem>
            <SelectItem value="matching">Matching</SelectItem>
            <SelectItem value="ordering">Ordering</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {questions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No questions yet</p>
            <p className="text-sm text-muted-foreground">
              Click "Add Question" above to get started
            </p>
          </CardContent>
        </Card>
      )}

      {questions.map((question, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                <CardTitle className="text-sm font-medium">
                  Question {index + 1} - {question.type.toUpperCase().replace('_', ' ')}
                </CardTitle>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveQuestion(index, 'up')}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveQuestion(index, 'down')}
                  disabled={index === questions.length - 1}
                >
                  ↓
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteQuestion(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Question Text - for types that have it */}
            {'question' in question && (
              <div>
                <Label>Question Text</Label>
                <Textarea
                  value={question.question || ''}
                  onChange={(e) => updateQuestion(index, { question: e.target.value } as any)}
                  placeholder="Enter your question here..."
                  rows={2}
                />
              </div>
            )}

            {/* MCQ Options */}
            {question.type === 'mcq' && (
              <>
                <div className="space-y-2">
                  <Label>Options</Label>
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...question.options];
                          newOptions[optIndex] = e.target.value;
                          updateQuestion(index, { options: newOptions });
                        }}
                        placeholder={`Option ${optIndex + 1}`}
                      />
                      {question.options.length > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newOptions = question.options.filter((_, i) => i !== optIndex);
                            updateQuestion(index, { options: newOptions });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateQuestion(index, { options: [...question.options, ''] });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
                <div>
                  <Label>Correct Answer</Label>
                  <Select
                    value={question.answer}
                    onValueChange={(value) => updateQuestion(index, { answer: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((option, i) => (
                        <SelectItem key={i} value={option}>
                          {option || `Option ${i + 1} (empty)`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* True/False */}
            {question.type === 'truefalse' && (
              <>
                <div>
                  <Label>Statement</Label>
                  <Textarea
                    value={question.statement || ''}
                    onChange={(e) => updateQuestion(index, { statement: e.target.value })}
                    placeholder="Enter the statement to evaluate as true or false..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Correct Answer</Label>
                  <Select
                    value={question.answer}
                    onValueChange={(value) => updateQuestion(index, { answer: value as 'true' | 'false' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Multiple Select */}
            {question.type === 'multiple_select' && (
              <>
                <div className="space-y-2">
                  <Label>Options</Label>
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        checked={question.answers?.includes(option)}
                        onChange={(e) => {
                          const newAnswers = e.target.checked
                            ? [...(question.answers || []), option]
                            : (question.answers || []).filter(a => a !== option);
                          updateQuestion(index, { answers: newAnswers });
                        }}
                        className="rounded"
                      />
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...question.options];
                          const oldValue = newOptions[optIndex];
                          newOptions[optIndex] = e.target.value;
                          // Update answers if this option was selected
                          const newAnswers = (question.answers || []).map(a => 
                            a === oldValue ? e.target.value : a
                          );
                          updateQuestion(index, { options: newOptions, answers: newAnswers });
                        }}
                        placeholder={`Option ${optIndex + 1}`}
                      />
                      {question.options.length > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newOptions = question.options.filter((_, i) => i !== optIndex);
                            const newAnswers = (question.answers || []).filter(a => a !== option);
                            updateQuestion(index, { options: newOptions, answers: newAnswers });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateQuestion(index, { options: [...question.options, ''] });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </>
            )}

            {/* Fill in the Blank */}
            {question.type === 'fillblank' && (
              <>
                <div>
                  <Label>Sentence (use _____ for blank)</Label>
                  <Textarea
                    value={question.sentence}
                    onChange={(e) => updateQuestion(index, { sentence: e.target.value })}
                    placeholder="The _____ is the capital of Ghana."
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Correct Answer</Label>
                  <Input
                    value={question.answer}
                    onChange={(e) => updateQuestion(index, { answer: e.target.value })}
                    placeholder="Accra"
                  />
                </div>
                <div>
                  <Label>Alternative Answers (optional, comma separated)</Label>
                  <Input
                    value={(question.alternatives || []).join(', ')}
                    onChange={(e) => {
                      const alternatives = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      updateQuestion(index, { alternatives });
                    }}
                    placeholder="accra, ACCRA"
                  />
                </div>
              </>
            )}

            {/* Matching */}
            {question.type === 'matching' && (
              <div className="space-y-2">
                <Label>Pairs to Match</Label>
                {question.pairs.map((pair, pairIndex) => (
                  <div key={pairIndex} className="flex gap-2">
                    <Input
                      value={pair.left}
                      onChange={(e) => {
                        const newPairs = [...question.pairs];
                        newPairs[pairIndex].left = e.target.value;
                        updateQuestion(index, { pairs: newPairs });
                      }}
                      placeholder="Left item"
                    />
                    <span className="flex items-center">→</span>
                    <Input
                      value={pair.right}
                      onChange={(e) => {
                        const newPairs = [...question.pairs];
                        newPairs[pairIndex].right = e.target.value;
                        updateQuestion(index, { pairs: newPairs });
                      }}
                      placeholder="Right item"
                    />
                    {question.pairs.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newPairs = question.pairs.filter((_, i) => i !== pairIndex);
                          updateQuestion(index, { pairs: newPairs });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateQuestion(index, { pairs: [...question.pairs, { left: '', right: '' }] });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Pair
                </Button>
              </div>
            )}

            {/* Ordering */}
            {question.type === 'ordering' && (
              <div className="space-y-2">
                <Label>Items to Order (in correct order)</Label>
                {question.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-2">
                    <span className="flex items-center text-sm text-muted-foreground w-6">
                      {itemIndex + 1}.
                    </span>
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newItems = [...question.items];
                        newItems[itemIndex] = e.target.value;
                        updateQuestion(index, { items: newItems });
                      }}
                      placeholder={`Item ${itemIndex + 1}`}
                    />
                    {question.items.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newItems = question.items.filter((_, i) => i !== itemIndex);
                          updateQuestion(index, { items: newItems });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateQuestion(index, { items: [...question.items, ''] });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            )}

            {/* Explanation - for all types */}
            {'explanation' in question && (
              <div>
                <Label>Explanation (optional)</Label>
                <Textarea
                  value={question.explanation || ''}
                  onChange={(e) => updateQuestion(index, { explanation: e.target.value } as any)}
                  placeholder="Explain why this is the correct answer..."
                  rows={2}
                />
              </div>
            )}

            {/* Media Support - for all types */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="media" className="border-none">
                <AccordionTrigger className="text-sm py-2">
                  Add Media to Question (optional)
                </AccordionTrigger>
                <AccordionContent>
                  <MediaUploader
                    media={(question as any).media}
                    onChange={(media) => updateQuestion(index, { media } as any)}
                    label="Question Media"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
