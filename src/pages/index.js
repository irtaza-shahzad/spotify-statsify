import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchTopTracks } from "@/lib/spotify";

export default function Home() {
  const { data: session } = useSession();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (session?.accessToken) {
      fetchTopTracks(session.accessToken)
        .then((data) => setTracks(data.items))
        .catch((err) => console.error(err));
    }
  }, [session]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Spotify Wrapped Anytime</h1>

      {!session ? (
        <button
          className="bg-green-500 px-4 py-2 text-white rounded"
          onClick={() => signIn("spotify")}
        >
          Connect with Spotify
        </button>
      ) : (
        <>
          <h2 className="text-lg">Welcome, {session.user.name}</h2>
          <button
            className="bg-red-500 px-4 py-2 mt-4 text-white rounded"
            onClick={() => signOut()}
          >
            Sign Out
          </button>

          <h3 className="text-2xl font-semibold mt-8">Top Tracks</h3>
          <ul className="mt-4 space-y-2">
            {tracks.map((track) => (
              <li key={track.id} className="bg-black-100 p-4 rounded">
                <strong>{track.name}</strong> — {track.artists[0].name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
