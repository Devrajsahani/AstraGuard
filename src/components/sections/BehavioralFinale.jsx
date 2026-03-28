import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Activity, BrainCircuit, MessageCircle, TrendingDown, Bell } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// ── Phone Screen Content ──────────────────────────────────────────
function PhoneScreen() {
  return (
    <div className="absolute inset-0 bg-black overflow-hidden w-full h-full">
      {/* ─ Status Bar ─ */}
      <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-8 pt-5 bg-transparent z-20">
        <span className="text-[10px] text-white/50 font-semibold tracking-wide">9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-5 h-2.5 rounded-sm border border-white/30 p-[1px]">
            <div className="w-2/3 h-full bg-[#45f3ff] rounded-[1px]" />
          </div>
        </div>
      </div>

      {/* ─ Main Content Area ─ */}
      <div className="absolute top-14 left-0 right-0 bottom-6 px-6 flex flex-col z-10">
        {/* ─ Portfolio Header ─ */}
        <div className="pt-2 pb-4">
          <p className="text-[10px] text-text-slate tracking-widest uppercase font-medium">Portfolio Value</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="phone-portfolio-value text-[26px] font-bold text-white tracking-tight">₹24,85,200</span>
          </div>
        </div>

        {/* ─ Chart Area ─ */}
        <div className="pb-4 flex-shrink-0">
        <div className="bg-white/[0.03] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-white/80">NIFTY 50</span>
            <span className="phone-nifty-badge text-[11px] text-red-400 font-bold flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              <span className="phone-nifty-pct">-7.2%</span>
            </span>
          </div>
          <svg viewBox="0 0 220 55" className="w-full h-14 phone-chart-svg">
            <defs>
              <linearGradient id="crashGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(239,68,68,0.25)" />
                <stop offset="100%" stopColor="rgba(239,68,68,0)" />
              </linearGradient>
            </defs>
            <path
              className="phone-chart-line"
              d="M0,12 C20,10 35,8 50,11 C65,14 80,16 100,22 C120,28 140,35 160,42 C180,48 200,52 220,54"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              className="phone-chart-fill"
              d="M0,12 C20,10 35,8 50,11 C65,14 80,16 100,22 C120,28 140,35 160,42 C180,48 200,52 220,54 L220,55 L0,55 Z"
              fill="url(#crashGrad)"
            />
          </svg>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[9px] text-text-slate">Intraday • 3:45 PM IST</span>
            <span className="text-[9px] text-red-400/70 font-mono">22,143.50</span>
          </div>
        </div>
      </div>

        {/* ─ Holdings List ─ */}
        <div className="phone-holdings flex flex-col gap-2.5">
        {[
          { name: 'Axis Bluechip', pct: '-5.1%', color: 'text-red-400' },
          { name: 'SBI Small Cap', pct: '-8.3%', color: 'text-red-400' },
          { name: 'ICICI Pru Value', pct: '-3.7%', color: 'text-red-400' },
        ].map((h) => (
          <div key={h.name} className="flex items-center justify-between py-2.5 px-4 bg-white/[0.02] rounded-lg">
            <span className="text-[12px] text-white/70">{h.name}</span>
            <span className={`text-[12px] font-mono font-semibold ${h.color}`}>{h.pct}</span>
          </div>
        ))}
        {/* end holdings list */}
      </div>
      {/* end main content area */}
      </div>

      {/* ─ WhatsApp Notification (Absolute centered overlay) ─ */}
      <div className="phone-notification-wrapper absolute inset-0 flex items-center justify-center px-4 z-50 pointer-events-none opacity-0">
        <div className="w-full bg-[#1F2833]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] pointer-events-auto">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-[#25D366]">AstraGuard Alert</p>
              <p className="text-[9px] text-text-slate">via WhatsApp • now</p>
            </div>
            <Bell className="w-3.5 h-3.5 text-[#25D366]/70 flex-shrink-0 phone-bell" />
          </div>
          <p className="text-[12px] text-white/90 leading-[1.6]">
            🚨 Nifty dropped 7.2%. Your FIRE plan is intact.{' '}
            <span className="text-[#45f3ff] font-semibold">Do not stop your SIP.</span>{' '}
            Stopping now delays retirement by 2.3 years.
          </p>
        </div>
      </div>

      {/* ─ Home bar ─ */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full z-[100]" />
    </div>
  )
}

// ── Feature Row ───────────────────────────────────────────────────
function FeatureItem({ icon: Icon, title, desc }) {
  return (
    <div className="feature-item flex gap-4 items-start opacity-0" style={{ transform: 'translateX(30px)' }}>
      <div className="w-10 h-10 rounded-xl bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-5 h-5 text-accent-teal" />
      </div>
      <div>
        <h4 className="text-[15px] font-semibold text-white mb-1">{title}</h4>
        <p className="text-[13px] text-text-slate leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────
export default function BehavioralFinale() {
  const sectionRef = useRef(null)
  const pinnedRef = useRef(null)
  const phoneRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: pinnedRef.current,
          scrub: 1,
          anticipatePin: 1,
        },
      })

      // ─── 0%–20%: Phone shifts from center to left ───
      tl.fromTo(
        phoneRef.current,
        { x: '0vw', scale: 0.92, opacity: 0.3 },
        { x: '0vw', scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
        0
      )

      // Phone holdings fade in with stagger
      tl.fromTo(
        '.phone-holdings > div',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.3 },
        0.2
      )

      // Nifty badge pulses red
      tl.fromTo(
        '.phone-nifty-badge',
        { scale: 1 },
        { scale: 1.15, duration: 0.15, yoyo: true, repeat: 1 },
        0.4
      )

      tl.to(
        phoneRef.current,
        { x: '-20vw', duration: 1, ease: 'power2.inOut' },
        0.6
      )

      // ─── 20%–40%: Text container fades in ───
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        1.2
      )

      // ─── 40%–70%: Feature rows stagger in ───
      tl.fromTo(
        '.feature-item',
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, stagger: 0.15, duration: 0.5, ease: 'power2.out' },
        1.8
      )

      // ─── 70%–90%: WhatsApp notification pops up in center ───
      tl.fromTo(
        '.phone-notification-wrapper',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)' },
        2.5
      )

      // Bell icon ring animation
      tl.fromTo(
        '.phone-bell',
        { rotation: 0 },
        { rotation: 20, duration: 0.1, yoyo: true, repeat: 5, ease: 'power1.inOut' },
        2.8
      )

      // Chart line draws in (strokeDashoffset)
      const chartLine = sectionRef.current?.querySelector('.phone-chart-line')
      if (chartLine) {
        const lineLength = chartLine.getTotalLength?.() || 400
        gsap.set(chartLine, { strokeDasharray: lineLength, strokeDashoffset: lineLength })
        tl.to(
          chartLine,
          { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' },
          0.1
        )
      }

      // Chart fill fades in after line draws
      tl.fromTo(
        '.phone-chart-fill',
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        0.6
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full h-[300vh] bg-void">
      {/* Pinned viewport wrapper */}
      <div
        ref={pinnedRef}
        className="w-full h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Ambient glows */}
        <div className="absolute top-1/2 left-[20%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-teal/5 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[400px] h-[400px] bg-[#45f3ff]/5 blur-[120px] rounded-full pointer-events-none" />

        {/* ── Smartphone Mockup ── */}
        <div
          ref={phoneRef}
          className="relative flex-shrink-0 z-20"
        >
          {/* Physical Phone Case */}
          <div className="w-[300px] md:w-[320px] h-[620px] md:h-[650px] rounded-[3rem] p-2 bg-[#1F2833] shadow-[0_0_60px_rgba(69,162,158,0.12),0_30px_60px_rgba(0,0,0,0.5)] relative">
            
            {/* Inner Screen Container */}
            <div className="w-full h-full rounded-[2.5rem] bg-black relative flex flex-col overflow-hidden">
              
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[26px] bg-[#1F2833] rounded-b-2xl z-40">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1 bg-white/20 rounded-full" />
              </div>

              <PhoneScreen />
            </div>
          </div>

          {/* Phone shadow reflection */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[260px] h-6 bg-accent-teal/5 blur-xl rounded-full" />
        </div>

        {/* ── Text & Features Panel ── */}
        <div
          ref={textRef}
          className="absolute right-[8%] xl:right-[10%] w-[42%] max-w-[560px] flex flex-col gap-7 opacity-0 z-10"
          style={{ transform: 'translateY(40px)' }}
        >
          {/* Badge */}
          <div className="w-max px-4 py-1.5 rounded-full border border-white/15 text-[#45f3ff] text-[11px] font-bold tracking-[0.15em] uppercase">
            Core Differentiator
          </div>

          {/* Heading */}
          <h2 className="text-5xl lg:text-6xl font-sans font-bold text-white leading-[1.1]">
            We Intercept the{' '}
            <span className="font-serif italic text-[#45f3ff]">Panic.</span>
          </h2>

          {/* Body */}
          <p className="text-xl text-text-slate leading-relaxed">
            AstraGuard doesn't just calculate your future; it actively defends it.
            When the market bleeds, we block the behavioral mistakes that destroy wealth.
          </p>

          {/* Features */}
          <div className="flex flex-col gap-5 mt-2">
            <FeatureItem
              icon={Activity}
              title="24/7 Market Monitoring"
              desc="Real-time sync with Nifty indices to track severe drawdowns as they happen."
            />
            <FeatureItem
              icon={BrainCircuit}
              title="Personalized Panic Thresholds"
              desc="Your unique behavioral DNA determines exactly when you need an intervention."
            />
            <FeatureItem
              icon={MessageCircle}
              title="Direct WhatsApp Delivery"
              desc="We don't wait for you to open the app. The intervention reaches your phone instantly."
            />
          </div>
        </div>
      </div>
    </section>
  )
}
