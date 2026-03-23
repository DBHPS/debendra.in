"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function Drone() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <group ref={groupRef} scale={0.8}>
      {/* Main body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.15, 0.6]} />
        <meshStandardMaterial color="#8B7E74" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Arms */}
      {[
        [0.6, 0, 0.6],
        [-0.6, 0, 0.6],
        [0.6, 0, -0.6],
        [-0.6, 0, -0.6],
      ].map((pos, i) => (
        <group key={i}>
          <mesh position={[pos[0] * 0.5, 0, pos[2] * 0.5]} rotation={[0, Math.atan2(pos[0], pos[2]), 0]}>
            <boxGeometry args={[0.08, 0.06, 0.7]} />
            <meshStandardMaterial color="#A09890" roughness={0.5} />
          </mesh>
          {/* Rotors */}
          <mesh position={pos} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.02, 8, 24]} />
            <meshStandardMaterial color="#C8BFB6" roughness={0.3} metalness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Landing gear */}
      {[-0.25, 0.25].map((x, i) => (
        <mesh key={i} position={[x, -0.15, 0]}>
          <boxGeometry args={[0.04, 0.12, 0.5]} />
          <meshStandardMaterial color="#A09890" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export default function DroneMesh() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Drone />
      </Canvas>
    </div>
  );
}
