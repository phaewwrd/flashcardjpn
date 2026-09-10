import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeLevel } from "@/lib/mastery";

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      words: {
        include: { progress: { where: { userId } } },
      },
    },
  });

  return (
    <div className="animate-fadeUp space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink mb-1">Categories</h1>
        <p className="text-muted text-sm">
          Work through each set of characters at your own pace.
        </p>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => {
          const total = cat.words.length;
          const mastered = cat.words.filter((w) => {
            const p = w.progress[0];
            return p && computeLevel(p.correctCount, p.incorrectCount) === 3;
          }).length;
          const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

          return (
            <Link
              key={cat.id}
              href={`/study/${cat.id}`}
              className="block rounded-xl border border-line bg-white p-4 hover:border-ink/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-medium text-ink truncate">{cat.name}</h2>
                  {cat.description && (
                    <p className="text-xs text-muted mt-0.5 line-clamp-1">
                      {cat.description}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-xs font-medium text-muted bg-line/70 rounded-full px-2.5 py-1">
                  {mastered}/{total}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-line overflow-hidden mt-3">
                <div
                  className="h-full bg-accent2 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
