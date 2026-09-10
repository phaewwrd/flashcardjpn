import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (!session.user.isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { session };
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const { kana, romaji, meaning, categoryId, order } = body ?? {};

  const word = await prisma.word.update({
    where: { id: params.id },
    data: {
      ...(kana !== undefined && { kana }),
      ...(romaji !== undefined && { romaji }),
      ...(meaning !== undefined && { meaning }),
      ...(categoryId !== undefined && { categoryId }),
      ...(order !== undefined && { order }),
    },
  });

  return NextResponse.json({ word });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  await prisma.word.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
