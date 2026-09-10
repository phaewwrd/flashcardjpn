import { prisma } from "@/lib/prisma";
import CategoriesManager from "./CategoriesManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { words: true } } },
  });

  const serializable = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    order: c.order,
    wordCount: c._count.words,
  }));

  return (
    <div className="animate-fadeUp">
      <h1 className="text-2xl font-semibold text-ink mb-6">Categories</h1>
      <CategoriesManager initialCategories={serializable} />
    </div>
  );
}
