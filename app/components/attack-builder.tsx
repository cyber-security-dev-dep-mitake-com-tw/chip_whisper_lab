"use client";

import { useState } from "react";

export function AttackBuilder() {
  const [step, setStep] = useState(1);
  const [attackType, setAttackType] = useState("cpa");
  const [config, setConfig] = useState<Record<string, unknown>>({});

  const types = ["cpa", "dpa", "template", "glitch", "dfa"];

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Attack Builder</h2>
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`px-4 py-2 rounded text-sm ${
              step === s
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            Step {s}
          </button>
        ))}
      </div>
      {step === 1 && (
        <div>
          <h3 className="text-white font-semibold mb-2">1. Select Attack Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setAttackType(t);
                  setStep(2);
                }}
                className={`p-3 rounded text-left ${
                  attackType === t
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <span className="font-mono text-sm">{t.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3 className="text-white font-semibold mb-2">2. Configure Attack</h3>
          <p className="text-gray-400 text-sm mb-4">
            Attack type: {attackType.toUpperCase()}
          </p>
          <textarea
            className="w-full bg-gray-800 text-gray-200 border border-gray-600 rounded p-2 font-mono text-sm"
            rows={6}
            placeholder='{"keyBytes": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}'
            value={JSON.stringify(config, null, 2)}
            onChange={(e) => {
              try {
                setConfig(JSON.parse(e.target.value));
              } catch {
                /* ignore invalid JSON */
              }
            }}
          />
          <button
            onClick={() => setStep(3)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Review
          </button>
        </div>
      )}
      {step === 3 && (
        <div>
          <h3 className="text-white font-semibold mb-2">3. Review & Launch</h3>
          <pre className="bg-gray-800 text-gray-200 p-3 rounded text-sm overflow-auto">
            {JSON.stringify({ attackType, config }, null, 2)}
          </pre>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setStep(2)}
              className="bg-gray-700 text-gray-300 px-4 py-2 rounded hover:bg-gray-600"
            >
              Back
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Launch Attack
            </button>
          </div>
        </div>
      )}
    </div>
  );
}