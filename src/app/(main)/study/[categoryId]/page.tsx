import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StudySession from "./StudySession";

export default async function StudyPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const category = await prisma.category.findUnique({
    where: { id: params.categoryId },
    include: {
      words: {
        orderBy: { order: "asc" },
        include: { progress: { where: { userId } } },
      },
    },
  });

  if (!category || category.words.length === 0) notFound();

  // Pull all romaji across all words to build multiple-choice distractors.
  const allWords = await prisma.word.findMany({
    select: { id: true, romaji: true, meaning: true, kana: true },
  });

  const cards = category.words.map((w) => ({
    id: w.id,
    kana: w.kana,
    romaji: w.romaji,
    meaning: w.meaning,
    correctCount: w.progress[0]?.correctCount ?? 0,
    incorrectCount: w.progress[0]?.incorrectCount ?? 0,
  }));

  return (
    <StudySession
      categoryId={category.id}
      categoryName={category.name}
      cards={cards}
      pool={allWords}
    />
  );
}
