"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { TargetCard } from "@/components/target-card";

export default function TargetsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["targets"],
    queryFn: api.getTargets,
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Targets</h1>
      {isLoading ? (
        <p className="text-gray-500">Loading targets...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.items.map((target) => (
            <TargetCard key={target.id} target={target} />
          ))}
        </div>
      )}
    </main>
  );
}