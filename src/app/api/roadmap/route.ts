import { model } from "@/src/lib/gemini";
import { connectDB } from "@/src/lib/mongodb";
import SearchLog from "@/src/models/SearchLog";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const topic = body.topic;
    const level = body.level;

    // Log the search query in the database
    try {
      await connectDB();
      if (topic) {
        // Pretty-print topic if it's a slug
        const queryText = topic.replaceAll("-", " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
        await SearchLog.create({ query: queryText });
      }
    } catch (dbErr) {
      console.error("Failed to log search to DB:", dbErr);
    }

    const prompt = `
Anda adalah AI Learning Roadmap Generator.

Topik:
${topic}

Level Pengguna:
${level}

Tugas:

Buat roadmap pembelajaran.

Kelompokkan menjadi:

BEGINNER
INTERMEDIATE
ADVANCED

Format HARUS JSON:

{
  "beginner": [],
  "intermediate": [],
  "advanced": []
}

Maksimal 5 item setiap kategori.
`;

    const result =
      await model.generateContent(prompt);

    const text =
      result.response.text();

    console.log("Gemini Response:");
    console.log(text);



    return Response.json({
      success: true,
      roadmap: text,
    });

  } catch (error) {

    return Response.json({
      success: false,
      error: String(error),
    });
  }
}