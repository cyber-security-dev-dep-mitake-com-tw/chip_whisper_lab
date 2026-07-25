"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { TraceViewer } from "@/components/trace-viewer";

export default function TracesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["traces"],
    queryFn: api.getTraces,
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Traces</h1>
      {isLoading ? (
        <p className="text-gray-500">Loading traces...</p>
      ) : (
        <TraceViewer traces={data?.items ?? []} />
      )}
    </main>
  );
}