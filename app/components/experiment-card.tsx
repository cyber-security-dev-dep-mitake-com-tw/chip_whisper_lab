"use client";

import Link from "next/link";

interface Props {
  experiment: {
    id: string;
    name: string;
    description: string | null;
    tags: string[];
    createdAt: string;
  };
}

export function ExperimentCard({ experiment }: Props) {
  return (
    <Link href={`/experiments/${experiment.id}`}>
      <div className="border border-gray-700 rounded-lg p-4 bg-gray-900 hover:border-gray-500 transition-colors">
        <h3 className="font-semibold text-white mb-1">{experiment.name}</h3>
        <p className="text-sm text-gray-400 mb-2">
          {experiment.description || "No description"}
        </p>
        <div className="flex gap-2">
          {experiment.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {new Date(experiment.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}