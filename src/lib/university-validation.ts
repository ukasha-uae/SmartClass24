/**
 * Automated grading for S24 Innovation Academy code-editor checkpoints.
 * Runs ValidationRule definitions from lesson/project data against submitted code and console output.
 */

import { CodeFile, ValidationRule, ConsoleMessage } from '@/types/university';

export interface ValidationOutcome {
  ruleId: string;
  passed: boolean;
  message: string;
  points: number;
  maxPoints: number;
}

export function runValidationRules(
  rules: ValidationRule[] | undefined,
  files: CodeFile[],
  consoleMessages: ConsoleMessage[] = []
): ValidationOutcome[] {
  if (!rules || rules.length === 0) return [];

  const combinedCode = files.map(f => f.content).join('\n');
  const consoleText = consoleMessages.map(m => m.message).join('\n');

  return rules.map((rule, idx) => {
    const ruleId = `rule-${idx}`;
    const passed = evaluateRule(rule, combinedCode, consoleText);
    return {
      ruleId,
      passed,
      message: rule.description,
      points: passed ? rule.points : 0,
      maxPoints: rule.points,
    };
  });
}

function evaluateRule(rule: ValidationRule, combinedCode: string, consoleText: string): boolean {
  switch (rule.type) {
    case 'code-pattern':
      return rule.validate ? safeRegexTest(rule.validate, combinedCode) : false;
    case 'word-count': {
      const text = combinedCode.replace(/<[^>]*>/g, ' ').replace(/[{}();]/g, ' ');
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      return wordCount >= (rule.minWords ?? 0);
    }
    case 'output':
    case 'test-case':
      return rule.validate ? safeRegexTest(rule.validate, consoleText) : false;
    case 'visual':
    default:
      // Requires human/instructor review; cannot be verified automatically.
      return false;
  }
}

function safeRegexTest(pattern: string, text: string): boolean {
  try {
    return new RegExp(pattern, 'i').test(text);
  } catch {
    return text.includes(pattern);
  }
}
