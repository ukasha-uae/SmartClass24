
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Move, Magnet, Compass, RotateCw, Repeat } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

// --- Reusable SVG Components ---

const BarMagnet = ({ id, rotation = 0, onMouseDown, onTouchStart, isSelected, flipped }: { id: string, rotation?: number, onMouseDown: React.MouseEventHandler, onTouchStart: React.TouchEventHandler, isSelected?: boolean, flipped?: boolean }) => (
    <g transform={`rotate(${rotation})`} onMouseDown={onMouseDown} onTouchStart={onTouchStart} className="cursor-move active:cursor-grabbing">
        {/* Main magnet body with border */}
        <rect x="-40" y="-10" width="80" height="20" rx="3" className={cn("stroke-2", isSelected ? "stroke-accent" : "stroke-gray-600 dark:stroke-gray-400")} />
        
        {/* Colored halves */}
        <rect x={flipped ? 0 : -40} y="-10" width="40" height="20" rx="3" ry="3" className={cn("transition-colors", flipped ? "fill-blue-500" : "fill-red-500")} />
        <rect x={flipped ? -40 : 0} y="-10" width="40" height="20" rx="3" ry="3" className={cn("transition-colors", flipped ? "fill-red-500" : "fill-blue-500")} />
        
        {/* Poles text */}
        <text x={flipped ? "20" : "-20"} y="4" textAnchor="middle" className="fill-white font-bold text-xs select-none pointer-events-none">N</text>
        <text x={flipped ? "-20" : "20"} y="4" textAnchor="middle" className="fill-white font-bold text-xs select-none pointer-events-none">S</text>
    </g>
);


const CompassVisual = ({ angle }: { angle: number }) => (
    <g>
        <circle cx="0" cy="0" r="20" className="fill-white/80 dark:fill-gray-800/80 stroke-gray-500" />
        <g transform={`rotate(${angle})`}>
            <path d="M 0 -15 L 6 0 L 0 5 L -6 0 Z" className="fill-red-500" />
            <path d="M 0 15 L 6 0 L 0 5 L -6 0 Z" className="fill-gray-400" />
        </g>
    </g>
);

// --- Component for Rendering Highlighted Text ---
const HighlightedText = ({ text, sectionId, highlightedSentenceIndex }: {
  text: string;
  sectionId: string;
  highlightedSentenceIndex: number | null;
}) => {
  const sentences = React.useMemo(() => {
    if (!text) return [];
    const matches = text.match(/[^.!?]+[.!?]+(\s|$)/g);
    return matches ? matches.filter(s => s.trim().length > 0) : [text];
  }, [text]);

  if (highlightedSentenceIndex === null || sectionId === null) {
    return <>{text}</>;
  }

  return (
    <>
      {sentences.map((sentence, index) => (
        <span
          key={index}
          className={cn(
            "transition-colors duration-200",
            index === highlightedSentenceIndex && "bg-yellow-200 dark:bg-yellow-800/50 rounded"
          )}
        >
          {sentence}
        </span>
      ))}
    </>
  );
};


export function MagneticFieldLab() {
    const { toast } = useToast();
    const isMobile = useIsMobile();
    
    // Lab 1 (Compass) State
    const [magnet1Pos, setMagnet1Pos] = React.useState({ x: 200, y: 100 });
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [magnet1Rotation, setMagnet1Rotation] = React.useState(0);
    const [compassAngle, setCompassAngle] = React.useState(0);
    const svgRef1 = React.useRef<SVGSVGElement>(null);

    // Lab 2 (Attraction/Repulsion) State
    const [magnetAPos, setMagnetAPos] = React.useState({ x: 100, y: 150 });
    const [magnetBPos, _setMagnetBPos] = React.useState({ x: 300, y: 150 });
    const [magnetAIsFlipped, setMagnetAIsFlipped] = React.useState(false);
    const [interactionState, setInteractionState] = React.useState<'none' | 'attract' | 'repel'>('none');
    const svgRef2 = React.useRef<SVGSVGElement>(null);

    // Dragging State
    const [draggedItem, setDraggedItem] = React.useState<{ id: string, offsetX: number, offsetY: number } | null>(null);

    // Quiz States
    const [quiz1Answer, setQuiz1Answer] = React.useState<string | undefined>();
    const [quiz1Feedback, setQuiz1Feedback] = React.useState<string | null>(null);
    const [quiz2Answer, setQuiz2Answer] = React.useState<string | undefined>();
    const [quiz2Feedback, setQuiz2Feedback] = React.useState<string | null>(null);
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    // Compass Angle Calculation
    React.useEffect(() => {
        const magnetHalfLength = 40;
        const rad = magnet1Rotation * Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const compassPos = { x: 200, y: 220 };

        const nPole = { x: magnet1Pos.x + magnetHalfLength * cos, y: magnet1Pos.y + magnetHalfLength * sin };
        const sPole = { x: magnet1Pos.x - magnetHalfLength * cos, y: magnet1Pos.y - magnetHalfLength * sin };
        
        let totalField = { x: 0, y: 0 };
        
        const vecN = { x: compassPos.x - nPole.x, y: compassPos.y - nPole.y };
        const distN_sq = vecN.x**2 + vecN.y**2;
        if (distN_sq > 0) {
            totalField.x += vecN.x / distN_sq;
            totalField.y += vecN.y / distN_sq;
        }

        const vecS = { x: compassPos.x - sPole.x, y: compassPos.y - sPole.y };
        const distS_sq = vecS.x**2 + vecS.y**2;
        if(distS_sq > 0) {
            totalField.x -= vecS.x / distS_sq;
            totalField.y -= vecS.y / distS_sq;
        }
        
        const angleRad = Math.atan2(totalField.y, totalField.x);
        setCompassAngle(angleRad * 180 / Math.PI);

    }, [magnet1Pos, magnet1Rotation]);

    // **NEW**: Effect to handle repulsion after a flip when magnets are close
    React.useEffect(() => {
        const dx = magnetAPos.x - magnetBPos.x;
        const dy = magnetAPos.y - magnetBPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If the magnets are close enough to be considered "stuck" (attracted)
        // and a flip happens, they should now repel.
        if (distance < 90) { // A threshold slightly larger than the "snap" distance
            setMagnetAPos({ x: 100, y: 150 }); // Reset to starting position
            toast({
                title: "Repulsion!",
                description: "Flipping the magnet caused like poles to face each other, so they repel."
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [magnetAIsFlipped]);
    
    // --- Mouse and Touch Event Handlers ---

    const getSvgPoint = (e: React.MouseEvent | React.TouchEvent, svg: SVGSVGElement | null) => {
        if (!svg) return null;
        const pt = svg.createSVGPoint();
        if ('touches' in e && e.touches.length > 0) {
            pt.x = e.touches[0].clientX;
            pt.y = e.touches[0].clientY;
        } else if ('clientX' in e) {
            pt.x = e.clientX;
            pt.y = e.clientY;
        } else {
            return null;
        }
        const ctm = svg.getScreenCTM();
        if (ctm) {
            return pt.matrixTransform(ctm.inverse());
        }
        return null;
    };

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent, id: 'magnet1' | 'magnetA') => {
        const svgRef = id === 'magnet1' ? svgRef1 : svgRef2;
        const svgP = getSvgPoint(e, svgRef.current);
        const pos = id === 'magnet1' ? magnet1Pos : magnetAPos;
        if (!svgP) return;
        setDraggedItem({ id, offsetX: svgP.x - pos.x, offsetY: svgP.y - pos.y });
    };

    const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!draggedItem) return;

        const svgRef = draggedItem.id === 'magnet1' ? svgRef1 : svgRef2;
        const svgP = getSvgPoint(e, svgRef.current);
        if (!svgP) return;
        
        e.preventDefault();

        const newPos = { x: svgP.x - draggedItem.offsetX, y: svgP.y - draggedItem.offsetY };
        
        if (draggedItem.id === 'magnet1') {
            setMagnet1Pos(newPos);
        } else if (draggedItem.id === 'magnetA') {
            setMagnetAPos(newPos);

            const dx = newPos.x - magnetBPos.x;
            const dy = newPos.y - magnetBPos.y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            if (distance < 100) {
                if(magnetAIsFlipped) {
                    setInteractionState('repel');
                } else {
                    setInteractionState('attract');
                }
            } else {
                setInteractionState('none');
            }
        }
    };
    
    const handleDragEnd = () => {
        if (!draggedItem) return;

        if (interactionState === 'attract') {
            setMagnetAPos({ x: magnetBPos.x - 80, y: magnetBPos.y });
            toast({title: "Attraction!", description: "Opposite poles attract."});
        } else if (interactionState === 'repel') {
            setMagnetAPos({ x: 100, y: 150 }); // Reset position
            toast({title: "Repulsion!", description: "Like poles repel."});
        }
        
        setDraggedItem(null);
        setInteractionState('none');
    };

    const handleReset = () => {
        setMagnet1Pos({ x: 200, y: 100 });
        setMagnet1Rotation(0);
        setMagnetAPos({ x: 100, y: 150 });
        setMagnetAIsFlipped(false);
        setQuiz1Answer(undefined);
        setQuiz1Feedback(null);
        setQuiz2Answer(undefined);
        setQuiz2Feedback(null);
        setHighlightInfo(null);
        toast({ title: 'Lab Reset' });
    };

    const handleQuiz1Submit = () => {
        if (quiz1Answer === 'a') setQuiz1Feedback('Correct! The needle aligns with the field lines. ✅');
        else setQuiz1Feedback('Incorrect. Remember field lines go N to S. 🧠');
    };
    
     const handleQuiz2Submit = () => {
        if (quiz2Answer === 'b') setQuiz2Feedback('Correct! Like poles repel each other. ✅');
        else setQuiz2Feedback('Incorrect. Like poles push each other away. 🧠');
    };
    
    const objectiveText = "To demonstrate basic magnetic principles, including the interaction between magnets and compasses, and the forces of attraction and repulsion between magnetic poles.";
    const theoryText = "A magnet creates an invisible magnetic field around it, flowing from its North pole to its South pole. A compass needle aligns with these field lines. When two magnets are brought together, their fields interact. Opposite poles (North and South) attract each other, while like poles (North-North or South-South) repel each other.";
    const safetyText = "This is a virtual lab. In a real-world scenario, handle strong magnets with care to avoid pinching skin. Keep magnets away from sensitive electronic devices.";

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Objective</CardTitle>
                        <TextToSpeech
                            textToSpeak={objectiveText}
                            onSentenceChange={(i) => setHighlightInfo({ section: 'objective', sentenceIndex: i })}
                            onStart={() => setHighlightInfo({ section: 'objective', sentenceIndex: 0 })}
                            onEnd={() => setHighlightInfo(null)}
                        />
                    </div>
                    <CardDescription>
                        <HighlightedText text={objectiveText} sectionId="objective" highlightedSentenceIndex={highlightInfo?.section === 'objective' ? highlightInfo.sentenceIndex : null} />
                    </CardDescription>
                </CardHeader>
            </Card>

             <Card>
                <CardHeader><CardTitle>Lab Information</CardTitle></CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                         <AccordionItem value="theory">
                            <AccordionTrigger><BookOpen className="h-4 w-4 mr-2"/>Background Theory</AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground flex items-start gap-2">
                                <div className="flex-grow">
                                     <p><HighlightedText text={theoryText} sectionId="theory" highlightedSentenceIndex={highlightInfo?.section === 'theory' ? highlightInfo.sentenceIndex : null} /></p>
                                </div>
                                <TextToSpeech
                                    textToSpeak={theoryText}
                                    onSentenceChange={(i) => setHighlightInfo({ section: 'theory', sentenceIndex: i })}
                                    onStart={() => setHighlightInfo({ section: 'theory', sentenceIndex: 0 })}
                                    onEnd={() => setHighlightInfo(null)}
                                    className="flex-shrink-0"
                                />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="safety">
                            <AccordionTrigger><Shield className="h-4 w-4 mr-2"/>Safety Precautions</AccordionTrigger>
                             <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground flex items-start gap-2">
                                <div className="flex-grow">
                                     <p><HighlightedText text={safetyText} sectionId="safety" highlightedSentenceIndex={highlightInfo?.section === 'safety' ? highlightInfo.sentenceIndex : null} /></p>
                                </div>
                                <TextToSpeech
                                    textToSpeak={safetyText}
                                    onSentenceChange={(i) => setHighlightInfo({ section: 'safety', sentenceIndex: i })}
                                    onStart={() => setHighlightInfo({ section: 'safety', sentenceIndex: 0 })}
                                    onEnd={() => setHighlightInfo(null)}
                                    className="flex-shrink-0"
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            <Tabs defaultValue="compass" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="compass">Compass Demo</TabsTrigger>
                    <TabsTrigger value="interaction">Attraction & Repulsion</TabsTrigger>
                </TabsList>
                
                <TabsContent value="compass">
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Magnet & Compass</CardTitle><CardDescription>Drag the magnet or rotate it to see how it affects the compass.</CardDescription></CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <svg ref={svgRef1} viewBox="0 0 400 300" className="w-full max-w-lg mx-auto aspect-video bg-muted/30 dark:bg-gray-800/30 rounded-lg border cursor-default" onMouseMove={handleDragMove} onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd} onTouchMove={handleDragMove} onTouchEnd={handleDragEnd}>
                                <g transform={`translate(${magnet1Pos.x}, ${magnet1Pos.y})`}>
                                    <BarMagnet id="magnet1" rotation={magnet1Rotation} onMouseDown={(e) => handleDragStart(e, 'magnet1')} onTouchStart={(e) => handleDragStart(e, 'magnet1')} isSelected={true} />
                                </g>
                                <g transform={`translate(200, 220)`}>
                                    <CompassVisual angle={compassAngle} />
                                </g>
                            </svg>
                             <Button variant="outline" size="sm" onClick={() => setMagnet1Rotation(prev => (prev + 15) % 360)}><RotateCw className="mr-2 h-4 w-4"/>Rotate Magnet</Button>
                        </CardContent>
                        <CardFooter><p className="text-xs text-muted-foreground">The compass needle's red end (North) points in the direction of the magnetic field lines.</p></CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="interaction">
                    <Card>
                         <CardHeader><CardTitle className="text-lg">Attraction & Repulsion</CardTitle><CardDescription>Drag the left magnet towards the right one to see how they interact. Use "Flip Magnet" to change its polarity.</CardDescription></CardHeader>
                         <CardContent className="flex flex-col items-center gap-4">
                            <svg ref={svgRef2} viewBox="0 0 400 300" className="w-full max-w-lg mx-auto aspect-video bg-muted/30 dark:bg-gray-800/30 rounded-lg border cursor-default" onMouseMove={handleDragMove} onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd} onTouchMove={handleDragMove} onTouchEnd={handleDragEnd}>
                                <g transform={`translate(${magnetAPos.x}, ${magnetAPos.y})`} className={cn(interactionState !== 'none' && "transition-transform duration-300 ease-in")}>
                                     <BarMagnet id="magnetA" rotation={0} onMouseDown={(e) => handleDragStart(e, 'magnetA')} onTouchStart={(e) => handleDragStart(e, 'magnetA')} isSelected={true} flipped={magnetAIsFlipped} />
                                </g>
                                <g transform={`translate(${magnetBPos.x}, ${magnetBPos.y})`}>
                                     <BarMagnet id="magnetB" rotation={0} onMouseDown={() => {}} onTouchStart={()=>{}} />
                                </g>
                            </svg>
                             <Button variant="outline" size="sm" onClick={() => setMagnetAIsFlipped(prev => !prev)}><Repeat className="mr-2 h-4 w-4"/>Flip Left Magnet</Button>
                         </CardContent>
                         <CardFooter><p className="text-xs text-muted-foreground">Like poles (N-N, S-S) repel. Opposite poles (N-S) attract.</p></CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
            
            <Card>
                <CardHeader><CardTitle>Post-Lab Quiz</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <p className="mb-2 font-medium">1. How does a compass needle align itself in a magnetic field?</p>
                        <RadioGroup value={quiz1Answer} onValueChange={setQuiz1Answer}><div className="flex items-center space-x-2"><RadioGroupItem value="a" id="q1-a"/><Label htmlFor="q1-a">Along the magnetic field lines</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="b" id="q1-b"/><Label htmlFor="q1-b">Perpendicular to the field lines</Label></div></RadioGroup>
                        {quiz1Feedback && <p className={cn("text-sm mt-2", quiz1Feedback.includes('✅') ? 'text-green-600' : 'text-red-600')}>{quiz1Feedback}</p>}
                        <Button onClick={handleQuiz1Submit} size="sm" variant="outline" className="mt-2">Check Q1</Button>
                    </div>
                     <div>
                        <p className="mb-2 font-medium">2. What happens when two North poles are brought close together?</p>
                        <RadioGroup value={quiz2Answer} onValueChange={setQuiz2Answer}><div className="flex items-center space-x-2"><RadioGroupItem value="a" id="q2-a"/><Label htmlFor="q2-a">They attract</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="b" id="q2-b"/><Label htmlFor="q2-b">They repel</Label></div></RadioGroup>
                        {quiz2Feedback && <p className={cn("text-sm mt-2", quiz2Feedback.includes('✅') ? 'text-green-600' : 'text-red-600')}>{quiz2Feedback}</p>}
                        <Button onClick={handleQuiz2Submit} size="sm" variant="outline" className="mt-2">Check Q2</Button>
                    </div>
                </CardContent>
                 <CardFooter className="justify-center">
                    <Button variant="destructive" onClick={handleReset}>Reset Both Labs</Button>
                </CardFooter>
            </Card>

        {/* Enhanced Teacher Voice with Phase 2 Features */}
        <TeacherVoice 
          message={teacherMessage}
          autoPlay={true}
          theme="science"
          teacherName="Dr. Lab Instructor"
          emotion="explaining"
          quickActions={[
            {
              label: 'Reset Experiment',
              onClick: () => {
                // Add reset logic here
                setTeacherMessage('Experiment reset! Ready to start fresh.');
              }
            }
          ]}
        />

        </div>
    );
}
