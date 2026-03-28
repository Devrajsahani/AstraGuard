import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Sparkles, Shield, Check } from 'lucide-react'

const STEPS = [
  {
    question: "What's your primary financial goal — equity growth, capital stability, or early retirement?",
    label: 'Goal setting',
  },
  {
    question: "On a scale of 1–10, how would you react if your portfolio dropped 15% in a single month?",
    label: 'Risk profile',
  },
  {
    question: "What's your approximate monthly investable surplus after all living expenses?",
    label: 'Surplus mapping',
  },
  {
    question: "Do you have any high-interest debt (credit cards, personal loans) we should factor in?",
    label: 'Debt analysis',
  },
]

export default function Onboard() {
  const navigate = useNavigate()
  const chatEndRef = useRef(null)
  const redirectRef = useRef(false)
  const inputRef = useRef(null)
  const idRef = useRef(1)
  const nextId = () => { const n = idRef.current; idRef.current += 1; return `m-${n}` }

  const [input, setInput] = useState('')
  const [step, setStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'm-0',
      sender: 'bot',
      text: "Hi — I'm AstraGuard AI. I'll build your Financial DNA profile in 4 short questions so I can protect your investments intelligently.\n\n" + STEPS[0].question,
    },
  ])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (step >= STEPS.length && !redirectRef.current) {
      redirectRef.current = true
      const t = window.setTimeout(() => navigate('/dashboard'), 1400)
      return () => window.clearTimeout(t)
    }
  }, [step, navigate])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || isTyping || step >= STEPS.length) return

    setMessages(prev => [...prev, { id: nextId(), sender: 'user', text: trimmed }])
    setInput('')
    setIsTyping(true)

    window.setTimeout(() => {
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep < STEPS.length) {
        setMessages(prev => [...prev, { id: nextId(), sender: 'bot', text: STEPS[nextStep].question }])
      } else {
        setMessages(prev => [...prev, {
          id: nextId(),
          sender: 'bot',
          text: "Perfect. Your Financial DNA profile has been calibrated. Redirecting you to your personalized dashboard now…",
        }])
      }
      setIsTyping(false)
    }, 1500)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const pct = Math.min(100, (step / STEPS.length) * 100)
  const isDone = step >= STEPS.length

  return (
    <div className="min-h-screen w-full bg-[#0B0C10] flex flex-col items-center justify-center relative overflow-hidden">

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(69,162,158,0.15) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-[680px] px-4 flex flex-col items-center gap-8">

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#45A29E]/15 border border-[#45A29E]/25">
            <Shield className="h-6 w-6 text-[#45A29E]" strokeWidth={1.75} />
          </div>
          <div className="text-center">
            <h1 className="text-[20px] font-bold text-white tracking-tight">Financial DNA Extraction</h1>
            <p className="text-[13px] text-[#94A3B8] mt-1">Answer 4 questions · Takes under 2 minutes</p>
          </div>
        </motion.div>

        {/* Step tracker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="flex items-center gap-0 w-full"
        >
          {STEPS.map((s, i) => {
            const done = i < step
            const active = i === step && !isDone
            return (
              <div key={s.label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300 ${
                    done ? 'bg-[#45A29E] border-[#45A29E]'
                    : active ? 'bg-[#45A29E]/10 border-[#45A29E]/60'
                    : 'bg-white/[0.04] border-white/10'
                  }`}>
                    {done
                      ? <Check className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
                      : <span className={`text-[11px] font-bold ${active ? 'text-[#45A29E]' : 'text-white/25'}`}>{i + 1}</span>
                    }
                  </div>
                  <span className={`text-[10px] font-semibold transition-colors hidden sm:block ${
                    done ? 'text-[#45A29E]' : active ? 'text-white/80' : 'text-white/20'
                  }`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px mx-2 mt-[-14px]" style={{
                    background: i < step ? '#45A29E' : 'rgba(255,255,255,0.08)',
                    transition: 'background 0.4s ease',
                  }} />
                )}
              </div>
            )
          })}
        </motion.div>

        {/* Chat window */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-2xl border border-white/[0.08] bg-[#0f1014] overflow-hidden shadow-2xl"
          style={{ height: 'clamp(420px, 60vh, 580px)' }}
        >
          {/* Progress header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${isDone ? 'bg-emerald-400' : 'bg-[#45A29E]'}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isDone ? 'bg-emerald-400' : 'bg-[#45A29E]'}`} />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
                {isDone ? 'Profile complete' : `Step ${Math.min(step + 1, STEPS.length)} of ${STEPS.length}`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-28 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#45A29E] transition-all duration-700 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[12px] font-semibold text-[#45A29E] tabular-nums w-8 text-right">{Math.round(pct)}%</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ height: 'calc(100% - 115px)' }}>
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  className={`flex w-full ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  {msg.sender === 'bot' ? (
                    <div className="flex gap-3 max-w-[88%] items-start">
                      <div className="mt-0.5 h-8 w-8 rounded-full bg-[#45A29E]/12 border border-[#45A29E]/25 flex items-center justify-center shrink-0">
                        <Sparkles className="h-4 w-4 text-[#45A29E]" strokeWidth={1.75} />
                      </div>
                      <div className="rounded-2xl rounded-tl-sm bg-[#1a1d24] border border-white/[0.06] px-5 py-4 text-[14px] text-white leading-[1.7] whitespace-pre-line">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl rounded-tr-sm bg-[#45A29E]/12 border border-[#45A29E]/20 px-5 py-4 max-w-[80%] text-[14px] text-white leading-[1.7]">
                      {msg.text}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 items-start"
              >
                <div className="mt-0.5 h-8 w-8 rounded-full bg-[#45A29E]/12 border border-[#45A29E]/25 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-[#45A29E]" strokeWidth={1.75} />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-[#1a1d24] border border-white/[0.06] px-5 py-4 flex items-center gap-1.5">
                  {[0, 1, 2].map(i => (
                    <motion.span key={i}
                      className="h-2 w-2 rounded-full bg-[#45A29E]/60"
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-white/[0.06] bg-[#0b0d10]">
            <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${
              isDone ? 'border-white/[0.05] opacity-40 pointer-events-none'
              : 'border-white/[0.09] bg-[#141720] focus-within:border-[#45A29E]/45 focus-within:bg-[#141720]'
            }`}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={isDone ? 'Redirecting to your dashboard…' : 'Type your answer…'}
                disabled={isTyping || isDone}
                autoFocus
                className="flex-1 min-w-0 bg-transparent text-[14px] text-white placeholder:text-[#94A3B8]/45 outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping || isDone}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150 ${
                  input.trim() && !isTyping && !isDone
                    ? 'bg-[#45A29E] text-black hover:bg-[#3d9490] cursor-pointer'
                    : 'bg-white/[0.05] text-white/20 cursor-not-allowed'
                }`}
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[12px] text-[#94A3B8]/40 text-center"
        >
          Your data is encrypted and never shared with third parties.
        </motion.p>
      </div>
    </div>
  )
}
