import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [tracks, setTracks] = useState([]);
  const [timeRange, setTimeRange] = useState("short_term"); // default
  const [loading, setLoading] = useState(false);

  const fetchTopTracks = async () => {
    if (!session) return;

    setLoading(true);
    const res = await fetch(`/api/top-tracks?time_range=${timeRange}`);
    const data = await res.json();
    setTracks(data.tracks);
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      fetchTopTracks();
    }
  }, [session, timeRange]); // refetch when time range changes

  const handleTimeChange = (e) => {
    setTimeRange(e.target.value);
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-6">Spotify Wrapped Anytime 🎧</h1>
        <button
          className="bg-green-500 px-4 py-2 text-white rounded"
          onClick={() => signIn("spotify")}
        >
          Connect with Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
        <button
          className="bg-red-500 px-4 py-2 text-black rounded"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      </div>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Time Range:</label>
        <select
          value={timeRange}
          onChange={handleTimeChange}
          className="border px-2 py-1 rounded"
        >
          <option value="short_term">Last 4 weeks</option>
          <option value="medium_term">Last 6 months</option>
          <option value="long_term">All time</option>
        </select>
      </div>

      {loading ? (
        <p>Loading tracks...</p>
      ) : (
        <ul className="space-y-2">
          {tracks.map((track, index) => (
            <li key={track.id} className="border p-3 rounded bg-black shadow">
              <strong>{index + 1}. {track.name}</strong> by{" "}
              {track.artists.map((a) => a.name).join(", ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
