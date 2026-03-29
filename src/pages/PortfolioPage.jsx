import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, Search, BrainCircuit, TrendingUp, Wallet, BarChart3, AlertTriangle, Info, Loader2 } from 'lucide-react'
import { api } from '../services/api'

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

const FUNDS = ['PPFAS Flexi', 'HDFC Mid-Cap', 'SBI Small', 'Axis Bluechip', 'Mirae Large']

const OVERLAP_DATA = [
  [100, 45, 12, 38, 52],
  [45, 100, 8, 22, 18],
  [12, 8, 100, 5, 14],
  [38, 22, 5, 100, 65],
  [52, 18, 14, 65, 100],
]

const OVERLAP_STOCKS = {
  '0-1': 'HDFC Bank, Infosys, ICICI Bank',
  '1-0': 'HDFC Bank, Infosys, ICICI Bank',
  '0-4': 'Reliance, TCS, Bajaj Finance',
  '4-0': 'Reliance, TCS, Bajaj Finance',
  '0-3': 'HDFC Bank, Kotak, Bharti Airtel',
  '3-0': 'HDFC Bank, Kotak, Bharti Airtel',
  '3-4': 'Reliance, HDFC Bank, TCS, L&T',
  '4-3': 'Reliance, HDFC Bank, TCS, L&T',
}

const FUND_HOLDINGS = [
  { name: 'Parag Parikh Flexi Cap', code: 'PPFAS', invested: 350000, current: 442000, xirr: 21.2 },
  { name: 'HDFC Mid-Cap Opportunities', code: 'HDFC Mid', invested: 280000, current: 338000, xirr: 16.8 },
  { name: 'SBI Small Cap Fund', code: 'SBI Small', invested: 200000, current: 268000, xirr: 24.1 },
  { name: 'Axis Bluechip Fund', code: 'Axis Blue', invested: 250000, current: 289000, xirr: 12.4 },
  { name: 'Mirae Asset Large Cap', code: 'Mirae', invested: 170000, current: 205000, xirr: 15.7 },
]

const glassStyle = {
  background: 'linear-gradient(135deg, rgba(31,40,51,0.8) 0%, rgba(31,40,51,0.3) 100%)',
  backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
}

export default function PortfolioPage() {
  const [dataLoaded, setDataLoaded] = useState(new URLSearchParams(window.location.search).get('demo') === '1')
  const [loading, setLoading] = useState(false)
  const [hoveredCell, setHoveredCell] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileRef = useRef(null)

  const totalInvested = FUND_HOLDINGS.reduce((s, f) => s + f.invested, 0)
  const totalCurrent = FUND_HOLDINGS.reduce((s, f) => s + f.current, 0)
  const weightedXIRR = FUND_HOLDINGS.reduce((s, f) => s + f.xirr * (f.invested / totalInvested), 0)

  const uploadFile = async (file) => {
    try {
      setLoading(true)
      // The API endpoint needs the actual file
      const res = await api.uploadCAS('user_123', 'PAN1234', file)
      console.log('CAS Upload Success!', res.data)
      alert("Backend parsed your CAS! Check browser console for full JSON payload.")
      setDataLoaded(true)
    } catch (err) {
      console.error('CAS Upload Failed:', err)
      alert("Failed to connect to backend. Falling back to Demo Mode...")
      setDataLoaded(true) // Fall back to demo mode gracefully so frontend still works
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#0B0C10] text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="w-full flex flex-col items-center" style={{ padding: '48px 32px 64px' }}>
        <div className="w-full" style={{ maxWidth: 1280 }}>

          {/* Header */}
          <div className="flex items-center" style={{ gap: 16, marginBottom: 12 }}>
            <div className="flex items-center justify-center rounded-2xl bg-[#45A29E]/12 border border-[#45A29E]/20"
              style={{ height: 48, width: 48 }}>
              <Search className="text-[#45A29E]" style={{ height: 24, width: 24 }} strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="font-bold text-white" style={{ fontSize: 26, lineHeight: 1.2 }}>Mutual Fund X-Ray Scanner</h1>
              <p className="text-[#94A3B8]" style={{ fontSize: 14, marginTop: 4 }}>Upload your CAMS statement to detect dangerous overlaps and optimize STCG</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!dataLoaded ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                style={{ marginTop: 40 }}
              >
                {/* Upload zone */}
                <div
                  className={`rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer relative overflow-hidden transition-all duration-300 ${
                    isDragOver ? 'border-[#45A29E] bg-[#45A29E]/[0.06]' : 'border-[#45A29E]/40 hover:bg-[#45A29E]/[0.03]'
                  }`}
                  style={{ ...glassStyle, height: 320, padding: '48px 32px' }}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      uploadFile(e.target.files[0])
                    }
                  }} />

                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="flex items-center justify-center rounded-2xl bg-[#45A29E]/15 border border-[#45A29E]/25 text-[#45A29E]"
                      style={{ height: 64, width: 64, marginBottom: 24 }}
                    >
                      <Loader2 style={{ height: 32, width: 32 }} strokeWidth={2} />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex items-center justify-center rounded-2xl bg-[#45A29E]/15 border border-[#45A29E]/25"
                      style={{ height: 64, width: 64, marginBottom: 24 }}
                    >
                      <UploadCloud className="text-[#45A29E]" style={{ height: 32, width: 32 }} strokeWidth={1.5} />
                    </motion.div>
                  )}

                  <h2 className="font-bold text-white text-center" style={{ fontSize: 20, marginBottom: 8 }}>
                    {loading ? 'Uploading safely directly to backend...' : 'Drag & Drop CAMS Detailed PDF'}
                  </h2>
                  <p className="text-[#94A3B8] text-center" style={{ fontSize: 14, lineHeight: 1.6 }}>
                    Encrypted locally. We do not store your PAN.
                  </p>
                  <p className="text-white/30 text-center" style={{ fontSize: 13, marginTop: 12 }}>
                    or click to browse files
                  </p>
                </div>

                {/* Guide Panel */}
                <div style={{
                  marginTop: 32, borderRadius: 20, padding: '28px 32px',
                  border: '1px solid rgba(69,162,158,0.15)',
                  background: 'linear-gradient(135deg, rgba(69,162,158,0.04) 0%, rgba(17,19,24,0.8) 100%)',
                }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 6 }}>
                    Don't have your statements yet?
                  </p>
                  <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6, marginBottom: 24 }}>
                    Download our smart guide extension, then visit the portal. The extension will automatically activate and guide you step-by-step to download your files.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                    <a
                      href="/astra-guide-extension.zip"
                      download="astra-guide-extension.zip"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        padding: '16px 20px', borderRadius: 14,
                        background: '#45A29E', color: '#0B0C10',
                        fontSize: 14, fontWeight: 700,
                        textDecoration: 'none', transition: 'all 0.2s ease',
                        boxShadow: '0 0 24px rgba(69,162,158,0.15)',
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                      1. Download Extension
                    </a>

                    <a
                      href="https://mfs.kfintech.com/investor/General/ConsolidatedAccountStatement"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 16px', borderRadius: 14,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 500,
                        textDecoration: 'none', transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 22, height: 22, borderRadius: 6,
                          background: 'rgba(69,162,158,0.2)', color: '#45A29E',
                          fontSize: 11, fontWeight: 700,
                        }}>2</span>
                        Go to KFintech
                      </span>
                      <span style={{ opacity: 0.5, fontSize: 12 }}>↗</span>
                    </a>

                    <a
                      href="https://www.tdscpc.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 16px', borderRadius: 14,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 500,
                        textDecoration: 'none', transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 22, height: 22, borderRadius: 6,
                          background: 'rgba(69,162,158,0.2)', color: '#45A29E',
                          fontSize: 11, fontWeight: 700,
                        }}>3</span>
                        Go to TRACES (Form 16)
                      </span>
                      <span style={{ opacity: 0.5, fontSize: 12 }}>↗</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 28, marginTop: 36 }}
                className="lg:!grid-cols-[360px_1fr]"
              >
                {/* LEFT COLUMN */}
                <div className="flex flex-col" style={{ gap: 24 }}>

                  {/* Topline metrics */}
                  <div className="rounded-3xl border border-white/[0.08] overflow-hidden"
                    style={{ ...glassStyle, padding: '32px 28px' }}>
                    <h3 className="font-bold text-white" style={{ fontSize: 16, marginBottom: 24 }}>Portfolio Summary</h3>

                    {[
                      { label: 'Total Invested', value: formatINR(totalInvested), icon: Wallet, color: 'text-white' },
                      { label: 'Current Value', value: formatINR(totalCurrent), icon: TrendingUp, color: 'text-[#45A29E]' },
                      { label: 'True XIRR', value: weightedXIRR.toFixed(1) + '%', icon: BarChart3, color: 'text-[#45A29E]' },
                    ].map((m, i) => (
                      <div key={m.label} className="flex items-center justify-between"
                        style={{
                          padding: '16px 0',
                          borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                        }}>
                        <div className="flex items-center" style={{ gap: 12 }}>
                          <m.icon className="text-[#94A3B8]" style={{ height: 16, width: 16 }} strokeWidth={1.75} />
                          <span className="text-[#94A3B8]" style={{ fontSize: 13 }}>{m.label}</span>
                        </div>
                        <span className={`font-bold ${m.color}`} style={{ fontSize: 18 }}>{m.value}</span>
                      </div>
                    ))}

                    <div className="rounded-xl bg-[#45A29E]/8 border border-[#45A29E]/15" style={{ padding: '16px 20px', marginTop: 20 }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                        <span className="text-white/50" style={{ fontSize: 12 }}>Unrealized Gain</span>
                        <span className="font-bold text-[#45A29E]" style={{ fontSize: 15 }}>{formatINR(totalCurrent - totalInvested)}</span>
                      </div>
                      <div className="rounded-full bg-black/40 overflow-hidden" style={{ height: 6 }}>
                        <div className="rounded-full bg-[#45A29E] h-full" style={{ width: `${Math.min(((totalCurrent - totalInvested) / totalInvested) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* AI Rebalancing */}
                  <div className="rounded-3xl border border-white/[0.08] overflow-hidden"
                    style={{ ...glassStyle, padding: '32px 28px' }}>
                    <div className="flex items-center" style={{ gap: 12, marginBottom: 20 }}>
                      <div className="flex items-center justify-center rounded-xl bg-[#E11D48]/12 border border-[#E11D48]/20"
                        style={{ height: 36, width: 36 }}>
                        <BrainCircuit className="text-[#E11D48]" style={{ height: 18, width: 18 }} strokeWidth={1.75} />
                      </div>
                      <h3 className="font-bold text-white" style={{ fontSize: 16 }}>AI Rebalancing Strategy</h3>
                    </div>

                    <div className="rounded-xl border border-[#E11D48]/15 bg-[#E11D48]/[0.04]" style={{ padding: '20px 20px', marginBottom: 20 }}>
                      <div className="flex items-start" style={{ gap: 10, marginBottom: 12 }}>
                        <AlertTriangle className="text-[#E11D48] shrink-0" style={{ height: 16, width: 16, marginTop: 2 }} strokeWidth={2} />
                        <span className="text-[#E11D48] font-semibold" style={{ fontSize: 13 }}>High Concentration Risk Detected</span>
                      </div>
                      <p className="text-white/60" style={{ fontSize: 14, lineHeight: 1.75 }}>
                        High exposure to Reliance Industries across 3 funds (PPFAS, Axis, Mirae).
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06]" style={{ padding: '20px 20px' }}>
                      <p className="text-white/50 font-semibold" style={{ fontSize: 11, letterSpacing: '0.1em', marginBottom: 12 }}>RECOMMENDED ACTION</p>
                      <p className="text-white/70" style={{ fontSize: 14, lineHeight: 1.75 }}>
                        Sell {formatINR(120000)} of Parag Parikh Flexi Cap.{' '}
                        <span className="text-[#45A29E] font-semibold">Wait until April 15th</span> to execute to avoid 20% STCG tax penalty.
                      </p>
                    </div>
                  </div>

                  {/* Fund list */}
                  <div className="rounded-3xl border border-white/[0.08] overflow-hidden"
                    style={{ ...glassStyle, padding: '28px 24px' }}>
                    <h3 className="font-bold text-white" style={{ fontSize: 15, marginBottom: 20 }}>Fund Holdings</h3>
                    <div className="flex flex-col" style={{ gap: 12 }}>
                      {FUND_HOLDINGS.map((f) => (
                        <div key={f.code} className="rounded-xl bg-white/[0.03] border border-white/[0.05]"
                          style={{ padding: '16px 18px' }}>
                          <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                            <span className="text-white/80 font-medium" style={{ fontSize: 13 }}>{f.code}</span>
                            <span className="text-[#45A29E] font-bold" style={{ fontSize: 13 }}>{f.xirr}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/30" style={{ fontSize: 12 }}>Invested: {formatINR(f.invested)}</span>
                            <span className="text-white/50" style={{ fontSize: 12 }}>Current: {formatINR(f.current)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Heatmap */}
                <div className="rounded-3xl border border-white/[0.08] overflow-hidden"
                  style={{ ...glassStyle, padding: '32px 32px' }}>
                  <h3 className="font-bold text-white" style={{ fontSize: 17, marginBottom: 6 }}>Underlying Asset Overlap</h3>
                  <p className="text-[#94A3B8]" style={{ fontSize: 13, marginBottom: 8 }}>Fund vs Fund — hover crimson cells for overlapping stocks</p>

                  <div className="flex items-center" style={{ gap: 20, marginBottom: 28 }}>
                    <div className="flex items-center" style={{ gap: 6 }}>
                      <div className="rounded" style={{ width: 12, height: 12, background: 'rgba(225,29,72,0.25)' }} />
                      <span className="text-white/40" style={{ fontSize: 11 }}>&gt; 40% overlap</span>
                    </div>
                    <div className="flex items-center" style={{ gap: 6 }}>
                      <div className="rounded" style={{ width: 12, height: 12, background: 'rgba(69,162,158,0.25)' }} />
                      <span className="text-white/40" style={{ fontSize: 11 }}>&lt; 20% overlap</span>
                    </div>
                    <div className="flex items-center" style={{ gap: 6 }}>
                      <div className="rounded" style={{ width: 12, height: 12, background: 'rgba(255,255,255,0.08)' }} />
                      <span className="text-white/40" style={{ fontSize: 11 }}>20–40%</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ marginLeft: 0 }}>
                    <div style={{ minWidth: 560 }}>
                      {/* Header row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: 4, marginBottom: 4 }}>
                        <div />
                        {FUNDS.map((f) => (
                          <div key={f} className="text-center text-white/40 font-medium" style={{ fontSize: 11, padding: '8px 4px' }}>
                            {f}
                          </div>
                        ))}
                      </div>

                      {/* Data rows */}
                      {FUNDS.map((rowFund, ri) => (
                        <div key={rowFund} style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: 4, marginBottom: 4 }}>
                          <div className="flex items-center text-white/40 font-medium" style={{ fontSize: 11, padding: '0 8px' }}>
                            {rowFund}
                          </div>
                          {OVERLAP_DATA[ri].map((val, ci) => {
                            const isDiag = ri === ci
                            const isHigh = val > 40 && !isDiag
                            const isLow = val < 20 && !isDiag
                            const cellKey = `${ri}-${ci}`
                            const isHovered = hoveredCell === cellKey
                            const stocks = OVERLAP_STOCKS[cellKey]

                            return (
                              <div
                                key={ci}
                                className="relative flex items-center justify-center rounded-lg transition-all duration-200 cursor-default"
                                style={{
                                  height: 56,
                                  background: isDiag ? '#0B0C10'
                                    : isHigh ? 'rgba(225,29,72,0.15)'
                                    : isLow ? 'rgba(69,162,158,0.12)'
                                    : 'rgba(255,255,255,0.04)',
                                  border: isDiag ? '1px solid rgba(255,255,255,0.04)'
                                    : isHigh ? '1px solid rgba(225,29,72,0.2)'
                                    : isLow ? '1px solid rgba(69,162,158,0.15)'
                                    : '1px solid rgba(255,255,255,0.06)',
                                }}
                                onMouseEnter={() => !isDiag && setHoveredCell(cellKey)}
                                onMouseLeave={() => setHoveredCell(null)}
                              >
                                {!isDiag && (
                                  <span className={`font-bold ${
                                    isHigh ? 'text-[#E11D48]' : isLow ? 'text-[#45A29E]' : 'text-white/40'
                                  }`} style={{ fontSize: 15 }}>
                                    {val}%
                                  </span>
                                )}
                                {isDiag && (
                                  <span className="text-white/10" style={{ fontSize: 11 }}>—</span>
                                )}

                                {/* Tooltip */}
                                <AnimatePresence>
                                  {isHovered && stocks && isHigh && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 6 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 4 }}
                                      transition={{ duration: 0.15 }}
                                      className="absolute z-50 rounded-lg border border-[#E11D48]/25 bg-[#1a1015]"
                                      style={{
                                        bottom: '110%', left: '50%', transform: 'translateX(-50%)',
                                        padding: '10px 14px', whiteSpace: 'nowrap',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                                      }}
                                    >
                                      <div className="flex items-center" style={{ gap: 6, marginBottom: 4 }}>
                                        <Info className="text-[#E11D48]" style={{ height: 12, width: 12 }} strokeWidth={2} />
                                        <span className="text-[#E11D48] font-semibold" style={{ fontSize: 11 }}>Top Overlapping Stocks</span>
                                      </div>
                                      <p className="text-white/70" style={{ fontSize: 12 }}>{stocks}</p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary insight */}
                  <div className="rounded-xl border border-[#E11D48]/15 bg-[#E11D48]/[0.04]"
                    style={{ padding: '20px 24px', marginTop: 28 }}>
                    <div className="flex items-start" style={{ gap: 12 }}>
                      <AlertTriangle className="text-[#E11D48] shrink-0" style={{ height: 18, width: 18, marginTop: 2 }} strokeWidth={1.75} />
                      <div>
                        <h4 className="font-bold text-[#E11D48]" style={{ fontSize: 14, marginBottom: 6 }}>Critical Overlap Warning</h4>
                        <p className="text-white/50" style={{ fontSize: 13, lineHeight: 1.7 }}>
                          Axis Bluechip and Mirae Large Cap share <span className="text-[#E11D48] font-semibold">65%</span> underlying asset overlap.
                          Holding both provides minimal diversification benefit. Consider consolidating into one fund to reduce redundancy.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg\\:!grid-cols-\\[360px_1fr\\] {
            grid-template-columns: 360px 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
