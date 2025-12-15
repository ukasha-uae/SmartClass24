'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Baby, User, GraduationCap, Heart, Users } from 'lucide-react';

const LifeCyclesHumanDevelopmentIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Heart,
      narration: "You are on an INCREDIBLE JOURNEY! From a single fertilized cell to the person you are today, you've undergone amazing transformations. Human development doesn't stop - you're still changing and growing! Today, you'll explore the fascinating stages of human life from conception through old age, understanding the physical, mental, and emotional changes that make us who we are. This knowledge helps you appreciate each life stage and make informed decisions about health and relationships!",
      visualContent: "The Human Journey: From Conception to Old Age",
      highlightWords: ['human development', 'transformations', 'life stages', 'health decisions'],
      teacherTip: "Create a safe, respectful environment for discussing human development. Emphasize that everyone develops at their own pace and that's perfectly normal."
    },
    {
      id: 1,
      icon: Baby,
      narration: "Life begins with a MIRACLE! When a sperm meets an egg, a single cell called a ZYGOTE forms. Over nine months, this cell divides billions of times, transforming into a fully formed baby! The first eight weeks are CRITICAL - all major organs begin forming. In Ghana, ANTENATAL CARE is essential during pregnancy to ensure both mother and baby stay healthy. Proper nutrition, avoiding harmful substances like alcohol, preventing malaria, and regular checkups at the clinic make all the difference in having a healthy baby!",
      visualContent: "Prenatal Development: The First Nine Months",
      highlightWords: ['zygote', 'nine months', 'organs forming', 'antenatal care', 'nutrition'],
      teacherTip: "Discuss the importance of maternal health without stigmatizing teen pregnancy. Emphasize prevention through education and the importance of prenatal care when pregnancy occurs."
    },
    {
      id: 2,
      icon: GraduationCap,
      narration: "ADOLESCENCE is YOUR time right now! Between ages twelve and eighteen, your body undergoes PUBERTY - rapid growth, sexual maturation, and intense brain development. Girls develop breasts and begin menstruation. Boys' voices deepen and facial hair grows. These changes are driven by HORMONES like testosterone and estrogen. But it's not just physical! Your brain is rewiring, you're forming your IDENTITY, figuring out who you are and who you want to become. Peer relationships become super important. This is normal, challenging, and exciting all at once!",
      visualContent: "Adolescence: The Bridge from Childhood to Adulthood",
      highlightWords: ['adolescence', 'puberty', 'hormones', 'identity', 'brain development'],
      teacherTip: "Normalize the challenges of adolescence. Discuss healthy ways to handle peer pressure, body image concerns, and emotional changes. Emphasize that seeking help is a sign of strength."
    },
    {
      id: 3,
      icon: User,
      narration: "PIAGET, a famous psychologist, discovered that our THINKING ABILITY develops in stages too! Young children think very concretely and literally - they can't easily imagine hypothetical situations. But during adolescence, you develop FORMAL OPERATIONAL THINKING - the ability to think abstractly, reason about possibilities, and plan for the future. This is why you can now debate ideas, understand complex math, and make thoughtful decisions about your education and career. Your brain is becoming an incredibly powerful tool!",
      visualContent: "Cognitive Development: How Thinking Changes with Age",
      highlightWords: ['Piaget', 'thinking ability', 'formal operational', 'abstract thinking', 'plan for future'],
      teacherTip: "Use Piaget's conservation tasks to demonstrate concrete vs. formal operational thinking. Help students appreciate their growing cognitive abilities while being patient with younger siblings who think differently."
    },
    {
      id: 4,
      icon: Users,
      narration: "Understanding human development is PRACTICAL KNOWLEDGE! It helps PARENTS know what to expect and provide age-appropriate support. It helps TEACHERS match lessons to students' developmental levels. It helps HEALTHCARE WORKERS identify when development is delayed and intervene early. For YOU personally, understanding adolescent development helps you navigate this challenging time with confidence, make healthy choices about relationships and sexuality, manage stress, and prepare for the responsibilities of adulthood. In Ghana, this knowledge supports strong families, effective education, and a healthy society!",
      visualContent: "Why Human Development Matters: From Personal Growth to National Health",
      highlightWords: ['parents', 'teachers', 'healthcare', 'healthy choices', 'strong families'],
      teacherTip: "Connect to BECE topics and Ghana's health initiatives. Discuss how understanding development helps students support younger siblings, make informed decisions, and prepare for parenthood in the future."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Life Cycles: Human Development"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default LifeCyclesHumanDevelopmentIntro;
