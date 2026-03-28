import { Link, NavLink } from 'react-router-dom'
import {
  CheckCircle,
  Activity,
  Flame,
  FileText,
  PieChart,
  Target,
  Zap,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  CalendarDays,
  Shield,
  LayoutDashboard,
  BarChart3,
} from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/fire', label: 'FIRE Planner' },
  { to: '/tax', label: 'Tax Matrix' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/dashboard', label: 'Dashboard' },
]

function Topbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#0B0C10]/90 backdrop-blur-xl">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#45A29E]/15 border border-[#45A29E]/30">
            <Shield className="h-4 w-4 text-[#45A29E]" strokeWidth={1.75} />
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">AstraGuard</span>
        </div>
        <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `text-[13px] font-medium transition-colors ${
                  isActive ? 'text-[#45A29E]' : 'text-white/55 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#45A29E] opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#45A29E]" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#45A29E]">Live</span>
        </div>
      </div>
    </header>
  )
}

function StatCard({ icon: Icon, label, value, sub, trend, trendUp }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-[#111318] px-5 py-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.07]">
          <Icon className="h-4 w-4 text-[#45A29E]" strokeWidth={1.75} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trendUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#94A3B8] mb-1.5">{label}</p>
        <p className="text-2xl font-semibold text-white tracking-tight leading-none">{value}</p>
        {sub && <p className="text-xs text-[#94A3B8]/80 mt-1.5">{sub}</p>}
      </div>
    </div>
  )
}

function Panel({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`flex flex-col rounded-xl border border-white/[0.08] bg-[#111318] overflow-hidden ${className}`}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
          <div>
            {title && (
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#94A3B8]">{title}</h2>
            )}
            {subtitle && <p className="text-xs text-[#94A3B8]/70 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="flex-1 p-5 flex flex-col">{children}</div>
    </section>
  )
}

function ProgressRing({ valuePct, labelMain, labelSub }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, Math.max(0, valuePct)) / 100) * circumference
  const size = 136

  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="transparent" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="#45A29E" strokeWidth="10" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold text-white tabular-nums leading-none">{labelMain}</span>
        <span className="text-[11px] font-medium text-[#94A3B8] mt-1.5 tabular-nums">{labelSub}</span>
      </div>
    </div>
  )
}

const pulseItems = [
  {
    icon: CheckCircle,
    tone: 'text-[#45A29E]',
    bg: 'bg-[#45A29E]/10',
    title: 'Discipline milestone',
    body: '127-day SIP streak · top 8% of peers',
    time: 'Today',
    dot: 'bg-[#45A29E]',
  },
  {
    icon: Activity,
    tone: 'text-[#94A3B8]',
    bg: 'bg-white/[0.05]',
    title: 'Market check',
    body: 'Nifty flat · no intervention scheduled',
    time: '09:18 IST',
    dot: '',
  },
  {
    icon: BarChart3,
    tone: 'text-amber-400',
    bg: 'bg-amber-400/10',
    title: 'Rebalancing alert',
    body: 'Large-cap overlap detected in 2 funds',
    time: 'Yesterday',
    dot: '',
  },
]

const engines = [
  {
    to: '/fire',
    icon: Flame,
    title: 'FIRE planner',
    stat: 'Target age 50',
    status: 'On track',
    statusStyle: 'text-[#45A29E] border-[#45A29E]/25 bg-[#45A29E]/10',
    href: true,
  },
  {
    to: '/tax',
    icon: FileText,
    title: 'Tax optimization',
    stat: '₹31,200 savings found',
    status: 'Action needed',
    statusStyle: 'text-[#45A29E] border-[#45A29E]/25 bg-[#45A29E]/10',
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
    statusStyle: 'text-[#94A3B8] border-white/10 bg-white/[0.04]',
    href: false,
  },
]

export default function DashboardPage() {
  const arthScore = 743
  const arthMax = 1000
  const ringPct = (arthScore / arthMax) * 100

  const today = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date())

  return (
    <div className="min-h-screen w-full bg-[#0B0C10] text-white flex flex-col font-sans">
      <Topbar />

      <main className="flex-1 w-full max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-8 flex flex-col gap-7">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <LayoutDashboard className="h-5 w-5 text-[#45A29E]" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">Dashboard</h1>
              <p className="text-sm text-[#94A3B8] mt-0.5">Financial health overview &amp; live signals</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]/70 border border-white/[0.06] rounded-lg px-3.5 py-2 bg-white/[0.02] w-fit">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span className="tabular-nums">{today}</span>
          </div>
        </div>

        {/* Stat cards row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={IndianRupee}
            label="Portfolio value"
            value="₹18.4L"
            sub="Across 7 mutual funds"
            trend="+8.3%"
            trendUp={true}
          />
          <StatCard
            icon={TrendingUp}
            label="Monthly SIP"
            value="₹25,000"
            sub="Next debit in 3 days"
            trend="Active"
            trendUp={true}
          />
          <StatCard
            icon={BarChart3}
            label="XIRR returns"
            value="14.2%"
            sub="Annualised since inception"
            trend="+1.4%"
            trendUp={true}
          />
          <StatCard
            icon={Zap}
            label="Arth score"
            value="743"
            sub="Top 12% of users"
            trend="+12 pts"
            trendUp={true}
          />
        </div>

        {/* Score + Activity row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Arth Score */}
          <div className="lg:col-span-2">
            <Panel title="Arth score" subtitle="Behaviour + plan adherence" className="h-full">
              <div className="flex flex-col items-center justify-center flex-1 gap-5 py-3">
                <ProgressRing
                  valuePct={ringPct}
                  labelMain={String(arthScore)}
                  labelSub={`out of ${arthMax}`}
                />
                <div className="w-full space-y-2.5">
                  {[
                    { label: 'SIP discipline', pct: 92 },
                    { label: 'Goal adherence', pct: 78 },
                    { label: 'Risk alignment', pct: 85 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-[#94A3B8]">{item.label}</span>
                        <span className="text-[11px] font-semibold text-white tabular-nums">{item.pct}%</span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-white/[0.06]">
                        <div
                          className="h-1 rounded-full bg-[#45A29E] transition-all duration-700"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#94A3B8] text-center">
                  <span className="text-[#45A29E] font-semibold">+12 pts</span> vs last month · great discipline
                </p>
              </div>
            </Panel>
          </div>

          {/* Activity feed */}
          <div className="lg:col-span-3">
            <Panel
              title="Activity feed"
              subtitle="Recent checks and milestones"
              className="h-full"
              action={
                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#45A29E]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#45A29E] opacity-40" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#45A29E]" />
                  </span>
                  Live
                </span>
              }
            >
              <ul className="flex flex-col divide-y divide-white/[0.05] -mx-5 -my-5">
                {pulseItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.title} className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
                        <Icon className={`h-4 w-4 ${item.tone}`} strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-medium text-white">{item.title}</p>
                          <span className="text-[11px] text-[#94A3B8]/70 tabular-nums shrink-0">{item.time}</span>
                        </div>
                        <p className="text-[13px] text-[#94A3B8] mt-0.5 leading-relaxed">{item.body}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </Panel>
          </div>
        </div>

        {/* Engines & Goals */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#94A3B8]">
              Engines &amp; goals
            </h2>
            <span className="text-[11px] text-[#94A3B8]/60">4 modules active</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {engines.map((e) => {
              const Icon = e.icon
              const inner = (
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                      <Icon className="h-5 w-5 text-white/70" strokeWidth={1.5} />
                    </div>
                    {e.href && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/[0.05] group-hover:bg-[#45A29E]/15 transition-colors">
                        <ChevronRight className="h-3.5 w-3.5 text-[#94A3B8] group-hover:text-[#45A29E] transition-colors" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{e.title}</h3>
                    <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{e.stat}</p>
                  </div>
                  <span className={`inline-flex w-fit items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${e.statusStyle}`}>
                    {e.status}
                  </span>
                </div>
              )

              if (!e.href) {
                return (
                  <div key={e.title} className="rounded-xl border border-white/[0.08] bg-[#111318] px-5 py-5">
                    {inner}
                  </div>
                )
              }
              return (
                <Link
                  key={e.title}
                  to={e.to}
                  className="group rounded-xl border border-white/[0.08] bg-[#111318] px-5 py-5 transition-all hover:border-[#45A29E]/25 hover:bg-[#45A29E]/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#45A29E]/40"
                >
                  {inner}
                </Link>
              )
            })}
          </div>
        </section>

        {/* Behavioral guard demo */}
        <section className="rounded-xl border border-rose-500/20 bg-rose-950/20 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex gap-4 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 border border-rose-500/25">
                <Zap className="h-5 w-5 text-rose-400" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white">Behavioral guard · demo</h2>
                <p className="text-sm text-[#94A3B8] mt-1 max-w-xl leading-relaxed">
                  Simulate a sharp Nifty drawdown to test the panic-intercept flow. Demo sends a WhatsApp-style payload when the backend is wired.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="shrink-0 sm:w-auto w-full px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold border border-rose-400/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50"
            >
              Simulate drawdown
            </button>
          </div>
        </section>

      </main>
    </div>
  )
}
