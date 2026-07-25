"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useParams } from "next/navigation";

export default function TraceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: trace, isLoading } = useQuery({
    queryKey: ["trace", id],
    queryFn: () => api.getTrace(id),
  });

  if (isLoading) return <p className="text-gray-500 p-6">Loading...</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Trace Viewer</h1>
      {trace && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-300">Set: {trace.traceSetName}</p>
          <p className="text-gray-300">Traces: {trace.numTraces}</p>
          <p className="text-gray-500 text-sm mt-2">{trace.storagePath}</p>
        </div>
      )}
    </main>
  );
}