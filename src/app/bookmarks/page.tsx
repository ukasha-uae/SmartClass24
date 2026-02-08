'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, BookmarkCheck, Trash2, ArrowRight, BookOpen, Layers, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getBookmarks, removeBookmark, LessonBookmark } from '@/lib/lesson-tools';
import { useToast } from '@/hooks/use-toast';
import { useTenantLink } from '@/hooks/useTenantLink';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<LessonBookmark[]>([]);
  const { toast } = useToast();
  const addTenantParam = useTenantLink();

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const handleRemoveBookmark = (lessonId: string) => {
    removeBookmark(lessonId);
    setBookmarks(getBookmarks());
    toast({ title: 'Bookmark removed' });
  };

  const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
    if (!acc[bookmark.subject]) {
      acc[bookmark.subject] = [];
    }
    acc[bookmark.subject].push(bookmark);
    return acc;
  }, {} as Record<string, LessonBookmark[]>);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline mb-2 flex items-center gap-3">
          <BookmarkCheck className="h-10 w-10 text-primary" />
          My Bookmarks
        </h1>
        <p className="text-lg text-muted-foreground">
          Quick access to your saved lessons
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bookmark className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Bookmark your favorite lessons to access them quickly here
            </p>
            <Button asChild>
              <Link href={addTenantParam('/subjects')}>
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Subjects
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <BookmarkCheck className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-3xl font-bold">{bookmarks.length}</p>
                    <p className="text-sm text-muted-foreground">Total Bookmarks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary/5 border-secondary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Layers className="h-8 w-8 text-secondary" />
                  <div>
                    <p className="text-3xl font-bold">{Object.keys(groupedBookmarks).length}</p>
                    <p className="text-sm text-muted-foreground">Subjects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-accent-foreground" />
                  <div>
                    <p className="text-3xl font-bold">
                      {bookmarks.filter(b => 
                        new Date(b.bookmarkedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                      ).length}
                    </p>
                    <p className="text-sm text-muted-foreground">This Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {Object.entries(groupedBookmarks).map(([subject, subjectBookmarks]) => (
              <div key={subject}>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  {subject}
                  <Badge variant="secondary">{subjectBookmarks.length}</Badge>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjectBookmarks.map((bookmark) => (
                    <Card key={bookmark.lessonId} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">
                              {bookmark.lessonTitle}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {bookmark.topic}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                              </span>
                            </CardDescription>
                          </div>
                          <BookmarkCheck className="h-5 w-5 text-primary flex-shrink-0" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button asChild className="flex-1">
                            <Link href={bookmark.href}>
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Continue Learning
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveBookmark(bookmark.lessonId)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
