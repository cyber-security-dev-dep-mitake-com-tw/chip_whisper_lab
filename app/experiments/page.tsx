"use client";

import { ExperimentCard } from "@/components/experiment-card";
import { useExperiments } from "@/lib/hooks";

export default function ExperimentsPage() {
  const { data, loading } = useExperiments();

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Experiments</h1>
      </div>
      {loading ? (
        <p className="text-gray-500">Loading experiments...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((exp) => (
            <ExperimentCard key={exp.id} experiment={exp} />
          ))}
        </div>
      )}
    </main>
  );
}
