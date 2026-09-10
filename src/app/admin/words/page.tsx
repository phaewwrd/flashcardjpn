import { prisma } from "@/lib/prisma";
import WordsManager from "./WordsManager";

export default async function AdminWordsPage() {
  const [words, categories] = await Promise.all([
    prisma.word.findMany({
      orderBy: [{ categoryId: "asc" }, { order: "asc" }],
      include: { category: { select: { name: true } } },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  const serializableWords = words.map((w) => ({
    id: w.id,
    kana: w.kana,
    romaji: w.romaji,
    meaning: w.meaning,
    categoryId: w.categoryId,
    categoryName: w.category.name,
    order: w.order,
  }));

  const serializableCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  return (
    <div className="animate-fadeUp">
      <h1 className="text-2xl font-semibold text-ink mb-6">Words</h1>
      <WordsManager initialWords={serializableWords} categories={serializableCategories} />
    </div>
  );
}
