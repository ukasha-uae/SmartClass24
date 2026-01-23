'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { QuestionUsageEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, TrendingUp, Users, BookOpen, Target, Calendar, RefreshCw } from 'lucide-react';

interface AnalyticsData {
  totalEvents: number;
  subjectPopularity: { subject: string; count: number }[];
  levelDistribution: { level: string; count: number }[];
  topTopics: { topic: string; count: number }[];
  difficultyDistribution: { difficulty: string; count: number }[];
  dailyUsage: { date: string; count: number }[];
  uniqueUsers: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, firestore } = useFirebase();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'all'>('7d');

  const loadAnalytics = async () => {
    if (!firestore) {
      setError('Firebase not initialized');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get analytics data from Firestore
      const analyticsRef = collection(firestore, 'subjects', '__analytics', 'questionUsage');
      
      // Calculate date filter
      let q = query(analyticsRef, orderBy('timestamp', 'desc'), limit(1000));
      
      if (dateRange !== 'all') {
        const days = dateRange === '7d' ? 7 : 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        q = query(
          analyticsRef,
          where('timestamp', '>=', startDate.getTime()),
          orderBy('timestamp', 'desc'),
          limit(1000)
        );
      }

      const snapshot = await getDocs(q);
      const events: QuestionUsageEvent[] = [];

      snapshot.forEach((doc) => {
        events.push(doc.data() as QuestionUsageEvent);
      });

      // Process analytics data
      const subjectMap = new Map<string, number>();
      const levelMap = new Map<string, number>();
      const topicMap = new Map<string, number>();
      const difficultyMap = new Map<string, number>();
      const dailyMap = new Map<string, number>();
      const userSet = new Set<string>();

      events.forEach((event) => {
        // Subject popularity
        const subject = event.subject || 'Unknown';
        subjectMap.set(subject, (subjectMap.get(subject) || 0) + event.questionCount);

        // Level distribution
        const level = event.level || 'Unknown';
        levelMap.set(level, (levelMap.get(level) || 0) + event.questionCount);

        // Topics
        event.topics?.forEach((topic) => {
          topicMap.set(topic, (topicMap.get(topic) || 0) + 1);
        });

        // Difficulty
        const difficulty = event.difficulty || 'Unknown';
        difficultyMap.set(difficulty, (difficultyMap.get(difficulty) || 0) + event.questionCount);

        // Daily usage
        const date = new Date(event.timestamp).toISOString().split('T')[0];
        dailyMap.set(date, (dailyMap.get(date) || 0) + 1);

        // Unique users
        if (event.userId) {
          userSet.add(event.userId);
        }
      });

      // Convert to arrays and sort
      const subjectPopularity = Array.from(subjectMap.entries())
        .map(([subject, count]) => ({ subject, count }))
        .sort((a, b) => b.count - a.count);

      const levelDistribution = Array.from(levelMap.entries())
        .map(([level, count]) => ({ level, count }))
        .sort((a, b) => b.count - a.count);

      const topTopics = Array.from(topicMap.entries())
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15); // Top 15 topics

      const difficultyDistribution = Array.from(difficultyMap.entries())
        .map(([difficulty, count]) => ({ difficulty, count }))
        .sort((a, b) => b.count - a.count);

      const dailyUsage = Array.from(dailyMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setAnalytics({
        totalEvents: events.length,
        subjectPopularity,
        levelDistribution,
        topTopics,
        difficultyDistribution,
        dailyUsage,
        uniqueUsers: userSet.size,
      });
    } catch (err: any) {
      console.error('Analytics load error:', err);
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/admin/dashboard');
      return;
    }
    loadAnalytics();
  }, [user, dateRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
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
                Understand what users do on the app to prioritize upgrades
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | 'all')}
              className="px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-sm"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
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
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400 text-sm">
              ⚠️ {error}
            </p>
          </div>
        )}

        {!analytics && !error && (
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

              <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
                    <Target className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Top Level</h3>
                </div>
                <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
                  {analytics.levelDistribution[0]?.level || 'N/A'}
                </p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Popularity */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-violet-600" />
                  Subject Popularity
                </h2>
                <div className="space-y-3">
                  {analytics.subjectPopularity.slice(0, 8).map((item, index) => {
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

              {/* Level Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  Level Distribution
                </h2>
                <div className="space-y-3">
                  {analytics.levelDistribution.map((item) => {
                    const maxCount = analytics.levelDistribution[0]?.count || 1;
                    const percentage = (item.count / maxCount) * 100;
                    return (
                      <div key={item.level} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.level}</span>
                          <span className="text-muted-foreground">{item.count} questions</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Topics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Top 15 Topics (Most Used)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analytics.topTopics.map((item, index) => (
                  <div
                    key={item.topic}
                    className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg border"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium flex-1">{item.topic}</span>
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                        {item.count}x
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Usage Trend */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-600" />
                Daily Usage Trend
              </h2>
              <div className="space-y-2">
                {analytics.dailyUsage.slice(-14).map((item) => {
                  const maxCount = Math.max(...analytics.dailyUsage.map((d) => d.count));
                  const percentage = (item.count / maxCount) * 100;
                  const date = new Date(item.date);
                  const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                  return (
                    <div key={item.date} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{formattedDate}</span>
                        <span className="text-muted-foreground">{item.count} challenges</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Insights & Recommendations */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 rounded-lg border border-violet-200 dark:border-violet-800 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-600" />
                📈 Insights & Recommendations
              </h2>
              <div className="space-y-3 text-sm">
                {analytics.subjectPopularity[0] && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg">🔥</span>
                    <p>
                      <strong>{analytics.subjectPopularity[0].subject}</strong> is the most popular subject with{' '}
                      <strong>{analytics.subjectPopularity[0].count} questions used</strong>. Consider adding more
                      content here.
                    </p>
                  </div>
                )}
                {analytics.subjectPopularity[analytics.subjectPopularity.length - 1] && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg">⚠️</span>
                    <p>
                      <strong>
                        {analytics.subjectPopularity[analytics.subjectPopularity.length - 1].subject}
                      </strong>{' '}
                      has the lowest usage. Consider promoting it or improving its content quality.
                    </p>
                  </div>
                )}
                {analytics.uniqueUsers > 0 && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg">👥</span>
                    <p>
                      <strong>{analytics.uniqueUsers} unique users</strong> have played challenges. Average of{' '}
                      <strong>{(analytics.totalEvents / analytics.uniqueUsers).toFixed(1)} challenges per user</strong>
                      .
                    </p>
                  </div>
                )}
                {analytics.topTopics[0] && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg">🎯</span>
                    <p>
                      Most popular topic: <strong>{analytics.topTopics[0].topic}</strong> ({analytics.topTopics[0].count}
                      x). Focus quality improvements here for maximum impact.
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
