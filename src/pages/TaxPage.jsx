import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scale, FileKey, Lightbulb, Check, ArrowRight, Calculator, IndianRupee, Shield, Heart, Building, Landmark } from 'lucide-react'

function formatINR(num) {
  if (num == null || isNaN(num)) return '₹0'
  const abs = Math.abs(Math.round(num))
  const sign = num < 0 ? '-' : ''
  const str = abs.toString()
  if (str.length <= 3) return sign + '₹' + str
  let lastThree = str.slice(-3)
  let rest = str.slice(0, -3)
  if (rest.length > 0) lastThree = ',' + lastThree
  return sign + '₹' + rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree
}

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    const start = prev.current
    const end = value
    if (start === end) return
    const dur = 500
    const t0 = performance.now()
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(start + (end - start) * ease))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
    prev.current = end
  }, [value])
  return <span>{formatINR(display)}</span>
}

function computeTax(params) {
  const { grossSalary, section80C, section80D, hra, nps80CCD } = params

  const standardDeduction = 50000
  const sec80CLimit = 150000
  const sec80CCDLimit = 50000
  const actual80C = Math.min(section80C, sec80CLimit)
  const actual80D = Math.min(section80D, 100000)
  const actualNPS = Math.min(nps80CCD, sec80CCDLimit)
  const actualHRA = hra

  const oldTaxableIncome = Math.max(grossSalary - standardDeduction - actual80C - actual80D - actualHRA - actualNPS, 0)

  const oldSlabs = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 0.05 },
    { limit: 1000000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
  ]

  let oldTax = 0
  let remaining = oldTaxableIncome
  let prevLimit = 0
  const oldBreakdown = []
  for (const slab of oldSlabs) {
    const bracket = Math.min(remaining, slab.limit - prevLimit)
    if (bracket <= 0) break
    const tax = bracket * slab.rate
    oldTax += tax
    if (slab.rate > 0) {
      oldBreakdown.push({ bracket, rate: slab.rate, tax, from: prevLimit, to: Math.min(prevLimit + bracket, slab.limit) })
    }
    remaining -= bracket
    prevLimit = slab.limit
  }
  if (oldTaxableIncome <= 500000) oldTax = Math.max(oldTax - 12500, 0)
  const oldRebateApplied = oldTaxableIncome <= 500000 && oldTax === 0
  oldTax += oldTax * 0.04

  const newTaxableIncome = Math.max(grossSalary - standardDeduction, 0)
  const newSlabs = [
    { limit: 300000, rate: 0 },
    { limit: 600000, rate: 0.05 },
    { limit: 900000, rate: 0.10 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
  ]

  let newTax = 0
  remaining = newTaxableIncome
  prevLimit = 0
  for (const slab of newSlabs) {
    const bracket = Math.min(remaining, slab.limit - prevLimit)
    if (bracket <= 0) break
    newTax += bracket * slab.rate
    remaining -= bracket
    prevLimit = slab.limit
  }
  if (newTaxableIncome <= 700000) newTax = Math.max(newTax - 25000, 0)
  newTax += newTax * 0.04

  const oldWins = oldTax <= newTax
  const savings = Math.abs(oldTax - newTax)

  const missedDeductions = []
  if (nps80CCD < sec80CCDLimit) {
    const gap = sec80CCDLimit - nps80CCD
    const potentialSave = Math.round(gap * 0.312)
    missedDeductions.push({
      title: '80CCD(1B) NPS Contribution',
      text: nps80CCD === 0
        ? `You have contributed ₹0 to NPS. Maximizing your 80CCD(1B) with ${formatINR(sec80CCDLimit)} will save you an additional ${formatINR(potentialSave)} in the Old Regime.`
        : `Your NPS contribution of ${formatINR(nps80CCD)} is below the ${formatINR(sec80CCDLimit)} limit. Adding ${formatINR(gap)} more saves approximately ${formatINR(potentialSave)}.`,
      field: 'nps80CCD',
      amount: sec80CCDLimit,
    })
  }
  if (section80D < 25000 && grossSalary > 500000) {
    const gap = 25000 - section80D
    missedDeductions.push({
      title: '80D Health Insurance',
      text: section80D === 0
        ? `No health insurance premium declared. A ₹25,000 policy saves you approximately ${formatINR(Math.round(gap * 0.312))} in tax under the Old Regime.`
        : `Your 80D claim of ${formatINR(section80D)} can be increased by ${formatINR(gap)}. This saves approximately ${formatINR(Math.round(gap * 0.312))}.`,
      field: 'section80D',
      amount: 25000,
    })
  }
  if (section80C < sec80CLimit) {
    const gap = sec80CLimit - section80C
    missedDeductions.push({
      title: '80C Not Maximized',
      text: `You have ${formatINR(gap)} unused in your 80C limit. Investing this in ELSS or PPF saves approximately ${formatINR(Math.round(gap * 0.312))}.`,
      field: 'section80C',
      amount: sec80CLimit,
    })
  }

  const auditLines = [
    { label: 'Base Salary', value: formatINR(grossSalary) },
    { label: 'Standard Deduction Applied', value: '-' + formatINR(standardDeduction) },
    ...(actual80C > 0 ? [{ label: section80C > sec80CLimit ? '80C Limit Breached. Max allowed applied' : '80C Investments Deducted', value: '-' + formatINR(actual80C) }] : []),
    ...(actual80D > 0 ? [{ label: '80D Health Insurance Deducted', value: '-' + formatINR(actual80D) }] : []),
    ...(actualHRA > 0 ? [{ label: 'HRA Exemption Applied', value: '-' + formatINR(actualHRA) }] : []),
    ...(actualNPS > 0 ? [{ label: '80CCD(1B) NPS Deducted', value: '-' + formatINR(actualNPS) }] : []),
    { label: 'Taxable Income (Old)', value: formatINR(oldTaxableIncome), highlight: true },
    ...oldBreakdown.map(b => ({
      label: `Bracket (${(b.rate * 100).toFixed(0)}%): (${formatINR(b.from)}–${formatINR(b.from + b.bracket)}) × ${b.rate}`,
      value: formatINR(b.tax),
    })),
    ...(oldRebateApplied ? [{ label: 'Section 87A Rebate Applied (Income ≤ ₹5L)', value: '-₹12,500' }] : []),
    { label: 'Cess (4% on Tax)', value: formatINR(Math.round((oldTax / 1.04) * 0.04)) },
    { label: 'Total Tax (Old Regime)', value: formatINR(Math.round(oldTax)), highlight: true },
  ]

  return { oldTax: Math.round(oldTax), newTax: Math.round(newTax), oldWins, savings, missedDeductions, auditLines, oldTaxableIncome, newTaxableIncome }
}

function TaxInput({ label, icon: Icon, value, onChange }) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    onChange(Number(raw) || 0)
  }
  return (
    <div style={{ marginBottom: 22 }}>
      <div className="flex items-center" style={{ gap: 10, marginBottom: 10 }}>
        <Icon className="text-[#45A29E]" style={{ height: 15, width: 15 }} strokeWidth={1.75} />
        <span className="text-white/70 font-medium" style={{ fontSize: 13 }}>{label}</span>
      </div>
      <div className="rounded-xl border border-white/[0.1] bg-black/50 flex items-center transition-all duration-200 focus-within:border-[#45A29E]/50"
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

const glassStyle = {
  background: 'linear-gradient(135deg, rgba(31,40,51,0.8) 0%, rgba(31,40,51,0.3) 100%)',
  backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
}

export default function TaxPage() {
  const [grossSalary, setGrossSalary] = useState(1800000)
  const [section80C, setSection80C] = useState(150000)
  const [section80D, setSection80D] = useState(25000)
  const [hra, setHRA] = useState(120000)
  const [nps80CCD, setNPS] = useState(0)

  const [results, setResults] = useState(() => computeTax({ grossSalary, section80C, section80D, hra, nps80CCD }))

  useEffect(() => {
    const t = setTimeout(() => {
      setResults(computeTax({ grossSalary, section80C, section80D, hra, nps80CCD }))
    }, 250)
    return () => clearTimeout(t)
  }, [grossSalary, section80C, section80D, hra, nps80CCD])

  const applyDeduction = (field, amount) => {
    if (field === 'nps80CCD') setNPS(amount)
    else if (field === 'section80D') setSection80D(amount)
    else if (field === 'section80C') setSection80C(amount)
  }

  return (
    <div className="min-h-screen w-full bg-[#0B0C10] text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="w-full flex flex-col items-center" style={{ padding: '48px 32px 64px' }}>
        <div className="w-full" style={{ maxWidth: 1280 }}>

          {/* Header */}
          <div className="flex items-center" style={{ gap: 16, marginBottom: 40 }}>
            <div className="flex items-center justify-center rounded-2xl bg-[#45A29E]/12 border border-[#45A29E]/20"
              style={{ height: 48, width: 48 }}>
              <Scale className="text-[#45A29E]" style={{ height: 24, width: 24 }} strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="font-bold text-white" style={{ fontSize: 26, lineHeight: 1.2 }}>Tax Optimization Matrix</h1>
              <p className="text-[#94A3B8]" style={{ fontSize: 14, marginTop: 4 }}>Deterministic Old vs. New Regime Evaluation</p>
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }} className="lg:!grid-cols-[380px_1fr]">

            {/* LEFT: Inputs */}
            <div className="rounded-3xl border border-white/[0.08] overflow-hidden"
              style={{ ...glassStyle, padding: '36px 32px' }}>
              <h2 className="font-bold text-white" style={{ fontSize: 18, marginBottom: 6 }}>Financial Parameters</h2>
              <p className="text-[#94A3B8]" style={{ fontSize: 13, marginBottom: 28 }}>Enter your income and deduction details</p>

              <TaxInput label="Gross Annual Salary" icon={IndianRupee} value={grossSalary} onChange={setGrossSalary} />
              <TaxInput label="80C Investments (EPF, ELSS, PPF)" icon={Landmark} value={section80C} onChange={setSection80C} />
              <TaxInput label="80D Health Insurance" icon={Heart} value={section80D} onChange={setSection80D} />
              <TaxInput label="HRA Exemption" icon={Building} value={hra} onChange={setHRA} />
              <TaxInput label="80CCD(1B) NPS Contribution" icon={Shield} value={nps80CCD} onChange={setNPS} />
            </div>

            {/* RIGHT: Results */}
            <div className="flex flex-col" style={{ gap: 28 }}>

              {/* Zone A: Regime Showdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                {[
                  { label: 'Old Regime Liability', tax: results.oldTax, isWinner: results.oldWins },
                  { label: 'New Regime Liability', tax: results.newTax, isWinner: !results.oldWins },
                ].map((regime, i) => (
                  <motion.div
                    key={regime.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-2xl border overflow-hidden relative"
                    style={{
                      ...glassStyle,
                      padding: '32px 32px',
                      borderColor: regime.isWinner ? '#45A29E' : 'rgba(255,255,255,0.08)',
                      boxShadow: regime.isWinner ? '0 0 24px rgba(69,162,158,0.2), 0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.3)',
                      opacity: regime.isWinner ? 1 : 0.6,
                      transition: 'all 0.4s ease',
                    }}
                  >
                    <AnimatePresence>
                      {regime.isWinner && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-center rounded-full bg-[#45A29E]/20"
                          style={{ padding: '6px 14px', gap: 6, marginBottom: 20, display: 'inline-flex' }}
                        >
                          <Check className="text-[#45A29E]" style={{ height: 14, width: 14 }} strokeWidth={2.5} />
                          <span className="text-[#45A29E] font-semibold" style={{ fontSize: 12 }}>Recommended Path</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {!regime.isWinner && <div style={{ height: 20, marginBottom: 20 }} />}

                    <div className="flex items-center" style={{ gap: 10, marginBottom: 16 }}>
                      <Calculator className={regime.isWinner ? 'text-[#45A29E]' : 'text-[#94A3B8]'} style={{ height: 18, width: 18 }} strokeWidth={1.75} />
                      <span className="text-[#94A3B8] font-medium" style={{ fontSize: 14 }}>{regime.label}</span>
                    </div>

                    <div className={`font-bold ${regime.isWinner ? 'text-white' : 'text-white/60'}`} style={{ fontSize: 32, lineHeight: 1.2 }}>
                      <AnimatedNumber value={regime.tax} />
                    </div>

                    {regime.isWinner && results.savings > 0 && (
                      <p className="text-[#45A29E]" style={{ fontSize: 13, marginTop: 12 }}>
                        Saves you {formatINR(results.savings)} vs the other regime
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Zone B: Missed Deductions */}
              <AnimatePresence>
                {results.missedDeductions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex flex-col"
                    style={{ gap: 16 }}
                  >
                    {results.missedDeductions.map((d, i) => (
                      <div
                        key={d.field}
                        className="rounded-2xl border border-white/[0.08] overflow-hidden"
                        style={{
                          ...glassStyle,
                          padding: '28px 32px',
                          borderLeft: '3px solid #45A29E',
                        }}
                      >
                        <div className="flex items-start" style={{ gap: 16 }}>
                          <div className="shrink-0 flex items-center justify-center rounded-xl bg-[#45A29E]/12"
                            style={{ height: 40, width: 40, marginTop: 2 }}>
                            <Lightbulb className="text-[#45A29E]" style={{ height: 20, width: 20 }} strokeWidth={1.75} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white" style={{ fontSize: 15, marginBottom: 6 }}>
                              Actionable Saving Discovered
                            </h4>
                            <p className="text-white/60" style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                              {d.text}
                            </p>
                            <button
                              onClick={() => applyDeduction(d.field, d.amount)}
                              className="flex items-center rounded-xl font-semibold transition-all duration-200 hover:opacity-90 cursor-pointer bg-[#45A29E]/15 border border-[#45A29E]/30 text-[#45A29E]"
                              style={{ padding: '10px 20px', fontSize: 13, gap: 8 }}
                            >
                              <ArrowRight style={{ height: 14, width: 14 }} strokeWidth={2} />
                              Recalculate with {d.title}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {results.missedDeductions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-[#45A29E]/20 overflow-hidden"
                  style={{ ...glassStyle, padding: '28px 32px', borderLeft: '3px solid #45A29E' }}
                >
                  <div className="flex items-center" style={{ gap: 14 }}>
                    <div className="shrink-0 flex items-center justify-center rounded-xl bg-[#45A29E]/12"
                      style={{ height: 40, width: 40 }}>
                      <Check className="text-[#45A29E]" style={{ height: 20, width: 20 }} strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white" style={{ fontSize: 15, marginBottom: 4 }}>All Deductions Maximized</h4>
                      <p className="text-white/50" style={{ fontSize: 13 }}>No missed savings detected. Your tax profile is fully optimized.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Zone C: Audit Trace */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="rounded-2xl border border-white/[0.05] overflow-hidden"
                style={{ background: '#050505', padding: '32px 32px' }}
              >
                <div className="flex items-center" style={{ gap: 12, marginBottom: 24 }}>
                  <FileKey className="text-[#45A29E]" style={{ height: 18, width: 18 }} strokeWidth={1.75} />
                  <h3 className="font-bold text-white" style={{ fontSize: 16 }}>Calculation Audit Trace</h3>
                  <span className="text-[#94A3B8]/50 font-mono" style={{ fontSize: 11, marginLeft: 'auto' }}>OLD REGIME</span>
                </div>

                <div className="font-mono" style={{ fontSize: 13 }}>
                  {results.auditLines.map((line, i) => (
                    <motion.div
                      key={`${line.label}-${i}`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className={`flex items-center justify-between ${line.highlight ? 'text-[#45A29E]' : 'text-white/50'}`}
                      style={{
                        padding: '10px 16px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: line.highlight ? 'rgba(69,162,158,0.06)' : 'transparent',
                        borderRadius: line.highlight ? 8 : 0,
                        fontWeight: line.highlight ? 700 : 400,
                      }}
                    >
                      <span style={{ marginRight: 24 }}>&gt; {line.label}</span>
                      <span className="tabular-nums shrink-0" style={{ fontWeight: 600 }}>{line.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg\\:!grid-cols-\\[380px_1fr\\] {
            grid-template-columns: 380px 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
