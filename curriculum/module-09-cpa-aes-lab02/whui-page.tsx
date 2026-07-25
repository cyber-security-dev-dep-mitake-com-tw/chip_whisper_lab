// Module 09: CPA on AES Lab 02
// React Server Component for UI rendering

interface ModuleProps {
  moduleId: string;
  title: string;
  learningObjectives: string[];
  timeEstimate: string;
  prerequisites: string[];
}

export default function ModulePage({
  moduleId = "module-09-cpa-aes-lab02",
  title = "CPA on AES Lab 02",
  learningObjectives = [
    "Understand the core concepts of Full CPA attack execution",
    "Apply theoretical knowledge to practical scenarios",
    "Analyze real-world implementations and attacks",
    "Implement basic security measures and countermeasures",
    "Evaluate system security using industry standards"
  ],
  timeEstimate = "5 hours",
  prerequisites = ["Module 08"]
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
          This module covers Full CPA attack execution, result interpretation. You will learn fundamental concepts,
          practical applications, and security considerations.
        </p>
      </section>

      <section className="lab-section">
        <h2>Lab Activities</h2>
        <p>
          Complete the simulated notebook exercises to practice the techniques
          covered in this module.
        </p>
      </section>
    </div>
  );
}
