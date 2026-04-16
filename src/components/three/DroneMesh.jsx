"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import * as THREE from "three";

/* ─── Mouse-tracking Spotlight (inside Canvas) ─── */
function SpotlightFollower({ isNarrative }) {
  const spotRef = useRef();
  const { viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const isMobileRef = useRef(false);

  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768;

    if (isMobileRef.current) return; // Mobile uses fixed center

    const onMove = (e) => {
      // Map 2D mouse coordinates to exact NDC (Normalized Device Coordinates)
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [viewport]);

  useFrame(() => {
    if (!spotRef.current || !isNarrative) return;
    if (isMobileRef.current) {
      // Fixed center for mobile
      spotRef.current.position.set(0, 0, 5);
    } else {
      // Scale NDC nicely so the light sweeps effectively across the scene
      const sweepX = mouse.current.x * (viewport.width / 2);
      const sweepY = mouse.current.y * (viewport.height / 2);
      spotRef.current.position.set(sweepX, sweepY, 3);
    }
  });

  if (!isNarrative) return null;

  return (
    <pointLight
      ref={spotRef}
      color="#ffffff"
      intensity={5}
      distance={15}
      decay={2}
    />
  );
}

/* ─── Drone Geometry (kept exactly as user designed) ─── */
function Drone() {
  const groupRef = useRef();
  const propRefs = useRef([]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Feature 5: Slow constant tumble (passive, ambient)
      groupRef.current.rotation.x += 0.002;
      groupRef.current.rotation.y += 0.002;

      // Keep the hover bob
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }

    // Spin the propellers
    propRefs.current.forEach((prop, i) => {
      if (prop) {
        prop.rotation.y += (i % 2 === 0 ? 1 : -1) * 0.4;
      }
    });
  });

  return (
    <group ref={groupRef} scale={0.75}>
      {/* Main Sleek Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.4, 0.15, 32]} />
        <meshStandardMaterial color="#1C1C1E" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Center Glossy Camera Dome */}
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Front Glowing Navigation Light */}
      <mesh position={[0, 0.05, 0.45]}>
        <boxGeometry args={[0.15, 0.05, 0.1]} />
        <meshBasicMaterial color="#34D399" />
      </mesh>

      {/* Rear Glowing Navigation Light */}
      <mesh position={[0, 0.05, -0.45]}>
        <boxGeometry args={[0.15, 0.05, 0.1]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>

      {/* Arms and Rotors */}
      {[
        [0.9, 0.9],
        [-0.9, 0.9],
        [0.9, -0.9],
        [-0.9, -0.9],
      ].map(([x, z], i) => (
        <group key={i}>
          {/* Arm Connecting to Center */}
          <mesh position={[x / 2, 0, z / 2]} rotation={[0, Math.atan2(x, z), 0]}>
            <boxGeometry args={[0.08, 0.06, 1.4]} />
            <meshStandardMaterial color="#2D2D30" roughness={0.6} metalness={0.5} />
          </mesh>

          {/* Motor Housing */}
          <mesh position={[x, 0.06, z]}>
            <cylinderGeometry args={[0.14, 0.14, 0.2, 16]} />
            <meshStandardMaterial color="#1a1a1c" roughness={0.4} metalness={0.8} />
          </mesh>

          {/* Elegant Propeller Guard Ring */}
          <mesh position={[x, 0.12, z]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.45, 0.015, 32, 64]} />
            <meshStandardMaterial color="#8B7E74" roughness={0.3} metalness={0.6} />
          </mesh>

          {/* Fast-Spinning Propeller Assembly */}
          <group position={[x, 0.18, z]} ref={(el) => (propRefs.current[i] = el)}>
            <mesh>
              <boxGeometry args={[0.8, 0.01, 0.06]} />
              <meshStandardMaterial color="#111" opacity={0.6} transparent />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.8, 0.01, 0.06]} />
              <meshStandardMaterial color="#111" opacity={0.6} transparent />
            </mesh>
          </group>
        </group>
      ))}

      {/* Landing Gear / Legs */}
      {[
        [0.3, 0.3],
        [-0.3, 0.3],
        [0.3, -0.3],
        [-0.3, -0.3],
      ].map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, -0.2, z]}
          rotation={[x > 0 ? -0.2 : 0.2, 0, z > 0 ? 0.2 : -0.2]}
        >
          <cylinderGeometry args={[0.02, 0.01, 0.4, 8]} />
          <meshStandardMaterial color="#333" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── DOF Post-processing (Feature 7) ─── */
function FocalBlurEffect() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Disable on low-end devices
    const isLowEnd =
      window.innerWidth < 768 ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
    if (isLowEnd) setEnabled(false);
  }, []);

  if (!enabled) return null;

  return (
    <EffectComposer multisampling={0}>
      <DepthOfField
        focusDistance={0.02}
        focalLength={0.05}
        bokehScale={2}
        height={360}
      />
    </EffectComposer>
  );
}

/* ─── Main DroneMesh Component ─── */
export default function DroneMesh({ isNarrative = false }) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 40 }}
        dpr={[1, 1.25]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        {/* Feature 6: Dynamic lighting based on mode */}
        <ambientLight intensity={isNarrative ? 0.1 : 0.8} />
        {!isNarrative && (
          <>
            <directionalLight position={[10, 15, 10]} intensity={2} />
            <directionalLight position={[-10, -10, -10]} intensity={0.5} />
          </>
        )}

        {/* Feature 6: Spotlight in narrative mode */}
        <SpotlightFollower isNarrative={isNarrative} />

        <Drone />

        {/* Feature 7: Focal Blur */}
        <FocalBlurEffect />
      </Canvas>
    </div>
  );
}
