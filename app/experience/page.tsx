export default function Experience() {
  return (
    <main className="px-6 py-20 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Experience</h2>

      <section className="mb-8">
        <h3 className="text-xl font-semibold">
          American Airlines — SDE 3
        </h3>
        <ul className="list-disc ml-6 mt-2 text-gray-600 dark:text-gray-400">
          <li>Building scalable backend and full-stack systems</li>
          <li>Designing microservices and production APIs</li>
          <li>Strong focus on reliability and ownership</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold">
          MaxLinear Technologies — SDE
        </h3>
        <ul className="list-disc ml-6 mt-2 text-gray-600 dark:text-gray-400">
          <li>Improved UI engagement by ~30% using React + TypeScript</li>
          <li>Built scalable FastAPI backend services</li>
          <li>Used AI-assisted log analysis to reduce debugging ~25%</li>
          <li>Reduced deployment time ~35% using Docker CI/CD</li>
        </ul>
      </section>
    </main>
  );
}
