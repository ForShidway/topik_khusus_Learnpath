interface Props {
  params: Promise<{
    topic: string;
  }>;
}

export default async function RoadmapPage({
  params,
}: Props) {
  const { topic } = await params;

  const roadmap = {
    beginner: [
      "Apa itu AI",
      "Dasar Python",
      "Statistik Dasar",
    ],
    intermediate: [
      "Supervised Learning",
      "Feature Engineering",
    ],
    advanced: [
      "Deep Learning",
      "NLP",
    ],
  };

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        {decodeURIComponent(topic)}
      </h1>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-3">
          BEGINNER
        </h2>

        {roadmap.beginner.map((item) => (
          <div
            key={item}
            className="border p-3 mb-2 rounded"
          >
            {item}
          </div>
        ))}
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-3">
          INTERMEDIATE
        </h2>

        {roadmap.intermediate.map((item) => (
          <div
            key={item}
            className="border p-3 mb-2 rounded"
          >
            {item}
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">
          ADVANCED
        </h2>

        {roadmap.advanced.map((item) => (
          <div
            key={item}
            className="border p-3 mb-2 rounded"
          >
            {item}
          </div>
        ))}
      </section>
    </main>
  );
}