"use client";

import { useEffect, useState } from "react";
import { useContextValue } from "@/context/Context";
import { useRouter } from "next/navigation";

export default function PresentationList() {
  const router = useRouter();
  const {
    presentations,
    fetchPresentations,
    deletePresentation,
    duplicatePresentation,
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useContextValue() as any;

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPresentations();
  }, [page, searchQuery]);

  const loadPresentations = async () => {
    try {
      setLoading(true);
      const params: { page: number; limit: number; search?: string } = { page, limit: 10 };
      if (searchQuery) params.search = searchQuery;

      const data = await fetchPresentations(params);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load presentations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this presentation?")) return;
    try {
      await deletePresentation(id);
      alert("Presentation deleted successfully");
    } catch {
      alert("Failed to delete presentation");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const duplicated = await duplicatePresentation(id);
      alert("Presentation duplicated successfully");
      router.push(`/dashboard/canvas/${duplicated.id}`);
    } catch {
      alert("Failed to duplicate presentation");
    }
  };

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setPage(1);
    loadPresentations();
  };

  if (loading) {
    return <div className="p-6 sm:p-8 text-center text-gray-500">Loading presentations...</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">My Presentations</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2.5 rounded"
          style={{ backgroundColor: "oklch(0.65 0.25 330)", color: "#fff" }}
        >
          + New Presentation
        </button>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          placeholder="Search presentations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </form>

      {presentations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No presentations found. Create your first one!
        </div>
      ) : (
        <div className="space-y-4">
          {presentations.map((presentation: { id: string; title: string; description: string; updatedAt: string | number | Date }) => (
            <div
              key={presentation.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => router.push(`/dashboard/canvas/${presentation.id}`)}
              >
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 truncate">
                  {presentation.title}
                </h3>
                {presentation.description && (
                  <p className="text-gray-600 text-sm sm:text-base truncate">
                    {presentation.description}
                  </p>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Updated: {new Date(presentation.updatedAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDuplicate(presentation.id); }}
                  className="px-4 py-2.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition text-sm"
                >
                  Clone
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(presentation.id); }}
                  className="px-4 py-2.5 border border-red-300 rounded text-red-600 hover:bg-red-50 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2.5 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2.5 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2.5 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
