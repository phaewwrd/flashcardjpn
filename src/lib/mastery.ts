// Mastery level thresholds, shared between the progress API and UI display.
// Level 0: New       - never answered correctly
// Level 1: Learning  - 1-2 correct answers
// Level 2: Familiar  - 3-5 correct answers
// Level 3: Mastered  - 6+ correct answers, low error rate

export const MASTERY_LABELS = ["New", "Learning", "Familiar", "Mastered"] as const;

export const MASTERY_COLORS = [
  "bg-line text-muted",
  "bg-amber-100 text-amber-800",
  "bg-blue-100 text-blue-800",
  "bg-emerald-100 text-emerald-800",
] as const;

export function computeLevel(correctCount: number, incorrectCount: number): number {
  const total = correctCount + incorrectCount;
  const accuracy = total > 0 ? correctCount / total : 0;

  if (correctCount >= 6 && accuracy >= 0.75) return 3;
  if (correctCount >= 3) return 2;
  if (correctCount >= 1) return 1;
  return 0;
}

export function nextProgressAfterAnswer(
  current: { correctCount: number; incorrectCount: number },
  wasCorrect: boolean
) {
  const correctCount = current.correctCount + (wasCorrect ? 1 : 0);
  const incorrectCount = current.incorrectCount + (wasCorrect ? 0 : 1);
  const level = computeLevel(correctCount, incorrectCount);
  return { correctCount, incorrectCount, level };
}
