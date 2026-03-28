import { Link } from 'react-router-dom'
import {
  CheckCircle,
  Activity,
  Flame,
  FileText,
  PieChart,
  Target,
  Zap,
  ChevronRight,
  LayoutDashboard,
} from 'lucide-react'
function Panel({ title, subtitle, action, children, className = '' }) {
  return (
    <section
      className={`flex flex-col rounded-xl border border-white/[0.08] bg-glass-surface/30 overflow-hidden ${className}`}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-3.5 min-h-[52px]">
          <div>
            {title && (
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-slate">
                {title}
              </h2>
            )}
            {subtitle && <p className="text-xs text-text-slate/80 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="flex-1 p-5 flex flex-col">{children}</div>
    </section>
  )
}

function ProgressRing({ valuePct, labelMain, labelSub }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, valuePct)) / 100) * circumference
  const size = 132

  return (
    <div className="relative mx-auto flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-accent-teal)"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
        <span className="text-3xl font-semibold text-white tabular-nums tracking-tight leading-none">
          {labelMain}
        </span>
        <span className="text-xs font-medium text-text-slate mt-1.5 tabular-nums">{labelSub}</span>
      </div>
    </div>
  )
}

const pulseItems = [
  {
    icon: CheckCircle,
    tone: 'text-accent-teal',
    bg: 'bg-accent-teal/10',
    title: 'Discipline milestone',
    body: '127-day SIP streak · top 8% of peers',
    time: 'Today',
  },
  {
    icon: Activity,
    tone: 'text-text-slate',
    bg: 'bg-white/[0.06]',
    title: 'Market check',
    body: 'Nifty flat · no intervention scheduled',
    time: '09:18 IST',
  },
]

const engines = [
  {
    to: '/fire',
    icon: Flame,
    title: 'FIRE planner',
    stat: 'Target age 50',
    status: 'On track',
    statusStyle: 'text-accent-teal border-accent-teal/25 bg-accent-teal/10',
    href: true,
  },
  {
    to: '/tax',
    icon: FileText,
    title: 'Tax optimization',
    stat: '₹31,200 savings found',
    status: 'Action available',
    statusStyle: 'text-accent-teal border-accent-teal/25 bg-accent-teal/10',
    href: true,
  },
  {
    to: '/portfolio',
    icon: PieChart,
    title: 'Portfolio X-Ray',
    stat: 'Overlap in large cap',
    status: 'Review',
    statusStyle: 'text-amber-400/90 border-amber-400/20 bg-amber-400/10',
    href: true,
  },
  {
    icon: Target,
    title: 'Emergency fund',
    stat: '6-month runway target',
    status: '40% funded',
    statusStyle: 'text-text-slate border-white/10 bg-white/[0.04]',
    href: false,
  },
]

export default function DashboardPage() {
  const arthScore = 743
  const arthMax = 1000
  const ringPct = (arthScore / arthMax) * 100

  return (
    <div className="min-h-screen w-full min-w-0 bg-void text-white flex flex-col font-sans">
      <main className="flex-1 w-full min-w-0 max-w-[100vw] flex flex-col gap-6 sm:gap-8 box-border pt-10 sm:pt-12 md:pt-14 pb-10 px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Page header — full width of content area */}
        <header className="w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 border-b border-white/[0.06] pb-6 shrink-0">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
              <LayoutDashboard className="h-5 w-5 text-accent-teal" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Dashboard
              </h1>
              <p className="text-sm text-text-slate mt-1 max-w-xl">
                Overview of your financial health, engines, and live behavioral signals.
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <p className="text-[11px] uppercase tracking-wider text-text-slate font-semibold">Snapshot</p>
            <p className="text-sm tabular-nums text-white/90 mt-0.5">
              {new Intl.DateTimeFormat('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }).format(new Date())}
            </p>
          </div>
        </header>

        {/* Top: score + activity — two equal columns on large screens */}
        <div className="w-full min-w-0 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 lg:items-stretch lg:min-h-[320px]">
          <div className="flex min-w-0 min-h-[min(320px,50vh)] lg:min-h-0">
            <Panel title="Arth score" subtitle="Behavior + plan adherence" className="w-full min-w-0">
              <div className="flex flex-col items-center justify-center flex-1 gap-6">
                <ProgressRing
                  valuePct={ringPct}
                  labelMain={String(arthScore)}
                  labelSub={`out of ${arthMax}`}
                />
                <p className="text-center text-sm text-text-slate leading-relaxed max-w-[240px]">
                  <span className="text-accent-teal font-medium">+12</span> vs last month on discipline.
                </p>
              </div>
            </Panel>
          </div>

          <div className="flex min-w-0 min-h-[280px] lg:min-h-0">
            <Panel
              title="Activity"
              subtitle="Recent checks and milestones"
              className="w-full min-w-0"
              action={
                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent-teal">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-40" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal" />
                  </span>
                  Live
                </span>
              }
            >
              <ul className="flex flex-col gap-0 flex-1 divide-y divide-white/[0.06] -mx-5 -mb-5 border-t border-white/[0.06]">
                {pulseItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.title} className="flex gap-4 px-5 py-4 first:pt-4 hover:bg-white/[0.02] transition-colors">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.bg}`}>
                        <Icon className={`h-4 w-4 ${item.tone}`} strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-[1fr_auto] sm:gap-x-6 gap-1 items-start">
                        <div>
                          <p className="text-sm font-medium text-white">{item.title}</p>
                          <p className="text-sm text-text-slate mt-0.5">{item.body}</p>
                        </div>
                        <p className="text-xs text-text-slate/80 tabular-nums sm:text-right shrink-0">
                          {item.time}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </Panel>
          </div>
        </div>

        {/* Engines — equal columns, full bleed of content padding */}
        <section className="w-full min-w-0">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-slate">
              Engines & goals
            </h2>
          </div>
          <div className="grid w-full min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {engines.map((e) => {
              const Icon = e.icon
              const inner = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
                      <Icon className="h-5 w-5 text-white/85" strokeWidth={1.5} />
                    </div>
                    {e.href ? (
                      <ChevronRight className="h-4 w-4 text-text-slate shrink-0 opacity-50 group-hover:opacity-100 group-hover:text-white transition-opacity" />
                    ) : (
                      <span className="w-4 shrink-0" aria-hidden />
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-white">{e.title}</h3>
                    <p className="text-xs text-text-slate mt-1 leading-relaxed">{e.stat}</p>
                  </div>
                  <span
                    className={`mt-4 inline-flex w-fit items-center rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${e.statusStyle}`}
                  >
                    {e.status}
                  </span>
                </>
              )

              if (!e.href) {
                return (
                  <div
                    key={e.title}
                    className="flex flex-col rounded-xl border border-white/[0.08] bg-glass-surface/25 px-5 py-5 text-left"
                  >
                    {inner}
                  </div>
                )
              }

              return (
                <Link
                  key={e.title}
                  to={e.to}
                  className="group flex flex-col rounded-xl border border-white/[0.08] bg-glass-surface/25 px-5 py-5 text-left transition-colors hover:border-accent-teal/25 hover:bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal/40 focus-visible:ring-offset-2 focus-visible:ring-offset-void"
                >
                  {inner}
                </Link>
              )
            })}
          </div>
        </section>

        {/* Demo — single clean callout, full width */}
        <section className="w-full min-w-0 rounded-xl border border-rose-500/20 bg-rose-950/20 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex gap-4 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 border border-rose-500/25">
                <Zap className="h-5 w-5 text-rose-400" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white sm:text-base">
                  Behavioral guard · demo
                </h2>
                <p className="text-sm text-text-slate mt-1.5 max-w-2xl leading-relaxed">
                  Simulate a sharp Nifty drawdown to test the intervention flow (demo triggers WhatsApp-style
                  payload in backend when wired).
                </p>
              </div>
            </div>
            <button
              type="button"
              className="shrink-0 w-full lg:w-auto px-5 py-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold border border-rose-400/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void"
            >
              Simulate drawdown
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
