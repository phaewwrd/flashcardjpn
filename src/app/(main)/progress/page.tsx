import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeLevel, MASTERY_LABELS, MASTERY_COLORS } from "@/lib/mastery";

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      words: {
        orderBy: { order: "asc" },
        include: { progress: { where: { userId } } },
      },
    },
  });

  let totalMastered = 0;
  let totalWords = 0;
  const levelCounts = [0, 0, 0, 0];

  for (const cat of categories) {
    for (const w of cat.words) {
      totalWords++;
      const p = w.progress[0];
      const level = p ? computeLevel(p.correctCount, p.incorrectCount) : 0;
      levelCounts[level]++;
      if (level === 3) totalMastered++;
    }
  }

  return (
    <div className="animate-fadeUp space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink mb-1">Your progress</h1>
        <p className="text-muted text-sm">
          {totalMastered} of {totalWords} characters mastered overall.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {MASTERY_LABELS.map((label, i) => (
          <div
            key={label}
            className="rounded-xl border border-line bg-white p-3 text-center"
          >
            <p className="text-xl font-semibold text-ink">{levelCounts[i]}</p>
            <p className={`text-[11px] mt-1 inline-block px-2 py-0.5 rounded-full ${MASTERY_COLORS[i]}`}>
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        {categories.map((cat) => {
          const total = cat.words.length;
          const mastered = cat.words.filter((w) => {
            const p = w.progress[0];
            return p && computeLevel(p.correctCount, p.incorrectCount) === 3;
          }).length;
          const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

          return (
            <div key={cat.id} className="rounded-xl border border-line bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-medium text-ink text-sm">{cat.name}</h2>
                <span className="text-xs text-muted">{mastered}/{total}</span>
              </div>
              <div className="h-1.5 rounded-full bg-line overflow-hidden mb-3">
                <div className="h-full bg-accent2 rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.words.map((w) => {
                  const p = w.progress[0];
                  const level = p ? computeLevel(p.correctCount, p.incorrectCount) : 0;
                  return (
                    <span
                      key={w.id}
                      title={`${w.romaji} — ${MASTERY_LABELS[level]}`}
                      className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-jp ${MASTERY_COLORS[level]}`}
                    >
                      {w.kana}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
