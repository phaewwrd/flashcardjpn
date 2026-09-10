import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminHomePage() {
  const [categoryCount, wordCount, userCount] = await Promise.all([
    prisma.category.count(),
    prisma.word.count(),
    prisma.user.count(),
  ]);

  return (
    <div className="animate-fadeUp space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Admin</h1>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-line bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-ink">{categoryCount}</p>
          <p className="text-xs text-muted mt-1">Categories</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-ink">{wordCount}</p>
          <p className="text-xs text-muted mt-1">Words</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-ink">{userCount}</p>
          <p className="text-xs text-muted mt-1">Learners</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/admin/categories"
          className="rounded-xl border border-line bg-white p-5 hover:border-ink/30 transition-colors"
        >
          <p className="font-medium text-ink mb-1">Manage categories</p>
          <p className="text-xs text-muted">Add, edit, or reorder categories</p>
        </Link>
        <Link
          href="/admin/words"
          className="rounded-xl border border-line bg-white p-5 hover:border-ink/30 transition-colors"
        >
          <p className="font-medium text-ink mb-1">Manage words</p>
          <p className="text-xs text-muted">Add new kana, romaji, and meanings</p>
        </Link>
      </div>
    </div>
  );
}
