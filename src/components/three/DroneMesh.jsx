"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function Drone() {
  const groupRef = useRef();
  const propRefs = useRef([]);

  useFrame((state) => {
    if (groupRef.current) {
      // Spin the entire drone slowly
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
      // Tilt it slightly forward (top view)
      groupRef.current.rotation.x = Math.PI / 6;
      // Bob up and down for hovering effect
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }

    // Spin the propellers really fast!
    propRefs.current.forEach((prop, i) => {
      if (prop) {
        // Alternate spin directions
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

export default function DroneMesh() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.8} />
        {/* Bright angular light to highlight the metallic surfaces */}
        <directionalLight position={[10, 15, 10]} intensity={2} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />
        <Drone />
      </Canvas>
    </div>
  );
}
