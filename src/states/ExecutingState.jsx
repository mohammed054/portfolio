// src/states/ExecutingState.jsx

import { useRef, useMemo } from 'react'
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

// ─── Sub-system progress ranges within EXECUTING (0.50 → 0.75) ───────────────

const SYS = {
  PIPELINE:  { start: 0.500, end: 0.583 },
  COMPONENT: { start: 0.583, end: 0.667 },
  DATA:      { start: 0.667, end: 0.750 },
}

// ─── Colors ───────────────────────────────────────────────────────────────────

const COL_DATA  = new THREE.Color(COLORS.data)
const COL_PANEL = new THREE.Color(COLORS.panel)
const COL_EDGE  = new THREE.Color(COLORS.structure)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeLocalT(progress, start, end) {
  return clamp((progress - start) / (end - start), 0, 1)
}

// Each system: 0→0.20 = entry, 0.20→0.80 = active, 0.80→1.0 = exit
function getPhases(t) {
  return {
    entryT:  clamp(t / 0.20, 0, 1),
    activeT: clamp((t - 0.20) / 0.60, 0, 1),
    exitT:   clamp((t - 0.80) / 0.20, 0, 1),
  }
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3)
}

// Overall visibility envelope — fades in on entry, holds, fades on exit
function phaseVis(entryT, exitT) {
  return easeOut(entryT) * (1 - exitT)
}

// ─── PIPELINE SYSTEM ─────────────────────────────────────────────────────────
// Four vertical processing stages. Packets travel top → bottom continuously.
// Stages appear sequentially during entry (staggered). Exit: surfaces first, edges lag.

const PIPE_Z       = -110
const PIPE_STAGES  = ['RECEIVE', 'VALIDATE', 'TRANSFORM', 'RESPOND']
const PIPE_STAGE_Y = [24, 8, -8, -24]
const PIPE_SIZE    = [36, 10, 1.5]
const PIPE_PKT_CNT = 3

function PipelineSystem({ progress }) {
  const t                          = computeLocalT(progress, SYS.PIPELINE.start, SYS.PIPELINE.end)
  const { entryT, activeT, exitT } = getPhases(t)
  const vis                        = phaseVis(entryT, exitT)

  // Refs bridge reactive render values into useFrame (avoids stale closures)
  const visRef    = useRef(0)
  const entryRef  = useRef(0)
  const activeRef = useRef(0)
  visRef.current    = vis
  entryRef.current  = entryT
  activeRef.current = activeT

  const surfMats = useMemo(() =>
    PIPE_STAGES.map(() => new THREE.MeshBasicMaterial({
      color: COL_PANEL, transparent: true, opacity: 0, depthWrite: false,
    })), [])

  const edgeMats = useMemo(() =>
    PIPE_STAGES.map(() => new THREE.LineBasicMaterial({
      color: COL_EDGE.clone(), transparent: true, opacity: 0,
    })), [])

  const connMats = useMemo(() =>
    Array(PIPE_STAGES.length - 1).fill(0).map(() => new THREE.LineBasicMaterial({
      color: COLORS.data, transparent: true, opacity: 0,
    })), [])

  const edgesGeos = useMemo(() =>
    PIPE_STAGES.map(() =>
      new THREE.EdgesGeometry(new THREE.BoxGeometry(...PIPE_SIZE))), [])

  // Connector lines between adjacent stage panels
  const connGeos = useMemo(() =>
    PIPE_STAGE_Y.slice(0, -1).map((y, i) => {
      const geo = new THREE.BufferGeometry()
      geo.setFromPoints([
        new THREE.Vector3(0, y - PIPE_SIZE[1] * 0.5, 0),
        new THREE.Vector3(0, PIPE_STAGE_Y[i + 1] + PIPE_SIZE[1] * 0.5, 0),
      ])
      return geo
    }), [])

  const pktRef = useRef()
  const dummy  = useMemo(() => new THREE.Object3D(), [])
  const pktGeo = useMemo(() => new THREE.BoxGeometry(DATA_FLOW.size, DATA_FLOW.size, DATA_FLOW.size), [])
  const pktMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: COL_DATA, transparent: true, opacity: 0,
  }), [])

  useFrame(({ clock }) => {
    const v  = visRef.current
    const en = entryRef.current
    const ac = activeRef.current

    // Stage surfaces — staggered entry, each stage 0.08 entryT apart
    surfMats.forEach((mat, i) => {
      const stageT = clamp((en - i * 0.08) / 0.35, 0, 1)
      mat.opacity  = lerp(mat.opacity, v * easeOut(stageT) * 0.75, MOTION.medium)
    })

    // Stage edges — slightly faster than surfaces (edges define before surfaces fill)
    edgeMats.forEach((mat, i) => {
      const stageT = clamp((en - i * 0.06) / 0.35, 0, 1)
      mat.opacity  = lerp(mat.opacity, v * easeOut(stageT) * 0.45, MOTION.medium)
    })

    // Connector lines appear during active phase
    connMats.forEach(mat => {
      mat.opacity = lerp(mat.opacity, v * ac * 0.55, MOTION.medium)
    })

    // Packets travel top → bottom, 3 packets at staggered phases
    if (pktRef.current) {
      const yTop = PIPE_STAGE_Y[0] + 6
      const yBot = PIPE_STAGE_Y[PIPE_STAGES.length - 1] - 6

      for (let p = 0; p < PIPE_PKT_CNT; p++) {
        const phase = p / PIPE_PKT_CNT
        const u     = (clock.elapsedTime * DATA_FLOW.speedBase * 0.12 + phase) % 1.0
        dummy.position.set(0, yTop + (yBot - yTop) * u, 0)
        dummy.updateMatrix()
        pktRef.current.setMatrixAt(p, dummy.matrix)
      }
      pktRef.current.instanceMatrix.needsUpdate = true
      pktMat.opacity = lerp(pktMat.opacity, v * ac * COLOR_STATE.EXECUTING.data, MOTION.medium)
    }
  })

  return (
    <group position={[0, 0, PIPE_Z]} visible={vis > 0.001}>
      {PIPE_STAGES.map((label, i) => (
        <group key={label} position={[0, PIPE_STAGE_Y[i], 0]}>
          <mesh material={surfMats[i]}>
            <boxGeometry args={PIPE_SIZE} />
          </mesh>
          <lineSegments geometry={edgesGeos[i]} material={edgeMats[i]} />
          <Text
            position={[0, 0, PIPE_SIZE[2] * 0.5 + 0.3]}
            fontSize={1.5}
            letterSpacing={0.1}
            color={COLORS.structure}
            anchorX="center"
            anchorY="middle"
            fillOpacity={vis * 0.85}
            renderOrder={1}
          >
            {label}
          </Text>
        </group>
      ))}

      {connGeos.map((geo, i) => (
        <line key={i} geometry={geo} material={connMats[i]} />
      ))}

      <instancedMesh ref={pktRef} args={[pktGeo, pktMat, PIPE_PKT_CNT]} />

      <Text
        position={[0, 34, 0]}
        fontSize={1.1}
        letterSpacing={0.18}
        color={COLORS.data}
        anchorX="center"
        anchorY="middle"
        fillOpacity={vis * activeT * 0.55}
        renderOrder={1}
      >
        {'EXECUTION ENVIRONMENT : PIPELINE'}
      </Text>
    </group>
  )
}

// ─── COMPONENT SYSTEM ─────────────────────────────────────────────────────────
// Root service node branches to three downstream services.
// Branches activate sequentially. One packet per trace, traveling root → branch.

const COMP_Z    = -160
const COMP_ROOT = {
  label: 'API_GATEWAY',
  pos:   new THREE.Vector3(0, 22, 0),
  w: 30, h: 10, d: 1.5,
}
const COMP_BRANCHES = [
  { label: 'AUTH_SERVICE', pos: new THREE.Vector3(-44, -8, 0), w: 26, h: 10, d: 1.5 },
  { label: 'CACHE_LAYER',  pos: new THREE.Vector3(  0, -8, 0), w: 26, h: 10, d: 1.5 },
  { label: 'DATABASE',     pos: new THREE.Vector3( 44, -8, 0), w: 26, h: 10, d: 1.5 },
]
const BRANCH_STAGGER = 0.28

function ComponentSystem({ progress }) {
  const t                          = computeLocalT(progress, SYS.COMPONENT.start, SYS.COMPONENT.end)
  const { entryT, activeT, exitT } = getPhases(t)
  const vis                        = phaseVis(entryT, exitT)

  const visRef    = useRef(0)
  const entryRef  = useRef(0)
  const activeRef = useRef(0)
  visRef.current    = vis
  entryRef.current  = entryT
  activeRef.current = activeT

  const rootSurfMat  = useMemo(() => new THREE.MeshBasicMaterial({ color: COL_PANEL, transparent: true, opacity: 0, depthWrite: false }), [])
  const rootEdgeMat  = useMemo(() => new THREE.LineBasicMaterial({ color: COL_EDGE.clone(), transparent: true, opacity: 0 }), [])
  const rootEdgesGeo = useMemo(() =>
    new THREE.EdgesGeometry(new THREE.BoxGeometry(COMP_ROOT.w, COMP_ROOT.h, COMP_ROOT.d)), [])

  const branchSurfMats  = useMemo(() => COMP_BRANCHES.map(() => new THREE.MeshBasicMaterial({ color: COL_PANEL, transparent: true, opacity: 0, depthWrite: false })), [])
  const branchEdgeMats  = useMemo(() => COMP_BRANCHES.map(() => new THREE.LineBasicMaterial({ color: COL_EDGE.clone(), transparent: true, opacity: 0 })), [])
  const branchEdgesGeos = useMemo(() =>
    COMP_BRANCHES.map(b => new THREE.EdgesGeometry(new THREE.BoxGeometry(b.w, b.h, b.d))), [])

  const traceMats = useMemo(() => COMP_BRANCHES.map(() => new THREE.LineBasicMaterial({ color: COLORS.data, transparent: true, opacity: 0 })), [])

  // Traces from root bottom-edge to each branch top-edge
  const traceGeos = useMemo(() =>
    COMP_BRANCHES.map(b => {
      const geo = new THREE.BufferGeometry()
      geo.setFromPoints([
        new THREE.Vector3(COMP_ROOT.pos.x, COMP_ROOT.pos.y - COMP_ROOT.h * 0.5, 0),
        new THREE.Vector3(b.pos.x,          b.pos.y          + b.h          * 0.5, 0),
      ])
      return geo
    }), [])

  const pktRef = useRef()
  const dummy  = useMemo(() => new THREE.Object3D(), [])
  const pktGeo = useMemo(() => new THREE.BoxGeometry(DATA_FLOW.size, DATA_FLOW.size, DATA_FLOW.size), [])
  const pktMat = useMemo(() => new THREE.MeshBasicMaterial({ color: COL_DATA, transparent: true, opacity: 0 }), [])

  useFrame(({ clock }) => {
    const v  = visRef.current
    const en = entryRef.current
    const ac = activeRef.current

    // Root appears on entry
    rootSurfMat.opacity = lerp(rootSurfMat.opacity, v * easeOut(en) * 0.75, MOTION.medium)
    rootEdgeMat.opacity = lerp(rootEdgeMat.opacity, v * easeOut(en) * 0.45, MOTION.medium)

    // Each branch activates sequentially — staggered by BRANCH_STAGGER of activeT
    COMP_BRANCHES.forEach((_, i) => {
      const branchT = clamp((ac - i * BRANCH_STAGGER) / 0.35, 0, 1)
      branchSurfMats[i].opacity = lerp(branchSurfMats[i].opacity, v * easeOut(branchT) * 0.75, MOTION.medium)
      branchEdgeMats[i].opacity = lerp(branchEdgeMats[i].opacity, v * easeOut(branchT) * 0.45, MOTION.medium)
      traceMats[i].opacity      = lerp(traceMats[i].opacity,      v * easeOut(branchT) * 0.50, MOTION.medium)
    })

    // One packet per trace — each starts moving when its branch activates
    if (pktRef.current) {
      COMP_BRANCHES.forEach((b, i) => {
        const branchActive = clamp((ac - i * BRANCH_STAGGER) / 0.35, 0, 1)
        const u = branchActive > 0.01
          ? (clock.elapsedTime * DATA_FLOW.speedBase * 0.1 + i * 0.33) % 1.0
          : 0
        dummy.position.lerpVectors(COMP_ROOT.pos, b.pos, u)
        dummy.updateMatrix()
        pktRef.current.setMatrixAt(i, dummy.matrix)
      })
      pktRef.current.instanceMatrix.needsUpdate = true
      pktMat.opacity = lerp(pktMat.opacity, v * ac * COLOR_STATE.EXECUTING.data, MOTION.medium)
    }
  })

  return (
    <group position={[0, 0, COMP_Z]} visible={vis > 0.001}>
      {/* Root node */}
      <group position={COMP_ROOT.pos.toArray()}>
        <mesh material={rootSurfMat}>
          <boxGeometry args={[COMP_ROOT.w, COMP_ROOT.h, COMP_ROOT.d]} />
        </mesh>
        <lineSegments geometry={rootEdgesGeo} material={rootEdgeMat} />
        <Text
          position={[0, 0, COMP_ROOT.d * 0.5 + 0.3]}
          fontSize={1.5}
          letterSpacing={0.1}
          color={COLORS.structure}
          anchorX="center"
          anchorY="middle"
          fillOpacity={vis * 0.85}
          renderOrder={1}
        >
          {COMP_ROOT.label}
        </Text>
      </group>

      {/* Branch nodes */}
      {COMP_BRANCHES.map((b, i) => (
        <group key={b.label} position={b.pos.toArray()}>
          <mesh material={branchSurfMats[i]}>
            <boxGeometry args={[b.w, b.h, b.d]} />
          </mesh>
          <lineSegments geometry={branchEdgesGeos[i]} material={branchEdgeMats[i]} />
          <Text
            position={[0, 0, b.d * 0.5 + 0.3]}
            fontSize={1.5}
            letterSpacing={0.1}
            color={COLORS.structure}
            anchorX="center"
            anchorY="middle"
            fillOpacity={vis * 0.85}
            renderOrder={1}
          >
            {b.label}
          </Text>
        </group>
      ))}

      {/* Traces */}
      {traceGeos.map((geo, i) => (
        <line key={i} geometry={geo} material={traceMats[i]} />
      ))}

      {/* Packets */}
      <instancedMesh ref={pktRef} args={[pktGeo, pktMat, COMP_BRANCHES.length]} />

      <Text
        position={[0, 34, 0]}
        fontSize={1.1}
        letterSpacing={0.18}
        color={COLORS.data}
        anchorX="center"
        anchorY="middle"
        fillOpacity={vis * activeT * 0.55}
        renderOrder={1}
      >
        {'EXECUTION ENVIRONMENT : COMPONENT'}
      </Text>
    </group>
  )
}

// ─── DATA SYSTEM ──────────────────────────────────────────────────────────────
// 4-column × 3-row grid of panels representing a query execution pipeline.
// Columns: QUERY → PARSE → EXECUTE → RESULT
// Cells appear column-by-column during entry. One packet per row travels left → right.

const DATA_Z    = -210
const DATA_COLS = ['QUERY', 'PARSE', 'EXECUTE', 'RESULT']
const DATA_ROWS = 3
const CELL_W    = 17
const CELL_H    = 9
const CELL_D    = 1.5
const COL_STEP  = 23
const ROW_STEP  = 14

const GRID_COL_X = DATA_COLS.map((_, i) => (i - (DATA_COLS.length - 1) / 2) * COL_STEP)
const GRID_ROW_Y = Array.from({ length: DATA_ROWS }, (_, r) =>
  ((DATA_ROWS - 1) / 2 - r) * ROW_STEP)

// Deterministic per-row speed variance — no randomness
const ROW_SPEEDS = Array.from({ length: DATA_ROWS }, (_, r) =>
  DATA_FLOW.speedBase + (((r * 7 + 2) % 4) / 4 - 0.5) * DATA_FLOW.speedVariance)

function DataSystem({ progress }) {
  const t                          = computeLocalT(progress, SYS.DATA.start, SYS.DATA.end)
  const { entryT, activeT, exitT } = getPhases(t)
  const vis                        = phaseVis(entryT, exitT)

  const visRef    = useRef(0)
  const entryRef  = useRef(0)
  const activeRef = useRef(0)
  visRef.current    = vis
  entryRef.current  = entryT
  activeRef.current = activeT

  const totalCells = DATA_COLS.length * DATA_ROWS

  // Shared edges geometry — same shape for every cell
  const cellEdgesGeo = useMemo(() =>
    new THREE.EdgesGeometry(new THREE.BoxGeometry(CELL_W, CELL_H, CELL_D)), [])

  const surfMats = useMemo(() =>
    Array(totalCells).fill(0).map(() => new THREE.MeshBasicMaterial({
      color: COL_PANEL, transparent: true, opacity: 0, depthWrite: false,
    })), [])

  const edgeMats = useMemo(() =>
    Array(totalCells).fill(0).map(() => new THREE.LineBasicMaterial({
      color: COL_EDGE.clone(), transparent: true, opacity: 0,
    })), [])

  const pktRef = useRef()
  const dummy  = useMemo(() => new THREE.Object3D(), [])
  const pktGeo = useMemo(() => new THREE.BoxGeometry(DATA_FLOW.size, DATA_FLOW.size, DATA_FLOW.size), [])
  const pktMat = useMemo(() => new THREE.MeshBasicMaterial({ color: COL_DATA, transparent: true, opacity: 0 }), [])

  useFrame(({ clock }) => {
    const v  = visRef.current
    const en = entryRef.current
    const ac = activeRef.current

    // Cells appear column-by-column (ci drives stagger), then row offset within column
    DATA_COLS.forEach((_, ci) => {
      Array.from({ length: DATA_ROWS }).forEach((_, ri) => {
        const idx    = ri * DATA_COLS.length + ci
        const stageT = clamp((en - ci * 0.08 - ri * 0.02) / 0.4, 0, 1)
        surfMats[idx].opacity = lerp(surfMats[idx].opacity, v * easeOut(stageT) * 0.70, MOTION.medium)
        edgeMats[idx].opacity = lerp(edgeMats[idx].opacity, v * easeOut(stageT) * 0.40, MOTION.medium)
      })
    })

    // One packet per row — travels from leftmost column edge to rightmost column edge
    if (pktRef.current) {
      const xLeft  = GRID_COL_X[0] - CELL_W * 0.5
      const xRight = GRID_COL_X[GRID_COL_X.length - 1] + CELL_W * 0.5

      for (let r = 0; r < DATA_ROWS; r++) {
        const u = (clock.elapsedTime * ROW_SPEEDS[r] * 0.1 + r * 0.33) % 1.0
        dummy.position.set(xLeft + (xRight - xLeft) * u, GRID_ROW_Y[r], 0)
        dummy.updateMatrix()
        pktRef.current.setMatrixAt(r, dummy.matrix)
      }
      pktRef.current.instanceMatrix.needsUpdate = true
      pktMat.opacity = lerp(pktMat.opacity, v * ac * COLOR_STATE.EXECUTING.data, MOTION.medium)
    }
  })

  return (
    <group position={[0, 0, DATA_Z]} visible={vis > 0.001}>
      {/* Column header labels */}
      {DATA_COLS.map((col, ci) => (
        <Text
          key={col}
          position={[GRID_COL_X[ci], GRID_ROW_Y[0] + CELL_H + 5, 0]}
          fontSize={1.3}
          letterSpacing={0.12}
          color={COLORS.data}
          anchorX="center"
          anchorY="middle"
          fillOpacity={vis * entryT * 0.7}
          renderOrder={1}
        >
          {col}
        </Text>
      ))}

      {/* Grid cells — 4 columns × 3 rows */}
      {DATA_COLS.map((_, ci) =>
        Array.from({ length: DATA_ROWS }).map((_, ri) => {
          const idx = ri * DATA_COLS.length + ci
          return (
            <group key={idx} position={[GRID_COL_X[ci], GRID_ROW_Y[ri], 0]}>
              <mesh material={surfMats[idx]}>
                <boxGeometry args={[CELL_W, CELL_H, CELL_D]} />
              </mesh>
              <lineSegments geometry={cellEdgesGeo} material={edgeMats[idx]} />
            </group>
          )
        })
      )}

      {/* Packet stream */}
      <instancedMesh ref={pktRef} args={[pktGeo, pktMat, DATA_ROWS]} />

      {/* System label */}
      <Text
        position={[0, GRID_ROW_Y[0] + CELL_H + 16, 0]}
        fontSize={1.1}
        letterSpacing={0.18}
        color={COLORS.data}
        anchorX="center"
        anchorY="middle"
        fillOpacity={vis * activeT * 0.55}
        renderOrder={1}
      >
        {'EXECUTION ENVIRONMENT : DATA'}
      </Text>
    </group>
  )
}

// ─── ExecutingState ───────────────────────────────────────────────────────────
// Orchestrator. Always mounted. Each sub-system handles its own visibility.
// Progress is passed down so each system computes its own local phase timing.

export function ExecutingState() {
  const { progress } = useExperience()

  return (
    <group>
      <PipelineSystem  progress={progress} />
      <ComponentSystem progress={progress} />
      <DataSystem      progress={progress} />
    </group>
  )
}
