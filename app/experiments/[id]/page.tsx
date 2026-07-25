"use client";

import { useExperiment, useTraces, useAttacks } from "@/lib/hooks";
import { useParams } from "next/navigation";

export default function ExperimentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: experiment, loading } = useExperiment(id);
  const { data: traces } = useTraces(id);
  const { data: attacks } = useAttacks(id);

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <main className="p-6">
      <h1 className="mb-2 text-2xl font-bold text-white">{experiment.name}</h1>
      <p className="mb-6 text-gray-400">{experiment.description}</p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold text-white">Traces</h2>
          <p className="text-gray-400">{traces.length} traces</p>
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold text-white">Attacks</h2>
          <p className="text-gray-400">{attacks.length} attacks</p>
        </div>
      </div>
    </main>
  );
}
