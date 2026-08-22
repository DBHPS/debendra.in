"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODES_COUNT = 40;
const CONNECT_DISTANCE = 2.8;

/* The node cloud is built once at module load rather than during render.
   Calling Math.random() while rendering is impure: React may re-run the render
   and silently reshuffle the whole mesh. */
const NETWORK = (() => {
  const pos = [];
  for (let i = 0; i < NODES_COUNT; i++) {
    pos.push([
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 6,
    ]);
  }

  const lines = [];
  for (let i = 0; i < NODES_COUNT; i++) {
    for (let j = i + 1; j < NODES_COUNT; j++) {
      const dist = Math.sqrt(
        (pos[i][0] - pos[j][0]) ** 2 +
          (pos[i][1] - pos[j][1]) ** 2 +
          (pos[i][2] - pos[j][2]) ** 2
      );
      if (dist < CONNECT_DISTANCE) {
        lines.push(pos[i][0], pos[i][1], pos[i][2]);
        lines.push(pos[j][0], pos[j][1], pos[j][2]);
      }
    }
  }

  return { positions: pos, linePositions: new Float32Array(lines) };
})();

function NetworkNodes() {
  const groupRef = useRef();
  const { positions, linePositions } = NETWORK;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    return geo;
  }, [linePositions]);

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#94A3B8" opacity={0.5} transparent />
        </mesh>
      ))}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#CBD5E1" opacity={0.2} transparent />
      </lineSegments>
    </group>
  );
}

export default function NetworkWireframe() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <NetworkNodes />
      </Canvas>
    </div>
  );
}
