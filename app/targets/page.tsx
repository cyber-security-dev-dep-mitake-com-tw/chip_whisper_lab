"use client";

import { TargetCard } from "@/components/target-card";
import { useTargets } from "@/lib/hooks";

export default function TargetsPage() {
  const { data, loading } = useTargets();

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Targets</h1>
      {loading ? (
        <p className="text-gray-500">Loading targets...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((target) => (
            <TargetCard key={target.id} target={target} />
          ))}
        </div>
      )}
    </main>
  );
}
