"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useParams } from "next/navigation";

export default function ExperimentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: experiment, isLoading } = useQuery({
    queryKey: ["experiment", id],
    queryFn: () => api.getExperiment(id),
  });
  const { data: traces } = useQuery({
    queryKey: ["traces", id],
    queryFn: () => api.getTraces(id),
  });
  const { data: attacks } = useQuery({
    queryKey: ["attacks", id],
    queryFn: () => api.getAttacks(id),
  });

  if (isLoading) return <p className="text-gray-500 p-6">Loading...</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-white mb-2">{experiment?.name}</h1>
      <p className="text-gray-400 mb-6">{experiment?.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Traces</h2>
          <p className="text-gray-400">{traces?.total ?? 0} traces</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Attacks</h2>
          <p className="text-gray-400">{attacks?.total ?? 0} attacks</p>
        </div>
      </div>
    </main>
  );
}