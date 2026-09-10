"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  wordCount: number;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoriesManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(categories.length + 1);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/categories/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description, order }),
        });
        if (!res.ok) throw new Error((await res.json()).error || "Failed to update");
        const { category } = await res.json();
        setCategories((prev) =>
          prev.map((c) => (c.id === editingId ? { ...c, ...category } : c))
        );
      } else {
        const slug = slugify(name);
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, slug, description, order }),
        });
        if (!res.ok) throw new Error((await res.json()).error || "Failed to create");
        const { category } = await res.json();
        setCategories((prev) => [...prev, { ...category, wordCount: 0 }]);
      }
      setName("");
      setDescription("");
      setOrder(categories.length + 2);
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description ?? "");
    setOrder(cat.order);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setDescription("");
    setOrder(categories.length + 1);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category and all its words? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-line bg-white p-5 space-y-3"
      >
        <h2 className="text-sm font-semibold text-ink mb-1">
          {editingId ? "Edit category" : "Add new category"}
        </h2>
        {error && <p className="text-sm text-accent">{error}</p>}
        <div>
          <label className="text-xs text-muted block mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. K-Row (ka, ki, ku, ke, ko)"
            className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:border-ink/40"
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Description (optional)</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description shown on the category list"
            className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:border-ink/40"
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-24 rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:border-ink/40"
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {editingId ? "Save changes" : "Add category"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 rounded-lg border border-line text-sm font-medium text-ink"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {categories
          .sort((a, b) => a.order - b.order)
          .map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-xl border border-line bg-white p-4"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink text-sm truncate">
                  {cat.order}. {cat.name}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {cat.wordCount} words · {cat.slug}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(cat)}
                  className="text-xs font-medium text-muted hover:text-ink px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-xs font-medium text-accent hover:opacity-70 px-2 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
