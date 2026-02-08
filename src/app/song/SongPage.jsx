"use client"

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SongPage() {
  const searchParam = useSearchParams();
  const mood = searchParam.get('mood');
  const [language, setLanguage] = useState("english");
  const [songs, setSongs] = useState([]);
  const [offset, setOffset] = useState(0);

  let limit = 12;

  const fetchSongs =async(reset=false)=>{
      try {
        const res = await fetch(`/api/spotify?mood=${mood}&lang=${language}&offset=${reset?0:offset}`);
        const data = await res.json();
        setSongs((prev)=>reset?data.tracks:[...prev,...data.tracks]);
      } catch (err) {
        console.error("Error fetching songs:", err);
      }
    };

  useEffect(() => {
    if (!mood) return;
    setOffset(0);
    fetchSongs(true);
  }, [mood, language])

  const loadSongs=()=>{
    const newOffset = offset + limit;
    setOffset(newOffset);
  }

  useEffect(()=>{
    if(offset==0){
      return;
    }
    fetchSongs();
  },[offset])

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
          {songs.length === 0 && <p>No songs found.</p>}
          {songs.map((song, index) => {
            // Use song.id if available, otherwise fallback to a unique combination of name+index
            const key = song.id || `${song.name}-${index}`;
            return (
              <div
                key={key}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform"
              >
                <Link href={song.url}>
                <img
                  src={song.albumImageUrl || "/placeholder.png"} // fallback image
                  alt={song.name}
                  className="w-full h-48 object-cover"
                />
                </Link>
                <div className="p-4">
                  <h2 className="font-bold text-lg">{song.name}</h2>
                  <p className="text-gray-400">{song.artist}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-3 py-2 w-max">
          <button onClick={loadSongs}>Load more...</button>
        </div>
    </div>
  );
}
