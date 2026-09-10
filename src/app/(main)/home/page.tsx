import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeLevel } from "@/lib/mastery";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      words: {
        include: {
          progress: { where: { userId } },
        },
      },
    },
  });

  let totalWords = 0;
  let masteredWords = 0;

  const categoryStats = categories.map((cat) => {
    const total = cat.words.length;
    let mastered = 0;
    let started = 0;
    for (const w of cat.words) {
      const p = w.progress[0];
      if (p) {
        started++;
        const level = computeLevel(p.correctCount, p.incorrectCount);
        if (level === 3) mastered++;
      }
    }
    totalWords += total;
    masteredWords += mastered;
    return { ...cat, total, mastered, started };
  });

  const nextUp =
    categoryStats.find((c) => c.mastered < c.total) ?? categoryStats[0];

  const overallPct = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;

  return (
    <div className="animate-fadeUp space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink mb-1">
          おかえりなさい, {session!.user.name?.split(" ")[0]}
        </h1>
        <p className="text-muted text-sm">Welcome back. Let&apos;s keep learning.</p>
      </div>

      <div className="rounded-2xl border border-line bg-white p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-muted">Overall mastery</span>
          <span className="text-sm font-semibold text-ink">{overallPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-line overflow-hidden">
          <div
            className="h-full bg-accent2 rounded-full transition-all"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <p className="text-xs text-muted mt-3">
          {masteredWords} of {totalWords} characters mastered
        </p>
      </div>

      {nextUp && (
        <Link
          href={`/study/${nextUp.id}`}
          className="block rounded-2xl border border-ink bg-ink text-white p-6 hover:opacity-90 transition-opacity"
        >
          <p className="text-xs uppercase tracking-wide text-white/60 mb-1">
            Continue learning
          </p>
          <h2 className="text-lg font-semibold mb-1">{nextUp.name}</h2>
          <p className="text-sm text-white/70">
            {nextUp.mastered} / {nextUp.total} mastered — tap to study →
          </p>
        </Link>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
            All categories
          </h2>
          <Link href="/categories" className="text-sm text-accent font-medium">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categoryStats.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              href={`/study/${cat.id}`}
              className="rounded-xl border border-line bg-white p-4 hover:border-ink/30 transition-colors"
            >
              <p className="text-sm font-medium text-ink truncate">{cat.name}</p>
              <p className="text-xs text-muted mt-1">
                {cat.mastered}/{cat.total} mastered
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
