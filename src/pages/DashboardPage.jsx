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
  BarChart3,
  ArrowRight,
} from 'lucide-react'

function KpiCard({ icon: Icon, iconColor, iconBg, label, value, sub, badge, badgeColor }) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/[0.08] bg-[#111318] px-8 py-7 gap-5 hover:border-white/[0.14] transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={1.75} />
        </div>
        {badge && (
          <span className={`flex items-center gap-1.5 text-[12px] font-semibold rounded-full px-3 py-1 ${badgeColor}`}>
            <TrendingUp className="h-3.5 w-3.5" />
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-[12px] font-medium text-[#94A3B8] tracking-wide uppercase">{label}</p>
        <p className="text-[30px] font-bold text-white leading-none tracking-tight">{value}</p>
        {sub && <p className="text-[13px] text-[#94A3B8]/70 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

function ProgressRing({ valuePct, score, max }) {
  const r = 70
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(100, Math.max(0, valuePct)) / 100) * circ
  const sz = 180
  return (
    <div className="relative flex items-center justify-center mx-auto" style={{ width: sz, height: sz }}>
      <svg width={sz} height={sz} className="-rotate-90" aria-hidden>
        <circle cx={sz / 2} cy={sz / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="9" fill="none" />
        <circle cx={sz / 2} cy={sz / 2} r={r}
          stroke="url(#ringGrad)" strokeWidth="9" fill="none"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(.22,1,.36,1)' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#45A29E" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[44px] font-bold text-white tabular-nums leading-none">{score}</span>
        <span className="text-[13px] text-[#94A3B8] mt-2">of {max}</span>
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
    tagColor: 'text-[#45A29E] bg-[#45A29E]/12',
    title: 'Discipline milestone',
    body: "127-day SIP streak — you're in the top 8% of all users.",
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
    <div className="min-h-screen w-full bg-[#0B0C10] text-white font-sans flex justify-center">
      <div className="w-full max-w-5xl px-6 sm:px-10 py-12 flex flex-col gap-10">

        {/* ── Page heading ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Good morning, Aryan</h1>
            <p className="text-[15px] text-[#94A3B8] mt-2">Your portfolio is performing well — here's your daily snapshot.</p>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#94A3B8]/70 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 shrink-0 w-fit">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span className="tabular-nums">{today}</span>
          </div>
        </div>

        {/* ── KPI row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <KpiCard icon={IndianRupee} iconColor="text-[#45A29E]" iconBg="bg-[#45A29E]/12"
            label="Portfolio Value" value="₹18.4L" sub="Across 7 mutual funds" badge="+8.3%" badgeColor="text-emerald-400 bg-emerald-400/10" />
          <KpiCard icon={TrendingUp} iconColor="text-sky-400" iconBg="bg-sky-400/10"
            label="Monthly SIP" value="₹25,000" sub="Next debit in 3 days" badge="Active" badgeColor="text-sky-400 bg-sky-400/10" />
          <KpiCard icon={BarChart3} iconColor="text-violet-400" iconBg="bg-violet-400/10"
            label="XIRR Returns" value="14.2%" sub="Annualised since inception" badge="+1.4%" badgeColor="text-emerald-400 bg-emerald-400/10" />
          <KpiCard icon={Zap} iconColor="text-amber-400" iconBg="bg-amber-400/10"
            label="Arth Score" value="743" sub="Top 12% of all users" badge="+12 pts" badgeColor="text-emerald-400 bg-emerald-400/10" />
        </div>

        {/* ── Arth Score + Activity ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">

          {/* Arth Score card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111318] px-8 py-8 flex flex-col gap-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8] mb-2">Arth Score</p>
              <h2 className="text-[18px] font-semibold text-white leading-snug">Behaviour &amp; plan adherence</h2>
            </div>
            <ProgressRing valuePct={pct} score={score} max={scoreMax} />
            <div className="flex flex-col gap-5">
              {[
                { label: 'SIP discipline', pct: 92, color: 'bg-[#45A29E]' },
                { label: 'Goal adherence', pct: 78, color: 'bg-sky-400' },
                { label: 'Risk alignment', pct: 85, color: 'bg-violet-400' },
              ].map(item => (
                <div key={item.label} className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[#94A3B8]">{item.label}</span>
                    <span className="text-[14px] font-semibold text-white tabular-nums">{item.pct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/[0.06]">
                    <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.pct}%`, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[13px] text-[#94A3B8] text-center border-t border-white/[0.06] pt-6">
              <span className="text-[#45A29E] font-semibold">+12 pts</span> vs last month — excellent discipline
            </p>
          </div>

          {/* Activity feed */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111318] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.06]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8] mb-1.5">Activity Feed</p>
                <h2 className="text-[18px] font-semibold text-white">Recent signals &amp; milestones</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#45A29E]/20 bg-[#45A29E]/8 px-4 py-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#45A29E] opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#45A29E]" />
                </span>
                <span className="text-[11px] font-semibold text-[#45A29E] tracking-wide">Live</span>
              </div>
            </div>
            <ul className="flex flex-col divide-y divide-white/[0.05] flex-1">
              {feed.map(item => {
                const Icon = item.icon
                return (
                  <li key={item.title} className="flex gap-5 px-8 py-6 hover:bg-white/[0.02] transition-colors">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}>
                      <Icon className={`h-5 w-5 ${item.iconColor}`} strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg ${item.tagColor}`}>{item.tag}</span>
                        <span className="text-[12px] text-[#94A3B8]/55 tabular-nums ml-auto shrink-0">{item.time}</span>
                      </div>
                      <p className="text-[15px] font-semibold text-white">{item.title}</p>
                      <p className="text-[13px] text-[#94A3B8] leading-relaxed">{item.body}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* ── Engines & Goals ── */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8] mb-1">Modules</p>
              <h2 className="text-[18px] font-semibold text-white">Engines &amp; goals</h2>
            </div>
            <span className="text-[13px] text-[#94A3B8]/55">4 active</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {engines.map(e => {
              const Icon = e.icon
              const inner = (
                <div className="flex flex-col gap-6 px-7 py-7 h-full">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                      <Icon className="h-6 w-6 text-white/65" strokeWidth={1.5} />
                    </div>
                    {e.href && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] group-hover:bg-[#45A29E]/15 transition-colors">
                        <ArrowUpRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#45A29E] transition-colors" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <h3 className="text-[16px] font-semibold text-white">{e.title}</h3>
                    <p className="text-[13px] text-[#94A3B8]">{e.desc}</p>
                  </div>
                  <div className="border-t border-white/[0.05] pt-5">
                    <span className={`inline-flex items-center rounded-lg px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider ${e.badgeStyle}`}>
                      {e.badge}
                    </span>
                  </div>
                </div>
              )
              return e.href ? (
                <Link key={e.title} to={e.to}
                  className="group block rounded-2xl border border-white/[0.08] bg-[#111318] transition-all duration-200 hover:border-[#45A29E]/30 hover:bg-[#45A29E]/[0.02] focus:outline-none">
                  {inner}
                </Link>
              ) : (
                <div key={e.title} className="rounded-2xl border border-white/[0.08] bg-[#111318]">
                  {inner}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Behavioral guard demo ── */}
        <div className="rounded-2xl border border-rose-500/15 bg-[#100d0d] px-8 py-7 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-rose-500/12 border border-rose-500/20 p-3">
            <Zap className="h-6 w-6 text-rose-400" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <h2 className="text-[16px] font-bold text-white">Behavioral Guard — Demo mode</h2>
            <p className="text-[13px] text-[#94A3B8] leading-relaxed max-w-2xl">
              Simulate a sharp Nifty drawdown to trigger the panic-intercept flow. In production, this fires a real-time WhatsApp alert when your portfolio drops beyond your personal threshold.
            </p>
          </div>
          <button type="button"
            className="shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[14px] font-semibold transition-colors whitespace-nowrap">
            Simulate drawdown
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  )
}
