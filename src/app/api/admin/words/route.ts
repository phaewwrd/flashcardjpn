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

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const categoryId = req.nextUrl.searchParams.get("categoryId");

  const words = await prisma.word.findMany({
    where: categoryId ? { categoryId } : undefined,
    orderBy: [{ categoryId: "asc" }, { order: "asc" }],
    include: { category: { select: { name: true } } },
  });

  return NextResponse.json({ words });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const { kana, romaji, meaning, categoryId, order } = body ?? {};

  if (!kana || !romaji || !categoryId) {
    return NextResponse.json(
      { error: "kana, romaji, and categoryId are required" },
      { status: 400 }
    );
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const word = await prisma.word.create({
    data: {
      kana,
      romaji,
      meaning: meaning || null,
      categoryId,
      order: typeof order === "number" ? order : 0,
    },
  });

  return NextResponse.json({ word }, { status: 201 });
}
