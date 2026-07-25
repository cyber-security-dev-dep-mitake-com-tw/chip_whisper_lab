"use client";

interface Props {
  attackId: string;
  status: string;
  attackType: string;
}

export function AttackMonitor({ attackId, status, attackType }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Attack Monitor</h2>
        <span className="text-sm px-3 py-1 rounded bg-gray-700 text-gray-300">
          {status}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-4">
        Attack: {attackType.toUpperCase()} | ID: {attackId}
      </p>
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: status === "running" ? "60%" : "100%" }}
            />
          </div>
          <span className="text-sm text-gray-300">
            {status === "running" ? "In progress..." : "Complete"}
          </span>
        </div>
      </div>
      {status === "completed" && (
        <div className="bg-green-900/30 border border-green-700 rounded p-4">
          <p className="text-green-400 text-sm">
            Attack completed. Results available.
          </p>
        </div>
      )}
    </div>
  );
}