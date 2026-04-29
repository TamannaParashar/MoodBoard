"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { ArrowLeft, Video, VideoOff, Volume2, VolumeX } from "lucide-react";
import { useRouter } from "next/navigation";
import * as faceapi from "face-api.js";
import * as THREE from "three";

// --- 3D Particle Component ---
function ZenParticles({ isMeditating }) {
  const ref = useRef();
  
  // Create 5000 random particles in a sphere
  const [positions, initialPositions] = useMemo(() => {
    const count = 5000;
    const pos = new Float32Array(count * 3);
    const initial = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const r = 10 + Math.random() * 2;
        
        pos[i * 3] = r * Math.cos(theta) * Math.sin(phi);
        pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        pos[i * 3 + 2] = r * Math.cos(phi);
        
        initial[i*3] = pos[i*3];
        initial[i*3+1] = pos[i*3+1];
        initial[i*3+2] = pos[i*3+2];
    }
    return [pos, initial];
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    
    // Smooth idle rotation
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    if (!isMeditating) {
        ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }

    const positionsArr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < positionsArr.length; i += 3) {
      // If meditating, particles pull inward and pulse slowly. Else they drift out.
      const targetPulse = isMeditating 
        ? Math.sin(state.clock.elapsedTime * 0.5) * 2 // Slow deep pulse
        : Math.sin(state.clock.elapsedTime * 2 + i) * 0.5; // Chaotic fast jitter
      
      const speed = isMeditating ? 0.02 : 0.05;
      
      positionsArr[i] += (initialPositions[i] + (initialPositions[i] * targetPulse * 0.1) - positionsArr[i]) * speed;
      positionsArr[i+1] += (initialPositions[i+1] + (initialPositions[i+1] * targetPulse * 0.1) - positionsArr[i+1]) * speed;
      positionsArr[i+2] += (initialPositions[i+2] + (initialPositions[i+2] * targetPulse * 0.1) - positionsArr[i+2]) * speed;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={isMeditating ? "#c084fc" : "#60a5fa"} // Purple when calm, Blue when active
        size={isMeditating ? 0.15 : 0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}


// --- Main Page Component ---
export default function ZenRoom() {
  const router = useRouter();
  const videoRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [isMeditating, setIsMeditating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [debugEar, setDebugEar] = useState(0);
  
  // Audio Refs
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);

  // Initialize Scientifically Proven Audio Layer
  const initAudio = () => {
    if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0; // Start silenced
        gainNode.connect(ctx.destination);

        // --- 1. Solfeggio / Binaural Beats (Theta state - 4Hz difference) ---
        // Playing 432Hz in one ear and 436Hz in the other forces the brain to perceive a 4Hz "Theta" brainwave (deep meditation)
        const oscLeft = ctx.createOscillator();
        const oscRight = ctx.createOscillator();
        oscLeft.type = 'sine';
        oscRight.type = 'sine';
        oscLeft.frequency.value = 432;   // Miracle Tone
        oscRight.frequency.value = 436;  // Offset by 4Hz for Theta state
        
        // Split them left and right using StereoPanner (if supported) or just mix them
        if (ctx.createStereoPanner) {
            const panLeft = ctx.createStereoPanner();
            const panRight = ctx.createStereoPanner();
            panLeft.pan.value = -1;
            panRight.pan.value = 1;
            oscLeft.connect(panLeft).connect(gainNode);
            oscRight.connect(panRight).connect(gainNode);
        } else {
            oscLeft.connect(gainNode);
            oscRight.connect(gainNode);
        }

        // --- 2. The "OM" Earth Resonance (136.1 Hz) ---
        // 136.1 Hz is the classic frequency of the OM tuning fork and traditional meditation bowls
        const oscOm = ctx.createOscillator();
        const omGain = ctx.createGain();
        oscOm.type = 'triangle'; // Triangle wave sounds more like a resonant bowl than pure sine
        oscOm.frequency.value = 136.1;
        omGain.gain.value = 0.5; // Softer in the background
        
        oscOm.connect(omGain);
        omGain.connect(gainNode);

        // Start all oscillators
        oscLeft.start();
        oscRight.start();
        oscOm.start();
        
        // Keep a reference to stop them later
        oscRef.current = { stop: () => { oscLeft.stop(); oscRight.stop(); oscOm.stop(); } };
        gainRef.current = gainNode;
        setSoundEnabled(true);
    }
  };

  // Toggle Sound
  const toggleSound = () => {
    if (!soundEnabled) {
        initAudio();
        if (gainRef.current) gainRef.current.gain.setTargetAtTime(0.3, audioCtxRef.current.currentTime, 1);
    } else {
        if (gainRef.current) gainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
        setSoundEnabled(false);
    }
  };

  // Adjust audio based on meditation state
  useEffect(() => {
    if (soundEnabled && gainRef.current && audioCtxRef.current) {
        if (isMeditating) {
            // Swell up the volume smoothly when eyes are closed
            gainRef.current.gain.setTargetAtTime(0.8, audioCtxRef.current.currentTime, 2);
        } else {
            // Drop volume down when eyes are open
            gainRef.current.gain.setTargetAtTime(0.2, audioCtxRef.current.currentTime, 0.5);
        }
    }
  }, [isMeditating, soundEnabled]);

  // Cleanup WebAudio on dismount
  useEffect(() => {
    return () => {
        if (oscRef.current) oscRef.current.stop();
        if (audioCtxRef.current) audioCtxRef.current.close();
    }
  }, []);

  // Initialize Webcam & Models
  useEffect(() => {
    const loadModelsAndCamera = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models")
        ]);
        
        // Try getting camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
        setLoading(false);
      } catch (err) {
        console.error("Camera/Model Error:", err);
        setLoading(false); // Let them see visuals even if camera fails
      }
    };
    
    loadModelsAndCamera();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(t => t.stop());
        }
    }
  }, []);

  // Eye Aspect Ratio calculation formula
  const getEAR = (eye) => {
    const v1 = Math.hypot(eye[1].x - eye[5].x, eye[1].y - eye[5].y);
    const v2 = Math.hypot(eye[2].x - eye[4].x, eye[2].y - eye[4].y);
    const h = Math.hypot(eye[0].x - eye[3].x, eye[0].y - eye[3].y);
    return (v1 + v2) / (2.0 * h);
  };

  // Main Detection Loop
  useEffect(() => {
    if (!cameraActive || loading) return;

    let isActive = true;

    const detectLoop = async () => {
      if (!videoRef.current || !isActive) return;

      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      if (detection) {
        const landmarks = detection.landmarks.positions;
        const leftEye = landmarks.slice(36, 42);
        const rightEye = landmarks.slice(42, 48);
        
        const leftEAR = getEAR(leftEye);
        const rightEAR = getEAR(rightEye);
        const avgEAR = (leftEAR + rightEAR) / 2;
        setDebugEar(avgEAR);

        // Threshold for eyes closed is typically around 0.25 to 0.28
        if (avgEAR < 0.26) {
          setIsMeditating(true);
        } else {
          setIsMeditating(false);
        }
      } else {
        // If no face found, assume not meditating
        setIsMeditating(false);
      }

      // Loop
      setTimeout(detectLoop, 200);
    };

    detectLoop();

    return () => {
      isActive = false;
    };
  }, [cameraActive, loading]);

  return (
    <main className="h-screen w-screen overflow-hidden bg-slate-950 flex flex-col relative text-white transition-colors duration-1000">
      
      {/* Background Gradient responding to zen state */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-2000 pointer-events-none"
        style={{
          background: isMeditating 
             ? "radial-gradient(circle at center, rgba(126, 34, 206, 0.4) 0%, rgba(2, 6, 23, 1) 100%)" 
             : "radial-gradient(circle at center, rgba(30, 64, 175, 0.2) 0%, rgba(2, 6, 23, 1) 100%)"
        }}
      ></div>

      {/* Header UI */}
      <div className="absolute top-0 w-full z-20 p-6 flex items-center justify-between pointer-events-none">
        <button 
          onClick={() => router.push("/")}
          className="pointer-events-auto flex items-center gap-2 text-slate-400 hover:text-white transition-colors backdrop-blur-md bg-black/20 px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        
        <div className="flex gap-4">
            <button 
              onClick={toggleSound}
              className="pointer-events-auto p-3 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white transition-all shadow-lg"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-purple-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
            </button>
            <div className="pointer-events-none p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-lg flex items-center justify-center">
              {cameraActive ? <Video className="w-5 h-5 text-blue-400" /> : <VideoOff className="w-5 h-5 text-red-400" />}
            </div>
        </div>
      </div>
      
      {/* Debug UI */}
      {cameraActive && !loading && (
        <div className="absolute bottom-4 left-4 z-20 text-xs text-slate-500 font-mono pointer-events-none">
          EAR: {debugEar > 0 ? debugEar.toFixed(3) : "Searching..."}
        </div>
      )}

      {/* Main Overlay Text */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        {loading ? (
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin mb-6"></div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse">
                    Initializing Zen Space...
                </h1>
            </div>
        ) : (
            <div className={`transition-all duration-1000 transform text-center ${isMeditating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
                    Clear Your Mind
                </h1>
                <p className="text-lg md:text-xl text-slate-300 max-w-lg mx-auto leading-relaxed px-4">
                    Look into the camera, take a deep breath, and <span className="text-purple-400 font-semibold">close your eyes</span>.
                    The environment will respond to your calm.
                </p>
                {!soundEnabled && (
                    <button onClick={toggleSound} className="mt-8 pointer-events-auto px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm font-semibold transition-all">
                        Enable Audio Drone
                    </button>
                )}
            </div>
        )}
      </div>

      {/* Hidden processing video element (must have dimensions for face-api to read canvas) */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        style={{ opacity: 0, position: 'absolute', pointerEvents: 'none', width: '320px', height: '240px' }} 
      />

      {/* Canvas Layer */}
      <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <ZenParticles isMeditating={isMeditating} />
          </Canvas>
      </div>

    </main>
  );
}
