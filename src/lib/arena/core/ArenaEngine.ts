/**
 * Arena Engine – generic flow, arena-agnostic
 * Flow: Question Display → Player Input → Answer Validation → Score → Advantage → Visual → Win Check
 */

import type {
  ArenaState,
  ArenaQuestion,
  AnswerPayload,
  ArenaEvent,
  ArenaConfig,
  TeamId,
} from './types';
import { createInitialArenaState } from './ArenaState';
import { calculateScore } from './ScoringEngine';
import type { ArenaModule } from './types';

export interface ArenaEngineOptions {
  questions: ArenaQuestion[];
  arenaModule: ArenaModule;
  onStateChange?: (state: ArenaState) => void;
}

export class ArenaEngine {
  private state: ArenaState;
  private readonly questions: ArenaQuestion[];
  private readonly arenaModule: ArenaModule;
  private readonly onStateChange?: (state: ArenaState) => void;

  constructor(options: ArenaEngineOptions) {
    this.questions = options.questions;
    this.arenaModule = options.arenaModule;
    this.onStateChange = options.onStateChange;
    this.state = createInitialArenaState(options.questions);
    this.emitEvent({ type: 'phase_change', payload: { phase: 'question' }, timestamp: Date.now() });
    this.notify();
  }

  getState(): ArenaState {
    return { ...this.state };
  }

  /** Get abstract visual state for the current arena's renderer */
  getVisualState(): Record<string, number> {
    return this.arenaModule.getVisualState(this.state);
  }

  /** Submit answer for a team */
  submitAnswer(payload: AnswerPayload): void {
    if (this.state.phase !== 'question' || !this.state.currentQuestion) return;

    const team = this.state.teams[payload.teamId];
    const result = calculateScore(
      this.state.currentQuestion,
      payload,
      team.streak,
      {
        basePointsPerCorrect: this.arenaModule.config.basePointsPerCorrect,
        speedBonusMaxMs: this.arenaModule.config.speedBonusMaxMs,
        streakBonusThreshold: this.arenaModule.config.streakBonusThreshold,
        comebackAssist: this.arenaModule.config.comebackAssist,
      }
    );

    const newStreak = result.isCorrect ? team.streak + 1 : 0;
    const newScore = Math.max(0, team.score + result.deltaScore);
    const newAdvantage = Math.max(0, Math.min(100, team.advantage + result.deltaAdvantage));

    this.state.teams[payload.teamId] = {
      ...team,
      score: newScore,
      advantage: newAdvantage,
      streak: newStreak,
    };

    this.emitEvent({
      type: 'answer_submitted',
      teamId: payload.teamId,
      payload: { result, questionId: this.state.currentQuestion.id },
      timestamp: Date.now(),
    });

    this.state.phase = 'scoring';
    this.notify();

    // After scoring, advance to next question or check win
    this.advanceQuestion();
  }

  private advanceQuestion(): void {
    const winner = this.arenaModule.checkWin(this.state);
    if (winner) {
      this.state.winner = winner;
      this.state.phase = 'win';
      this.emitEvent({ type: 'win', teamId: winner, timestamp: Date.now() });
      this.notify();
      return;
    }

    const nextIndex = this.state.currentQuestionIndex + 1;
    if (nextIndex >= this.questions.length) {
      this.state.phase = 'end';
      this.state.winner = this.arenaModule.checkWin(this.state);
      this.emitEvent({ type: 'phase_change', payload: { phase: 'end' }, timestamp: Date.now() });
      this.notify();
      return;
    }

    this.state.currentQuestionIndex = nextIndex;
    this.state.currentQuestion = this.questions[nextIndex];
    this.state.phase = 'question';
    this.emitEvent({
      type: 'question_displayed',
      payload: { questionId: this.state.currentQuestion?.id },
      timestamp: Date.now(),
    });
    this.notify();
  }

  /** Start / reset arena */
  start(): void {
    this.state = createInitialArenaState(this.questions);
    this.state.phase = this.questions.length > 0 ? 'question' : 'idle';
    this.emitEvent({ type: 'phase_change', payload: { phase: 'question' }, timestamp: Date.now() });
    this.notify();
  }

  private emitEvent(event: ArenaEvent): void {
    this.state.events = [...this.state.events.slice(-99), event];
  }

  private notify(): void {
    this.onStateChange?.(this.getState());
  }
}
