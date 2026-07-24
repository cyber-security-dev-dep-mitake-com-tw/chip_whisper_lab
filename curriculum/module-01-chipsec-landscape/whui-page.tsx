// Module 01: Chip Security Landscape
// React Server Component for UI rendering

interface ModuleProps {
  moduleId: string;
  title: string;
  learningObjectives: string[];
  timeEstimate: string;
  prerequisites: string[];
}

export default function ModulePage({
  moduleId = "module-01-chipsec-landscape",
  title = "Chip Security Landscape",
  learningObjectives = [
    "Explain FIPS 140-3 standards and certification requirements",
    "Describe the CMVP validation process for cryptographic modules",
    "Categorize different types of hardware attacks",
    "Understand security evaluation methodologies",
    "Identify common vulnerabilities in chip implementations"
  ],
  timeEstimate = "3 hours",
  prerequisites = ["Module 00: Environment Setup & ChipWhisperer Introduction"]
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
          This module provides an overview of the chip security landscape,
          covering FIPS 140-3, CMVP certification, and attack taxonomy.
        </p>
      </section>

      <section className="lab-section">
        <h2>Lab Activities</h2>
        <p>
          Complete the simulated notebook exercises to explore chip security
          concepts and real-world case studies.
        </p>
      </section>
    </div>
  );
}