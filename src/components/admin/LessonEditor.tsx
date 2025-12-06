'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import MediaUploader from './MediaUploader';
import type { Lesson, Media } from '@/lib/types';

type LessonEditorProps = {
  lesson: Partial<Lesson>;
  onChange: (lesson: Partial<Lesson>) => void;
};

export default function LessonEditor({ lesson, onChange }: LessonEditorProps) {
  const updateField = (field: keyof Lesson, value: any) => {
    onChange({ ...lesson, [field]: value });
  };

  const addObjective = () => {
    const objectives = lesson.objectives || [];
    updateField('objectives', [...objectives, '']);
  };

  const updateObjective = (index: number, value: string) => {
    const objectives = [...(lesson.objectives || [])];
    objectives[index] = value;
    updateField('objectives', objectives);
  };

  const deleteObjective = (index: number) => {
    const objectives = (lesson.objectives || []).filter((_, i) => i !== index);
    updateField('objectives', objectives);
  };

  const addKeyConcept = () => {
    const concepts = lesson.keyConcepts || [];
    updateField('keyConcepts', [...concepts, { title: '', content: '' }]);
  };

  const updateKeyConcept = (index: number, field: 'title' | 'content', value: string) => {
    const concepts = [...(lesson.keyConcepts || [])];
    concepts[index] = { ...concepts[index], [field]: value };
    updateField('keyConcepts', concepts);
  };

  const deleteKeyConcept = (index: number) => {
    const concepts = (lesson.keyConcepts || []).filter((_, i) => i !== index);
    updateField('keyConcepts', concepts);
  };

  const addPastQuestion = () => {
    const pastQuestions = lesson.pastQuestions || [];
    updateField('pastQuestions', [...pastQuestions, { question: '', solution: '' }]);
  };

  const updatePastQuestion = (index: number, field: 'question' | 'solution', value: string) => {
    const pastQuestions = [...(lesson.pastQuestions || [])];
    pastQuestions[index] = { ...pastQuestions[index], [field]: value };
    updateField('pastQuestions', pastQuestions);
  };

  const deletePastQuestion = (index: number) => {
    const pastQuestions = (lesson.pastQuestions || []).filter((_, i) => i !== index);
    updateField('pastQuestions', pastQuestions);
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Lesson ID *</Label>
              <Input
                value={lesson.id || ''}
                onChange={(e) => updateField('id', e.target.value)}
                placeholder="eng104-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Format: eng104-1 (3 letters + 3 digits + dash + number)
              </p>
            </div>
            <div>
              <Label>Slug *</Label>
              <Input
                value={lesson.slug || ''}
                onChange={(e) => updateField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                placeholder="parts-of-speech"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Auto-formatted to lowercase with hyphens
              </p>
            </div>
          </div>
          <div>
            <Label>Title *</Label>
            <Input
              value={lesson.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Parts of Speech"
            />
          </div>
        </CardContent>
      </Card>

      {/* Objectives */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Learning Objectives</CardTitle>
            <Button onClick={addObjective} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Objective
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {(lesson.objectives || []).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No objectives yet. Click "Add Objective" to get started.
            </p>
          ) : (
            (lesson.objectives || []).map((objective, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={objective}
                  onChange={(e) => updateObjective(index, e.target.value)}
                  placeholder={`Objective ${index + 1}`}
                  rows={2}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteObjective(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              value={lesson.introduction || ''}
              onChange={(e) => updateField('introduction', e.target.value)}
              placeholder="Introduce the lesson topic. You can paste content from Word or Google Docs here..."
              rows={6}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Tip: You can paste formatted text from Word/Google Docs directly
            </p>
          </div>
          <div>
            <MediaUploader
              media={lesson.introductionMedia}
              onChange={(media) => updateField('introductionMedia', media)}
              label="Introduction Media (optional)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Key Concepts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Key Concepts</CardTitle>
            <Button onClick={addKeyConcept} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Concept
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(lesson.keyConcepts || []).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No concepts yet. Click "Add Concept" to get started.
            </p>
          ) : (
            (lesson.keyConcepts || []).map((concept, index) => (
              <Card key={index} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Concept {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteKeyConcept(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={concept.title}
                      onChange={(e) => updateKeyConcept(index, 'title', e.target.value)}
                      placeholder="1. What are Parts of Speech?"
                    />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={concept.content}
                      onChange={(e) => updateKeyConcept(index, 'content', e.target.value)}
                      placeholder="Detailed explanation of the concept..."
                      rows={6}
                    />
                  </div>
                  <div>
                    <MediaUploader
                      media={concept.media}
                      onChange={(media) => {
                        const concepts = [...(lesson.keyConcepts || [])];
                        concepts[index] = { ...concepts[index], media };
                        updateField('keyConcepts', concepts);
                      }}
                      label="Concept Media (optional)"
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Past Questions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>BECE Past Questions (Optional)</CardTitle>
            <Button onClick={addPastQuestion} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(lesson.pastQuestions || []).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No past questions yet. Click "Add Question" to get started.
            </p>
          ) : (
            (lesson.pastQuestions || []).map((pq, index) => (
              <Card key={index} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Past Question {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePastQuestion(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Question</Label>
                    <Textarea
                      value={pq.question}
                      onChange={(e) => updatePastQuestion(index, 'question', e.target.value)}
                      placeholder="What is...?"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Solution</Label>
                    <Textarea
                      value={pq.solution || ''}
                      onChange={(e) => updatePastQuestion(index, 'solution', e.target.value)}
                      placeholder="Step-by-step solution..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              value={lesson.summary || ''}
              onChange={(e) => updateField('summary', e.target.value)}
              placeholder="Summarize the key points of the lesson..."
              rows={6}
            />
          </div>
          <div>
            <MediaUploader
              media={lesson.summaryMedia}
              onChange={(media) => updateField('summaryMedia', media)}
              label="Summary Media (optional)"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
