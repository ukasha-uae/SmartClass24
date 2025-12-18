
'use client';

import { getSubjectBySlug } from '@/lib/jhs-data';
import { getPrimarySubjectBySlug } from '@/lib/primary-data';
import { getSHSSubjectBySlug } from '@/lib/shs-data';
import { useLocalizedLesson } from '@/hooks/useLocalizedLesson';
import { notFound, useParams } from 'next/navigation';
import { isCarouselEnabled } from '@/lib/featureFlags';
import { validateLessonForCarousel } from '@/lib/lessonValidator';
import { trackCarouselUsage, trackCarouselError, trackFeatureFlagStatus } from '@/lib/analytics';

type EducationLevel = 'Primary' | 'JHS' | 'SHS';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Target, Lightbulb, ListChecks, FileText, BookOpen, Brain, Award, Bookmark, BookmarkCheck, Download, DownloadCloud, StickyNote, CheckSquare, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import ReadAloud from '@/components/ReadAloud';
import LessonCompleteQuiz from '@/components/LessonCompleteQuiz';
import LessonVisual, { ConceptCard, TipCard, ExampleCard, SuccessCard } from '@/components/LessonVisual';
import { IconGrid, FloatingIcon } from '@/components/AnimatedIcons';
import { useFirebase } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useLocalization } from '@/hooks/useLocalization';
import type { Lesson } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState, useMemo } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { QuadraticEquationsIntro } from '@/components/QuadraticEquationsIntro';
import FactorizationIntro from '@/components/intros/FactorizationIntro';
import CompletingSquareIntro from '@/components/intros/CompletingSquareIntro';
import QuadraticFormulaIntro from '@/components/intros/QuadraticFormulaIntro';
import SequencesSeriesIntro from '@/components/intros/SequencesSeriesIntro';
import FunctionsRelationsIntro from '@/components/intros/FunctionsRelationsIntro';
import LinearProgrammingIntro from '@/components/intros/LinearProgrammingIntro';
import MatricesDeterminantsIntro from '@/components/intros/MatricesDeterminantsIntro';
import CircleTheorems1Intro from '@/components/intros/CircleTheorems1Intro';
import CircleTheorems2Intro from '@/components/intros/CircleTheorems2Intro';
import PolygonsAnglesIntro from '@/components/intros/PolygonsAnglesIntro';
import SimilarityCongruenceIntro from '@/components/intros/SimilarityCongruenceIntro';
import GeometricConstructionsIntro from '@/components/intros/GeometricConstructionsIntro';
import CoordinateGeometryIntro from '@/components/intros/CoordinateGeometryIntro';
import TrigonometricRatiosIntro from '@/components/intros/TrigonometricRatiosIntro';
import TrigonometricIdentitiesIntro from '@/components/intros/TrigonometricIdentitiesIntro';
import TrigGraphsIntro from '@/components/intros/TrigGraphsIntro';
import TrigonometricEquationsIntro from '@/components/intros/TrigonometricEquationsIntro';
import ApplicationsOfTrigonometryIntro from '@/components/intros/ApplicationsOfTrigonometryIntro';
import MeasuresOfCentralTendencyIntro from '@/components/intros/MeasuresOfCentralTendencyIntro';
import MeasuresOfDispersionIntro from '@/components/intros/MeasuresOfDispersionIntro';
import ProbabilityFundamentalsIntro from '@/components/intros/ProbabilityFundamentalsIntro';
import ProbabilityDistributionsIntro from '@/components/intros/ProbabilityDistributionsIntro';
import SineCosineRulesIntro from '@/components/intros/SineCosineRulesIntro';
import BearingsScaleDrawingIntro from '@/components/intros/BearingsScaleDrawingIntro';
import CumulativeFrequencyBoxPlotsIntro from '@/components/intros/CumulativeFrequencyBoxPlotsIntro';
import StructuredProblemSolvingIntro from '@/components/intros/StructuredProblemSolvingIntro';
import IntegratedWASSCERevisionIntro from '@/components/intros/IntegratedWASSCERevisionIntro';
// SHS2 Intro Components
import NumberBasesIntro from '@/components/intros/NumberBasesIntro';
import BinaryOperationsIntro from '@/components/intros/BinaryOperationsIntro';
import AlgebraicFactorizationIntro from '@/components/intros/AlgebraicFactorizationIntro';
import SimultaneousLinearEquationsIntro from '@/components/intros/SimultaneousLinearEquationsIntro';
import VariationIntro from '@/components/intros/VariationIntro';
import MensurationIntro from '@/components/intros/MensurationIntro';
import TrigonometryRatiosIntro from '@/components/intros/TrigonometryRatiosIntro';
import CircleGeometryIntro from '@/components/intros/CircleGeometryIntro';
import TransformationGeometryIntro from '@/components/intros/TransformationGeometryIntro';
import StatisticsMeasuresIntro from '@/components/intros/StatisticsMeasuresIntro';
import ProbabilityCombinedIntro from '@/components/intros/ProbabilityCombinedIntro';
// SHS1 Intro Components
import TypesOfNumbersIntro from '@/components/intros/TypesOfNumbersIntro';
import FractionsDecimalsPercentagesIntro from '@/components/intros/FractionsDecimalsPercentagesIntro';
import SetsVennDiagramsIntro from '@/components/intros/SetsVennDiagramsIntro';
import AlgebraicExpressionsIntro from '@/components/intros/AlgebraicExpressionsIntro';
import LinearEquationsInequalitiesIntro from '@/components/intros/LinearEquationsInequalitiesIntro';
import DirectedNumbersIntro from '@/components/intros/DirectedNumbersIntro';
import ApproximationEstimationIntro from '@/components/intros/ApproximationEstimationIntro';
import FactorsMultiplesIntro from '@/components/intros/FactorsMultiplesIntro';
import GeometryLinesAnglesIntro from '@/components/intros/GeometryLinesAnglesIntro';
import GeometryTrianglesQuadrilateralsIntro from '@/components/intros/GeometryTrianglesQuadrilateralsIntro';
import GeometryConstructionsLociIntro from '@/components/intros/GeometryConstructionsLociIntro';
import DataCollectionPresentationIntro from '@/components/intros/DataCollectionPresentationIntro';
import IntroductionToProbabilityIntro from '@/components/intros/IntroductionToProbabilityIntro';
import LogicalReasoningIntro from '@/components/intros/LogicalReasoningIntro';
import BusinessMathematicsIntro from '@/components/intros/BusinessMathematicsIntro';
// Integrated Science Intro Components
import NatureAndScopeOfChemistryIntro from '@/components/intros/NatureAndScopeOfChemistryIntro';
import ScientificMethodsAndSafetyIntro from '@/components/intros/ScientificMethodsAndSafetyIntro';
import StatesAndChangesOfMatterIntro from '@/components/intros/shs/integrated-science/StatesAndChangesOfMatterIntro';
import CellStructureFunctionIntro from '@/components/intros/shs/integrated-science/CellStructureFunctionIntro';
import CellDivisionIntro from '@/components/intros/shs/integrated-science/CellDivisionIntro';
import RocksTypesFormationIntro from '@/components/intros/shs/integrated-science/RocksTypesFormationIntro';
import NutritionBalancedDietIntro from '@/components/intros/shs/integrated-science/NutritionBalancedDietIntro';
import DigestionIntro from '@/components/intros/shs/integrated-science/DigestionIntro';
import RespirationIntro from '@/components/intros/shs/integrated-science/RespirationIntro';
import PhotosynthesisIntro from '@/components/intros/shs/integrated-science/PhotosynthesisIntro';
import GeneticsIntro from '@/components/intros/shs/integrated-science/GeneticsIntro';
import FormsOfEnergyIntro from '@/components/intros/shs/integrated-science/FormsOfEnergyIntro';
import EnergyTransformationIntro from '@/components/intros/shs/integrated-science/EnergyTransformationIntro';
import HeatEnergyIntro from '@/components/intros/shs/integrated-science/HeatEnergyIntro';
import AcidsBasesIntro from '@/components/intros/shs/integrated-science/AcidsBasesIntro';
import PHScaleIntro from '@/components/intros/shs/integrated-science/PHScaleIntro';
import CropAnimalProductionIntro from '@/components/intros/shs/integrated-science/CropAnimalProductionIntro';
import SoilFertilityIntro from '@/components/intros/shs/integrated-science/SoilFertilityIntro';
import SoilCompositionIntro from '@/components/intros/shs/integrated-science/SoilCompositionIntro';
import ElementsCompoundsIntro from '@/components/intros/shs/integrated-science/ElementsCompoundsIntro';
import UnitsInstrumentsIntro from '@/components/intros/shs/integrated-science/UnitsInstrumentsIntro';
import AccuracyPrecisionIntro from '@/components/intros/shs/integrated-science/AccuracyPrecisionIntro';
// SHS2 Integrated Science - Custom Interactive Intros
import LifeCyclesPlantsAnimalsIntro from '@/components/lesson-intros/integrated-science/shs2/LifeCyclesPlantsAnimalsIntro';
import LifeCyclesHumanDevelopmentIntro from '@/components/lesson-intros/integrated-science/shs2/LifeCyclesHumanDevelopmentIntro';
import NutrientCyclesNitrogenCarbonIntro from '@/components/lesson-intros/integrated-science/shs2/NutrientCyclesNitrogenCarbonIntro';
import WaterCycleIntro from '@/components/lesson-intros/integrated-science/shs2/WaterCycleIntro';
import ReproductionAsexualSexualIntro from '@/components/lesson-intros/integrated-science/shs2/ReproductionAsexualSexualIntro';
import ReproductionFertilizationDevelopmentIntro from '@/components/lesson-intros/integrated-science/shs2/ReproductionFertilizationDevelopmentIntro';
import ElectricityMagnetismConceptsIntro from '@/components/lesson-intros/integrated-science/shs2/ElectricityMagnetismConceptsIntro';
import SimpleCircuitsIntro from '@/components/lesson-intros/integrated-science/shs2/SimpleCircuitsIntro';
import ForceWorkPowerIntro from '@/components/lesson-intros/integrated-science/shs2/ForceWorkPowerIntro';
import SimpleMachinesIntro from '@/components/lesson-intros/integrated-science/shs2/SimpleMachinesIntro';
// SHS3 Integrated Science Intro Components
import HumanBodySystemsOverviewIntro from '@/components/lesson-intros/integrated-science/shs3/HumanBodySystemsOverviewIntro';
import HumanBodyFunctionsIntro from '@/components/lesson-intros/integrated-science/shs3/HumanBodyFunctionsIntro';
import PlantSystemsPhotosynthesisIntro from '@/components/lesson-intros/integrated-science/shs3/PlantSystemsPhotosynthesisIntro';
import PlantSystemsTransportIntro from '@/components/lesson-intros/integrated-science/shs3/PlantSystemsTransportIntro';
import EcosystemsComponentsRelationshipsIntro from '@/components/lesson-intros/integrated-science/shs3/EcosystemsComponentsRelationshipsIntro';
import EcosystemsEnergyFlowIntro from '@/components/lesson-intros/integrated-science/shs3/EcosystemsEnergyFlowIntro';
import EnvironmentalChemistryPollutionIntro from '@/components/lesson-intros/integrated-science/shs3/EnvironmentalChemistryPollutionIntro';
import WasteManagementIntro from '@/components/lesson-intros/integrated-science/shs3/WasteManagementIntro';
// English Language Intro Components
import EffectiveListeningIntro from '@/components/lesson-intros/english-language/shs1/EffectiveListeningIntro';
import { CarouselLesson } from '@/components/CarouselLesson';
import { 
  addBookmark, 
  removeBookmark, 
  isBookmarked, 
  getLessonNote, 
  saveNote,
  getChecklist,
  addChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem
} from '@/lib/lesson-tools';
import { 
  saveOfflineLesson, 
  removeOfflineLesson, 
  isLessonOffline, 
  isOnline 
} from '@/lib/offline-storage';
import { useToast } from '@/hooks/use-toast';

export default function LessonPage() {
  const params = useParams();
  const level = params.level as string;
  const subjectSlug = params.subjectSlug as string;
  const topicSlug = params.topicSlug as string;
  const lessonSlug = params.lessonSlug as string;

  const { firestore } = useFirebase();
  const { country } = useLocalization();
  const { toast } = useToast();
  const [firestoreLesson, setFirestoreLesson] = useState<Lesson | null>(null);
  const [isFirestoreLoading, setIsFirestoreLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [savedOffline, setSavedOffline] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [checklistItems, setChecklistItems] = useState<any[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [educationLevel, setEducationLevel] = useState<EducationLevel | null>(null);
  const [isLevelLoading, setIsLevelLoading] = useState(true);
  const [useCarouselMode, setUseCarouselMode] = useState(false);
  const [carouselEligible, setCarouselEligible] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [hasCheckedAutostart, setHasCheckedAutostart] = useState(false);
  
  // Call useLocalizedLesson at the top level (before any conditional logic)
  // This ensures hooks are always called in the same order
  const detailedLesson = useLocalizedLesson(subjectSlug, topicSlug, lessonSlug);

  // Detect education level from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLevel = localStorage.getItem('userEducationLevel') as EducationLevel;
      if (storedLevel && ['Primary', 'JHS', 'SHS'].includes(storedLevel)) {
        setEducationLevel(storedLevel);
      } else {
        setEducationLevel('JHS');
      }
      setIsLevelLoading(false);
    }
  }, []);
  
  // Get subject info based on education level (only after level is loaded)
  const subjectInfo = !isLevelLoading && educationLevel
    ? (educationLevel === 'Primary'
      ? getPrimarySubjectBySlug(subjectSlug)
      : educationLevel === 'SHS'
      ? getSHSSubjectBySlug(subjectSlug)
      : getSubjectBySlug(subjectSlug))
    : null;

  // Calculate local lesson synchronously
  let localTopic: any = null;
  let localLesson: any = null;

  if (!isLevelLoading && educationLevel === 'Primary' && subjectInfo) {
    // Primary subjects have topics array directly
    localTopic = (subjectInfo as any).topics?.find((t: any) => t.slug === topicSlug);
    localLesson = localTopic?.lessons?.find((l: any) => l.slug === lessonSlug) || null;
  } else if (!isLevelLoading && educationLevel === 'SHS' && subjectInfo) {
    // SHS subjects have topics array directly (similar to Primary)
    localTopic = (subjectInfo as any).topics?.find((t: any) => t.slug === topicSlug);
    
    // Debug: Log the parameters
    console.log('SHS Lesson Loading:', { subjectSlug, topicSlug, lessonSlug, localTopic });
    
    // Use the detailed lesson from useLocalizedLesson (called at top level)
    console.log('Detailed lesson from useLocalizedLesson:', detailedLesson);
    if (detailedLesson) {
      console.log('Lesson has activities?', !!detailedLesson.activities);
      const activities = detailedLesson.activities as any;
      if (activities && !Array.isArray(activities)) {
        console.log('Activities type:', activities.type);
        console.log('Activities has questions?', !!activities.questions);
        console.log('Questions count:', activities.questions?.length || 0);
      }
    }
    
    if (detailedLesson) {
      // Use the detailed lesson from shs-lessons-data.ts
      localLesson = detailedLesson;
    } else if (localTopic && localTopic.slug === lessonSlug) {
      // Fallback: create a lesson object from the topic since topics ARE the lessons
      localLesson = {
        id: localTopic.id,
        slug: localTopic.slug,
        title: localTopic.name,
        description: `Learn about ${localTopic.name} in detail.`,
      };
    }
  } else if (subjectInfo) {
    // JHS subjects have curriculum with topics
    localTopic = (subjectInfo as any).curriculum
        ?.flatMap((c: any) => c.topics)
        .find((t: any) => t.slug === topicSlug);
    localLesson = localTopic?.lessons?.find((l: any) => l.slug === lessonSlug) || null;
  }

  // STABILITY FIX: If local lesson exists, use it immediately and ignore Firestore.
  // This prevents flickering and async state updates from interfering with local development.
  // Memoize to prevent infinite loops from recreating the object
  const lesson = useMemo(() => {
    const baseLesson = localLesson || firestoreLesson;
    
    // For Primary and SHS lessons without full content, generate placeholder content
    if ((educationLevel === 'Primary' || educationLevel === 'SHS') && baseLesson && !baseLesson.introduction) {
      const levelText = educationLevel === 'Primary' ? 'primary school' : 'Senior High School';
      return {
        ...baseLesson,
        introduction: `Welcome to **${baseLesson.title}**! In this ${levelText} lesson, you will learn important concepts that will help you understand ${localTopic?.name || 'this topic'} better. Let's explore together!`,
        objectives: [
          `Understand the key concepts of ${baseLesson.title}`,
          `Apply ${baseLesson.title} principles to solve problems`,
          `Develop critical thinking skills in this area`,
          `Practice and master the fundamental techniques`,
        ],
        keyConcepts: [
          {
            title: `Introduction to ${baseLesson.title}`,
            explanation: `${baseLesson.title} is a fundamental concept in ${subjectInfo?.name}. This topic builds on your previous knowledge and introduces new ideas that are essential for your ${educationLevel} studies.`,
          },
          {
            title: 'Key Principles',
            explanation: `Understanding the core principles of ${baseLesson.title} will help you excel in ${subjectInfo?.name}. Pay attention to the definitions, formulas, and examples provided.`,
          },
          {
            title: 'Practical Applications',
            explanation: `${baseLesson.title} has many real-world applications. As you study, think about how these concepts apply to everyday situations and other subjects you're learning.`,
          },
          {
            title: 'Study Tips',
            explanation: 'Take notes, practice regularly, and don\'t hesitate to ask questions. Review this lesson multiple times to strengthen your understanding.',
          }
        ],
        summary: `Congratulations on completing this lesson on ${baseLesson.title}! You've learned important concepts that will help you succeed in ${subjectInfo?.name}. Remember to review regularly and practice with examples. ${educationLevel === 'SHS' ? `These skills will be valuable for your ${country?.examSystem?.secondary || 'WASSCE'} preparation.` : 'Keep up the great work!'}`,
        additionalResources: [
          {
            title: 'Practice Exercises',
            description: 'Additional practice materials and exercises',
            type: 'worksheet' as const
          },
          {
            title: 'Video Tutorials',
            description: 'Visual explanations and demonstrations',
            type: 'video' as const
          },
          {
            title: 'Interactive Quiz',
            description: 'Test your understanding with practice questions',
            type: 'quiz' as const
          }
        ]
      };
    }
    
    return baseLesson;
  }, [localLesson, firestoreLesson, educationLevel, localTopic?.name, subjectInfo?.name]);

  // Check carousel eligibility using feature flags
  // Use lessonSlug as the main dependency to prevent infinite loops
  const lessonId = lesson?.id || lesson?.slug || lessonSlug;
  
  useEffect(() => {
    if (lessonId && level && subjectSlug && topicSlug && lessonSlug) {
      // Check if carousel is enabled for this lesson
      const eligible = isCarouselEnabled(
        level,
        subjectSlug,
        topicSlug,
        lessonSlug
      );
      
      console.log('🎠 CAROUSEL CHECK:', {
        level,
        subjectSlug,
        topicSlug,
        lessonSlug,
        eligible
      });
      
      console.log('🎠 CAROUSEL CHECK DETAILS:', {
        'level (normalized)': level.toLowerCase(),
        'subject (normalized)': subjectSlug.toLowerCase(),
        'topic (normalized)': topicSlug.toLowerCase(),
        'lesson (normalized)': lessonSlug.toLowerCase(),
        'Expected lesson slug': 'is-sy-ecosystems-energy-flow-food-chains',
        'Match?': lessonSlug.toLowerCase() === 'is-sy-ecosystems-energy-flow-food-chains',
        'eligible': eligible
      });
      
      setCarouselEligible(eligible);
      
      // Validate lesson structure if eligible
      if (eligible && lesson) {
        try {
          const validation = validateLessonForCarousel(lesson);
          setValidationResult(validation);
          
          console.log('✅ CAROUSEL VALIDATION:', {
            isValid: validation.isValid,
            errors: validation.errors,
            warnings: validation.warnings,
            slideCount: validation.slideCount
          });
          
          // Track feature flag status
          trackFeatureFlagStatus('carousel_mode', eligible, {
            level,
            subject: subjectSlug,
            topic: topicSlug,
            lesson: lessonSlug,
            validation: validation.isValid,
          });
          
          // Log validation results in development
          if (process.env.NODE_ENV === 'development') {
            console.log('Carousel Eligibility:', eligible);
            console.log('Lesson Validation:', validation);
            console.log('Lesson data:', lesson);
          }
          
          // Track validation errors only if there are actual errors with content
          if (!validation.isValid && validation.errors.length > 0) {
            const errorMessage = validation.errors.join(', ').trim();
            if (errorMessage) {
              trackCarouselError({
                lessonSlug: lessonSlug || 'unknown',
                error: errorMessage,
                errorType: 'validation',
                context: 'Lesson structure validation failed',
                timestamp: Date.now(),
              });
            }
          }
        } catch (error) {
          console.error('Error during carousel validation:', error);
        }
      }
    }
  }, [lessonId, level, subjectSlug, topicSlug, lessonSlug, lesson]);

  // Autostart carousel mode if enabled in feature flags
  useEffect(() => {
    if (carouselEligible && validationResult?.isValid && !hasCheckedAutostart) {
      // Import FEATURE_FLAGS to check autostart
      import('@/lib/featureFlags').then(({ FEATURE_FLAGS }) => {
        if (FEATURE_FLAGS.CAROUSEL_MODE.autostart) {
          console.log('🚀 AUTO-STARTING CAROUSEL MODE');
          setUseCarouselMode(true);
        }
        setHasCheckedAutostart(true);
      });
    }
  }, [carouselEligible, validationResult?.isValid, hasCheckedAutostart]);

  // Debug: Log lesson slug - use lessonSlug to prevent infinite loops
  useEffect(() => {
    if (lesson?.slug) {
      console.log('Current lesson slug:', lesson.slug);
      console.log('Should show carousel button:', lesson.slug === 'shs3-quadratic-equations');
    }
  }, [lesson?.slug]);

  // Memoize the localQuizzes to prevent infinite loops
  const localQuizzes = useMemo(() => {
    return lesson?.endOfLessonQuiz || undefined;
  }, [lesson?.endOfLessonQuiz]);

  // Load bookmark, offline, and notes state - only when lesson.id changes, not the whole object
  useEffect(() => {
    if (lesson) {
      setBookmarked(isBookmarked(lesson.id));
      setSavedOffline(isLessonOffline(lesson.id));
      const note = getLessonNote(lesson.id);
      if (note) setNoteContent(note.content);
      setChecklistItems(getChecklist(lesson.id));
    }
  }, [lesson?.id]);

  useEffect(() => {
    // Primary and SHS lessons only exist locally, skip Firestore
    if (educationLevel === 'Primary' || educationLevel === 'SHS') {
      setIsFirestoreLoading(false);
      return;
    }

    // If we already have the lesson locally, no need to fetch from Firestore.
    if (localLesson) {
        setIsFirestoreLoading(false);
        return;
    }

    const fetchFirestoreLesson = async () => {
      if (!firestore) {
        // Wait for firestore to initialize
        return;
      }

      try {
        const lessonsRef = collection(firestore, `subjects/${subjectSlug}/topics/${topicSlug}/lessons`);
        const lessonsSnapshot = await getDocs(lessonsRef);
        const lessons = lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
        const found = lessons.find(l => l.slug === lessonSlug) || null;
        if (found) {
            setFirestoreLesson(found);
        }
      } catch (error) {
        console.error("Error fetching lesson from Firestore:", error);
      } finally {
        setIsFirestoreLoading(false);
      }
    };

    fetchFirestoreLesson();
  }, [firestore, subjectSlug, topicSlug, lessonSlug, localLesson, educationLevel]);

  // Show loading while detecting education level
  if (isLevelLoading) {
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
        </div>
    )
  }

  // Only show loading if we don't have a lesson AND we are still trying to fetch one
  if (!lesson && isFirestoreLoading && !localLesson) {
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    )
  }

  if (!lesson) {
    notFound();
  }
  
  if (!subjectInfo) {
      return <div>Subject not found</div>;
  }

  if (!lesson) {
    notFound();
  }
  
  if (!subjectInfo) {
      notFound();
  }

  const introductionId = `lesson-${lesson.slug}-intro`;
  const summaryId = `lesson-${lesson.slug}-summary`;

  const handleBookmark = () => {
    if (bookmarked) {
      removeBookmark(lesson.id);
      setBookmarked(false);
      toast({ title: 'Bookmark removed' });
    } else {
      addBookmark({
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        subject: subjectInfo.name,
        topic: localTopic?.title || '',
        bookmarkedAt: new Date().toISOString(),
        href: `/subjects/${level}/${subjectSlug}/${topicSlug}/${lessonSlug}`
      });
      setBookmarked(true);
      toast({ title: 'Lesson bookmarked!' });
    }
  };

  const handleSaveOffline = () => {
    if (savedOffline) {
      removeOfflineLesson(lesson.id);
      setSavedOffline(false);
      toast({ title: 'Removed from offline storage' });
    } else {
      saveOfflineLesson({
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        subject: subjectInfo.name,
        topic: localTopic?.title || '',
        content: lesson
      });
      setSavedOffline(true);
      toast({ title: 'Saved for offline reading!' });
    }
  };

  const handleSaveNote = () => {
    saveNote({
      lessonId: lesson.id,
      content: noteContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    toast({ title: 'Note saved!' });
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    const item = addChecklistItem({
      lessonId: lesson.id,
      title: newChecklistItem,
      completed: false
    });
    if (item) {
      setChecklistItems([...checklistItems, item]);
      setNewChecklistItem('');
    }
  };

  const handleToggleChecklistItem = (id: string) => {
    toggleChecklistItem(id);
    setChecklistItems(getChecklist(lesson.id));
  };

  const handleDeleteChecklistItem = (id: string) => {
    deleteChecklistItem(id);
    setChecklistItems(getChecklist(lesson.id));
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      {/* Use Carousel Mode if eligible and enabled */}
      {carouselEligible && validationResult?.isValid && useCarouselMode ? (
        <CarouselLesson
          lesson={lesson}
          subjectSlug={subjectSlug}
          topicSlug={topicSlug}
          lessonSlug={lessonSlug}
          educationLevel={educationLevel}
          localQuizzes={localQuizzes}
          introComponent={
            // SHS3 Algebra (Phase 1)
            lessonSlug === 'quadratic-equations' || lessonSlug === 'shs3-quadratic-equations' ? (
              <QuadraticEquationsIntro />
            ) : lessonSlug === 'factorization' ? (
              <FactorizationIntro />
            ) : lessonSlug === 'completing-the-square' ? (
              <CompletingSquareIntro />
            ) : lessonSlug === 'quadratic-formula' ? (
              <QuadraticFormulaIntro />
            ) : // SHS3 Algebra (Phase 2)
            lessonSlug === 'sequences-series' ? (
              <SequencesSeriesIntro />
            ) : lessonSlug === 'functions-relations' ? (
              <FunctionsRelationsIntro />
            ) : lessonSlug === 'linear-programming' ? (
              <LinearProgrammingIntro />
            ) : lessonSlug === 'matrices-determinants' ? (
              <MatricesDeterminantsIntro />
            ) : // SHS3 Geometry (Phase 3)
            lessonSlug === 'circle-theorems-1' ? (
              <CircleTheorems1Intro />
            ) : lessonSlug === 'circle-theorems-2' ? (
              <CircleTheorems2Intro />
            ) : lessonSlug === 'polygons-angles' ? (
              <PolygonsAnglesIntro />
            ) : lessonSlug === 'similarity-congruence' ? (
              <SimilarityCongruenceIntro />
            ) : lessonSlug === 'geometric-constructions' ? (
              <GeometricConstructionsIntro />
            ) : lessonSlug === 'coordinate-geometry' ? (
              <CoordinateGeometryIntro />
            ) : // SHS3 Trigonometry (Phase 4)
            lessonSlug === 'trigonometric-ratios' ? (
              <TrigonometricRatiosIntro />
            ) : lessonSlug === 'trigonometric-identities' ? (
              <TrigonometricIdentitiesIntro />
            ) : lessonSlug === 'trig-graphs' ? (
              <TrigGraphsIntro />
            ) : lessonSlug === 'trigonometric-equations' ? (
              <TrigonometricEquationsIntro />
            ) : lessonSlug === 'applications-of-trigonometry' ? (
              <ApplicationsOfTrigonometryIntro />
            ) : // SHS3 Statistics & Probability (Phase 5)
            lessonSlug === 'measures-of-central-tendency' ? (
              <MeasuresOfCentralTendencyIntro />
            ) : lessonSlug === 'measures-of-dispersion' ? (
              <MeasuresOfDispersionIntro />
            ) : lessonSlug === 'probability-fundamentals' ? (
              <ProbabilityFundamentalsIntro />
            ) : lessonSlug === 'probability-distributions' ? (
              <ProbabilityDistributionsIntro />
            ) : // SHS3 Geometry II
            lessonSlug === 'sine-cosine-rules' ? (
              <SineCosineRulesIntro />
            ) : lessonSlug === 'shs3-bearings-scale-drawing' ? (
              <BearingsScaleDrawingIntro />
            ) : // SHS3 Data Handling
            lessonSlug === 'shs3-cumulative-frequency-box-plots' ? (
              <CumulativeFrequencyBoxPlotsIntro />
            ) : // SHS3 Problem Solving
            lessonSlug === 'shs3-problem-solving-strategies' ? (
              <StructuredProblemSolvingIntro />
            ) : lessonSlug === 'shs3-wassce-revision' ? (
              <IntegratedWASSCERevisionIntro />
            ) : // SHS2 Lessons
            lessonSlug === 'shs2-number-bases' ? (
              <NumberBasesIntro />
            ) : lessonSlug === 'shs2-binary-operations' ? (
              <BinaryOperationsIntro />
            ) : lessonSlug === 'shs2-algebraic-factorization' ? (
              <AlgebraicFactorizationIntro />
            ) : lessonSlug === 'shs2-simultaneous-linear-equations' ? (
              <SimultaneousLinearEquationsIntro />
            ) : lessonSlug === 'shs2-variation' ? (
              <VariationIntro />
            ) : lessonSlug === 'shs2-mensuration' ? (
              <MensurationIntro />
            ) : lessonSlug === 'shs2-trigonometry-ratios' ? (
              <TrigonometryRatiosIntro />
            ) : lessonSlug === 'shs2-circle-geometry' ? (
              <CircleGeometryIntro />
            ) : lessonSlug === 'shs2-transformation-geometry' ? (
              <TransformationGeometryIntro />
            ) : lessonSlug === 'shs2-statistics-measures' ? (
              <StatisticsMeasuresIntro />
            ) : lessonSlug === 'shs2-probability-combined' ? (
              <ProbabilityCombinedIntro />
            ) : // SHS1 Lessons
            lessonSlug === 'shs1-types-of-numbers' ? (
              <TypesOfNumbersIntro />
            ) : lessonSlug === 'shs1-fractions-decimals-percentages' ? (
              <FractionsDecimalsPercentagesIntro />
            ) : lessonSlug === 'sets-venn-diagrams' ? (
              <SetsVennDiagramsIntro />
            ) : lessonSlug === 'cm-algebraic-expressions' ? (
              <AlgebraicExpressionsIntro />
            ) : lessonSlug === 'shs1-linear-equations-inequalities' ? (
              <LinearEquationsInequalitiesIntro />
            ) : lessonSlug === 'shs1-directed-numbers' ? (
              <DirectedNumbersIntro />
            ) : lessonSlug === 'shs1-approximation-estimation' ? (
              <ApproximationEstimationIntro />
            ) : lessonSlug === 'shs1-factors-multiples' ? (
              <FactorsMultiplesIntro />
            ) : lessonSlug === 'shs1-geometry-lines-angles' ? (
              <GeometryLinesAnglesIntro />
            ) : lessonSlug === 'shs1-geometry-triangles-quadrilaterals' ? (
              <GeometryTrianglesQuadrilateralsIntro />
            ) : lessonSlug === 'shs1-geometry-constructions-loci' ? (
              <GeometryConstructionsLociIntro />
            ) : lessonSlug === 'shs1-data-collection-presentation' ? (
              <DataCollectionPresentationIntro />
            ) : lessonSlug === 'shs1-introduction-to-probability' ? (
              <IntroductionToProbabilityIntro />
            ) : lessonSlug === 'shs1-logical-reasoning' ? (
              <LogicalReasoningIntro />
            ) : lessonSlug === 'shs1-business-mathematics' ? (
              <BusinessMathematicsIntro />
            ) : // Integrated Science Intros
            lessonSlug === 'chem-shs1-intro-nature-scope' ? (
              <NatureAndScopeOfChemistryIntro />
            ) : lessonSlug === 'chem-shs1-intro-scientific-methods-safety' ? (
              <ScientificMethodsAndSafetyIntro />
            ) : lessonSlug === 'is-dm-matter-states-properties' ? (
              <StatesAndChangesOfMatterIntro />
            ) : lessonSlug === 'is-dm-cells-structure-function' ? (
              <CellStructureFunctionIntro />
            ) : lessonSlug === 'is-dm-cells-cell-division' ? (
              <CellDivisionIntro />
            ) : lessonSlug === 'is-dm-rocks-soil-types-formation' ? (
              <RocksTypesFormationIntro />
            ) : lessonSlug === 'is-dm-nutrition-balanced-diet' ? (
              <NutritionBalancedDietIntro />
            ) : lessonSlug === 'is-dm-digestion-process' ? (
              <DigestionIntro />
            ) : lessonSlug === 'is-dm-respiration-aerobic-anaerobic' ? (
              <RespirationIntro />
            ) : lessonSlug === 'is-dm-photosynthesis-process' ? (
              <PhotosynthesisIntro />
            ) : lessonSlug === 'is-dm-genetics-inheritance' ? (
              <GeneticsIntro />
            ) : lessonSlug === 'is-en-forms-of-energy-types' ? (
              <FormsOfEnergyIntro />
            ) : lessonSlug === 'is-en-forms-of-energy-transformation-conservation' ? (
              <EnergyTransformationIntro />
            ) : lessonSlug === 'is-en-heat-energy-temperature' ? (
              <HeatEnergyIntro />
            ) : lessonSlug === 'is-im-acids-bases-salts-properties-reactions' ? (
              <AcidsBasesIntro />
            ) : lessonSlug === 'is-im-acids-bases-salts-ph-scale' ? (
              <PHScaleIntro />
            ) : lessonSlug === 'is-im-agricultural-science-crop-animal-production' ? (
              <CropAnimalProductionIntro />
            ) : lessonSlug === 'is-im-agricultural-science-soil-fertility-conservation' ? (
              <SoilFertilityIntro />
            ) : lessonSlug === 'is-dm-rocks-soil-composition' ? (
              <SoilCompositionIntro />
            ) : lessonSlug === 'is-diversity-matter-shs1' ? (
              <ElementsCompoundsIntro />
            ) : lessonSlug === 'is-measurement-units-instruments' ? (
              <UnitsInstrumentsIntro />
            ) : lessonSlug === 'is-accuracy-precision-measurement' ? (
              <AccuracyPrecisionIntro />
            ) : lessonSlug === 'is-cy-life-cycles-plants-animals' ? (
              <LifeCyclesPlantsAnimalsIntro />
            ) : lessonSlug === 'is-cy-life-cycles-human-development' ? (
              <LifeCyclesHumanDevelopmentIntro />
            ) : lessonSlug === 'is-cy-nutrient-cycles-nitrogen-carbon' ? (
              <NutrientCyclesNitrogenCarbonIntro />
            ) : lessonSlug === 'is-cy-nutrient-cycles-water' ? (
              <WaterCycleIntro />
            ) : lessonSlug === 'is-cy-reproduction-asexual-sexual' ? (
              <ReproductionAsexualSexualIntro />
            ) : lessonSlug === 'is-cy-reproduction-fertilization-development' ? (
              <ReproductionFertilizationDevelopmentIntro />
            ) : lessonSlug === 'is-em-electricity-magnetism-concepts' ? (
              <ElectricityMagnetismConceptsIntro />
            ) : lessonSlug === 'is-en-electricity-magnetism-simple-circuits' ? (
              <SimpleCircuitsIntro />
            ) : lessonSlug === 'is-en-work-machines-force-work-power' ? (
              <ForceWorkPowerIntro />
            ) : lessonSlug === 'is-en-work-machines-simple-machines-uses' ? (
              <SimpleMachinesIntro />
            ) : lessonSlug === 'is-sy-human-body-systems-overview' ? (
              <HumanBodySystemsOverviewIntro />
            ) : lessonSlug === 'is-sy-human-body-systems-functions-interactions' ? (
              <HumanBodyFunctionsIntro />
            ) : lessonSlug === 'is-sy-plant-systems-photosynthesis' ? (
              <PlantSystemsPhotosynthesisIntro />
            ) : lessonSlug === 'is-sy-plant-systems-transport' ? (
              <PlantSystemsTransportIntro />
            ) : lessonSlug === 'is-sy-ecosystems-components-relationships' ? (
              <EcosystemsComponentsRelationshipsIntro />
            ) : lessonSlug === 'is-sy-ecosystems-energy-flow-food-chains' ? (
              <EcosystemsEnergyFlowIntro />
            ) : lessonSlug === 'is-im-environmental-chemistry-pollution-effects' ? (
              <EnvironmentalChemistryPollutionIntro />
            ) : lessonSlug === 'is-im-environmental-chemistry-waste-management' ? (
              <WasteManagementIntro />
            ) : // English Language Intros
            lessonSlug === 'eng-ls-effective-listening' ? (
              <EffectiveListeningIntro />
            ) : (
              // Fallback - should not reach here if all intros are properly mapped
              null
            )
          }
          onExit={() => setUseCarouselMode(false)}
        />
      ) : (
        <>
          <Link
            href={`/subjects/${level}/${subjectSlug}`}
            className="inline-flex items-center text-primary mb-4 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {subjectInfo.name}
          </Link>

          {/* Add Carousel Mode Toggle if eligible */}
          {carouselEligible && validationResult?.isValid && (
            <div className="mb-4 md:mb-6">
              <Card className="border-2 border-violet-300 dark:border-violet-700 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30">
                <CardContent className="p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-base md:text-lg mb-1">🎯 Try Bite-Sized Learning Mode</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        One concept at a time with Next/Previous navigation
                      </p>
                    </div>
                    <Button
                      onClick={() => setUseCarouselMode(true)}
                      className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 h-10 md:h-auto"
                    >
                      Start Carousel Mode
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="relative">
            <FloatingIcon icon="lightbulb" position="tr" size="lg" />
        <FloatingIcon icon="brain" position="br" size="md" />
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-4xl font-bold font-headline">{lesson.title}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant={bookmarked ? "default" : "outline"}
              size="sm"
              onClick={handleBookmark}
              className="flex items-center gap-2"
            >
              {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
            <Button
              variant={savedOffline ? "secondary" : "outline"}
              size="sm"
              onClick={handleSaveOffline}
              className="flex items-center gap-2"
            >
              {savedOffline ? <DownloadCloud className="h-4 w-4" /> : <Download className="h-4 w-4" />}
              {savedOffline ? 'Saved' : 'Save Offline'}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-lg text-muted-foreground">
            From topic: {topicSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </p>
          {bookmarked && <Badge variant="secondary" className="text-xs">📌 Bookmarked</Badge>}
          {savedOffline && <Badge variant="secondary" className="text-xs">💾 Offline</Badge>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {lesson.objectives && lesson.objectives.length > 0 && (
            <LessonVisual type="objective" title="🎯 Lesson Objectives" icon="target">
              <ul className="space-y-2">
                {lesson.objectives.map((obj: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </LessonVisual>
          )}

          {/* Note: Intelligent Voice Intros are now shown ONLY inside CarouselLesson mode
              to avoid duplicate intros and ensure buttons work properly */}

          {lesson.introduction && (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                    <Lightbulb className="h-6 w-6 mr-3 text-primary" />
                    Introduction
                </CardTitle>
                <ReadAloud textId={introductionId} />
                </CardHeader>
                <CardContent>
                <MarkdownRenderer id={introductionId} content={lesson.introduction} className="leading-relaxed" />
                </CardContent>
            </Card>
          )}

          {lesson.keyConcepts && lesson.keyConcepts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  Key Concepts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {lesson.keyConcepts.map((concept: any, i: number) => {
                    const conceptId = `${lesson.id}-concept-${i}`;
                    return (
                      <AccordionItem key={i} value={`concept-${i}`}>
                        <div className="flex items-center justify-between">
                          <AccordionTrigger className="text-left flex-1">
                            <span className="font-semibold">{concept.title}</span>
                          </AccordionTrigger>
                          {/* Temporarily disabled - Use interactive animations with intelligent voice teacher */}
                          {/* <div className="pr-4">
                            <ReadAloud textId={conceptId} />
                          </div> */}
                        </div>
                        <AccordionContent>
                          <div className="pt-2">
                            <MarkdownRenderer id={conceptId} content={concept.content} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          )}

          {lesson.activities && lesson.activities.questions && lesson.activities.questions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ListChecks className="h-6 w-6 text-primary" />
                Practice Activities
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5" />
                    {lesson.activities.questions.length} Interactive Practice Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Complete these practice exercises to reinforce your understanding of the concepts. 
                    These activities include multiple choice, fill-in-the-blank, matching, and other question types.
                  </p>
                  <LessonCompleteQuiz 
                    lessonId={`${lesson.id}-activities`}
                    subjectSlug={subjectSlug}
                    topicSlug={topicSlug}
                    lessonSlug={lessonSlug}
                    localQuizzes={lesson.activities.questions}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="space-y-6">
            {lesson.summary && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Summary
                  </h3>
                  {/* Temporarily disabled - Use interactive animations with intelligent voice teacher */}
                  {/* <ReadAloud textId={summaryId} /> */}
                </div>
                <LessonVisual type="summary" icon="fileText">
                  <MarkdownRenderer id={summaryId} content={lesson.summary} />
                </LessonVisual>
              </div>
            )}

            {lesson.pastQuestions && lesson.pastQuestions.length > 0 && (
                <Card className="border-2 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
                          <Award className="h-5 w-5" />
                          {educationLevel === 'SHS' 
                            ? `${country?.examSystem?.secondary || 'WASSCE'} Past Questions` 
                            : educationLevel === 'JHS' 
                            ? `${country?.examSystem?.primary || 'BECE'} Past Questions` 
                            : 'Past Questions'}
                        </CardTitle>
                        {/* Temporarily disabled - Use interactive animations with intelligent voice teacher */}
                        {/* <ReadAloud textId={`${lesson.id}-pastquestions`} /> */}
                    </CardHeader>
                    <CardContent id={`${lesson.id}-pastquestions`} className="text-foreground">
                        {lesson.pastQuestions.map((pq: any, i: number) => (
                            <div key={i} className="mb-4 p-4 rounded-lg bg-background/50 border">
                                <div className="font-semibold text-amber-900 dark:text-amber-100">
                                  <MarkdownRenderer content={pq.question} />
                                </div>
                                <details className="mt-2 text-sm">
                                    <summary className="cursor-pointer hover:text-primary font-medium">View Solution</summary>
                                    <div className="pt-2 pl-4 border-l-2 border-amber-500/30 mt-2">
                                      <MarkdownRenderer content={pq.solution} />
                                    </div>
                                </details>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {localQuizzes && localQuizzes.length > 0 && (
              <Card className="border-2 border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    End of Lesson Quiz
                  </CardTitle>
                  <CardDescription>
                    Complete this quiz to test your understanding and mark this lesson as complete.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LessonCompleteQuiz 
                    lessonId={lesson.id}
                    subjectSlug={subjectSlug}
                    topicSlug={topicSlug}
                    lessonSlug={lessonSlug}
                    localQuizzes={localQuizzes}
                  />
                </CardContent>
              </Card>
            )}

            {/* Personal Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StickyNote className="h-5 w-5 text-primary" />
                    My Notes
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotes(!showNotes)}
                  >
                    {showNotes ? 'Hide' : 'Show'}
                  </Button>
                </CardTitle>
              </CardHeader>
              {showNotes && (
                <CardContent className="space-y-3">
                  <Textarea
                    placeholder="Add your personal notes about this lesson..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <Button
                    onClick={handleSaveNote}
                    disabled={!noteContent.trim()}
                    className="w-full"
                  >
                    Save Note
                  </Button>
                </CardContent>
              )}
            </Card>

            {/* Study Checklist Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  Study Checklist
                  {checklistItems.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {checklistItems.filter(item => item.completed).length}/{checklistItems.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add checklist item..."
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  />
                  <Button
                    onClick={handleAddChecklistItem}
                    disabled={!newChecklistItem.trim()}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>

                {checklistItems.length > 0 && (
                  <div className="space-y-2">
                    {checklistItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 p-2 rounded-md bg-muted/50 hover:bg-muted"
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleToggleChecklistItem(item.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <span className={`flex-1 text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {item.title}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteChecklistItem(item.id)}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {checklistItems.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No checklist items yet. Add items to track your study progress!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </>
      )}
    </div>
  );
}
