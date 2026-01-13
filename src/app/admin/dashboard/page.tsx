'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  User,
  Coins,
  Crown,
  Plus,
  Minus,
  CheckCircle2,
  XCircle,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  Shield,
  Loader2
} from 'lucide-react';
import { getPlayerProfile, getAllPlayers, createOrUpdatePlayer, Player } from '@/lib/challenge';
import { 
  getUserSubscription, 
  addSubscription, 
  updateSubscription,
  isPremiumUser,
  hasVirtualLabAccess,
  hasFullBundle,
  COIN_PACKAGES
} from '@/lib/monetization';
import { getUserTransactions, getTransactionStats } from '@/lib/transaction-history';
import { useToast } from '@/hooks/use-toast';
import { formatGHS } from '@/lib/payments';
import { useFirebase } from '@/firebase/provider';
import { isAdmin, isSuperAdmin, addAdmin, removeAdmin, getAllAdmins } from '@/lib/admin-config';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<Player | null>(null);
  const [users, setUsers] = useState<Player[]>([]);
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [subscriptionPlan, setSubscriptionPlan] = useState<'premium_monthly' | 'premium_annual'>('premium_monthly');
  const [subscriptionType, setSubscriptionType] = useState<'challengeArena' | 'virtualLab' | 'fullBundle'>('fullBundle');
  const [activeTab, setActiveTab] = useState('search');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);
  const [adminUsers, setAdminUsers] = useState<Array<{ email: string; addedBy: string; addedAt: any; isSuperAdmin: boolean }>>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const { toast } = useToast();
  const { user, firestore, isUserLoading } = useFirebase();

  // Admin authentication check
  useEffect(() => {
    async function checkAdminAccess() {
      if (isUserLoading) return;
      
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to access the admin dashboard',
          variant: 'destructive',
        });
        router.push('/profile');
        return;
      }

      // Check if user email is in admin list
      if (!firestore) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        // Get user email from Firestore profile or Firebase Auth
        const studentDoc = await import('firebase/firestore').then(m => m.getDoc(m.doc(firestore, `students/${user.uid}`)));
        const email = studentDoc.exists() ? studentDoc.data()?.email : user.email;
        
        console.log('[Admin] Checking access for email:', email);
        console.log('[Admin] User UID:', user.uid);
        
        const hasAdminAccess = await isAdmin(email);
        console.log('[Admin] Has admin access:', hasAdminAccess);
        
        if (!hasAdminAccess) {
          console.log('[Admin] Access denied - not in admin list');
          toast({
            title: 'Access Denied',
            description: `You do not have admin privileges. Email: ${email}`,
            variant: 'destructive',
          });
          router.push('/');
          return;
        }

        console.log('[Admin] Access granted - loading dashboard');
        setIsAuthorized(true);
        setIsSuperAdminUser(isSuperAdmin(email));
        loadAllUsers();
        loadAdminUsers();
      } catch (error) {
        console.error('[Admin] Error checking access:', error);
        toast({
          title: 'Error',
          description: 'Failed to verify admin access',
          variant: 'destructive',
        });
        router.push('/');
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAdminAccess();
  }, [user, isUserLoading, firestore, router, toast]);

  // Load all users from Firestore
  const loadAllUsers = async () => {
    if (!firestore) return;
    
    setIsLoadingUsers(true);
    try {
      // Load from Firestore students collection
      const studentsRef = collection(firestore, 'students');
      const studentsSnapshot = await getDocs(studentsRef);
      
      const firestoreUsers: Player[] = [];
      studentsSnapshot.forEach((doc) => {
        const data = doc.data();
        firestoreUsers.push({
          userId: doc.id,
          userName: data.studentName || data.userName || 'Unknown',
          name: data.studentName || data.userName || 'Unknown',
          email: data.email || undefined,
          school: data.school || 'Unknown',
          schoolId: data.schoolId,
          schoolRegion: data.schoolRegion,
          rating: data.rating || 1000,
          wins: data.wins || 0,
          losses: data.losses || 0,
          draws: data.draws || 0,
          totalGames: data.totalGames || 0,
          winStreak: data.winStreak || 0,
          highestStreak: data.highestStreak || 0,
          xp: data.xp || 0,
          coins: data.coins || 0,
          achievements: data.achievements || [],
          level: data.level || 'JHS',
        });
      });

      // Also load from localStorage (for users who haven't synced to Firestore yet)
      const localUsers = getAllPlayers();
      
      // Merge users, preferring Firestore data
      const userMap = new Map<string, Player>();
      
      // Add local users first
      localUsers.forEach(user => userMap.set(user.userId, user));
      
      // Override with Firestore data (more authoritative)
      firestoreUsers.forEach(user => userMap.set(user.userId, user));
      
      const allUsers = Array.from(userMap.values());
      setUsers(allUsers);
      
      console.log(`[Admin] Loaded ${allUsers.length} users (${firestoreUsers.length} from Firestore, ${localUsers.length} from localStorage)`);
    } catch (error) {
      console.error('[Admin] Error loading users:', error);
      toast({
        title: 'Error Loading Users',
        description: 'Failed to load user data. Showing localStorage data only.',
        variant: 'destructive',
      });
      
      // Fallback to localStorage
      const allUsers = getAllPlayers();
      setUsers(allUsers);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Load admin users from Firestore
  const loadAdminUsers = async () => {
    if (!firestore) return;
    
    setIsLoadingAdmins(true);
    try {
      const admins = await getAllAdmins(firestore);
      setAdminUsers(admins);
    } catch (error) {
      console.error('[Admin] Error loading admins:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin users',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  // Add new admin (super admin only)
  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    if (!user || !firestore) return;

    try {
      const studentDoc = await import('firebase/firestore').then(m => m.getDoc(m.doc(firestore, `students/${user.uid}`)));
      const currentUserEmail = studentDoc.exists() ? studentDoc.data()?.email : user.email;

      await addAdmin(newAdminEmail.toLowerCase(), currentUserEmail || 'Unknown', firestore);
      
      toast({
        title: 'Admin Added! ✅',
        description: `${newAdminEmail} now has admin access`,
      });
      
      setNewAdminEmail('');
      loadAdminUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add admin',
        variant: 'destructive',
      });
    }
  };

  // Remove admin (super admin only)
  const handleRemoveAdmin = async (email: string) => {
    if (!firestore) return;
    
    if (isSuperAdmin(email)) {
      toast({
        title: 'Cannot Remove',
        description: 'Super admin cannot be removed',
        variant: 'destructive',
      });
      return;
    }

    try {
      await removeAdmin(email, firestore);
      
      toast({
        title: 'Admin Removed',
        description: `${email} no longer has admin access`,
      });
      
      loadAdminUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove admin',
        variant: 'destructive',
      });
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: 'Search Required',
        description: 'Please enter a user ID, email, or name to search',
        variant: 'destructive',
      });
      return;
    }

    // Search by userId, email, or name
    const foundUser = users.find(
      (u) =>
        u.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (foundUser) {
      setSelectedUser(foundUser);
      setActiveTab('manage');
    } else {
      // Try to get by userId directly
      const directUser = getPlayerProfile(searchQuery);
      if (directUser) {
        setSelectedUser(directUser);
        setActiveTab('manage');
      } else {
        toast({
          title: 'User Not Found',
          description: 'No user found with that ID, email, or name',
          variant: 'destructive',
        });
      }
    }
  };

  const handleAddCoins = () => {
    if (!selectedUser) return;
    if (coinAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid coin amount',
        variant: 'destructive',
      });
      return;
    }

    const updatedPlayer = createOrUpdatePlayer({
      ...selectedUser,
      coins: (selectedUser.coins || 0) + coinAmount,
    });

    setSelectedUser(updatedPlayer);
    setCoinAmount(0);

    toast({
      title: 'Coins Added! ✅',
      description: `Added ${coinAmount} coins to ${selectedUser.name || selectedUser.userId}`,
    });

    loadAllUsers();
  };

  const handleAddCoinsFromPackage = () => {
    if (!selectedUser || !selectedPackage) return;

    const package_ = COIN_PACKAGES.find(p => p.packageId === selectedPackage);
    if (!package_) {
      toast({
        title: 'Invalid Package',
        description: 'Please select a valid coin package',
        variant: 'destructive',
      });
      return;
    }

    const totalCoins = package_.coins + (package_.bonus || 0);
    const updatedPlayer = createOrUpdatePlayer({
      ...selectedUser,
      coins: (selectedUser.coins || 0) + totalCoins,
    });

    setSelectedUser(updatedPlayer);
    setSelectedPackage('');

    toast({
      title: 'Package Purchased! ✅',
      description: `Added ${totalCoins} coins (${package_.coins} + ${package_.bonus || 0} bonus) to ${selectedUser.name || selectedUser.userId}`,
    });

    loadAllUsers();
  };

  const handleActivatePremium = () => {
    if (!selectedUser) return;

    try {
      const duration = subscriptionPlan.includes('annual') ? 'annual' : 'monthly';
      const planId = subscriptionType === 'challengeArena' 
        ? `premium_${duration}`
        : subscriptionType === 'virtualLab'
        ? `virtual_lab_${duration}`
        : `full_bundle_${duration}`;
      
      addSubscription(selectedUser.userId, planId, duration, subscriptionType);
      
      const updatedUser = getPlayerProfile(selectedUser.userId);
      setSelectedUser(updatedUser);

      const subscriptionName = subscriptionType === 'challengeArena' 
        ? 'Challenge Arena Premium'
        : subscriptionType === 'virtualLab'
        ? 'Virtual Lab Premium'
        : 'Full Bundle';

      toast({
        title: 'Premium Activated! ✅',
        description: `${subscriptionName} activated for ${selectedUser.name || selectedUser.userId}`,
      });

      loadAllUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to activate premium',
        variant: 'destructive',
      });
    }
  };

  const handleCancelPremium = () => {
    if (!selectedUser) return;

    const subscription = getUserSubscription(selectedUser.userId);
    if (!subscription) {
      toast({
        title: 'No Subscription',
        description: 'User does not have an active subscription',
        variant: 'destructive',
      });
      return;
    }

    if (confirm(`Cancel premium subscription for ${selectedUser.name || selectedUser.userId}?`)) {
      updateSubscription(selectedUser.userId, subscription.planId || '', false);
      
      const updatedUser = getPlayerProfile(selectedUser.userId);
      setSelectedUser(updatedUser);

      toast({
        title: 'Premium Cancelled',
        description: `Premium subscription cancelled for ${selectedUser.name || selectedUser.userId}`,
      });

      loadAllUsers();
    }
  };

  const userSubscription = selectedUser ? getUserSubscription(selectedUser.userId) : null;
  const userStats = selectedUser ? getTransactionStats(selectedUser.userId) : null;
  const isPremium = selectedUser ? isPremiumUser(selectedUser.userId) : false;
  const hasVirtualLab = selectedUser ? hasVirtualLabAccess(selectedUser.userId) : false;
  const hasBundle = selectedUser ? hasFullBundle(selectedUser.userId) : false;

  // Show loading screen while checking authentication
  if (isCheckingAuth || isUserLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Shield className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Verifying Admin Access</h2>
            <p className="text-muted-foreground flex items-center gap-2 justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking credentials...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authorized (redirect will happen via useEffect)
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Admin Badge */}
        <div className="mb-4">
          <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <Shield className="h-3 w-3 mr-1" />
            Admin Dashboard
          </Badge>
        </div>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            Manage user coins, subscriptions, and premium access
            {isLoadingUsers && (
              <span className="flex items-center gap-1 text-xs">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading users...
              </span>
            )}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="search">Search User</TabsTrigger>
            <TabsTrigger value="manage" disabled={!selectedUser}>Manage User</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            {isSuperAdminUser && <TabsTrigger value="admins">Admin Management</TabsTrigger>}
          </TabsList>

          <TabsContent value="search">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Search User</CardTitle>
                  <CardDescription>
                    Search by user ID, email, or name
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter user ID, email, or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="flex-1"
                    />
                    <Button onClick={handleSearch}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  {selectedUser && (
                    <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-semibold">{selectedUser.name || 'No Name'}</p>
                          <p className="text-sm text-muted-foreground">{selectedUser.userId}</p>
                          <p className="text-sm text-muted-foreground">{selectedUser.email || 'No email'}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setActiveTab('manage')}
                        className="mt-3 w-full"
                      >
                        Manage User
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Grant Premium - For Testing */}
              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-2 border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-600" />
                    Quick Grant Premium (Testing)
                  </CardTitle>
                  <CardDescription>
                    Quickly grant premium access to your account or any user for testing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-800">
                      <p className="text-xs text-muted-foreground mb-1">Your User ID (click to copy):</p>
                      <p 
                        className="font-mono text-sm cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/30 p-2 rounded"
                        onClick={() => {
                          navigator.clipboard.writeText(user.uid);
                          toast({ title: 'Copied!', description: 'User ID copied to clipboard' });
                        }}
                      >
                        {user.uid}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Subscription Type</label>
                    <select
                      value={subscriptionType}
                      onChange={(e) => setSubscriptionType(e.target.value as 'challengeArena' | 'virtualLab' | 'fullBundle')}
                      className="w-full px-3 py-2 border rounded-lg mb-2"
                    >
                      <option value="fullBundle">Full Bundle (Recommended for Testing)</option>
                      <option value="challengeArena">Challenge Arena Premium</option>
                      <option value="virtualLab">Virtual Lab Premium</option>
                    </select>
                    <select
                      value={subscriptionPlan}
                      onChange={(e) => setSubscriptionPlan(e.target.value as 'premium_monthly' | 'premium_annual')}
                      className="w-full px-3 py-2 border rounded-lg mb-3"
                    >
                      <option value="premium_monthly">Monthly</option>
                      <option value="premium_annual">Annual</option>
                    </select>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter User ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => {
                          const userId = searchQuery.trim() || user?.uid;
                          if (!userId) {
                            toast({
                              title: 'Error',
                              description: 'Please enter a user ID or log in',
                              variant: 'destructive',
                            });
                            return;
                          }
                          try {
                            const duration = subscriptionPlan.includes('annual') ? 'annual' : 'monthly';
                            const planId = subscriptionType === 'challengeArena' 
                              ? `premium_${duration}`
                              : subscriptionType === 'virtualLab'
                              ? `virtual_lab_${duration}`
                              : `full_bundle_${duration}`;
                            
                            addSubscription(userId, planId, duration, subscriptionType, firestore);
                            
                            toast({
                              title: 'Premium Granted! ✅',
                              description: `${subscriptionType === 'challengeArena' ? 'Challenge Arena' : subscriptionType === 'virtualLab' ? 'Virtual Lab' : 'Full Bundle'} Premium activated for ${userId}`,
                            });
                            
                            // Refresh if this is the current user
                            if (userId === user?.uid) {
                              window.location.reload();
                            }
                          } catch (error: any) {
                            toast({
                              title: 'Error',
                              description: error.message || 'Failed to grant premium',
                              variant: 'destructive',
                            });
                          }
                        }}
                        className="bg-gradient-to-r from-amber-500 to-orange-600"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Grant Premium
                      </Button>
                    </div>
                    {user && (
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => {
                          setSearchQuery(user.uid);
                          const duration = subscriptionPlan.includes('annual') ? 'annual' : 'monthly';
                          const planId = subscriptionType === 'challengeArena' 
                            ? `premium_${duration}`
                            : subscriptionType === 'virtualLab'
                            ? `virtual_lab_${duration}`
                            : `full_bundle_${duration}`;
                          
                          try {
                            addSubscription(user.uid, planId, duration, subscriptionType);
                            toast({
                              title: 'Premium Granted! ✅',
                              description: `${subscriptionType === 'challengeArena' ? 'Challenge Arena' : subscriptionType === 'virtualLab' ? 'Virtual Lab' : 'Full Bundle'} Premium activated for your account`,
                            });
                            setTimeout(() => window.location.reload(), 1000);
                          } catch (error: any) {
                            toast({
                              title: 'Error',
                              description: error.message || 'Failed to grant premium',
                              variant: 'destructive',
                            });
                          }
                        }}
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Grant Premium to My Account
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="manage">
            {selectedUser ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* User Info */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>User Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-semibold">{selectedUser.name || 'No Name'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">User ID</p>
                      <p className="font-mono text-xs">{selectedUser.userId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-sm">{selectedUser.email || 'No email'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Coins</p>
                      <p className="text-2xl font-bold text-yellow-600 flex items-center gap-2">
                        <Coins className="h-5 w-5" />
                        {selectedUser.coins || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Subscription Status</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {hasBundle ? (
                          <Badge className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white">
                            <Crown className="h-3 w-3 mr-1" />
                            Full Bundle
                          </Badge>
                        ) : isPremium ? (
                          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                            <Crown className="h-3 w-3 mr-1" />
                            Challenge Arena Premium
                          </Badge>
                        ) : hasVirtualLab ? (
                          <Badge className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
                            <Crown className="h-3 w-3 mr-1" />
                            Virtual Lab Premium
                          </Badge>
                        ) : (
                          <Badge variant="outline">Free User</Badge>
                        )}
                      </div>
                      {userSubscription && (
                        <div className="text-xs text-muted-foreground mt-1 space-y-1">
                          <p>Plan: {userSubscription.planId || 'N/A'}</p>
                          <p>Tier: {userSubscription.tier || 'N/A'}</p>
                          {userSubscription.endDate && (
                            <p>Expires: {new Date(userSubscription.endDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      )}
                    </div>
                    {userStats && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-2">Transaction Stats</p>
                        <div className="space-y-1 text-xs">
                          <p>Total Spent: {formatGHS(userStats.totalSpent)}</p>
                          <p>Transactions: {userStats.totalTransactions}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Manage Coins */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Manage Coins</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Add Custom Amount</label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Enter coin amount"
                          value={coinAmount || ''}
                          onChange={(e) => setCoinAmount(Number(e.target.value))}
                          min="1"
                        />
                        <Button onClick={handleAddCoins}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Coins
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <label className="text-sm font-semibold mb-2 block">Or Select Package</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {COIN_PACKAGES.map((pkg) => (
                          <button
                            key={pkg.packageId}
                            onClick={() => setSelectedPackage(pkg.packageId)}
                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                              selectedPackage === pkg.packageId
                                ? 'border-primary bg-primary/10'
                                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                            }`}
                          >
                            <p className="font-bold text-lg">{pkg.coins + (pkg.bonus || 0)}</p>
                            <p className="text-xs text-muted-foreground">{pkg.name}</p>
                            <p className="text-xs font-semibold text-primary mt-1">{formatGHS(pkg.price)}</p>
                          </button>
                        ))}
                      </div>
                      {selectedPackage && (
                        <Button
                          onClick={handleAddCoinsFromPackage}
                          className="w-full mt-3"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Add Package
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Manage Premium */}
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Manage Premium Subscription</CardTitle>
                    <CardDescription>
                      Grant premium access for testing. Choose subscription type and duration.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!hasBundle && (!isPremium || !hasVirtualLab) ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Select Subscription Type</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <button
                              onClick={() => setSubscriptionType('challengeArena')}
                              className={`p-4 rounded-lg border-2 transition-all text-left ${
                                subscriptionType === 'challengeArena'
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Crown className="h-5 w-5 text-blue-600" />
                                <span className="font-semibold">Challenge Arena</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Unlimited questions, analytics</p>
                              <p className="text-xs font-semibold text-blue-600 mt-1">GHS 15/month</p>
                            </button>
                            <button
                              onClick={() => setSubscriptionType('virtualLab')}
                              className={`p-4 rounded-lg border-2 transition-all text-left ${
                                subscriptionType === 'virtualLab'
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Crown className="h-5 w-5 text-purple-600" />
                                <span className="font-semibold">Virtual Lab</span>
                              </div>
                              <p className="text-xs text-muted-foreground">All virtual labs access</p>
                              <p className="text-xs font-semibold text-purple-600 mt-1">GHS 10/month</p>
                            </button>
                            <button
                              onClick={() => setSubscriptionType('fullBundle')}
                              className={`p-4 rounded-lg border-2 transition-all text-left ${
                                subscriptionType === 'fullBundle'
                                  ? 'border-gradient-to-r from-blue-500 to-purple-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Crown className="h-5 w-5 text-yellow-600" />
                                <span className="font-semibold">Full Bundle</span>
                                <Badge className="ml-auto text-xs bg-green-500">Best Value</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">Everything + 20% discount</p>
                              <p className="text-xs font-semibold text-blue-600 mt-1">GHS 20/month</p>
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Select Duration</label>
                          <div className="flex gap-2">
                            <select
                              value={subscriptionPlan}
                              onChange={(e) => setSubscriptionPlan(e.target.value as 'premium_monthly' | 'premium_annual')}
                              className="flex-1 px-3 py-2 border rounded-lg"
                            >
                              <option value="premium_monthly">Monthly</option>
                              <option value="premium_annual">Annual (Save 33%)</option>
                            </select>
                            <Button 
                              onClick={handleActivatePremium} 
                              className="bg-gradient-to-r from-amber-500 to-orange-600"
                            >
                              <Crown className="h-4 w-4 mr-2" />
                              Activate {subscriptionType === 'challengeArena' ? 'Challenge Arena' : subscriptionType === 'virtualLab' ? 'Virtual Lab' : 'Full Bundle'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-lg border-2 border-amber-200 dark:border-amber-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold flex items-center gap-2">
                                <Crown className="h-4 w-4 text-amber-600" />
                                {hasBundle ? 'Full Bundle Active' : isPremium ? 'Challenge Arena Premium Active' : 'Virtual Lab Premium Active'}
                              </p>
                              {userSubscription && (
                                <div className="text-sm text-muted-foreground mt-1 space-y-1">
                                  <p>Plan: {userSubscription.planId || 'N/A'}</p>
                                  <p>Tier: {userSubscription.tier || 'N/A'}</p>
                                  {userSubscription.endDate && (
                                    <p>
                                      Expires: {new Date(userSubscription.endDate).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                            <Button
                              onClick={handleCancelPremium}
                              variant="destructive"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel Subscription
                            </Button>
                          </div>
                        </div>
                        {!hasBundle && (
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              💡 Tip: You can upgrade to Full Bundle to get both Challenge Arena and Virtual Lab Premium at a discount!
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Please search for a user first</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stats">
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                        <p className="text-2xl font-bold">{users.length}</p>
                      </div>
                      <Users className="h-8 w-8 text-primary opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Free Users</p>
                        <p className="text-2xl font-bold text-gray-600">
                          {users.filter(u => !isPremiumUser(u.userId) && !hasVirtualLabAccess(u.userId)).length}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-gray-400 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Premium Users</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {users.filter(u => isPremiumUser(u.userId) || hasVirtualLabAccess(u.userId)).length}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {users.filter(u => hasFullBundle(u.userId)).length} Full Bundle
                        </p>
                      </div>
                      <Crown className="h-8 w-8 text-amber-600 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Coins</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {users.reduce((sum, u) => sum + (u.coins || 0), 0).toLocaleString()}
                        </p>
                      </div>
                      <Coins className="h-8 w-8 text-yellow-600 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Users by Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Free Users */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-500" />
                      Free Users ({users.filter(u => !isPremiumUser(u.userId) && !hasVirtualLabAccess(u.userId)).length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {users
                        .filter(u => !isPremiumUser(u.userId) && !hasVirtualLabAccess(u.userId))
                        .map((user) => (
                          <div
                            key={user.userId}
                            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedUser(user);
                              setSearchQuery(user.userId);
                              setActiveTab('manage');
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{user.name || user.userName || 'No Name'}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.userId}</p>
                              </div>
                              <Badge variant="outline" className="ml-2">Free</Badge>
                            </div>
                          </div>
                        ))}
                      {users.filter(u => !isPremiumUser(u.userId) && !hasVirtualLabAccess(u.userId)).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No free users</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Premium Users */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-amber-600" />
                      Premium Users ({users.filter(u => isPremiumUser(u.userId) || hasVirtualLabAccess(u.userId)).length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {users
                        .filter(u => isPremiumUser(u.userId) || hasVirtualLabAccess(u.userId))
                        .map((user) => {
                          const hasBundle = hasFullBundle(user.userId);
                          const isPremium = isPremiumUser(user.userId);
                          const hasVL = hasVirtualLabAccess(user.userId);
                          
                          return (
                            <div
                              key={user.userId}
                              className="p-3 rounded-lg border-2 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/20 cursor-pointer transition-colors"
                              onClick={() => {
                                setSelectedUser(user);
                                setSearchQuery(user.userId);
                                setActiveTab('manage');
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm truncate">{user.name || user.userName || 'No Name'}</p>
                                  <p className="text-xs text-muted-foreground truncate">{user.userId}</p>
                                </div>
                                <div className="ml-2 flex flex-col items-end gap-1">
                                  {hasBundle ? (
                                    <Badge className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white text-xs">
                                      <Crown className="h-2.5 w-2.5 mr-0.5" />
                                      Bundle
                                    </Badge>
                                  ) : isPremium ? (
                                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs">
                                      <Crown className="h-2.5 w-2.5 mr-0.5" />
                                      Arena
                                    </Badge>
                                  ) : hasVL ? (
                                    <Badge className="bg-gradient-to-r from-purple-500 to-violet-600 text-white text-xs">
                                      <Crown className="h-2.5 w-2.5 mr-0.5" />
                                      VL
                                    </Badge>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      {users.filter(u => isPremiumUser(u.userId) || hasVirtualLabAccess(u.userId)).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No premium users</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Full Bundle Users */}
                <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-950/30 dark:to-purple-950/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-600" />
                      Full Bundle ({users.filter(u => hasFullBundle(u.userId)).length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {users
                        .filter(u => hasFullBundle(u.userId))
                        .map((user) => (
                          <div
                            key={user.userId}
                            className="p-3 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 hover:from-blue-50 dark:hover:from-blue-950/30 cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedUser(user);
                              setSearchQuery(user.userId);
                              setActiveTab('manage');
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{user.name || user.userName || 'No Name'}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.userId}</p>
                              </div>
                              <Badge className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white text-xs ml-2">
                                <Crown className="h-2.5 w-2.5 mr-0.5" />
                                Bundle
                              </Badge>
                            </div>
                          </div>
                        ))}
                      {users.filter(u => hasFullBundle(u.userId)).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No full bundle users</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Admin Management Tab - Super Admin Only */}
          {isSuperAdminUser && (
            <TabsContent value="admins">
              <div className="space-y-6">
                <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-purple-600" />
                      Admin Management (Super Admin Only)
                    </CardTitle>
                    <CardDescription>
                      Add or remove admin users. Admins can manage users, subscriptions, and coins.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Add New Admin */}
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Add New Admin</label>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="Enter email address..."
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddAdmin()}
                          className="flex-1"
                        />
                        <Button onClick={handleAddAdmin} className="bg-purple-600 hover:bg-purple-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Admin
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        The user must sign up with this email to gain admin access
                      </p>
                    </div>

                    {/* Admin List */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold">Current Admins ({adminUsers.length})</h3>
                        {isLoadingAdmins && (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-2">
                        {adminUsers.map((admin) => (
                          <div
                            key={admin.email}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              admin.isSuperAdmin
                                ? 'border-yellow-300 dark:border-yellow-700 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20'
                                : 'border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold">{admin.email}</p>
                                  {admin.isSuperAdmin && (
                                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                      <Crown className="h-3 w-3 mr-1" />
                                      Super Admin
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Added by: {admin.addedBy}
                                  {admin.addedAt && ` • ${new Date(admin.addedAt.toDate()).toLocaleDateString()}`}
                                </p>
                              </div>
                              {!admin.isSuperAdmin && (
                                <Button
                                  onClick={() => handleRemoveAdmin(admin.email)}
                                  variant="destructive"
                                  size="sm"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                        {adminUsers.length === 0 && !isLoadingAdmins && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No admins added yet
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How Admin Management Works</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xs">
                          1
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Super Admin (You)</p>
                        <p className="text-muted-foreground">
                          Your email is set as the super admin via environment variable. You can add/remove other admins and cannot be removed.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xs">
                          2
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Adding Admins</p>
                        <p className="text-muted-foreground">
                          Enter any email address to grant admin access. The user must create an account with that exact email to access the dashboard.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xs">
                          3
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Admin List Storage</p>
                        <p className="text-muted-foreground">
                          Admin emails are stored in Firestore at <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">admins/&#123;email&#125;</code>. This is production-safe and not committed to Git.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xs">
                          4
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Production Setup</p>
                        <p className="text-muted-foreground">
                          Set <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">NEXT_PUBLIC_SUPER_ADMIN_EMAIL</code> in Firebase environment variables for your super admin email.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}




