'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Ruler, Globe, Hash, Maximize2, Scale, Trophy } from 'lucide-react';

const UnitsInstrumentsIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Ruler,
      narration: "How tall are you? How heavy is that bag of rice? How hot is the sun? To answer these questions, we need MEASUREMENTS! Today, you'll discover the language of science - SI units - and the amazing instruments we use to measure everything around us!",
      visualContent: "Measuring Our World!",
      highlightWords: ['measurements', 'SI units', 'instruments', 'science'],
      teacherTip: "Start by asking students to estimate the length of their desk - this shows why standardized units matter!"
    },
    {
      id: 1,
      icon: Globe,
      narration: "Scientists worldwide use the International System of Units, or SI. Seven base units form the foundation: the meter for length, kilogram for mass, second for time, ampere for electric current, kelvin for temperature, mole for amount of substance, and candela for light intensity!",
      visualContent: "The SI System: Universal Language",
      highlightWords: ['International System', 'SI', 'meter', 'kilogram', 'second', 'seven base units'],
      teacherTip: "In Ghana, we use metric system daily - kilometers on road signs, grams at the market, liters at petrol stations!"
    },
    {
      id: 2,
      icon: Hash,
      narration: "How do we write very large or very small numbers? We use prefixes! Kilo means thousand, so one kilometer equals one thousand meters. Milli means one-thousandth, so one millimeter is one-thousandth of a meter. Centi means one-hundredth - that's why a centimeter is one-hundredth of a meter!",
      visualContent: "Prefixes: Making Numbers Manageable",
      highlightWords: ['prefixes', 'kilo', 'milli', 'centi', 'thousand', 'one-thousandth'],
      teacherTip: "Connect to mobile data: students know 1GB = 1000MB - that's the kilo prefix in action!"
    },
    {
      id: 3,
      icon: Maximize2,
      narration: "To measure length, we use different tools for different scales. A ruler measures small objects in centimeters. A measuring tape extends for longer distances. A meter rule is perfect for one-meter measurements. Vernier calipers measure with high precision to zero point zero one centimeters!",
      visualContent: "Measuring Length",
      highlightWords: ['ruler', 'measuring tape', 'meter rule', 'vernier calipers', 'precision'],
      teacherTip: "Bring actual instruments to class - let students handle vernier calipers and feel the precision!"
    },
    {
      id: 4,
      icon: Scale,
      narration: "We measure mass using balances - beam balances for comparison, electronic balances for precision. Volume is measured with measuring cylinders, beakers, or pipettes. For time, we use stopwatches that measure to hundredths of a second. Each measurement needs the right instrument!",
      visualContent: "Measuring Mass, Volume & Time",
      highlightWords: ['balances', 'measuring cylinders', 'stopwatches', 'precision', 'right instrument'],
      teacherTip: "Visit the school laboratory and identify all measuring instruments - practical experience is key!"
    },
    {
      id: 5,
      icon: Trophy,
      narration: "You're now equipped to explore the world of measurement! You'll master SI units and their prefixes, learn to choose the right instrument for each measurement, understand how to read scales accurately, and convert between different units. Precise measurement is the foundation of science. Let's begin!",
      visualContent: "Ready to Measure!",
      highlightWords: ['master SI units', 'right instrument', 'read scales', 'convert', 'foundation of science'],
      teacherTip: "WASSCE practical exams always test measurement skills - accuracy and correct unit recording are essential!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Units and Instruments"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default UnitsInstrumentsIntro;
