import { fetchTopTracks } from "@/lib/spotify";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const token = await getToken({ req });
  const { time_range = "short_term" } = req.query;

  if (!token || !token.accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const data = await fetchTopTracks(token.accessToken, time_range, 10);
    res.status(200).json({ tracks: data.items });
  } catch (err) {
    res.status(500).json({ error: "Spotify API error" });
  }
}
