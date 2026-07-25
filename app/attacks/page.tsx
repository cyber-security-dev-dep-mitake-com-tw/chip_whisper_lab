"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useState } from "react";
import { AttackBuilder } from "@/components/attack-builder";
import { AttackMonitor } from "@/components/attack-monitor";
import { useCreateAttack } from "@/lib/hooks";

export default function AttacksPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["attacks"],
    queryFn: api.getAttacks,
  });
  const create = useCreateAttack();
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Attacks</h1>
        <button
          onClick={() => setShowBuilder(!showBuilder)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Attack
        </button>
      </div>
      {showBuilder && (
        <div className="mb-6">
          <AttackBuilder />
        </div>
      )}
      {isLoading ? (
        <p className="text-gray-500">Loading attacks...</p>
      ) : (
        <div className="space-y-4">
          {data?.items.map((attack) => (
            <AttackMonitor
              key={attack.id}
              attackId={attack.id}
              status={attack.status}
              attackType={attack.attackType}
            />
          ))}
        </div>
      )}
    </main>
  );
}