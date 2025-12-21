'use client';

import * as React from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Volume2, VolumeX, Minimize2, Maximize2, GripVertical, UserCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface TeacherVoiceProps {
    message: string;
    autoPlay?: boolean;
    onComplete?: () => void;
}

export function TeacherVoice({ message, autoPlay = true, onComplete }: TeacherVoiceProps) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(false);
    const [isMinimized, setIsMinimized] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [voicesLoaded, setVoicesLoaded] = React.useState(false);
    const [userInteracted, setUserInteracted] = React.useState(false);
    const [showAudioPrompt, setShowAudioPrompt] = React.useState(false);
    const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
    const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

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
        };
    }, [message, autoPlay, isMuted, voicesLoaded, userInteracted]);

    const speakMessage = () => {
        if ('speechSynthesis' in window && !isMuted) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(message);
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
                onComplete?.();
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
    
    const enableAudio = () => {
        setUserInteracted(true);
        setShowAudioPrompt(false);
        // Trigger speech immediately after user interaction
        if (message && voicesLoaded && !isMuted) {
            setTimeout(() => speakMessage(), 100);
        }
    };
    
    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setPosition({
            x: position.x + info.offset.x,
            y: position.y + info.offset.y
        });
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
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={enableAudio}
                    >
                        <motion.div
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="mb-4"
                            >
                                <Volume2 className="h-16 w-16 mx-auto" />
                            </motion.div>
                            <h3 className="text-xl font-bold mb-2">Enable Teacher Guide</h3>
                            <p className="text-sm mb-4 opacity-90">
                                Your teacher will guide you through the experiment with audio instructions.
                            </p>
                            <div className="bg-white/10 rounded-lg p-3 mb-4 text-xs text-left space-y-1">
                                <p>💡 <strong>Tip:</strong> You can drag the teacher to reposition it</p>
                                <p>💡 Minimize it anytime using the minimize button</p>
                            </div>
                            <Button
                                onClick={enableAudio}
                                size="lg"
                                className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                            >
                                Enable Audio
                            </Button>
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
                        // Minimized state - just floating button
                        <motion.button
                            onClick={() => setIsMinimized(false)}
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-2xl p-3 flex items-center gap-2 hover:scale-105 transition-transform"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                animate={{ 
                                    scale: isPlaying ? [1, 1.2, 1] : 1,
                                }}
                                transition={{ 
                                    repeat: isPlaying ? Infinity : 0,
                                    duration: 0.8 
                                }}
                            >
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <UserCircle className="h-8 w-8 text-white" />
                                </div>
                            </motion.div>
                            
                            {/* Sound wave animation when playing */}
                            {isPlaying && !isMuted && (
                                <div className="flex gap-1 items-center">
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
                        </motion.button>
                    ) : (
                        // Expanded state - full message
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-2xl flex items-start gap-3 relative">
                            {/* Drag Handle */}
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white/40 cursor-move">
                                <GripVertical className="h-4 w-4" />
                            </div>
                            
                            <div className="p-4 pt-6 flex items-start gap-3 w-full">
                                {/* Teacher Avatar */}
                                <motion.div
                                    animate={{ 
                                        scale: isPlaying ? [1, 1.1, 1] : 1,
                                    }}
                                    transition={{ 
                                        repeat: isPlaying ? Infinity : 0,
                                        duration: 0.8 
                                    }}
                                    className="flex-shrink-0"
                                >
                                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                        <UserCircle className="h-10 w-10 text-white" />
                                    </div>
                                </motion.div>

                                {/* Message */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium mb-1 opacity-90">Teacher</p>
                                    <p className="text-sm leading-relaxed">
                                        {message}
                                    </p>
                                </div>

                                {/* Controls */}
                                <div className="flex flex-col gap-1">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            if (!userInteracted) {
                                                enableAudio();
                                            } else {
                                                toggleMute();
                                            }
                                        }}
                                        className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                                        title={isMuted ? "Unmute" : "Mute"}
                                    >
                                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                    </Button>
                                    
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setIsMinimized(true)}
                                        className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                                        title="Minimize"
                                    >
                                        <Minimize2 className="h-4 w-4" />
                                    </Button>
                                    
                                    {/* Sound wave animation when playing */}
                                    {isPlaying && !isMuted && (
                                        <div className="flex gap-1 items-center justify-center h-8">
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
