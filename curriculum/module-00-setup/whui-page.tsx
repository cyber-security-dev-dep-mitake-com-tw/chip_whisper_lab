// Module 00: Environment Setup & ChipWhisperer Introduction
// React Server Component for UI rendering

interface ModuleProps {
  moduleId: string;
  title: string;
  learningObjectives: string[];
  timeEstimate: string;
  prerequisites: string[];
}

export default function ModulePage({
  moduleId = "module-00-setup",
  title = "Environment Setup & ChipWhisperer Introduction",
  learningObjectives = [
    "Install and configure the ChipWhisperer software environment",
    "Set up Python virtual environments and required dependencies",
    "Connect to ChipWhisperer hardware (CW-Lite, CW-Nano, etc.)",
    "Run basic capture scripts and verify system functionality",
    "Understand the ChipWhisperer architecture and component relationships"
  ],
  timeEstimate = "2 hours",
  prerequisites = []
}: ModuleProps) {
  return (
    <div className="module-container">
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <div className="module-meta">
          <span className="time-estimate">Time: {timeEstimate}</span>
          {prerequisites.length > 0 && (
            <span className="prerequisites">
              Prerequisites: {prerequisites.join(", ")}
            </span>
          )}
        </div>
      </header>

      <section className="learning-objectives">
        <h2>Learning Objectives</h2>
        <ul>
          {learningObjectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </section>

      <section className="module-content">
        <h2>Module Content</h2>
        <p>
          This introductory module provides the foundation for all subsequent modules.
          You will learn to set up the ChipWhisperer environment and perform your
          first side-channel capture.
        </p>
      </section>

      <section className="lab-section">
        <h2>Lab Activities</h2>
        <p>
          Complete the simulated notebook exercises to practice environment setup
          before working with physical hardware.
        </p>
      </section>
    </div>
  );
}