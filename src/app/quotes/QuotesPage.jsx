"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./quotes.module.css";

const MOOD_THEMES = {
  happy: {
    gradientFrom: "rgba(168, 85, 247, 0.15)",
    gradientTo: "rgba(236, 72, 153, 0.15)",
    accent: "#f472b6",
    accentDim: "rgba(244, 114, 182, 0.2)",
    glowColor: "rgba(244, 114, 182, 0.3)",
    borderColor: "rgba(244, 114, 182, 0.25)",
    label: "Happy",
    emoji: "☀️",
    tagline: "Embrace the light within you",
    pillGrad: "from-pink-500 to-rose-400",
  },
  sad: {
    gradientFrom: "rgba(59, 130, 246, 0.15)",
    gradientTo: "rgba(99, 102, 241, 0.15)",
    accent: "#818cf8",
    accentDim: "rgba(129, 140, 248, 0.2)",
    glowColor: "rgba(129, 140, 248, 0.3)",
    borderColor: "rgba(129, 140, 248, 0.25)",
    label: "Sad",
    emoji: "🌧️",
    tagline: "It's okay to feel, it's okay to heal",
    pillGrad: "from-blue-500 to-indigo-400",
  },
  surprised: {
    gradientFrom: "rgba(139, 92, 246, 0.18)",
    gradientTo: "rgba(236, 72, 153, 0.15)",
    accent: "#c084fc",
    accentDim: "rgba(192, 132, 252, 0.2)",
    glowColor: "rgba(192, 132, 252, 0.35)",
    borderColor: "rgba(192, 132, 252, 0.25)",
    label: "Surprised",
    emoji: "✨",
    tagline: "Life is full of beautiful surprises",
    pillGrad: "from-purple-500 to-pink-400",
  },
  fear: {
    gradientFrom: "rgba(251, 146, 60, 0.12)",
    gradientTo: "rgba(239, 68, 68, 0.12)",
    accent: "#fb923c",
    accentDim: "rgba(251, 146, 60, 0.2)",
    glowColor: "rgba(251, 146, 60, 0.3)",
    borderColor: "rgba(251, 146, 60, 0.25)",
    label: "Fear",
    emoji: "🌿",
    tagline: "Courage is fear walking forward",
    pillGrad: "from-orange-500 to-red-400",
  },
  angry: {
    gradientFrom: "rgba(239, 68, 68, 0.15)",
    gradientTo: "rgba(251, 146, 60, 0.12)",
    accent: "#f87171",
    accentDim: "rgba(248, 113, 113, 0.2)",
    glowColor: "rgba(248, 113, 113, 0.3)",
    borderColor: "rgba(248, 113, 113, 0.25)",
    label: "Angry",
    emoji: "🍂",
    tagline: "Breathe, reset, and rise above",
    pillGrad: "from-red-500 to-orange-400",
  },
  fearful: {
    gradientFrom: "rgba(251, 146, 60, 0.12)",
    gradientTo: "rgba(239, 68, 68, 0.12)",
    accent: "#fb923c",
    accentDim: "rgba(251, 146, 60, 0.2)",
    glowColor: "rgba(251, 146, 60, 0.3)",
    borderColor: "rgba(251, 146, 60, 0.25)",
    label: "Fearful",
    emoji: "🌿",
    tagline: "Courage is fear walking forward",
    pillGrad: "from-orange-500 to-red-400",
  },
  neutral: {
    gradientFrom: "rgba(100, 116, 139, 0.15)",
    gradientTo: "rgba(71, 85, 105, 0.15)",
    accent: "#94a3b8",
    accentDim: "rgba(148, 163, 184, 0.2)",
    glowColor: "rgba(148, 163, 184, 0.25)",
    borderColor: "rgba(148, 163, 184, 0.2)",
    label: "Neutral",
    emoji: "🌫️",
    tagline: "Stillness is where clarity begins",
    pillGrad: "from-slate-400 to-slate-500",
  },
  disgusted: {
    gradientFrom: "rgba(16, 185, 129, 0.12)",
    gradientTo: "rgba(5, 150, 105, 0.12)",
    accent: "#34d399",
    accentDim: "rgba(52, 211, 153, 0.2)",
    glowColor: "rgba(52, 211, 153, 0.25)",
    borderColor: "rgba(52, 211, 153, 0.2)",
    label: "Disgusted",
    emoji: "😤",
    tagline: "Acknowledge the feeling, choose peace",
    pillGrad: "from-emerald-500 to-green-400",
  },
};

const DEFAULT_THEME = {
  gradientFrom: "rgba(168, 85, 247, 0.15)",
  gradientTo: "rgba(236, 72, 153, 0.15)",
  accent: "#c084fc",
  accentDim: "rgba(192, 132, 252, 0.2)",
  glowColor: "rgba(192, 132, 252, 0.3)",
  borderColor: "rgba(192, 132, 252, 0.25)",
  label: "Quotes",
  emoji: "📖",
  tagline: "Words that move the soul",
  pillGrad: "from-purple-500 to-pink-500",
};

export default function QuotePage() {
  const searchParams = useSearchParams();
  const mood = searchParams.get("mood");
  const theme = MOOD_THEMES[mood?.toLowerCase()] || DEFAULT_THEME;

  const limit = 10;
  const [quotes, setQuotes] = useState([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const observerRef = useRef(null);

  const fetchQuotes = async (reset = false, customOffset = 0) => {
    if (!mood) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/quotes?mood=${mood}&limit=${limit}&offset=${customOffset}`
      );
      if (!res.ok) {
        setQuotes([]);
        setTotal(0);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setTotal(data.total);
      setQuotes((prev) => (reset ? data.data : [...prev, ...data.data]));
      if (reset) setOffset(0);
    } catch (err) {
      console.error("Error fetching quotes:", err);
      setQuotes([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (mood) fetchQuotes(true, 0);
  }, [mood]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, entry.target.dataset.idx]));
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    return () => observerRef.current?.disconnect();
  }, []);

  const cardRef = (el, idx) => {
    if (el && observerRef.current) {
      el.dataset.idx = idx;
      observerRef.current.observe(el);
    }
  };

  const loadMore = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    fetchQuotes(false, nextOffset);
  };

  const hasMore = quotes.length < total;

  return (
    <div className={styles.page}>
      {/* Ambient background blobs matching homepage style */}
      <div className={styles.blobTop} style={{ background: theme.gradientFrom.replace("0.15", "0.25") }} />
      <div className={styles.blobBottom} style={{ background: theme.gradientTo.replace("0.15", "0.25") }} />

      {/* Nav bar — same as homepage */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <a href="/" className={styles.navLogo}>
            <span className={styles.logoGradient}>MoodBoard</span>
          </a>
          <a href="/" className={styles.backBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M5 12l7-7M5 12l7 7" />
            </svg>
            Back
          </a>
        </div>
      </nav>

      {/* Hero header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>


          <h1 className={styles.title}>
            Quotes turn experience
            <span className={styles.titleGradient} style={{ "--accent": theme.accent, "--glow": theme.glowColor }}>
              {" "}into wisdom.
            </span>
          </h1>

        </div>
      </header>

      {/* Quotes Grid */}
      <main className={styles.main}>
        {!loading && quotes.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No quotes found for this mood.</p>
          </div>
        )}

        <div className={styles.grid}>
          {quotes.map((quote, idx) => (
            <div
              key={`${quote}-${idx}`}
              ref={(el) => cardRef(el, idx)}
              className={`${styles.card} ${visibleCards.has(String(idx)) ? styles.cardVisible : ""}`}
              style={{
                "--accent": theme.accent,
                "--accent-dim": theme.accentDim,
                "--glow": theme.glowColor,
                "--border": theme.borderColor,
                "--grad-from": theme.gradientFrom,
                "--grad-to": theme.gradientTo,
                "--delay": `${(idx % 10) * 65}ms`,
              }}
            >
              {/* Card inner glow overlay */}
              <div className={styles.cardGlowOverlay} />

              {/* Top row: quote mark + index */}
              <div className={styles.cardTop}>
                <svg
                  className={styles.quoteMark}
                  viewBox="0 0 48 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 24C0 10.7 8.5 3 17.6 0L20.3 4C12.3 7.5 8.5 13 8.5 19.7H14.4V40H0V24ZM27.2 24C27.2 10.7 35.7 3 44.8 0L47.5 4C39.5 7.5 35.7 13 35.7 19.7H41.6V40H27.2V24Z"
                    fill="currentColor"
                    style={{ color: theme.accent }}
                    fillOpacity="0.25"
                  />
                </svg>
                <span className={styles.cardIndex} style={{ color: theme.accent, borderColor: theme.borderColor, background: theme.accentDim }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Quote text */}
              <blockquote className={styles.quoteText}>
                {quote}
              </blockquote>

              {/* Bottom accent */}
              <div className={styles.cardFooter}>
                <div className={styles.footerLine} style={{ background: theme.accent }} />
              </div>
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinnerRing} style={{ borderTopColor: theme.accent, borderColor: theme.accentDim }} />
            <p className={styles.loadingText} style={{ color: theme.accent }}>Gathering words…</p>
          </div>
        )}

        {/* Load more */}
        {hasMore && !loading && (
          <div className={styles.loadMoreWrapper}>
            <button
              id="load-more-quotes"
              onClick={loadMore}
              className={styles.loadMoreBtn}
              style={{
                "--accent": theme.accent,
                "--glow": theme.glowColor,
                "--border": theme.borderColor,
                "--accent-dim": theme.accentDim,
              }}
            >
              <span>Load More Quotes</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* All loaded */}
        {!hasMore && quotes.length > 0 && !loading && (
          <div className={styles.allLoaded}>
            <div className={styles.allLoadedLine} style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}50, transparent)` }} />
            <span className={styles.allLoadedText} style={{ color: theme.accent + "70" }}>
              ✦ All {total} quotes loaded ✦
            </span>
          </div>
        )}
      </main>
    </div>
  );
}