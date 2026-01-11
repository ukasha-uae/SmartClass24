'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, Plus, Search, ThumbsUp, MessageSquare, CheckCircle2, Eye, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import {
  getAllQuestions,
  createQuestion,
  addAnswer,
  markBestAnswer,
  toggleQuestionLike,
  incrementQuestionViews,

  Question,
} from '@/lib/social';
import { getAvailableSubjects } from '@/lib/challenge-questions-exports';
import type { EducationLevel } from '@/lib/challenge-questions-exports';

export default function CommunityPage() {
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('JHS');
  
  // Load education level from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLevel = localStorage.getItem('userEducationLevel') as EducationLevel | null;
      if (savedLevel) {
        setEducationLevel(savedLevel);
      }
    }
  }, []);
  
  // Get available subjects dynamically based on education level
  const SUBJECTS = getAvailableSubjects(educationLevel).filter(s => s !== 'Mixed');
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'open' | 'answered'>('all');
  const [showAskModal, setShowAskModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answerContent, setAnswerContent] = useState('');
  const { toast } = useToast();

  const [newQuestion, setNewQuestion] = useState({
    subject: '',
    title: '',
    content: '',
    tags: [] as string[],
    tagInput: '',
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, selectedSubject, selectedFilter]);

  const loadQuestions = () => {
    setQuestions(getAllQuestions());
  };

  const filterQuestions = () => {
    let filtered = questions;

    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        q =>
          q.title.toLowerCase().includes(search) ||
          q.content.toLowerCase().includes(search) ||
          q.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Filter by subject
    if (selectedSubject) {
      filtered = filtered.filter(q => q.subject === selectedSubject);
    }

    // Filter by status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(q => q.status === selectedFilter);
    }

    setFilteredQuestions(filtered);
  };

  const handleAskQuestion = () => {
    if (!newQuestion.subject || !newQuestion.title.trim() || !newQuestion.content.trim()) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    createQuestion({
      subject: newQuestion.subject,
      title: newQuestion.title,
      content: newQuestion.content,
      tags: newQuestion.tags,
    });

    setShowAskModal(false);
    setNewQuestion({ subject: '', title: '', content: '', tags: [], tagInput: '' });
    loadQuestions();
    toast({ title: 'Question posted!', description: 'Your classmates can now help you' });
  };

  const handleAddTag = () => {
    if (newQuestion.tagInput.trim() && !newQuestion.tags.includes(newQuestion.tagInput.trim())) {
      setNewQuestion({
        ...newQuestion,
        tags: [...newQuestion.tags, newQuestion.tagInput.trim()],
        tagInput: '',
      });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewQuestion({
      ...newQuestion,
      tags: newQuestion.tags.filter(t => t !== tag),
    });
  };

  const handleSubmitAnswer = () => {
    if (!answerContent.trim() || !selectedQuestion) return;

    addAnswer(selectedQuestion.id, answerContent);
    setAnswerContent('');
    setSelectedQuestion(null);
    loadQuestions();
    toast({ title: 'Answer posted!', description: 'Thanks for helping a classmate' });
  };

  const handleLike = (questionId: string) => {
    toggleQuestionLike(questionId);
    loadQuestions();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 pb-20">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-4xl font-bold font-headline mb-2 flex items-center gap-3">
          <HelpCircle className="h-10 w-10 text-primary" />
          Community Q&A
        </h1>
        <p className="text-lg text-muted-foreground">
          Ask questions and help your classmates
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{questions.length}</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {questions.filter(q => q.status === 'answered').length}
                </p>
                <p className="text-sm text-muted-foreground">Answered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {questions.reduce((sum, q) => sum + q.views, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {questions.reduce((sum, q) => sum + q.answers.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Answers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Filters Sidebar */}
        <div className="space-y-4 hidden lg:block">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Questions' },
                    { value: 'open', label: 'Open' },
                    { value: 'answered', label: 'Answered' },
                  ].map(filter => (
                    <Button
                      key={filter.value}
                      variant={selectedFilter === filter.value ? 'default' : 'outline'}
                      className="w-full justify-start"
                      size="sm"
                      onClick={() => setSelectedFilter(filter.value as any)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subjects</Label>
                <div className="space-y-2">
                  <Button
                    variant={!selectedSubject ? 'default' : 'outline'}
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => setSelectedSubject('')}
                  >
                    All Subjects
                  </Button>
                  {SUBJECTS.map(subject => (
                    <Button
                      key={subject}
                      variant={selectedSubject === subject ? 'default' : 'outline'}
                      className="w-full justify-start"
                      size="sm"
                      onClick={() => setSelectedSubject(subject)}
                    >
                      {subject}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions List */}
        <div className="lg:col-span-3 space-y-4">
          {/* Mobile Filters */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'open', label: 'Open' },
              { value: 'answered', label: 'Answered' },
            ].map(filter => (
              <Button
                key={filter.value}
                variant={selectedFilter === filter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter.value as any)}
                className="whitespace-nowrap"
              >
                {filter.label}
              </Button>
            ))}
            {SUBJECTS.map(subject => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSubject(selectedSubject === subject ? '' : subject)}
                className="whitespace-nowrap"
              >
                {subject}
              </Button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => setShowAskModal(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Ask Question
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Questions */}
          {filteredQuestions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No questions found. Be the first to ask!</p>
              </CardContent>
            </Card>
          ) : (
            filteredQuestions.map(question => (
              <Card key={question.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Stats Column */}
                    <div className="flex flex-col items-center gap-2 text-center min-w-[60px]">
                      <div className="text-sm text-muted-foreground">
                        <ThumbsUp className="h-4 w-4 mx-auto mb-1" />
                        {question.likes.length}
                      </div>
                      <div className={`text-sm font-semibold ${question.bestAnswerId ? 'text-green-500' : 'text-muted-foreground'}`}>
                        <MessageSquare className="h-4 w-4 mx-auto mb-1" />
                        {question.answers.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <Eye className="h-4 w-4 mx-auto mb-1" />
                        {question.views}
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{question.title}</h3>
                          <p className="text-muted-foreground line-clamp-2 mb-3">
                            {question.content}
                          </p>
                        </div>
                        {question.bestAnswerId && (
                          <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 ml-2" />
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">{question.subject}</Badge>
                        {question.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {question.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{question.userName}</span>
                          <span>•</span>
                          <span>{formatTime(question.createdAt)}</span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(question.id)}
                          >
                            <ThumbsUp className={`h-4 w-4 mr-1 ${question.likes.includes('user-1') ? 'fill-current' : ''}`} />
                            Like
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              incrementQuestionViews(question.id);
                              setSelectedQuestion(question);
                            }}
                          >
                            Answer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>Get help from your classmates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <select
                  id="subject"
                  value={newQuestion.subject}
                  onChange={e => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="">Select a subject</option>
                  {SUBJECTS.map(subject => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Question Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., How do I solve quadratic equations?"
                  value={newQuestion.title}
                  onChange={e => setNewQuestion({ ...newQuestion, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Question Details *</Label>
                <Textarea
                  id="content"
                  placeholder="Provide more details about your question..."
                  value={newQuestion.content}
                  onChange={e => setNewQuestion({ ...newQuestion, content: e.target.value })}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Add a tag..."
                    value={newQuestion.tagInput}
                    onChange={e => setNewQuestion({ ...newQuestion, tagInput: e.target.value })}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                {newQuestion.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newQuestion.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAskQuestion} className="flex-1">
                  Post Question
                </Button>
                <Button
                  onClick={() => {
                    setShowAskModal(false);
                    setNewQuestion({ subject: '', title: '', content: '', tags: [], tagInput: '' });
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Answer Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-3xl my-8 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{selectedQuestion.title}</CardTitle>
              <CardDescription>Posted by {selectedQuestion.userName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="whitespace-pre-wrap">{selectedQuestion.content}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedQuestion.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Existing Answers */}
              {selectedQuestion.answers.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Answers ({selectedQuestion.answers.length})</h3>
                  {selectedQuestion.answers.map(answer => (
                    <div
                      key={answer.id}
                      className={`p-4 rounded-lg border-2 ${
                        answer.isBestAnswer
                          ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {answer.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-sm">{answer.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(answer.createdAt)}
                          </span>
                        </div>
                        {answer.isBestAnswer && (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Best Answer
                          </Badge>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap">{answer.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Answer */}
              <div className="space-y-3">
                <Label htmlFor="answer">Your Answer</Label>
                <Textarea
                  id="answer"
                  placeholder="Share your knowledge..."
                  value={answerContent}
                  onChange={e => setAnswerContent(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmitAnswer} disabled={!answerContent.trim()} className="flex-1">
                  Post Answer
                </Button>
                <Button
                  onClick={() => {
                    setSelectedQuestion(null);
                    setAnswerContent('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
