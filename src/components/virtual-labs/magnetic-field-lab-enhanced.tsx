'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Trophy, Award, GripVertical, Magnet, Compass, RotateCw, Move, Zap } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { Switch } from '../ui/switch';
import { LabSupplies, SupplyItem } from './LabSupplies';

type Step = 'intro' | 'collect-supplies' | 'setup' | 'experiment' | 'results' | 'quiz' | 'complete';

interface MagnetData {
    id: string;
    x: number;
    y: number;
    rotation: number;
    flipped: boolean;
}

export function MagneticFieldLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    
    // Supplies tracking
    const [collectedSupplies, setCollectedSupplies] = React.useState<string[]>([]);
    
    // Experiment state
    const [showFieldLines, setShowFieldLines] = React.useState(true);
    const [magnet1, setMagnet1] = React.useState<MagnetData>({ id: 'magnet1', x: 150, y: 150, rotation: 0, flipped: false });
    const [magnet2, setMagnet2] = React.useState<MagnetData>({ id: 'magnet2', x: 350, y: 150, rotation: 0, flipped: false });
    const [compassPositions, setCompassPositions] = React.useState<Array<{ x: number, y: number, angle: number }>>([]);
    const [interactionType, setInteractionType] = React.useState<'attract' | 'repel' | 'none'>('none');
    const [observationsCount, setObservationsCount] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState<string | null>(null);
    const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
    
    // Quiz state
    const [quizAnswer1, setQuizAnswer1] = React.useState<string | undefined>();
    const [quizAnswer2, setQuizAnswer2] = React.useState<string | undefined>();
    const [quizAnswer3, setQuizAnswer3] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState('');
    const [quizSubmitted, setQuizSubmitted] = React.useState(false);
    
    // XP and completion
    const [xpEarned, setXpEarned] = React.useState(0);
    const [showCelebration, setShowCelebration] = React.useState(false);
    const { markLabComplete, isLabCompleted, getLabCompletion } = useLabProgress();
    const labId = 'magnetic-field';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    // Supplies definition
    const supplies: SupplyItem[] = [
        { id: 'magnets', name: 'Bar Magnets', emoji: '🧲', description: 'For creating magnetic fields' },
        { id: 'compass', name: 'Compass', emoji: '🧭', description: 'To detect field direction' },
        { id: 'paper', name: 'Paper', emoji: '📄', description: 'To map field lines' },
    ];

    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Magnetic Field Lab! We'll explore the invisible force fields around magnets and see how they attract and repel. Let's gather our supplies first!");
        }
    }, [currentStep]);

    // Calculate magnetic interaction - CORRECT SCIENTIFIC LOGIC
    // Visual representation in code:
    // - Red (#ef4444) = North pole (N)
    // - Blue (#3b82f6) = South pole (S)
    // When flipped=false: 
    //   - Left rect (x=-45): Red(N) - label shows 'N' at x=-22
    //   - Right rect (x=0): Blue(S) - label shows 'S' at x=22
    // When flipped=true:
    //   - Left rect (x=-45): Blue(S) - label shows 'S' at x=-22
    //   - Right rect (x=0): Red(N) - label shows 'N' at x=22
    React.useEffect(() => {
        if (isDragging) {
            setInteractionType('none');
            return;
        }
        
        const distance = Math.sqrt(Math.pow(magnet2.x - magnet1.x, 2) + Math.pow(magnet2.y - magnet1.y, 2));
        const minDistance = 100; // Minimum distance (edges touch, no overlap)
        const maxForceDistance = 300; // Maximum distance for force
        
        // Check alignment
        const horizontalAlignment = Math.abs(magnet1.y - magnet2.y) < 50;
        const verticalAlignment = Math.abs(magnet1.x - magnet2.x) < 50;
        
        if (!horizontalAlignment && !verticalAlignment) {
            setInteractionType('none');
            return;
        }
        
        if (distance < maxForceDistance) {
            let m1FacingPole: string;
            let m2FacingPole: string;
            
            if (horizontalAlignment) {
                // Horizontal alignment
                // Visual representation:
                // flipped=false: Left side (x=-45) = Red(N), Right side (x=0) = Blue(S)
                // flipped=true: Left side (x=-45) = Blue(S), Right side (x=0) = Red(N)
                if (magnet1.x < magnet2.x) {
                    // M1 is on LEFT, M2 is on RIGHT
                    // M1's RIGHT end (x=0 area) faces M2
                    // Right end: flipped=false→Blue(S), flipped=true→Red(N)
                    m1FacingPole = magnet1.flipped ? 'N' : 'S';
                    
                    // M2's LEFT end (x=-45 area) faces M1  
                    // Left end: flipped=false→Red(N), flipped=true→Blue(S)
                    m2FacingPole = magnet2.flipped ? 'S' : 'N';
                } else {
                    // M1 is on RIGHT, M2 is on LEFT
                    // M1's LEFT end (x=-45 area) faces M2
                    // Left end: flipped=false→Red(N), flipped=true→Blue(S)
                    m1FacingPole = magnet1.flipped ? 'S' : 'N';
                    
                    // M2's RIGHT end (x=0 area) faces M1
                    // Right end: flipped=false→Blue(S), flipped=true→Red(N)
                    m2FacingPole = magnet2.flipped ? 'N' : 'S';
                }
            } else {
                // Vertical alignment - for rotation=0, magnets are horizontal
                // Top magnet's bottom faces bottom magnet's top
                if (magnet1.y < magnet2.y) {
                    // M1 is on TOP, M2 is on BOTTOM
                    // For horizontal magnets (rotation=0), bottom = right side
                    m1FacingPole = magnet1.flipped ? 'N' : 'S'; // bottom = right
                    // Top = left side
                    m2FacingPole = magnet2.flipped ? 'S' : 'N'; // top = left
                } else {
                    // M1 is on BOTTOM, M2 is on TOP
                    m1FacingPole = magnet1.flipped ? 'S' : 'N'; // top = left
                    m2FacingPole = magnet2.flipped ? 'N' : 'S'; // bottom = right
                }
            }
            
            // SCIENTIFIC RULE: 
            // - Opposite poles (N-S or S-N) → ATTRACT (pull together)
            // - Same poles (N-N or S-S) → REPEL (push apart)
            // If poles are different, they attract. If same, they repel.
            const polesAreDifferent = m1FacingPole !== m2FacingPole;
            
            // Apply the correct physics: opposite poles attract, same poles repel
            if (polesAreDifferent) {
                // Different poles (N-S or S-N) → ATTRACT
                setInteractionType('attract');
            } else {
                // Same poles (N-N or S-S) → REPEL  
                setInteractionType('repel');
            }
        } else {
            setInteractionType('none');
        }
    }, [magnet1, magnet2, isDragging]);

    // Auto-move magnets based on interaction - IMMEDIATE AND STRONG
    // Use refs to access current values without triggering re-renders
    const magnet1Ref = React.useRef(magnet1);
    const magnet2Ref = React.useRef(magnet2);
    const isUpdatingRef = React.useRef(false);
    
    // Update refs when magnets change
    React.useEffect(() => {
        magnet1Ref.current = magnet1;
        magnet2Ref.current = magnet2;
    }, [magnet1, magnet2]);
    
    React.useEffect(() => {
        if (isDragging || interactionType === 'none') return;
        
        const interval = setInterval(() => {
            if (isUpdatingRef.current) return; // Prevent concurrent updates
            
            // Use refs to get current values without dependencies
            const m1 = magnet1Ref.current;
            const m2 = magnet2Ref.current;
            
            const distance = Math.sqrt(Math.pow(m2.x - m1.x, 2) + Math.pow(m2.y - m1.y, 2));
            const minDistance = 100; // Minimum distance (edges touch)
            const maxForceDistance = 300;
            
            const horizontalAlignment = Math.abs(m1.y - m2.y) < 50;
            const verticalAlignment = Math.abs(m1.x - m2.x) < 50;
            
            if (distance < maxForceDistance && (horizontalAlignment || verticalAlignment)) {
                isUpdatingRef.current = true;
                
                // STRONG force - not slow motion!
                let force: number;
                if (interactionType === 'attract') {
                    // For attraction: strong pull, stop at minDistance
                    if (distance <= minDistance) {
                        // Already at minimum - maintain distance, but only adjust if needed
                        if (horizontalAlignment) {
                            const currentMin = Math.abs(m2.x - m1.x);
                            if (Math.abs(currentMin - minDistance) > 2) {
                                const dx = m2.x - m1.x;
                                const direction = dx > 0 ? 1 : -1;
                                const midX = (m1.x + m2.x) / 2;
                                setMagnet1(prev => ({ ...prev, x: Math.max(50, Math.min(450, midX - (minDistance / 2) * direction)) }));
                                setMagnet2(prev => ({ ...prev, x: Math.max(50, Math.min(450, midX + (minDistance / 2) * direction)) }));
                            }
                        } else if (verticalAlignment) {
                            const currentMinY = Math.abs(m2.y - m1.y);
                            if (Math.abs(currentMinY - minDistance) > 2) {
                                const dy = m2.y - m1.y;
                                const direction = dy > 0 ? 1 : -1;
                                const midY = (m1.y + m2.y) / 2;
                                setMagnet1(prev => ({ ...prev, y: Math.max(50, Math.min(350, midY - (minDistance / 2) * direction)) }));
                                setMagnet2(prev => ({ ...prev, y: Math.max(50, Math.min(350, midY + (minDistance / 2) * direction)) }));
                            }
                        }
                        setTimeout(() => { isUpdatingRef.current = false; }, 50);
                        return;
                    }
                    // VERY STRONG attraction force - immediate snap together
                    force = Math.min((maxForceDistance - distance) / maxForceDistance * 25, 20);
                } else {
                    // For repulsion: VERY STRONG push away - immediate separation
                    force = Math.min((maxForceDistance - distance) / maxForceDistance * 30, 25);
                }
                
                if (horizontalAlignment) {
                    const dx = m2.x - m1.x;
                    const direction = dx > 0 ? 1 : -1;
                    
                    if (interactionType === 'attract') {
                        // Pull together strongly
                        const newM1X = m1.x + (direction * force);
                        const newM2X = m2.x - (direction * force);
                        const newDistance = Math.abs(newM2X - newM1X);
                        
                        if (newDistance >= minDistance) {
                            setMagnet1(prev => ({ ...prev, x: Math.max(50, Math.min(450, newM1X)) }));
                            setMagnet2(prev => ({ ...prev, x: Math.max(50, Math.min(450, newM2X)) }));
                        } else {
                            // Snap to minDistance
                            const midX = (m1.x + m2.x) / 2;
                            setMagnet1(prev => ({ ...prev, x: Math.max(50, Math.min(450, midX - (minDistance / 2) * direction)) }));
                            setMagnet2(prev => ({ ...prev, x: Math.max(50, Math.min(450, midX + (minDistance / 2) * direction)) }));
                        }
                    } else {
                        // REPEL - Push apart strongly
                        setMagnet1(prev => ({ ...prev, x: Math.max(50, Math.min(450, prev.x - (direction * force))) }));
                        setMagnet2(prev => ({ ...prev, x: Math.max(50, Math.min(450, prev.x + (direction * force))) }));
                    }
                } else if (verticalAlignment) {
                    const dy = m2.y - m1.y;
                    const direction = dy > 0 ? 1 : -1;
                    
                    if (interactionType === 'attract') {
                        // Pull together strongly
                        const newM1Y = m1.y + (direction * force);
                        const newM2Y = m2.y - (direction * force);
                        const newDistance = Math.abs(newM2Y - newM1Y);
                        
                        if (newDistance >= minDistance) {
                            setMagnet1(prev => ({ ...prev, y: Math.max(50, Math.min(350, newM1Y)) }));
                            setMagnet2(prev => ({ ...prev, y: Math.max(50, Math.min(350, newM2Y)) }));
                        } else {
                            // Snap to minDistance
                            const midY = (m1.y + m2.y) / 2;
                            setMagnet1(prev => ({ ...prev, y: Math.max(50, Math.min(350, midY - (minDistance / 2) * direction)) }));
                            setMagnet2(prev => ({ ...prev, y: Math.max(50, Math.min(350, midY + (minDistance / 2) * direction)) }));
                        }
                    } else {
                        // REPEL - Push apart strongly
                        setMagnet1(prev => ({ ...prev, y: Math.max(50, Math.min(350, prev.y - (direction * force))) }));
                        setMagnet2(prev => ({ ...prev, y: Math.max(50, Math.min(350, prev.y + (direction * force))) }));
                    }
                }
                
                // Reset flag after a short delay
                setTimeout(() => {
                    isUpdatingRef.current = false;
                }, 30);
            }
        }, 20); // Update every 20ms for smooth animation
        
        return () => clearInterval(interval);
    }, [interactionType, isDragging]);

    const handleStartExperiment = () => {
        setTeacherMessage("Great! Let's gather our supplies. Click on each item to collect them for your experiment!");
        setCurrentStep('collect-supplies');
    };

    const handleCollectSupply = (itemId: string) => {
        if (!collectedSupplies.includes(itemId)) {
            setCollectedSupplies(prev => [...prev, itemId]);
            toast({ title: `✅ ${supplies.find(s => s.id === itemId)?.name} Collected` });
        }
    };

    const handleAllSuppliesCollected = () => {
        setTeacherMessage("Perfect! All supplies ready. Drag the magnets close to each other and watch them attract or repel! Flip the poles to see the difference!");
        setCurrentStep('setup');
    };

    // Handle magnet dragging
    const handleMagnetMouseDown = (e: React.MouseEvent, magnetId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(magnetId);
        const svg = e.currentTarget.closest('svg');
        if (svg) {
            const rect = svg.getBoundingClientRect();
            const viewBox = svg.viewBox.baseVal;
            const scaleX = viewBox.width / rect.width;
            const scaleY = viewBox.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            
            if (magnetId === 'magnet1') {
                setDragOffset({ x: x - magnet1.x, y: y - magnet1.y });
            } else {
                setDragOffset({ x: x - magnet2.x, y: y - magnet2.y });
            }
        }
    };

    const handleMagnetMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const svg = e.currentTarget as SVGSVGElement;
        if (svg) {
            const rect = svg.getBoundingClientRect();
            const viewBox = svg.viewBox.baseVal;
            const scaleX = viewBox.width / rect.width;
            const scaleY = viewBox.height / rect.height;
            const x = Math.max(50, Math.min(450, (e.clientX - rect.left) * scaleX - dragOffset.x));
            const y = Math.max(50, Math.min(350, (e.clientY - rect.top) * scaleY - dragOffset.y));
            
            if (isDragging === 'magnet1') {
                setMagnet1(prev => ({ ...prev, x, y }));
            } else if (isDragging === 'magnet2') {
                setMagnet2(prev => ({ ...prev, x, y }));
            }
        }
    };

    const handleMagnetMouseUp = () => {
        setIsDragging(null);
    };

    const handleFlipMagnet = (magnetId: string) => {
        if (magnetId === 'magnet1') {
            setMagnet1(prev => ({ ...prev, flipped: !prev.flipped }));
        } else {
            setMagnet2(prev => ({ ...prev, flipped: !prev.flipped }));
        }
        toast({ title: '🧲 Magnet Flipped', description: 'North and South poles swapped!' });
    };

    const handleRotateMagnet = (magnetId: string) => {
        if (magnetId === 'magnet1') {
            setMagnet1(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
        } else {
            setMagnet2(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
        }
        toast({ title: '🔄 Magnet Rotated', description: '90° rotation applied' });
    };

    const handlePlaceCompass = () => {
        const x = 250 + Math.random() * 100 - 50;
        const y = 150 + Math.random() * 100 - 50;
        const angle = calculateCompassAngle(x, y);
        
        setCompassPositions(prev => [...prev, { x, y, angle }]);
        setObservationsCount(prev => prev + 1);
        
        toast({ title: '🧭 Compass Placed', description: 'Observing field direction' });
    };

    const handleRecordObservation = () => {
        // Simplified - just need to observe attraction/repulsion
        if (interactionType === 'none') {
            toast({ 
                title: 'Move Magnets Closer', 
                description: 'Drag the magnets closer together to see attraction or repulsion!',
                variant: 'destructive' 
            });
            return;
        }
        
        setTeacherMessage("Excellent! You've observed how magnets attract and repel! Click 'Continue to Results' when you're ready to analyze your findings!");
        setCurrentStep('results');
    };

    const calculateCompassAngle = (x: number, y: number): number => {
        // Simple field calculation based on closest magnet
        const dist1 = Math.sqrt(Math.pow(x - magnet1.x, 2) + Math.pow(y - magnet1.y, 2));
        const dist2 = Math.sqrt(Math.pow(x - magnet2.x, 2) + Math.pow(y - magnet2.y, 2));
        
        const closestMagnet = dist1 < dist2 ? magnet1 : magnet2;
        const northSide = closestMagnet.flipped ? -1 : 1;
        
        let angle = Math.atan2(y - closestMagnet.y, (x - closestMagnet.x) * northSide) * 180 / Math.PI;
        return angle + closestMagnet.rotation;
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Time to test your understanding of magnetic fields!");
        setCurrentStep('quiz');
    };

    const handleQuizSubmit = () => {
        let correctCount = 0;
        if (quizAnswer1 === 'opposite') correctCount++;
        if (quizAnswer2 === 'same') correctCount++;
        if (quizAnswer3 === 'north') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand magnetism! +${earnedXP} XP`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Review magnetic poles.`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: opposite poles attract, same poles repel.`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setMagnet1({ id: 'magnet1', x: 150, y: 150, rotation: 0, flipped: false });
        setMagnet2({ id: 'magnet2', x: 350, y: 150, rotation: 0, flipped: false });
        setCompassPositions([]);
        setInteractionType('none');
        setObservationsCount(0);
        setShowFieldLines(true);
        setQuizAnswer1(undefined);
        setQuizAnswer2(undefined);
        setQuizAnswer3(undefined);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setCollectedSupplies([]);
        setTeacherMessage("Ready to explore magnetism again!");
    };

    const generateFieldLines = () => {
        const lines: JSX.Element[] = [];
        
        // Only show field lines when magnets are far apart (not interfering)
        const distance = Math.sqrt(Math.pow(magnet2.x - magnet1.x, 2) + Math.pow(magnet2.y - magnet1.y, 2));
        if (distance < 150) {
            // Magnets are close - don't show field lines to avoid interference
            return lines;
        }
        
        // Generate field lines from each magnet's poles
        // Field lines go from North (red) to South (blue)
        
        // From Magnet 1
        const m1NorthX = magnet1.flipped ? magnet1.x - 45 : magnet1.x + 45;
        const m1SouthX = magnet1.flipped ? magnet1.x + 45 : magnet1.x - 45;
        
        // From Magnet 2
        const m2NorthX = magnet2.flipped ? magnet2.x - 45 : magnet2.x + 45;
        const m2SouthX = magnet2.flipped ? magnet2.x + 45 : magnet2.x - 45;
        
        // Generate curved field lines between opposite poles
        for (let i = -3; i <= 3; i++) {
            const offsetY = i * 20;
            
            // Line from M1 North to M2 South
            if (magnet1.x < magnet2.x) {
                const startX = m1NorthX;
                const startY = magnet1.y + offsetY;
                const endX = m2SouthX;
                const endY = magnet2.y + offsetY;
                
                const controlX1 = startX + (endX - startX) * 0.3;
                const controlY1 = startY + offsetY * 0.5;
                const controlX2 = startX + (endX - startX) * 0.7;
                const controlY2 = endY + offsetY * 0.5;
                
                lines.push(
                    <motion.path
                        key={`line-m1n-m2s-${i}`}
                        d={`M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`}
                        stroke="#3b82f6"
                        strokeWidth="1.5"
                        fill="none"
                        strokeDasharray="4,4"
                        opacity={0.4}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                    />
                );
            }
        }
        
        // Generate field lines that loop around each magnet
        for (let i = 0; i < 4; i++) {
            const angle = (i * 90) + 45;
            const radius = 60;
            const startX = magnet1.x + Math.cos(angle * Math.PI / 180) * 45;
            const startY = magnet1.y + Math.sin(angle * Math.PI / 180) * 45;
            const endX = magnet1.x - Math.cos(angle * Math.PI / 180) * 45;
            const endY = magnet1.y - Math.sin(angle * Math.PI / 180) * 45;
            
            lines.push(
                <motion.path
                    key={`loop-m1-${i}`}
                    d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`}
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="4,4"
                    opacity={0.3}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: i * 0.15 }}
                />
            );
            
            const startX2 = magnet2.x + Math.cos(angle * Math.PI / 180) * 45;
            const startY2 = magnet2.y + Math.sin(angle * Math.PI / 180) * 45;
            const endX2 = magnet2.x - Math.cos(angle * Math.PI / 180) * 45;
            const endY2 = magnet2.y - Math.sin(angle * Math.PI / 180) * 45;
            
            lines.push(
                <motion.path
                    key={`loop-m2-${i}`}
                    d={`M ${startX2} ${startY2} A ${radius} ${radius} 0 0 1 ${endX2} ${endY2}`}
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="4,4"
                    opacity={0.3}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: i * 0.15 + 0.5 }}
                />
            );
        }
        
        return lines;
    };

    return (
        <div className="relative min-h-screen pb-20">
            {/* Premium Animated Background - Physics Theme (Red/Pink) */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-red-950/30 dark:via-pink-950/30 dark:to-rose-950/30" />
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-red-400/20 to-pink-400/20 dark:from-red-600/10 dark:to-pink-600/10 blur-3xl"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 100, 0],
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 20 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5,
                        }}
                        style={{
                            width: `${200 + i * 50}px`,
                            height: `${200 + i * 50}px`,
                            left: `${(i * 12.5) % 100}%`,
                            top: `${(i * 15) % 100}%`,
                        }}
                    />
                ))}
            </div>

            <div className="relative space-y-6">
                {/* Teacher Voice */}
                <TeacherVoice 
                    message={teacherMessage}
                    emotion={currentStep === 'complete' ? 'celebrating' : (currentStep === 'experiment' || currentStep === 'setup') ? 'explaining' : 'happy'}
                    quickActions={[
                        { label: 'Reset Lab', icon: '🔄', onClick: handleRestart },
                        { label: 'View Theory', icon: '📖', onClick: () => {} },
                        { label: 'Safety Tips', icon: '🛡️', onClick: () => {} }
                    ]}
                />

            {currentStep === 'intro' && isCompleted && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                            <Trophy className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-900 dark:text-red-100">Lab Completed!</h3>
                            <p className="text-sm text-red-700 dark:text-red-300">
                                Completed: {new Date(completion?.completedAt || '').toLocaleDateString()} • 
                                Total XP: {completion?.xpEarned || 0}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {showCelebration && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
                >
                    <Card className="w-full max-w-md mx-4 border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-red-50 dark:from-yellow-950/30 dark:to-red-950/30 shadow-2xl">
                        <CardHeader className="text-center">
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5 }}
                                className="flex justify-center mb-4"
                            >
                                <Trophy className="h-20 w-20 text-yellow-500" />
                            </motion.div>
                            <CardTitle className="text-2xl">Congratulations!</CardTitle>
                            <CardDescription>You've mastered magnetic fields!</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-red-600">
                                <Award className="h-8 w-8" />
                                +{xpEarned} XP
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You understand how magnets work!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

                {/* Objective Card - Premium Design */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="border-2 border-red-200/50 dark:border-red-800/50 bg-gradient-to-br from-red-50/80 via-pink-50/80 to-rose-50/80 dark:from-red-950/40 dark:via-pink-950/40 dark:to-rose-950/40 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Magnet className="h-6 w-6 text-red-600 dark:text-red-400" />
                                Magnetic Field Lab
                            </CardTitle>
                            <CardDescription className="text-base">Explore invisible magnetic force fields and interactions between magnets</CardDescription>
                        </CardHeader>
                    </Card>
                </motion.div>

                {/* Lab Information Card - Premium Design */}
                {currentStep === 'intro' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-2 border-red-200/50 dark:border-red-800/50 bg-gradient-to-br from-white/90 to-red-50/90 dark:from-gray-900/90 dark:to-red-950/90 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-red-600" />
                                Lab Information
                            </CardTitle>
                        </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="theory">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    <span>Background Theory</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                                <p><strong>Magnetism</strong> is a force that can attract or repel magnetic materials.</p>
                                <p className="mt-2"><strong>Key Concepts:</strong></p>
                                <ul>
                                    <li>Every magnet has two poles: North (N) and South (S)</li>
                                    <li>Opposite poles attract (N-S)</li>
                                    <li>Same poles repel (N-N or S-S)</li>
                                    <li>Magnetic field is the region around a magnet where magnetic force acts</li>
                                    <li>Field lines go from North to South pole</li>
                                    <li>Closer field lines mean stronger magnetic field</li>
                                </ul>
                                <p className="mt-2"><strong>Magnetic Field Properties:</strong></p>
                                <ul>
                                    <li>Invisible but can be detected using iron filings or compasses</li>
                                    <li>Field strength decreases with distance from the magnet</li>
                                    <li>Field lines never cross each other</li>
                                    <li>Field is strongest at the poles</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="safety">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    <span>Safety Precautions</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                                <ul>
                                    <li>Keep magnets away from electronic devices (phones, computers, credit cards)</li>
                                    <li>Strong magnets can pinch fingers - handle carefully</li>
                                    <li>Store magnets with keepers to preserve magnetism</li>
                                    <li>Don't drop magnets - can lose magnetization</li>
                                    <li>Keep magnets away from pacemakers and medical devices</li>
                                    <li>Supervise children when using strong magnets</li>
                                    <li>Clean up iron filings carefully to avoid skin irritation</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
            </motion.div>
            )}

            <AnimatePresence mode="wait">
                {currentStep === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-red-200/50 dark:border-red-800/50 bg-gradient-to-br from-white/90 to-red-50/90 dark:from-gray-900/90 dark:to-red-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-xl">Welcome to Magnetic Field Lab!</CardTitle>
                                <CardDescription className="text-base">Discover the invisible forces around magnets</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-red-200 dark:border-red-800">
                                    <div className="flex flex-col sm:flex-row items-start gap-4">
                                        <Magnet className="w-16 h-16 text-red-600 dark:text-red-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-red-900 dark:text-red-100">What You'll Learn:</h3>
                                            <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                                                <li>• How to visualize invisible magnetic fields</li>
                                                <li>• Why opposite poles attract and same poles repel</li>
                                                <li>• How to map magnetic field lines using compasses</li>
                                                <li>• The shape and direction of magnetic fields</li>
                                                <li>• Real-world applications of magnetism</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleStartExperiment} 
                                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg" 
                                    size="lg"
                                >
                                    Start Experiment
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'collect-supplies' && (
                    <motion.div
                        key="collect-supplies"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <LabSupplies
                            supplies={supplies}
                            collectedItems={collectedSupplies}
                            onCollect={handleCollectSupply}
                            onAllCollected={handleAllSuppliesCollected}
                            showSupplies={true}
                        />
                    </motion.div>
                )}

                {currentStep === 'setup' && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <Card className="border-2 border-red-200/50 dark:border-red-800/50 bg-gradient-to-br from-white/90 to-red-50/90 dark:from-gray-900/90 dark:to-red-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Magnet className="h-6 w-6 text-red-600" />
                                    Interactive Magnetic Field
                                </CardTitle>
                                <CardDescription className="text-base">Drag magnets together to see attraction and repulsion!</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Interaction Display with Debug Info */}
                                {interactionType !== 'none' && (() => {
                                    // Calculate facing poles for display
                                    let m1Pole = '';
                                    let m2Pole = '';
                                    const horizontalAlignment = Math.abs(magnet1.y - magnet2.y) < 50;
                                    if (horizontalAlignment) {
                                        if (magnet1.x < magnet2.x) {
                                            m1Pole = magnet1.flipped ? 'N' : 'S';
                                            m2Pole = magnet2.flipped ? 'S' : 'N';
                                        } else {
                                            m1Pole = magnet1.flipped ? 'S' : 'N';
                                            m2Pole = magnet2.flipped ? 'N' : 'S';
                                        }
                                    }
                                    
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={cn(
                                                "p-4 rounded-lg border-2 font-semibold text-center text-lg",
                                                interactionType === 'attract' && "bg-green-50 dark:bg-green-950/20 border-green-500 text-green-700 dark:text-green-300",
                                                interactionType === 'repel' && "bg-red-50 dark:bg-red-950/20 border-red-500 text-red-700 dark:text-red-300"
                                            )}
                                        >
                                            {interactionType === 'attract' ? (
                                                <div>
                                                    <div className="text-2xl mb-2">🧲 ATTRACTION</div>
                                                    <div>Opposite poles ({m1Pole}-{m2Pole}) are pulling together!</div>
                                                    <div className="text-sm mt-2 opacity-75">M1 facing: {m1Pole}, M2 facing: {m2Pole}</div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="text-2xl mb-2">⚡ REPULSION</div>
                                                    <div>Same poles ({m1Pole}-{m2Pole}) are pushing apart!</div>
                                                    <div className="text-sm mt-2 opacity-75">M1 facing: {m1Pole}, M2 facing: {m2Pole}</div>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })()}

                                {/* SVG Canvas */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                                    <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            💡 <strong>How to use:</strong> Click and drag the <strong>red/blue magnets</strong> below to move them. When they get close, watch them attract (snap together) or repel (push apart)!
                                        </p>
                                    </div>
                                    <svg 
                                        width="500" 
                                        height="400" 
                                        className="w-full h-auto border border-gray-300 dark:border-gray-600 rounded" 
                                        viewBox="0 0 500 400"
                                        style={{ minHeight: '400px', backgroundColor: 'rgba(255,255,255,0.5)' }}
                                        onMouseMove={handleMagnetMouseMove}
                                        onMouseUp={handleMagnetMouseUp}
                                        onMouseLeave={handleMagnetMouseUp}
                                    >
                                        {/* Background grid for reference */}
                                        <defs>
                                            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                                                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
                                            </pattern>
                                        </defs>
                                        <rect width="500" height="400" fill="url(#grid)" />
                                        
                                        {/* Field Lines - Only show when magnets are far apart */}
                                        {showFieldLines && generateFieldLines()}
                                        
                                        {/* Interaction zone indicator */}
                                        {(() => {
                                            const distance = Math.sqrt(Math.pow(magnet2.x - magnet1.x, 2) + Math.pow(magnet2.y - magnet1.y, 2));
                                            const maxForceDistance = 250;
                                            if (distance < maxForceDistance && interactionType !== 'none') {
                                                const midX = (magnet1.x + magnet2.x) / 2;
                                                const midY = (magnet1.y + magnet2.y) / 2;
                                                return (
                                                    <motion.circle
                                                        cx={midX}
                                                        cy={midY}
                                                        r={distance / 2}
                                                        fill="none"
                                                        stroke={interactionType === 'attract' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}
                                                        strokeWidth="2"
                                                        strokeDasharray="8,4"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    />
                                                );
                                            }
                                            return null;
                                        })()}
                                        
                                        {/* Force Arrows - Visual indicator of attraction/repulsion */}
                                        {interactionType !== 'none' && (() => {
                                            const dx = magnet2.x - magnet1.x;
                                            const dy = magnet2.y - magnet1.y;
                                            const distance = Math.sqrt(dx * dx + dy * dy);
                                            const midX = (magnet1.x + magnet2.x) / 2;
                                            const midY = (magnet1.y + magnet2.y) / 2;
                                            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                                            
                                            return (
                                                <g>
                                                    {/* Arrow pointing from magnet1 to magnet2 */}
                                                    <motion.g
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transform={`translate(${magnet1.x + (dx * 0.3)}, ${magnet1.y + (dy * 0.3)}) rotate(${angle})`}
                                                    >
                                                        <path
                                                            d={`M 0 0 L ${interactionType === 'attract' ? '30' : '-30'} 0`}
                                                            stroke={interactionType === 'attract' ? '#10b981' : '#ef4444'}
                                                            strokeWidth="3"
                                                            markerEnd="url(#arrowhead)"
                                                        />
                                                    </motion.g>
                                                    {/* Arrow pointing from magnet2 to magnet1 */}
                                                    <motion.g
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transform={`translate(${magnet2.x - (dx * 0.3)}, ${magnet2.y - (dy * 0.3)}) rotate(${angle + 180})`}
                                                    >
                                                        <path
                                                            d={`M 0 0 L ${interactionType === 'attract' ? '30' : '-30'} 0`}
                                                            stroke={interactionType === 'attract' ? '#10b981' : '#ef4444'}
                                                            strokeWidth="3"
                                                            markerEnd="url(#arrowhead)"
                                                        />
                                                    </motion.g>
                                                    {/* Arrow marker definition */}
                                                    <defs>
                                                        <marker
                                                            id="arrowhead"
                                                            markerWidth="10"
                                                            markerHeight="10"
                                                            refX="9"
                                                            refY="3"
                                                            orient="auto"
                                                        >
                                                            <polygon
                                                                points="0 0, 10 3, 0 6"
                                                                fill={interactionType === 'attract' ? '#10b981' : '#ef4444'}
                                                            />
                                                        </marker>
                                                    </defs>
                                                </g>
                                            );
                                        })()}
                                        
                                        {/* Magnet 1 - Draggable - Larger and more visible */}
                                        <g 
                                            transform={`translate(${magnet1.x},${magnet1.y}) rotate(${magnet1.rotation})`}
                                            onMouseDown={(e) => handleMagnetMouseDown(e, 'magnet1')}
                                            style={{ cursor: isDragging === 'magnet1' ? 'grabbing' : 'grab' }}
                                        >
                                            <motion.g
                                                animate={isDragging === 'magnet1' ? { scale: 1.15 } : { scale: 1 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {/* Outer border for better visibility */}
                                                <rect x="-50" y="-15" width="100" height="30" rx="5" fill="rgba(0,0,0,0.1)" />
                                                {/* Main magnet body */}
                                                <rect x="-45" y="-12" width="90" height="24" rx="4" stroke="black" strokeWidth="3" fill="white" />
                                                {/* Left side: flipped=false→Red(N), flipped=true→Blue(S) */}
                                                <rect 
                                                    x="-45" 
                                                    y="-12" 
                                                    width="45" 
                                                    height="24" 
                                                    rx="4" 
                                                    fill={magnet1.flipped ? "#3b82f6" : "#ef4444"} 
                                                />
                                                {/* Right side: flipped=false→Blue(S), flipped=true→Red(N) */}
                                                <rect 
                                                    x="0" 
                                                    y="-12" 
                                                    width="45" 
                                                    height="24" 
                                                    rx="4" 
                                                    fill={magnet1.flipped ? "#ef4444" : "#3b82f6"} 
                                                />
                                                {/* Labels - Left side label */}
                                                <text x="-22" y="6" textAnchor="middle" fill="white" fontWeight="bold" fontSize="16" stroke="white" strokeWidth="0.5">
                                                    {magnet1.flipped ? 'S' : 'N'}
                                                </text>
                                                {/* Labels - Right side label */}
                                                <text x="22" y="6" textAnchor="middle" fill="white" fontWeight="bold" fontSize="16" stroke="white" strokeWidth="0.5">
                                                    {magnet1.flipped ? 'N' : 'S'}
                                                </text>
                                                {/* Drag indicator */}
                                                {!isDragging && (
                                                    <motion.circle
                                                        cx="0"
                                                        cy="0"
                                                        r="35"
                                                        fill="none"
                                                        stroke="rgba(59, 130, 246, 0.3)"
                                                        strokeWidth="2"
                                                        strokeDasharray="5,5"
                                                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    />
                                                )}
                                            </motion.g>
                                        </g>
                                        
                                        {/* Magnet 2 - Draggable - Larger and more visible */}
                                        <g 
                                            transform={`translate(${magnet2.x},${magnet2.y}) rotate(${magnet2.rotation})`}
                                            onMouseDown={(e) => handleMagnetMouseDown(e, 'magnet2')}
                                            style={{ cursor: isDragging === 'magnet2' ? 'grabbing' : 'grab' }}
                                        >
                                            <motion.g
                                                animate={isDragging === 'magnet2' ? { scale: 1.15 } : { scale: 1 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {/* Outer border for better visibility */}
                                                <rect x="-50" y="-15" width="100" height="30" rx="5" fill="rgba(0,0,0,0.1)" />
                                                {/* Main magnet body */}
                                                <rect x="-45" y="-12" width="90" height="24" rx="4" stroke="black" strokeWidth="3" fill="white" />
                                                {/* Left side: flipped=false→Red(N), flipped=true→Blue(S) */}
                                                <rect 
                                                    x="-45" 
                                                    y="-12" 
                                                    width="45" 
                                                    height="24" 
                                                    rx="4" 
                                                    fill={magnet2.flipped ? "#3b82f6" : "#ef4444"} 
                                                />
                                                {/* Right side: flipped=false→Blue(S), flipped=true→Red(N) */}
                                                <rect 
                                                    x="0" 
                                                    y="-12" 
                                                    width="45" 
                                                    height="24" 
                                                    rx="4" 
                                                    fill={magnet2.flipped ? "#ef4444" : "#3b82f6"} 
                                                />
                                                {/* Labels - Left side label */}
                                                <text x="-22" y="6" textAnchor="middle" fill="white" fontWeight="bold" fontSize="16" stroke="white" strokeWidth="0.5">
                                                    {magnet2.flipped ? 'S' : 'N'}
                                                </text>
                                                {/* Labels - Right side label */}
                                                <text x="22" y="6" textAnchor="middle" fill="white" fontWeight="bold" fontSize="16" stroke="white" strokeWidth="0.5">
                                                    {magnet2.flipped ? 'N' : 'S'}
                                                </text>
                                                {/* Drag indicator */}
                                                {!isDragging && (
                                                    <motion.circle
                                                        cx="0"
                                                        cy="0"
                                                        r="35"
                                                        fill="none"
                                                        stroke="rgba(59, 130, 246, 0.3)"
                                                        strokeWidth="2"
                                                        strokeDasharray="5,5"
                                                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                                    />
                                                )}
                                            </motion.g>
                                        </g>
                                        
                                        {/* Compasses */}
                                        {compassPositions.map((compass, idx) => (
                                            <g key={idx} transform={`translate(${compass.x},${compass.y})`}>
                                                <circle cx="0" cy="0" r="15" fill="white" stroke="gray" strokeWidth="2" />
                                                <g transform={`rotate(${compass.angle})`}>
                                                    <path d="M 0 -12 L 5 0 L 0 4 L -5 0 Z" fill="#ef4444" />
                                                    <path d="M 0 12 L 5 0 L 0 4 L -5 0 Z" fill="gray" />
                                                </g>
                                            </g>
                                        ))}
                                    </svg>
                                </div>

                                {/* Controls */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm">Magnet 1 Controls:</h4>
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleFlipMagnet('magnet1')} size="sm" variant="outline" className="flex-1">
                                                <RotateCw className="h-4 w-4 mr-1" />
                                                Flip Poles
                                            </Button>
                                            <Button onClick={() => handleRotateMagnet('magnet1')} size="sm" variant="outline" className="flex-1">
                                                <Move className="h-4 w-4 mr-1" />
                                                Rotate
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm">Magnet 2 Controls:</h4>
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleFlipMagnet('magnet2')} size="sm" variant="outline" className="flex-1">
                                                <RotateCw className="h-4 w-4 mr-1" />
                                                Flip Poles
                                            </Button>
                                            <Button onClick={() => handleRotateMagnet('magnet2')} size="sm" variant="outline" className="flex-1">
                                                <Move className="h-4 w-4 mr-1" />
                                                Rotate
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Field Lines Toggle */}
                                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <span className="text-sm font-medium">Show Magnetic Field Lines</span>
                                    <Switch checked={showFieldLines} onCheckedChange={setShowFieldLines} />
                                </div>

                                {/* Place Compass Button */}
                                <Button 
                                    onClick={handlePlaceCompass}
                                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg"
                                    size="lg"
                                >
                                    <Compass className="h-5 w-5 mr-2" />
                                    Place Compass
                                </Button>

                                {/* Instructions */}
                                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                    <h4 className="font-semibold text-sm mb-2">Instructions:</h4>
                                    <ul className="text-sm space-y-1">
                                        <li>• <strong>Drag magnets</strong> close together to see them attract or repel!</li>
                                        <li>• <strong>Flip poles</strong> (click Flip button) to change attraction to repulsion</li>
                                        <li>• <strong>Watch the arrows</strong> - green arrows show attraction, red show repulsion</li>
                                        <li>• <strong>Opposite poles (N-S)</strong> attract and snap together</li>
                                        <li>• <strong>Same poles (N-N or S-S)</strong> repel and push apart</li>
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleRecordObservation} 
                                    disabled={interactionType === 'none'}
                                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg disabled:opacity-50"
                                    size="lg"
                                >
                                    Continue to Results
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'results' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-red-200/50 dark:border-red-800/50 bg-gradient-to-br from-white/90 to-red-50/90 dark:from-gray-900/90 dark:to-red-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <CheckCircle className="h-6 w-6 text-red-600" />
                                    Analysis & Results
                                </CardTitle>
                                <CardDescription className="text-base">Magnetic Field Observations</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Results Summary */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg border-2 border-green-200 dark:border-green-800">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                        Magnetic Fields Mapped!
                                    </h3>
                                    <p className="text-sm mb-4">
                                        You successfully mapped the magnetic field using {compassPositions.length} compass observations!
                                    </p>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded">
                                        <p className="text-sm"><strong>Compasses Placed:</strong> {compassPositions.length}</p>
                                        <p className="text-sm"><strong>Field Lines:</strong> {showFieldLines ? 'Visible' : 'Hidden'}</p>
                                        <p className="text-sm"><strong>Magnet Configuration:</strong> {magnet1.flipped === magnet2.flipped ? 'Same poles facing' : 'Opposite poles facing'}</p>
                                    </div>
                                </div>

                                {/* Key Observations */}
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-red-200 dark:border-red-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Observations:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Opposite Poles Attract:</strong> North and South poles pull together</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Same Poles Repel:</strong> North-North or South-South push apart</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Field Lines:</strong> Go from North to South pole</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Compass Alignment:</strong> Needle aligns with field direction</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Real-World Applications */}
                                <div className="border-2 border-red-200 dark:border-red-800 p-6 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-4">Real-World Applications:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• <strong>Compasses:</strong> Navigate using Earth's magnetic field</li>
                                        <li>• <strong>Electric Motors:</strong> Use magnetic forces to create rotation</li>
                                        <li>• <strong>Generators:</strong> Convert motion into electricity using magnetism</li>
                                        <li>• <strong>MRI Machines:</strong> Use strong magnetic fields for medical imaging</li>
                                        <li>• <strong>Magnetic Levitation:</strong> Trains float using magnetic repulsion</li>
                                        <li>• <strong>Data Storage:</strong> Hard drives use magnetism to store information</li>
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleViewQuiz} 
                                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg" 
                                    size="lg"
                                >
                                    Continue to Quiz
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'quiz' && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-red-200/50 dark:border-red-800/50 bg-gradient-to-br from-white/90 to-red-50/90 dark:from-gray-900/90 dark:to-red-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-xl">Knowledge Check</CardTitle>
                                <CardDescription className="text-base">Test your understanding of magnetism</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. What happens when opposite magnetic poles are brought together?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'opposite', label: 'They attract each other', isCorrect: true },
                                            { value: 'repel', label: 'They repel each other' },
                                            { value: 'nothing', label: 'Nothing happens' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer1(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer1 === option.value && !quizSubmitted && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer1 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer1 === option.value && !quizSubmitted && "border-red-500 bg-red-500",
                                                        quizAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-500",
                                                        quizAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-500",
                                                        quizAnswer1 !== option.value && "border-gray-300"
                                                    )}>
                                                        {quizAnswer1 === option.value && (
                                                            <div className="w-2 h-2 bg-white rounded-full" />
                                                        )}
                                                    </div>
                                                    <span>{option.label}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Question 2 */}
                                <div className="space-y-3">
                                    <p className="font-medium">2. What happens when two North poles are brought together?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'same', label: 'They repel each other', isCorrect: true },
                                            { value: 'attract', label: 'They attract each other' },
                                            { value: 'cancel', label: 'They cancel each other out' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer2(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer2 === option.value && !quizSubmitted && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer2 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer2 === option.value && !quizSubmitted && "border-red-500 bg-red-500",
                                                        quizAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-500",
                                                        quizAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-500",
                                                        quizAnswer2 !== option.value && "border-gray-300"
                                                    )}>
                                                        {quizAnswer2 === option.value && (
                                                            <div className="w-2 h-2 bg-white rounded-full" />
                                                        )}
                                                    </div>
                                                    <span>{option.label}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Question 3 */}
                                <div className="space-y-3">
                                    <p className="font-medium">3. Magnetic field lines go from:</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'north', label: 'North pole to South pole', isCorrect: true },
                                            { value: 'south', label: 'South pole to North pole' },
                                            { value: 'center', label: 'Center outward in all directions' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer3(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer3 === option.value && !quizSubmitted && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer3 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer3 === option.value && !quizSubmitted && "border-red-500 bg-red-500",
                                                        quizAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-500",
                                                        quizAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-500",
                                                        quizAnswer3 !== option.value && "border-gray-300"
                                                    )}>
                                                        {quizAnswer3 === option.value && (
                                                            <div className="w-2 h-2 bg-white rounded-full" />
                                                        )}
                                                    </div>
                                                    <span>{option.label}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {quizFeedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "p-4 rounded-lg border-2",
                                            quizFeedback.includes('Perfect') || quizFeedback.includes('all 3') ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100" :
                                            quizFeedback.includes('Good') ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100" :
                                            "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100"
                                        )}
                                    >
                                        {quizFeedback}
                                    </motion.div>
                                )}
                            </CardContent>
                            <CardFooter className="flex gap-3">
                                <Button 
                                    onClick={handleQuizSubmit} 
                                    disabled={!quizAnswer1 || !quizAnswer2 || !quizAnswer3 || quizSubmitted}
                                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg disabled:opacity-50"
                                    size="lg"
                                >
                                    Submit Answers
                                </Button>
                                {quizSubmitted && !quizFeedback.includes('all 3') && (
                                    <Button onClick={() => {
                                        setQuizAnswer1(undefined);
                                        setQuizAnswer2(undefined);
                                        setQuizAnswer3(undefined);
                                        setQuizFeedback('');
                                        setQuizSubmitted(false);
                                    }} variant="outline" size="lg">
                                        Try Again
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-yellow-400/50 dark:border-yellow-600/50 bg-gradient-to-br from-yellow-50/90 via-red-50/90 to-pink-50/90 dark:from-yellow-950/40 dark:via-red-950/40 dark:to-pink-950/40 backdrop-blur-sm shadow-2xl">
                            <CardHeader className="text-center">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="flex justify-center mb-4"
                                >
                                    <Trophy className="h-20 w-20 text-yellow-500" />
                                </motion.div>
                                <CardTitle className="text-2xl">Lab Complete!</CardTitle>
                                <CardDescription className="text-base">You've mastered magnetic fields!</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-red-200 dark:border-red-800">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <Award className="h-8 w-8 text-red-600" />
                                        <span className="text-2xl font-bold text-red-600">+{xpEarned} XP</span>
                                    </div>
                                    <h3 className="font-semibold text-center text-lg mb-4">What You've Learned:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span>Opposite magnetic poles attract each other</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span>Same magnetic poles repel each other</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span>Magnetic field lines go from North to South</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span>How compasses detect and align with magnetic fields</span>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleRestart} 
                                    variant="outline" 
                                    className="w-full border-2 bg-white/50 hover:bg-white/80 dark:bg-gray-900/50 dark:hover:bg-gray-900/80" 
                                    size="lg"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Restart Lab
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>
        </div>
    );
}

