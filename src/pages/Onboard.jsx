import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Sparkles } from 'lucide-react'

const MOCK_BOT_LINES = [
  "Noted. On a scale of 1–10, how would you react if your portfolio dropped 15% in a month?",
  "Understood. What's your approximate monthly investable surplus after expenses?",
  "Thanks. Any existing high-interest debt we should prioritize before equity allocation?",
  "Extraction complete. Your Financial DNA profile is calibrated — opening your dashboard next.",
]

export default function Onboard() {
  const navigate = useNavigate()
  const terminalRef = useRef(null)
  const chatEndRef = useRef(null)
  const redirectRef = useRef(false)
  const idRef = useRef(1)
  const nextId = () => {
    const n = idRef.current
    idRef.current += 1
    return `m-${n}`
  }

  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [input, setInput] = useState('')
  const [progress, setProgress] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [mockIndex, setMockIndex] = useState(0)
  const [messages, setMessages] = useState(() => [
    {
      id: 'm-0',
      sender: 'bot',
      text: "Welcome — I'm AstraGuard. We'll extract your Financial DNA through a short conversation. What's your primary goal: equity growth, stability, or early retirement?",
    },
  ])

  const handleMouseMove = useCallback((e) => {
    const el = terminalRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setMouse({ x: e.clientX - r.left, y: e.clientY - r.top })
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (progress >= 100 && !redirectRef.current) {
      redirectRef.current = true
      const t = window.setTimeout(() => navigate('/dashboard'), 800)
      return () => window.clearTimeout(t)
    }
  }, [progress, navigate])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || isTyping) return

    setMessages((prev) => [...prev, { id: nextId(), sender: 'user', text: trimmed }])
    setInput('')
    setIsTyping(true)

    window.setTimeout(() => {
      const line = MOCK_BOT_LINES[Math.min(mockIndex, MOCK_BOT_LINES.length - 1)]
      setMockIndex((i) => Math.min(i + 1, MOCK_BOT_LINES.length - 1))
      setMessages((prev) => [...prev, { id: nextId(), sender: 'bot', text: line }])
      setIsTyping(false)
      setProgress((p) => Math.min(100, p + 25))
    }, 1500)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#0B0C10] flex items-center justify-center p-4 lg:p-8 font-sans">
      <div
        ref={terminalRef}
        onMouseMove={handleMouseMove}
        className="w-full max-w-3xl h-[80vh] min-h-[520px] flex flex-col relative overflow-hidden rounded-[2rem] bg-[#1F2833]/30 backdrop-blur-2xl border border-white/10 shadow-2xl"
      >
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, rgba(69, 162, 158, 0.08), transparent 40%)`,
          }}
        />

        {/* Zone 1: Header */}
        <header className="relative shrink-0 p-6 border-b border-white/10 bg-[#0B0C10]/40 backdrop-blur-md z-20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#45A29E] animate-pulse shrink-0" aria-hidden />
            <p className="text-sm text-[#94A3B8] tracking-widest uppercase font-medium">
              DNA Extraction Active
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-[#45A29E]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 22 }}
            />
          </div>
        </header>

        {/* Zone 2: Chat */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 z-10 min-h-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`flex w-full ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
              >
                {msg.sender === 'bot' ? (
                  <div className="flex gap-3 max-w-[80%] items-end">
                    <div className="w-8 h-8 rounded-full bg-[#1F2833]/80 border border-white/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-[#45A29E]" strokeWidth={1.5} />
                    </div>
                    <div className="bg-[#1F2833]/60 border border-white/5 rounded-2xl rounded-tl-sm p-4 text-white leading-relaxed text-[15px]">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/10 border border-white/20 rounded-2xl rounded-tr-sm p-4 max-w-[80%] text-white leading-relaxed text-[15px]">
                    {msg.text}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 max-w-[80%] items-end">
                <div className="w-8 h-8 rounded-full bg-[#1F2833]/80 border border-white/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-[#45A29E]" strokeWidth={1.5} />
                </div>
                <div className="bg-[#1F2833]/60 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 rounded-full bg-[#45A29E]"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Zone 3: Input */}
        <footer className="shrink-0 p-4 border-t border-white/10 bg-[#0B0C10]/40 backdrop-blur-md z-20">
          <div className="relative flex items-center w-full bg-black/50 border border-white/15 rounded-full px-2 py-2 transition-colors focus-within:border-[#45A29E]/50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your response..."
              disabled={isTyping || progress >= 100}
              className="flex-1 min-w-0 bg-transparent text-white px-4 py-2 outline-none placeholder:text-[#94A3B8] text-[15px] disabled:opacity-50"
              aria-label="Your message"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isTyping || progress >= 100}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                input.trim() && !isTyping && progress < 100
                  ? 'bg-[#45A29E] text-black'
                  : 'bg-transparent text-[#94A3B8]/50 cursor-not-allowed'
              }`}
              aria-label="Send message"
            >
              <ArrowUp className="w-5 h-5" strokeWidth={2.25} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
