"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { MathUtils } from "three"
import type { Mesh, ShaderMaterial } from "three"

function Polyhedron() {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<ShaderMaterial>(null)
  const { pointer } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: [0, 0] },
    }),
    [],
  )

  const vertexShader = `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vPulse;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      // Pulsing displacement
      float pulse = sin(uTime * 1.5 + length(position)) * 0.12;
      pulse += cos(uTime * 0.8) * 0.08;
      vPulse = pulse;
      
      vec3 newPosition = position + normal * pulse;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `

  const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vPulse;
    
    void main() {
      // Depth-based shading
      float depth = vNormal.z * 0.5 + 0.5;
      vec3 baseColor = vec3(
        0.2 + depth * 0.5,
        0.3 + depth * 0.4,
        0.5 + depth * 0.3
      );
      
      // Add pulse effect
      baseColor += vec3(vPulse * 0.3);
      
      // Grid pattern overlaid
      float grid = mod(vUv.x * 12.0, 1.0);
      grid = smoothstep(0.0, 0.05, grid) * smoothstep(0.15, 0.1, grid);
      grid += mod(vUv.y * 12.0, 1.0);
      grid = smoothstep(0.0, 0.05, grid) * smoothstep(0.15, 0.1, grid);
      
      baseColor += grid * 0.2;
      
      gl_FragColor = vec4(baseColor, 0.7);
    }
  `

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta
      materialRef.current.uniforms.uMouse.value = [pointer.x, pointer.y]
    }

    if (meshRef.current) {
      meshRef.current.rotation.x = MathUtils.lerp(meshRef.current.rotation.x, pointer.y * 0.3, 0.08)
      meshRef.current.rotation.y += delta * 0.04
      meshRef.current.rotation.z = MathUtils.lerp(meshRef.current.rotation.z, pointer.x * 0.3, 0.08)
    }
  })

  return (
    <mesh ref={meshRef}>
      <dodecahedronGeometry args={[2, 0]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  )
}

export function Mesh3DPolyhedron() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-64 h-64 rounded-full border border-white/10 animate-pulse" />
      </div>
    )
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      className="w-full my-0 h-full py-0"
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
      }}
    >
      <ambientLight intensity={0.7} />
      <Polyhedron />
    </Canvas>
  )
}
