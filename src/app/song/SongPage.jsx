"use client"

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SongPage() {
  const searchParam = useSearchParams();
  const mood = searchParam.get('mood');
  const [language, setLanguage] = useState("english");
  const [songs, setSongs] = useState([]);
  const [pageToken, setPageToken] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSongs = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const currentToken = reset ? "" : pageToken;
      const res = await fetch(`/api/youtube?mood=${mood}&lang=${language}&pageToken=${currentToken}`);
      const data = await res.json();
      
      setSongs((prev) => reset ? (data.tracks || []) : [...prev, ...(data.tracks || [])]);
      
      if (data.nextPageToken) {
        setPageToken(data.nextPageToken);
      } else {
        setPageToken(""); // no more pages
      }
    } catch (err) {
      console.error("Error fetching songs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mood) return;
    setPageToken("");
    fetchSongs(true);
  }, [mood, language]);

  const loadSongs = () => {
    if (pageToken) {
      fetchSongs(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Mood: {mood}</h1>

      {/* Language Dropdown */}
      <label className="block mb-6">
        <span className="text-lg mr-2">Choose Language:</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-800 text-white"
        >
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
          <option value="haryanvi">Haryanvi</option>
          <option value="punjabi">Punjabi</option>
          <option value="bhojpuri">Bhojpuri</option>
        </select>
      </label>

      {/* Songs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {songs.length === 0 && !loading && <p>No songs found.</p>}
          {songs.map((song, index) => {
            const key = song.id || `${song.name}-${index}`;
            return (
              <div
                key={key}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform"
              >
                <Link href={song.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={song.albumImageUrl || "/placeholder.png"} 
                  alt={song.name}
                  className="w-full h-48 object-cover"
                />
                </Link>
                <div className="p-4">
                  <h2 className="font-bold text-lg line-clamp-2">{song.name}</h2>
                  <p className="text-gray-400 mt-1">{song.artist}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {loading && <p className="mt-6 text-gray-400">Loading songs...</p>}
        
        {pageToken && !loading && (
          <div className="mt-8 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 w-max cursor-pointer text-center">
            <button onClick={loadSongs} className="font-semibold text-white">Load more...</button>
          </div>
        )}
    </div>
  );
}
