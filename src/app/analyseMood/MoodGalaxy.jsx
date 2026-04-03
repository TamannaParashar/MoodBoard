"use client";

import React, { useMemo, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Float } from "@react-three/drei";
import * as THREE from "three";

// Map moods to colors
const moodColors = {
  happy: "#FDE047",     // Yellow
  sad: "#60A5FA",       // Blue
  angry: "#F87171",     // Red
  fearful: "#C084FC",   // Purple
  disgusted: "#34D399", // Green
  surprised: "#FBBF24", // Amber
  neutral: "#FFFFFF",   // White
};

function StarNode({ data, position, color }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  // Add subtle pulse to hovered star
  useFrame((state) => {
    if (hovered && meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.2;
      meshRef.current.scale.set(scale, scale, scale);
    } else if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  // Calculate formatted date
  const dateStr = new Date(data.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered ? 1.5 : 0.8}
          roughness={0.2}
          metalness={0.8}
        />
        
        {hovered && (
          <Html distanceFactor={15} center zIndexRange={[100, 0]}>
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-2xl text-center w-max transform -translate-y-12">
              <p className="text-xs text-slate-400 mb-1">{dateStr}</p>
              <p className="font-bold text-white capitalize text-lg flex items-center justify-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                {data.mood}
              </p>
            </div>
          </Html>
        )}
      </mesh>
    </Float>
  );
}

function GalaxyCenter() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x += 0.002;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      <pointLight color="#ffffff" intensity={5} distance={20} />
    </mesh>
  );
}

// Scene wrapper to slowly rotate the entire galaxy
function Scene({ children }) {
  const groupRef = useRef();
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001; // slow ambient rotation
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function MoodGalaxy({ rawHistory = [] }) {
  // Memoize positions to avoid recalculating every frame
  const starsData = useMemo(() => {
    // Sort chronologically (oldest first, so oldest are in the center)
    const sorted = [...rawHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Phyllotaxis spiral parameters
    const goldenAngle = 137.5 * (Math.PI / 180);
    const spread = 0.8; // Distance between stars
    
    return sorted.map((entry, i) => {
      // Calculate cluster position
      const angle = i * goldenAngle;
      const radius = spread * Math.sqrt(i + 1) + 1; // +1 to stay clear of the center mass
      
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      // Small random Y to add depth
      const y = (Math.random() - 0.5) * (radius * 0.3);

      return {
        ...entry,
        position: [x, y, z],
        color: moodColors[entry.mood?.toLowerCase()] || moodColors.neutral
      };
    });
  }, [rawHistory]);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden bg-[#020617] border border-slate-700/50 shadow-2xl">
      {/* Overlay Title */}
      <div className="absolute top-4 left-6 z-10 pointer-events-none">
        <h2 className="text-xl font-bold text-white mb-1">Your Emotional Galaxy</h2>
        <p className="text-xs text-slate-400">Drag to rotate • Scroll to zoom • Hover stars</p>
      </div>

      <Canvas camera={{ position: [0, 8, 15], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        <Scene>
          <GalaxyCenter />
          {starsData.map((data, idx) => (
            <StarNode key={data._id || idx} data={data} position={data.position} color={data.color} />
          ))}
        </Scene>

        <OrbitControls 
          enablePan={false} 
          minDistance={3} 
          maxDistance={30} 
          autoRotate 
          autoRotateSpeed={0.5} 
        />
      </Canvas>
    </div>
  );
}
