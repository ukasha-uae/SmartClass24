'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Lock, Search, MessageCircle, Trophy, UserPlus, LogOut, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import CampusSelector from '@/components/CampusSelector';
import {
  getMyGroups,
  getAllGroups,
  createStudyGroup,
  joinStudyGroup,
  leaveStudyGroup,
  initializeSocialData,
  StudyGroup,
} from '@/lib/social';

export default function StudyGroupsPage() {
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([]);
  const [allGroups, setAllGroups] = useState<StudyGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [educationLevel, setEducationLevel] = useState<'Primary' | 'JHS' | 'SHS'>('Primary');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    subject: '',
    isPrivate: false,
    createdBy: '',
    createdByName: '',
    educationLevel: 'JHS' as 'JHS' | 'SHS',
  });

  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    initializeSocialData();
    loadGroups();
  }, []);

  const loadGroups = () => {
    setMyGroups(getMyGroups());
    setAllGroups(getAllGroups());
  };

  const handleCreateGroup = () => {
    if (!newGroup.name.trim()) {
      toast({ title: 'Please enter a group name', variant: 'destructive' });
      return;
    }

    createStudyGroup({ ...newGroup, educationLevel });
    setShowCreateModal(false);
    setNewGroup({ name: '', description: '', subject: '', isPrivate: false, createdBy: '', createdByName: '', educationLevel: 'JHS' });
    loadGroups();
    toast({ title: 'Study group created!', description: 'Invite your classmates to join' });
  };

  const handleJoinGroup = (groupId: string, requiresCode: boolean = false) => {
    const success = joinStudyGroup(groupId, requiresCode ? joinCode : undefined);
    
    if (success) {
      setShowJoinModal(false);
      setJoinCode('');
      loadGroups();
      toast({ title: 'Joined study group!', description: 'Start collaborating with your classmates' });
    } else {
      toast({ title: 'Failed to join group', description: 'Invalid invite code or already a member', variant: 'destructive' });
    }
  };

  const handleLeaveGroup = (groupId: string) => {
    leaveStudyGroup(groupId);
    loadGroups();
    toast({ title: 'Left study group' });
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({ title: 'Invite code copied!' });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredGroups = allGroups.filter(group => {
    const searchLower = searchTerm.toLowerCase();
    return (
      group.name.toLowerCase().includes(searchLower) ||
      group.description.toLowerCase().includes(searchLower) ||
      group.subject?.toLowerCase().includes(searchLower)
    );
  });

  const availableGroups = filteredGroups.filter(
    group => !myGroups.some(myGroup => myGroup.id === group.id)
  );

  // Filter groups by education level
  const levelFilteredMyGroups = myGroups.filter(
    g => !g.educationLevel || g.educationLevel === educationLevel
  );
  
  const levelFilteredAllGroups = allGroups.filter(
    g => !g.educationLevel || g.educationLevel === educationLevel
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/30 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-300/20 via-indigo-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-300/20 via-blue-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto p-4 md:p-6 lg:p-8 pb-20 relative z-10">
        {/* Premium Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl sm:text-6xl animate-pulse">👥</div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-headline bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Study Groups
                </h1>
              </div>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
                Learn together with your classmates
              </p>
            </div>
            <CampusSelector onLevelChange={setEducationLevel} defaultLevel={educationLevel} />
          </div>
        </div>

        {/* Premium Stats */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="group relative p-5 sm:p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-2xl border-2 border-blue-200/30 dark:border-blue-800/30 shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <div className="relative">
              <Users className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">{levelFilteredMyGroups.length}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">My Groups</p>
            </div>
          </div>
          <div className="group relative p-5 sm:p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl border-2 border-cyan-200/30 dark:border-cyan-800/30 shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <div className="relative">
              <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 text-cyan-600 dark:text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-1">
                {levelFilteredMyGroups.reduce((sum, g) => sum + g.members.length, 0)}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Members</p>
            </div>
          </div>
          <div className="group relative p-5 sm:p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl border-2 border-purple-200/30 dark:border-purple-800/30 shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <div className="relative">
              <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">{levelFilteredAllGroups.length}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Available Groups</p>
            </div>
          </div>
        </div>

        {/* Premium Actions */}
        <Card className="mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-blue-200/30 dark:border-blue-800/30 shadow-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setShowCreateModal(true)} 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                <Input
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-2 border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium My Groups */}
        {levelFilteredMyGroups.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">My Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {levelFilteredMyGroups.map((group) => (
                <Card key={group.id} className="group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-blue-200/50 dark:border-blue-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 mb-2">
                        {group.isPrivate && <Lock className="h-4 w-4" />}
                        {group.name}
                      </CardTitle>
                      {group.subject && (
                        <Badge variant="secondary" className="text-xs">
                          {group.subject}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {group.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 3).map((member, i) => (
                        <Avatar key={i} className="h-8 w-8 border-2 border-background">
                          <AvatarFallback className="text-xs">
                            {member.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {group.members.length > 3 && (
                        <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                          +{group.members.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {group.members.length} members
                    </span>
                  </div>
                  
                  {group.isPrivate && group.inviteCode && (
                    <div className="mb-3 p-2 bg-muted rounded flex items-center justify-between">
                      <span className="text-sm font-mono font-bold">{group.inviteCode}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyInviteCode(group.inviteCode!)}
                      >
                        {copiedCode === group.inviteCode ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={`/study-groups/${group.id}`}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Open
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleLeaveGroup(group.id)}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

        {/* Premium Discover Groups */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Discover Groups</h2>
          {availableGroups.length === 0 ? (
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-purple-200/30 dark:border-purple-800/30 shadow-xl">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4 opacity-50">👥</div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">No available groups found. Create one to get started!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableGroups.map((group) => (
                <Card key={group.id} className="group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-purple-200/50 dark:border-purple-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {group.isPrivate && <Lock className="h-4 w-4" />}
                    {group.name}
                  </CardTitle>
                  {group.subject && (
                    <Badge variant="secondary" className="text-xs w-fit">
                      {group.subject}
                    </Badge>
                  )}
                  <CardDescription className="line-clamp-2">
                    {group.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      {group.members.length} members
                    </span>
                    <span className="text-xs text-muted-foreground">
                      by {group.createdByName}
                    </span>
                  </div>
                  <Button
                    onClick={() => {
                      if (group.isPrivate) {
                        setSelectedGroup(group);
                        setShowJoinModal(true);
                      } else {
                        handleJoinGroup(group.id);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join Group
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>

        {/* Premium Create Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <Card className="w-full max-w-lg my-8 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-blue-200/30 dark:border-blue-800/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Create Study Group</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Start a new group to study with classmates</CardDescription>
              </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name *</Label>
                <Input
                  id="group-name"
                  placeholder="e.g., Math Study Squad"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="group-description">Description</Label>
                <Textarea
                  id="group-description"
                  placeholder="What's this group about?"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="group-subject">Subject (optional)</Label>
                <Input
                  id="group-subject"
                  placeholder="e.g., Mathematics"
                  value={newGroup.subject}
                  onChange={(e) => setNewGroup({ ...newGroup, subject: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="private-group">Private Group</Label>
                  <p className="text-xs text-muted-foreground">Requires invite code to join</p>
                </div>
                <Switch
                  id="private-group"
                  checked={newGroup.isPrivate}
                  onCheckedChange={(checked) => setNewGroup({ ...newGroup, isPrivate: checked })}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button 
                  onClick={handleCreateGroup} 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Create Group
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewGroup({ name: '', description: '', subject: '', isPrivate: false, createdBy: '', createdByName: '', educationLevel: 'JHS' });
                  }}
                  variant="outline"
                  className="flex-1 border-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

        {/* Premium Join Private Group Modal */}
        {showJoinModal && selectedGroup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-purple-200/30 dark:border-purple-800/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Join {selectedGroup.name}</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Enter the invite code to join this private group</CardDescription>
              </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-code">Invite Code</Label>
                <Input
                  id="invite-code"
                  placeholder="Enter 6-character code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleJoinGroup(selectedGroup.id, true)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={joinCode.length !== 6}
                >
                  Join Group
                </Button>
                <Button
                  onClick={() => {
                    setShowJoinModal(false);
                    setSelectedGroup(null);
                    setJoinCode('');
                  }}
                  variant="outline"
                  className="flex-1 border-2 hover:bg-slate-100 dark:hover:bg-slate-800"
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
