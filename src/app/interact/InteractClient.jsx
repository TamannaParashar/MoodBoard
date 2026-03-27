"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Mic, MicOff, Send, MessageCircle, Loader, Video, VideoOff, Wifi } from "lucide-react";
import { SimliClient, generateSimliSessionToken, generateIceServers } from "simli-client";
import { v4 as uuidv4 } from "uuid";

export default function InteractPage() {
  const searchParams = useSearchParams();
  const mood = searchParams.get("mood") || "neutral";

  // Simli State
  const [simliClient, setSimliClient] = useState(null);
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // User Video State
  const [isCameraOn, setIsCameraOn] = useState(false);

  // Chat & AI State
  const [conversation, setConversation] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [userId, setUserId] = useState(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  // Refs
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const userVideoRef = useRef(null);
  const userStreamRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Load userId and fetch history
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchHistory(storedUserId);
    } else {
      setHistoryLoaded(true);
    }
  }, []);

  const fetchHistory = async (uid) => {
    const roomId = `AI_${uid}`;
    try {
      const res = await fetch(`/api/userChat/history?roomId=${roomId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          const formattedHistory = data.messages.map(m => ({
            sender: m.senderId === uid ? "User" : "AI",
            text: m.message
          }));
          setConversation(formattedHistory);
        }
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setHistoryLoaded(true);
    }
  };

  const saveMessage = async (msgText, senderId, receiverId) => {
    const currentUserId = userId || localStorage.getItem("userId");
    if (!currentUserId) return;
    
    const roomId = `AI_${currentUserId}`;
    try {
      await fetch("/api/userChat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          senderId,
          receiverId,
          message: msgText
        })
      });
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (simliClient) {
        if (typeof simliClient.close === "function") simliClient.close();
        else if (typeof simliClient.stop === "function") simliClient.stop();
      }
      if (userStreamRef.current) {
        userStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [simliClient]);

  const startCamera = async () => {
    if (isCameraOn) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      userStreamRef.current = stream;
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const stopCamera = () => {
    if (!isCameraOn) return;
    if (userStreamRef.current) {
      userStreamRef.current.getTracks().forEach(t => t.stop());
      userStreamRef.current = null;
    }
    if (userVideoRef.current) {
      userVideoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  const toggleCamera = () => {
    if (isCameraOn) stopCamera();
    else startCamera();
  };

  const startAvatarCall = async () => {
    if (!isConnected && !isConnecting) {
      setIsConnecting(true);

      try {
        // v3.0 requires explicitly fetching a session token before initiating WebRTC P2P handshakes
        const sessionData = await generateSimliSessionToken({
          apiKey: process.env.NEXT_PUBLIC_SIMLI_API_KEY || "",
          config: {
            faceId: process.env.NEXT_PUBLIC_SIMLI_FACE_ID || "3bfdf7b3-8ec2-4be1-be98-1111005bc147",
            handleSilence: true,
            maxSessionLength: 3600, // 1 hour
            maxIdleTime: 600,       // 10 minutes
            model: "fasttalk"
          }
        });

        if (!sessionData || !sessionData.session_token) throw new Error("Failed to get Simli session token");

        // Setup authorized TURN/STUN ICE servers via Simli's official network traversal API 
        // This prevents the P2P connection from timing out behind strict NATs
        const iceServers = await generateIceServers(process.env.NEXT_PUBLIC_SIMLI_API_KEY || "");

        const client = new SimliClient(
          sessionData.session_token,
          videoRef.current,
          audioRef.current,
          iceServers
        );

        // Bind standard events
        client.on("connected", () => {
          console.log("SimliClient connected event received");
        });

        client.on("disconnected", () => {
          console.log("SimliClient disconnected event received");
          setIsConnected(false);
          setIsAvatarVisible(false);
        });

        client.on("failed", () => {
          console.log("SimliClient failed event received");
          setIsConnecting(false);
          alert("Connection failed. Please check your network and try again.");
        });

        setSimliClient(client);

        // Start WebRTC handshakes and await resolution
        await client.start();

        // V3 specific: Once the promise resolves, the media stream is officially active
        setIsConnected(true);
        setIsConnecting(false);
        setIsAvatarVisible(true);
        handleInitialGreeting();
        startCamera();

      } catch (err) {
        console.error("Error starting Avatar call:", err);
        setIsConnecting(false);
        alert("Failed to connect: " + err.message);
      }
    }
  };

  const endAvatarCall = () => {
    setIsConnected(false);
    setIsAvatarVisible(false);
    setConversation([]);
    stopCamera();

    if (simliClient) {
      if (typeof simliClient.close === "function") simliClient.close();
      else if (typeof simliClient.stop === "function") simliClient.stop();
      setSimliClient(null);
    }
  };

  const handleInitialGreeting = async () => {
    try {
      setIsAiThinking(true);
      const res = await fetch(`/api/avatarResp?mood=${mood}`);
      const data = await res.json();
      const greeting = data.suggestion || "Hi! How are you feeling today?";

      setConversation([{ sender: "AI", text: greeting }]);
      speakViaSimli(greeting);
    } catch (err) {
      console.error(err);
      speakViaSimli("Hi! Let's talk about how you are feeling.");
    } finally {
      setIsAiThinking(false);
    }
  };

  const speakViaSimli = async (text) => {
    if (simliClient && isConnected) {
      try {
        // 1. Fetch MP3 audio from Google's free TTS endpoint as a reliable fallback
        // IMPORTANT: In production, swap this with official ElevenLabs or OpenAI TTS API 
        // as Google Translate's endpoint has rate limits and is not meant for high-volume commercial use.
        // 1. Fetch MP3 audio from our secure Next.js backend proxy to bypass browser CORS
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        });

        if (!response.ok) throw new Error("TTS Generation Failed: " + response.status);
        const arrayBuffer = await response.arrayBuffer();

        // 2. Simli v3 strictly requires raw PCM 16-bit, 16kHz, Mono audio as a Uint8Array.
        // We must decode the response (MP3) and downsample it correctly.
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        // 3. Extract the mono channel data (Float32Array ranging from -1.0 to 1.0)
        const channelData = audioBuffer.getChannelData(0);

        // 4. Convert Float32 to Int16 (PCM 16-bit)
        const int16Array = new Int16Array(channelData.length);
        for (let i = 0; i < channelData.length; i++) {
          // Clamp the values and scale to 16-bit integer range
          const s = Math.max(-1, Math.min(1, channelData[i]));
          int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        // 5. Convert the Int16Array to a Uint8Array (bytes) as expected by Simli SDK
        const pcmUint8Array = new Uint8Array(int16Array.buffer);

        // 6. Feed the raw audio bytes into Simli to drive lip-sync and audio playback
        simliClient.sendAudioData(pcmUint8Array);

      } catch (err) {
        console.error("TTS or Simli Audio Routing Error:", err);
      }
    }
  };

  const handleAIResponse = async (userText, updatedConversation) => {
    if (!userText) return;
    try {
      setIsAiThinking(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Use the passed history instead of state to avoid stale issues
        body: JSON.stringify({ text: userText, conversation: (updatedConversation || conversation).slice(-10) }),
      });
      const data = await res.json();
      const responseText = data.responseText || "Hmm, I didn't get that. Can you say it again?";

      setConversation((prev) => [...prev, { sender: "AI", text: responseText }]);
      speakViaSimli(responseText);
      
      // Save AI response to DB
      const currentUserId = userId || localStorage.getItem("userId");
      if (currentUserId) {
        saveMessage(responseText, "AI", currentUserId);
      }
    } catch (err) {
      console.error("AI error:", err);
      speakViaSimli("Oops, I encountered an error responding.");
    } finally {
      setIsAiThinking(false);
    }
  };

  const startListening = () => {
    if (!isConnected) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition API.");
      return;
    }

    // Stop any existing recognition before starting new
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) { }
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const userText = event.results[0][0].transcript;
      if (userText.trim()) {
        const newMessage = { sender: "User", text: userText };
        setConversation((prev) => [...prev, newMessage]);
        
        // Fix stale state: pass the actual update
        handleAIResponse(userText, [...conversation, newMessage]);
        
        // Save user message to DB
        const currentUserId = userId || localStorage.getItem("userId");
        if (currentUserId) {
          saveMessage(userText, currentUserId, "AI");
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !isConnected || isAiThinking) return;

    const userText = inputText;
    const newMessage = { sender: "User", text: userText };
    setConversation((prev) => [...prev, newMessage]);
    setInputText("");
    
    // Fix stale state: pass the actual update
    handleAIResponse(userText, [...conversation, newMessage]);
    
    // Save user message to DB
    const currentUserId = userId || localStorage.getItem("userId");
    if (currentUserId) {
      saveMessage(userText, currentUserId, "AI");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      {/* Hidden Audio component for WebRTC stream */}
      <audio ref={audioRef} autoPlay style={{ display: "none" }}></audio>

      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                MoodBoard
              </h1>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
                <p className="text-xs text-slate-400">
                  {isConnected ? "Connected • Interactive" : "Disconnected"}
                </p>
              </div>
            </div>
          </div>

          {isConnected && (
            <button
              onClick={endAvatarCall}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition-all"
            >
              <VideoOff className="w-4 h-4" />
              End Call
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 gap-6 h-[calc(100vh-80px)] overflow-hidden">

        {/* Top Video Section */}
        <div className="flex flex-col md:flex-row w-full gap-6 flex-shrink-0 h-[40vh] md:h-[45vh]">

          {/* Avatar Video Stream */}
          <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-700/50 relative overflow-hidden flex flex-col items-center justify-center backdrop-blur-xl shadow-2xl">

            {!isConnected && !isConnecting && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-slate-950/80 backdrop-blur-sm p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                  <Video className="w-10 h-10 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Start Video Call</h2>
                <p className="text-slate-400 max-w-sm mb-8">
                  Connect with an AI companion to discuss your {mood} mood. This session is 100% private.
                </p>
                <button
                  onClick={startAvatarCall}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2"
                >
                  <Wifi className="w-5 h-5" />
                  Connect to Avatar
                </button>
              </div>
            )}

            {isConnecting && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-slate-950/80 backdrop-blur-sm">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-purple-400 font-semibold animate-pulse">Establishing secure connection...</p>
              </div>
            )}

            {/* Simli Video Canvas */}
            <div className="w-full h-full relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-1000 ${isAvatarVisible ? 'opacity-100' : 'opacity-0'}`}
              ></video>

              {/* Visual enhancements layer */}
              {isConnected && (
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
              )}

              {/* Listening Indicator overlay on video */}
              {listening && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-pink-500/90 backdrop-blur-md px-6 py-2 rounded-full border border-pink-400/50 shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-1 h-3 bg-white rounded-full animate-pulse"></span>
                    <span className="w-1 h-5 bg-white rounded-full animate-pulse delay-75"></span>
                    <span className="w-1 h-3 bg-white rounded-full animate-pulse delay-150"></span>
                  </div>
                  <span className="text-white text-sm font-bold">Listening...</span>
                </div>
              )}

              {/* AI Processing Overlay */}
              {isAiThinking && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 shadow-xl flex items-center gap-2">
                  <Loader className="w-4 h-4 text-purple-400 animate-spin" />
                  <span className="text-slate-300 text-sm">Thinking...</span>
                </div>
              )}

            </div>
          </div>

          {/* User Local Camera */}
          <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-700/50 relative overflow-hidden flex flex-col items-center justify-center backdrop-blur-xl shadow-2xl">
            <video
              ref={userVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300 ${isCameraOn ? "opacity-100" : "opacity-0"}`}
            />
            {!isCameraOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-900">
                <VideoOff className="w-12 h-12 mb-3 opacity-50" />
                <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">Camera Off</span>
              </div>
            )}
            <button
              onClick={toggleCamera}
              className="absolute bottom-4 right-4 p-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full backdrop-blur-md transition-all shadow-lg z-40"
              title={isCameraOn ? "Turn off camera" : "Turn on camera"}
            >
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Bottom: Chat Context & Controls */}
        <div className="w-full flex-1 flex flex-col bg-slate-900/40 rounded-2xl border border-slate-700/50 backdrop-blur-xl overflow-hidden shadow-xl min-h-0">
          <div className="p-4 border-b border-slate-700/50 bg-slate-800/30">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-purple-400" />
              Live Transcript
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm text-center">
                <p>No messages yet.</p>
                <p className="mt-1">Connect the video call to begin.</p>
              </div>
            ) : (
              conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.sender === "AI" ? "justify-start" : "justify-end"}`}
                >
                  {msg.sender === "AI" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-xs font-bold text-white">AI</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl ${msg.sender === "AI"
                      ? "bg-slate-800/80 border border-slate-700 text-slate-200"
                      : "bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white"
                      } backdrop-blur-sm`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Controls Area */}
          <div className="p-4 bg-slate-800/30 border-t border-slate-700/50">
            <div className="flex gap-2">
              {/* Voice Button */}
              <button
                onClick={startListening}
                disabled={!isConnected || listening || isAiThinking}
                title="Push to speak"
                className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${listening
                  ? "bg-pink-500 text-white scale-105 shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                  : isConnected && !isAiThinking
                    ? "bg-slate-700 text-slate-300 hover:bg-purple-600 hover:text-white"
                    : "bg-slate-800/50 text-slate-500 cursor-not-allowed"
                  }`}
              >
                {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Text Submit */}
              <form onSubmit={handleTextSubmit} className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={!isConnected || isAiThinking}
                  placeholder="Type to avatar..."
                  className="flex-1 px-4 py-2 border border-slate-700 bg-slate-900/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!isConnected || !inputText.trim() || isAiThinking}
                  className={`flex-shrink-0 px-4 rounded-xl flex items-center justify-center transition-all ${isConnected && inputText.trim() && !isAiThinking
                    ? "bg-purple-600 text-white hover:bg-purple-500"
                    : "bg-slate-800/50 text-slate-500 cursor-not-allowed"
                    }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
