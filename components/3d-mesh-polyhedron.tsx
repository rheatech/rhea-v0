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
    uniform vec2 uMouse;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vPulse;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      // Multi-frequency pulsing
      float pulse = sin(uTime * 1.8 + length(position)) * 0.14;
      pulse += cos(uTime * 0.9) * 0.1;
      pulse += sin(uTime * 2.5 + position.x) * 0.08;
      
      // Mouse-responsive deformation
      pulse += cos(uMouse.x * 3.14159 + position.y) * 0.07;
      pulse += sin(uMouse.y * 3.14159 + position.z) * 0.07;
      
      vPulse = pulse;
      
      vec3 newPosition = position + normal * pulse;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `

  const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vPulse;
    varying vec3 vPosition;
    
    void main() {
      // Complex depth shading with normals
      float depth = vNormal.z * 0.5 + 0.5;
      float normalBright = length(vNormal) * 0.3;
      
      float intensity = 0.2 + depth * 0.3 + normalBright * 0.15 + vPulse * 0.3;
      vec3 baseColor = vec3(intensity);
      
      // Premium grid pattern for enterprise look
      float gridX = mod(vUv.x * 24.0, 1.0);
      gridX = smoothstep(0.0, 0.035, gridX) * smoothstep(0.11, 0.075, gridX);
      
      float gridY = mod(vUv.y * 24.0, 1.0);
      gridY = smoothstep(0.0, 0.035, gridY) * smoothstep(0.11, 0.075, gridY);
      
      float grid = gridX + gridY;
      baseColor += grid * 0.2;
      
      // Subtle fresnel for definition
      float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.5);
      baseColor += fresnel * 0.12;
      
      gl_FragColor = vec4(baseColor, 0.68);
    }
  `

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta
      materialRef.current.uniforms.uMouse.value = [pointer.x, pointer.y]
    }

    if (meshRef.current) {
      // Responsive rotation to mouse
      meshRef.current.rotation.x = MathUtils.lerp(meshRef.current.rotation.x, pointer.y * 0.4, 0.1)
      meshRef.current.rotation.y += delta * 0.06
      meshRef.current.rotation.z = MathUtils.lerp(meshRef.current.rotation.z, pointer.x * 0.4, 0.1)
      
      // Scale pulse effect
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 0.9) * 0.025
      meshRef.current.scale.setScalar(pulse)
      
      // Complex 3D floating motion
      meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
      meshRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.7) * 0.25
      meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.15
    }
  })

  return (
    <mesh ref={meshRef}>
      <dodecahedronGeometry args={[2.2, 2]} />
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
      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 6, 4]} intensity={0.55} color="#ffffff" />
      <Polyhedron />
    </Canvas>
  )
}
