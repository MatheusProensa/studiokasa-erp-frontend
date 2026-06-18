import { useId } from 'react'

interface SparklineProps {
  data: number[]
  color?: string
  className?: string
  height?: number
}

/** Mini gráfico de linha+área (SVG puro, sem dependência) para os KPI cards. */
export function Sparkline({ data, color = 'var(--primary)', className, height = 40 }: SparklineProps) {
  const id = useId()
  const width = 100
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)

  const pts = data.map((v, i) => {
    const x = i * stepX
    const y = height - ((v - min) / range) * (height - 6) - 3
    return [x, y] as const
  })

  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      style={{ width: '100%', height, color }}
    >
      <defs>
        <linearGradient id={`sk-spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sk-spark-${id})`} />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Gera uma série pseudo-aleatória determinística a partir de um texto (seed). */
export function seedSeries(seed: string, n = 12, up = true): number[] {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 100000
  const out: number[] = []
  let v = 40 + (h % 20)
  for (let i = 0; i < n; i++) {
    h = (h * 1103515245 + 12345) % 2147483648
    const noise = (h % 21) - 10
    const drift = up ? i * 1.4 : -i * 1.2
    v = Math.max(8, Math.min(95, v + noise * 0.6 + drift * 0.4))
    out.push(v)
  }
  return out
}
