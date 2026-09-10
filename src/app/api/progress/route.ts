import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nextProgressAfterAnswer } from "@/lib/mastery";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const wordId: string | undefined = body?.wordId;
  const wasCorrect: boolean | undefined = body?.wasCorrect;

  if (!wordId || typeof wasCorrect !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const word = await prisma.word.findUnique({ where: { id: wordId } });
  if (!word) {
    return NextResponse.json({ error: "Word not found" }, { status: 404 });
  }

  const existing = await prisma.progress.findUnique({
    where: { userId_wordId: { userId: session.user.id, wordId } },
  });

  const next = nextProgressAfterAnswer(
    {
      correctCount: existing?.correctCount ?? 0,
      incorrectCount: existing?.incorrectCount ?? 0,
    },
    wasCorrect
  );

  const progress = await prisma.progress.upsert({
    where: { userId_wordId: { userId: session.user.id, wordId } },
    update: {
      correctCount: next.correctCount,
      incorrectCount: next.incorrectCount,
      level: next.level,
      lastSeenAt: new Date(),
    },
    create: {
      userId: session.user.id,
      wordId,
      correctCount: next.correctCount,
      incorrectCount: next.incorrectCount,
      level: next.level,
    },
  });

  return NextResponse.json({ progress });
}
