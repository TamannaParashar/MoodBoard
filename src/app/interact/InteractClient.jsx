"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Mic, MicOff, Send, RotateCcw, MessageCircle, Loader } from "lucide-react";

export default function InteractPage() {
  const searchParams = useSearchParams();
  const mood = searchParams.get("mood") || "neutral";

  const [conversation, setConversation] = useState([]);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const [listening, setListening] = useState(false);
  const [started, setStarted] = useState(false);
  const [inputText, setInputText] = useState("");

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Speak text using TTS and return a promise
  const speakText = (text) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1.2;
      utterance.pitch = 1.0;
      utterance.onstart = () => setAiSpeaking(true);
      utterance.onend = () => {
        setAiSpeaking(false);
        resolve();
      };
      speechSynthesis.speak(utterance);
    });
  };

  const handleAIResponse = async (userText = null) => {
    try {
      let responseText = "";
      if (userText) {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: userText, conversation: conversation }),
        });
        const data = await res.json();
        responseText = data.responseText || "Hmm, I didn't get that. Can you say it again?";
      } else {
        const res = await fetch(`/api/avatarResp?mood=${mood}`);
        const data = await res.json();
        responseText = data.suggestion || "Hi! How are you feeling today?";
      }

      setConversation((prev) => [...prev, { sender: "AI", text: responseText }]);
      setCanSpeak(false);
      await speakText(responseText);
      setCanSpeak(true);
    } catch (err) {
      console.error("AI error:", err);
      setCanSpeak(true);
    }
  };

  const startListening = () => {
    if (!canSpeak) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition API.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const userText = event.results[0][0].transcript;
      setConversation((prev) => [...prev, { sender: "User", text: userText }]);
      setCanSpeak(false);
      handleAIResponse(userText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      setCanSpeak(true);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !canSpeak) return;

    setConversation((prev) => [...prev, { sender: "User", text: inputText }]);
    setInputText("");
    setCanSpeak(false);
    handleAIResponse(inputText);
  };

  const resetConversation = () => {
    setConversation([]);
    setCanSpeak(true);
    setListening(false);
    handleAIResponse();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MoodBoard</h1>
              <p className="text-xs text-slate-400 capitalize">Your {mood} mood support</p>
            </div>
          </div>
          {started && (
            <button
              onClick={resetConversation}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              New Chat
            </button>
          )}
        </div>
      </header>

      {!started ? (
        /* Welcome Screen */
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md text-center space-y-8">
            <div className="space-y-4">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-purple-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-lg text-slate-400">
                  I'm here to listen and support you through your {mood} mood.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-white/50">You can:</p>
              <div className="grid gap-2 text-left">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Mic className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>Speak naturally to me</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Send className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>Type your thoughts</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Loader className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>I'll respond with support</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setStarted(true);
                handleAIResponse();
              }}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold text-lg hover:shadow-lg hover:scale-105 transition-all"
            >
              Start Conversation
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {conversation.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-white/40">
                  <p>Chat started...</p>
                </div>
              ) : (
                conversation.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${msg.sender === "AI" ? "justify-start" : "justify-end"}`}
                  >
                    {msg.sender === "AI" && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        msg.sender === "AI"
                          ? "bg-slate-800 text-white"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      } ${aiSpeaking && msg.sender === "AI" ? "animate-pulse" : ""}`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    {msg.sender === "User" && (
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">You</span>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Status & Controls */}
          <div className="bg-slate-900/80 backdrop-blur-md border-t border-slate-700">
            <div className="max-w-4xl mx-auto px-6 py-4 space-y-4">
              {/* Status */}
              <div className="text-center text-sm font-semibold text-slate-400 h-5">
                {aiSpeaking ? (
                  <span className="text-purple-400">AI is speaking...</span>
                ) : listening ? (
                  <span className="text-pink-400">Listening...</span>
                ) : canSpeak ? (
                  <span>Ready to listen</span>
                ) : (
                  <span>Processing...</span>
                )}
              </div>

              {/* Input Area */}
              <div className="flex gap-3 items-end">
                {/* Voice Button */}
                <button
                  onClick={startListening}
                  disabled={!canSpeak || listening || aiSpeaking}
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                    listening
                      ? "bg-pink-500 text-white scale-110"
                      : canSpeak && !aiSpeaking
                      ? "bg-purple-600 text-white hover:bg-purple-700 hover:scale-105"
                      : "bg-slate-800 text-white/40 cursor-not-allowed"
                  }`}
                >
                  {listening ? (
                    <MicOff className="w-6 h-6" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </button>

                {/* Text Input */}
                <form onSubmit={handleTextSubmit} className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={!canSpeak || aiSpeaking}
                    placeholder="Type your thoughts here..."
                    className="flex-1 px-4 py-3 border border-slate-700 rounded-full bg-slate-800 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!canSpeak || !inputText.trim() || aiSpeaking}
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      canSpeak && inputText.trim() && !aiSpeaking
                        ? "bg-purple-600 text-white hover:bg-purple-700 hover:scale-105"
                        : "bg-slate-800 text-white/40 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
