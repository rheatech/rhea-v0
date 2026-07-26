"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { MathUtils } from "three"
import type { Mesh, ShaderMaterial } from "three"

function CubeCluster() {
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
      float wave = sin(position.x * 2.5 + uTime * 0.4) * 0.12;
      wave += cos(position.y * 2.5 + uTime * 0.35) * 0.12;
      wave += sin(position.z * 2.5 + uTime * 0.3) * 0.1;
      
      // Mouse-driven deformation
      wave += sin(uMouse.x * 6.28318 + position.x) * 0.08;
      wave += cos(uMouse.y * 6.28318 + position.y) * 0.08;
      
      // Secondary harmonic pulse
      float pulse = sin(uTime * 2.2 + length(position) * 1.5) * 0.1;
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
      // Premium grayscale shading
      float depth = vNormal.z * 0.5 + 0.5;
      float intensity = 0.2 + depth * 0.25 + vWave * 0.8;
      
      vec3 color = vec3(intensity);
      
      // Premium checkerboard pattern
      float checkerX = mod(vUv.x * 18.0, 2.0);
      float checkerY = mod(vUv.y * 18.0, 2.0);
      float checker = step(1.0, checkerX + checkerY) * 2.0 - 1.0;
      checker = mix(0.85, 1.15, checker * 0.5 + 0.5);
      color *= checker;
      
      // Subtle edge definition
      float edge = abs(mod(vUv.x * 9.0, 1.0) - 0.5) * 2.0;
      edge = min(edge, abs(mod(vUv.y * 9.0, 1.0) - 0.5) * 2.0);
      edge = smoothstep(0.0, 0.25, edge);
      color += (1.0 - edge) * 0.1;
      
      // Subtle fresnel for edge definition
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
      color += fresnel * 0.1;
      
      gl_FragColor = vec4(color, 0.72);
    }
  `

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta
      materialRef.current.uniforms.uMouse.value = [pointer.x, pointer.y]
    }

    if (meshRef.current) {
      // Responsive multi-axis rotation
      meshRef.current.rotation.x += delta * 0.035
      meshRef.current.rotation.y += delta * 0.09
      meshRef.current.rotation.z = MathUtils.lerp(meshRef.current.rotation.z, pointer.x * 0.35, 0.08)
      
      // Mouse Y influences X rotation
      meshRef.current.rotation.x = MathUtils.lerp(meshRef.current.rotation.x, pointer.y * 0.3, 0.05)
      
      // Complex floating motion in 3D space
      meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.25
      meshRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.8) * 0.3
      meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.2
      
      // Scale pulse effect
      const scale = 1.0 + Math.sin(state.clock.elapsedTime * 1.3) * 0.03
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2.4, 2.4, 2.4, 64, 64, 64]} />
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

export function Mesh3DCube() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-64 h-64 border border-white/10 animate-pulse" />
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
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
      <CubeCluster />
    </Canvas>
  )
}
