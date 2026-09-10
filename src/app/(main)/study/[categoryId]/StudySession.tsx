"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { nextProgressAfterAnswer, computeLevel } from "@/lib/mastery";

type Card = {
  id: string;
  kana: string;
  romaji: string;
  meaning: string | null;
  correctCount: number;
  incorrectCount: number;
};

type PoolWord = { id: string; kana: string; romaji: string; meaning: string | null };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildChoices(correct: Card, pool: PoolWord[], useMeaning: boolean): string[] {
  const correctAnswer = useMeaning && correct.meaning ? correct.meaning : correct.romaji;
  const distractorSource = pool.filter((w) => {
    const val = useMeaning && w.meaning ? w.meaning : w.romaji;
    return val !== correctAnswer && w.id !== correct.id;
  });
  const shuffledPool = shuffle(distractorSource);
  const distractors: string[] = [];
  const seen = new Set([correctAnswer]);
  for (const w of shuffledPool) {
    const val = useMeaning && w.meaning ? w.meaning : w.romaji;
    if (!seen.has(val)) {
      seen.add(val);
      distractors.push(val);
    }
    if (distractors.length === 3) break;
  }
  return shuffle([correctAnswer, ...distractors]);
}

export default function StudySession({
  categoryId,
  categoryName,
  cards: initialCards,
  pool,
}: {
  categoryId: string;
  categoryName: string;
  cards: Card[];
  pool: PoolWord[];
}) {
  const [queue, setQueue] = useState<Card[]>(() => shuffle(initialCards));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const current = queue[index];
  const hasMeaning = current && !!current.meaning;

  const choices = useMemo(() => {
    if (!current) return [];
    return buildChoices(current, pool, hasMeaning);
  }, [current, pool, hasMeaning]);

  const correctAnswer = current ? (hasMeaning ? current.meaning! : current.romaji) : "";

  async function handleAnswer(choice: string) {
    if (selected || !current) return;
    setSelected(choice);
    const wasCorrect = choice === correctAnswer;
    setSessionTotal((t) => t + 1);
    if (wasCorrect) setSessionCorrect((c) => c + 1);

    setSaving(true);
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordId: current.id, wasCorrect }),
      });
    } catch {
      // Non-fatal: progress save failure shouldn't block the quiz
    } finally {
      setSaving(false);
    }
  }

  function handleNext() {
    setSelected(null);
    if (index + 1 < queue.length) {
      setIndex((i) => i + 1);
    } else {
      setDone(true);
    }
  }

  function handleRestart() {
    setQueue(shuffle(initialCards));
    setIndex(0);
    setSelected(null);
    setSessionCorrect(0);
    setSessionTotal(0);
    setDone(false);
  }

  if (done) {
    const pct = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;
    return (
      <div className="animate-fadeUp max-w-md mx-auto text-center py-16">
        <div className="text-5xl mb-4">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "🌱"}</div>
        <h1 className="text-2xl font-semibold text-ink mb-2">Session complete</h1>
        <p className="text-muted mb-8">
          You got {sessionCorrect} of {sessionTotal} correct ({pct}%).
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRestart}
            className="px-5 py-2.5 rounded-xl bg-ink text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Study again
          </button>
          <Link
            href="/categories"
            className="px-5 py-2.5 rounded-xl border border-line text-sm font-medium text-ink hover:border-ink/30 transition-colors"
          >
            All categories
          </Link>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const level = computeLevel(current.correctCount, current.incorrectCount);

  return (
    <div className="animate-fadeUp max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link href="/categories" className="text-sm text-muted hover:text-ink">
          ← {categoryName}
        </Link>
        <span className="text-xs text-muted font-medium">
          {index + 1} / {queue.length}
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-line overflow-hidden mb-8">
        <div
          className="h-full bg-accent2 rounded-full transition-all"
          style={{ width: `${((index) / queue.length) * 100}%` }}
        />
      </div>

      <div className="rounded-2xl border border-line bg-white p-10 flex flex-col items-center justify-center mb-6 min-h-[220px]">
        <span className="text-7xl font-jp text-ink mb-2">{current.kana}</span>
        {level > 0 && (
          <span className="text-xs text-muted mt-2">
            Seen {current.correctCount + current.incorrectCount}x
          </span>
        )}
      </div>

      <p className="text-sm text-muted text-center mb-4">
        {hasMeaning ? "What does this mean?" : "What is the romaji?"}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {choices.map((choice) => {
          const isSelected = selected === choice;
          const isCorrectChoice = choice === correctAnswer;
          let style = "border-line bg-white text-ink hover:border-ink/30";
          if (selected) {
            if (isCorrectChoice) {
              style = "border-accent2 bg-emerald-50 text-accent2";
            } else if (isSelected) {
              style = "border-accent bg-red-50 text-accent";
            } else {
              style = "border-line bg-white text-muted opacity-50";
            }
          }
          return (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              disabled={!!selected}
              className={`rounded-xl border-2 px-4 py-4 text-sm font-medium transition-all ${style}`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {selected && (
        <button
          onClick={handleNext}
          disabled={saving}
          className="w-full mt-6 py-3 rounded-xl bg-ink text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {index + 1 < queue.length ? "Next →" : "Finish"}
        </button>
      )}
    </div>
  );
}
