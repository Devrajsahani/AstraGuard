import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, TrendingUp, Target, AlertTriangle, Clock, Wallet, PiggyBank, Shield } from 'lucide-react'

function formatINR(num) {
  if (num == null || isNaN(num)) return '₹0'
  const abs = Math.abs(Math.round(num))
  const sign = num < 0 ? '-' : ''
  const str = abs.toString()
  if (str.length <= 3) return sign + '₹' + str
  let lastThree = str.slice(-3)
  let rest = str.slice(0, -3)
  if (rest.length > 0) lastThree = ',' + lastThree
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree
  return sign + '₹' + formatted
}

function formatCrore(num) {
  const cr = num / 10000000
  if (cr >= 1) return '₹' + cr.toFixed(2) + ' Cr'
  const lakh = num / 100000
  if (lakh >= 1) return '₹' + lakh.toFixed(1) + ' L'
  return formatINR(num)
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

function AnimatedNumber({ value, format = 'crore' }) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    const start = prev.current
    const end = value
    if (start === end) return
    const dur = 600
    const t0 = performance.now()
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setDisplay(start + (end - start) * ease)
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
    prev.current = end
  }, [value])
  return <span>{format === 'crore' ? formatCrore(display) : formatINR(display)}</span>
}

function computeFIRE(params) {
  const { currentAge, retireAge, monthlySIP, existingCorpus, monthlyDraw } = params
  const yearsToRetire = Math.max(retireAge - currentAge, 1)
  const annualReturn = 0.12
  const postRetireReturn = 0.07
  const inflation = 0.06
  const retirementYears = 30

  const realPostReturn = (postRetireReturn - inflation)
  const annualDraw = monthlyDraw * 12
  const targetCorpus = annualDraw * ((1 - Math.pow(1 + realPostReturn, -retirementYears)) / realPostReturn)

  const monthlyRate = annualReturn / 12
  const months = yearsToRetire * 12
  const sipFV = monthlySIP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
  const corpusFV = existingCorpus * Math.pow(1 + annualReturn, yearsToRetire)
  const projectedCorpus = sipFV + corpusFV

  const shortfall = targetCorpus - projectedCorpus
  let sipGap = 0
  if (shortfall > 0 && months > 0) {
    sipGap = shortfall / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))
  }

  const glidepath = []
  const segments = [
    { pct: 80, label: 'Aggressive Growth' },
    { pct: 60, label: 'Balanced Growth' },
    { pct: 40, label: 'Conservative Shift' },
    { pct: 25, label: 'Capital Preservation' },
  ]
  const segYears = Math.max(Math.floor(yearsToRetire / 4), 1)
  for (let i = 0; i < 4; i++) {
    const startAge = currentAge + i * segYears
    const endAge = i === 3 ? retireAge : currentAge + (i + 1) * segYears
    if (startAge >= retireAge) break
    glidepath.push({ startAge, endAge, equity: segments[i].pct, debt: 100 - segments[i].pct, label: segments[i].label })
  }

  const corpusAtAge = (age) => {
    const yrs = age - currentAge
    const m = yrs * 12
    const sipFv = monthlySIP * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate)
    return existingCorpus * Math.pow(1 + annualReturn, yrs) + sipFv
  }

  const milestones = []
  const y1 = Math.min(currentAge + Math.floor(yearsToRetire * 0.2), retireAge)
  milestones.push({ age: y1, text: `${formatCrore(corpusAtAge(y1))} compounding advantage locked in.` })

  const y2 = Math.min(currentAge + Math.floor(yearsToRetire * 0.55), retireAge)
  milestones.push({ age: y2, text: 'Emergency Goal fully funded.' })

  const y3 = Math.min(currentAge + Math.floor(yearsToRetire * 0.8), retireAge)
  milestones.push({ age: y3, text: `${formatCrore(corpusAtAge(y3))} milestone. Glidepath shift initiated.` })

  milestones.push({ age: retireAge, text: `Retirement. ${formatCrore(projectedCorpus)} corpus ${projectedCorpus >= targetCorpus ? 'achieved' : 'projected'}.` })

  return { targetCorpus, projectedCorpus, shortfall, sipGap, glidepath, milestones }
}

function SliderInput({ label, icon: Icon, value, onChange, min, max, step = 1, suffix = '' }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div style={{ marginBottom: 28 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
        <div className="flex items-center" style={{ gap: 10 }}>
          <Icon className="text-[#45A29E]" style={{ height: 16, width: 16 }} strokeWidth={1.75} />
          <span className="text-white/70 font-medium" style={{ fontSize: 13 }}>{label}</span>
        </div>
        <span className="font-bold text-white tabular-nums" style={{ fontSize: 15 }}>{value}{suffix}</span>
      </div>
      <div className="relative" style={{ height: 20, display: 'flex', alignItems: 'center' }}>
        <div className="absolute rounded-full" style={{ left: 0, right: 0, height: 6, background: 'rgba(0,0,0,0.5)' }} />
        <div className="absolute rounded-full bg-[#45A29E]" style={{ left: 0, width: `${pct}%`, height: 6 }} />
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute w-full cursor-pointer"
          style={{
            appearance: 'none', WebkitAppearance: 'none', background: 'transparent', height: 20, margin: 0, zIndex: 2,
          }}
        />
      </div>
    </div>
  )
}

function CurrencyInput({ label, icon: Icon, value, onChange }) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    onChange(Number(raw) || 0)
  }
  return (
    <div style={{ marginBottom: 24 }}>
      <div className="flex items-center" style={{ gap: 10, marginBottom: 12 }}>
        <Icon className="text-[#45A29E]" style={{ height: 16, width: 16 }} strokeWidth={1.75} />
        <span className="text-white/70 font-medium" style={{ fontSize: 13 }}>{label}</span>
      </div>
      <div className="rounded-xl border border-white/[0.1] bg-[#0B0C10]/80 flex items-center transition-all duration-200 focus-within:border-[#45A29E]/50"
        style={{ padding: '14px 20px' }}>
        <span className="text-[#45A29E] font-semibold" style={{ fontSize: 15, marginRight: 8 }}>₹</span>
        <input
          type="text"
          value={value ? value.toLocaleString('en-IN') : ''}
          onChange={handleChange}
          className="flex-1 min-w-0 bg-transparent text-white font-semibold outline-none placeholder:text-white/20"
          style={{ fontSize: 15 }}
          placeholder="0"
        />
      </div>
    </div>
  )
}

export default function FirePage() {
  const [currentAge, setCurrentAge] = useState(30)
  const [retireAge, setRetireAge] = useState(50)
  const [monthlySIP, setMonthlySIP] = useState(50000)
  const [existingCorpus, setExistingCorpus] = useState(1500000)
  const [monthlyDraw, setMonthlyDraw] = useState(100000)

  const debounced = useDebounce({ currentAge, retireAge, monthlySIP, existingCorpus, monthlyDraw }, 300)
  const [results, setResults] = useState(() => computeFIRE({ currentAge, retireAge, monthlySIP, existingCorpus, monthlyDraw }))
  const [computing, setComputing] = useState(false)

  useEffect(() => {
    setComputing(true)
    const t = setTimeout(() => {
      setResults(computeFIRE(debounced))
      setComputing(false)
    }, 150)
    return () => clearTimeout(t)
  }, [debounced])

  const handleRetireAge = useCallback((v) => {
    setRetireAge(Math.max(v, currentAge + 5))
  }, [currentAge])

  const isShortfall = results.shortfall > 0

  return (
    <div className="min-h-screen w-full bg-[#0B0C10] text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="w-full flex justify-center" style={{ padding: '48px 32px 64px' }}>
        <div className="w-full" style={{ maxWidth: 1280 }}>

          {/* Page header */}
          <div className="flex items-center" style={{ gap: 16, marginBottom: 40 }}>
            <div className="flex items-center justify-center rounded-2xl bg-[#45A29E]/12 border border-[#45A29E]/20"
              style={{ height: 48, width: 48 }}>
              <Flame className="text-[#45A29E]" style={{ height: 24, width: 24 }} strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="font-bold text-white" style={{ fontSize: 26, lineHeight: 1.2 }}>FIRE Planner</h1>
              <p className="text-[#94A3B8]" style={{ fontSize: 14, marginTop: 4 }}>Financial Independence, Retire Early — Simulator</p>
            </div>
          </div>

          {/* Two-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }} className="lg:!grid-cols-[380px_1fr]">

            {/* LEFT: Controls */}
            <div className="rounded-3xl border border-white/[0.08] overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(31,40,51,0.8) 0%, rgba(31,40,51,0.3) 100%)',
                backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                padding: '36px 32px',
              }}>

              <h2 className="font-bold text-white" style={{ fontSize: 18, marginBottom: 8 }}>Financial Parameters</h2>
              <p className="text-[#94A3B8]" style={{ fontSize: 13, marginBottom: 32 }}>Adjust inputs to simulate outcomes in real-time</p>

              <SliderInput label="Current Age" icon={Clock} value={currentAge} onChange={v => { setCurrentAge(v); if (retireAge <= v + 4) setRetireAge(v + 5) }} min={20} max={60} suffix=" yrs" />
              <SliderInput label="Target Retirement Age" icon={Target} value={retireAge} onChange={handleRetireAge} min={35} max={70} suffix=" yrs" />

              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 0 28px' }} />

              <CurrencyInput label="Current Monthly SIP" icon={TrendingUp} value={monthlySIP} onChange={setMonthlySIP} />
              <CurrencyInput label="Existing Corpus" icon={PiggyBank} value={existingCorpus} onChange={setExistingCorpus} />
              <CurrencyInput label="Monthly Draw Post-Retirement" icon={Wallet} value={monthlyDraw} onChange={setMonthlyDraw} />

              {/* Stress test button */}
              <button
                onClick={() => { setMonthlySIP(Math.round(monthlySIP * 0.5)); setExistingCorpus(Math.round(existingCorpus * 0.6)) }}
                className="w-full flex items-center justify-center rounded-xl font-semibold transition-all duration-200 hover:opacity-90 cursor-pointer"
                style={{ marginTop: 12, padding: '14px 24px', fontSize: 14, background: '#E11D48', color: 'white', gap: 10, border: 'none' }}>
                <AlertTriangle style={{ height: 16, width: 16 }} strokeWidth={2} />
                Stress Test — 50% SIP Cut
              </button>
            </div>

            {/* RIGHT: Results */}
            <div className="flex flex-col" style={{ gap: 28 }}>

              {/* Section A: Topline metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                {[
                  { label: 'Target Corpus Needed', value: results.targetCorpus, icon: Target, accent: false },
                  { label: 'Projected at Retirement', value: results.projectedCorpus, icon: TrendingUp, accent: isShortfall },
                  { label: isShortfall ? 'SIP Gap (Shortfall)' : 'Surplus', value: isShortfall ? results.sipGap : Math.abs(results.shortfall), icon: isShortfall ? AlertTriangle : Shield, accent: isShortfall },
                ].map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-2xl border border-white/[0.08]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(31,40,51,0.8) 0%, rgba(31,40,51,0.3) 100%)',
                      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                      padding: '28px 28px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    }}
                  >
                    <div className="flex items-center" style={{ gap: 10, marginBottom: 16 }}>
                      <m.icon className={m.accent ? 'text-[#E11D48]' : 'text-[#45A29E]'} style={{ height: 18, width: 18 }} strokeWidth={1.75} />
                      <span className="text-[#94A3B8] font-medium" style={{ fontSize: 13 }}>{m.label}</span>
                    </div>
                    <div className={`font-bold ${m.accent ? 'text-[#E11D48]' : 'text-white'}`} style={{ fontSize: 28, lineHeight: 1.2 }}>
                      <AnimatedNumber value={m.value} format={i === 2 && isShortfall ? 'inr' : 'crore'} />
                    </div>
                    {i === 2 && isShortfall && (
                      <p className="text-[#E11D48]/70" style={{ fontSize: 12, marginTop: 8 }}>per month additional needed</p>
                    )}
                    {i === 2 && !isShortfall && (
                      <p className="text-[#45A29E]/70" style={{ fontSize: 12, marginTop: 8 }}>corpus surplus projected</p>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Section B: Glidepath */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="rounded-2xl border border-white/[0.08]"
                style={{
                  background: 'linear-gradient(135deg, rgba(31,40,51,0.8) 0%, rgba(31,40,51,0.3) 100%)',
                  backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                  padding: '32px 32px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
              >
                <h3 className="font-bold text-white" style={{ fontSize: 17, marginBottom: 6 }}>Asset Allocation Glidepath</h3>
                <p className="text-[#94A3B8]" style={{ fontSize: 13, marginBottom: 28 }}>Equity-to-debt transition as you approach retirement</p>

                <div className="flex flex-col" style={{ gap: 16 }}>
                  {results.glidepath.map((seg, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                    >
                      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                        <span className="text-white/80 font-medium" style={{ fontSize: 13 }}>
                          Age {seg.startAge}–{seg.endAge}
                        </span>
                        <div className="flex items-center" style={{ gap: 16 }}>
                          <span className="text-[#45A29E] font-semibold" style={{ fontSize: 12 }}>{seg.equity}% Equity</span>
                          <span className="text-[#94A3B8]" style={{ fontSize: 12 }}>{seg.debt}% Debt</span>
                        </div>
                      </div>
                      <div className="rounded-full overflow-hidden flex" style={{ height: 10, background: 'rgba(0,0,0,0.4)' }}>
                        <motion.div
                          className="rounded-l-full bg-[#45A29E]"
                          initial={{ width: 0 }}
                          animate={{ width: `${seg.equity}%` }}
                          transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                          style={{ height: '100%' }}
                        />
                        <div className="flex-1 bg-[#1F2833]" style={{ height: '100%' }} />
                      </div>
                      <p className="text-white/30 italic" style={{ fontSize: 11, marginTop: 6 }}>{seg.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Section C: Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="rounded-2xl border border-white/[0.08]"
                style={{
                  background: 'linear-gradient(135deg, rgba(31,40,51,0.8) 0%, rgba(31,40,51,0.3) 100%)',
                  backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                  padding: '32px 32px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
              >
                <h3 className="font-bold text-white" style={{ fontSize: 17, marginBottom: 6 }}>Consequence Timeline</h3>
                <p className="text-[#94A3B8]" style={{ fontSize: 13, marginBottom: 28 }}>Key milestones based on your current trajectory</p>

                <div className="relative" style={{ marginLeft: 16 }}>
                  <div className="absolute" style={{ left: 0, top: 0, bottom: 0, width: 2, background: '#1F2833' }} />

                  <AnimatePresence mode="popLayout">
                    {results.milestones.map((ms, i) => (
                      <motion.div
                        key={`${ms.age}-${i}`}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="relative flex items-start"
                        style={{ paddingLeft: 28, paddingBottom: i < results.milestones.length - 1 ? 28 : 0 }}
                      >
                        <div className="absolute rounded-full bg-[#45A29E]"
                          style={{
                            left: -5, top: 6, width: 12, height: 12,
                            boxShadow: '0 0 12px rgba(69,162,158,0.5)',
                          }}
                        />
                        <div>
                          <span className="font-bold text-[#45A29E]" style={{ fontSize: 14 }}>Age {ms.age}</span>
                          <p className="text-white/70" style={{ fontSize: 14, marginTop: 4, lineHeight: 1.6 }}>{ms.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          border: 2px solid #45A29E;
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          border: 2px solid #45A29E;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          background: transparent;
          height: 6px;
        }
        input[type="range"]::-moz-range-track {
          background: transparent;
          height: 6px;
        }
        @media (min-width: 1024px) {
          .lg\\:!grid-cols-\\[380px_1fr\\] {
            grid-template-columns: 380px 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
