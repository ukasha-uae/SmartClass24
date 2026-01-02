'use client';

import React, { useState, useEffect } from 'react';
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
  DollarSign
} from 'lucide-react';
import { getPlayerProfile, getAllPlayers, createOrUpdatePlayer, Player } from '@/lib/challenge';
import { 
  getUserSubscription, 
  addSubscription, 
  updateSubscription,
  isPremiumUser,
  COIN_PACKAGES
} from '@/lib/monetization';
import { getUserTransactions, getTransactionStats } from '@/lib/transaction-history';
import { useToast } from '@/hooks/use-toast';
import { formatGHS } from '@/lib/payments';

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<Player | null>(null);
  const [users, setUsers] = useState<Player[]>([]);
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [subscriptionPlan, setSubscriptionPlan] = useState<'premium_monthly' | 'premium_annual'>('premium_monthly');
  const [activeTab, setActiveTab] = useState('search');
  const { toast } = useToast();

  useEffect(() => {
    loadAllUsers();
  }, []);

  const loadAllUsers = () => {
    const allUsers = getAllPlayers();
    setUsers(allUsers);
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
      addSubscription(selectedUser.userId, subscriptionPlan, subscriptionPlan.includes('annual') ? 'annual' : 'monthly');
      
      const updatedUser = getPlayerProfile(selectedUser.userId);
      setSelectedUser(updatedUser);

      toast({
        title: 'Premium Activated! ✅',
        description: `Premium subscription activated for ${selectedUser.name || selectedUser.userId}`,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage user coins, subscriptions, and premium access
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="search">Search User</TabsTrigger>
            <TabsTrigger value="manage" disabled={!selectedUser}>Manage User</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="search">
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
                      <p className="text-sm text-muted-foreground">Premium Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        {isPremium ? (
                          <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium Active
                          </Badge>
                        ) : (
                          <Badge variant="outline">Free User</Badge>
                        )}
                      </div>
                      {userSubscription && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Plan: {userSubscription.planId || 'N/A'}
                        </p>
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
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!isPremium ? (
                      <div>
                        <label className="text-sm font-semibold mb-2 block">Activate Premium</label>
                        <div className="flex gap-2">
                          <select
                            value={subscriptionPlan}
                            onChange={(e) => setSubscriptionPlan(e.target.value as 'premium_monthly' | 'premium_annual')}
                            className="flex-1 px-3 py-2 border rounded-lg"
                          >
                            <option value="premium_monthly">Monthly (₵25.00)</option>
                            <option value="premium_annual">Annual (₵200.00)</option>
                          </select>
                          <Button onClick={handleActivatePremium} className="bg-gradient-to-r from-amber-500 to-orange-600">
                            <Crown className="h-4 w-4 mr-2" />
                            Activate Premium
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold flex items-center gap-2">
                                <Crown className="h-4 w-4 text-amber-600" />
                                Premium Active
                              </p>
                              {userSubscription && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Plan: {userSubscription.planId || 'N/A'}
                                  {userSubscription.endDate && (
                                    <span className="ml-2">
                                      • Expires: {new Date(userSubscription.endDate).toLocaleDateString()}
                                    </span>
                                  )}
                                </p>
                              )}
                            </div>
                            <Button
                              onClick={handleCancelPremium}
                              variant="destructive"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel Premium
                            </Button>
                          </div>
                        </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <p className="text-sm text-muted-foreground">Premium Users</p>
                      <p className="text-2xl font-bold">
                        {users.filter(u => isPremiumUser(u.userId)).length}
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
                      <p className="text-sm text-muted-foreground">Total Coins Distributed</p>
                      <p className="text-2xl font-bold">
                        {users.reduce((sum, u) => sum + (u.coins || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <Coins className="h-8 w-8 text-yellow-600 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}




