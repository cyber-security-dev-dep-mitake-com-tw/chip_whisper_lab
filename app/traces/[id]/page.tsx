"use client";

import { useTrace } from "@/lib/hooks";
import { useParams } from "next/navigation";

export default function TraceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: trace, loading } = useTrace(id);

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-white">Trace Viewer</h1>
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
        <p className="text-gray-300">Name: {trace.name}</p>
        <p className="text-gray-300">Samples: {trace.samples.length}</p>
        <p className="mt-2 text-sm text-gray-500">
          Rate: {(trace.sample_rate / 1e6).toFixed(2)} MHz
        </p>
      </div>
    </main>
  );
}
