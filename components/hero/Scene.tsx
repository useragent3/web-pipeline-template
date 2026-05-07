'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useMemo, useEffect, useState } from 'react'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'

// Camera path through the scene
const CAMERA_CURVE_POINTS = [
  new THREE.Vector3(0, 0, 6),
  new THREE.Vector3(1.5, 0.5, 4.5),
  new THREE.Vector3(-1, 1, 3),
  new THREE.Vector3(0, 0.5, 2),
]

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

function HeroMesh({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (reduced || !groupRef.current) return
    groupRef.current.rotation.x += delta * 0.08
    groupRef.current.rotation.y += delta * 0.12
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <torusKnotGeometry args={[1, 0.3, 160, 16]} />
        <meshStandardMaterial
          color="#0f1628"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
      {/* Accent wireframe overlay */}
      <mesh scale={1.012}>
        <torusKnotGeometry args={[1, 0.3, 160, 16]} />
        <meshBasicMaterial
          color="#4a80f5"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>
    </group>
  )
}

function CameraRig({
  progressRef,
  reduced,
}: {
  progressRef: MutableRefObject<number>
  reduced: boolean
}) {
  const { camera } = useThree()
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(CAMERA_CURVE_POINTS),
    []
  )
  const targetPos = useMemo(() => new THREE.Vector3(), [])
  const origin = useMemo(() => new THREE.Vector3(0, 0, 0), [])

  useFrame(() => {
    if (reduced) return
    const t = progressRef.current
    curve.getPoint(t, targetPos)
    camera.position.lerp(targetPos, 0.06)
    camera.lookAt(origin)
  })

  return null
}

function SceneContent({
  progressRef,
}: {
  progressRef: MutableRefObject<number>
}) {
  const reduced = usePrefersReducedMotion()

  return (
    <>
      <color attach="background" args={['#050508']} />
      <ambientLight intensity={0.25} />
      <pointLight position={[8, 10, 8]} intensity={60} color="#4a80f5" />
      <pointLight position={[-10, -6, -6]} intensity={30} color="#8b4cf5" />
      <pointLight position={[0, -4, 6]} intensity={20} color="#f5f5ff" />
      <HeroMesh reduced={reduced} />
      <CameraRig progressRef={progressRef} reduced={reduced} />
    </>
  )
}

export default function Scene({
  progressRef,
}: {
  progressRef: MutableRefObject<number>
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <SceneContent progressRef={progressRef} />
    </Canvas>
  )
}
