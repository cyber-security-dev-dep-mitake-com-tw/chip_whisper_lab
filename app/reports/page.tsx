"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { ReportGenerator } from "@/components/report-generator";

export default function ReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: api.getReports,
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Reports</h1>
      <ReportGenerator experimentId="placeholder" />
      {isLoading ? (
        <p className="text-gray-500 mt-6">Loading reports...</p>
      ) : (
        <div className="mt-6 space-y-4">
          {data?.items.map((report) => (
            <div
              key={report.id}
              className="bg-gray-900 border border-gray-700 rounded-lg p-4"
            >
              <p className="text-white">{report.reportType}</p>
              <p className="text-gray-500 text-sm">{report.filePath}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}