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
    varying vec2 vUv;
    varying float vFractal;
    
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - 0.5;
      
      i = mod289(i);
      vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
      return 0.0;
    }
    
    vec4 permute(vec4 x) {
      return mod289(((x*34.0)+1.0)*x);
    }
    
    void main() {
      vUv = uv;
      
      float fractal = sin(position.x * 2.0 + uTime * 0.3) * 0.1;
      fractal += cos(position.y * 2.0 + uTime * 0.4) * 0.1;
      fractal += sin(position.z * 2.0 + uTime * 0.2) * 0.1;
      vFractal = fractal;
      
      vec3 newPosition = position + normal * fractal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `

  const fragmentShader = `
    varying vec2 vUv;
    varying float vFractal;
    
    void main() {
      vec3 color = vec3(0.1, 0.3, 0.8);
      
      // Cyan accent based on fractal
      color.g += vFractal * 0.5;
      color.b += vFractal * 0.4;
      
      // Checkerboard pattern
      float checker = mod(vUv.x * 8.0 + vUv.y * 8.0, 2.0);
      color = mix(color, color * 1.2, step(0.5, checker));
      
      gl_FragColor = vec4(color, 0.75);
    }
  `

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta
      materialRef.current.uniforms.uMouse.value = [pointer.x, pointer.y]
    }

    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.02
      meshRef.current.rotation.y += delta * 0.06
      meshRef.current.rotation.z = MathUtils.lerp(meshRef.current.rotation.z, pointer.x * 0.2, 0.06)
      
      // Floating motion
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2.2, 2.2, 2.2, 32, 32, 32]} />
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
      <CubeCluster />
    </Canvas>
  )
}
