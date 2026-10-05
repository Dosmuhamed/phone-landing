import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from 'framer-motion'
import { useEffect, useRef, type ReactNode, type PointerEvent } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

type RevealProps = HTMLMotionProps<'div'> & { delay?: number; y?: number }

/** Плавное появление блока при попадании во вьюпорт */
export function Reveal({ delay = 0, y = 40, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, delay, ease }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

type SplitTextProps = {
  text: string
  className?: string
  delay?: number
  /** Если передан — анимация запускается по флагу, а не по скроллу */
  play?: boolean
}

/** Заголовок, слова которого «выезжают» снизу из-под маски */
export function SplitText({ text, className = '', delay = 0, play }: SplitTextProps) {
  // Наблюдаем за внешним элементом: сами слова спрятаны под маской и для IntersectionObserver невидимы
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const show = play ?? inView
  const words = text.split(' ')
  return (
    <span ref={ref} className={`split ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <span className="split__word" key={i} aria-hidden>
          <motion.span
            className="split__inner"
            initial={{ y: '130%', rotate: 6 }}
            animate={show ? { y: '0%', rotate: 0 } : undefined}
            transition={{ duration: 1, delay: delay + i * 0.06, ease }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  )
}

type SectionHeadProps = {
  eyebrow: string
  title: string
  text?: string
  center?: boolean
  accent?: string
}

export function SectionHead({ eyebrow, title, text, center, accent }: SectionHeadProps) {
  return (
    <div className={`section-head ${center ? 'section-head--center' : ''}`}>
      <Reveal>
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>
      <h2>
        <SplitText text={title} />
        {accent && (
          <>
            {' '}
            <SplitText text={accent} className="grad-text" delay={0.15} />
          </>
        )}
      </h2>
      {text && (
        <Reveal delay={0.2}>
          <p>{text}</p>
        </Reveal>
      )}
    </div>
  )
}

type CounterProps = {
  to: number
  from?: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

/** Число, которое «досчитывает» до значения при появлении */
export function Counter({ to, from = 0, duration = 2, decimals = 0, prefix = '', suffix = '', className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const format = (v: number) =>
    prefix + v.toLocaleString('ru-RU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix

  useEffect(() => {
    if (!inView || !ref.current) return
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v)
      },
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return (
    <span ref={ref} className={className}>
      {format(from)}
    </span>
  )
}

type MagneticProps = {
  children: ReactNode
  className?: string
  href?: string
  onClick?: () => void
  strength?: number
}

/** Кнопка, которая «притягивается» к курсору */
export function Magnetic({ children, className = '', href, onClick, strength = 0.35 }: MagneticProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 })

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * strength)
    y.set((e.clientY - r.top - r.height / 2) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const props = {
    className,
    style: { x: sx, y: sy },
    onPointerMove: onMove,
    onPointerLeave: reset,
    'data-cursor': 'hover',
  }

  if (href) {
    return (
      <motion.a
        {...props}
        href={href}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault()
            onClick()
          }
        }}
      >
        {children}
      </motion.a>
    )
  }
  return (
    <motion.button type="button" {...props} onClick={onClick}>
      {children}
    </motion.button>
  )
}

export const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
