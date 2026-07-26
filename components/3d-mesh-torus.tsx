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
    varying vec2 vUv;
    varying float vWave;
    
    void main() {
      vUv = uv;
      
      // Wave displacement based on position and time
      float wave = sin(position.x * 3.0 + uTime * 0.5) * 0.1;
      wave += cos(position.y * 3.0 + uTime * 0.3) * 0.1;
      wave += sin(position.z * 2.0 + uTime * 0.4) * 0.08;
      
      vWave = wave;
      
      vec3 newPosition = position + normal * wave;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `

  const fragmentShader = `
    varying vec2 vUv;
    varying float vWave;
    
    void main() {
      float intensity = 0.4 + vWave * 1.5;
      vec3 color = vec3(intensity * 0.6, intensity * 0.8, intensity);
      
      // Radial lines pattern
      float radial = length(vUv - 0.5);
      float lines = mod(radial * 15.0 + vUv.x * 10.0, 1.0);
      lines = smoothstep(0.0, 0.1, lines) * smoothstep(0.3, 0.2, lines);
      
      color += lines * 0.3;
      gl_FragColor = vec4(color, 0.65);
    }
  `

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta
      materialRef.current.uniforms.uMouse.value = [pointer.x, pointer.y]
    }

    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.03
      meshRef.current.rotation.y += delta * 0.08
      meshRef.current.rotation.z = MathUtils.lerp(meshRef.current.rotation.z, pointer.x * 0.15, 0.05)
    }
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[2, 0.8, 32, 100]} />
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
      <ambientLight intensity={0.6} />
      <TorusMesh />
    </Canvas>
  )
}
