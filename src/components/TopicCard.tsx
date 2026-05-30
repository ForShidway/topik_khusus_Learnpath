"use client";

import { Topic } from "@/src/types/topic";

interface Props {
  topic: Topic;
  onClick: () => void;
}

export default function TopicCard({
  topic,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="
      cursor-pointer
      rounded-xl
      border
      p-6
      shadow-md
      hover:shadow-lg
      transition
      bg-white
      "
    >
      <h2 className="text-xl font-semibold">
        {topic.title}
      </h2>
    </div>
  );
}