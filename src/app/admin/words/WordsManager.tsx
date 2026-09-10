"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Word = {
  id: string;
  kana: string;
  romaji: string;
  meaning: string | null;
  categoryId: string;
  categoryName: string;
  order: number;
};

type Category = { id: string; name: string };

export default function WordsManager({
  initialWords,
  categories,
}: {
  initialWords: Word[];
  categories: Category[];
}) {
  const router = useRouter();
  const [words, setWords] = useState(initialWords);
  const [filter, setFilter] = useState<string>("all");

  const [kana, setKana] = useState("");
  const [romaji, setRomaji] = useState("");
  const [meaning, setMeaning] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredWords = useMemo(
    () => (filter === "all" ? words : words.filter((w) => w.categoryId === filter)),
    [words, filter]
  );

  function resetForm() {
    setKana("");
    setRomaji("");
    setMeaning("");
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!kana.trim() || !romaji.trim() || !categoryId) {
      setError("Kana, romaji, and category are required");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/words/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kana, romaji, meaning, categoryId }),
        });
        if (!res.ok) throw new Error((await res.json()).error || "Failed to update");
        const { word } = await res.json();
        const catName = categories.find((c) => c.id === categoryId)?.name ?? "";
        setWords((prev) =>
          prev.map((w) => (w.id === editingId ? { ...w, ...word, categoryName: catName } : w))
        );
      } else {
        const res = await fetch("/api/admin/words", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kana, romaji, meaning, categoryId }),
        });
        if (!res.ok) throw new Error((await res.json()).error || "Failed to create");
        const { word } = await res.json();
        const catName = categories.find((c) => c.id === categoryId)?.name ?? "";
        setWords((prev) => [...prev, { ...word, categoryName: catName }]);
      }
      resetForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(w: Word) {
    setEditingId(w.id);
    setKana(w.kana);
    setRomaji(w.romaji);
    setMeaning(w.meaning ?? "");
    setCategoryId(w.categoryId);
    setError(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this word?")) return;
    const res = await fetch(`/api/admin/words/${id}`, { method: "DELETE" });
    if (res.ok) {
      setWords((prev) => prev.filter((w) => w.id !== id));
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
          {editingId ? "Edit word" : "Add new word"}
        </h2>
        {error && <p className="text-sm text-accent">{error}</p>}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted block mb-1">Kana</label>
            <input
              value={kana}
              onChange={(e) => setKana(e.target.value)}
              placeholder="あ"
              className="w-full rounded-lg border border-line px-3 py-2 text-lg font-jp focus:outline-none focus:border-ink/40"
            />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Romaji</label>
            <input
              value={romaji}
              onChange={(e) => setRomaji(e.target.value)}
              placeholder="a"
              className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:border-ink/40"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted block mb-1">Meaning (optional)</label>
          <input
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            placeholder="Leave blank for pure kana sounds"
            className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:border-ink/40"
          />
        </div>

        <div>
          <label className="text-xs text-muted block mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:border-ink/40"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {editingId ? "Save changes" : "Add word"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-lg border border-line text-sm font-medium text-ink"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
            All words ({filteredWords.length})
          </h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs rounded-lg border border-line px-2 py-1.5 focus:outline-none"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          {filteredWords.map((w) => (
            <div
              key={w.id}
              className="flex items-center justify-between rounded-xl border border-line bg-white p-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl font-jp w-10 text-center shrink-0">{w.kana}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">
                    {w.romaji}
                    {w.meaning && <span className="text-muted"> · {w.meaning}</span>}
                  </p>
                  <p className="text-xs text-muted truncate">{w.categoryName}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(w)}
                  className="text-xs font-medium text-muted hover:text-ink px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(w.id)}
                  className="text-xs font-medium text-accent hover:opacity-70 px-2 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
