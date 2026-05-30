"use client";

import { useEffect, useState } from "react";

interface RoadmapData {
  beginner: string[];
  intermediate: string[];
  advanced: string[];
}

export default function RoadmapPage() {

  const [roadmap, setRoadmap] =
    useState<RoadmapData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const path =
      window.location.pathname;

    const topic =
      decodeURIComponent(
        path.split("/").pop() || ""
      );

    const params =
      new URLSearchParams(
        window.location.search
      );

    const level =
      params.get("level");

    fetch("/api/roadmap", {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        topic,
        level,
      }),
    })
      .then((res) => res.json())
      .then((data) => {

        const cleaned =
          data.roadmap
            .replace("```json", "")
            .replace("```", "");

        setRoadmap(
          JSON.parse(cleaned)
        );

        setLoading(false);
      });

  }, []);

  if (loading)
    return (
      <h1 className="p-10">
        Generating Roadmap...
      </h1>
    );

  return (
    <main className="p-10">

      <h1
        className="
        text-4xl
        font-bold
        mb-10
        "
      >
        Learning Roadmap
      </h1>

      <section className="mb-10">
        <h2 className="text-2xl font-bold">
          BEGINNER
        </h2>

        {roadmap?.beginner.map(
          (item) => (
            <div
              key={item}
              className="
              border
              p-3
              rounded
              mt-2
              "
            >
              {item}
            </div>
          )
        )}
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold">
          INTERMEDIATE
        </h2>

        {roadmap?.intermediate.map(
          (item) => (
            <div
              key={item}
              className="
              border
              p-3
              rounded
              mt-2
              "
            >
              {item}
            </div>
          )
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold">
          ADVANCED
        </h2>

        {roadmap?.advanced.map(
          (item) => (
            <div
              key={item}
              className="
              border
              p-3
              rounded
              mt-2
              "
            >
              {item}
            </div>
          )
        )}
      </section>

    </main>
  );
}