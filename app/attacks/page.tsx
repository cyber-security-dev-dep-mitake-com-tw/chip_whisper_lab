"use client";

import { AttackBuilder } from "@/components/attack-builder";
import { AttackMonitor } from "@/components/attack-monitor";
import { useAttacks } from "@/lib/hooks";
import { useState } from "react";

export default function AttacksPage() {
  const { data, loading } = useAttacks();
  const [showBuilder, setShowBuilder] = useState(false);
  const experimentId = data[0]?.experiment_id ?? "exp-001";

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Attacks</h1>
        <button
          onClick={() => setShowBuilder(!showBuilder)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          New Attack
        </button>
      </div>
      {showBuilder && (
        <div className="mb-6">
          <AttackBuilder experimentId={experimentId} />
        </div>
      )}
      {loading ? (
        <p className="text-gray-500">Loading attacks...</p>
      ) : (
        <div className="space-y-4">
          {data.map((attack) => (
            <AttackMonitor key={attack.id} attack={attack} />
          ))}
        </div>
      )}
    </main>
  );
}
