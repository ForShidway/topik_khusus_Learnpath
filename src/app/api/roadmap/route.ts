import { model } from "@/src/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const topic = body.topic;
    const level = body.level;

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