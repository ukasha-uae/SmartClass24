'use client';

import { useState, useEffect } from 'react';
import { Trophy, Heart, MessageSquare, Share2, Award, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  getAllAchievementShares,
  shareAchievement,
  toggleAchievementLike,
  addAchievementComment,

  AchievementShare,
} from '@/lib/social';

export default function AchievementsPage() {
  const [shares, setShares] = useState<AchievementShare[]>([]);
  const [commentContent, setCommentContent] = useState<Record<string, string>>({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const { toast } = useToast();

  // Sample unlocked achievements (in real app, fetch from user progress)
  const unlockedAchievements = [
    { id: 'first-lesson', name: 'First Steps', icon: '🎯', xpReward: 50, description: 'Complete your first lesson' },
    { id: '3-day-streak', name: '3-Day Streak', icon: '🔥', xpReward: 100, description: 'Study for 3 consecutive days' },
    { id: 'quiz-master', name: 'Quiz Master', icon: '⭐', xpReward: 150, description: 'Get 100% on 5 quizzes' },
  ];

  useEffect(() => {
    loadShares();
  }, []);

  const loadShares = () => {
    setShares(getAllAchievementShares());
  };

  const handleShareAchievement = (achievement: any) => {
    if (!shareMessage.trim()) {
      toast({ title: 'Please add a message', variant: 'destructive' });
      return;
    }

    shareAchievement(
      achievement.id,
      achievement.name,
      achievement.icon,
      shareMessage
    );

    setShowShareModal(false);
    setShareMessage('');
    loadShares();
    toast({
      title: 'Achievement shared!',
      description: 'Your classmates can now see your accomplishment',
    });
  };

  const handleLike = (shareId: string) => {
    toggleAchievementLike(shareId);
    loadShares();
  };

  const handleComment = (shareId: string) => {
    const content = commentContent[shareId]?.trim();
    if (!content) return;

    addAchievementComment(shareId, content);
    setCommentContent({ ...commentContent, [shareId]: '' });
    loadShares();
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
          <Trophy className="h-10 w-10 text-yellow-500" />
          Achievement Feed
        </h1>
        <p className="text-lg text-muted-foreground">
          Celebrate your progress with classmates
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{shares.length}</p>
                <p className="text-sm text-muted-foreground">Shared Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">
                  {shares.reduce((sum, s) => sum + s.likes.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Likes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {shares.reduce((sum, s) => sum + s.comments.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Comments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Feed */}
        <div className="lg:col-span-2 space-y-4">
          {shares.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No achievements shared yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to share your accomplishments!
                </p>
                <Button onClick={() => setShowShareModal(true)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Achievement
                </Button>
              </CardContent>
            </Card>
          ) : (
            shares.map(share => (
              <Card key={share.id} className="overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{share.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{share.userName}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatTime(share.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">unlocked an achievement</p>
                    </div>
                  </div>

                  {/* Achievement Card */}
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 p-6 rounded-lg border-2 border-yellow-300 dark:border-yellow-800">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-5xl">{share.achievementIcon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{share.achievementName}</h3>
                        <Badge variant="secondary" className="bg-yellow-200 dark:bg-yellow-900">
                          <Award className="h-3 w-3 mr-1" />
                          Achievement Unlocked
                        </Badge>
                      </div>
                    </div>
                    {share.message && (
                      <p className="text-muted-foreground italic">&ldquo;{share.message}&rdquo;</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(share.id)}
                      className="flex items-center gap-2"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          share.likes.includes('user-1')
                            ? 'fill-red-500 text-red-500'
                            : ''
                        }`}
                      />
                      <span>{share.likes.length}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>{share.comments.length}</span>
                    </Button>
                  </div>

                  {/* Comments */}
                  {share.comments.length > 0 && (
                    <div className="space-y-3 pt-3 border-t">
                      {share.comments.map(comment => (
                        <div key={comment.id} className="flex gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {comment.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-muted/50 rounded-lg p-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold">{comment.userName}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">S</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentContent[share.id] || ''}
                        onChange={e =>
                          setCommentContent({ ...commentContent, [share.id]: e.target.value })
                        }
                        onKeyPress={e => e.key === 'Enter' && handleComment(share.id)}
                        className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleComment(share.id)}
                        disabled={!commentContent[share.id]?.trim()}
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {unlockedAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{achievement.name}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.xpReward} XP</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowShareModal(true)}
                    className="flex-shrink-0"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Top Achievers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Alice Chen', achievements: 12 },
                { name: 'Bob Smith', achievements: 10 },
                { name: 'Carol Lee', achievements: 9 },
              ].map((user, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.achievements} achievements
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-lg my-8">
            <CardHeader>
              <CardTitle>Share Achievement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Select an achievement to share:</p>
                <div className="grid gap-2">
                  {unlockedAchievements.map(achievement => (
                    <button
                      key={achievement.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent text-left transition-colors"
                    >
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Add a message (optional)</label>
                <Textarea
                  placeholder="Share how you feel about this achievement..."
                  value={shareMessage}
                  onChange={e => setShareMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleShareAchievement(unlockedAchievements[0])}
                  className="flex-1"
                >
                  Share
                </Button>
                <Button
                  onClick={() => {
                    setShowShareModal(false);
                    setShareMessage('');
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
    </div>
  );
}
