'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';

interface ScientificMethodsSafetyIntroProps {
  onComplete?: () => void;
}

export default function ScientificMethodsSafetyIntro({ onComplete }: ScientificMethodsSafetyIntroProps) {
  const scenes = [
    {
      id: 1,
      icon: "🔬",
      title: "Welcome to Scientific Investigation!",
      narration: "Welcome, young scientist! Have you ever wondered how scientists discover new things? How do they test medicines, create new materials, or understand how nature works? Today, you'll learn the secret method that all scientists use - the scientific method! Plus, we'll learn crucial safety rules to protect you in the laboratory.",
      visualContent: "🔬",
      highlightWords: ["scientific method", "safety rules", "laboratory"],
      teacherTip: "Science is not magic - it's a systematic way of asking and answering questions!"
    },
    {
      id: 2,
      icon: "❓",
      title: "Asking Questions Like a Scientist",
      narration: "Every scientific discovery starts with curiosity and a good question. In Ghana, scientists asked: Why does our cocoa get diseases? How can we purify water from rivers? Can we make solar panels work better in our climate? The scientific method helps us find answers through careful observation, testing, and analysis. It's a step-by-step process that anyone can use!",
      visualContent: "❓→🔍→🧪→📊→✅",
      highlightWords: ["observation", "testing", "analysis", "step-by-step"],
      teacherTip: "Great questions lead to great discoveries. Always ask 'why' and 'how'!"
    },
    {
      id: 3,
      icon: "⚠️",
      title: "Laboratory Safety - Your Life Depends On It!",
      narration: "Imagine this: A student in Kumasi mixed two chemicals without reading the labels. The reaction caused an explosion, injuring three students. This real incident could have been prevented! Laboratory safety isn't just rules to memorize - these rules save lives. In Ghana's hospitals, industries, and research centers, scientists follow strict safety protocols every single day.",
      visualContent: "⚠️🥽🧤🔥💧⚡",
      highlightWords: ["safety", "explosion", "protocols", "lives"],
      teacherTip: "Safety first, always! One careless moment can cause permanent harm."
    },
    {
      id: 4,
      icon: "🧪",
      title: "Essential Lab Equipment",
      narration: "From simple test tubes to complex Bunsen burners, each piece of laboratory equipment has a specific purpose. Knowing what each tool does and how to use it properly is crucial. You wouldn't use a spoon to cut vegetables, right? Similarly, using the wrong lab equipment or using it incorrectly can ruin experiments or cause accidents.",
      visualContent: "🧪🔬📏⚖️🌡️",
      highlightWords: ["test tubes", "Bunsen burners", "specific purpose", "properly"],
      teacherTip: "Every tool has its job. Learn them well, and your experiments will succeed!"
    },
    {
      id: 5,
      icon: "🎓",
      title: "Your Journey as a Young Scientist",
      narration: "Today marks the beginning of your scientific journey! You'll learn to think like a scientist, conduct experiments safely, and discover amazing things. Remember: Every famous scientist started exactly where you are now - curious and ready to learn. With the scientific method as your guide and safety as your priority, there's no limit to what you can achieve. Let's get started!",
      visualContent: "🎓🔬🇬🇭🌟",
      highlightWords: ["scientific journey", "experiments", "curious", "achieve"],
      teacherTip: "You have the potential to make discoveries that change Ghana and the world!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Scientific Methods & Safety"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
}
