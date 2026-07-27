'use client'

type Point = { label: string; value: number }

export function LineChart({ data }: { data: Point[] }) {
  const width = 300
  const height = 130
  const padX = 8
  const padY = 14
  const values = data.map((d) => d.value)
  const max = Math.max(...values, 1)
  const min = Math.min(...values)
  const range = max - min || 1

  const points = data.map((d, i) => {
    const x = padX + (i * (width - padX * 2)) / Math.max(data.length - 1, 1)
    const y = height - padY - ((d.value - min) / range) * (height - padY * 2)
    return { x, y, ...d }
  })

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ')

  const areaPath =
    `M ${points[0].x} ${height - padY} ` +
    points.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') +
    ` L ${points[points.length - 1].x} ${height - padY} Z`

  const accentColor = 'var(--color-emerald, #22c55e)'

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-32 w-full"
        role="img"
        aria-label="Volume trend"
      >
        <defs>
          <linearGradient id="volumeAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((pct) => {
          const y = padY + (height - padY * 2) * (1 - pct)
          return (
            <line
              key={pct}
              x1={padX}
              y1={y}
              x2={width - padX}
              y2={y}
              stroke="currentColor"
              className="text-border"
              strokeWidth="0.5"
              strokeDasharray="3,3"
            />
          )
        })}
        <path d={areaPath} fill="url(#volumeAreaGrad)" />
        <path
          d={linePath}
          fill="none"
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p) => (
          <circle
            key={p.label}
            cx={p.x}
            cy={p.y}
            r="3.5"
            fill="var(--color-background, #0f172a)"
            stroke={accentColor}
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="mt-1.5 flex justify-between px-0.5">
        {data.map((d) => (
          <span key={d.label} className="text-[10px] font-medium text-muted-foreground">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export function BarChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  const barColors = ['bg-primary/40', 'bg-primary/50', 'bg-primary/60', 'bg-primary/70', 'bg-primary/80', 'bg-primary/90', 'bg-primary', 'bg-primary']

  return (
    <div className="flex h-28 items-end justify-between gap-1.5">
      {data.map((v, i) => {
        const isLast = i === data.length - 1
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`w-full rounded-t-sm transition-all duration-500 ${
                isLast ? 'bg-primary' : barColors[i % barColors.length]
              }`}
              style={{ height: `${(v / max) * 88}px` }}
            />
            <span className="text-[9px] font-medium text-muted-foreground">
              W{i + 1}
            </span>
          </div>
        )
      })}
    </div>
  )
}
