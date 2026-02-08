'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { QuestionUsageEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, TrendingUp, Users, BookOpen, Target, Calendar, RefreshCw } from 'lucide-react';
import { useTenantLink } from '@/hooks/useTenantLink';

interface AnalyticsData {
  totalEvents: number;
  subjectPopularity: { subject: string; count: number }[];
  levelDistribution: { level: string; count: number }[];
  topTopics: { topic: string; count: number }[];
  dailyUsage: { date: string; count: number }[];
  uniqueUsers: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, firestore } = useFirebase();
  const addTenantParam = useTenantLink();
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'all'>('all');

  const loadAnalytics = useCallback(async () => {
    if (!firestore || !user) {
      console.log('[Analytics] Waiting for Firebase/User...');
      return;
    }

    console.log('[Analytics] Loading analytics data...');
    setLoading(true);
    setError(null);

    try {
      const analyticsRef = collection(firestore, 'subjects', '__analytics', 'questionUsage');
      let q = query(analyticsRef, orderBy('timestamp', 'desc'), limit(500));

      const snapshot = await getDocs(q);
      const events: QuestionUsageEvent[] = [];

      snapshot.forEach((doc) => {
        events.push(doc.data() as QuestionUsageEvent);
      });

      console.log(`[Analytics] Loaded ${events.length} events`);

      // Process analytics data
      const subjectMap = new Map<string, number>();
      const levelMap = new Map<string, number>();
      const topicMap = new Map<string, number>();
      const dailyMap = new Map<string, number>();
      const userSet = new Set<string>();

      events.forEach((event) => {
        subjectMap.set(event.subject || 'Unknown', (subjectMap.get(event.subject || 'Unknown') || 0) + event.questionCount);
        levelMap.set(event.level || 'Unknown', (levelMap.get(event.level || 'Unknown') || 0) + event.questionCount);
        event.topics?.forEach((topic) => {
          topicMap.set(topic, (topicMap.get(topic) || 0) + 1);
        });
        const date = new Date(event.timestamp).toISOString().split('T')[0];
        dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
        if (event.userId) userSet.add(event.userId);
      });

      setAnalytics({
        totalEvents: events.length,
        subjectPopularity: Array.from(subjectMap.entries())
          .map(([subject, count]) => ({ subject, count }))
          .sort((a, b) => b.count - a.count),
        levelDistribution: Array.from(levelMap.entries())
          .map(([level, count]) => ({ level, count }))
          .sort((a, b) => b.count - a.count),
        topTopics: Array.from(topicMap.entries())
          .map(([topic, count]) => ({ topic, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 15),
        dailyUsage: Array.from(dailyMap.entries())
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date)),
        uniqueUsers: userSet.size,
      });
    } catch (err: any) {
      console.error('[Analytics] Load error:', err);
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [firestore, user]);

  useEffect(() => {
    if (user && firestore) {
      loadAnalytics();
    }
  }, [user, firestore, loadAnalytics]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
          <p className="text-muted-foreground mb-4">Please sign in to view analytics</p>
          <Button onClick={() => router.push(addTenantParam('/profile'))}>Sign In</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/admin/dashboard')}
              className="hover:bg-violet-100 dark:hover:bg-violet-900/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                📊 Usage Analytics
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Understand what users do on the app
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadAnalytics}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400 text-sm">⚠️ {error}</p>
          </div>
        )}

        {!analytics && !error && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-8 text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No analytics data available yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Data will appear here once users start playing challenges and quizzes.
            </p>
          </div>
        )}

        {analytics && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/20 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Total Events</h3>
                </div>
                <p className="text-3xl font-black text-violet-600 dark:text-violet-400">
                  {analytics.totalEvents.toLocaleString()}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                    <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Unique Users</h3>
                </div>
                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {analytics.uniqueUsers.toLocaleString()}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Top Subject</h3>
                </div>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400 truncate">
                  {analytics.subjectPopularity[0]?.subject || 'N/A'}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Popularity */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-violet-600" />
                  Subject Popularity
                </h2>
                <div className="space-y-3">
                  {analytics.subjectPopularity.slice(0, 8).map((item) => {
                    const maxCount = analytics.subjectPopularity[0]?.count || 1;
                    const percentage = (item.count / maxCount) * 100;
                    return (
                      <div key={item.subject} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.subject}</span>
                          <span className="text-muted-foreground">{item.count} questions</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Topics */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Top Topics
                </h2>
                <div className="grid grid-cols-1 gap-2">
                  {analytics.topTopics.slice(0, 10).map((item, index) => (
                    <div
                      key={item.topic}
                      className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg border flex items-center justify-between"
                    >
                      <span className="text-sm font-medium truncate flex-1">{item.topic}</span>
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800 px-2 py-1 rounded ml-2">
                        {item.count}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 rounded-lg border border-violet-200 dark:border-violet-800 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-600" />
                📈 Key Insights
              </h2>
              <div className="space-y-3 text-sm">
                {analytics.subjectPopularity[0] && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg">🔥</span>
                    <p>
                      <strong>{analytics.subjectPopularity[0].subject}</strong> is the most popular with{' '}
                      <strong>{analytics.subjectPopularity[0].count} questions used</strong>. Consider adding more content.
                    </p>
                  </div>
                )}
                {analytics.uniqueUsers > 0 && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg">👥</span>
                    <p>
                      <strong>{analytics.uniqueUsers} unique users</strong> active. Average of{' '}
                      <strong>{(analytics.totalEvents / analytics.uniqueUsers).toFixed(1)} challenges per user</strong>.
                    </p>
                  </div>
                )}
                {analytics.topTopics[0] && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg">🎯</span>
                    <p>
                      Most popular topic: <strong>{analytics.topTopics[0].topic}</strong> ({analytics.topTopics[0].count}x).
                      Focus quality improvements here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
