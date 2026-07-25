"use client";

import { ReportGenerator } from "@/components/report-generator";
import { useReports } from "@/lib/hooks";

export default function ReportsPage() {
  const { data, loading } = useReports();
  const experimentId = data[0]?.experiment_id ?? "exp-001";

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Reports</h1>
      <ReportGenerator experimentId={experimentId} />
      {loading ? (
        <p className="mt-6 text-gray-500">Loading reports...</p>
      ) : (
        <div className="mt-6 space-y-4">
          {data.map((report) => (
            <div
              key={report.id}
              className="rounded-lg border border-gray-700 bg-gray-900 p-4"
            >
              <p className="text-white">{report.name}</p>
              <p className="text-sm text-gray-500">{report.template}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
