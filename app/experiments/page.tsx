"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { ExperimentCard } from "@/components/experiment-card";
import { useCreateExperiment } from "@/lib/hooks";
import { useState } from "react";

export default function ExperimentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["experiments"],
    queryFn: api.getExperiments,
  });
  const create = useCreateExperiment();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Experiments</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Experiment
        </button>
      </div>
      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate({ name, tags: ["new"] });
            setName("");
            setShowForm(false);
          }}
          className="mb-6 bg-gray-900 border border-gray-700 rounded-lg p-4"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Experiment name"
            className="bg-gray-800 text-white border border-gray-600 rounded p-2 w-full mb-3"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create
          </button>
        </form>
      )}
      {isLoading ? (
        <p className="text-gray-500">Loading experiments...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.items.map((exp) => (
            <ExperimentCard key={exp.id} experiment={exp} />
          ))}
        </div>
      )}
    </main>
  );
}