'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Droplets, Wind, Leaf, Sparkles, Volume2, VolumeX, ChevronRight, ChevronLeft, Zap, ArrowRight, Factory } from 'lucide-react';

type PhotosynthesisIntroProps = {
  onComplete?: () => void;
};

type DialogueStep = {
  speaker: string;
  message: string;
  icon: React.ReactNode;
  animation?: string;
  highlight?: string;
};

const dialogueSteps: DialogueStep[] = [
  {
    speaker: 'Dr. Green',
    message: "Welcome to the most important chemistry lab on Earth - a leaf! I'm Dr. Green, and today we'll explore photosynthesis - the process that makes almost all life possible!",
    icon: <Leaf className="w-8 h-8 text-green-500" />,
    animation: 'pulse',
  },
  {
    speaker: 'Dr. Green',
    message: "Every breath you take, every meal you eat - it all starts here in this tiny green factory. Let me show you how plants turn sunlight into food!",
    icon: <Factory className="w-8 h-8 text-green-600" />,
    animation: 'bounce',
  },
  {
    speaker: 'Sunny ☀️',
    message: "I'm Sunny, the light energy! Without me, nothing happens. I travel 150 million kilometers from the sun to power this whole operation!",
    icon: <Sun className="w-8 h-8 text-yellow-500" />,
    animation: 'spin',
    highlight: 'yellow',
  },
  {
    speaker: 'Sunny ☀️',
    message: "When I hit a chlorophyll molecule, I excite its electrons to high energy levels. These energized electrons start the whole chain reaction!",
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
    animation: 'flash',
    highlight: 'yellow',
  },
  {
    speaker: 'Wally 💧',
    message: "Hi there! I'm Wally, a water molecule. The roots sucked me up from the soil and transported me all the way to this leaf!",
    icon: <Droplets className="w-8 h-8 text-blue-500" />,
    animation: 'bounce',
    highlight: 'blue',
  },
  {
    speaker: 'Wally 💧',
    message: "Here's my secret - I get SPLIT apart! My oxygen atoms become the O₂ you breathe. Every breath you take comes from water molecules like me!",
    icon: <Sparkles className="w-8 h-8 text-cyan-400" />,
    animation: 'split',
    highlight: 'blue',
  },
  {
    speaker: 'Carlo 💨',
    message: "I'm Carlo, the carbon dioxide! I float in through tiny holes called stomata. There's not much of me in air - only 0.04%!",
    icon: <Wind className="w-8 h-8 text-gray-500" />,
    animation: 'float',
    highlight: 'gray',
  },
  {
    speaker: 'Carlo 💨',
    message: "But the Calvin cycle grabs me and builds me into sugar! That's carbon fixation - turning gas into solid food. Pretty cool, right?",
    icon: <ArrowRight className="w-8 h-8 text-gray-600" />,
    animation: 'fix',
    highlight: 'gray',
  },
  {
    speaker: 'Dr. Green',
    message: "Let's put it all together! The equation is: 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂. Six carbon dioxides and six waters make one glucose and six oxygens!",
    icon: <Leaf className="w-8 h-8 text-green-600" />,
    animation: 'equation',
  },
  {
    speaker: 'Dr. Green',
    message: "This happens in TWO stages: Light reactions in the thylakoids split water and make energy carriers. Then the Calvin cycle in the stroma uses that energy to build sugar!",
    icon: <Factory className="w-8 h-8 text-green-500" />,
    animation: 'stages',
  },
  {
    speaker: 'Dr. Green',
    message: "Ready to dive deeper? We'll explore chloroplast structure, the amazing electron transport chain, and how farmers use this knowledge. Let's start the lesson!",
    icon: <Sparkles className="w-8 h-8 text-emerald-500" />,
    animation: 'celebrate',
  },
];

const PhotosynthesisIntro: React.FC<PhotosynthesisIntroProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentDialogue = dialogueSteps[currentStep];

  const stopSpeech = useCallback(() => {
    if (speechIntervalRef.current) {
      clearInterval(speechIntervalRef.current);
      speechIntervalRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  const speakText = useCallback((text: string) => {
    if (!hasUserInteracted) return;
    
    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) =>
        voice.name.includes('Google') ||
        voice.name.includes('Natural') ||
        voice.name.includes('Daniel') ||
        voice.name.includes('Samantha')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      if (speechIntervalRef.current) {
        clearInterval(speechIntervalRef.current);
        speechIntervalRef.current = null;
      }
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      if (speechIntervalRef.current) {
        clearInterval(speechIntervalRef.current);
        speechIntervalRef.current = null;
      }
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);

    // Chrome pause workaround
    speechIntervalRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  }, [stopSpeech, hasUserInteracted]);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);

    let index = 0;
    const message = currentDialogue.message;
    const typingInterval = setInterval(() => {
      if (index < message.length) {
        setDisplayedText(message.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 25);

    return () => clearInterval(typingInterval);
  }, [currentStep, currentDialogue.message]);

  useEffect(() => {
    if (!isTyping && displayedText === currentDialogue.message && hasUserInteracted) {
      speakText(currentDialogue.message);
    }
  }, [isTyping, displayedText, currentDialogue.message, speakText, hasUserInteracted]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const handleNext = () => {
    setHasUserInteracted(true);
    if (currentStep < dialogueSteps.length - 1) {
      stopSpeech();
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setHasUserInteracted(true);
    if (currentStep > 0) {
      stopSpeech();
      setCurrentStep((prev) => prev - 1);
    }
  };

  const toggleSpeech = () => {
    setHasUserInteracted(true);
    if (isPlaying) {
      stopSpeech();
    } else {
      speakText(currentDialogue.message);
    }
  };

  const getBackgroundColor = () => {
    switch (currentDialogue.highlight) {
      case 'yellow': return 'from-yellow-50 via-orange-50 to-yellow-100';
      case 'blue': return 'from-blue-50 via-cyan-50 to-blue-100';
      case 'gray': return 'from-gray-50 via-slate-50 to-gray-100';
      default: return 'from-green-50 via-emerald-50 to-green-100';
    }
  };

  return (
    <div className={`min-h-[500px] bg-gradient-to-br ${getBackgroundColor()} rounded-xl p-6 relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sun rays */}
        <motion.div
          className="absolute -top-10 right-10 w-40 h-40 bg-yellow-300 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Floating CO2 molecules */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`co2-${i}`}
            className="absolute w-6 h-6 bg-gray-400 rounded-full opacity-30"
            style={{ left: `${15 + i * 20}%`, top: '20%' }}
            animate={{
              y: [0, 30, 0],
              x: [0, 10, -10, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
        
        {/* Water droplets rising */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`water-${i}`}
            className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-40"
            style={{ left: `${10 + i * 15}%`, bottom: '-10px' }}
            animate={{
              y: [0, -300],
              opacity: [0.6, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 0.8 }}
          />
        ))}
        
        {/* Oxygen bubbles released */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`o2-${i}`}
            className="absolute w-4 h-4 bg-cyan-300 rounded-full opacity-30"
            style={{ left: `${20 + i * 20}%`, top: '60%' }}
            animate={{
              y: [0, -100],
              x: [0, 20, -20, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
          />
        ))}
        
        {/* Leaf/Chloroplast in center */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-green-400 opacity-10"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* Photosynthesis Visual Diagram */}
      <div className="absolute top-4 right-4 bg-white/80 rounded-lg p-3 shadow-md backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Sun className="w-4 h-4 text-yellow-500" />
            <span>+</span>
            <Droplets className="w-4 h-4 text-blue-500" />
            <span>+</span>
            <Wind className="w-4 h-4 text-gray-500" />
          </div>
          <ArrowRight className="w-4 h-4 text-green-600" />
          <div className="flex items-center gap-1">
            <span className="text-green-600 font-bold">🍬</span>
            <span>+</span>
            <span className="text-cyan-500 font-bold">O₂</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 relative z-10">
        <div className="flex justify-between text-sm text-green-700 mb-2">
          <span>Photosynthesis Introduction</span>
          <span>{currentStep + 1} / {dialogueSteps.length}</span>
        </div>
        <div className="w-full h-2 bg-green-200/60 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / dialogueSteps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Main Dialogue Box */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-green-200 relative z-10"
      >
        {/* Speaker Header */}
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md ${
              currentDialogue.highlight === 'yellow' ? 'bg-gradient-to-br from-yellow-400 to-orange-400' :
              currentDialogue.highlight === 'blue' ? 'bg-gradient-to-br from-blue-400 to-cyan-400' :
              currentDialogue.highlight === 'gray' ? 'bg-gradient-to-br from-gray-400 to-slate-400' :
              'bg-gradient-to-br from-green-400 to-emerald-500'
            }`}
            animate={
              currentDialogue.animation === 'spin' ? { rotate: [0, 360] } :
              currentDialogue.animation === 'bounce' ? { y: [0, -8, 0] } :
              currentDialogue.animation === 'pulse' ? { scale: [1, 1.1, 1] } :
              currentDialogue.animation === 'flash' ? { opacity: [1, 0.5, 1] } :
              currentDialogue.animation === 'float' ? { y: [0, -5, 0], x: [0, 5, 0] } :
              {}
            }
            transition={{ duration: 2, repeat: Infinity }}
          >
            {currentDialogue.icon}
          </motion.div>
          <div>
            <h3 className="font-bold text-lg text-green-800">{currentDialogue.speaker}</h3>
            <p className="text-sm text-green-600">
              {currentDialogue.speaker === 'Dr. Green' ? 'Botanist' :
               currentDialogue.speaker === 'Sunny ☀️' ? 'Light Energy' :
               currentDialogue.speaker === 'Wally 💧' ? 'Water Molecule' :
               currentDialogue.speaker === 'Carlo 💨' ? 'Carbon Dioxide' : 'Guide'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSpeech}
            className="ml-auto hover:bg-green-100"
          >
            {isPlaying ? (
              <Volume2 className="w-5 h-5 text-green-600 animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-green-400" />
            )}
          </Button>
        </div>

        {/* Message Content */}
        <div className="min-h-[100px] text-gray-700 text-lg leading-relaxed">
          {displayedText}
          {isTyping && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-2 h-5 bg-green-500 ml-1"
            />
          )}
        </div>

        {/* Equation Display */}
        {currentDialogue.animation === 'equation' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl"
          >
            <div className="flex items-center justify-center gap-2 text-lg font-mono flex-wrap">
              <span className="text-gray-600">6CO₂</span>
              <span>+</span>
              <span className="text-blue-600">6H₂O</span>
              <span>+</span>
              <Sun className="w-5 h-5 text-yellow-500" />
              <ArrowRight className="w-5 h-5 text-green-600" />
              <span className="text-green-600 font-bold">C₆H₁₂O₆</span>
              <span>+</span>
              <span className="text-cyan-600">6O₂</span>
            </div>
          </motion.div>
        )}

        {/* Two Stages Visual */}
        {currentDialogue.animation === 'stages' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 grid grid-cols-2 gap-4"
          >
            <div className="p-3 bg-yellow-100 rounded-lg">
              <p className="font-bold text-yellow-700 text-sm">Light Reactions</p>
              <p className="text-xs text-yellow-600">Thylakoids</p>
              <p className="text-xs text-gray-600 mt-1">H₂O → O₂ + ATP + NADPH</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <p className="font-bold text-green-700 text-sm">Calvin Cycle</p>
              <p className="text-xs text-green-600">Stroma</p>
              <p className="text-xs text-gray-600 mt-1">CO₂ → Glucose</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-6 relative z-10">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-100"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>

        <div className="flex gap-1">
          {dialogueSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-green-500 w-4'
                  : index < currentStep
                  ? 'bg-green-400'
                  : 'bg-green-200'
              }`}
            />
          ))}
        </div>

        {currentStep < dialogueSteps.length - 1 ? (
          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              stopSpeech();
              onComplete?.();
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            Start Lesson <Sparkles className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Fun Fact Bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md z-10"
      >
        <p className="text-xs text-green-600">
          🌿 Plants produce 50% of Earth&apos;s oxygen!
        </p>
      </motion.div>
    </div>
  );
};

export default PhotosynthesisIntro;
