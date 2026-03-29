import { useEffect, useRef, useState } from 'react'

const VARIANTS = {
  fadeUp: { hidden: { opacity: 0, transform: 'translateY(60px)' }, visible: { opacity: 1, transform: 'translateY(0px)' } },
  fadeDown: { hidden: { opacity: 0, transform: 'translateY(-60px)' }, visible: { opacity: 1, transform: 'translateY(0px)' } },
  fadeLeft: { hidden: { opacity: 0, transform: 'translateX(-80px)' }, visible: { opacity: 1, transform: 'translateX(0px)' } },
  fadeRight: { hidden: { opacity: 0, transform: 'translateX(80px)' }, visible: { opacity: 1, transform: 'translateX(0px)' } },
  fadeScale: { hidden: { opacity: 0, transform: 'scale(0.85)' }, visible: { opacity: 1, transform: 'scale(1)' } },
  fadeRotate: { hidden: { opacity: 0, transform: 'translateY(40px) rotate(-3deg)' }, visible: { opacity: 1, transform: 'translateY(0px) rotate(0deg)' } },
  blurIn: { hidden: { opacity: 0, filter: 'blur(16px)', transform: 'translateY(30px)' }, visible: { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' } },
  slideReveal: { hidden: { opacity: 0, transform: 'translateY(100px) scale(0.92)', filter: 'blur(8px)' }, visible: { opacity: 1, transform: 'translateY(0px) scale(1)', filter: 'blur(0px)' } },
}

export default function ScrollReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.8,
  threshold = 0.15,
  once = true,
  style = {},
  className = '',
  staggerIndex = 0,
  staggerDelay = 0.12,
}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const hasTriggered = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const check = () => {
      const rect = el.getBoundingClientRect()
      const windowH = window.innerHeight
      const visiblePortion = Math.min(rect.bottom, windowH) - Math.max(rect.top, 0)
      const elementH = rect.height || 1
      const ratio = visiblePortion / elementH

      if (ratio >= threshold) {
        if (!hasTriggered.current || !once) {
          setIsVisible(true)
          hasTriggered.current = true
        }
      } else if (!once && hasTriggered.current) {
        setIsVisible(false)
        hasTriggered.current = false
      }
    }

    check()

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          check()
          ticking = false
        })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [threshold, once])

  const v = VARIANTS[variant] || VARIANTS.fadeUp
  const totalDelay = delay + staggerIndex * staggerDelay
  const currentState = isVisible ? v.visible : v.hidden

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        ...currentState,
        transition: `opacity ${duration}s cubic-bezier(0.22,1,0.36,1) ${totalDelay}s, transform ${duration}s cubic-bezier(0.22,1,0.36,1) ${totalDelay}s, filter ${duration}s cubic-bezier(0.22,1,0.36,1) ${totalDelay}s`,
        willChange: 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  )
}
