"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function NetworkNodes() {
  const groupRef = useRef();
  const nodesCount = 40;
  const connectDistance = 2.8;

  const { positions, linePositions } = useMemo(() => {
    const pos = [];
    for (let i = 0; i < nodesCount; i++) {
      pos.push([
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
      ]);
    }

    const lines = [];
    for (let i = 0; i < nodesCount; i++) {
      for (let j = i + 1; j < nodesCount; j++) {
        const dist = Math.sqrt(
          (pos[i][0] - pos[j][0]) ** 2 +
            (pos[i][1] - pos[j][1]) ** 2 +
            (pos[i][2] - pos[j][2]) ** 2
        );
        if (dist < connectDistance) {
          lines.push(pos[i][0], pos[i][1], pos[i][2]);
          lines.push(pos[j][0], pos[j][1], pos[j][2]);
        }
      }
    }

    return { positions: pos, linePositions: new Float32Array(lines) };
  }, []);

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
