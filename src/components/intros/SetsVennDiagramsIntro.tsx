'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Circle, Layers, Combine, Calculator, Trophy, Play, Pause, Volume2, VolumeX, GraduationCap, ChevronLeft, ChevronRight, Hash, Union, Intersection } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountryProperties } from '@/hooks/useCountryConfig';

interface LessonIntroProps {
  onComplete?: () => void;
}

const SetsVennDiagramsIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const { currencySymbol } = useCountryProperties();
  const [stage, setStage] = useState(0);
  
  // Interactive state for demonstrations
  const [setA, setSetA] = useState<string>('1,2,3');
  const [setB, setSetB] = useState<string>('3,4,5');
  const [parsedSetA, setParsedSetA] = useState<Set<string>>(new Set());
  const [parsedSetB, setParsedSetB] = useState<Set<string>>(new Set());
  const [unionResult, setUnionResult] = useState<string[]>([]);
  const [intersectionResult, setIntersectionResult] = useState<string[]>([]);
  const [differenceResult, setDifferenceResult] = useState<string[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<'union' | 'intersection' | 'difference' | null>(null);
  
  // Venn diagram values
  const [vennAOnly, setVennAOnly] = useState<number>(0);
  const [vennBOnly, setVennBOnly] = useState<number>(0);
  const [vennAB, setVennAB] = useState<number>(0);
  const [vennOutside, setVennOutside] = useState<number>(0);
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());

  const stages = [
    {
      title: "📦 Sets - Collections of Objects!",
      content: "A set is a collection of distinct objects! Learn set notation and terminology.",
      narration: `Welcome to sets and Venn diagrams! A set is a collection of distinct objects or elements. We use curly braces to write sets. For example, A equals the set containing 1, 2, 3, 4, 5. Elements are the items inside the set. The universal set, denoted by U, contains everything we're considering in a particular context. The empty set, denoted by the symbol empty set or curly braces with nothing inside, has no elements at all. Sets help us organize information logically. We use sets every day - grouping students by class, categorizing items at the market, organizing data in technology. Understanding sets is fundamental to mathematics and essential for your WASSCE examinations!`,
      highlightWords: ['set', 'collection', 'distinct objects', 'elements', 'curly braces', 'universal set', 'empty set', 'WASSCE']
    },
    {
      title: "🔤 Set Notation & Types!",
      content: "Learn how to write sets and understand different types: finite, infinite, empty, and more!",
      narration: `Sets can be written in different ways! The listing method shows all elements: A equals the set containing 1, 2, 3, 4, 5. Set-builder notation describes the rule: A equals the set of all x such that x is a natural number less than 6. We use the symbol "element of" to show membership: 3 is an element of A. We use "not an element of" to show non-membership: 6 is not an element of A. Sets can be finite - having a countable number of elements, like the set of days in a week. Sets can be infinite - having unlimited elements, like the set of natural numbers. The empty set has no elements. A subset means every element of one set is also in another set. Understanding these types helps you work with sets correctly!`,
      highlightWords: ['listing method', 'set-builder notation', 'element of', 'not an element of', 'finite', 'infinite', 'empty set', 'subset']
    },
    {
      title: "🔗 Union - Combine All Elements!",
      content: "Union combines all elements from both sets! Use the ∪ symbol.",
      narration: `Union combines all elements from both sets! The symbol for union is cup, which looks like a U. A union B includes everything in A or B or both. For example, if A equals the set containing 1, 2, 3 and B equals the set containing 3, 4, 5, then A union B equals the set containing 1, 2, 3, 4, 5. Notice that 3 appears in both sets, but in the union it's only listed once. Think of union as "or" - elements in A or B or both. The formula for the number of elements is: n of A union B equals n of A plus n of B minus n of A intersection B. This is because we count the intersection twice when we add, so we subtract it once!`,
      highlightWords: ['union', 'cup', 'combines', 'or', 'both', 'formula', 'n of A union B', 'minus', 'intersection']
    },
    {
      title: "🔀 Intersection - Common Elements!",
      content: "Intersection finds elements that are in BOTH sets! Use the ∩ symbol.",
      narration: `Intersection finds common elements! The symbol for intersection is cap, which looks like an upside-down U. A intersection B includes only what's in BOTH sets. For example, if A equals the set containing 1, 2, 3, 4 and B equals the set containing 3, 4, 5, 6, then A intersection B equals the set containing 3 and 4 - only the elements that appear in both sets. Think of intersection as "and" - elements that are in A and B. If two sets have no common elements, their intersection is the empty set, and we say the sets are disjoint. Intersection is crucial for solving Venn diagram problems, especially when filling diagrams from the center outward!`,
      highlightWords: ['intersection', 'cap', 'common elements', 'both sets', 'and', 'disjoint', 'empty set', 'center outward']
    },
    {
      title: "📊 Venn Diagrams - Visual Representation!",
      content: "Venn diagrams make sets visual! Circles represent sets, overlaps show intersections.",
      narration: `Venn diagrams make sets visual! Named after British mathematician John Venn, these diagrams use circles to represent sets. Each circle represents a set. Overlapping regions show intersection - where sets have common elements. The area outside all circles but inside the rectangle represents elements not in any of the sets, but still in the universal set. When solving problems, always start filling from the center - the intersection of all sets - and work outward. Label every region clearly. For two sets, you have three regions: A only, B only, and A intersection B. For three sets, you have seven regions! Venn diagrams help you visualize relationships and solve complex counting problems efficiently!`,
      highlightWords: ['Venn diagrams', 'circles', 'overlapping', 'intersection', 'regions', 'center', 'outward', 'visualize']
    },
    {
      title: "🧮 Solving Venn Diagram Problems!",
      content: "Use formulas and fill from the center! Practice with interactive examples.",
      narration: `Solving Venn diagram problems follows a clear strategy! First, identify what you're given - totals, intersections, or specific regions. Draw the Venn diagram with all sets. Always start filling from the center - the intersection of all sets - and work outward. Use the formula: n of A union B equals n of A plus n of B minus n of A intersection B. For three sets, the formula is more complex - add all three, subtract all pairwise intersections, then add back the triple intersection. Check your work by ensuring all regions add up to the total. Label every region clearly. Show your working step by step for full marks in WASSCE!`,
      highlightWords: ['solving', 'strategy', 'center', 'outward', 'formula', 'check', 'label', 'step by step', 'WASSCE']
    },
    {
      title: "🌍 Real-World Applications!",
      content: "Sets are everywhere - schools, markets, technology, and statistics!",
      narration: `Sets are used everywhere in real life! In schools, we group students - the set of JHS students, the set of SHS students, the set of students who play football. In markets, we categorize goods - the set of fruits, the set of vegetables, the set of items costing less than ${currencySymbol}10. In technology, databases use sets to organize information, and search filters use set operations. In statistics, we organize and analyze data using sets. In planning, event attendance and voter registration use set concepts. Understanding sets helps you organize information logically, solve complex counting problems, analyze relationships between groups, and prepare for WASSCE questions on sets, which are very common!`,
      highlightWords: ['real-world', 'schools', 'markets', 'technology', 'statistics', 'planning', 'organize', 'WASSCE']
    },
    {
      title: "🏆 WASSCE Success - Master the Methods!",
      content: "WASSCE loves Venn diagram problems! Practice these techniques for full marks.",
      narration: `WASSCE examinations frequently test sets and Venn diagrams! Here are key tips for success: They often give you totals and ask for specific regions. Always draw the Venn diagram clearly - it's worth marks! Start filling from the center intersection and work outward. Use the formula to find unknown values when given partial information. Label every region clearly with its meaning. For word problems, identify what each set represents before drawing. Check your work by ensuring all regions add up to the total. Show all your working step by step. Practice 2-set and 3-set problems from past WASSCE papers. Master these techniques and you'll score full marks on set questions!`,
      highlightWords: ['WASSCE', 'totals', 'specific regions', 'draw', 'center', 'formula', 'label', 'word problems', 'check', 'full marks']
    }
  ];

  // Parse sets from input
  useEffect(() => {
    const parseSet = (input: string): Set<string> => {
      return new Set(
        input.split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0)
      );
    };
    
    setParsedSetA(parseSet(setA));
    setParsedSetB(parseSet(setB));
  }, [setA, setB]);

  // Calculate set operations
  useEffect(() => {
    if (parsedSetA.size > 0 || parsedSetB.size > 0) {
      // Union: all elements from both sets
      const union = new Set([...parsedSetA, ...parsedSetB]);
      setUnionResult(Array.from(union).sort());
      
      // Intersection: common elements
      const intersection = new Set(
        Array.from(parsedSetA).filter(x => parsedSetB.has(x))
      );
      setIntersectionResult(Array.from(intersection).sort());
      
      // Difference A - B: elements in A but not in B
      const difference = new Set(
        Array.from(parsedSetA).filter(x => !parsedSetB.has(x))
      );
      setDifferenceResult(Array.from(difference).sort());
    }
  }, [parsedSetA, parsedSetB]);

  // Calculate Venn diagram values
  useEffect(() => {
    if (parsedSetA.size > 0 || parsedSetB.size > 0) {
      const intersection = new Set(
        Array.from(parsedSetA).filter(x => parsedSetB.has(x))
      );
      const aOnly = new Set(
        Array.from(parsedSetA).filter(x => !parsedSetB.has(x))
      );
      const bOnly = new Set(
        Array.from(parsedSetB).filter(x => !parsedSetA.has(x))
      );
      
      setVennAB(intersection.size);
      setVennAOnly(aOnly.size);
      setVennBOnly(bOnly.size);
      // Assuming universal set includes all elements from both sets
      setVennOutside(0);
    }
  }, [parsedSetA, parsedSetB]);

  // Speak the current stage narration
  const speakNarration = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis || isMuted) return;
    
    window.speechSynthesis.cancel();
    
    const narration = stages[stage].narration;
    const utterance = new SpeechSynthesisUtterance(narration);
    
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google'))
    ) || voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    let wordIndex = 0;
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentWordIndex(wordIndex);
        wordIndex++;
      }
    };
    
    utterance.onstart = () => { setIsSpeaking(true); setIsPaused(false); };
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); setCurrentWordIndex(-1); };
    utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false); };
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [stage, isMuted, stages]);

  useEffect(() => {
    if (!hasSpokenRef.current.has(stage) && !isMuted) {
      const timer = setTimeout(() => {
        speakNarration();
        hasSpokenRef.current.add(stage);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stage, speakNarration, isMuted]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const togglePause = () => {
    if (!window.speechSynthesis) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
    } else {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      setIsMuted(true);
    }
  };

  const replayNarration = () => {
    hasSpokenRef.current.delete(stage);
    speakNarration();
  };

  const handleStageChange = (newStage: number) => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setCurrentWordIndex(-1);
    setStage(newStage);
    setSelectedOperation(null);
  };

  const renderNarrationText = () => {
    const words = stages[stage].narration.split(/\s+/);
    const highlightWords = stages[stage].highlightWords;
    
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:'"]/g, '').toLowerCase();
      const isHighlightWord = highlightWords.some(hw => 
        cleanWord.includes(hw.toLowerCase()) || hw.toLowerCase().includes(cleanWord)
      );
      const isCurrentWord = index === currentWordIndex;
      
      return (
        <span
          key={index}
          className={`transition-all duration-150 ${
            isCurrentWord 
              ? 'bg-indigo-400/40 text-white font-semibold px-0.5 rounded' 
              : isHighlightWord 
                ? 'text-indigo-300 font-medium'
                : 'text-gray-300'
          }`}
        >
          {word}{' '}
        </span>
      );
    });
  };

  const formatSet = (set: Set<string>): string => {
    if (set.size === 0) return '∅';
    return `{${Array.from(set).sort().join(', ')}}`;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-opacity {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.4; }
        }
        .float-anim-0 { animation: float-opacity 4s ease-in-out 0s infinite; }
        .float-anim-1 { animation: float-opacity 4s ease-in-out 1.5s infinite; }
        .float-anim-2 { animation: float-opacity 4s ease-in-out 3s infinite; }
        .float-anim-3 { animation: float-opacity 4s ease-in-out 4.5s infinite; }
        .float-anim-4 { animation: float-opacity 4s ease-in-out 6s infinite; }
      `}} />
      <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-indigo-900/30 via-gray-900 to-purple-900/30 rounded-2xl p-4 sm:p-6 md:p-8 pb-20 sm:pb-28 overflow-hidden">
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['{', '}', '∪', '∩', '∈'].map((symbol, i) => {
            const pos = [
              { x: 20, y: 10 },
              { x: 80, y: 30 },
              { x: 150, y: 50 },
              { x: 200, y: 20 },
              { x: 250, y: 40 }
            ][i] || { x: 20, y: 10 };
            return (
              <div
                key={i}
                className={`absolute text-2xl text-indigo-400/30 float-anim-${i}`}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`
                }}
              >
                {symbol}
              </div>
            );
          })}
        </div>

        {/* Header */}
        <motion.div 
          className="text-center mb-4 sm:mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
            <Circle className="w-6 h-6 sm:w-10 sm:h-10 text-indigo-400" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Sets and Venn Diagrams
            </h2>
            <Layers className="w-6 h-6 sm:w-10 sm:h-10 text-indigo-300" />
          </div>
          <p className="text-indigo-200 text-sm sm:text-lg">Union, Intersection & Visual Representation</p>
        </motion.div>

        {/* Teacher Avatar & Narration */}
        <motion.div 
          className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-indigo-700/50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-start gap-2 sm:gap-4">
            <div className="flex-shrink-0">
              <div 
                className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center transition-all ${
                  isSpeaking && !isPaused ? 'ring-2 sm:ring-4 ring-indigo-400/50 animate-pulse' : ''
                }`}
              >
                <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
              </div>
              <p className="text-center text-[10px] sm:text-xs text-indigo-300 mt-1 hidden sm:block">Teacher</p>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm leading-relaxed max-h-16 sm:max-h-24 overflow-y-auto pr-1 sm:pr-2">
                {renderNarrationText()}
              </div>
            </div>

            <div className="flex flex-col gap-1 sm:gap-2">
              {isSpeaking ? (
                <button onClick={togglePause} className="p-1.5 sm:p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors" title={isPaused ? "Resume" : "Pause"}>
                  {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                </button>
              ) : (
                <button onClick={replayNarration} className="p-1.5 sm:p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors" title="Play narration">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              )}
              <button
                onClick={toggleMute}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${isMuted ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-600 hover:bg-gray-500'}`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stage Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-gray-800/80 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 overflow-visible"
          >
            <h3 className="text-lg sm:text-2xl font-bold text-indigo-400 mb-2 sm:mb-3">{stages[stage].title}</h3>
            <p className="text-gray-200 text-sm sm:text-lg mb-3 sm:mb-4">{stages[stage].content}</p>

            {/* Stage 0-1: Set Display */}
            {(stage === 0 || stage === 1) && (
              <div className="mt-3 sm:mt-4">
                <div className="bg-gradient-to-b from-blue-900/50 to-indigo-900/50 rounded-lg p-4 mb-4">
                  <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Create Sets:</p>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <span className="text-white font-bold">A = {'{'}</span>
                      <input
                        type="text"
                        value={setA}
                        onChange={(e) => setSetA(e.target.value)}
                        className="w-full sm:w-48 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-mono text-sm"
                        placeholder="1,2,3"
                      />
                      <span className="text-white font-bold">{'}'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <span className="text-white font-bold">B = {'{'}</span>
                      <input
                        type="text"
                        value={setB}
                        onChange={(e) => setSetB(e.target.value)}
                        className="w-full sm:w-48 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-mono text-sm"
                        placeholder="3,4,5"
                      />
                      <span className="text-white font-bold">{'}'}</span>
                    </div>
                    {(parsedSetA.size > 0 || parsedSetB.size > 0) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-blue-600/30 rounded-lg border border-blue-500"
                      >
                        <div className="text-blue-200 text-sm sm:text-base space-y-1">
                          <p>A = <span className="font-mono text-white">{formatSet(parsedSetA)}</span></p>
                          <p>B = <span className="font-mono text-white">{formatSet(parsedSetB)}</span></p>
                          <p className="text-xs text-blue-300 mt-2">
                            n(A) = {parsedSetA.size}, n(B) = {parsedSetB.size}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stage 2-3: Set Operations */}
            {(stage === 2 || stage === 3) && (
              <div className="mt-3 sm:mt-4">
                <div className="bg-gradient-to-b from-green-900/50 to-teal-900/50 rounded-lg p-4 mb-4">
                  <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Set Operations:</p>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <span className="text-white font-bold">A = {'{'}</span>
                      <input
                        type="text"
                        value={setA}
                        onChange={(e) => setSetA(e.target.value)}
                        className="w-full sm:w-32 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-mono text-sm"
                        placeholder="1,2,3"
                      />
                      <span className="text-white font-bold">{'}'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <span className="text-white font-bold">B = {'{'}</span>
                      <input
                        type="text"
                        value={setB}
                        onChange={(e) => setSetB(e.target.value)}
                        className="w-full sm:w-32 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-mono text-sm"
                        placeholder="3,4,5"
                      />
                      <span className="text-white font-bold">{'}'}</span>
                    </div>
                    
                    {/* Operation buttons */}
                    <div className="flex flex-wrap justify-center gap-2 mt-3">
                      <button
                        onClick={() => setSelectedOperation('union')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedOperation === 'union' ? 'bg-green-600 ring-2 ring-green-400' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        A ∪ B (Union)
                      </button>
                      <button
                        onClick={() => setSelectedOperation('intersection')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedOperation === 'intersection' ? 'bg-green-600 ring-2 ring-green-400' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        A ∩ B (Intersection)
                      </button>
                      <button
                        onClick={() => setSelectedOperation('difference')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedOperation === 'difference' ? 'bg-green-600 ring-2 ring-green-400' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        A - B (Difference)
                      </button>
                    </div>

                    {/* Results */}
                    {selectedOperation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-4 bg-green-600/30 rounded-lg border border-green-500"
                      >
                        {selectedOperation === 'union' && (
                          <div className="text-green-200 text-sm sm:text-base text-center">
                            <p className="font-mono mb-2">
                              A ∪ B = <span className="text-white">{formatSet(new Set(unionResult))}</span>
                            </p>
                            <p className="text-xs text-green-300">
                              n(A ∪ B) = {unionResult.length} = {parsedSetA.size} + {parsedSetB.size} - {intersectionResult.length}
                            </p>
                          </div>
                        )}
                        {selectedOperation === 'intersection' && (
                          <div className="text-green-200 text-sm sm:text-base text-center">
                            <p className="font-mono mb-2">
                              A ∩ B = <span className="text-white">{formatSet(new Set(intersectionResult))}</span>
                            </p>
                            <p className="text-xs text-green-300">
                              n(A ∩ B) = {intersectionResult.length}
                            </p>
                          </div>
                        )}
                        {selectedOperation === 'difference' && (
                          <div className="text-green-200 text-sm sm:text-base text-center">
                            <p className="font-mono mb-2">
                              A - B = <span className="text-white">{formatSet(new Set(differenceResult))}</span>
                            </p>
                            <p className="text-xs text-green-300">
                              Elements in A but not in B
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stage 4-5: Venn Diagram Visualization */}
            {(stage === 4 || stage === 5) && (
              <div className="mt-3 sm:mt-4">
                <div className="bg-gradient-to-b from-purple-900/50 to-pink-900/50 rounded-lg p-4 mb-4">
                  <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Interactive Venn Diagram:</p>
                  
                  {/* Venn Diagram SVG */}
                  <div className="flex justify-center mb-4">
                    <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
                      {/* Universal Set Box */}
                      <rect x="10" y="10" width="280" height="180" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400" rx="5" />
                      <text x="20" y="30" fontSize="14" fontWeight="bold" className="text-gray-400">U</text>
                      
                      {/* Circle A */}
                      <circle 
                        cx="110" 
                        cy="100" 
                        r="60" 
                        fill={selectedOperation === 'union' ? 'rgba(34, 197, 94, 0.2)' : selectedOperation === 'intersection' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)'}
                        stroke="currentColor" 
                        strokeWidth="2" 
                        className="text-blue-400"
                      />
                      
                      {/* Circle B */}
                      <circle 
                        cx="190" 
                        cy="100" 
                        r="60" 
                        fill={selectedOperation === 'union' ? 'rgba(34, 197, 94, 0.2)' : selectedOperation === 'intersection' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)'}
                        stroke="currentColor" 
                        strokeWidth="2" 
                        className="text-green-400"
                      />
                      
                      {/* Intersection shading */}
                      {selectedOperation === 'intersection' && (
                        <path 
                          d="M 110 100 m -60 0 a 60 60 0 0 1 120 0 a 60 60 0 0 1 -120 0 M 190 100 m -60 0 a 60 60 0 0 1 120 0" 
                          fill="rgba(34, 197, 94, 0.3)" 
                          fillRule="evenodd"
                        />
                      )}
                      
                      {/* Labels */}
                      <text x="110" y="50" textAnchor="middle" fontSize="16" fontWeight="bold" className="text-blue-400">A</text>
                      <text x="190" y="50" textAnchor="middle" fontSize="16" fontWeight="bold" className="text-green-400">B</text>
                      
                      {/* Values */}
                      <text x="80" y="105" textAnchor="middle" fontSize="12" className="text-white font-bold">{vennAOnly || ''}</text>
                      <text x="150" y="105" textAnchor="middle" fontSize="12" className="text-white font-bold">{vennAB || ''}</text>
                      <text x="220" y="105" textAnchor="middle" fontSize="12" className="text-white font-bold">{vennBOnly || ''}</text>
                    </svg>
                  </div>

                  {/* Input controls */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-gray-300">A only:</span>
                      <input
                        type="number"
                        min="0"
                        value={vennAOnly}
                        onChange={(e) => setVennAOnly(parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 bg-gray-700 text-white rounded text-center"
                      />
                      <span className="text-gray-300">A ∩ B:</span>
                      <input
                        type="number"
                        min="0"
                        value={vennAB}
                        onChange={(e) => setVennAB(parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 bg-gray-700 text-white rounded text-center"
                      />
                      <span className="text-gray-300">B only:</span>
                      <input
                        type="number"
                        min="0"
                        value={vennBOnly}
                        onChange={(e) => setVennBOnly(parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 bg-gray-700 text-white rounded text-center"
                      />
                    </div>
                    <div className="text-center text-xs text-purple-300">
                      Total: {vennAOnly + vennAB + vennBOnly} | n(A) = {vennAOnly + vennAB} | n(B) = {vennBOnly + vennAB} | n(A ∪ B) = {vennAOnly + vennAB + vennBOnly}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Quick facts */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-blue-900/50 rounded-lg p-2 sm:p-3 text-center border border-blue-700">
            <Union className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-0.5 sm:mb-1" />
            <p className="text-blue-300 text-[10px] sm:text-sm">Union</p>
            <p className="text-white font-mono text-xs sm:text-base">A ∪ B</p>
          </div>
          <div className="bg-green-900/50 rounded-lg p-2 sm:p-3 text-center border border-green-700">
            <Intersection className="w-4 h-4 sm:w-6 sm:h-6 text-green-400 mx-auto mb-0.5 sm:mb-1" />
            <p className="text-green-300 text-[10px] sm:text-sm">Intersection</p>
            <p className="text-white font-mono text-xs sm:text-base">A ∩ B</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-2 sm:p-3 text-center border border-purple-700">
            <Circle className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400 mx-auto mb-0.5 sm:mb-1" />
            <p className="text-purple-300 text-[10px] sm:text-sm">Venn Diagram</p>
            <p className="text-white font-mono text-xs sm:text-base">Visual</p>
          </div>
        </div>

        {/* Fixed Navigation - Compact mobile design */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/98 backdrop-blur-md px-2 sm:px-6 py-1.5 sm:py-4 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] sm:pb-4 border-t border-gray-700/50 z-[9999] shadow-2xl">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-0">
            {/* Stage indicators */}
            <div className="flex gap-1 sm:gap-2 overflow-x-auto flex-1 min-w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {stages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleStageChange(i)}
                  className={`flex-shrink-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                    i === stage ? 'bg-indigo-400 ring-1 ring-indigo-300' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to stage ${i + 1}`}
                />
              ))}
            </div>
            
            {/* Navigation buttons */}
            <div className="flex gap-1.5 sm:gap-3 flex-shrink-0">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStageChange(stage - 1)}
                disabled={stage === 0}
                className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-base transition-all flex items-center justify-center ${
                  stage === 0 
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50' 
                    : 'bg-gray-700 hover:bg-gray-600 text-white active:bg-gray-500'
                }`}
                aria-label="Previous stage"
              >
                <ChevronLeft className="w-4 h-4 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline ml-1">Back</span>
              </motion.button>
              
              {stage < stages.length - 1 ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStageChange(stage + 1)}
                  className="px-2 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-400 rounded-lg text-white text-xs sm:text-base font-medium flex items-center justify-center shadow-lg shadow-indigo-500/30"
                  aria-label="Next stage"
                >
                  <span className="hidden sm:inline mr-1">Next</span>
                  <ChevronRight className="w-4 h-4 sm:w-4 sm:h-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    onComplete?.();
                  }}
                  className="px-2 py-1.5 sm:px-6 sm:py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-400 rounded-lg text-white text-xs sm:text-base font-medium flex items-center justify-center shadow-lg shadow-indigo-500/30"
                  aria-label="Start learning"
                >
                  <span className="hidden sm:inline mr-1">Start Learning!</span>
                  <Trophy className="w-4 h-4 sm:w-4 sm:h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetsVennDiagramsIntro;
