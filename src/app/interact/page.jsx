"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import './style.css'

export default function InteractPage() {
  const searchParams = useSearchParams();
  const mood = searchParams.get("mood") || "neutral";

  const [conversation, setConversation] = useState([]);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false); 
  const [listening, setListening] = useState(false);
  const [started, setStarted] = useState(false);

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
      utterance.rate = 2.0;
      utterance.pitch = 1.1;
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
          body: JSON.stringify({ text: userText,conversation: conversation }),
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

  return (
    <main className="min-h-screen text-white flex flex-col p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Talk Here</h1>

      {!started ? (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              setStarted(true);
              handleAIResponse();
            }}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
          >
            Start Conversation
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 max-w-2xl mx-auto flex-1 overflow-y-auto">
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg ${
                  msg.sender === "AI" ? "bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 self-start" : "bg-green-400 self-end"
                }`}
              >
                <div className="flex">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 m-5">
                    <img src={msg.sender==="AI"?"/a.jpg":"/b.png"} alt="no icon found" className={`w-full h-full object-cover object-center ${aiSpeaking?"animate-pulse":""}`} />
                  </div>
                <strong>{msg.sender}:</strong> {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={startListening}
              disabled={!canSpeak || listening}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                canSpeak && !listening
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              {listening ? "Listening..." : "Speak"}
            </button>
          </div>

          <p className="mt-4 text-center text-gray-400">
            {aiSpeaking
              ? "AI is speaking..."
              : canSpeak
              ? "Click Speak to reply."
              : "Please wait..."}
          </p>
        </>
      )}
    </main>
  );
}
