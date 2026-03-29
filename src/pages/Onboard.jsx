import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Sparkles, Shield, Check } from 'lucide-react'
import { api } from '../services/api'

export default function Onboard() {
  const navigate = useNavigate()
  const chatEndRef = useRef(null)
  const redirectRef = useRef(false)
  const inputRef = useRef(null)
  const idRef = useRef(1)
  const nextId = () => { const n = idRef.current; idRef.current += 1; return `m-${n}` }

  const [input, setInput] = useState('')
  const [step, setStep] = useState(0) // Now tracks API completions conceptually
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId] = useState(() => Math.random().toString(36).substring(7))
  const [messages, setMessages] = useState([
    {
      id: 'm-0', sender: 'bot',
      text: "Hi — I'm AstraGuard AI. I'll build your Financial DNA profile. Hit any key or send a message to start!",
    },
  ])
  const [completionPct, setCompletionPct] = useState(0)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  useEffect(() => {
    if (isDone && !redirectRef.current) {
      redirectRef.current = true
      const t = window.setTimeout(() => navigate('/dashboard'), 2000)
      return () => window.clearTimeout(t)
    }
  }, [isDone, navigate])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isTyping || isDone) return
    const newMsg = { id: nextId(), sender: 'user', text: trimmed }
    setMessages(prev => [...prev, newMsg])
    setInput('')
    setIsTyping(true)

    try {
      // Build conversation history format for API
      // Only include user roles as history technically, or both if needed, but API usually expects just user responses or full history
      // We will send the whole history
      const history = [...messages, newMsg]
        .filter(m => m.id !== 'm-0') // skip generic greeting from client side
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }))

      const res = await api.onboard('user_123', sessionId, history)
      const data = res.data

      setStep(prev => prev + 1)
      setCompletionPct(data.completion_percentage || 0)

      if (data.status === 'complete' || data.completion_percentage >= 100) {
        setIsDone(true)
        setMessages(prev => [...prev, { id: nextId(), sender: 'bot', text: data.next_question || "Perfect. Your Financial DNA profile has been calibrated. Redirecting you to your personalized dashboard now…" }])
      } else {
        setMessages(prev => [...prev, { id: nextId(), sender: 'bot', text: data.next_question }])
      }
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { id: nextId(), sender: 'bot', text: "Sorry, I had trouble connecting to the backend. Is it running?" }])
    } finally {
      setIsTyping(false)
    }
  }

  const onKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }

  return (
    <div className="min-h-screen w-full bg-[#0B0C10] flex flex-col items-center justify-center relative overflow-hidden">

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(69,162,158,0.12) 0%, transparent 65%)' }} />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center" style={{ maxWidth: 760, padding: '0 24px' }}>

        {/* Brand header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
          style={{ gap: 16, marginBottom: 32 }}
        >
          <div className="flex items-center justify-center rounded-2xl bg-[#45A29E]/15 border border-[#45A29E]/25"
            style={{ height: 56, width: 56 }}>
            <Shield className="text-[#45A29E]" style={{ height: 28, width: 28 }} strokeWidth={1.75} />
          </div>
          <div className="text-center">
            <h1 className="font-bold text-white tracking-tight" style={{ fontSize: 24 }}>Financial DNA Extraction</h1>
            <p className="text-[#94A3B8]" style={{ fontSize: 14, marginTop: 8 }}>Answer 4 questions · Takes under 2 minutes</p>
          </div>
        </motion.div>

        {/* Step tracker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="flex items-center w-full"
          style={{ marginBottom: 36 }}
        >
          {/* Note: In API mode, STEPS length is dynamic. We show a generic progress bar now. */}
          <div className="flex-1 rounded-full bg-white/[0.04] overflow-hidden border border-white/10" style={{ height: 8 }}>
            <div className="h-full bg-[#45A29E] transition-all duration-700 ease-out" style={{ width: `${Math.max(5, completionPct)}%` }} />
          </div>
        </motion.div>

        {/* Chat window */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-2xl border border-white/[0.08] bg-[#0f1014] overflow-hidden shadow-2xl flex flex-col"
          style={{ height: 'clamp(440px, 58vh, 560px)' }}
        >
          {/* Progress header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] shrink-0"
            style={{ padding: '20px 32px' }}>
            <div className="flex items-center" style={{ gap: 12 }}>
              <span className="relative flex" style={{ height: 8, width: 8 }}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${isDone ? 'bg-emerald-400' : 'bg-[#45A29E]'}`} />
                <span className={`relative inline-flex rounded-full ${isDone ? 'bg-emerald-400' : 'bg-[#45A29E]'}`} style={{ height: 8, width: 8 }} />
              </span>
              <span className="font-semibold uppercase text-[#94A3B8]" style={{ fontSize: 11, letterSpacing: '0.14em' }}>
                {isDone ? 'Profile complete' : `Gathering DNA`}
              </span>
            </div>
            <div className="flex items-center" style={{ gap: 14 }}>
              <div className="rounded-full bg-white/[0.06] overflow-hidden" style={{ width: 120, height: 6 }}>
                <div className="h-full rounded-full bg-[#45A29E] transition-all duration-700 ease-out" style={{ width: `${completionPct}%` }} />
              </div>
              <span className="font-semibold text-[#45A29E] tabular-nums text-right" style={{ fontSize: 13, width: 36 }}>{Math.round(completionPct)}%</span>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto flex flex-col [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ padding: '28px 32px', gap: 24 }}>
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
                    <div className="flex items-start" style={{ gap: 16, maxWidth: '88%' }}>
                      <div className="shrink-0 rounded-full bg-[#45A29E]/12 border border-[#45A29E]/25 flex items-center justify-center"
                        style={{ height: 40, width: 40, marginTop: 2 }}>
                        <Sparkles className="text-[#45A29E]" style={{ height: 20, width: 20 }} strokeWidth={1.75} />
                      </div>
                      <div className="rounded-2xl rounded-tl-sm bg-[#1a1d24] border border-white/[0.07] text-white whitespace-pre-line"
                        style={{ padding: '20px 24px', fontSize: 15, lineHeight: 1.75 }}>
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl rounded-tr-sm bg-[#45A29E]/12 border border-[#45A29E]/20 text-white"
                      style={{ padding: '20px 24px', fontSize: 15, lineHeight: 1.75, maxWidth: '80%' }}>
                      {msg.text}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start" style={{ gap: 16 }}>
                <div className="shrink-0 rounded-full bg-[#45A29E]/12 border border-[#45A29E]/25 flex items-center justify-center"
                  style={{ height: 40, width: 40, marginTop: 2 }}>
                  <Sparkles className="text-[#45A29E]" style={{ height: 20, width: 20 }} strokeWidth={1.75} />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-[#1a1d24] border border-white/[0.07] flex items-center"
                  style={{ padding: '20px 24px', gap: 8 }}>
                  {[0, 1, 2].map(i => (
                    <motion.span key={i} className="rounded-full bg-[#45A29E]/60"
                      style={{ height: 8, width: 8 }}
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-white/[0.06] bg-[#0b0d10] shrink-0" style={{ padding: '20px 32px' }}>
            <div className={`flex items-center rounded-xl border transition-all duration-200 ${
              isDone ? 'border-white/[0.05] opacity-40 pointer-events-none'
              : 'border-white/[0.1] bg-[#141720] focus-within:border-[#45A29E]/45'
            }`} style={{ padding: '14px 20px', gap: 14 }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={isDone ? 'Redirecting to your dashboard…' : 'Type your answer…'}
                disabled={isTyping || isDone}
                autoFocus
                className="flex-1 min-w-0 bg-transparent text-white placeholder:text-[#94A3B8]/45 outline-none"
                style={{ fontSize: 15 }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping || isDone}
                className={`flex shrink-0 items-center justify-center rounded-lg transition-all duration-150 ${
                  input.trim() && !isTyping && !isDone
                    ? 'bg-[#45A29E] text-black hover:bg-[#3d9490] cursor-pointer'
                    : 'bg-white/[0.05] text-white/20 cursor-not-allowed'
                }`}
                style={{ height: 36, width: 36 }}
              >
                <ArrowUp style={{ height: 18, width: 18 }} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[#94A3B8]/40 text-center"
          style={{ fontSize: 12, marginTop: 28 }}
        >
          Your data is encrypted and never shared with third parties.
        </motion.p>

      </div>
    </div>
  )
}
