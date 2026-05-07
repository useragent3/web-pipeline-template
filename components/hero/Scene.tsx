'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { useRef, useMemo, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'

// ─── Camera keyframes (spec §5) ────────────────────────────────────────────────
// Each entry: { t: scroll progress 0–1, pos: world-space camera position }
// Look-at is always [0, 0, 0].
const CAMERA_KEYFRAMES: { t: number; pos: THREE.Vector3 }[] = [
  { t: 0.00, pos: new THREE.Vector3( 0.0,  1.5, 6.0) },
  { t: 0.25, pos: new THREE.Vector3( 1.8,  0.8, 5.5) },
  { t: 0.35, pos: new THREE.Vector3( 2.0,  0.5, 5.0) },
  { t: 0.50, pos: new THREE.Vector3( 2.0,  0.5, 5.0) },
  { t: 0.62, pos: new THREE.Vector3(-1.5,  1.0, 4.5) },
  { t: 0.65, pos: new THREE.Vector3(-1.8,  0.8, 4.2) },
  { t: 0.80, pos: new THREE.Vector3(-1.8,  0.8, 4.2) },
  { t: 1.00, pos: new THREE.Vector3( 0.0,  0.5, 5.2) },
]

function getCameraPosition(t: number): THREE.Vector3 {
  const kfs = CAMERA_KEYFRAMES
  if (t <= kfs[0].t) return kfs[0].pos.clone()
  if (t >= kfs[kfs.length - 1].t) return kfs[kfs.length - 1].pos.clone()
  for (let i = 0; i < kfs.length - 1; i++) {
    if (t >= kfs[i].t && t <= kfs[i + 1].t) {
      const alpha = (t - kfs[i].t) / (kfs[i + 1].t - kfs[i].t)
      return kfs[i].pos.clone().lerp(kfs[i + 1].pos, alpha)
    }
  }
  return kfs[0].pos.clone()
}

// ─── Reduced-motion hook ────────────────────────────────────────────────────────
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

// ─── Three-point lighting (spec §4) ────────────────────────────────────────────
function HeroLighting() {
  return (
    <>
      {/* Key — warm front-left */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.4}
        color="#FFF5E0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Fill — cool right */}
      <directionalLight position={[-3, 2, 2]} intensity={0.5} color="#C0D8FF" />
      {/* Rim — back highlight */}
      <directionalLight position={[0, -2, -4]} intensity={0.8} color="#8AB4F8" />
      {/* Ambient */}
      <ambientLight intensity={0.15} />
    </>
  )
}

// ─── Hero mesh — TorusKnot placeholder (spec §3) ────────────────────────────────
function HeroMesh({ reduced, lowPerf }: { reduced: boolean; lowPerf: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (reduced || !meshRef.current) return
    meshRef.current.rotation.y += delta * 0.15
  })

  return (
    <mesh ref={meshRef} castShadow>
      <torusKnotGeometry args={[1, 0.35, lowPerf ? 128 : 200, 16]} />
      <meshStandardMaterial
        color="#C8D0E8"
        metalness={0.45}
        roughness={0.28}
        envMapIntensity={1.0}
      />
    </mesh>
  )
}

// ─── Scroll-driven camera ───────────────────────────────────────────────────────
function ScrollCamera({
  progressRef,
  reduced,
}: {
  progressRef: MutableRefObject<number>
  reduced: boolean
}) {
  const { camera } = useThree()
  const targetPos = useMemo(() => new THREE.Vector3(), [])
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0, 0), [])

  useFrame(() => {
    if (reduced) return
    const desired = getCameraPosition(progressRef.current)
    targetPos.copy(desired)
    camera.position.lerp(targetPos, 0.06)
    camera.lookAt(lookTarget)
  })

  return null
}

// ─── Scene content ───────────────────────────────────────────────────────────────
function SceneContent({
  progressRef,
  lowPerf,
  onDecline,
}: {
  progressRef: MutableRefObject<number>
  lowPerf: boolean
  onDecline: () => void
}) {
  const reduced = usePrefersReducedMotion()

  return (
    <>
      <color attach="background" args={['#050508']} />
      <PerformanceMonitor onDecline={onDecline} />
      <HeroLighting />
      <HeroMesh reduced={reduced} lowPerf={lowPerf} />
      <ScrollCamera progressRef={progressRef} reduced={reduced} />
    </>
  )
}

// ─── Public Scene export ─────────────────────────────────────────────────────────
export default function Scene({
  progressRef,
}: {
  progressRef: MutableRefObject<number>
}) {
  const [lowPerf, setLowPerf] = useState(false)
  const handleDecline = useCallback(() => setLowPerf(true), [])

  return (
    <Canvas
      camera={{ fov: 45, position: [0, 1.5, 6], near: 0.1, far: 100 }}
      dpr={lowPerf ? [1, 1] : [1, 1.5]}
      gl={{ antialias: !lowPerf, alpha: false, powerPreference: 'high-performance' }}
      shadows={!lowPerf}
      aria-hidden="true"
    >
      <SceneContent
        progressRef={progressRef}
        lowPerf={lowPerf}
        onDecline={handleDecline}
      />
    </Canvas>
  )
}
