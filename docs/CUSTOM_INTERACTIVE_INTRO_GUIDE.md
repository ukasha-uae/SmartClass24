# Custom Interactive Intro Guide

**Created**: December 16, 2025  
**Reference Implementation**: `ElectricityMagnetismConceptsIntro.tsx`  
**Pattern Type**: Intelligent Teacher with Interactive Demonstrations

---

## 📋 Overview

This guide documents the **Custom Interactive Intro** pattern, which combines:
1. **Intelligent Teacher Narration** - Voice synthesis with word highlighting
2. **Stage-Based Progression** - Multi-step intro with navigation
3. **Interactive Demonstrations** - Hands-on visual elements
4. **Mobile-First Responsive Design** - Works on all devices

This pattern is ideal for **complex science topics** that benefit from visual demonstrations alongside voice explanation.

---

## 🎯 When to Use This Pattern

### ✅ Use Custom Interactive Intro For:
- Physics topics (electricity, forces, waves, motion)
- Topics requiring simulations (circuits, equations)
- Lessons with mathematical relationships (Ohm's Law, F=ma)
- Concepts that need visual manipulation to understand
- Topics where students benefit from "playing" with variables

### ❌ Use Standard IntelligentLessonIntro For:
- Biology topics (description-focused)
- History/social topics
- Straightforward concept explanations
- Lessons without interactive elements needed

---

## 🏗️ Component Structure

```tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  // Topic-specific icons
  Zap, Battery, Lightbulb,
  // Standard controls
  Play, Pause, Volume2, VolumeX, 
  GraduationCap, ArrowRight, AlertTriangle 
} from 'lucide-react';

interface LessonIntroProps {
  onComplete?: () => void;
}

const MyTopicIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  // ============ INTERACTIVE STATE ============
  const [stage, setStage] = useState(0);
  // Add topic-specific interactive states here
  const [demoValue, setDemoValue] = useState(0);
  
  // ============ TEACHER NARRATION STATE ============
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());

  // ============ STAGES DEFINITION ============
  const stages = [
    {
      title: "⚡ Stage 1 Title",
      content: "Brief description shown below title",
      narration: "Full teacher narration text. Should be conversational, engaging, and reference Ghana context. Aim for 4-6 sentences per stage.",
      highlightWords: ['key', 'terms', 'to', 'highlight']
    },
    // ... more stages (typically 3-5 total)
  ];

  // ============ SPEECH SYNTHESIS LOGIC ============
  // (Copy from reference implementation)
  
  // ============ RENDER ============
  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br ...">
      {/* Background Animation */}
      {/* Header */}
      {/* Teacher Avatar & Narration Controls */}
      {/* Stage Content with Interactive Demos */}
      {/* Key Info Cards */}
      {/* Sticky Navigation */}
    </div>
  );
};

export default MyTopicIntro;
```

---

## 📱 Mobile Responsiveness Rules

### Container & Padding
```tsx
// Main container
className="p-4 sm:p-6 md:p-8"

// Inner sections
className="p-3 sm:p-4 mb-4 sm:mb-6"
```

### Typography Scaling
```tsx
// Headers
className="text-xl sm:text-2xl md:text-3xl"

// Subheaders
className="text-lg sm:text-2xl"

// Body text
className="text-sm sm:text-lg"

// Small text
className="text-xs sm:text-sm"

// Tiny labels
className="text-[10px] sm:text-xs"
```

### Icon Scaling
```tsx
// Large icons (header)
className="w-6 h-6 sm:w-10 sm:h-10"

// Medium icons (sections)
className="w-6 h-6 sm:w-8 sm:h-8"

// Small icons (buttons)
className="w-4 h-4 sm:w-5 sm:h-5"

// Tiny icons (navigation)
className="w-3 h-3 sm:w-4 sm:h-4"
```

### Button Sizing
```tsx
// Primary buttons
className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base"

// Icon buttons
className="p-1.5 sm:p-2"
```

### Grid Layouts
```tsx
// Two-column that stacks on mobile
className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"

// Three-column (always 3, just smaller)
className="grid grid-cols-3 gap-2 sm:gap-3"
```

---

## 🎤 Teacher Narration System

### Speech Synthesis Setup
```tsx
const speakNarration = useCallback(() => {
  if (typeof window === 'undefined' || !window.speechSynthesis || isMuted) return;
  
  window.speechSynthesis.cancel();
  
  const narration = stages[stage].narration;
  const utterance = new SpeechSynthesisUtterance(narration);
  
  // Voice configuration
  utterance.rate = 0.9;  // Slightly slower for clarity
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  // Find English voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => 
    v.lang.startsWith('en') && 
    (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google'))
  ) || voices.find(v => v.lang.startsWith('en'));
  if (preferredVoice) utterance.voice = preferredVoice;
  
  // Word tracking for highlighting
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
```

### Auto-Play on Stage Change
```tsx
useEffect(() => {
  if (!hasSpokenRef.current.has(stage) && !isMuted) {
    const timer = setTimeout(() => {
      speakNarration();
      hasSpokenRef.current.add(stage);
    }, 500);
    return () => clearTimeout(timer);
  }
}, [stage, speakNarration, isMuted]);
```

### Cleanup on Unmount
```tsx
useEffect(() => {
  return () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };
}, []);
```

---

## 🎨 Teacher Avatar Component

```tsx
{/* Teacher Avatar & Narration Controls */}
<motion.div 
  className="bg-gradient-to-r from-yellow-900/40 to-blue-900/40 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-yellow-700/50"
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
>
  <div className="flex items-start gap-2 sm:gap-4">
    {/* Avatar */}
    <div className="flex-shrink-0">
      <motion.div 
        className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center ${
          isSpeaking && !isPaused ? 'ring-2 sm:ring-4 ring-yellow-400/50' : ''
        }`}
        animate={isSpeaking && !isPaused ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
      </motion.div>
      <p className="text-center text-[10px] sm:text-xs text-yellow-300 mt-1 hidden sm:block">Teacher</p>
    </div>

    {/* Narration Text with Highlighting */}
    <div className="flex-1 min-w-0">
      <div className="text-xs sm:text-sm leading-relaxed max-h-16 sm:max-h-24 overflow-y-auto">
        {renderNarrationText()}
      </div>
    </div>

    {/* Audio Controls */}
    <div className="flex flex-col gap-1 sm:gap-2">
      {/* Play/Pause and Mute buttons */}
    </div>
  </div>
</motion.div>
```

---

## 🔧 Interactive Demo Examples

### 1. Charge Demo (Click to Change)
```tsx
{stage === 1 && (
  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
    <button onClick={() => setState('negative')} className="...">
      − Add Electrons
    </button>
    <motion.div 
      className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full ...`}
      animate={{ scale: state !== 'neutral' ? [1, 1.1, 1] : 1 }}
    >
      {state === 'neutral' ? '⚪' : state === 'positive' ? '+' : '−'}
    </motion.div>
    <button onClick={() => setState('positive')} className="...">
      + Remove Electrons
    </button>
  </div>
)}
```

### 2. Slider Demo (Ohm's Law)
```tsx
{stage === 3 && (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label>Voltage (V): {voltage}V</label>
      <input
        type="range"
        min="0" max="12" step="1"
        value={voltage}
        onChange={(e) => setVoltage(Number(e.target.value))}
        className="w-full accent-yellow-500"
      />
    </div>
    <div>
      <label>Resistance (Ω): {resistance}Ω</label>
      <input
        type="range"
        min="1" max="20" step="1"
        value={resistance}
        onChange={(e) => setResistance(Number(e.target.value))}
        className="w-full accent-orange-500"
      />
    </div>
  </div>
)}
```

### 3. Animated Circuit
```tsx
<svg className="absolute inset-0" viewBox="0 0 400 128">
  {/* Wire path */}
  <path d="M 60 64 H 150 L 160 54 L 180 74..." stroke="#4B5563" strokeWidth="4" fill="none" />
  
  {/* Flowing electrons when voltage > 0 */}
  {voltage > 0 && electronPositions.map((pos, i) => (
    <motion.circle key={i} r="4" fill="#3B82F6">
      <animateMotion dur={`${3 / (current + 0.1)}s`} repeatCount="indefinite">
        <mpath href="#electronPath" />
      </animateMotion>
    </motion.circle>
  ))}
</svg>
```

---

## 📍 Fixed Navigation (Critical for Mobile)

```tsx
{/* Fixed Navigation - Mobile Friendly */}
<div className="fixed bottom-0 left-0 right-0 bg-gray-900/98 backdrop-blur-md px-4 sm:px-6 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:py-4 border-t border-gray-700/50 z-50 shadow-lg">
  <div className="max-w-4xl mx-auto flex justify-between items-center">
    {/* Stage indicators */}
    <div className="flex gap-1.5 sm:gap-2">
      {stages.map((_, i) => (
        <button
          key={i}
          onClick={() => handleStageChange(i)}
          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
            i === stage ? 'bg-yellow-400' : 'bg-gray-600'
          }`}
        />
      ))}
    </div>
    
    {/* Navigation buttons - ALWAYS render both for stable layout */}
    <div className="flex gap-2 sm:gap-3">
      {/* Back button - always present, disabled on first stage */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => handleStageChange(stage - 1)}
        disabled={stage === 0}
        className={`p-2 sm:px-4 sm:py-2 rounded-lg font-medium text-sm sm:text-base transition-all ${
          stage === 0 
            ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50' 
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
      >
        <ChevronLeft className="w-5 h-5 sm:hidden" />
        <span className="hidden sm:inline">Back</span>
      </motion.button>
      
      {stage < stages.length - 1 ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleStageChange(stage + 1)}
          className="p-2 sm:px-4 sm:py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white font-medium flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      ) : (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { window.speechSynthesis?.cancel(); onComplete?.(); }}
          className="p-2 sm:px-6 sm:py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
        >
          <span className="hidden sm:inline">Start!</span>
          <Play className="w-5 h-5 sm:w-4 sm:h-4" />
        </motion.button>
      )}
    </div>
  </div>
</div>
```

### Mobile Navigation Key Points

| Rule | Implementation |
|------|----------------|
| **Fixed positioning** | Use `fixed` not `sticky` for reliable mobile behavior |
| **Safe area inset** | `pb-[calc(0.75rem+env(safe-area-inset-bottom))]` for iPhone home bar |
| **Always render Back** | Disabled on first stage to prevent layout shift |
| **Icon-only on mobile** | `<ChevronLeft className="sm:hidden" />` + `<span className="hidden sm:inline">` |
| **Play icon for Start** | Universal "begin" symbol, not topic-specific icons |
| **Container padding** | Add `pb-24 sm:pb-28` to main container for nav space |

### Required Imports for Navigation
```tsx
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
```

---

## ✅ Implementation Checklist

- [ ] Create component in `src/components/lesson-intros/{subject}/{level}/`
- [ ] Define 3-5 stages with title, content, narration, highlightWords
- [ ] Implement topic-specific interactive demos
- [ ] Add speech synthesis with word highlighting
- [ ] Include Ghana safety notice (if applicable)
- [ ] Add key formula/concept cards at bottom
- [ ] **Use fixed navigation at bottom** (not sticky)
- [ ] **Add `pb-24 sm:pb-28` to main container**
- [ ] **Include ChevronLeft, ChevronRight, Play imports**
- [ ] Test on mobile (320px width minimum)
- [ ] Import and wire up in `page.tsx`
- [ ] Add lesson slug to `featureFlags.ts` CAROUSEL_MODE.lessons

---

## � Completed Custom Interactive Intros

### SHS2 Integrated Science (7 Complete)

| Lesson | Component | Features |
|--------|-----------|----------|
| Electricity & Magnetism | `ElectricityMagnetismConceptsIntro.tsx` | Circuit builder, Ohm's Law calculator, electromagnet simulation |
| Life Cycles: Plants & Animals | `LifeCyclesPlantsAnimalsIntro.tsx` | Lifecycle selectors, metamorphosis stages, Ghana crops |
| Life Cycles: Human Development | `LifeCyclesHumanDevelopmentIntro.tsx` | Puberty timeline, development stages, health facts |
| Nutrient Cycles: Nitrogen & Carbon | `NutrientCyclesNitrogenCarbonIntro.tsx` | Cycle animations, process selectors, Ghana agriculture |
| Water Cycle | `WaterCycleIntro.tsx` | Sun intensity slider, evaporation demo, Lake Volta facts |
| Reproduction: Asexual & Sexual | `ReproductionAsexualSexualIntro.tsx` | Binary fission animation, budding demo, crop propagation |
| Reproduction: Fertilization | `ReproductionFertilizationDevelopmentIntro.tsx` | Fertilization animation, development timeline, placenta functions |

**Location:** `src/components/lesson-intros/integrated-science/shs2/`

---

## �📁 File Naming Convention

```
src/components/lesson-intros/
├── integrated-science/
│   ├── shs1/
│   │   └── {TopicName}Intro.tsx
│   └── shs2/
│       ├── ElectricityMagnetismConceptsIntro.tsx  ← Reference
│       └── {NextTopic}Intro.tsx
├── chemistry/
└── physics/
```

---

## 🔗 Related Documentation

- [CAROUSEL_LESSONS_GUIDE.md](./CAROUSEL_LESSONS_GUIDE.md) - Standard IntelligentLessonIntro
- [CAROUSEL_MIGRATION_TRACKER.md](./CAROUSEL_MIGRATION_TRACKER.md) - Migration progress
- [TTS_IMPLEMENTATION_STANDARD.md](./TTS_IMPLEMENTATION_STANDARD.md) - Voice synthesis details
