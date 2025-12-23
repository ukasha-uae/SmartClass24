'use client';

import * as React from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Volume2, VolumeX, Minimize2, Maximize2, GripVertical, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { TeacherAvatar } from './TeacherAvatar';

interface TeacherVoiceProps {
    message: string;
    autoPlay?: boolean;
    onComplete?: () => void;
    theme?: 'science' | 'accounting' | 'math' | 'default';
    teacherName?: string;
    progressiveReveal?: boolean; // Enable progressive text reveal
    linesPerChunk?: number; // Number of lines to show at once (default: 2)
    emotion?: 'happy' | 'explaining' | 'concerned' | 'celebrating' | 'thinking';
    context?: {
        quizScore?: number;
        attempts?: number;
        correctStreak?: number;
    };
    quickActions?: Array<{
        label: string;
        icon?: React.ReactNode;
        onClick: () => void;
    }>;
    onHintRequest?: () => void;
}

export function TeacherVoice({ 
    message, 
    autoPlay = true, 
    onComplete,
    theme = 'default',
    teacherName = 'Teacher',
    progressiveReveal = true,
    linesPerChunk = 2,
    emotion,
    context,
    quickActions = [],
    onHintRequest
}: TeacherVoiceProps) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(false);
    const [isMinimized, setIsMinimized] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [voicesLoaded, setVoicesLoaded] = React.useState(false);
    const [userInteracted, setUserInteracted] = React.useState(false);
    const [showAudioPrompt, setShowAudioPrompt] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);
    const [currentChunkIndex, setCurrentChunkIndex] = React.useState(0);
    const [messageChunks, setMessageChunks] = React.useState<string[]>([]);
    const [showQuickActions, setShowQuickActions] = React.useState(false);
    const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
    const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
    const chunkTimerRef = React.useRef<NodeJS.Timeout | null>(null);
    
    // Auto-detect emotion from context if not explicitly provided
    const detectedEmotion = React.useMemo(() => {
        if (emotion) return emotion;
        if (!context) return 'explaining';
        
        const { quizScore, correctStreak } = context;
        
        if (quizScore !== undefined) {
            if (quizScore >= 90) return 'celebrating';
            if (quizScore >= 70) return 'happy';
            if (quizScore < 50) return 'concerned';
        }
        
        if (correctStreak !== undefined && correctStreak >= 3) return 'happy';
        
        return 'explaining';
    }, [emotion, context]);

    // Split message into chunks for progressive reveal
    React.useEffect(() => {
        if (progressiveReveal && message) {
            // Split by sentences (. ! ?) but keep the punctuation
            const sentences = message.match(/[^.!?]+[.!?]+/g) || [message];
            const chunks: string[] = [];
            
            for (let i = 0; i < sentences.length; i += linesPerChunk) {
                const chunk = sentences.slice(i, i + linesPerChunk).join(' ').trim();
                if (chunk) chunks.push(chunk);
            }
            
            setMessageChunks(chunks.length > 0 ? chunks : [message]);
            setCurrentChunkIndex(0);
        } else {
            setMessageChunks([message]);
            setCurrentChunkIndex(0);
        }
    }, [message, progressiveReveal, linesPerChunk]);

    // Pre-load voices on mount
    React.useEffect(() => {
        if ('speechSynthesis' in window) {
            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                    setVoicesLoaded(true);
                }
            };
            
            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    React.useEffect(() => {
        // Cancel any ongoing speech when message changes
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        
        if (autoPlay && !isMuted && message && voicesLoaded) {
            // On mobile, require user interaction before auto-play
            if (!userInteracted) {
                setShowAudioPrompt(true);
                return;
            }
            
            // Debounce speech to avoid delays on mobile
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            
            debounceTimerRef.current = setTimeout(() => {
                speakMessage();
            }, 200);
            
            return () => {
                if (debounceTimerRef.current) {
                    clearTimeout(debounceTimerRef.current);
                }
            };
        }
        
        return () => {
            if (utteranceRef.current) {
                window.speechSynthesis.cancel();
            }
            if (chunkTimerRef.current) {
                clearTimeout(chunkTimerRef.current);
            }
        };
    }, [message, autoPlay, isMuted, voicesLoaded, userInteracted, messageChunks, currentChunkIndex]);

    const speakMessage = (chunkIndex: number = currentChunkIndex) => {
        if ('speechSynthesis' in window && !isMuted && messageChunks.length > 0) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            const textToSpeak = messageChunks[chunkIndex] || messageChunks[0];
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            utterance.volume = 1;
            
            // Try to find a friendly female voice
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                const preferredVoice = voices.find(voice => 
                    voice.name.includes('Female') || 
                    voice.name.includes('Samantha') || 
                    voice.name.includes('Victoria') ||
                    voice.name.includes('Google UK English Female')
                );
                
                if (preferredVoice) {
                    utterance.voice = preferredVoice;
                }
            }
            
            utterance.onstart = () => setIsPlaying(true);
            utterance.onend = () => {
                setIsPlaying(false);
                
                // Auto-advance to next chunk if available
                if (progressiveReveal && chunkIndex < messageChunks.length - 1) {
                    chunkTimerRef.current = setTimeout(() => {
                        setCurrentChunkIndex(chunkIndex + 1);
                        speakMessage(chunkIndex + 1);
                    }, 300); // Small pause between chunks
                } else {
                    // All chunks complete
                    onComplete?.();
                }
            };
            utterance.onerror = () => setIsPlaying(false);
            
            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        }
    };

    const toggleMute = () => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        }
        setIsMuted(!isMuted);
    };
    
    const repeatMessage = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            if (chunkTimerRef.current) {
                clearTimeout(chunkTimerRef.current);
            }
            setCurrentChunkIndex(0);
            speakMessage(0);
        }
    };
    
    const enableAudio = () => {
        setUserInteracted(true);
        setShowAudioPrompt(false);
        // Trigger speech immediately after user interaction
        if (message && voicesLoaded && !isMuted) {
            setTimeout(() => speakMessage(), 100);
        }
    };
    
    // Theme-based gradient colors
    const themeGradients = {
        science: 'from-blue-500 via-blue-600 to-indigo-600',
        accounting: 'from-green-500 via-emerald-600 to-teal-600',
        math: 'from-purple-500 via-violet-600 to-purple-700',
        default: 'from-purple-500 via-indigo-600 to-purple-600',
    };
    
    const gradientClass = themeGradients[theme];
    
    // Get RGB colors for inline styles
    const getThemeColors = (t: typeof theme) => {
        const colors = {
            science: { start: 'rgba(59, 130, 246, 0.75)', end: 'rgba(79, 70, 229, 0.75)' },
            accounting: { start: 'rgba(16, 185, 129, 0.75)', end: 'rgba(13, 148, 136, 0.75)' },
            math: { start: 'rgba(139, 92, 246, 0.75)', end: 'rgba(124, 58, 237, 0.75)' },
            default: { start: 'rgba(168, 85, 247, 0.75)', end: 'rgba(99, 102, 241, 0.75)' },
        };
        return colors[t];
    };
    
    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setPosition({
            x: position.x + info.offset.x,
            y: position.y + info.offset.y
        });
        // Prevent click events after drag
        setTimeout(() => setIsDragging(false), 100);
    };
    
    const handleDragStart = () => {
        setIsDragging(true);
    };

    return (
        <>
            {/* Audio Enable Prompt for Mobile */}
            <AnimatePresence>
                {showAudioPrompt && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
                        onClick={enableAudio}
                    >
                        <motion.div
                            className={`bg-gradient-to-br ${gradientClass} text-white rounded-3xl shadow-2xl p-8 max-w-sm mx-4 text-center border border-white/20 backdrop-blur-xl relative overflow-hidden`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Animated background shimmer */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                animate={{
                                    x: ['-100%', '100%'],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 3,
                                    ease: 'linear',
                                }}
                                style={{ pointerEvents: 'none' }}
                            />
                            
                            <div className="relative z-10">
                                <motion.div
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="mb-6 inline-block"
                                >
                                    <div className="relative">
                                        <TeacherAvatar isPlaying={true} size="large" theme={theme} />
                                        <motion.div
                                            className="absolute -top-1 -right-1"
                                            animate={{ rotate: [0, 15, -15, 0] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        >
                                            <Sparkles className="h-6 w-6 text-yellow-300" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                                
                                <h3 className="text-2xl font-bold mb-3">Meet Your {teacherName}!</h3>
                                <p className="text-sm mb-5 opacity-95 leading-relaxed">
                                    I'll guide you through this lesson with audio instructions and helpful tips.
                                </p>
                                
                                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 mb-6 text-xs text-left space-y-2 border border-white/20">
                                    <p className="flex items-start gap-2">
                                        <span className="text-lg">✨</span>
                                        <span><strong>Tip:</strong> Drag me anywhere on your screen</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="text-lg">🔄</span>
                                        <span><strong>Repeat:</strong> Click repeat button to hear again</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="text-lg">📌</span>
                                        <span><strong>Minimize:</strong> I'll stay out of your way</span>
                                    </p>
                                </div>
                                
                                <Button
                                    onClick={enableAudio}
                                    size="lg"
                                    className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                                >
                                    <Volume2 className="mr-2 h-5 w-5" />
                                    Start Learning
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {message && userInteracted && (
                    <motion.div
                        drag
                        dragMomentum={false}
                        dragElastic={0}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        style={{
                            x: position.x,
                            y: position.y
                        }}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-4 right-4 z-50 max-w-md touch-none cursor-move"
                    >
                    {isMinimized ? (
                        // Minimized state - floating button with glass morphism
                        <motion.button
                            onClick={(e) => {
                                if (isDragging) {
                                    e.preventDefault();
                                    return;
                                }
                                setIsMinimized(false);
                            }}
                            className={`bg-gradient-to-br ${gradientClass} text-white rounded-full shadow-2xl p-2 flex items-center gap-2 hover:scale-105 transition-transform backdrop-blur-xl border border-white/20`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                animate={{ 
                                    scale: isPlaying ? [1, 1.08, 1] : 1,
                                }}
                                transition={{ 
                                    repeat: isPlaying ? Infinity : 0,
                                    duration: 0.8 
                                }}
                            >
                                <TeacherAvatar isPlaying={isPlaying} size="small" theme={theme} emotion={detectedEmotion} />
                            </motion.div>
                            
                            {/* Sound wave animation when playing */}
                            {isPlaying && !isMuted && (
                                <div className="flex gap-0.5 items-center mr-1">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-1 bg-white rounded-full"
                                            animate={{
                                                height: [8, 16, 8],
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 0.6,
                                                delay: i * 0.1,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                            
                            {/* Sparkle indicator */}
                            {!isPlaying && (
                                <motion.div
                                    animate={{ 
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{ 
                                        repeat: Infinity,
                                        duration: 2 
                                    }}
                                    className="mr-1"
                                >
                                    <Sparkles className="h-3 w-3 text-white" />
                                </motion.div>
                            )}
                        </motion.button>
                    ) : (
                        // Expanded state - transparent with progressive text
                        <div className={`relative rounded-2xl shadow-2xl backdrop-blur-md border border-white/40 overflow-hidden`}
                            style={{ 
                                background: `linear-gradient(to bottom right, ${getThemeColors(theme).start}, ${getThemeColors(theme).end})`,
                                opacity: 0.80
                            }}>
                            {/* Animated background shimmer */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                                animate={{
                                    x: ['-100%', '100%'],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 3,
                                    ease: 'linear',
                                }}
                                style={{ pointerEvents: 'none' }}
                            />
                            
                            {/* Drag Handle */}
                            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 text-white/40 cursor-move z-10">
                                <GripVertical className="h-3 w-3" />
                            </div>
                            
                            <div className="p-2.5 pt-4 flex items-start gap-2 relative z-10 text-white">
                                {/* Teacher Avatar */}
                                <motion.div
                                    className="flex-shrink-0"
                                >
                                    <TeacherAvatar isPlaying={isPlaying} size="medium" theme={theme} emotion={detectedEmotion} />
                                </motion.div>

                                {/* Message */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-xs font-semibold tracking-wide uppercase opacity-90">
                                            {teacherName}
                                        </p>
                                        {/* Emotion indicator */}
                                        {detectedEmotion !== 'explaining' && (
                                            <span className="text-xs" title={detectedEmotion}>
                                                {detectedEmotion === 'happy' && '😊'}
                                                {detectedEmotion === 'celebrating' && '🎉'}
                                                {detectedEmotion === 'concerned' && '🤔'}
                                                {detectedEmotion === 'thinking' && '🧐'}
                                            </span>
                                        )}
                                        {/* Context badge */}
                                        {context?.quizScore !== undefined && (
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                                context.quizScore >= 90 ? 'bg-green-500/30 text-green-100' :
                                                context.quizScore >= 70 ? 'bg-blue-500/30 text-blue-100' :
                                                context.quizScore >= 50 ? 'bg-yellow-500/30 text-yellow-100' :
                                                'bg-red-500/30 text-red-100'
                                            }`}>
                                                {context.quizScore}%
                                            </span>
                                        )}
                                        {isPlaying && (
                                            <motion.div
                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                                className="flex items-center gap-0.5"
                                            >
                                                <div className="w-1 h-1 bg-white rounded-full" />
                                                <div className="w-1 h-1 bg-white rounded-full" />
                                                <div className="w-1 h-1 bg-white rounded-full" />
                                            </motion.div>
                                        )}
                                    </div>
                                    <AnimatePresence mode="wait">
                                        <motion.p 
                                            key={currentChunkIndex}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-sm leading-snug font-medium"
                                        >
                                            {progressiveReveal ? messageChunks[currentChunkIndex] : message}
                                        </motion.p>
                                    </AnimatePresence>
                                    
                                    {/* Bottom row: Progress dots and controls */}
                                    <div className="flex items-center justify-between mt-2 gap-2">
                                        {/* Progress indicator for chunks */}
                                        {progressiveReveal && messageChunks.length > 1 ? (
                                            <div className="flex gap-1">
                                                {messageChunks.map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className={`h-1 rounded-full transition-all ${
                                                            index === currentChunkIndex 
                                                                ? 'w-4 bg-white' 
                                                                : index < currentChunkIndex
                                                                ? 'w-2 bg-white/60'
                                                                : 'w-2 bg-white/30'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex-1" />
                                        )}
                                        
                                        {/* Horizontal Controls */}
                                        <div className="flex items-center gap-1">
                                            {/* Sound wave animation when playing */}
                                            {isPlaying && !isMuted && (
                                                <div className="flex gap-0.5 items-center mr-1">
                                                    {[0, 1, 2].map((i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="w-0.5 bg-white rounded-full"
                                                            animate={{
                                                                height: [6, 12, 6],
                                                            }}
                                                            transition={{
                                                                repeat: Infinity,
                                                                duration: 0.6,
                                                                delay: i * 0.1,
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            
                                            {/* Quick Actions Menu Button */}
                                            {(quickActions.length > 0 || onHintRequest) && (
                                                <div className="relative">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={(e) => {
                                                            if (isDragging) {
                                                                e.preventDefault();
                                                                return;
                                                            }
                                                            setShowQuickActions(!showQuickActions);
                                                        }}
                                                        className="h-6 w-6 p-0 hover:bg-white/20 text-white transition-all hover:scale-110"
                                                        title="Quick Actions"
                                                    >
                                                        <span className="text-xs">⚡</span>
                                                    </Button>
                                                    
                                                    {/* Quick Actions Dropdown */}
                                                    <AnimatePresence>
                                                        {showQuickActions && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                                                transition={{ duration: 0.15 }}
                                                                className="absolute bottom-full right-0 mb-1 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-white/40 p-1.5 min-w-[140px] z-50"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <div className="flex flex-col gap-0.5">
                                                                    {quickActions.map((action, idx) => (
                                                                        <button
                                                                            key={idx}
                                                                            onClick={() => {
                                                                                action.onClick();
                                                                                setShowQuickActions(false);
                                                                            }}
                                                                            className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors text-left"
                                                                        >
                                                                            {action.icon && <span className="text-sm">{action.icon}</span>}
                                                                            <span className="font-medium">{action.label}</span>
                                                                        </button>
                                                                    ))}
                                                                    {onHintRequest && (
                                                                        <button
                                                                            onClick={() => {
                                                                                onHintRequest();
                                                                                setShowQuickActions(false);
                                                                            }}
                                                                            className="flex items-center gap-1.5 px-2 py-1 text-xs text-amber-700 hover:bg-amber-50 rounded transition-colors text-left font-medium"
                                                                        >
                                                                            <span className="text-sm">💡</span>
                                                                            <span>Get Hint</span>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )}
                                            
                                            {/* Repeat button */}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    if (isDragging) {
                                                        e.preventDefault();
                                                        return;
                                                    }
                                                    repeatMessage();
                                                }}
                                                className="h-6 w-6 p-0 hover:bg-white/20 text-white transition-all hover:scale-110"
                                                title="Repeat"
                                            >
                                                <RotateCcw className="h-3 w-3" />
                                            </Button>
                                            
                                            {/* Mute/Unmute button */}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    if (isDragging) {
                                                        e.preventDefault();
                                                        return;
                                                    }
                                                    if (!userInteracted) {
                                                        enableAudio();
                                                    } else {
                                                        toggleMute();
                                                    }
                                                }}
                                                className="h-6 w-6 p-0 hover:bg-white/20 text-white transition-all hover:scale-110"
                                                title={isMuted ? "Unmute" : "Mute"}
                                            >
                                                {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                                            </Button>
                                            
                                            {/* Minimize button */}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    if (isDragging) {
                                                        e.preventDefault();
                                                        return;
                                                    }
                                                    setIsMinimized(true);
                                                }}
                                                className="h-6 w-6 p-0 hover:bg-white/20 text-white transition-all hover:scale-110"
                                                title="Minimize"
                                            >
                                                <Minimize2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
}
