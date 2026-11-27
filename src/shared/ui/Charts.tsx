import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const axis = { stroke: '#94a3b8', fontSize: 12, tickLine: false, axisLine: false } as const

export function AreaTrend({ data, dataKey = 'value', xKey = 'label', color = '#1f55e6', height = 220, dots }: { data: Record<string, string | number>[]; dataKey?: string; xKey?: string; color?: string; height?: number; dots?: boolean }) {
  const id = `g-${dataKey}-${color.replace('#', '')}`
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#eef2f8" />
        <XAxis dataKey={xKey} {...axis} />
        <YAxis {...axis} width={48} />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e3e9f4' }} />
        <Area isAnimationActive={false} type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} fill={`url(#${id})`} dot={dots ? { r: 3.5, fill: '#fff', stroke: color, strokeWidth: 2 } : false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function MultiLine({ data, lines, xKey = 'label', height = 240 }: { data: Record<string, string | number>[]; lines: { key: string; name: string; color: string }[]; xKey?: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#eef2f8" />
        <XAxis dataKey={xKey} {...axis} />
        <YAxis {...axis} width={48} />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e3e9f4' }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        {lines.map((l) => (
          <Line isAnimationActive={false} key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2.5} dot={{ r: 3 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function Bars({ data, dataKey = 'value', xKey = 'label', color = '#1f55e6', height = 220 }: { data: Record<string, string | number>[]; dataKey?: string; xKey?: string; color?: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#eef2f8" />
        <XAxis dataKey={xKey} {...axis} />
        <YAxis {...axis} width={48} />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e3e9f4' }} />
        <Bar isAnimationActive={false} dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

/** Donut avec légende à droite. */
export function Donut({ data, center, size = 170 }: { data: { name: string; value: number; color: string }[]; center?: string; size?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="relative" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie isAnimationActive={false} data={data} dataKey="value" innerRadius={size * 0.32} outerRadius={size * 0.48} paddingAngle={2} stroke="none">
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {center && <span className="absolute inset-0 grid place-items-center text-center text-sm font-extrabold text-navy-900">{center}</span>}
      </div>
      <ul className="min-w-36 flex-1 space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-muted">{d.name}</span>
            <span className="ml-auto font-bold text-navy-900">{d.value} %</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
