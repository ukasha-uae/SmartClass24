// Mobile client for the web app's `challenges` collection, so both apps share one challenge system.
import { addDoc, collection, doc, onSnapshot, query, runTransaction, serverTimestamp, setDoc, where } from 'firebase/firestore';
import type { Challenge, GameQuestion, GameResult, PlayerAnswer } from '@shared/challenge-domain';
import { db } from './firebase';
import { type BankLevel, loadBank } from './question-loader';

export type { Challenge, GameQuestion, GameResult, PlayerAnswer };

const COLLECTION = 'challenges';
const QUESTION_COUNT = 10;
const TIME_LIMIT_SECONDS = 45;

const WEB_LEVEL = { primary: 'Primary', jhs: 'JHS', shs: 'SHS' } as const;

export type ChallengePhase =
  | 'invited' // I was invited and haven't answered yet
  | 'awaiting-accept' // I created it, friend hasn't accepted
  | 'declined'
  | 'your-turn'
  | 'waiting-friend' // I finished, friend hasn't
  | 'done';

export interface Person {
  id: string;
  name: string;
  school: string;
}

export interface ChallengeView {
  phase: ChallengePhase;
  other: Person;
  myResult?: GameResult;
  theirResult?: GameResult;
  won?: boolean;
}

// Bot, boss and school battles are resolved by the web client, so mobile only lists human 1v1s.
export const isHumanChallenge = (c: Challenge): boolean =>
  c.type !== 'boss' &&
  c.type !== 'school' &&
  c.type !== 'practice' &&
  c.opponents.length === 1 &&
  !/^(bot|ai|boss)-/.test(c.opponents[0].userId);

export function viewOf(c: Challenge, uid: string): ChallengeView {
  const iAmCreator = c.creatorId === uid;
  const opp = c.opponents[0];
  const other: Person = iAmCreator
    ? { id: opp.userId, name: opp.userName, school: opp.school }
    : { id: c.creatorId, name: c.creatorName, school: c.creatorSchool };
  const myResult = c.results?.find((r) => r.userId === uid);
  const theirResult = c.results?.find((r) => r.userId === other.id);
  const base = { other, myResult, theirResult };

  if (opp.status === 'declined' || c.status === 'expired') return { ...base, phase: 'declined' };
  if (c.status === 'completed') return { ...base, phase: 'done', won: c.winner === uid };
  if (!iAmCreator && opp.status === 'invited') return { ...base, phase: 'invited' };
  if (iAmCreator && opp.status === 'invited') return { ...base, phase: 'awaiting-accept' };
  if (!myResult) return { ...base, phase: 'your-turn' };
  return { ...base, phase: 'waiting-friend' };
}

const parse = (snap: { id: string; data(): unknown }) => ({ ...(snap.data() as object), id: snap.id }) as Challenge;

const createdAtMs = (c: Challenge) => {
  const t = Date.parse(c.createdAt);
  return Number.isNaN(t) ? 0 : t;
};

// Live updates so an invite or a result appears on this device without a push.
export function subscribeForUser(
  userId: string,
  onData: (challenges: Challenge[]) => void,
  onError?: (e: Error) => void,
): () => void {
  return onSnapshot(
    query(collection(db, COLLECTION), where('participantIds', 'array-contains', userId)),
    (snap) => onData(snap.docs.map(parse).filter(isHumanChallenge).sort((a, b) => createdAtMs(b) - createdAtMs(a))),
    onError,
  );
}

export function subscribeToChallenge(
  id: string,
  onData: (challenge: Challenge | null) => void,
  onError?: (e: Error) => void,
): () => void {
  return onSnapshot(doc(db, COLLECTION, id), (snap) => onData(snap.exists() ? parse(snap) : null), onError);
}

// Seeded shuffle so a retry of the same seed picks the same questions.
function pickIds(ids: string[], count: number, seed: number): string[] {
  let state = seed >>> 0 || 1;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
  const pool = [...ids].sort();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

// Mirrors the web's scoring: harder class levels are worth more points.
const pointsFor = (classLevel: string) => (classLevel.includes('3') ? 15 : classLevel.includes('2') ? 10 : 5);

async function notify(userId: string, payload: Record<string, unknown>): Promise<void> {
  try {
    await addDoc(collection(db, 'users', userId, 'notifications'), { ...payload, read: false, createdAt: serverTimestamp() });
  } catch {
    // In-app notice is best-effort; the push notification is sent by a Cloud Function.
  }
}

export interface NewChallengeInput {
  level: BankLevel;
  subject: string;
  classLevel: string;
  creator: Person;
  opponent: Person;
}

export async function createChallenge(input: NewChallengeInput): Promise<Challenge> {
  const { level, subject, classLevel, creator, opponent } = input;
  const bank = loadBank(level).filter((q) => q.subject === subject && q.classLevel === classLevel);
  const byId = new Map(bank.map((q) => [q.id, q]));
  const points = pointsFor(classLevel);
  const source = level === 'primary' ? 'practice' : level === 'jhs' ? 'bece' : 'wassce';

  const questions: GameQuestion[] = pickIds([...byId.keys()], QUESTION_COUNT, Math.floor(Math.random() * 2 ** 31)).map(
    (id) => {
      const q = byId.get(id)!;
      return {
        id: q.id,
        question: q.question,
        type: 'mcq',
        options: q.options,
        correctAnswer: q.options[q.correctAnswer],
        points,
        explanation: q.explanation ?? '',
        source,
      };
    },
  );
  if (questions.length === 0) throw new Error('No questions available for that subject and class level.');

  const id = `challenge-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  const challenge: Challenge = {
    id,
    type: 'quick',
    level: WEB_LEVEL[level],
    subject,
    difficulty: classLevel as Challenge['difficulty'],
    questionCount: questions.length,
    timeLimit: TIME_LIMIT_SECONDS,
    creatorId: creator.id,
    creatorName: creator.name,
    creatorSchool: creator.school,
    opponents: [{ userId: opponent.id, userName: opponent.name, school: opponent.school, status: 'invited' }],
    maxPlayers: 2,
    status: 'pending',
    questions,
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, COLLECTION, id), {
    ...challenge,
    participantIds: [creator.id, opponent.id],
    updatedAt: serverTimestamp(),
  });

  await notify(opponent.id, {
    type: 'challenge_invite',
    title: 'New Challenge Invitation',
    message: `${creator.name} from ${creator.school} has invited you to a ${subject} challenge on SmartClass24 (S24).`,
    data: { challengeId: id, creatorId: creator.id, from: creator.name, fromSchool: creator.school, subject },
    actionUrl: `/challenge-arena/play/${id}`,
  });
  return challenge;
}

export async function acceptChallenge(id: string, uid: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error('Challenge not found.');
    const c = snap.data() as Challenge;
    const opponents = c.opponents.map((o) =>
      o.userId === uid ? { ...o, status: 'accepted' as const, acceptedAt: new Date().toISOString() } : o,
    );
    const allAccepted = opponents.every((o) => o.status === 'accepted');
    tx.update(ref, {
      opponents,
      status: allAccepted && c.status === 'pending' ? 'accepted' : c.status,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function declineChallenge(c: Challenge, uid: string): Promise<void> {
  const ref = doc(db, COLLECTION, c.id);
  let declinerName = '';
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error('Challenge not found.');
    const fresh = snap.data() as Challenge;
    declinerName = fresh.opponents.find((o) => o.userId === uid)?.userName ?? '';
    tx.update(ref, {
      opponents: fresh.opponents.map((o) => (o.userId === uid ? { ...o, status: 'declined' as const } : o)),
      status: 'expired',
      updatedAt: serverTimestamp(),
    });
  });
  await notify(c.creatorId, {
    type: 'challenge_declined',
    title: 'Challenge Declined',
    message: `${declinerName} declined your challenge in ${c.subject}`,
    data: { challengeId: c.id, opponentName: declinerName, subject: c.subject },
    actionUrl: `/challenge-arena/play/${c.id}`,
  });
}

// Same outcome rules as the web: rank by score, then by fastest time; the challenge completes once the
// creator and the opponent have both finished. Time values are milliseconds, as on the web.
export async function submitAnswers(
  id: string,
  me: Person,
  answers: PlayerAnswer[],
  totalTimeMs: number,
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error('Challenge not found.');
    const c = snap.data() as Challenge;

    const score = answers.reduce((sum, a) => sum + a.points, 0);
    const correct = answers.filter((a) => a.isCorrect).length;
    const result: GameResult = {
      userId: me.id,
      userName: me.name,
      school: me.school,
      answers,
      score,
      correctAnswers: correct,
      totalTime: totalTimeMs,
      accuracy: answers.length ? (correct / answers.length) * 100 : 0,
      rank: 0,
      ratingChange: 0,
    };

    const results = [...(c.results ?? []).filter((r) => r.userId !== me.id), result];
    const opponents = c.opponents.map((o) =>
      o.userId === me.id ? { ...o, score, timeTaken: totalTimeMs, status: 'finished' as const } : o,
    );
    const allFinished =
      results.some((r) => r.userId === c.creatorId) && opponents.every((o) => o.status === 'finished');

    const update: Record<string, unknown> = { results, opponents, updatedAt: serverTimestamp() };
    if (allFinished) {
      results.sort((a, b) => b.score - a.score || a.totalTime - b.totalTime);
      results.forEach((r, i) => (r.rank = i + 1));
      update.status = 'completed';
      update.winner = results[0].userId;
      update.completedAt = new Date().toISOString();
    }
    tx.update(ref, update);
  });
}
