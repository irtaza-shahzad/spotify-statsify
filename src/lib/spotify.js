export async function fetchTopTracks(token, time_range = "medium_term", limit = 10) {
  const res = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch top tracks");
  return res.json();
}
