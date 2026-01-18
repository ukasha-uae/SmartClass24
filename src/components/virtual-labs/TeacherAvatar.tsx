'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

interface TeacherAvatarProps {
    isPlaying: boolean;
    size?: 'small' | 'medium' | 'large';
    theme?: 'science' | 'accounting' | 'math' | 'default';
    emotion?: 'happy' | 'explaining' | 'concerned' | 'celebrating' | 'thinking';
}

export function TeacherAvatar({ isPlaying, size = 'medium', theme = 'default', emotion = 'explaining' }: TeacherAvatarProps) {
    // Detect mobile device for performance optimization
    const isMobile = React.useMemo(() => {
        if (typeof window === 'undefined') return false;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }, []);
    
    const sizeMap = {
        small: 40,
        medium: 48,
        large: 64,
    };
    
    const avatarSize = sizeMap[size];
    
    // Theme colors
    const themeColors = {
        science: { primary: '#3B82F6', secondary: '#60A5FA', accent: '#93C5FD' },
        accounting: { primary: '#10B981', secondary: '#34D399', accent: '#6EE7B7' },
        math: { primary: '#8B5CF6', secondary: '#A78BFA', accent: '#C4B5FD' },
        default: { primary: '#A855F7', secondary: '#C084FC', accent: '#E9D5FF' },
    };
    
    const colors = themeColors[theme];

    return (
        <svg
            width={avatarSize}
            height={avatarSize}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Background circle with glow */}
            <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="url(#avatarGradient)"
                animate={{
                    scale: (isPlaying && !isMobile) ? [1, 1.05, 1] : 1,
                }}
                transition={{
                    repeat: (isPlaying && !isMobile) ? Infinity : 0,
                    duration: 1.5,
                    ease: "easeInOut",
                }}
            />
            
            {/* Gradient definition */}
            <defs>
                <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={colors.primary} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="faceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="100%" stopColor="#FCD34D" />
                </linearGradient>
            </defs>
            
            {/* Face */}
            <circle cx="50" cy="45" r="28" fill="url(#faceGradient)" />
            
            {/* Hair */}
            <path
                d="M 30 30 Q 25 20, 35 15 Q 40 10, 50 12 Q 60 10, 65 15 Q 75 20, 70 30 Q 68 25, 62 28 Q 58 23, 50 25 Q 42 23, 38 28 Q 32 25, 30 30"
                fill="#8B4513"
            />
            
            {/* Eyes - blinking animation */}
            <motion.g
                animate={{
                    scaleY: (isPlaying && !isMobile) ? [1, 0.1, 1, 1, 1, 1, 1, 1] : 1,
                }}
                transition={{
                    repeat: (isPlaying && !isMobile) ? Infinity : 0,
                    duration: 4,
                    times: [0, 0.05, 0.1, 0.15, 0.2, 0.4, 0.6, 1],
                }}
                style={{ transformOrigin: '40px 42px' }}
            >
                <ellipse cx="40" cy="42" rx="3" ry="4" fill="#2D3748" />
            </motion.g>
            
            <motion.g
                animate={{
                    scaleY: (isPlaying && !isMobile) ? [1, 0.1, 1, 1, 1, 1, 1, 1] : 1,
                }}
                transition={{
                    repeat: (isPlaying && !isMobile) ? Infinity : 0,
                    duration: 4,
                    times: [0, 0.05, 0.1, 0.15, 0.2, 0.4, 0.6, 1],
                }}
                style={{ transformOrigin: '60px 42px' }}
            >
                <ellipse cx="60" cy="42" rx="3" ry="4" fill="#2D3748" />
            </motion.g>
            
            {/* Glasses */}
            <rect x="33" y="39" width="14" height="10" rx="2" fill="none" stroke="#4B5563" strokeWidth="1.5" />
            <rect x="53" y="39" width="14" height="10" rx="2" fill="none" stroke="#4B5563" strokeWidth="1.5" />
            <line x1="47" y1="44" x2="53" y2="44" stroke="#4B5563" strokeWidth="1.5" />
            
            {/* Mouth - animated when speaking with emotion-based expressions */}
            <motion.g>
                <motion.path
                    d={emotion === 'happy' || emotion === 'celebrating'
                        ? "M 38 58 Q 50 64, 62 58"  // Big smile
                        : emotion === 'concerned'
                        ? "M 40 60 Q 50 58, 60 60"  // Worried frown
                        : emotion === 'thinking'
                        ? "M 42 58 L 58 58"  // Straight line (pondering)
                        : isPlaying 
                        ? "M 40 58 Q 50 63, 60 58"  // Open mouth (speaking)
                        : "M 40 58 Q 50 60, 60 58"  // Gentle smile (default)
                    }
                    fill="none"
                    stroke="#2D3748"
                    strokeWidth="2"
                    strokeLinecap="round"
                    animate={{
                        d: (isPlaying && !isMobile && emotion === 'explaining')
                            ? [
                                "M 40 58 Q 50 60, 60 58",  // Closed
                                "M 40 58 Q 50 63, 60 58",  // Open
                                "M 40 58 Q 50 61, 60 58",  // Mid
                                "M 40 58 Q 50 63, 60 58",  // Open
                                "M 40 58 Q 50 60, 60 58",  // Closed
                            ]
                            : (emotion === 'celebrating' && !isMobile)
                            ? [
                                "M 38 58 Q 50 64, 62 58",  // Big smile
                                "M 38 57 Q 50 63, 62 57",  // Animate
                                "M 38 58 Q 50 64, 62 58",
                            ]
                            : undefined
                    }}
                    transition={{
                        repeat: (isPlaying && !isMobile && emotion === 'explaining') ? Infinity : (emotion === 'celebrating' && !isMobile) ? Infinity : 0,
                        duration: emotion === 'celebrating' ? 0.8 : 1.2,
                        ease: "easeInOut",
                    }}
                />
            </motion.g>
            
            {/* Body/Collar */}
            <path
                d="M 30 73 Q 35 68, 50 68 Q 65 68, 70 73 L 75 85 Q 75 90, 70 90 L 30 90 Q 25 90, 25 85 Z"
                fill={colors.primary}
            />
            
            {/* Collar details */}
            <path
                d="M 30 73 L 35 75 L 50 68 L 65 75 L 70 73"
                fill="white"
                opacity="0.3"
            />
            
            {/* Speaking indicator - sound waves (disabled on mobile for performance) */}
            {isPlaying && !isMobile && (
                <>
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="48"
                        fill="none"
                        stroke={colors.accent}
                        strokeWidth="1"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: [0.6, 0], scale: [0.8, 1.2] }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeOut",
                        }}
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="48"
                        fill="none"
                        stroke={colors.secondary}
                        strokeWidth="1"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: [0.6, 0], scale: [0.8, 1.2] }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            delay: 0.5,
                            ease: "easeOut",
                        }}
                    />
                </>
            )}
            
            {/* Emotion-based visual effects */}
            {emotion === 'celebrating' && (
                <>
                    {/* Stars around head */}
                    <motion.g
                        animate={{
                            rotate: [0, 360],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 3,
                            ease: "linear",
                        }}
                        style={{ transformOrigin: '50px 50px' }}
                    >
                        <motion.text x="20" y="25" fontSize="8" animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>⭐</motion.text>
                        <motion.text x="75" y="30" fontSize="8" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}>✨</motion.text>
                        <motion.text x="70" y="70" fontSize="8" animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.6 }}>⭐</motion.text>
                    </motion.g>
                </>
            )}
            
            {emotion === 'thinking' && (
                <>
                    {/* Thought bubble */}
                    <motion.g
                        animate={{
                            y: [0, -3, 0],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut",
                        }}
                    >
                        <circle cx="72" cy="28" r="3" fill="white" opacity="0.8" />
                        <circle cx="78" cy="22" r="4" fill="white" opacity="0.8" />
                        <ellipse cx="85" cy="15" rx="8" ry="6" fill="white" opacity="0.8" />
                        <text x="80" y="17" fontSize="6" fill="#666">?</text>
                    </motion.g>
                </>
            )}
            
            {emotion === 'concerned' && (
                <>
                    {/* Sweat drop */}
                    <motion.g
                        animate={{
                            y: [0, 5, 0],
                            opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                        }}
                    >
                        <ellipse cx="68" cy="32" rx="2" ry="3" fill="#60A5FA" opacity="0.7" />
                    </motion.g>
                </>
            )}
            
            {emotion === 'happy' && (
                <>
                    {/* Sparkles near eyes */}
                    <motion.text 
                        x="36" 
                        y="38" 
                        fontSize="6"
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >✨</motion.text>
                    <motion.text 
                        x="62" 
                        y="38" 
                        fontSize="6"
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                    >✨</motion.text>
                </>
            )}
        </svg>
    );
}
