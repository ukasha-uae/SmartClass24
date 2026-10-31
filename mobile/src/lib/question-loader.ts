export type BankLevel = 'primary' | 'jhs' | 'shs';

export interface BankQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  classLevel: string;
  explanation?: string;
}

const cache = new Map<BankLevel, BankQuestion[]>();

// Static requires so Metro bundles the assets; each file is only evaluated on first use.
export function loadBank(level: BankLevel): BankQuestion[] {
  const hit = cache.get(level);
  if (hit) return hit;
  const data: BankQuestion[] =
    level === 'primary'
      ? require('../../assets/questions/primary.json')
      : level === 'jhs'
        ? require('../../assets/questions/jhs.json')
        : require('../../assets/questions/shs.json');
  cache.set(level, data);
  return data;
}

export function getQuestionsByIds(level: BankLevel, ids: string[]): BankQuestion[] {
  const byId = new Map(loadBank(level).map((q) => [q.id, q]));
  return ids.flatMap((id) => byId.get(id) ?? []);
}
