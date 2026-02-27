const MOJIBAKE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/âˆš/g, '√'],
  [/Â±/g, '±'],
  [/Î”/g, 'Δ'],
  [/Î±/g, 'α'],
  [/Î²/g, 'β'],
  [/Ã—/g, '×'],
  [/â‰¥/g, '≥'],
  [/â‰¤/g, '≤'],
  [/â‰ /g, '≠'],
  [/Â²/g, '²'],
];

export function normalizeMathText(input: string): string {
  return MOJIBAKE_REPLACEMENTS.reduce((text, [pattern, replacement]) => {
    return text.replace(pattern, replacement);
  }, input);
}
