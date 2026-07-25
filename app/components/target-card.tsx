"use client";

import Link from "next/link";

interface Props {
  target: {
    id: string;
    name: string;
    targetType: string;
    connectionInfo: Record<string, unknown>;
    firmwarePath: string | null;
    createdAt: string;
  };
}

export function TargetCard({ target }: Props) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-900">
      <h3 className="font-semibold text-white mb-1">{target.name}</h3>
      <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded">
        {target.targetType}
      </span>
      <p className="text-sm text-gray-400 mt-2">
        Firmware: {target.firmwarePath || "none loaded"}
      </p>
      <div className="flex gap-2 mt-3">
        <Link
          href={`/targets/${target.id}`}
          className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded hover:bg-gray-600"
        >
          Configure
        </Link>
        <button className="text-xs bg-green-800 text-green-200 px-3 py-1 rounded hover:bg-green-700">
          Flash
        </button>
        <button className="text-xs bg-cyan-800 text-cyan-200 px-3 py-1 rounded hover:bg-cyan-700">
          Test
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {new Date(target.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}