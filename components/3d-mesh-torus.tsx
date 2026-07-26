"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { MathUtils } from "three"
import type { Mesh, ShaderMaterial } from "three"

function TorusMesh() {
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
    uniform vec2 uMouse;
    varying vec2 vUv;
    varying float vWave;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      // Multi-layered wave displacement
      float wave = sin(position.x * 3.0 + uTime * 0.5) * 0.12;
      wave += cos(position.y * 3.0 + uTime * 0.3) * 0.12;
      wave += sin(position.z * 2.0 + uTime * 0.4) * 0.1;
      
      // Mouse influence
      wave += sin(uMouse.x * 3.14159 * 2.0 + position.x) * 0.05;
      
      // Secondary pulse layer
      float pulse = sin(uTime * 1.5 + length(position)) * 0.08;
      wave += pulse;
      
      vWave = wave;
      
      vec3 newPosition = position + normal * wave;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `

  const fragmentShader = `
    varying vec2 vUv;
    varying float vWave;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      // Depth-based shading
      float depth = vNormal.z * 0.5 + 0.5;
      float intensity = 0.35 + depth * 0.3 + vWave * 1.8;
      
      vec3 color = vec3(
        intensity * 0.5 + depth * 0.3,
        intensity * 0.75 + depth * 0.25,
        intensity * 0.95
      );
      
      // Multi-layer radial pattern
      float radial = length(vUv - 0.5);
      float lines = mod(radial * 20.0 + vUv.x * 12.0, 1.0);
      lines = smoothstep(0.0, 0.08, lines) * smoothstep(0.2, 0.15, lines);
      
      float rings = mod(radial * 10.0, 1.0);
      rings = smoothstep(0.0, 0.05, rings) * smoothstep(0.1, 0.08, rings);
      
      color += lines * 0.35 + rings * 0.25;
      
      // Fresnel effect
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
      color += fresnel * 0.2;
      
      gl_FragColor = vec4(color, 0.72);
    }
  `

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta
      materialRef.current.uniforms.uMouse.value = [pointer.x, pointer.y]
    }

    if (meshRef.current) {
      // Multi-axis rotation with mouse influence
      meshRef.current.rotation.x += delta * 0.04
      meshRef.current.rotation.y += delta * 0.11
      meshRef.current.rotation.z = MathUtils.lerp(meshRef.current.rotation.z, pointer.x * 0.25, 0.06)
      
      // Subtle scale pulsing
      const scale = 1.0 + Math.sin(state.clock.elapsedTime * 1.2) * 0.02
      meshRef.current.scale.setScalar(scale)
      
      // Vertical float
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.15
    }
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[2.2, 0.9, 64, 200]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        wireframe={false}
      />
    </mesh>
  )
}

export function Mesh3DTorus() {
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 5, 3]} intensity={0.5} />
      <pointLight position={[0, 0, 8]} intensity={0.3} color="#2563eb" />
      <TorusMesh />
    </Canvas>
  )
}
