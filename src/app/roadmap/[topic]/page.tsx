"use client";

import VideoCard from "@/src/components/VideoCard";
import { useEffect, useState } from "react";

interface RoadmapData {
  beginner: string[];
  intermediate: string[];
  advanced: string[];
}

export default function RoadmapPage() {

  const [roadmap, setRoadmap] =
    useState<RoadmapData | null>(null);

  const [videos, setVideos] =
  useState<any>({});

  const [loading, setLoading] =
    useState(true);

  const searchVideo = async (
    keyword: string
    ) => {

    const response = await fetch(
        "/api/youtube",
        {
        method: "POST",
        headers: {
            "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
            query: keyword,
        }),
        }
    );

    const data =
        await response.json();

    return data.items?.[0];
    };

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
      .then(async (data) => {

        console.log("ROADMAP API:", data);
        
        const cleaned =
          data.roadmap
            .replace("```json", "")
            .replace("```", "");

        const roadmapData =
            JSON.parse(cleaned);

            setRoadmap(roadmapData);

            const allVideos: any = {};

            for (const level of [
            "beginner",
            "intermediate",
            "advanced",
            ]) {

            allVideos[level] = [];

            for (const item of roadmapData[
                level
            ]) {

                const video =
                await searchVideo(item);

                if (video) {
                allVideos[level].push(
                    video
                );
                }
            }
            }

            setVideos(allVideos);

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

        <div
            className="
            grid
            md:grid-cols-3
            gap-4
            mt-4
            "
            >
            {videos.beginner?.map(
                (video: any) => (
                <VideoCard
                    key={
                    video.id.videoId
                    }
                    title={
                    video.snippet.title
                    }
                    thumbnail={
                    video.snippet
                        .thumbnails
                        .high
                        .url
                    }
                    url={`https://youtube.com/watch?v=${video.id.videoId}`}
                />
                )
            )}
            </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold">
          INTERMEDIATE
        </h2>
        
        <div
            className="
            grid
            md:grid-cols-3
            gap-4
            mt-4
            "
            >
            {videos.intermediate?.map(
                (video: any) => (
                <VideoCard
                    key={
                    video.id.videoId
                    }
                    title={
                    video.snippet.title
                    }
                    thumbnail={
                    video.snippet
                        .thumbnails
                        .high
                        .url
                    }
                    url={`https://youtube.com/watch?v=${video.id.videoId}`}
                />
                )
            )}
            </div>
        {/* {roadmap?.intermediate.map(
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
        )} */}
      </section>

      <section>
        <h2 className="text-2xl font-bold">
          ADVANCED
        </h2>

        <div
            className="
            grid
            md:grid-cols-3
            gap-4
            mt-4
            "
            >
            {videos.advanced?.map(
                (video: any) => (
                <VideoCard
                    key={
                    video.id.videoId
                    }
                    title={
                    video.snippet.title
                    }
                    thumbnail={
                    video.snippet
                        .thumbnails
                        .high
                        .url
                    }
                    url={`https://youtube.com/watch?v=${video.id.videoId}`}
                />
                )
            )}
            </div>
      </section>

    </main>
  );
}