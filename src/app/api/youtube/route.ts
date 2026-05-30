export async function POST(
  req: Request
) {

  const body =
    await req.json();

  const query =
    body.query;

  const url =
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query
    )}&type=video&maxResults=6&key=${process.env.YOUTUBE_API_KEY}`;

  const response =
    await fetch(url);

  const data =
    await response.json();

  return Response.json(data);
}