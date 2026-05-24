"use client"

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Music, Sparkles, Play, Languages, Loader2 } from "lucide-react";

const MOOD_THEMES = {
  happy: {
    gradientFrom: "from-purple-900/30",
    gradientTo: "to-pink-900/20",
    accent: "text-pink-400",
    accentBorder: "border-pink-500/30",
    borderHover: "hover:border-pink-500/50",
    glowColor: "shadow-pink-500/10",
    bgPill: "bg-pink-500/10 text-pink-300 border-pink-500/20",
    label: "Happy",
    tagline: "Upbeat melodies to match your positive energy!",
    pageBg: "from-slate-950 via-purple-950/20 to-slate-950"
  },
  sad: {
    gradientFrom: "from-blue-900/30",
    gradientTo: "to-indigo-900/20",
    accent: "text-indigo-400",
    accentBorder: "border-indigo-500/30",
    borderHover: "hover:border-indigo-500/50",
    glowColor: "shadow-indigo-500/10",
    bgPill: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    label: "Sad",
    tagline: "Comforting tunes for quiet reflection and emotional comfort.",
    pageBg: "from-slate-950 via-blue-950/20 to-slate-950"
  },
  surprised: {
    gradientFrom: "from-purple-900/30",
    gradientTo: "to-amber-900/20",
    accent: "text-purple-400",
    accentBorder: "border-purple-500/30",
    borderHover: "hover:border-purple-500/50",
    glowColor: "shadow-purple-500/10",
    bgPill: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    label: "Surprised",
    tagline: "Vibrant rhythms and fresh discoveries.",
    pageBg: "from-slate-950 via-fuchsia-950/20 to-slate-950"
  },
  fear: {
    gradientFrom: "from-amber-900/30",
    gradientTo: "to-rose-900/20",
    accent: "text-amber-400",
    accentBorder: "border-amber-500/30",
    borderHover: "hover:border-amber-500/50",
    glowColor: "shadow-amber-500/10",
    bgPill: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    label: "Fearful",
    tagline: "Soothing harmonics to ease anxiety and bring peace.",
    pageBg: "from-slate-950 via-amber-950/15 to-slate-950"
  },
  fearful: {
    gradientFrom: "from-amber-900/30",
    gradientTo: "to-rose-900/20",
    accent: "text-amber-400",
    accentBorder: "border-amber-500/30",
    borderHover: "hover:border-amber-500/50",
    glowColor: "shadow-amber-500/10",
    bgPill: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    label: "Fearful",
    tagline: "Soothing harmonics to ease anxiety and bring peace.",
    pageBg: "from-slate-950 via-amber-950/15 to-slate-950"
  },
  angry: {
    gradientFrom: "from-red-900/30",
    gradientTo: "to-rose-900/20",
    accent: "text-rose-400",
    accentBorder: "border-rose-500/30",
    borderHover: "hover:border-rose-500/50",
    glowColor: "shadow-rose-500/10",
    bgPill: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    label: "Angry",
    tagline: "Powerful soundscapes to vent and release emotional tension.",
    pageBg: "from-slate-950 via-rose-950/20 to-slate-950"
  },
  neutral: {
    gradientFrom: "from-slate-900/30",
    gradientTo: "to-slate-800/20",
    accent: "text-slate-300",
    accentBorder: "border-slate-500/30",
    borderHover: "hover:border-slate-500/50",
    glowColor: "shadow-slate-500/10",
    bgPill: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    label: "Neutral",
    tagline: "Harmonious soundscapes for mental focus and calm.",
    pageBg: "from-slate-950 via-slate-900/40 to-slate-950"
  },
  disgusted: {
    gradientFrom: "from-emerald-900/30",
    gradientTo: "to-teal-900/20",
    accent: "text-emerald-400",
    accentBorder: "border-emerald-500/30",
    borderHover: "hover:border-emerald-500/50",
    glowColor: "shadow-emerald-500/10",
    bgPill: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    label: "Disgusted",
    tagline: "Clean, fresh frequencies to uplift and restart.",
    pageBg: "from-slate-950 via-emerald-950/20 to-slate-950"
  }
};

const DEFAULT_THEME = {
  gradientFrom: "from-purple-900/30",
  gradientTo: "to-pink-900/20",
  accent: "text-purple-400",
  accentBorder: "border-purple-500/30",
  borderHover: "hover:border-purple-500/50",
  glowColor: "shadow-purple-500/10",
  bgPill: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  label: "Songs",
  tagline: "A collection of songs crafted for your emotional vibe.",
  pageBg: "from-slate-950 via-slate-900 to-slate-950"
};

export default function SongPage() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const mood = searchParam.get('mood') || "neutral";
  const [language, setLanguage] = useState("english");
  const [songs, setSongs] = useState([]);
  const [pageToken, setPageToken] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = MOOD_THEMES[mood?.toLowerCase()] || DEFAULT_THEME;

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
        setPageToken(""); 
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden flex flex-col pt-16 md:pt-20">
      {/* Ambient background blobs matching quotes page style */}
      <div className="fixed -top-40 -right-28 w-[520px] h-[520px] rounded-full blur-[100px] pointer-events-none z-0 animate-[pulse_14s_ease-in-out_infinite_alternate]" style={{ background: theme.gradientFrom.replace("0.15", "0.25").replace("0.3", "0.25") }} />
      <div className="fixed -bottom-36 -left-24 w-[440px] h-[440px] rounded-full blur-[100px] pointer-events-none z-0 animate-[pulse_16s_ease-in-out_infinite_alternate-reverse]" style={{ background: theme.gradientTo.replace("0.15", "0.25").replace("0.2", "0.25") }} />

      {/* Nav bar — same as quotes page */}
      <nav className="fixed top-0 w-full z-40 bg-gradient-to-b from-slate-950/85 to-transparent backdrop-blur-md border-b border-slate-800/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold tracking-widest uppercase bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400 bg-clip-text text-transparent">
            MoodBoard
          </a>
          <a
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 text-slate-400 hover:text-white transition-all text-xs font-semibold tracking-wider"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M5 12l7-7M5 12l7 7" />
            </svg>
            Back
          </a>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-6 pt-6 pb-12 flex flex-col">
        
        {/* Editorial Heading Section */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-4">
            Music heals what words cannot <span className={`bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}>Touch</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            {theme.tagline}
          </p>
        </div>

        {/* Action Controls & Select Language */}
        <div className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Language Preference</p>
              <p className="text-sm font-bold text-white capitalize">{language} Audio</p>
            </div>
          </div>

          {/* Styled Language selector */}
          <div className="flex flex-wrap gap-2 justify-center">
            {["english", "hindi", "haryanvi", "punjabi", "bhojpuri"].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
                  language === lang 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 border-transparent text-white shadow-lg shadow-purple-500/25" 
                    : "bg-slate-800/50 hover:bg-slate-800 border-slate-700/60 text-slate-300 hover:text-white"
                }`}
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">
          
          {songs.length === 0 && !loading && (
            <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/10">
              <Music className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400 font-medium">No tracks found. Try picking a different language above.</p>
            </div>
          )}

          {songs.map((song, index) => {
            const key = song.id || `${song.name}-${index}`;
            return (
              <div
                key={key}
                className={`group bg-gradient-to-b from-slate-900/60 to-slate-950/80 rounded-2xl overflow-hidden border border-slate-800/50 hover:border-slate-700 shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col ${theme.glowColor} hover:shadow-2xl`}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  {/* Song thumbnail image with scale effect */}
                  <img
                    src={song.albumImageUrl || "/placeholder.png"} 
                    alt={song.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Subtle dark overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                    {/* Play button hover transition */}
                    <div className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md flex items-center justify-center transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                      <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base leading-snug line-clamp-2 text-white group-hover:text-purple-300 transition-colors" title={song.name}>
                      {song.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">{song.artist || "Unknown Artist"}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Listen</span>
                    <Link 
                      href={song.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-xs font-bold ${theme.accent} hover:underline`}
                    >
                      Open YouTube
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Skeleton Loaders for clean state transition */}
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="bg-slate-900/40 rounded-2xl overflow-hidden border border-slate-800/80 h-[320px] flex flex-col animate-pulse">
              <div className="aspect-video w-full bg-slate-800/50"></div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-slate-800/60 rounded-md w-3/4"></div>
                  <div className="h-3 bg-slate-800/40 rounded-md w-1/2"></div>
                </div>
                <div className="h-6 bg-slate-800/40 rounded-md w-1/3 mt-6"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more button */}
        {pageToken && !loading && (
          <div className="mt-12 mb-6 flex justify-center">
            <button
              onClick={loadSongs}
              className="px-8 py-3.5 bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-slate-700 rounded-full font-bold text-sm text-white shadow-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              <span>Load More Tracks</span>
              <Music className="w-4 h-4 text-purple-400" />
            </button>
          </div>
        )}

        {/* Loader Spinner when loading pages */}
        {loading && pageToken && (
          <div className="mt-12 flex justify-center items-center gap-2 text-purple-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-semibold">Tuning to more tracks...</span>
          </div>
        )}
      </main>
    </div>
  );
}
