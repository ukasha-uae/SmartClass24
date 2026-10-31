// Platform-neutral: no browser or React Native APIs. Web uses localStorage, mobile uses Firestore.
export interface FriendChallengePayload {
  id: string;
  level: 'primary' | 'jhs' | 'shs';
  subject: string;
  classLevel: string;
  questionIds: string[];
  seed: number;
  creatorId: string;
  creatorName: string;
  opponentId: string;
  opponentName: string;
  participantIds: string[];
  scores: Record<string, number>;
  createdAt: number;
}

export type NewChallengeInput = Omit<FriendChallengePayload, 'id' | 'scores' | 'participantIds' | 'createdAt'>;

export interface ChallengeRepository {
  create(input: NewChallengeInput): Promise<FriendChallengePayload>;
  get(id: string): Promise<FriendChallengePayload | null>;
  listForUser(userId: string): Promise<FriendChallengePayload[]>;
  submitResult(id: string, userId: string, score: number): Promise<FriendChallengePayload>;
}
