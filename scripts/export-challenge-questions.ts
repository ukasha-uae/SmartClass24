// Dumps the web question bank to JSON for the mobile app: `npx tsx scripts/export-challenge-questions.ts`
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  getAvailableSubjects,
  getChallengeQuestions,
  type ChallengeQuestion,
  type ClassLevel,
  type EducationLevel,
} from '../src/lib/challenge-questions';

const CLASS_LEVELS: Record<EducationLevel, ClassLevel[]> = {
  Primary: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
  JHS: ['JHS 1', 'JHS 2', 'JHS 3'],
  SHS: ['SHS 1', 'SHS 2', 'SHS 3'],
};

const outDir = join(__dirname, '..', 'mobile', 'assets', 'questions');
mkdirSync(outDir, { recursive: true });

for (const level of Object.keys(CLASS_LEVELS) as EducationLevel[]) {
  const byId = new Map<string, ChallengeQuestion>();
  for (const subject of getAvailableSubjects(level)) {
    for (const classLevel of CLASS_LEVELS[level]) {
      for (const q of getChallengeQuestions(level, subject, classLevel, 10000)) {
        if (!byId.has(q.id)) byId.set(q.id, { ...q, classLevel });
      }
    }
  }
  writeFileSync(join(outDir, `${level.toLowerCase()}.json`), JSON.stringify([...byId.values()]));
  console.log(`${level}: ${byId.size} questions`);
}
