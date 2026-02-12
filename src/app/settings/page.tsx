'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Settings as SettingsIcon,
  Trash2,
  Database,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Download,
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { useTenantLink } from '@/hooks/useTenantLink';
import { useTenant } from '@/hooks/useTenant';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/hooks/useLocalization';
import CountrySelector from '@/components/CountrySelector';
import RegionSelector from '@/components/RegionSelector';
import CountryMigrationDialog from '@/components/localization/CountryMigrationDialog';
import { MasteryProgressSection } from '@/components/promotion/MasteryProgressSection';

export default function SettingsPage() {
  const addTenantParam = useTenantLink();
  const { curriculum } = useTenant();
  const router = useRouter();
  const { toast } = useToast();
  const { country, countryId, setCountry } = useLocalization();
  const [showCountryDialog, setShowCountryDialog] = useState(false);
  
  // Settings state
  const [notifications, setNotifications] = useState({
    challenges: true,
    studyReminders: true,
    achievements: true,
    groupMessages: true,
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showRank: true,
    allowChallenges: 'everyone' as 'everyone' | 'school' | 'friends',
  });

  const [storageInfo, setStorageInfo] = useState({
    total: 0,
    challenges: 0,
    progress: 0,
    social: 0,
    cache: 0,
  });

  const [currentEducationLevel, setCurrentEducationLevel] = useState<'Primary' | 'JHS' | 'SHS'>('Primary');
  const [showTransitionConfirm, setShowTransitionConfirm] = useState(false);

  useEffect(() => {
    calculateStorageUsage();
    loadSettings();
    
    // Load current education level
    const savedLevel = localStorage.getItem('userEducationLevel') as 'Primary' | 'JHS' | 'SHS' | null;
    if (savedLevel) {
      setCurrentEducationLevel(savedLevel);
    }
  }, []);

  const loadSettings = () => {
    const savedNotifications = localStorage.getItem('settings-notifications');
    const savedPrivacy = localStorage.getItem('settings-privacy');
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    if (savedPrivacy) {
      setPrivacy(JSON.parse(savedPrivacy));
    }
  };

  const calculateStorageUsage = () => {
    let total = 0;
    let challenges = 0;
    let progress = 0;
    let social = 0;
    let cache = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      const value = localStorage.getItem(key) || '';
      const size = new Blob([value]).size;
      total += size;

      if (key.includes('challenge') || key.includes('match')) {
        challenges += size;
      } else if (key.includes('progress') || key.includes('quiz-attempts')) {
        progress += size;
      } else if (key.includes('social') || key.includes('group') || key.includes('achievement')) {
        social += size;
      } else {
        cache += size;
      }
    }

    setStorageInfo({
      total,
      challenges,
      progress,
      social,
      cache,
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const saveNotificationSettings = () => {
    localStorage.setItem('settings-notifications', JSON.stringify(notifications));
    toast({
      title: 'Settings saved',
      description: 'Notification preferences updated',
    });
  };

  const savePrivacySettings = () => {
    localStorage.setItem('settings-privacy', JSON.stringify(privacy));
    toast({
      title: 'Settings saved',
      description: 'Privacy settings updated',
    });
  };

  const clearChallengeHistory = () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('challenge') || key.includes('match')) {
        localStorage.removeItem(key);
      }
    });
    calculateStorageUsage();
    toast({
      title: 'Challenge history cleared',
      description: 'Old challenge data has been removed',
    });
  };

  const clearSocialData = () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('social') || key.includes('group') || key.includes('achievement') || key.includes('question')) {
        localStorage.removeItem(key);
      }
    });
    calculateStorageUsage();
    toast({
      title: 'Social data cleared',
      description: 'Study groups and community data removed',
    });
  };

  const clearAllCache = () => {
    const keysToKeep = ['settings-notifications', 'settings-privacy', 'user-profile', 'firebase-auth'];
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    calculateStorageUsage();
    toast({
      title: 'Cache cleared',
      description: 'All temporary data has been removed',
    });
  };

  const handleCountryChange = (newCountryId: string) => {
    console.log('🌍 Changing country from', countryId, 'to', newCountryId);
    
    // Update the country using the localization context
    setCountry(newCountryId);
    
    toast({
      title: '🌍 Country Updated!',
      description: `Your country has been changed. All content will now reflect your new selection.`,
      duration: 4000,
    });
    setShowCountryDialog(false);
  };

  const transitionToJHS = () => {
    // Save transition record
    const transitionData = {
      fromLevel: 'Primary',
      toLevel: 'JHS',
      transitionDate: new Date().toISOString(),
      primaryDataPreserved: true,
    };
    localStorage.setItem('education-level-transition', JSON.stringify(transitionData));
    
    // Update education level
    localStorage.setItem('userEducationLevel', 'JHS');
    setCurrentEducationLevel('JHS');
    
    // Clear challenge arena player data to force re-registration with JHS school
    localStorage.removeItem('challengePlayers');
    
    toast({
      title: '🎓 Congratulations!',
      description: 'You\'ve been upgraded to JHS. Please update your school in your profile.',
      duration: 5000,
    });
    
    setShowTransitionConfirm(false);
    
    // Redirect to profile to update school
    setTimeout(() => {
      router.push(addTenantParam('/profile'));
    }, 2000);
  };

  const transitionToSHS = () => {
    // Save transition record
    const transitionData = {
      fromLevel: 'JHS',
      toLevel: 'SHS',
      transitionDate: new Date().toISOString(),
      jhsDataPreserved: true,
    };
    localStorage.setItem('education-level-transition', JSON.stringify(transitionData));
    
    // Update education level
    localStorage.setItem('userEducationLevel', 'SHS');
    setCurrentEducationLevel('SHS');
    
    // Clear challenge arena player data to force re-registration with SHS school
    localStorage.removeItem('challengePlayers');
    
    toast({
      title: '🎓 Congratulations!',
      description: 'You\'ve been upgraded to SHS. Please update your school in your profile.',
      duration: 5000,
    });
    
    setShowTransitionConfirm(false);
    
    // Redirect to profile to update school
    setTimeout(() => {
      router.push(addTenantParam('/profile'));
    }, 2000);
  };

  const exportData = () => {
    const data = {
      profile: JSON.parse(localStorage.getItem('user-profile') || '{}'),
      progress: JSON.parse(localStorage.getItem('user-progress') || '{}'),
      challenges: JSON.parse(localStorage.getItem('challengePlayers') || '[]'),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartclass24-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Data exported',
      description: 'Your data has been downloaded',
    });
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push(addTenantParam('/profile'))}
            className="mb-4"
          >
            ← Back to Profile
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your account and app preferences
          </p>
        </div>

        {/* Storage Usage */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage Usage
            </CardTitle>
            <CardDescription>
              {formatBytes(storageInfo.total)} of local storage used
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Challenge History</span>
                <Badge variant="outline">{formatBytes(storageInfo.challenges)}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Learning Progress</span>
                <Badge variant="outline">{formatBytes(storageInfo.progress)}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Social Data</span>
                <Badge variant="outline">{formatBytes(storageInfo.social)}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cache & Other</span>
                <Badge variant="outline">{formatBytes(storageInfo.cache)}</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Challenge History
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Challenge History?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove all completed challenges and match history. Your rating and stats will be preserved.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearChallengeHistory}>
                      Clear History
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Social Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Social Data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove study group posts, achievements, and Q&A data. You can reload it from the server.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearSocialData}>
                      Clear Social Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full justify-start">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Clear All Cache
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Cache?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove all temporary data except your account settings. You'll need to reload content when you use the app.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAllCache}>
                      Clear Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* Country & Region */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Country & Region
            </CardTitle>
            <CardDescription>
              Localize content to your country's curriculum and context
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Country Display */}
            <div className="flex items-start justify-between p-4 border rounded-lg">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  {country?.flag && <span className="text-3xl">{country.flag}</span>}
                  <div>
                    <h3 className="font-semibold text-lg">{country?.name || 'Ghana'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {country?.currency?.symbol} {country?.currency?.code} • {country?.capital}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                  <div>
                    <span className="text-muted-foreground">Primary Exam:</span>
                    <span className="ml-1 font-medium">{country?.examSystem?.primary || 'BECE'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Secondary Exam:</span>
                    <span className="ml-1 font-medium">{country?.examSystem?.secondary || 'WASSCE'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Junior Level:</span>
                    <span className="ml-1 font-medium">{country?.academicStructure?.juniorSecondary?.name || 'JHS'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Senior Level:</span>
                    <span className="ml-1 font-medium">{country?.academicStructure?.seniorSecondary?.name || 'SHS'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Country Button */}
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setShowCountryDialog(true)}
            >
              <Globe className="h-4 w-4 mr-2" />
              Change Country
            </Button>

            <Separator />

            {/* Region Selector */}
            <div className="space-y-2">
              <Label>Region</Label>
              <RegionSelector variant="dropdown" />
              <p className="text-xs text-muted-foreground">
                Optional: Select your region for more localized content
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Challenge Invitations</Label>
                <p className="text-sm text-muted-foreground">
                  When someone challenges you to a game
                </p>
              </div>
              <Switch
                checked={notifications.challenges}
                onCheckedChange={(checked) => {
                  setNotifications(prev => ({ ...prev, challenges: checked }));
                  saveNotificationSettings();
                }}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Study Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Daily reminders to study and practice
                </p>
              </div>
              <Switch
                checked={notifications.studyReminders}
                onCheckedChange={(checked) => {
                  setNotifications(prev => ({ ...prev, studyReminders: checked }));
                  saveNotificationSettings();
                }}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Achievements</Label>
                <p className="text-sm text-muted-foreground">
                  When you unlock badges and milestones
                </p>
              </div>
              <Switch
                checked={notifications.achievements}
                onCheckedChange={(checked) => {
                  setNotifications(prev => ({ ...prev, achievements: checked }));
                  saveNotificationSettings();
                }}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Group Messages</Label>
                <p className="text-sm text-muted-foreground">
                  New posts in your study groups
                </p>
              </div>
              <Switch
                checked={notifications.groupMessages}
                onCheckedChange={(checked) => {
                  setNotifications(prev => ({ ...prev, groupMessages: checked }));
                  saveNotificationSettings();
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy
            </CardTitle>
            <CardDescription>
              Control who can see your profile and challenge you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Profile Visible</Label>
                <p className="text-sm text-muted-foreground">
                  Other students can view your profile
                </p>
              </div>
              <Switch
                checked={privacy.profileVisible}
                onCheckedChange={(checked) => {
                  setPrivacy(prev => ({ ...prev, profileVisible: checked }));
                  savePrivacySettings();
                }}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Rank on Leaderboards</Label>
                <p className="text-sm text-muted-foreground">
                  Display your position in school rankings
                </p>
              </div>
              <Switch
                checked={privacy.showRank}
                onCheckedChange={(checked) => {
                  setPrivacy(prev => ({ ...prev, showRank: checked }));
                  savePrivacySettings();
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data Export
            </CardTitle>
            <CardDescription>
              Download your data for backup or transfer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={exportData} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Downloads a JSON file with your profile, progress, and statistics
            </p>
          </CardContent>
        </Card>

        {/* Mastery Progress Management */}
        <MasteryProgressSection />

        {/* Education Level Transition - Primary to JHS */}
        {currentEducationLevel === 'Primary' && (
          <Card className="mb-6 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Ready for Junior High School?
              </CardTitle>
              <CardDescription>
                Transition your account from Primary School to JHS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100 mb-3">
                  <strong>📚 Congratulations on completing Primary School!</strong>
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  When you transition to JHS, you will:
                </p>
                <ul className="text-sm text-blue-900 dark:text-blue-100 mt-2 ml-4 space-y-1">
                  <li>✓ Keep all your Primary School achievements and progress</li>
                  <li>✓ Access JHS curriculum for all subjects</li>
                  <li>✓ Update your school to a JHS institution</li>
                  <li>✓ Prepare for BECE examinations</li>
                  <li>✓ Compete with other JHS students</li>
                </ul>
              </div>

              <AlertDialog open={showTransitionConfirm && currentEducationLevel === 'Primary'} onOpenChange={setShowTransitionConfirm}>
                <AlertDialogTrigger asChild>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Transition to JHS
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      Transition to Junior High School?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3 pt-2">
                      <p>
                        This will upgrade your account to JHS level. You will need to:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Update your school to a JHS institution</li>
                        <li>Re-verify your student status at your new school</li>
                        <li>Access JHS curriculum and BECE preparation materials</li>
                      </ol>
                      <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-900 dark:text-green-100">
                          ✅ <strong>All your Primary School data will be preserved:</strong> achievements, quiz history, and progress remain in your account.
                        </p>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-900 dark:text-amber-100">
                          ⚠️ <strong>Note:</strong> This is a one-way transition. You cannot switch back to Primary after upgrading.
                        </p>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={transitionToJHS} className="bg-blue-600 hover:bg-blue-700">
                      Yes, Transition to JHS
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <p className="text-xs text-muted-foreground text-center">
                Still in Primary School? You can transition later when you're ready.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Education Level Transition - JHS to SHS */}
        {currentEducationLevel === 'JHS' && (
          <Card className="mb-6 border-violet-200 dark:border-violet-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-violet-600" />
                Graduated to SHS?
              </CardTitle>
              <CardDescription>
                Transition your account from JHS to Senior High School
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-violet-50 dark:bg-violet-950/20 rounded-lg border border-violet-200 dark:border-violet-800">
                <p className="text-sm text-violet-900 dark:text-violet-100 mb-3">
                  <strong>📚 Congratulations on completing JHS!</strong>
                </p>
                <p className="text-sm text-violet-900 dark:text-violet-100">
                  When you transition to SHS, you will:
                </p>
                <ul className="text-sm text-violet-900 dark:text-violet-100 mt-2 ml-4 space-y-1">
                  <li>✓ Keep all your JHS achievements and progress</li>
                  <li>✓ Access SHS curriculum and subjects</li>
                  <li>✓ Update your school to an SHS institution</li>
                  <li>✓ Compete with other SHS students</li>
                </ul>
              </div>

              <AlertDialog open={showTransitionConfirm && currentEducationLevel === 'JHS'} onOpenChange={setShowTransitionConfirm}>
                <AlertDialogTrigger asChild>
                  <Button className="w-full bg-violet-600 hover:bg-violet-700">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Transition to SHS
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-violet-600" />
                      Transition to Senior High School?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3 pt-2">
                      <p>
                        This will upgrade your account to SHS level. You will need to:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Update your school to an SHS institution</li>
                        <li>Re-verify your student status at your new school</li>
                        <li>Access SHS curriculum (Core Math, Physics, Chemistry, etc.)</li>
                      </ol>
                      <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-900 dark:text-green-100">
                          ✅ <strong>All your JHS data will be preserved:</strong> achievements, quiz history, and progress remain in your account.
                        </p>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-900 dark:text-amber-100">
                          ⚠️ <strong>Note:</strong> This is a one-way transition. You cannot switch back to JHS after upgrading.
                        </p>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={transitionToSHS} className="bg-violet-600 hover:bg-violet-700">
                      Yes, Transition to SHS
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <p className="text-xs text-muted-foreground text-center">
                Still in JHS? You can transition later when you're ready.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Current Level Status Cards */}
        {currentEducationLevel === 'Primary' && (
          <Card className="mb-6 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Primary School Student
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <GraduationCap className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    You're enrolled in Primary School (Class 1-6)
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Build foundational skills in English, Math, Science, and more
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentEducationLevel === 'JHS' && (
          <Card className="mb-6 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                JHS Student
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <GraduationCap className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    You're enrolled in Junior High School
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Access JHS curriculum, compete in challenges, and prepare for BECE
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentEducationLevel === 'SHS' && (
          <Card className="mb-6 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                SHS Student
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <GraduationCap className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    You're enrolled in Senior High School
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Access SHS curriculum, compete in school battles, and prepare for WASSCE
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-violet-600" />
              About SmartClass24
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Version</span>
                <Badge variant="outline">2.0.0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Platform</span>
                <Badge variant="secondary">Primary · JHS · SHS</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Features</span>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">Challenge Arena</Badge>
                  <Badge variant="outline" className="text-xs">School Battles</Badge>
                  <Badge variant="outline" className="text-xs">Study Groups</Badge>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="p-3 bg-violet-50 dark:bg-violet-950/20 rounded-lg border border-violet-200 dark:border-violet-800">
              <p className="text-sm text-violet-900 dark:text-violet-100 mb-2">
                <strong>� Global Learning Platform</strong>
              </p>
              <p className="text-xs text-violet-800 dark:text-violet-200">
                Empowering students worldwide with interactive lessons, competitive quizzes, 
                virtual labs, and comprehensive exam preparation tailored to your curriculum.
              </p>
            </div>
            {curriculum && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-lg border border-purple-200 dark:border-purple-800/50">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100 text-sm">
                      📚 Your Curriculum: {curriculum.system.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </h3>
                    <div className="space-y-1 text-xs text-purple-700 dark:text-purple-300">
                      {curriculum.examSystems.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          <span className="font-medium">Exam Systems:</span>
                          {curriculum.examSystems.map((exam) => (
                            <Badge key={exam} variant="secondary" className="bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-100 text-xs px-2 py-0">
                              {exam}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Grade Levels:</span>
                        <span>{curriculum.gradeLevels.join(' • ')}</span>
                      </div>
                      {curriculum.countries && curriculum.countries.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Countries:</span>
                          <span>{curriculum.countries.map(c => c.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).join(', ')}</span>
                        </div>
                      )}
                      {curriculum.description && (
                        <p className="mt-2 text-purple-600 dark:text-purple-400 italic">
                          {curriculum.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>© 2025 SmartClass24. All rights reserved.</p>
              <p>Serving students globally with personalized, curriculum-aligned education</p>
            </div>
            
            <Separator />
            
            <div className="flex flex-wrap gap-2">
              <Link href={addTenantParam('/about')}>
                <Button variant="link" className="h-auto p-0 text-xs">About Us</Button>
              </Link>
              <Link href="/privacy-policy">
                <Button variant="link" className="h-auto p-0 text-xs">Privacy Policy</Button>
              </Link>
              <Link href="/terms-of-service">
                <Button variant="link" className="h-auto p-0 text-xs">Terms of Service</Button>
              </Link>
              <Button variant="link" className="h-auto p-0 text-xs" asChild>
                <a href="mailto:support@smartclass24.app">Support</a>
              </Button>
              <Button variant="link" className="h-auto p-0 text-xs" asChild>
                <a href="https://github.com/ukasha-uae/SmartClass24" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Country Migration Dialog */}
      <CountryMigrationDialog
        isOpen={showCountryDialog}
        onClose={() => setShowCountryDialog(false)}
        onConfirm={handleCountryChange}
        currentCountryName={country?.name || 'Ghana'}
      />
    </div>
  );
}
