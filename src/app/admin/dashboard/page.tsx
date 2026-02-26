'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  KeyRound,
  Loader2,
  Trash2,
  UserX,
  BarChart3,
  Megaphone
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
import { getUserDisplayName } from '@/lib/user-display';
import { useTenantLink } from '@/hooks/useTenantLink';
import {
  defaultAdminPricingConfig,
  loadAdminPricingConfig,
  saveAdminPricingConfig,
  type AdminPricingConfig,
  type PricePolicyMode,
  type PricingCategory,
  type PricingDiscountCampaign,
  WAEC5_COUNTRY_IDS,
} from '@/lib/pricing/admin-pricing-config';

const DISCOUNT_CATEGORY_OPTIONS: Array<{
  id: Exclude<PricingCategory, 'all'>;
  label: string;
  group: 'student' | 'institution';
}> = [
  { id: 'challengeArena', label: 'Challenge Arena', group: 'student' },
  { id: 'virtualLab', label: 'Virtual Lab', group: 'student' },
  { id: 'fullBundle', label: 'Full Bundle', group: 'student' },
  { id: 'premiumStudent', label: 'Premium Student', group: 'student' },
  { id: 'premiumPlus', label: 'Premium Plus', group: 'student' },
  { id: 'institutionStarter', label: 'Institution Starter', group: 'institution' },
  { id: 'institutionGrowth', label: 'Institution Growth', group: 'institution' },
  { id: 'institutionEnterprise', label: 'Institution Enterprise', group: 'institution' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const addTenantParam = useTenantLink();
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
  const [pricingConfig, setPricingConfig] = useState<AdminPricingConfig>(defaultAdminPricingConfig);
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);
  const [isSavingPricing, setIsSavingPricing] = useState(false);
  const [newDiscountName, setNewDiscountName] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'percent' | 'fixedUsd'>('percent');
  const [newDiscountValue, setNewDiscountValue] = useState<number>(10);
  const [newDiscountStart, setNewDiscountStart] = useState('');
  const [newDiscountEnd, setNewDiscountEnd] = useState('');
  const [newDiscountCountries, setNewDiscountCountries] = useState('all');
  const [newDiscountCategories, setNewDiscountCategories] = useState<PricingCategory[]>(['all']);
  const [selectedCountryAdjustment, setSelectedCountryAdjustment] = useState('waec5');
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
        router.push(addTenantParam('/profile'));
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
        const firestoreEmail = studentDoc.exists() ? studentDoc.data()?.email : null;
        const authEmail = user.email;
        
        // Try Firestore email first, then Auth email, then check if UID matches your account
        const email = firestoreEmail || authEmail;
        
        console.log('[Admin] User UID:', user.uid);
        console.log('[Admin] Firestore email:', firestoreEmail);
        console.log('[Admin] Firebase Auth email:', authEmail);
        console.log('[Admin] Using email for check:', email);
        
        // Special case: if this is YOUR UID, always grant access
        if (user.uid === 'OONj1qTbCwN0MiZ9IwuAJAranKb2') {
          console.log('[Admin] Detected owner UID - granting super admin access');
          setIsAuthorized(true);
          setIsSuperAdminUser(true);
          loadAllUsers();
          loadAdminUsers();
          loadPricingConfig();
          setIsCheckingAuth(false);
          return;
        }
        
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
        loadPricingConfig();
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
      
      // Import Firebase Auth to get user data
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      
      const firestoreUsers: Player[] = [];
      
      for (const doc of studentsSnapshot.docs) {
        const data = doc.data();
        const userId = doc.id;
        
        // Use the centralized getUserDisplayName utility
        const displayName = getUserDisplayName({
          studentName: data.studentName,
          userName: data.userName,
          displayName: data.displayName,
          email: data.email
        });
        
        firestoreUsers.push({
          userId,
          userName: displayName,
          name: displayName,
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
      }

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

  const loadPricingConfig = async () => {
    setIsLoadingPricing(true);
    try {
      const cfg = await loadAdminPricingConfig(firestore);
      setPricingConfig(cfg);
    } catch (error) {
      console.error('[Admin] Error loading pricing config:', error);
      toast({
        title: 'Pricing Load Failed',
        description: 'Could not load pricing config. Using defaults.',
        variant: 'destructive',
      });
      setPricingConfig(defaultAdminPricingConfig);
    } finally {
      setIsLoadingPricing(false);
    }
  };

  const updateBasePrice = (key: keyof AdminPricingConfig['baseUsd'], value: number) => {
    setPricingConfig((prev) => ({
      ...prev,
      baseUsd: {
        ...prev.baseUsd,
        [key]: Number.isFinite(value) ? Math.max(0, value) : 0,
      },
    }));
  };

  const updateFxRate = (currencyCode: string, value: number) => {
    const code = currencyCode.toUpperCase();
    setPricingConfig((prev) => ({
      ...prev,
      usdToLocalRates: {
        ...prev.usdToLocalRates,
        [code]: Number.isFinite(value) ? Math.max(0, value) : 1,
      },
    }));
  };

  const updateCountryMultiplier = (countryId: string, value: number) => {
    const key = countryId.toLowerCase();
    setPricingConfig((prev) => ({
      ...prev,
      countryAdjustments: {
        ...prev.countryAdjustments,
        [key]: {
          ...(prev.countryAdjustments[key] ?? {}),
          usdMultiplier: Number.isFinite(value) ? Math.max(0, value) : 1,
        },
      },
    }));
  };

  const updateCountryOverride = (
    countryId: string,
    category: Exclude<PricingCategory, 'all'>,
    value: number
  ) => {
    const key = countryId.toLowerCase();
    setPricingConfig((prev) => ({
      ...prev,
      countryAdjustments: {
        ...prev.countryAdjustments,
        [key]: {
          ...(prev.countryAdjustments[key] ?? {}),
          overrideUsd: {
            ...(prev.countryAdjustments[key]?.overrideUsd ?? {}),
            [category]: Number.isFinite(value) ? Math.max(0, value) : 0,
          },
        },
      },
    }));
  };

  const applyWaec5TemplateToAllCountries = () => {
    setPricingConfig((prev) => {
      const waecTemplate = prev.countryAdjustments.waec5;
      if (!waecTemplate) return prev;
      const next = { ...prev.countryAdjustments };
      for (const c of WAEC5_COUNTRY_IDS) {
        next[c] = {
          ...(next[c] ?? {}),
          usdMultiplier:
            typeof waecTemplate.usdMultiplier === 'number'
              ? waecTemplate.usdMultiplier
              : next[c]?.usdMultiplier,
          overrideUsd: {
            ...(next[c]?.overrideUsd ?? {}),
            ...(waecTemplate.overrideUsd ?? {}),
          },
        };
      }
      return {
        ...prev,
        countryAdjustments: next,
      };
    });
    toast({
      title: 'WAEC-5 template applied',
      description: 'Copied WAEC-5 affordability settings to Ghana, Nigeria, Sierra Leone, Liberia and Gambia.',
    });
  };

  const handleSavePricing = async () => {
    setIsSavingPricing(true);
    try {
      await saveAdminPricingConfig(
        {
          ...pricingConfig,
          updatedBy: user?.email || user?.uid || 'admin',
        },
        firestore
      );
      toast({
        title: 'Pricing Saved',
        description: 'Global pricing and promotions updated successfully.',
      });
    } catch (error) {
      console.error('[Admin] Error saving pricing config:', error);
      toast({
        title: 'Save Failed',
        description: 'Could not save pricing config.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingPricing(false);
    }
  };

  const toggleDiscountCategory = (category: PricingCategory) => {
    setNewDiscountCategories((prev) => {
      if (category === 'all') return ['all'];
      const withoutAll = prev.filter((c) => c !== 'all');
      const exists = withoutAll.includes(category);
      if (exists) {
        const next = withoutAll.filter((c) => c !== category);
        return next.length > 0 ? next : ['all'];
      }
      return [...withoutAll, category];
    });
  };

  const handleAddDiscount = () => {
    if (!newDiscountName.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter a discount name.',
        variant: 'destructive',
      });
      return;
    }
    const countries = newDiscountCountries
      .split(',')
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);
    const discount: PricingDiscountCampaign = {
      id: `disc_${Date.now()}`,
      name: newDiscountName.trim(),
      enabled: true,
      type: newDiscountType,
      value: Math.max(0, Number(newDiscountValue) || 0),
      startsAtIso: newDiscountStart ? new Date(newDiscountStart).toISOString() : undefined,
      endsAtIso: newDiscountEnd ? new Date(newDiscountEnd).toISOString() : undefined,
      countryIds: countries.length > 0 ? countries : ['all'],
      appliesTo: newDiscountCategories.length > 0 ? newDiscountCategories : ['all'],
    };
    setPricingConfig((prev) => ({
      ...prev,
      discounts: [discount, ...prev.discounts],
    }));
    setNewDiscountName('');
    setNewDiscountValue(10);
    setNewDiscountType('percent');
    setNewDiscountStart('');
    setNewDiscountEnd('');
    setNewDiscountCountries('all');
    setNewDiscountCategories(['all']);
  };

  const toggleDiscountEnabled = (id: string) => {
    setPricingConfig((prev) => ({
      ...prev,
      discounts: prev.discounts.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d)),
    }));
  };

  const removeDiscount = (id: string) => {
    setPricingConfig((prev) => ({
      ...prev,
      discounts: prev.discounts.filter((d) => d.id !== id),
    }));
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

  // Delete user permanently
  const handleDeleteUser = async (userId: string, userName?: string) => {
    if (!firestore) {
      toast({
        title: 'Error',
        description: 'Firestore not initialized',
        variant: 'destructive',
      });
      return;
    }

    const confirmMessage = `⚠️ PERMANENT DELETE ⚠️\n\nAre you sure you want to delete this user?\n\nUser: ${userName || userId}\nUID: ${userId}\n\nThis will:\n• Delete their Firestore profile\n• Remove from localStorage\n• Delete all their data (subscriptions, progress, etc.)\n\nThis action CANNOT be undone!\n\nType 'DELETE' to confirm:`;
    
    const confirmation = prompt(confirmMessage);
    
    if (confirmation !== 'DELETE') {
      if (confirmation !== null) {
        toast({
          title: 'Cancelled',
          description: 'User deletion cancelled',
        });
      }
      return;
    }

    try {
      // Delete from Firestore
      const { doc, deleteDoc, collection, getDocs } = await import('firebase/firestore');
      
      // Delete main profile
      await deleteDoc(doc(firestore, `students/${userId}`));
      
      // Delete subscription if exists
      try {
        await deleteDoc(doc(firestore, `subscriptions/${userId}`));
      } catch (e) {
        // Subscription might not exist
      }

      // Delete from localStorage
      const localPlayers = getAllPlayers();
      const updatedPlayers = localPlayers.filter(p => p.userId !== userId);
      localStorage.setItem('challengePlayers', JSON.stringify(updatedPlayers));

      // If this was the selected user, clear selection
      if (selectedUser?.userId === userId) {
        setSelectedUser(null);
        setActiveTab('search');
      }

      // Reload users list
      await loadAllUsers();

      toast({
        title: 'User Deleted ✅',
        description: `Successfully deleted ${userName || userId}`,
      });
    } catch (error: any) {
      console.error('[Admin] Error deleting user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive',
      });
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

        {/* Quick Actions */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            onClick={() => {
              window.location.href = '/admin/tenant-access';
            }}
            variant="outline"
            className="gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 border-blue-200 dark:border-blue-800"
          >
            <KeyRound className="h-4 w-4" />
            Tenant Access Keys
          </Button>
          <Button
            onClick={() => {
              console.log('[Admin Dashboard] Navigating to analytics page...');
              window.location.href = '/admin/analytics';
            }}
            variant="outline"
            className="gap-2 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900/30 dark:hover:to-purple-900/30 border-violet-200 dark:border-violet-800"
          >
            <BarChart3 className="h-4 w-4" />
            📊 View Usage Analytics
          </Button>
          <Button
            onClick={() => {
              window.location.href = '/admin/media';
            }}
            variant="outline"
            className="gap-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-900/30 dark:hover:to-green-900/30 border-emerald-200 dark:border-emerald-800"
          >
            <Megaphone className="h-4 w-4" />
            📣 Open Media Library
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="search">Search User</TabsTrigger>
            <TabsTrigger value="manage" disabled={!selectedUser}>Manage User</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            {isAuthorized && <TabsTrigger value="pricing">Pricing</TabsTrigger>}
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
                      <p className="font-mono text-xs break-all">{selectedUser.userId}</p>
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

                    {/* Danger Zone - Delete User */}
                    <div className="pt-4 border-t border-red-200 dark:border-red-900">
                      <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Danger Zone
                      </p>
                      <Button
                        onClick={() => handleDeleteUser(selectedUser.userId, selectedUser.name || selectedUser.email)}
                        variant="destructive"
                        className="w-full"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User Permanently
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        This will permanently delete the user and all their data. This action cannot be undone.
                      </p>
                    </div>
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
                            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div 
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setSearchQuery(user.userId);
                                  setActiveTab('manage');
                                }}
                              >
                                <p className="font-semibold text-sm truncate">{user.name || user.userName || 'No Name'}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.userId}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">Free</Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUser(user.userId, user.name || user.userName);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
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
                              className="p-3 rounded-lg border-2 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors group"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div 
                                  className="flex-1 min-w-0 cursor-pointer"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setSearchQuery(user.userId);
                                    setActiveTab('manage');
                                  }}
                                >
                                  <p className="font-semibold text-sm truncate">{user.name || user.userName || 'No Name'}</p>
                                  <p className="text-xs text-muted-foreground truncate">{user.userId}</p>
                                </div>
                                <div className="flex items-center gap-2">
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
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteUser(user.userId, user.name || user.userName);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
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
                            className="p-3 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 hover:from-blue-50 dark:hover:from-blue-950/30 transition-colors group"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div 
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setSearchQuery(user.userId);
                                  setActiveTab('manage');
                                }}
                              >
                                <p className="font-semibold text-sm truncate">{user.name || user.userName || 'No Name'}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.userId}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white text-xs">
                                  <Crown className="h-2.5 w-2.5 mr-0.5" />
                                  Bundle
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUser(user.userId, user.name || user.userName);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
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

          {/* Pricing Management Tab */}
          {isAuthorized && (
            <TabsContent value="pricing">
              <div className="space-y-6">
                <Card className="border-2 border-emerald-200 dark:border-emerald-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                      Global Pricing Dashboard
                    </CardTitle>
                    <CardDescription>
                      Edit base USD prices once, then country pages convert automatically. Add discounts for promotions and special occasions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isLoadingPricing ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading pricing configuration...
                      </div>
                    ) : (
                      <>
                        <div>
                          <h3 className="text-sm font-semibold mb-3">Student Plans (USD base)</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {([
                              ['premiumStudentMonthly', 'Premium Student Monthly'],
                              ['premiumPlusMonthly', 'Premium Plus Monthly'],
                              ['challengeArenaMonthly', 'Challenge Arena Monthly'],
                              ['challengeArenaAnnual', 'Challenge Arena Annual'],
                              ['virtualLabMonthly', 'Virtual Lab Monthly'],
                              ['virtualLabAnnual', 'Virtual Lab Annual'],
                              ['fullBundleMonthly', 'Full Bundle Monthly'],
                              ['fullBundleAnnual', 'Full Bundle Annual'],
                            ] as Array<[keyof AdminPricingConfig['baseUsd'], string]>).map(([key, label]) => (
                              <div key={key} className="space-y-1">
                                <label className="text-xs text-muted-foreground">{label}</label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={pricingConfig.baseUsd[key]}
                                  onChange={(e) => updateBasePrice(key, Number(e.target.value))}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold mb-3">Institution Plans (USD base)</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {([
                              ['institutionStarterMonthly', 'Starter / month'],
                              ['institutionGrowthMonthly', 'Growth / month'],
                              ['institutionEnterpriseMonthly', 'Enterprise / month'],
                            ] as Array<[keyof AdminPricingConfig['baseUsd'], string]>).map(([key, label]) => (
                              <div key={key} className="space-y-1">
                                <label className="text-xs text-muted-foreground">{label}</label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={pricingConfig.baseUsd[key]}
                                  onChange={(e) => updateBasePrice(key, Number(e.target.value))}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-lg border p-3">
                          <h3 className="text-sm font-semibold mb-2">Price Policy Mode</h3>
                          <p className="text-xs text-muted-foreground mb-3">
                            Choose how WAEC-5 shared pricing should apply across Ghana, Nigeria, Sierra Leone, Liberia, and Gambia.
                          </p>
                          <select
                            value={pricingConfig.pricePolicyMode}
                            onChange={(e) =>
                              setPricingConfig((prev) => ({
                                ...prev,
                                pricePolicyMode: e.target.value as PricePolicyMode,
                              }))
                            }
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm w-full md:w-[360px]"
                          >
                            <option value="strict_shared">Strict Shared (WAEC-5 must use shared settings)</option>
                            <option value="shared_with_exceptions">Shared with Exceptions (country override first, then shared fallback)</option>
                            <option value="fully_country_specific">Fully Country Specific (ignore WAEC-5 shared fallback)</option>
                          </select>
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold mb-3">USD Conversion Rates (1 USD = ?)</h3>
                          <p className="text-xs text-muted-foreground mb-3">
                            Update country conversion rates used for localized pricing display.
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {Object.entries(pricingConfig.usdToLocalRates).map(([code, rate]) => (
                              <div key={code} className="space-y-1">
                                <label className="text-xs text-muted-foreground">{code}</label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={rate}
                                  onChange={(e) => updateFxRate(code, Number(e.target.value))}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold mb-3">Country Affordability & Overrides</h3>
                          <p className="text-xs text-muted-foreground mb-3">
                            Set affordability for one country, or use <strong>WAEC-5 shared settings</strong> so all five countries stay equivalent.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <div className="space-y-1">
                              <label className="text-xs text-muted-foreground">Country / Group</label>
                              <select
                                value={selectedCountryAdjustment}
                                onChange={(e) => setSelectedCountryAdjustment(e.target.value.toLowerCase())}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm w-full"
                              >
                                <option value="waec5">WAEC-5 Shared (Ghana, Nigeria, Sierra Leone, Liberia, Gambia)</option>
                                <option value="ghana">Ghana</option>
                                <option value="nigeria">Nigeria</option>
                                <option value="sierra-leone">Sierra Leone</option>
                                <option value="liberia">Liberia</option>
                                <option value="gambia">Gambia</option>
                                <option value="global">Global</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-muted-foreground">USD Multiplier</label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={pricingConfig.countryAdjustments[selectedCountryAdjustment.toLowerCase()]?.usdMultiplier ?? 1}
                                onChange={(e) =>
                                  updateCountryMultiplier(
                                    selectedCountryAdjustment,
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1 flex items-end">
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={applyWaec5TemplateToAllCountries}
                              >
                                Copy WAEC-5 to all countries
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            Tip: Keep <code>waec5</code> updated for equivalent pricing across all five countries. Use country-specific overrides only when needed.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {([
                              ['challengeArena', 'Challenge Arena'],
                              ['virtualLab', 'Virtual Lab'],
                              ['fullBundle', 'Full Bundle'],
                              ['premiumStudent', 'Premium Student'],
                              ['premiumPlus', 'Premium Plus'],
                              ['institutionStarter', 'Institution Starter'],
                              ['institutionGrowth', 'Institution Growth'],
                              ['institutionEnterprise', 'Institution Enterprise'],
                            ] as Array<[Exclude<PricingCategory, 'all'>, string]>).map(([key, label]) => (
                              <div key={key} className="space-y-1">
                                <label className="text-xs text-muted-foreground">{label} Override (USD)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={
                                    pricingConfig.countryAdjustments[selectedCountryAdjustment.toLowerCase()]?.overrideUsd?.[key] ??
                                    ''
                                  }
                                  onChange={(e) =>
                                    updateCountryOverride(
                                      selectedCountryAdjustment,
                                      key,
                                      Number(e.target.value)
                                    )
                                  }
                                  placeholder="Leave blank to use multiplier/base"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <h3 className="text-sm font-semibold mb-3">Promotion / Discount Campaigns</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                            <Input
                              placeholder="Campaign name (e.g. Back to School)"
                              value={newDiscountName}
                              onChange={(e) => setNewDiscountName(e.target.value)}
                            />
                            <select
                              value={newDiscountType}
                              onChange={(e) => setNewDiscountType(e.target.value as 'percent' | 'fixedUsd')}
                              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                              <option value="percent">Percent discount</option>
                              <option value="fixedUsd">Fixed USD discount</option>
                            </select>
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              placeholder={newDiscountType === 'percent' ? '10 = 10%' : '5 = $5 off'}
                              value={newDiscountValue}
                              onChange={(e) => setNewDiscountValue(Number(e.target.value))}
                            />
                            <div className="space-y-1 lg:col-span-2">
                              <label className="text-xs text-muted-foreground">Promo categories (multi-select)</label>
                              <div className="flex flex-wrap gap-1.5">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={newDiscountCategories.includes('all') ? 'default' : 'outline'}
                                  onClick={() => toggleDiscountCategory('all')}
                                >
                                  All categories
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setNewDiscountCategories(
                                      DISCOUNT_CATEGORY_OPTIONS.filter((o) => o.group === 'student').map((o) => o.id)
                                    )
                                  }
                                >
                                  Student plans
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setNewDiscountCategories(
                                      DISCOUNT_CATEGORY_OPTIONS.filter((o) => o.group === 'institution').map((o) => o.id)
                                    )
                                  }
                                >
                                  Institution plans
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setNewDiscountCategories(['all'])}
                                >
                                  Reset
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                                {DISCOUNT_CATEGORY_OPTIONS.map((opt) => (
                                  <Button
                                    key={opt.id}
                                    type="button"
                                    size="sm"
                                    variant={newDiscountCategories.includes(opt.id) ? 'default' : 'outline'}
                                    onClick={() => toggleDiscountCategory(opt.id)}
                                    className="justify-start"
                                  >
                                    {opt.label}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-muted-foreground">Start (optional)</label>
                              <Input type="date" value={newDiscountStart} onChange={(e) => setNewDiscountStart(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-muted-foreground">End (optional)</label>
                              <Input type="date" value={newDiscountEnd} onChange={(e) => setNewDiscountEnd(e.target.value)} />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                              <label className="text-xs text-muted-foreground">Country scope (comma-separated: all, global, ghana, nigeria...)</label>
                              <Input
                                value={newDiscountCountries}
                                onChange={(e) => setNewDiscountCountries(e.target.value)}
                                placeholder="all"
                              />
                            </div>
                          </div>
                          <Button onClick={handleAddDiscount} variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Discount Campaign
                          </Button>

                          <div className="mt-4 space-y-2">
                            {pricingConfig.discounts.length === 0 && (
                              <p className="text-sm text-muted-foreground">No discount campaigns yet.</p>
                            )}
                            {pricingConfig.discounts.map((d) => (
                              <div key={d.id} className="p-3 rounded-lg border flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div>
                                  <p className="font-semibold">{d.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {d.type === 'percent' ? `${d.value}% off` : `$${d.value} off`} • Categories: {d.appliesTo.join(', ')} • Countries: {d.countryIds.join(', ')}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {d.startsAtIso ? `Start: ${new Date(d.startsAtIso).toLocaleDateString()}` : 'Start: immediately'} • {d.endsAtIso ? `End: ${new Date(d.endsAtIso).toLocaleDateString()}` : 'No end date'}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant={d.enabled ? 'default' : 'outline'} onClick={() => toggleDiscountEnabled(d.id)}>
                                    {d.enabled ? 'Enabled' : 'Disabled'}
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => removeDiscount(d.id)}>
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button onClick={handleSavePricing} disabled={isSavingPricing}>
                            {isSavingPricing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                            Save Pricing Changes
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

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




