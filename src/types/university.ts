/**
 * University Module Type Definitions
 * Scalable architecture for tech-focused and future academic programs
 */

// ============================================================================
// Core Types
// ============================================================================

export type DisciplineType = 'technology' | 'engineering' | 'business' | 'science' | 'arts' | 'health';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ProjectType = 'code' | 'essay' | 'presentation' | 'research' | 'design';
export type SubmissionStatus = 'not-started' | 'in-progress' | 'submitted' | 'graded' | 'revision-needed';

// Code execution environments
export type CodeEnvironment = 
  | 'html-css-js'      // Web development
  | 'react'            // React applications
  | 'vue'              // Vue applications
  | 'python'           // Python runtime
  | 'nodejs'           // Node.js backend
  | 'typescript'       // TypeScript
  | 'nextjs';          // Next.js applications

// ============================================================================
// University Program Structure
// ============================================================================

export interface UniversityProgram {
  id: string;
  slug: string;
  title: string;
  discipline: DisciplineType;
  description: string;
  duration: string; // e.g., "4 months", "1 year"
  difficulty: DifficultyLevel;
  prerequisites: string[];
  learningOutcomes: string[];
  courses: UniversityCourse[];
  certificate: {
    title: string;
    issuer: string;
    verifiable: boolean;
  };
  tags: string[];
  active: boolean;
}

export interface UniversityCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    title: string;
    bio?: string;
    avatar?: string;
  };
  duration: string; // e.g., "4 weeks"
  modules: CourseModule[];
  assessments: Assessment[];
  order: number;
  tags: string[];
}

export interface CourseModule {
  id: string;
  slug: string;
  title: string;
  description: string;
  lessons: Lesson[];
  projects: Project[];
  order: number;
  estimatedTime: string; // e.g., "2 hours"
}

// ============================================================================
// Lesson Structure (Theory + Practice)
// ============================================================================

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  type: 'theory' | 'practical' | 'hybrid';
  content: LessonContent;
  interactive?: InteractiveContent;
  checkpoints: Checkpoint[];
  resources: Resource[];
  order: number;
  estimatedTime: string;
}

export interface LessonContent {
  introduction: string;
  sections: ContentSection[];
  summary: string;
  keyTakeaways: string[];
}

export interface ContentSection {
  id: string;
  title: string;
  content: string; // Markdown or HTML
  codeExamples?: CodeExample[];
  visualAids?: VisualAid[];
  order: number;
}

export interface CodeExample {
  id: string;
  language: string;
  code: string;
  explanation: string;
  editable: boolean;
  showLineNumbers: boolean;
}

export interface VisualAid {
  type: 'image' | 'video' | 'diagram' | 'animation';
  url: string;
  caption?: string;
  alt: string;
}

export interface InteractiveContent {
  type: 'code-editor' | 'quiz' | 'simulation' | 'sandbox';
  config: CodeEditorConfig | QuizConfig | SimulationConfig;
}

// ============================================================================
// Code Editor Configuration (Core Feature)
// ============================================================================

export interface CodeEditorConfig {
  environment: CodeEnvironment;
  startingFiles: CodeFile[];
  instructions: string;
  hints?: string[];
  solution?: CodeFile[];
  validation?: ValidationRule[];
  allowFileCreation: boolean;
  allowInstallPackages: boolean;
  maxFileSize: number; // in KB
  timeout: number; // execution timeout in seconds
  restrictions?: {
    blockedAPIs?: string[]; // e.g., ['fs', 'child_process']
    maxMemory?: number; // in MB
    networkAccess?: boolean;
  };
}

export interface CodeFile {
  path: string; // e.g., "src/App.tsx", "index.html"
  content: string;
  language: string;
  readOnly?: boolean;
}

export interface ValidationRule {
  type: 'output' | 'code-pattern' | 'test-case' | 'visual';
  description: string;
  validate: string; // Function as string or regex pattern
  points: number;
}

// ============================================================================
// Project Structure (Main Assessment)
// ============================================================================

export interface Project {
  id: string;
  slug: string;
  title: string;
  type: ProjectType;
  description: string;
  requirements: ProjectRequirement[];
  rubric: GradingRubric;
  startingTemplate?: CodeEditorConfig;
  dueDate?: string; // ISO date string
  submissions?: ProjectSubmission[];
  order: number;
  points: number;
}

export interface ProjectRequirement {
  id: string;
  title: string;
  description: string;
  required: boolean;
  points: number;
  order: number;
}

export interface GradingRubric {
  criteria: RubricCriterion[];
  totalPoints: number;
  passingScore: number;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  levels: {
    score: number;
    description: string;
  }[];
}

// ============================================================================
// Submission & Progress Tracking
// ============================================================================

export interface ProjectSubmission {
  id: string;
  studentId: string;
  projectId: string;
  files: CodeFile[];
  submittedAt: string; // ISO date
  status: SubmissionStatus;
  grade?: {
    score: number;
    feedback: string;
    criteriaScores: { criterionId: string; score: number }[];
    gradedAt: string;
    gradedBy: string; // 'auto' or instructor ID
  };
  revisions: SubmissionRevision[];
}

export interface SubmissionRevision {
  id: string;
  submittedAt: string;
  files: CodeFile[];
  note?: string;
}

export interface StudentProgress {
  studentId: string;
  programId: string;
  courseId: string;
  completedLessons: string[]; // lesson IDs
  completedCheckpoints: string[]; // checkpoint IDs
  completedProjects: string[]; // project IDs
  currentModule: string; // module ID
  overallProgress: number; // 0-100
  lastAccessedAt: string;
  timeSpent: number; // in minutes
}

// ============================================================================
// Assessment Types
// ============================================================================

export interface Assessment {
  id: string;
  type: 'quiz' | 'exam' | 'practical' | 'peer-review';
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore: number;
  attempts: number; // -1 for unlimited
  order: number;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'code' | 'short-answer' | 'essay';
  question: string;
  options?: string[]; // for multiple-choice
  correctAnswer?: string | string[];
  codeConfig?: CodeEditorConfig;
  points: number;
  explanation?: string;
}

export interface QuizConfig {
  questions: Question[];
  timeLimit?: number;
  showCorrectAnswers: boolean;
  allowRetry: boolean;
}

export interface SimulationConfig {
  title: string;
  description: string;
  interactiveUrl: string; // URL to simulation
  completionCriteria: string;
}

// ============================================================================
// Checkpoints (Mini-assessments)
// ============================================================================

export interface Checkpoint {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'code-challenge' | 'reflection';
  content: Question | CodeEditorConfig | { prompt: string };
  required: boolean;
  order: number;
}

// ============================================================================
// Resources
// ============================================================================

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'documentation' | 'book' | 'tool' | 'cheatsheet';
  url?: string;
  content?: string;
  description?: string;
}

// ============================================================================
// Code Execution Results (Sandboxed)
// ============================================================================

export interface CodeExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  console: ConsoleMessage[];
  preview?: {
    html: string;
    assets: { [key: string]: string };
  };
  performanceMetrics?: {
    executionTime: number;
    memoryUsed: number;
  };
  validationResults?: {
    ruleId: string;
    passed: boolean;
    message: string;
    points: number;
  }[];
}

export interface ConsoleMessage {
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  timestamp: number;
}

// ============================================================================
// Security & Sandboxing
// ============================================================================

export interface SandboxConfig {
  allowedDomains: string[];
  allowedAPIs: string[];
  maxExecutionTime: number;
  maxMemory: number;
  enableNetwork: boolean;
  enableStorage: boolean;
  cspPolicy: string; // Content Security Policy
}

// ============================================================================
// User Roles & Permissions (Future)
// ============================================================================

export interface UniversityRole {
  role: 'student' | 'instructor' | 'ta' | 'admin';
  permissions: Permission[];
}

export type Permission = 
  | 'view-content'
  | 'submit-projects'
  | 'grade-submissions'
  | 'create-courses'
  | 'manage-students'
  | 'view-analytics';
