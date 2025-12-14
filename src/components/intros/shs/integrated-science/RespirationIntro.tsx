'use client';

import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Wind, Zap, Flame, Activity, Wheat, HeartPulse } from 'lucide-react';

interface RespirationIntroProps {
  onComplete?: () => void;
}

export default function RespirationIntro({ onComplete }: RespirationIntroProps) {
  const scenes = [
    {
      id: 1,
      icon: Wind,
      title: "Respiration is NOT Breathing!",
      narration: "Wait - don't confuse respiration with breathing! Breathing is simply air moving in and out of your lungs. But respiration? That's the chemical magic happening in every single cell of your body right now! Trillions of cells are breaking down glucose to release energy. Without respiration, your heart couldn't beat, your brain couldn't think, and you couldn't even blink! It's life's most essential process!",
      visualContent: "👃 Breathing = Air in/out (physical) | 🔬 Respiration = Glucose → Energy (chemical in cells)",
      highlightWords: ['respiration', 'breathing', 'chemical', 'cells', 'glucose', 'energy', 'essential'],
      teacherTip: "This is the #1 misconception! Emphasize: respiration happens in CELLS, not lungs!"
    },
    {
      id: 2,
      icon: Zap,
      title: "Aerobic Respiration - The Energy Champion!",
      narration: "When you have plenty of oxygen, your cells perform aerobic respiration. It's the superstar of energy production! Glucose plus oxygen gives carbon dioxide, water, and a whopping thirty-eight ATP molecules of energy! That's why you breathe - to get oxygen for this process. Your fufu becomes fuel! The mitochondria, the powerhouses of your cells, are working non-stop performing this reaction!",
      visualContent: "🧪 Glucose + Oxygen → CO₂ + Water + 38 ATP ⚡⚡⚡",
      highlightWords: ['aerobic', 'oxygen', 'thirty-eight', 'ATP', 'mitochondria', 'powerhouses'],
      teacherTip: "Have students calculate: we use about 40 kg of ATP per day - we're energy machines!"
    },
    {
      id: 3,
      icon: Flame,
      title: "Anaerobic Respiration - Quick Energy!",
      narration: "What happens when you sprint to catch a trotro and can't breathe fast enough? Your muscles switch to anaerobic respiration - without oxygen! Glucose becomes lactic acid and only two ATP. That's why your muscles burn and feel tired - lactic acid is building up! After you stop, you breathe heavily to pay back your oxygen debt and break down that lactic acid. Athletes know this feeling well!",
      visualContent: "🏃 Glucose → Lactic Acid + 2 ATP ⚡ | 💪 Muscles burn! | 😮‍💨 Heavy breathing to recover",
      highlightWords: ['anaerobic', 'without oxygen', 'lactic acid', 'burn', 'tired', 'oxygen debt'],
      teacherTip: "Have students run in place for 30 seconds - they'll feel the lactic acid effect!"
    },
    {
      id: 4,
      icon: Wheat,
      title: "Fermentation - Ghana's Favorite Chemistry!",
      narration: "Here's something amazing - fermentation is anaerobic respiration in yeast and plants! When yeast respires without oxygen, it produces ethanol and carbon dioxide. This is how we make kenkey, banku, gari, and palm wine! The CO two makes bread rise! Fermentation also removes toxins from cassava to make safe gari. Your favorite foods use the same biology you're learning! Science is delicious!",
      visualContent: "🍞 Yeast: Glucose → Ethanol + CO₂ + 2 ATP | 🇬🇭 Kenkey, Banku, Gari, Palm Wine, Pito!",
      highlightWords: ['fermentation', 'yeast', 'ethanol', 'carbon dioxide', 'kenkey', 'banku', 'gari', 'palm wine'],
      teacherTip: "Bring fermented dough to class - students can smell and see fermentation in action!"
    },
    {
      id: 5,
      icon: Activity,
      title: "Aerobic vs Anaerobic - The Big Comparison",
      narration: "Let's compare: Aerobic uses oxygen, happens in mitochondria, and releases thirty-eight ATP per glucose - very efficient! Anaerobic doesn't need oxygen, happens in cytoplasm, and releases only two ATP - much less energy! Marathon runners mainly use aerobic - steady pace with oxygen. Sprinters use anaerobic - explosive but short! Football players like our Black Stars use both - walking is aerobic, sprinting is anaerobic!",
      visualContent: "📊 Aerobic: O₂ needed, 38 ATP, mitochondria | Anaerobic: No O₂, 2 ATP, cytoplasm",
      highlightWords: ['thirty-eight ATP', 'two ATP', 'mitochondria', 'cytoplasm', 'marathon', 'sprinter', 'Black Stars'],
      teacherTip: "Draw a Venn diagram comparing both types - students often remember visual comparisons!"
    },
    {
      id: 6,
      icon: HeartPulse,
      title: "Exercise and Your Amazing Body!",
      narration: "When you exercise, your body is a coordination masterpiece! Muscles need more energy, so your breathing rate increases to bring more oxygen. Your heart beats faster to deliver oxygen to cells. You sweat to cool down because respiration releases heat. If oxygen can't keep up, anaerobic kicks in. Fit people can exercise longer before needing anaerobic respiration - that's why fitness matters! Stay active, stay healthy!",
      visualContent: "🏃 Exercise → 📈 Heart rate ↑ | 💨 Breathing ↑ | 💦 Sweating | ⚡ More ATP needed!",
      highlightWords: ['breathing rate', 'heart beats faster', 'sweat', 'cool down', 'heat', 'fitness'],
      teacherTip: "Measure resting heart rate, then after exercise - students see biology in action!"
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Respiration: Aerobic and Anaerobic"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
}
