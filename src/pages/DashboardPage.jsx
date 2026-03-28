import { Link, NavLink } from 'react-router-dom'
import {
  CheckCircle,
  Activity,
  Flame,
  FileText,
  PieChart,
  Target,
  Zap,
  ArrowUpRight,
  TrendingUp,
  IndianRupee,
  CalendarDays,
  Shield,
  BarChart3,
  ArrowRight,
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
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#0B0C10]/95 backdrop-blur-xl">
      <div className="max-w-[1320px] mx-auto flex items-center justify-between px-8 py-0 h-[62px]">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#45A29E]/15 border border-[#45A29E]/30">
            <Shield className="h-4 w-4 text-[#45A29E]" strokeWidth={1.75} />
          </div>
          <span className="text-white font-bold text-[15px] tracking-tight">AstraGuard</span>
        </div>
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `text-[13.5px] font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-white/45 hover:text-white/80'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-[#45A29E]/25 bg-[#45A29E]/8 px-3.5 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#45A29E] opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#45A29E]" />
            </span>
            <span className="text-[11px] font-semibold text-[#45A29E] tracking-wide">Markets open</span>
          </div>
        </div>
      </div>
    </header>
  )
}

function KpiCard({ icon: Icon, iconColor, iconBg, label, value, sub, badge, badgeColor }) {
  return (
    <div className="relative flex flex-col rounded-2xl border border-white/[0.07] bg-[#111318] p-6 overflow-hidden group hover:border-white/[0.12] transition-colors duration-200">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(69,162,158,0.04) 0%, transparent 60%)' }} />
      <div className="flex items-center justify-between mb-6">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={1.75} />
        </div>
        {badge && (
          <span className={`flex items-center gap-1 text-[11px] font-semibold rounded-full px-2.5 py-1 ${badgeColor}`}>
            <TrendingUp className="h-3 w-3" />
            {badge}
          </span>
        )}
      </div>
      <p className="text-[12px] font-medium text-[#94A3B8] mb-2 tracking-wide">{label}</p>
      <p className="text-[28px] font-bold text-white leading-none tracking-tight mb-2">{value}</p>
      {sub && <p className="text-[12px] text-[#94A3B8]/70 mt-auto pt-3">{sub}</p>}
    </div>
  )
}

function ProgressRing({ valuePct, score, max }) {
  const r = 68
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(100, Math.max(0, valuePct)) / 100) * circ
  const sz = 172

  return (
    <div className="relative flex items-center justify-center" style={{ width: sz, height: sz }}>
      <svg width={sz} height={sz} className="-rotate-90" aria-hidden>
        <circle cx={sz/2} cy={sz/2} r={r} stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
        <circle cx={sz/2} cy={sz/2} r={r}
          stroke="url(#tealGrad)" strokeWidth="8" fill="none"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(.22,1,.36,1)' }}
        />
        <defs>
          <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#45A29E" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[40px] font-bold text-white tabular-nums leading-none">{score}</span>
        <span className="text-[12px] text-[#94A3B8] mt-2 tabular-nums">of {max}</span>
      </div>
    </div>
  )
}

const feed = [
  {
    icon: CheckCircle,
    iconColor: 'text-[#45A29E]',
    iconBg: 'bg-[#45A29E]/12',
    tag: 'Milestone',
    tagColor: 'text-[#45A29E] bg-[#45A29E]/10',
    title: 'Discipline milestone',
    body: '127-day SIP streak — you\'re in the top 8% of all users.',
    time: 'Just now',
  },
  {
    icon: Activity,
    iconColor: 'text-[#94A3B8]',
    iconBg: 'bg-white/[0.06]',
    tag: 'Market',
    tagColor: 'text-[#94A3B8] bg-white/[0.06]',
    title: 'Market check complete',
    body: 'Nifty 50 is flat today. No behavioral intervention scheduled.',
    time: '09:18 IST',
  },
  {
    icon: BarChart3,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-400/10',
    tag: 'Alert',
    tagColor: 'text-amber-400 bg-amber-400/10',
    title: 'Rebalancing opportunity',
    body: 'Large-cap overlap detected across 2 funds in your portfolio.',
    time: 'Yesterday',
  },
]

const engines = [
  { to: '/fire', icon: Flame, title: 'FIRE Planner', desc: 'Retire at 50', badge: 'On track', badgeStyle: 'text-[#45A29E] bg-[#45A29E]/10', href: true },
  { to: '/tax', icon: FileText, title: 'Tax Optimizer', desc: '₹31,200 saved', badge: 'Act now', badgeStyle: 'text-sky-400 bg-sky-400/10', href: true },
  { to: '/portfolio', icon: PieChart, title: 'Portfolio X-Ray', desc: 'Overlap found', badge: 'Review', badgeStyle: 'text-amber-400 bg-amber-400/10', href: true },
  { icon: Target, title: 'Emergency Fund', desc: '6-mo runway', badge: '40% done', badgeStyle: 'text-[#94A3B8] bg-white/[0.06]', href: false },
]

export default function DashboardPage() {
  const score = 743
  const scoreMax = 1000
  const pct = (score / scoreMax) * 100

  const today = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date())

  return (
    <div className="min-h-screen w-full bg-[#0B0C10] text-white font-sans">
      <Topbar />

      <main className="max-w-[1320px] mx-auto px-8 py-10 flex flex-col gap-8">

        {/* ── Page heading ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Good morning, Aryan</h1>
            <p className="text-[14px] text-[#94A3B8] mt-1">Your portfolio is performing well. Here's your daily snapshot.</p>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#94A3B8]/80 shrink-0">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span className="tabular-nums">{today}</span>
          </div>
        </div>

        {/* ── KPI row ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
          <KpiCard
            icon={IndianRupee}
            iconColor="text-[#45A29E]"
            iconBg="bg-[#45A29E]/12"
            label="Portfolio Value"
            value="₹18.4L"
            sub="Across 7 mutual funds"
            badge="+8.3%"
            badgeColor="text-emerald-400 bg-emerald-400/10"
          />
          <KpiCard
            icon={TrendingUp}
            iconColor="text-sky-400"
            iconBg="bg-sky-400/10"
            label="Monthly SIP"
            value="₹25,000"
            sub="Next debit in 3 days"
            badge="Active"
            badgeColor="text-sky-400 bg-sky-400/10"
          />
          <KpiCard
            icon={BarChart3}
            iconColor="text-violet-400"
            iconBg="bg-violet-400/10"
            label="XIRR Returns"
            value="14.2%"
            sub="Annualised since inception"
            badge="+1.4%"
            badgeColor="text-emerald-400 bg-emerald-400/10"
          />
          <KpiCard
            icon={Zap}
            iconColor="text-amber-400"
            iconBg="bg-amber-400/10"
            label="Arth Score"
            value="743"
            sub="Top 12% of all users"
            badge="+12 pts"
            badgeColor="text-emerald-400 bg-emerald-400/10"
          />
        </div>

        {/* ── Middle row: Score detail + Activity ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5">

          {/* Arth Score detail */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#111318] p-8 flex flex-col gap-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94A3B8] mb-1">Arth Score</p>
              <h2 className="text-[17px] font-semibold text-white">Behaviour &amp; plan adherence</h2>
            </div>
            <div className="flex justify-center">
              <ProgressRing valuePct={pct} score={score} max={scoreMax} />
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label: 'SIP discipline', pct: 92, color: 'bg-[#45A29E]' },
                { label: 'Goal adherence', pct: 78, color: 'bg-sky-400' },
                { label: 'Risk alignment', pct: 85, color: 'bg-violet-400' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#94A3B8]">{item.label}</span>
                    <span className="text-[13px] font-semibold text-white tabular-nums">{item.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
                    <div className={`h-1.5 rounded-full ${item.color} transition-all duration-700`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[13px] text-[#94A3B8] text-center border-t border-white/[0.06] pt-5">
              <span className="text-[#45A29E] font-semibold">+12 pts</span> vs last month — excellent discipline
            </p>
          </div>

          {/* Activity feed */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#111318] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-7 py-5 border-b border-white/[0.06]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94A3B8] mb-0.5">Activity Feed</p>
                <h2 className="text-[17px] font-semibold text-white">Recent signals &amp; milestones</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#45A29E]/20 bg-[#45A29E]/8 px-3 py-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#45A29E] opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#45A29E]" />
                </span>
                <span className="text-[11px] font-semibold text-[#45A29E]">Live</span>
              </div>
            </div>
            <ul className="flex flex-col divide-y divide-white/[0.05] flex-1">
              {feed.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.title} className="flex gap-5 px-7 py-6 hover:bg-white/[0.015] transition-colors cursor-default">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}>
                      <Icon className={`h-5 w-5 ${item.iconColor}`} strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${item.tagColor}`}>{item.tag}</span>
                        <span className="text-[12px] text-[#94A3B8]/60 tabular-nums ml-auto shrink-0">{item.time}</span>
                      </div>
                      <p className="text-[14px] font-semibold text-white mb-1">{item.title}</p>
                      <p className="text-[13px] text-[#94A3B8] leading-relaxed">{item.body}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* ── Engines & Goals ── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94A3B8] mb-0.5">Modules</p>
              <h2 className="text-[17px] font-semibold text-white">Engines &amp; goals</h2>
            </div>
            <span className="text-[12px] text-[#94A3B8]/60">4 active</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {engines.map((e) => {
              const Icon = e.icon
              const inner = (
                <div className="flex flex-col h-full gap-6 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]">
                      <Icon className="h-5 w-5 text-white/70" strokeWidth={1.5} />
                    </div>
                    {e.href && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.05] group-hover:bg-[#45A29E]/15 transition-colors">
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#94A3B8] group-hover:text-[#45A29E] transition-colors" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-semibold text-white mb-1.5">{e.title}</h3>
                    <p className="text-[13px] text-[#94A3B8] leading-relaxed">{e.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-white/[0.05]">
                    <span className={`inline-flex items-center rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${e.badgeStyle}`}>
                      {e.badge}
                    </span>
                  </div>
                </div>
              )

              if (!e.href) {
                return (
                  <div key={e.title} className="rounded-2xl border border-white/[0.07] bg-[#111318]">
                    {inner}
                  </div>
                )
              }
              return (
                <Link
                  key={e.title}
                  to={e.to}
                  className="group block rounded-2xl border border-white/[0.07] bg-[#111318] transition-all duration-200 hover:border-[#45A29E]/30 hover:bg-[#45A29E]/[0.025] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#45A29E]/40"
                >
                  {inner}
                </Link>
              )
            })}
          </div>
        </div>

        {/* ── Behavioral guard demo ── */}
        <div className="rounded-2xl border border-rose-500/15 bg-[#0f0a0a] p-7 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/12 border border-rose-500/20">
            <Zap className="h-6 w-6 text-rose-400" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-bold text-white mb-1">Behavioral Guard — Demo mode</h2>
            <p className="text-[13px] text-[#94A3B8] leading-relaxed max-w-2xl">
              Simulate a sharp Nifty drawdown to trigger the panic-intercept flow. In production, this fires a real-time WhatsApp alert via Twilio when your portfolio drops beyond your personal threshold.
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-[14px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50 whitespace-nowrap"
          >
            Simulate drawdown
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </main>
    </div>
  )
}
