'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TeacherVoice } from '@/components/virtual-labs/TeacherVoice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Beaker, Calculator, BookOpen } from 'lucide-react';

/**
 * Demo component showcasing Phase 1 enhancements to TeacherVoice
 * This demonstrates all the new visual features and themes
 */
export function TeacherVoiceDemo() {
    const [activeTheme, setActiveTheme] = React.useState<'science' | 'accounting' | 'math' | 'default'>('science');
    const [message, setMessage] = React.useState('');

    const demoMessages = {
        science: "Welcome to the virtual laboratory! Today, we'll be conducting an exciting experiment to test for the presence of oxygen gas. Make sure you have your safety goggles on before we begin.",
        accounting: "Hello, future accountants! Today we'll learn how to record cash transactions in the cash book. Remember, accuracy is key in accounting, so let's take our time and do this right.",
        math: "Good morning, mathematicians! Today we're going to solve quadratic equations using the quadratic formula. Don't worry if it seems complicated at first - we'll break it down step by step.",
        default: "Hello there! I'm your virtual teacher, here to guide you through your learning journey. Feel free to drag me around, minimize me, or click the repeat button if you want to hear something again."
    };

    const themes = [
        {
            id: 'science' as const,
            name: 'Science',
            icon: Beaker,
            color: 'blue',
            description: 'Perfect for Physics, Chemistry, Biology',
            gradient: 'from-blue-500 to-indigo-600'
        },
        {
            id: 'accounting' as const,
            name: 'Accounting',
            icon: Calculator,
            color: 'green',
            description: 'Perfect for Financial Accounting, Business',
            gradient: 'from-green-500 to-teal-600'
        },
        {
            id: 'math' as const,
            name: 'Mathematics',
            icon: Sparkles,
            color: 'purple',
            description: 'Perfect for Math, Statistics',
            gradient: 'from-purple-500 to-violet-600'
        },
        {
            id: 'default' as const,
            name: 'Default',
            icon: BookOpen,
            color: 'indigo',
            description: 'General purpose, mixed content',
            gradient: 'from-purple-500 to-indigo-600'
        }
    ];

    const handleThemeChange = (themeId: 'science' | 'accounting' | 'math' | 'default') => {
        setActiveTheme(themeId);
        setMessage(demoMessages[themeId]);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    TeacherVoice Phase 1 Enhancements
                </h1>
                <p className="text-muted-foreground">
                    Enhanced visual design with animated avatars, glass morphism, and theme-based styling
                </p>
            </div>

            {/* Features Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        What's New in Phase 1
                    </CardTitle>
                    <CardDescription>
                        Visual enhancements that make the teacher more appealing and engaging
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                                <span className="text-2xl">🎨</span>
                                Visual Improvements
                            </h3>
                            <ul className="text-sm text-muted-foreground space-y-1 ml-8">
                                <li>• Animated SVG teacher avatar with realistic features</li>
                                <li>• Glass morphism design with backdrop blur</li>
                                <li>• Lip-sync animation (mouth moves when speaking)</li>
                                <li>• Blinking eyes and natural breathing animation</li>
                                <li>• Professional attire with color-coded themes</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                                <span className="text-2xl">✨</span>
                                Interactive Features
                            </h3>
                            <ul className="text-sm text-muted-foreground space-y-1 ml-8">
                                <li>• Repeat button to replay messages</li>
                                <li>• Sound wave indicators when speaking</li>
                                <li>• Sparkle effects to grab attention</li>
                                <li>• Smooth hover and tap animations</li>
                                <li>• Enhanced onboarding modal</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Theme Selector */}
            <Card>
                <CardHeader>
                    <CardTitle>Try Different Themes</CardTitle>
                    <CardDescription>
                        Click a theme to see how the teacher adapts to different subjects
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {themes.map((theme) => {
                            const Icon = theme.icon;
                            return (
                                <button
                                    key={theme.id}
                                    onClick={() => handleThemeChange(theme.id)}
                                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 text-left ${
                                        activeTheme === theme.id
                                            ? 'border-primary bg-primary/5 shadow-lg'
                                            : 'border-border hover:border-primary/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`p-2 rounded-lg bg-gradient-to-br ${theme.gradient}`}>
                                            <Icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{theme.name}</h3>
                                            {activeTheme === theme.id && (
                                                <Badge variant="default" className="text-xs mt-1">Active</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{theme.description}</p>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-6">
                        <Button
                            onClick={() => handleThemeChange(activeTheme)}
                            className={`w-full bg-gradient-to-r ${themes.find(t => t.id === activeTheme)?.gradient}`}
                            size="lg"
                        >
                            Activate {themes.find(t => t.id === activeTheme)?.name} Teacher
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Live Demo */}
            {message && (
                <TeacherVoice
                    message={message}
                    theme={activeTheme}
                    teacherName={themes.find(t => t.id === activeTheme)?.name + ' Teacher'}
                />
            )}

            {/* Usage Examples */}
            <Card>
                <CardHeader>
                    <CardTitle>Code Examples</CardTitle>
                    <CardDescription>
                        How to use the enhanced TeacherVoice in your lessons
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="science">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="science">Science</TabsTrigger>
                            <TabsTrigger value="accounting">Accounting</TabsTrigger>
                            <TabsTrigger value="math">Math</TabsTrigger>
                            <TabsTrigger value="default">Default</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="science" className="space-y-2">
                            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`<TeacherVoice 
  message="Today we'll explore the properties of oxygen gas."
  theme="science"
  teacherName="Lab Instructor"
/>`}
                            </pre>
                        </TabsContent>
                        
                        <TabsContent value="accounting" className="space-y-2">
                            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`<TeacherVoice 
  message="Let's learn how to record cash transactions properly."
  theme="accounting"
  teacherName="Accounting Teacher"
/>`}
                            </pre>
                        </TabsContent>
                        
                        <TabsContent value="math" className="space-y-2">
                            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`<TeacherVoice 
  message="Today we'll solve quadratic equations together."
  theme="math"
  teacherName="Prof. Math"
/>`}
                            </pre>
                        </TabsContent>
                        
                        <TabsContent value="default" className="space-y-2">
                            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`<TeacherVoice 
  message="Welcome to the lesson!"
  // No theme prop = uses default
/>`}
                            </pre>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">🎭 Animated Avatar</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Professional teacher with blinking eyes, moving mouth during speech, and gentle breathing animation when idle.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">🎨 Glass Morphism</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Modern frosted glass effect with backdrop blur, gradient backgrounds, and animated shimmer effects.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">🎯 Theme Colors</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Subject-specific color schemes: Blue for science, green for accounting, purple for math.
                    </CardContent>
                </Card>
            </div>

            {/* Footer Note */}
            <Card className="border-purple-200 bg-purple-50/50">
                <CardContent className="p-4">
                    <p className="text-sm text-center text-muted-foreground">
                        <strong>Note:</strong> All existing TeacherVoice implementations will continue to work without changes. 
                        The new theme and teacherName props are optional enhancements.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
