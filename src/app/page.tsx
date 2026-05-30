"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopicCard from "@/src/components/TopicCard";
import KnowledgeModal from "@/src/components/KnowledgeModal";
import { topics } from "@/src/data/topics";

export default function HomePage() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] =
    useState("");

  const [openModal, setOpenModal] =
    useState(false);

  const handleTopicClick = (
    title: string
  ) => {
    setSelectedTopic(title);
    setOpenModal(true);
  };

  const handleContinue = (
    level: string
    ) => {
        const slug = selectedTopic
            .toLowerCase()
            .replaceAll(" ", "-");

        router.push(
            `/roadmap/${slug}?level=${level}`
        );
    };

  return (
    <main className="min-h-screen p-10">
      <h1
        className="
        text-4xl
        font-bold
        mb-10
        "
      >
        LearnPath AI
      </h1>

      <div
        className="
        grid
        md:grid-cols-3
        gap-5
        "
      >
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onClick={() =>
              handleTopicClick(topic.title)
            }
          />
        ))}
      </div>

      <KnowledgeModal
        topic={selectedTopic}
        open={openModal}
        onClose={() =>
          setOpenModal(false)
        }
        onContinue={handleContinue}
      />
    </main>
  );
}