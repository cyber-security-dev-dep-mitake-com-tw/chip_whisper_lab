"use client";

import { useState } from "react";

interface Props {
  experimentId: string;
}

export function ReportGenerator({ experimentId }: Props) {
  const [reportType, setReportType] = useState("pdf");
  const [generating, setGenerating] = useState(false);

  const types = ["pdf", "html", "json"];

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Generate Report</h2>
      <p className="text-gray-400 text-sm mb-4">
        Generate a report for experiment {experimentId}
      </p>
      <div className="mb-4">
        <label className="text-white text-sm block mb-2">Report Type</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="bg-gray-800 text-gray-200 border border-gray-600 rounded p-2"
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => setGenerating(true)}
        disabled={generating}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {generating ? "Generating..." : "Generate"}
      </button>
    </div>
  );
}