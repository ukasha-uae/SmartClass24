'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Microscope, Dna, Zap, Shield, Users } from 'lucide-react';

const CellStructureFunctionIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Microscope,
      narration: "Welcome to the fascinating microscopic world of cells! Today you'll discover that all living things - from tiny bacteria to massive elephants, from cassava plants to humans - are made of cells. The cell is the smallest unit of life, the building block of everything that lives and breathes around us.",
      visualContent: "Welcome to Cell Biology",
      highlightWords: ['cells', 'building block', 'smallest unit', 'living things'],
      teacherTip: "Start by asking: What's the smallest part of your body that's still alive? The answer is: a cell!"
    },
    {
      id: 1,
      icon: Dna,
      narration: "Cells come in two main types: plant cells and animal cells. Plant cells have special structures like cell walls for support, chloroplasts for making food from sunlight, and large vacuoles for storage. Animal cells lack these but have other specialized features. Both types share common parts like the nucleus, mitochondria, and cell membrane.",
      visualContent: "Types of Cells",
      highlightWords: ['plant cells', 'animal cells', 'cell walls', 'chloroplasts', 'nucleus'],
      teacherTip: "Use local examples: cassava cells (plant), human blood cells (animal). What makes them different?"
    },
    {
      id: 2,
      icon: Zap,
      narration: "Each cell part, called an organelle, has a specific job. The nucleus is the control center containing DNA. Mitochondria are power plants producing energy. Ribosomes make proteins. The cell membrane acts as a security gate, controlling what enters and exits. Together, these organelles work like a miniature city!",
      visualContent: "Cell Organelles and Functions",
      highlightWords: ['organelles', 'nucleus', 'mitochondria', 'ribosomes', 'cell membrane'],
      teacherTip: "Compare cell to a school: Principal (nucleus), cafeteria (mitochondria), library (ribosome), gate (membrane)!"
    },
    {
      id: 3,
      icon: Shield,
      narration: "The cell membrane is like a selective barrier - it lets useful substances like oxygen and nutrients in, while keeping harmful substances out and waste products exit. This process happens through diffusion, osmosis, and active transport. Without this control, cells would die!",
      visualContent: "Cell Membrane Transport",
      highlightWords: ['cell membrane', 'selective barrier', 'diffusion', 'osmosis', 'active transport'],
      teacherTip: "Demo: Tea bag in water (diffusion). Water entering cells when you drink (osmosis)."
    },
    {
      id: 4,
      icon: Users,
      narration: "Cells can be specialized for specific jobs. Red blood cells have no nucleus but lots of hemoglobin to carry oxygen. Nerve cells have long extensions to transmit signals. Muscle cells are packed with proteins for contraction. This lesson will show you how structure matches function in Ghana's agricultural crops, human health, and biotechnology applications.",
      visualContent: "Specialized Cells",
      highlightWords: ['specialized cells', 'red blood cells', 'nerve cells', 'structure and function'],
      teacherTip: "Career connection: Medical lab scientists in Ghana study cells to diagnose diseases!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Cell Structure and Function"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default CellStructureFunctionIntro;
