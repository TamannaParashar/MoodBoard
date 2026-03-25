"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Sparkles, Wand2 } from "lucide-react";

export default function MotivationRoom() {
  const searchParams = useSearchParams();
  const mood = searchParams.get("mood") || "neutral";
  const router = useRouter();

  const [story, setStory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch("/api/getStorybook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mood }),
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || "Failed to load story");
        
        setStory(data.story || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStory();
  }, [mood]);

  const handleNext = () => {
    if (currentSlide < story.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-slate-900/40 backdrop-blur-md border-b border-slate-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Motivation Room
            </span>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 w-full max-w-5xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-slate-800 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-t-blue-500 border-r-purple-500 rounded-full animate-spin absolute inset-0"></div>
              <Wand2 className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Crafting your personal story...
            </h2>
            <p className="text-slate-400 text-sm">Our AI is generating a unique experience for your {mood} mood.</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl text-center max-w-md">
            <h2 className="text-2xl font-bold text-red-400 mb-2">Oops!</h2>
            <p className="text-red-200 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : story.length > 0 ? (
          <div className="w-full flex-col flex items-center">
            {/* Carousel Container */}
            <div className="relative w-full aspect-video md:aspect-[21/9] max-h-[60vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 group bg-slate-900">
              
              {/* Image from LoremFlickr */}
              <img 
                src={`https://loremflickr.com/1280/720/${encodeURIComponent((story[currentSlide]?.imagePrompt || "beautiful scenery").split(" ").join(","))}?lock=${currentSlide + 100}`}
                alt="Story illustration"
                className="w-full h-full object-cover transition-opacity duration-700"
                key={currentSlide} // Forces re-render/animation on slide change
              />

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

              {/* Story Text */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <p className="text-lg md:text-2xl font-medium leading-relaxed text-slate-100 drop-shadow-lg max-w-4xl mx-auto text-center"
                   key={"text-" + currentSlide}
                >
                  {story[currentSlide]?.text}
                </p>
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={handlePrev}
                disabled={currentSlide === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white disabled:opacity-0 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button 
                onClick={handleNext}
                disabled={currentSlide === story.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white disabled:opacity-0 disabled:pointer-events-none transition-all"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>

            {/* Progress indicators */}
            <div className="flex gap-3 mt-8">
              {story.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={"h-1.5 rounded-full transition-all duration-300 " + (currentSlide === idx ? "w-8 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" : "w-2 bg-slate-700 hover:bg-slate-600")}
                />
              ))}
            </div>
            
            {currentSlide === story.length - 1 && (
              <button 
                onClick={() => router.push("/")}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full font-bold shadow-lg transition-all transform hover:scale-105"
              >
                Return to Dashboard
              </button>
            )}
            
          </div>
        ) : null}
      </div>
    </main>
  );
}
