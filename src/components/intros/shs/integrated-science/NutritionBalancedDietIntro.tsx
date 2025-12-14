'use client';

import { IntelligentLessonIntro } from '@/components/IntelligentLessonIntro';
import { Apple, Beef, Droplets, Pill, FlaskConical, Heart } from 'lucide-react';

interface NutritionBalancedDietIntroProps {
  onComplete?: () => void;
}

export default function NutritionBalancedDietIntro({ onComplete }: NutritionBalancedDietIntroProps) {
  const scenes = [
    {
      id: 1,
      icon: Apple,
      title: "Food is Life!",
      narration: "What did you eat this morning? Maybe some koko with bread, or waakye from your favorite seller? Every bite you take contains nutrients - special substances your body needs to grow, repair itself, and have energy for school and play. Today, we're going to discover the six classes of food and why each one matters!",
      visualContent: "🍚 Carbohydrates | 🥩 Proteins | 🥜 Fats | 🍊 Vitamins | 🧂 Minerals | 💧 Water",
      highlightWords: ['nutrients', 'grow', 'repair', 'energy', 'six classes'],
      teacherTip: "Ask students what they ate today and categorize the foods together."
    },
    {
      id: 2,
      icon: Beef,
      title: "Energy and Building Blocks",
      narration: "Carbohydrates from your fufu, banku, and rice give you energy to run, think, and play. Proteins from fish, beans, and eggs build your muscles and help wounds heal. Without protein, children develop kwashiorkor - that's why we see swollen bellies in malnourished children. Every meal should have both!",
      visualContent: "⚡ Carbs = Energy (fufu, rice, yam) | 💪 Proteins = Growth (fish, beans, eggs)",
      highlightWords: ['Carbohydrates', 'energy', 'Proteins', 'muscles', 'kwashiorkor'],
      teacherTip: "Show pictures of local protein sources and explain waakye combines both nutrients."
    },
    {
      id: 3,
      icon: Droplets,
      title: "Fats, Vitamins, and More",
      narration: "Palm oil gives your kontomire stew its beautiful red color - and that color means vitamin A for good eyesight! Fats store energy and keep you warm. Minerals like iron in kontomire prevent anemia, and iodine in salt prevents goitre. That's why Ghana uses iodized salt! And don't forget water - you need six to eight glasses daily!",
      visualContent: "🔴 Palm oil = Vitamin A | 🥬 Kontomire = Iron | 🧂 Iodized salt = Prevents goitre",
      highlightWords: ['Palm oil', 'vitamin A', 'iron', 'anemia', 'iodized salt', 'goitre', 'water'],
      teacherTip: "Explain why red palm oil is actually healthy - rich in vitamin A!"
    },
    {
      id: 4,
      icon: FlaskConical,
      title: "Testing for Nutrients",
      narration: "Scientists can test foods to find out what nutrients they contain! Add iodine to fufu - it turns blue-black because of starch. Heat egg white with Benedict's solution - nothing happens because eggs have protein, not sugar. The Biuret test turns purple for proteins. These tests help us analyze food!",
      visualContent: "🧪 Iodine + Starch = Blue-black | 🧪 Benedict's + Sugar = Brick red | 🧪 Biuret + Protein = Purple",
      highlightWords: ['iodine', 'blue-black', 'starch', 'Benedict', 'Biuret', 'purple', 'protein'],
      teacherTip: "If possible, demonstrate the starch test with iodine on different foods."
    },
    {
      id: 5,
      icon: Heart,
      title: "Your Balanced Diet Challenge",
      narration: "A balanced diet has all six nutrients in the right amounts. Think about it - jollof rice with chicken, salad, and an orange covers almost everything! Your challenge is to plan meals that include carbs, proteins, fats, vitamins, minerals, and water. Eat colorful foods, eat local foods, and your body will thank you!",
      visualContent: "🍽️ Balanced Meal = Carbs + Protein + Vegetables + Fruit + Water",
      highlightWords: ['balanced diet', 'six nutrients', 'colorful foods', 'local foods'],
      teacherTip: "Have students plan a balanced Ghanaian meal using the food plate model."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Nutrition and Balanced Diet"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
}
