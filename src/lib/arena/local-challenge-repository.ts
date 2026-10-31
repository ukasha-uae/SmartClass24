import type { ChallengeRepository, FriendChallengePayload } from './challenge-repository';

const KEY = 'friendChallenges';

function readAll(): Record<string, FriendChallengePayload> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, FriendChallengePayload>) {
  localStorage.setItem(KEY, JSON.stringify(all));
}

export const localChallengeRepository: ChallengeRepository = {
  async create(input) {
    const challenge: FriendChallengePayload = {
      ...input,
      id: crypto.randomUUID(),
      participantIds: [input.creatorId, input.opponentId],
      scores: {},
      createdAt: Date.now(),
    };
    writeAll({ ...readAll(), [challenge.id]: challenge });
    return challenge;
  },

  async get(id) {
    return readAll()[id] ?? null;
  },

  async listForUser(userId) {
    return Object.values(readAll())
      .filter((c) => c.participantIds.includes(userId))
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  async submitResult(id, userId, score) {
    const all = readAll();
    const current = all[id];
    if (!current) throw new Error(`Challenge ${id} not found`);
    const updated = { ...current, scores: { ...current.scores, [userId]: score } };
    writeAll({ ...all, [id]: updated });
    return updated;
  },
};
