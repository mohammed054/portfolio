// src/states/RoutingState.jsx

import { useRef, useMemo, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useExperience } from '../core/ExperienceProvider'
import {
  STATES,
  COLORS,
  COLOR_STATE,
  DATA_FLOW,
  MOTION,
} from '../config/variables'
import { clamp, lerp } from '../utils/math'

// ─── Topology ─────────────────────────────────────────────────────────────────
// All positions align to grid (GRID.spacing = 40 from variables)
// Nodes are staggered across Z-axis to give camera a traversal path

const NODES = [
  { id: 'FRONTEND', pos: new THREE.Vector3(-60,  0,  20), w: 28, h: 14, d: 1.5 },
  { id: 'API',      pos: new THREE.Vector3(  0,  0,   0), w: 24, h: 12, d: 1.5 },
  { id: 'AUTH',     pos: new THREE.Vector3( 60,  0, -20), w: 24, h: 12, d: 1.5 },
  { id: 'BACKEND',  pos: new THREE.Vector3(  0,  0, -40), w: 28, h: 14, d: 1.5 },
  { id: 'DATABASE', pos: new THREE.Vector3(-60,  0, -60), w: 28, h: 14, d: 1.5 },
  { id: 'QUEUE',    pos: new THREE.Vector3( 60,  0, -80), w: 24, h: 12, d: 1.5 },
]

// Directed connections [fromIdx, toIdx]
const CONNECTIONS = [
  [0, 1], // FRONTEND → API
  [1, 2], // API      → AUTH
  [1, 3], // API      → BACKEND
  [3, 4], // BACKEND  → DATABASE
  [3, 5], // BACKEND  → QUEUE
]

// ─── Packet Constants ─────────────────────────────────────────────────────────

const PACKET_COUNT  = 4
const TOTAL_PACKETS = CONNECTIONS.length * PACKET_COUNT
const PACKET_SZ     = DATA_FLOW.size
const BASE_SPEED    = DATA_FLOW.speedBase
const SPEED_VAR     = DATA_FLOW.speedVariance

// Deterministic speed variance per connection — controlled imperfection, no randomness
const CONN_SPEEDS = CONNECTIONS.map((_, i) =>
  BASE_SPEED + (((i * 7 + 3) % 5) / 5 - 0.5) * SPEED_VAR
)

// ─── Color Constants ──────────────────────────────────────────────────────────

const COL_DATA     = new THREE.Color(COLORS.data)
const COL_PANEL    = new THREE.Color(COLORS.panel)
const COL_EDGE     = new THREE.Color(COLORS.structure)
const COL_EDGE_ACT = new THREE.Color(COLORS.data)

// ─── State T Computation ──────────────────────────────────────────────────────
// Fade in over first 15% of state range, fade out over last 15%
// Ensures smooth entry from Identifying and smooth exit into Executing

function computeStateT(progress) {
  const { start, end } = STATES.ROUTING
  const raw   = clamp((progress - start) / (end - start), 0, 1)
  const fadeW = 0.15
  return Math.min(clamp(raw / fadeW, 0, 1), clamp((1 - raw) / fadeW, 0, 1))
}

// ─── NodePanel ────────────────────────────────────────────────────────────────
// Flat rectangular panel with EdgesGeometry outline and monospace label
// No spheres. No soft geometry. Hard edges only.

function NodePanel({ node, stateT, isActive, onHover, onUnhover }) {
  const surfRef = useRef()
  const edgeRef = useRef()

  const edgesGeo = useMemo(() => {
    return new THREE.EdgesGeometry(new THREE.BoxGeometry(node.w, node.h, node.d))
  }, [node.w, node.h, node.d])

  useFrame(() => {
    if (surfRef.current) {
      surfRef.current.opacity = lerp(
        surfRef.current.opacity,
        stateT * 0.85,
        MOTION.medium
      )
    }

    if (edgeRef.current) {
      const targetOpacity = isActive ? stateT * 1.0 : stateT * 0.35
      edgeRef.current.opacity = lerp(edgeRef.current.opacity, targetOpacity, MOTION.medium)
      edgeRef.current.color.lerp(isActive ? COL_EDGE_ACT : COL_EDGE, MOTION.medium)
    }
  })

  return (
    <group position={node.pos}>
      {/* Panel surface — dark, near-invisible, defines volume */}
      <mesh
        onPointerEnter={(e) => { e.stopPropagation(); onHover(node.id) }}
        onPointerLeave={() => onUnhover(node.id)}
      >
        <boxGeometry args={[node.w, node.h, node.d]} />
        <meshBasicMaterial
          ref={surfRef}
          color={COL_PANEL}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Edge outline — the primary visual element */}
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial
          ref={edgeRef}
          color={COL_EDGE}
          transparent
          opacity={0}
        />
      </lineSegments>

      {/* System label — architectural scale, monospace, embedded in space */}
      <Text
        position={[0, 0, node.d * 0.5 + 0.4]}
        fontSize={2.0}
        letterSpacing={0.12}
        color={COLORS.structure}
        anchorX="center"
        anchorY="middle"
        fillOpacity={stateT * 0.85}
        renderOrder={1}
        depthOffset={-1}
      >
        {node.id}
      </Text>
    </group>
  )
}

// ─── TraceLine ────────────────────────────────────────────────────────────────
// Directional line between two nodes
// Active state (hover) raises opacity dramatically — makes routing legible

function TraceLine({ fromNode, toNode, stateT, isActive }) {
  const matRef = useRef()

  // Positions baked at construction — traces are static geometry
  const positions = useMemo(() => {
    const arr = new Float32Array(6)
    arr[0] = fromNode.pos.x; arr[1] = fromNode.pos.y; arr[2] = fromNode.pos.z
    arr[3] = toNode.pos.x;   arr[4] = toNode.pos.y;   arr[5] = toNode.pos.z
    return arr
  }, [fromNode, toNode])

  useFrame(() => {
    if (!matRef.current) return
    const target = isActive ? stateT * 0.9 : stateT * 0.18
    matRef.current.opacity = lerp(matRef.current.opacity, target, MOTION.medium)
  })

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial ref={matRef} color={COLORS.data} transparent opacity={0} />
    </line>
  )
}

// ─── PacketFlow ───────────────────────────────────────────────────────────────
// Instanced small squares traveling along all traces simultaneously
// Speeds are deterministically varied per connection — feel routed, not animated
// Uses clock.elapsedTime for continuous travel — gated by stateT for visibility

function PacketFlow({ stateT }) {
  const meshRef = useRef()
  const dummy   = useMemo(() => new THREE.Object3D(), [])

  const geo = useMemo(() => new THREE.BoxGeometry(PACKET_SZ, PACKET_SZ, PACKET_SZ), [])
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: COL_DATA,
    transparent: true,
    opacity: 0,
  }), [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const t   = clock.elapsedTime
    let   idx = 0

    for (let ci = 0; ci < CONNECTIONS.length; ci++) {
      const [fi, ti] = CONNECTIONS[ci]
      const from     = NODES[fi].pos
      const to       = NODES[ti].pos
      const speed    = CONN_SPEEDS[ci]

      for (let p = 0; p < PACKET_COUNT; p++) {
        const phase = p / PACKET_COUNT
        const u     = (t * speed * 0.1 + phase) % 1.0

        dummy.position.lerpVectors(from, to, u)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(idx, dummy.matrix)
        idx++
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true

    // Opacity is driven by stateT — packets appear and disappear with the state
    mat.opacity = lerp(mat.opacity, stateT * COLOR_STATE.ROUTING.data, MOTION.medium)
  })

  return (
    <instancedMesh ref={meshRef} args={[geo, mat, TOTAL_PACKETS]} />
  )
}

// ─── RoutingState ─────────────────────────────────────────────────────────────
// Always mounted. Never unmounts.
// Visibility and all visual state derive from progress.
// Hover state is the only non-progress input — triggers connection highlighting.

export function RoutingState() {
  const { progress }  = useExperience()
  const [hoveredId, setHoveredId] = useState(null)

  const stateT = computeStateT(progress)

  // Derive which nodes and connections are active based on hover
  const { activeNodeIds, activeConnIds } = useMemo(() => {
    if (!hoveredId) return { activeNodeIds: new Set(), activeConnIds: new Set() }

    const nodeIds = new Set([hoveredId])
    const connIds = new Set()

    CONNECTIONS.forEach(([fi, ti], ci) => {
      if (NODES[fi].id === hoveredId || NODES[ti].id === hoveredId) {
        connIds.add(ci)
        nodeIds.add(NODES[fi].id)
        nodeIds.add(NODES[ti].id)
      }
    })

    return { activeNodeIds: nodeIds, activeConnIds: connIds }
  }, [hoveredId])

  const handleHover   = useCallback((id) => setHoveredId(id), [])
  const handleUnhover = useCallback((id) =>
    setHoveredId(prev => prev === id ? null : prev), [])

  return (
    <group visible={stateT > 0.001}>
      {/* Node panels */}
      {NODES.map(node => (
        <NodePanel
          key={node.id}
          node={node}
          stateT={stateT}
          isActive={activeNodeIds.has(node.id)}
          onHover={handleHover}
          onUnhover={handleUnhover}
        />
      ))}

      {/* Directed trace connections */}
      {CONNECTIONS.map(([fi, ti], ci) => (
        <TraceLine
          key={ci}
          fromNode={NODES[fi]}
          toNode={NODES[ti]}
          stateT={stateT}
          isActive={activeConnIds.has(ci)}
        />
      ))}

      {/* Instanced packet flow along all traces */}
      <PacketFlow stateT={stateT} />
    </group>
  )
}
