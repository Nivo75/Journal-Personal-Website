import { useEffect, useRef, useCallback, useState } from 'react'
import { loadPeaks, type Peak } from '../../lib/peakData'

// ── CONSTANTS ──
const ANIM_DURATION = 2800
const HOLD_DURATION = 600
const RIDGE_LEFT    = 0.08
const RIDGE_RIGHT   = 0.92
const RIDGE_TOP     = 0.10
const RIDGE_BOT     = 0.72

type AnimPhase = 'loading' | 'rise' | 'hold' | 'idle'

// ── BUILD SKYLINE LAYOUT ──
function buildSkyline(peaks: Peak[]): Peak[] {
  const sorted  = [...peaks].sort((a, b) => b.elev - a.elev)
  const N       = sorted.length
  const minElev = Math.min(...peaks.map(p => p.elev))
  const maxElev = Math.max(...peaks.map(p => p.elev))

  // Interleave: highest peak at center, fans out symmetrically
  const slots: number[] = new Array(N)
  let left  = Math.floor(N / 2) - 1
  let right = Math.floor(N / 2)
  slots[0]  = right++
  for (let i = 1; i < N; i++) {
    slots[i] = i % 2 === 1 ? right++ : left--
  }

  return sorted.map((peak, rank) => {
    const t    = (peak.elev - minElev) / (maxElev - minElev)
    return {
      ...peak,
      skyX:   RIDGE_LEFT + (slots[rank] / (N - 1)) * (RIDGE_RIGHT - RIDGE_LEFT),
      skyY:   RIDGE_BOT - t * (RIDGE_BOT - RIDGE_TOP),
      startY: 1.05,
    }
  })
}

function buildSlots(N: number): number[] {
  const slots: number[] = new Array(N)
  let left  = Math.floor(N / 2) - 1
  let right = Math.floor(N / 2)
  slots[0]  = right++
  for (let i = 1; i < N; i++) slots[i] = i % 2 === 1 ? right++ : left--
  return slots
}

// ── EASING ──
const easeOutCubic  = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOutQuad = (t: number) => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2

function getPeakProgress(rank: number, globalT: number, slots: number[], N: number): number {
  const centerSlot = Math.floor(N / 2)
  const slotDist   = Math.abs(slots[rank] - centerSlot) / (N / 2)
  const stagger    = slotDist * 0.28
  const localT     = Math.max(0, (globalT - stagger) / (1 - 0.28))
  return Math.min(1, localT)
}

// ── CANVAS HELPERS ──
function drawBackground(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0,   '#1e2d20')
  bg.addColorStop(0.3, '#253828')
  bg.addColorStop(0.6, '#2e4230')
  bg.addColorStop(1,   '#1a2a1c')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Topo contour lines
  ctx.save()
  ctx.globalAlpha = 0.07
  ctx.strokeStyle = '#c8b888'
  ctx.lineWidth   = 1
  const contours = [
    [[0,0.14],[0.2,0.09],[0.4,0.12],[0.6,0.06],[0.8,0.10],[1,0.08]],
    [[0,0.22],[0.2,0.17],[0.4,0.20],[0.6,0.14],[0.8,0.18],[1,0.16]],
    [[0,0.30],[0.2,0.25],[0.4,0.28],[0.6,0.22],[0.8,0.26],[1,0.24]],
    [[0,0.38],[0.2,0.33],[0.4,0.36],[0.6,0.30],[0.8,0.34],[1,0.32]],
    [[0,0.46],[0.2,0.41],[0.4,0.44],[0.6,0.38],[0.8,0.42],[1,0.40]],
    [[0,0.54],[0.2,0.49],[0.4,0.52],[0.6,0.46],[0.8,0.50],[1,0.48]],
    [[0,0.62],[0.2,0.57],[0.4,0.60],[0.6,0.54],[0.8,0.58],[1,0.56]],
    [[0,0.70],[0.2,0.65],[0.4,0.68],[0.6,0.62],[0.8,0.66],[1,0.64]],
    [[0,0.78],[0.2,0.73],[0.4,0.76],[0.6,0.70],[0.8,0.74],[1,0.72]],
    [[0,0.86],[0.2,0.81],[0.4,0.84],[0.6,0.78],[0.8,0.82],[1,0.80]],
  ]
  contours.forEach(pts => {
    ctx.beginPath()
    pts.forEach(([px, py], i) => i === 0 ? ctx.moveTo(px*W, py*H) : ctx.lineTo(px*W, py*H))
    ctx.stroke()
  })
  ctx.restore()

  // Faint grid
  ctx.save()
  ctx.globalAlpha = 0.04
  ctx.strokeStyle = '#c8b888'
  ctx.lineWidth   = 0.5
  for (let gx = 0; gx <= 1; gx += 0.1) {
    ctx.beginPath(); ctx.moveTo(gx*W, 0); ctx.lineTo(gx*W, H); ctx.stroke()
  }
  for (let gy = 0; gy <= 1; gy += 0.1) {
    ctx.beginPath(); ctx.moveTo(0, gy*H); ctx.lineTo(W, gy*H); ctx.stroke()
  }
  ctx.restore()
}

function drawSilhouette(
  ctx: CanvasRenderingContext2D,
  pts: {x:number,y:number}[],
  H: number,
  fillAlpha: number,
  lineAlpha: number
) {
  if (pts.length < 2) return
  const sorted = [...pts].sort((a, b) => a.x - b.x)

  if (fillAlpha > 0.01) {
    ctx.save()
    ctx.globalAlpha = fillAlpha
    ctx.fillStyle   = '#8B7355'
    ctx.beginPath()
    ctx.moveTo(sorted[0].x, H)
    sorted.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(sorted[sorted.length-1].x, H)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  if (lineAlpha > 0.01) {
    ctx.save()
    ctx.globalAlpha = lineAlpha
    ctx.strokeStyle = '#C4622D'
    ctx.lineWidth   = 1.5
    ctx.setLineDash([4, 6])
    ctx.beginPath()
    sorted.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
    ctx.stroke()
    ctx.setLineDash([])
    ctx.restore()
  }
}

function drawDot(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  elev: number,
  hovered: boolean,
  alpha: number
) {
  const r = hovered ? 7 : 4.5

  if (elev > 14000 || hovered) {
    ctx.save()
    ctx.globalAlpha = alpha * (hovered ? 0.45 : 0.22)
    const glowR = hovered ? 20 : 13
    const glow  = ctx.createRadialGradient(x, y, 0, x, y, glowR)
    glow.addColorStop(0, '#C4622D')
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.beginPath(); ctx.arc(x, y, glowR, 0, Math.PI*2); ctx.fill()
    ctx.restore()
  }

  ctx.save()
  ctx.globalAlpha = alpha * (hovered ? 0.95 : 0.65)
  ctx.strokeStyle = hovered ? '#EDE4D0' : 'rgba(237,228,208,0.55)'
  ctx.lineWidth   = hovered ? 1.5 : 1
  ctx.beginPath(); ctx.arc(x, y, r + 2.5, 0, Math.PI*2); ctx.stroke()
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = alpha * (hovered ? 1 : 0.88)
  ctx.fillStyle   = elev > 14000 ? '#EDE4D0' : '#C4622D'
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill()
  ctx.restore()
}

function drawTooltip(
  ctx: CanvasRenderingContext2D,
  peak: Peak,
  x: number, y: number,
  W: number, H: number
) {
  const tw = 220, th = 100, pad = 14
  let tx = x + 14, ty = y - th / 2
  if (tx + tw > W - 10) tx = x - tw - 14
  if (ty < 10)           ty = 10
  if (ty + th > H - 10)  ty = H - th - 10

  ctx.save()
  ctx.globalAlpha = 0.94
  ctx.fillStyle   = '#1a2318'
  ctx.strokeStyle = 'rgba(196,98,45,0.55)'
  ctx.lineWidth   = 1
  roundRect(ctx, tx, ty, tw, th, 3)
  ctx.fill(); ctx.stroke()
  ctx.fillStyle   = '#C4622D'
  ctx.globalAlpha = 0.8
  ctx.fillRect(tx, ty, 3, th)
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = 1
  ctx.font        = '10px "Lora", Georgia, serif'
  ctx.fillStyle   = '#D4784A'
  ctx.fillText(peak.location.toUpperCase(), tx+pad, ty+20)
  ctx.font        = 'bold 14px "Playfair Display", Georgia, serif'
  ctx.fillStyle   = '#EDE4D0'
  ctx.fillText(peak.name, tx+pad, ty+38)
  ctx.font        = '12px "Lora", Georgia, serif'
  ctx.fillStyle   = '#A89070'
  ctx.fillText(`${peak.elev.toLocaleString()} ft · +${peak.gain.toLocaleString()} ft gain`, tx+pad, ty+57)
  ctx.font        = '12px "Lora", Georgia, serif'
  ctx.fillStyle   = '#A89070'
  ctx.fillText(`${peak.distance} mi · Quality ${'★'.repeat(peak.quality)}`, tx+pad, ty+74)
  ctx.font        = 'italic 11px "Lora", Georgia, serif'
  ctx.fillStyle   = '#8B7355'
  ctx.fillText(`Summited ${peak.date}`, tx+pad, ty+91)
  ctx.restore()
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x+r, y)
  ctx.lineTo(x+w-r, y);   ctx.arcTo(x+w, y,   x+w, y+r,   r)
  ctx.lineTo(x+w, y+h-r); ctx.arcTo(x+w, y+h, x+w-r, y+h, r)
  ctx.lineTo(x+r, y+h);   ctx.arcTo(x,   y+h, x,   y+h-r, r)
  ctx.lineTo(x, y+r);     ctx.arcTo(x,   y,   x+r, y,     r)
  ctx.closePath()
}

// ── COMPONENT ──
export default function HeroCanvas() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const phaseRef   = useRef<AnimPhase>('loading')
  const animStart  = useRef<number | null>(null)
  const holdStart  = useRef<number | null>(null)
  const rafRef     = useRef<number>(0)
  const hoveredRef = useRef<number | null>(null)
  const peaksRef   = useRef<Peak[]>([])
  const slotsRef   = useRef<number[]>([])

  const [loading, setLoading] = useState(true)

  // ── IDLE REDRAW ──
  const idleRedraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height
    const peaks = peaksRef.current
    const byX   = [...peaks].sort((a, b) => a.skyX - b.skyX)

    drawBackground(ctx, W, H)
    drawSilhouette(ctx, byX.map(p => ({ x: p.skyX*W, y: p.skyY*H })), H, 0.18, 0)
    peaks.forEach((p, i) => drawDot(ctx, p.skyX*W, p.skyY*H, p.elev, hoveredRef.current === i, 1))

    if (hoveredRef.current !== null) {
      const p = peaks[hoveredRef.current]
      drawTooltip(ctx, p, p.skyX*W, p.skyY*H, W, H)
    }
  }, [])

  // ── ANIMATION LOOP ──
  const renderFrame = useCallback((timestamp: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx    = canvas.getContext('2d')!
    const W      = canvas.width, H = canvas.height
    const peaks  = peaksRef.current
    const slots  = slotsRef.current
    const N      = peaks.length

    drawBackground(ctx, W, H)

    // RISE
    if (phaseRef.current === 'rise') {
      if (!animStart.current) animStart.current = timestamp
      const globalT = Math.min((timestamp - animStart.current) / ANIM_DURATION, 1)

      const dotPts = peaks.map((peak, rank) => {
        const t = easeOutCubic(getPeakProgress(rank, globalT, slots, N))
        return { x: peak.skyX*W, y: (peak.startY + (peak.skyY - peak.startY) * t) * H, elev: peak.elev, t }
      })

      drawSilhouette(ctx, dotPts.map(p => ({ x: p.x, y: p.y })), H,
        Math.min(0.18, globalT * 0.35),
        Math.min(0.7,  globalT * 1.5)
      )
      dotPts.forEach(({ x, y, elev, t }) => {
        if (t > 0.02) drawDot(ctx, x, y, elev, false, Math.min(1, t * 4))
      })

      if (globalT >= 1) { phaseRef.current = 'hold'; holdStart.current = timestamp }
      rafRef.current = requestAnimationFrame(renderFrame)
    }

    // HOLD
    else if (phaseRef.current === 'hold') {
      const elapsed  = holdStart.current ? timestamp - holdStart.current : 0
      const lineFade = Math.max(0, 1 - easeInOutQuad(elapsed / HOLD_DURATION))
      const byX      = [...peaks].sort((a, b) => a.skyX - b.skyX)

      drawSilhouette(ctx, byX.map(p => ({ x: p.skyX*W, y: p.skyY*H })), H, 0.18, 0.7 * lineFade)
      peaks.forEach(p => drawDot(ctx, p.skyX*W, p.skyY*H, p.elev, false, 1))

      if (elapsed >= HOLD_DURATION) { phaseRef.current = 'idle'; idleRedraw(); return }
      rafRef.current = requestAnimationFrame(renderFrame)
    }
  }, [idleRedraw])

  // ── LOAD CSV THEN START ANIMATION ──
  useEffect(() => {
    loadPeaks().then(peaks => {
      const skyline   = buildSkyline(peaks)
      peaksRef.current = skyline
      slotsRef.current = buildSlots(skyline.length)
      setLoading(false)

      setTimeout(() => {
        phaseRef.current  = 'rise'
        animStart.current = null
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(renderFrame)
      }, 300)
    })
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [renderFrame])

  // ── RESIZE ──
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(() => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      if (phaseRef.current === 'idle') idleRedraw()
    })
    ro.observe(canvas)
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    return () => ro.disconnect()
  }, [idleRedraw])

  // ── HOVER ──
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (phaseRef.current !== 'idle') return
    const canvas = canvasRef.current!
    const rect   = canvas.getBoundingClientRect()
    const mx     = (e.clientX - rect.left) * (canvas.width  / rect.width)
    const my     = (e.clientY - rect.top)  * (canvas.height / rect.height)
    const peaks  = peaksRef.current

    let found: number | null = null
    peaks.forEach((p, i) => {
      if (Math.hypot(mx - p.skyX*canvas.width, my - p.skyY*canvas.height) < 14) found = i
    })
    if (found !== hoveredRef.current) {
      hoveredRef.current = found
      idleRedraw()
    }
  }, [idleRedraw])

  const handleMouseLeave = useCallback(() => {
    if (phaseRef.current !== 'idle') return
    hoveredRef.current = null
    idleRedraw()
  }, [idleRedraw])

  return (
    <>
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: '#1e2d20',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: "'Lora', serif", color: '#8B7355', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Loading summits...
          </span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />
    </>
  )
}
