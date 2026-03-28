import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Sparkles, Shield } from 'lucide-react'

const STEPS = [
  "What's your primary goal: equity growth, stability, or early retirement?",
  "On a scale of 1–10, how would you react if your portfolio dropped 15% in a month?",
  "What's your approximate monthly investable surplus after expenses?",
  "Any existing high-interest debt we should prioritize before equity allocation?",
]

const STEP_LABELS = [
  'Goal setting',
  'Risk tolerance',
  'Surplus mapping',
  'Debt analysis',
]

export default function Onboard() {
  const navigate = useNavigate()
  const chatEndRef = useRef(null)
  const redirectRef = useRef(false)
  const idRef = useRef(1)
  const inputRef = useRef(null)
  const nextId = () => { const n = idRef.current; idRef.current += 1; return `m-${n}` }

  const [input, setInput] = useState('')
  const [step, setStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    { id: 'm-0', sender: 'bot', text: "Welcome — I'm AstraGuard. I'll extract your Financial DNA through a short 4-step conversation. " + STEPS[0] },
  ])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (step >= STEPS.length && !redirectRef.current) {
      redirectRef.current = true
      const t = window.setTimeout(() => navigate('/dashboard'), 1200)
      return () => window.clearTimeout(t)
    }
  }, [step, navigate])

  useEffect(() => {
    inputRef.current?.focus()
  }, [isTyping])

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
        setMessages(prev => [...prev, { id: nextId(), sender: 'bot', text: STEPS[nextStep] }])
      } else {
        setMessages(prev => [...prev, {
          id: nextId(),
          sender: 'bot',
          text: 'Extraction complete. Your Financial DNA profile is calibrated — opening your dashboard now.',
        }])
      }
      setIsTyping(false)
    }, 1400)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const progressPct = Math.min(100, (step / STEPS.length) * 100)
  const isDone = step >= STEPS.length

  return (
    <div className="min-h-screen w-full bg-[#0B0C10] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#45A29E]/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-[#45A29E]/4 blur-3xl" />
      </div>

      {/* Branding mark */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center gap-2.5 mb-6"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#45A29E]/15 border border-[#45A29E]/30">
          <Shield className="h-4 w-4 text-[#45A29E]" strokeWidth={1.75} />
        </div>
        <span className="text-white/80 text-sm font-semibold tracking-wide">AstraGuard</span>
        <span className="text-white/20 text-sm">·</span>
        <span className="text-[#94A3B8] text-sm">Financial DNA Extraction</span>
      </motion.div>

      {/* Step indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="relative z-10 flex items-center gap-3 mb-5"
      >
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors duration-300 ${
                i < step
                  ? 'bg-[#45A29E] border-[#45A29E] text-black'
                  : i === step && !isDone
                  ? 'bg-transparent border-[#45A29E] text-[#45A29E]'
                  : 'bg-transparent border-white/15 text-white/30'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block transition-colors duration-300 ${
                i < step ? 'text-[#45A29E]' : i === step && !isDone ? 'text-white/90' : 'text-white/25'
              }`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className="w-8 h-px bg-white/10 hidden sm:block" />
            )}
          </div>
        ))}
      </motion.div>

      {/* Chat window */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl mx-4 flex flex-col rounded-2xl border border-white/[0.08] bg-[#111318] shadow-2xl overflow-hidden"
        style={{ height: 'clamp(460px, 65vh, 640px)' }}
      >
        {/* Header bar */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/[0.07] bg-[#0d0e12]">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${isDone ? 'bg-[#45A29E]' : 'bg-[#45A29E]'}`} />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#45A29E]" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
              {isDone ? 'Extraction complete' : 'DNA Extraction Active'}
            </span>
          </div>
          <span className="text-[11px] font-semibold tabular-nums text-[#45A29E]">
            {Math.round(progressPct)}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="shrink-0 h-0.5 bg-white/[0.04]">
          <motion.div
            className="h-full bg-[#45A29E]"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className={`flex w-full ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
              >
                {msg.sender === 'bot' ? (
                  <div className="flex gap-3 max-w-[85%] items-start">
                    <div className="mt-0.5 w-7 h-7 rounded-full bg-[#45A29E]/15 border border-[#45A29E]/30 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-[#45A29E]" strokeWidth={1.75} />
                    </div>
                    <div className="bg-[#1a1d24] border border-white/[0.07] rounded-2xl rounded-tl-md px-4 py-3 text-white text-[14px] leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#45A29E]/15 border border-[#45A29E]/20 rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%] text-white text-[14px] leading-relaxed">
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
              className="flex justify-start"
            >
              <div className="flex gap-3 items-start">
                <div className="mt-0.5 w-7 h-7 rounded-full bg-[#45A29E]/15 border border-[#45A29E]/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#45A29E]" strokeWidth={1.75} />
                </div>
                <div className="bg-[#1a1d24] border border-white/[0.07] rounded-2xl rounded-tl-md px-4 py-3.5 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#45A29E]"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="shrink-0 px-4 py-4 border-t border-white/[0.07] bg-[#0d0e12]">
          <div className={`flex items-center gap-2 bg-[#1a1d24] border rounded-xl px-4 py-2.5 transition-colors ${
            isDone ? 'border-white/[0.06] opacity-50' : 'border-white/[0.1] focus-within:border-[#45A29E]/40'
          }`}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={isDone ? 'Redirecting to dashboard…' : 'Type your response…'}
              disabled={isTyping || isDone}
              className="flex-1 min-w-0 bg-transparent text-white text-[14px] outline-none placeholder:text-[#94A3B8]/60 disabled:cursor-not-allowed"
              aria-label="Your message"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isTyping || isDone}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
                input.trim() && !isTyping && !isDone
                  ? 'bg-[#45A29E] text-black hover:bg-[#3d918d] cursor-pointer'
                  : 'bg-white/[0.06] text-white/20 cursor-not-allowed'
              }`}
              aria-label="Send message"
            >
              <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
          <p className="text-center text-[11px] text-white/20 mt-2.5">
            {isDone ? 'Profile saved · Redirecting…' : `Step ${Math.min(step + 1, STEPS.length)} of ${STEPS.length} · Press Enter to send`}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
