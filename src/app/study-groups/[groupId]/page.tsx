'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Heart, MessageCircle, Trophy, Users, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useTenantLink } from '@/hooks/useTenantLink';
import {
  getAllGroups,
  getGroupPosts,
  createGroupPost,
  togglePostLike,
  addPostReply,
  StudyGroup,
  GroupPost,
} from '@/lib/social';

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params?.groupId as string;
  const addTenantParam = useTenantLink();
  
  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!groupId) return;
    
    const groups = getAllGroups();
    const foundGroup = groups.find(g => g.id === groupId);
    
    if (!foundGroup) {
      router.push('/study-groups');
      return;
    }
    
    setGroup(foundGroup);
    loadPosts();
  }, [groupId]);

  const loadPosts = () => {
    if (!groupId) return;
    setPosts(getGroupPosts(groupId));
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim() || !groupId) return;

    createGroupPost(groupId, {
      content: newPostContent,
      type: 'message',
    });

    setNewPostContent('');
    loadPosts();
    toast({ title: 'Message sent!' });
  };

  const handleLikePost = (postId: string) => {
    if (!groupId) return;
    togglePostLike(groupId, postId);
    loadPosts();
  };

  const handleReply = (postId: string) => {
    if (!replyContent.trim() || !groupId) return;

    addPostReply(groupId, postId, replyContent);
    setReplyContent('');
    setReplyingTo(null);
    loadPosts();
    toast({ title: 'Reply sent!' });
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

  if (!group) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 pb-20">
      <Link
        href={addTenantParam('/study-groups')}
        className="inline-flex items-center text-primary mb-3 sm:mb-4 hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Groups
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Group Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{group.name}</CardTitle>
                  <p className="text-muted-foreground mb-3">{group.description}</p>
                  {group.subject && (
                    <Badge variant="secondary">{group.subject}</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* New Post */}
          <Card>
            <CardContent className="p-4">
              <Textarea
                placeholder="Share with your group..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
                className="mb-3"
              />
              <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Post
              </Button>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          {posts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  {/* Post Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar>
                      <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{post.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(post.createdAt)}
                        </span>
                      </div>
                      {post.type === 'achievement' && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          <Trophy className="h-3 w-3 mr-1" />
                          Achievement Shared
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-3 whitespace-pre-wrap">{post.content}</div>

                  {/* Post Actions */}
                  <div className="flex items-center gap-4 text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikePost(post.id)}
                      className="gap-1"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          post.likes.includes('user-1')
                            ? 'fill-red-500 text-red-500'
                            : ''
                        }`}
                      />
                      {post.likes.length > 0 && post.likes.length}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                      className="gap-1"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {post.replies.length > 0 && post.replies.length}
                    </Button>
                  </div>

                  {/* Replies */}
                  {post.replies.length > 0 && (
                    <div className="mt-4 space-y-3 pl-4 border-l-2 border-muted">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {reply.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">
                                {reply.userName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyingTo === post.id && (
                    <div className="mt-4 flex gap-2">
                      <Input
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleReply(post.id);
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleReply(post.id)}
                        disabled={!replyContent.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-20">
          {/* Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                Members ({group.members.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.members
                .sort((a, b) => b.points - a.points)
                .map((member) => (
                  <div key={member.userId} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {member.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{member.userName}</div>
                        {member.role === 'admin' && (
                          <Badge variant="secondary" className="text-xs">
                            Admin
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Trophy className="h-3 w-3" />
                      {member.points}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Share2 className="h-4 w-4 mr-2" />
                Invite Members
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/community">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ask Questions
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
