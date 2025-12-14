'use client';

import React from 'react';
import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { ClipboardList, BarChart3, PieChart, Table, Trophy } from 'lucide-react';

const DataCollectionPresentationIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: ClipboardList,
      narration: "Data collection is gathering information! Primary data is collected directly by you - surveys, experiments, observations. Secondary data comes from existing sources - books, websites, records. Both have advantages and disadvantages!",
      visualContent: "Primary: you collect it | Secondary: already exists | Choose wisely!",
      highlightWords: ['Data collection', 'Primary data', 'Secondary data', 'surveys', 'observations'],
      teacherTip: "Discuss examples: census (primary), using census results (secondary)."
    },
    {
      id: 1,
      icon: Table,
      narration: "Organize data in frequency tables! The frequency is how many times a value appears. For grouped data, use class intervals: 0-9, 10-19, 20-29. Find the class width, lower and upper boundaries. Tally marks help count!",
      visualContent: "Frequency = count | Class intervals: 0-9, 10-19... | Tally marks",
      highlightWords: ['frequency tables', 'frequency', 'class intervals', 'boundaries', 'Tally marks'],
      teacherTip: "Practice creating frequency tables from raw data sets."
    },
    {
      id: 2,
      icon: BarChart3,
      narration: "Bar charts show data with rectangular bars! Height or length represents frequency. Leave gaps between bars for discrete data. Histograms are for continuous data with no gaps. Always label axes and give a title!",
      visualContent: "Bar chart: gaps for discrete | Histogram: no gaps, continuous | Label everything",
      highlightWords: ['Bar charts', 'bars', 'frequency', 'Histograms', 'continuous', 'label'],
      teacherTip: "Compare bar charts and histograms side by side to show the difference."
    },
    {
      id: 3,
      icon: PieChart,
      narration: "Pie charts show parts of a whole! Each sector's angle equals its fraction times 360 degrees. 25 percent of 360 equals 90 degrees. Use a protractor to draw accurate sectors. All sectors must add up to 360 degrees!",
      visualContent: "Sector angle = (fraction) × 360° | Total = 360° | Use protractor",
      highlightWords: ['Pie charts', 'sector', 'angle', '360 degrees', 'protractor'],
      teacherTip: "Calculate all angles first, then verify they sum to 360° before drawing."
    },
    {
      id: 4,
      icon: Trophy,
      narration: "WASSCE tests drawing and interpreting all chart types! Read questions carefully - sometimes they give angles, sometimes percentages. Show your calculations. Draw charts accurately with proper labels. Practice both drawing and reading charts!",
      visualContent: "WASSCE: Draw and interpret | Show calculations | Label properly",
      highlightWords: ['WASSCE', 'drawing', 'interpreting', 'calculations', 'labels'],
      teacherTip: "Practice both creating charts from data AND extracting data from given charts."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Data Collection & Presentation"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default DataCollectionPresentationIntro;
