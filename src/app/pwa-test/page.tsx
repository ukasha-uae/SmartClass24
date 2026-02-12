"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Smartphone, Download, Wifi, WifiOff, Bell, CheckCircle, 
  XCircle, AlertTriangle, RefreshCw, Home, Database, Zap
} from 'lucide-react';
import Link from 'next/link';

export default function PWATestPage() {
  const [installed, setInstalled] = useState(false);
  const [installable, setInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [manifestData, setManifestData] = useState<any>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isSecureContext, setIsSecureContext] = useState(true);
  const [userAgent, setUserAgent] = useState('');
  const [testResults, setTestResults] = useState({
    manifest: false,
    serviceWorker: false,
    offline: false,
    icons: false,
    installPrompt: false,
  });

  useEffect(() => {
    // Check if running as PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    setInstalled(isPWA);

    // Check if HTTPS (secure context)
    setIsSecureContext(window.isSecureContext);
    
    // Get user agent to detect browser/device
    setUserAgent(navigator.userAgent);

    // Check online status
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
      setTestResults(prev => ({ ...prev, installPrompt: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        setSwRegistration(registration);
        setTestResults(prev => ({ ...prev, serviceWorker: true }));
      });
    }

    // Load manifest
    fetch('/manifest.json')
      .then(res => res.json())
      .then(data => {
        setManifestData(data);
        setTestResults(prev => ({ ...prev, manifest: true }));
      })
      .catch(err => console.error('Manifest error:', err));

    // Check if icons exist
    Promise.all([
      fetch('/icons/icon-192x192.png').then(r => r.ok),
      fetch('/icons/icon-512x512.png').then(r => r.ok)
    ]).then(results => {
      setTestResults(prev => ({ ...prev, icons: results.every(r => r) }));
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setInstalled(true);
    }
    
    setDeferredPrompt(null);
    setInstallable(false);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        new Notification('PWA Test', {
          body: 'Notifications are working! 🎉',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png'
        });
      }
    }
  };

  const testOfflineMode = () => {
    if (!isOnline) {
      setTestResults(prev => ({ ...prev, offline: true }));
    }
  };

  const updateServiceWorker = async () => {
    if (swRegistration) {
      await swRegistration.update();
      window.location.reload();
    }
  };

  const unregisterServiceWorker = async () => {
    if (swRegistration) {
      await swRegistration.unregister();
      window.location.reload();
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  const overallScore = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;
  const scorePercentage = (overallScore / totalTests) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Smartphone className="h-10 w-10 text-violet-600" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">PWA Testing Dashboard</h1>
              <p className="text-muted-foreground">Progressive Web App Features Test</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        {/* Overall Score */}
        <Card className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">PWA Readiness Score</p>
                <p className="text-4xl font-bold">{scorePercentage.toFixed(0)}%</p>
                <p className="text-sm opacity-90 mt-1">{overallScore} of {totalTests} tests passed</p>
              </div>
              <div className="text-6xl opacity-20">
                {scorePercentage === 100 ? '🎉' : scorePercentage >= 80 ? '👍' : '⚠️'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Installation Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Installation Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-accent">
            <div className="flex items-center gap-3">
              {installed ? (
                <>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-700 dark:text-green-400">App Installed</p>
                    <p className="text-sm text-muted-foreground">Running as standalone PWA</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="font-semibold">Not Installed</p>
                    <p className="text-sm text-muted-foreground">Running in browser</p>
                  </div>
                </>
              )}
            </div>
            {installable && !installed && (
              <Button onClick={handleInstallClick} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            )}
          </div>

          {!installable && !installed && (
            <>
              {/* HTTPS Warning - Most Common Issue on Mobile */}
              {!isSecureContext && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>⚠️ HTTPS Required</AlertTitle>
                  <AlertDescription className="space-y-3">
                    <p className="font-semibold">You're accessing the site over HTTP (not secure). PWAs require HTTPS to install.</p>
                    
                    <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-md">
                      <p className="font-semibold mb-2">Current URL:</p>
                      <code className="text-xs bg-red-100 dark:bg-red-900 px-2 py-1 rounded">
                        {typeof window !== 'undefined' ? window.location.href : ''}
                      </code>
                    </div>

                    <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-md">
                      <p className="font-semibold mb-2">Solutions:</p>
                      <ol className="list-decimal ml-4 space-y-2 text-sm">
                        <li>
                          <strong>Deploy to a hosting service (Recommended):</strong>
                          <ul className="list-disc ml-4 mt-1">
                            <li>Vercel (automatic HTTPS)</li>
                            <li>Netlify (automatic HTTPS)</li>
                            <li>Firebase Hosting (automatic HTTPS)</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Use ngrok for testing:</strong>
                          <ul className="list-disc ml-4 mt-1">
                            <li>Install: <code className="bg-red-100 dark:bg-red-900 px-1 rounded text-xs">npm i -g ngrok</code></li>
                            <li>Run: <code className="bg-red-100 dark:bg-red-900 px-1 rounded text-xs">ngrok http 9002</code></li>
                            <li>Use the HTTPS URL provided by ngrok</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Use localhost on the same device</strong> (HTTPS not required for localhost)
                        </li>
                      </ol>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* iOS Safari Detection */}
              {userAgent.includes('iPhone') || userAgent.includes('iPad') ? (
                <Alert className="border-blue-200 dark:border-blue-800">
                  <Smartphone className="h-4 w-4" />
                  <AlertTitle>iOS Detected - Different Installation Method</AlertTitle>
                  <AlertDescription>
                    iOS doesn't support automatic install prompts. Please scroll down to see the <strong>"Installing on iPhone/iPad"</strong> section for step-by-step instructions.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Installation Not Available</AlertTitle>
                  <AlertDescription>
                    The install prompt is not available. This may be because:
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li>Not using HTTPS (check above)</li>
                      <li>You're on desktop (try mobile Chrome/Edge)</li>
                      <li>App is already installed</li>
                      <li>You've dismissed the prompt before</li>
                      <li>Using iOS Safari (see instructions below)</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* iOS Installation Instructions */}
      <Card className="mb-6 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Smartphone className="h-5 w-5" />
            Installing on iPhone/iPad (iOS/Safari)
          </CardTitle>
          <CardDescription>iOS doesn't support automatic install prompts. Follow these steps:</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <Badge variant="outline" className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">1</Badge>
              <div>
                <p className="font-medium">Open Safari</p>
                <p className="text-muted-foreground">Make sure you're using Safari browser (not Chrome or others)</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Badge variant="outline" className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">2</Badge>
              <div>
                <p className="font-medium">Tap the Share button</p>
                <p className="text-muted-foreground">The square with an arrow pointing up (bottom center or top right)</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Badge variant="outline" className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">3</Badge>
              <div>
                <p className="font-medium">Scroll down and tap "Add to Home Screen"</p>
                <p className="text-muted-foreground">You might need to scroll to find this option</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Badge variant="outline" className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">4</Badge>
              <div>
                <p className="font-medium">Tap "Add"</p>
                <p className="text-muted-foreground">The SmartClass24 app icon will appear on your home screen!</p>
              </div>
            </li>
          </ol>
          <Alert className="mt-4 border-blue-300 dark:border-blue-700">
            <AlertDescription className="text-sm">
              <strong>Note:</strong> After installation, open the app from your home screen (not from Safari) to use it in fullscreen mode with offline capabilities.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Test Results Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Manifest Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Manifest
              </span>
              {getStatusIcon(testResults.manifest)}
            </CardTitle>
            <CardDescription>Web app manifest configuration</CardDescription>
          </CardHeader>
          <CardContent>
            {manifestData ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{manifestData.short_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Theme:</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-4 w-4 rounded border"
                      style={{ backgroundColor: manifestData.theme_color }}
                    />
                    <span className="font-medium">{manifestData.theme_color}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Display:</span>
                  <Badge variant="secondary">{manifestData.display}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Icons:</span>
                  <span className="font-medium">{manifestData.icons?.length || 0}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Loading manifest data...</p>
            )}
          </CardContent>
        </Card>

        {/* Service Worker Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Service Worker
              </span>
              {getStatusIcon(testResults.serviceWorker)}
            </CardTitle>
            <CardDescription>Background sync and caching</CardDescription>
          </CardHeader>
          <CardContent>
            {swRegistration ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    ✓ Service Worker Active
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Scope: {swRegistration.scope}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={updateServiceWorker}
                    className="flex-1"
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Update
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={unregisterServiceWorker}
                    className="flex-1"
                  >
                    Unregister
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No service worker registered</p>
            )}
          </CardContent>
        </Card>

        {/* Icons Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                App Icons
              </span>
              {getStatusIcon(testResults.icons)}
            </CardTitle>
            <CardDescription>PWA icon assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <div className="space-y-2">
                <img 
                  src="/icons/icon-192x192.png" 
                  alt="192x192 icon"
                  className="h-16 w-16 rounded-lg shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/192x192?text=192x192';
                  }}
                />
                <p className="text-xs text-center text-muted-foreground">192×192</p>
              </div>
              <div className="space-y-2">
                <img 
                  src="/icons/icon-512x512.png" 
                  alt="512x512 icon"
                  className="h-16 w-16 rounded-lg shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/512x512?text=512x512';
                  }}
                />
                <p className="text-xs text-center text-muted-foreground">512×512</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Status Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
                Network Status
              </span>
              {isOnline ? (
                <Badge variant="default" className="bg-green-600">Online</Badge>
              ) : (
                <Badge variant="destructive">Offline</Badge>
              )}
            </CardTitle>
            <CardDescription>Offline functionality test</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg border ${
                isOnline 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <p className={`text-sm font-medium ${
                  isOnline 
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-red-700 dark:text-red-400'
                }`}>
                  {isOnline ? '✓ Connected to Internet' : '✗ No Internet Connection'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isOnline 
                    ? 'Try disconnecting to test offline mode'
                    : 'App should still work with cached content'}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={testOfflineMode}
                disabled={isOnline}
                className="w-full"
              >
                Test Offline Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>Test notification permissions and delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-accent">
              <div className="flex items-center gap-3">
                <Bell className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Notification Permission</p>
                  <p className="text-sm text-muted-foreground">
                    Current status: 
                    <Badge variant="secondary" className="ml-2">
                      {notificationPermission}
                    </Badge>
                  </p>
                </div>
              </div>
              {notificationPermission === 'default' && (
                <Button onClick={requestNotificationPermission} size="sm">
                  Request Permission
                </Button>
              )}
            </div>

            {notificationPermission === 'denied' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Notifications Blocked</AlertTitle>
                <AlertDescription className="space-y-3">
                  <p>You've blocked notifications. To enable them:</p>
                  
                  {/* Chrome/Edge Android Instructions */}
                  <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-md text-sm">
                    <p className="font-semibold mb-2">Chrome/Edge on Android:</p>
                    <ol className="list-decimal ml-4 space-y-1">
                      <li>Tap the <strong>lock icon</strong> (or 3 dots) in the address bar</li>
                      <li>Tap <strong>"Permissions"</strong> or <strong>"Site settings"</strong></li>
                      <li>Find <strong>"Notifications"</strong></li>
                      <li>Change from "Blocked" to <strong>"Allow"</strong></li>
                      <li>Refresh this page</li>
                    </ol>
                  </div>
                  
                  {/* Safari iOS Instructions */}
                  <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-md text-sm">
                    <p className="font-semibold mb-2">Safari on iPhone/iPad:</p>
                    <ol className="list-decimal ml-4 space-y-1">
                      <li>Go to <strong>Settings</strong> app</li>
                      <li>Scroll down and tap <strong>Safari</strong></li>
                      <li>Tap <strong>Notifications</strong></li>
                      <li>Find this website and enable notifications</li>
                      <li>Return to Safari and refresh</li>
                    </ol>
                  </div>
                  
                  {/* Desktop Instructions */}
                  <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-md text-sm">
                    <p className="font-semibold mb-2">Chrome/Edge on Desktop:</p>
                    <ol className="list-decimal ml-4 space-y-1">
                      <li>Click the <strong>lock icon</strong> in the address bar</li>
                      <li>Find <strong>"Notifications"</strong> in the dropdown</li>
                      <li>Change to <strong>"Allow"</strong></li>
                      <li>Refresh this page</li>
                    </ol>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {notificationPermission === 'granted' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Notifications Enabled</AlertTitle>
                <AlertDescription>
                  Push notifications are working! You'll receive updates about your progress.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Testing Guide */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Testing Guide</CardTitle>
          <CardDescription>How to test PWA features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">📱 Install on Mobile</h4>
              <ol className="list-decimal ml-5 space-y-1 text-sm text-muted-foreground">
                <li>Open this page on your phone</li>
                <li>Look for "Add to Home Screen" option</li>
                <li>Follow the prompts to install</li>
                <li>Launch app from home screen</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">💻 Install on Desktop</h4>
              <ol className="list-decimal ml-5 space-y-1 text-sm text-muted-foreground">
                <li>Open in Chrome/Edge</li>
                <li>Click the install icon in address bar</li>
                <li>Or go to menu → Install SmartClass24</li>
                <li>App will open in standalone window</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">📡 Test Offline Mode</h4>
              <ol className="list-decimal ml-5 space-y-1 text-sm text-muted-foreground">
                <li>Visit several pages while online</li>
                <li>Enable airplane mode or disconnect Wi-Fi</li>
                <li>Try navigating to cached pages</li>
                <li>App should still work with cached content</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">🔔 Test Notifications</h4>
              <ol className="list-decimal ml-5 space-y-1 text-sm text-muted-foreground">
                <li>Click "Request Permission" above</li>
                <li>Allow notifications in browser prompt</li>
                <li>You should see a test notification</li>
                <li>Check notification center</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
