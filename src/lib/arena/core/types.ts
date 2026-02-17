/**
 * Arena Engine Core Types
 * Generic interfaces – no arena-specific logic (no cities, ropes, planes).
 */

/** Team identifier (LEFT or RIGHT for large-screen arenas) */
export type TeamId = 'left' | 'right';

/** Per-team state – engine only knows scores and advantage */
export interface TeamState {
  teamId: TeamId;
  score: number;
  advantage: number; // 0-100 or -100 to +100, depending on arena
  streak: number;
}

/** Full arena state – teams + current question + phase */
export interface ArenaState {
  phase: 'idle' | 'question' | 'answer' | 'scoring' | 'win' | 'end';
  teams: Record<TeamId, TeamState>;
  currentQuestionIndex: number;
  currentQuestion: ArenaQuestion | null;
  totalQuestions: number;
  winner: TeamId | null;
  events: ArenaEvent[];
}

/** Minimal question format – engine validates answers generically */
export interface ArenaQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'truefalse' | 'number_input';
  options?: string[];
  correctAnswer: string | number | boolean;
  correctAnswers?: string[];
  points: number;
}

/** Answer payload from on-screen keyboard or input system */
export interface AnswerPayload {
  teamId: TeamId;
  answer: string | number | boolean;
  timeTakenMs: number;
}

/** Score calculation result */
export interface ScoreResult {
  isCorrect: boolean;
  deltaScore: number;
  deltaAdvantage: number;
  streakMultiplier: number;
  timeBonus: number;
}

/** Arena configuration – win conditions, difficulty, comeback assist */
export interface ArenaConfig {
  id: string;
  name: string;
  winCondition: {
    type: 'first_to' | 'highest_at_end' | 'time_limit';
    value: number; // e.g. 100 for first_to 100%
  };
  maxQuestions?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  comebackAssist: boolean;
  basePointsPerCorrect: number;
  speedBonusMaxMs: number;
  streakBonusThreshold: number;
}

/** Internal event for replay/debug */
export interface ArenaEvent {
  type: 'question_displayed' | 'answer_submitted' | 'score_calculated' | 'win' | 'phase_change';
  teamId?: TeamId;
  payload?: Record<string, unknown>;
  timestamp: number;
}

/** Outcome when arena ends */
export interface ArenaOutcome {
  winner: TeamId | null;
  finalScores: Record<TeamId, number>;
  totalQuestions: number;
  events: ArenaEvent[];
}

/** Arena module – pluggable via registry */
export interface ArenaModule {
  id: string;
  name: string;
  config: ArenaConfig;
  /** Map engine advantage (0-100 per team) to renderer input */
  getVisualState: (state: ArenaState) => Record<string, number>;
  /** Check win from current state */
  checkWin: (state: ArenaState) => TeamId | null;
}
