/**
 * Lesson Validator for Carousel Mode
 * Validates lesson content structure and provides warnings for optimization
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  slideCount: number;
  recommendations: string[];
}

export interface LessonContent {
  title?: string;
  objectives?: string[];
  keyConcepts?: Array<{
    title?: string;
    content?: string;
    media?: any;
  }>;
  content?: Array<{
    title?: string;
    text?: string;
    type?: string;
    examples?: any[];
  }>;
  summary?: string | {
    keyPoints?: string[];
    concepts?: string[];
  };
  pastQuestions?: any[];
  activities?: any[];
  quiz?: {
    questions?: any[];
  };
  endOfLessonQuiz?: any[];
}

/**
 * Validate lesson structure for carousel compatibility
 */
export function validateLessonForCarousel(
  lesson: LessonContent
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Check required fields for carousel mode
  if (!lesson.objectives || lesson.objectives.length === 0) {
    errors.push('No learning objectives defined - carousel needs objectives slide');
  }

  // Support both keyConcepts (SHS) and content (regular) structures
  const contentSections = lesson.keyConcepts || lesson.content || [];
  if (contentSections.length === 0) {
    errors.push('No content sections defined - carousel needs content slides');
  }

  // Validate objectives
  if (lesson.objectives && lesson.objectives.length > 6) {
    warnings.push(
      `High number of objectives (${lesson.objectives.length}). Consider grouping or splitting lesson.`
    );
  }

  // Validate content sections (support both structures)
  contentSections.forEach((section: any, index: number) => {
    const sectionNum = index + 1;

    // Check for titles
    if (!section.title) {
      warnings.push(`Content section ${sectionNum} missing title - impacts navigation`);
    }

    // Check text length (optimal for mobile viewing)
    // Support both 'text' (regular) and 'content' (SHS) fields
    const sectionText = section.text || section.content || '';
    if (sectionText) {
      const textLength = sectionText.length;
      if (textLength > 800) {
        warnings.push(
          `Section ${sectionNum} "${section.title || 'Untitled'}" has long text (${textLength} chars). Consider breaking into multiple slides.`
        );
        recommendations.push(
          `Split section ${sectionNum} into smaller concept slides (aim for 300-500 chars each)`
        );
      } else if (textLength < 100) {
        warnings.push(
          `Section ${sectionNum} "${section.title || 'Untitled'}" has very short text (${textLength} chars). Consider combining with adjacent section.`
        );
      }
    }

    // Check for examples
    if (section.examples && section.examples.length > 4) {
      recommendations.push(
        `Section ${sectionNum} has ${section.examples.length} examples. Consider creating separate example slides.`
      );
    }
  });

  // Validate summary (support both string and object formats)
  const summaryText = typeof lesson.summary === 'string' ? lesson.summary : '';
  const summaryPoints = typeof lesson.summary === 'object' ? lesson.summary?.keyPoints : [];
  
  if (!lesson.summary) {
    warnings.push('No summary - carousel should have summary slide');
    recommendations.push('Add a summary highlighting main concepts');
  } else if (typeof lesson.summary === 'object' && (!summaryPoints || summaryPoints.length === 0)) {
    warnings.push('No summary key points - carousel should have summary slide');
    recommendations.push('Add 3-5 key points summarizing main concepts');
  }

  // Validate past questions
  if (!lesson.pastQuestions || lesson.pastQuestions.length === 0) {
    warnings.push('No past questions available - valuable for exam preparation');
    recommendations.push('Add 2-3 WASSCE/BECE past questions relevant to this topic');
  } else if (lesson.pastQuestions.length > 5) {
    warnings.push(
      `High number of past questions (${lesson.pastQuestions.length}). Each becomes a slide.`
    );
    recommendations.push('Consider moving some past questions to a separate practice lesson');
  }

  // Validate activities
  if (lesson.activities && lesson.activities.length > 3) {
    warnings.push(`${lesson.activities.length} activities - creates many slides`);
  }

  // Validate quiz (support both quiz and endOfLessonQuiz)
  const quizQuestions = lesson.quiz?.questions || lesson.endOfLessonQuiz || [];
  if (quizQuestions.length > 0) {
    const quizLength = quizQuestions.length;
    if (quizLength < 5) {
      recommendations.push(`Quiz has only ${quizLength} questions. Aim for 5-10 questions.`);
    }
  }

  // Calculate total slide count
  const slideCount = calculateSlideCount(lesson);

  // Check optimal slide count (sweet spot: 8-15 slides)
  if (slideCount > 20) {
    warnings.push(
      `High slide count (${slideCount}). Lesson may be too long for single session.`
    );
    recommendations.push('Consider splitting into Part 1 and Part 2 lessons');
  } else if (slideCount < 5) {
    warnings.push(
      `Low slide count (${slideCount}). May not provide enough depth.`
    );
    recommendations.push('Add more examples, practice questions, or concept explanations');
  } else if (slideCount >= 8 && slideCount <= 15) {
    recommendations.push(`✓ Optimal slide count (${slideCount}) - well-structured lesson`);
  }

  // Overall validation
  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    slideCount,
    recommendations,
  };
}

/**
 * Calculate estimated number of carousel slides
 */
function calculateSlideCount(lesson: LessonContent): number {
  let count = 0;

  // Objectives slide
  if (lesson.objectives && lesson.objectives.length > 0) {
    count += 1;
  }

  // Content slides (support both keyConcepts and content)
  const contentSections = lesson.keyConcepts || lesson.content || [];
  count += contentSections.length;

  // Summary slide
  if (lesson.summary) {
    count += 1;
  }

  // Past question slides (one per question)
  if (lesson.pastQuestions) {
    count += lesson.pastQuestions.length;
  }

  // Activity slides (one per activity)
  if (Array.isArray(lesson.activities)) {
    count += lesson.activities.length;
  } else if (lesson.activities) {
    count += 1; // Single activity object
  }

  // Quiz slide
  const quizQuestions = lesson.quiz?.questions || lesson.endOfLessonQuiz || [];
  if (quizQuestions.length > 0) {
    count += 1;
  }

  return count;
}

/**
 * Get detailed slide breakdown for analysis
 */
export function getSlideBreakdown(lesson: LessonContent) {
  return {
    objectives: lesson.objectives?.length || 0 > 0 ? 1 : 0,
    content: lesson.content?.length || 0,
    summary: lesson.summary ? 1 : 0,
    pastQuestions: lesson.pastQuestions?.length || 0,
    activities: lesson.activities?.length || 0,
    quiz: lesson.quiz?.questions?.length || 0 > 0 ? 1 : 0,
    total: calculateSlideCount(lesson),
  };
}

/**
 * Generate optimization suggestions based on validation
 */
export function getOptimizationSuggestions(
  validation: ValidationResult
): string[] {
  const suggestions: string[] = [];

  if (validation.slideCount > 20) {
    suggestions.push('🔨 Split lesson into multiple parts');
    suggestions.push('📝 Reduce content section text length');
    suggestions.push('🎯 Focus on core concepts, move advanced topics to separate lesson');
  }

  if (validation.slideCount < 5) {
    suggestions.push('➕ Add more worked examples');
    suggestions.push('📚 Include past examination questions');
    suggestions.push('🎮 Add interactive activities or practice problems');
  }

  if (validation.warnings.some((w) => w.includes('long text'))) {
    suggestions.push('✂️ Break long text sections into bite-sized chunks (300-500 chars)');
    suggestions.push('📊 Use bullet points instead of paragraphs where possible');
  }

  if (validation.warnings.some((w) => w.includes('No past questions'))) {
    suggestions.push('🎓 Add 2-3 WASSCE or BECE past questions');
  }

  return suggestions;
}
