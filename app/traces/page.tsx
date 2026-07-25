"use client";

import { TraceViewer } from "@/components/trace-viewer";
import { useTraces } from "@/lib/hooks";

export default function TracesPage() {
  const { data, loading } = useTraces();

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Traces</h1>
      {loading ? (
        <p className="text-gray-500">Loading traces...</p>
      ) : data.length > 0 ? (
        <TraceViewer trace={data[0]} />
      ) : (
        <p className="text-gray-500">No traces available.</p>
      )}
    </main>
  );
}
