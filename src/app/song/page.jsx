"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SongPage() {
  const searchParam = useSearchParams();
  const mood = searchParam.get('mood');
  const [language, setLanguage] = useState("english");
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    if (!mood) return;

    const fetchSongs = async () => {
      try {
        const res = await fetch(`/api/spotify?mood=${mood}&lang=${language}`);
        const data = await res.json();
        console.log(data);
        setSongs(data.tracks);
      } catch (err) {
        console.error("Error fetching songs:", err);
      }
    };

    fetchSongs();
  }, [mood, language]);

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
        </select>
      </label>

      {/* Songs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {songs.length === 0 && <p>No songs found.</p>}
  {songs.map((song, index) => {
    // Use song.id if available, otherwise fallback to a unique combination of name+index
    const key = song.id || `${song.name}-${index}`;

    return (
      <div
        key={key}
        className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform"
      >
        <img
          src={song.albumImageUrl || "/placeholder.png"} // fallback image
          alt={song.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="font-bold text-lg">{song.name}</h2>
          <p className="text-gray-400">{song.artist}</p>
        </div>
      </div>
    );
  })}
</div>

    </div>
  );
}
