import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'
import { Phone } from '../components/Phone'
import { Arrow, Magnetic } from '../components/ui'
import { colors } from '../data'
import { scrollToId } from '../lib/smoothScroll'
import './Hero.css'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Нормализованная позиция курсора [-1; 1]
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 70, damping: 16 })
  const sy = useSpring(my, { stiffness: 70, damping: 16 })
  const hasMouse = useRef(false)

  useEffect(() => {
    hasMouse.current = window.matchMedia('(pointer: fine)').matches
    if (!hasMouse.current) return
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1)
      my.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my])

  // На тач-устройствах телефон мягко «плавает» сам
  useAnimationFrame((t) => {
    if (hasMouse.current) return
    mx.set(Math.sin(t / 1700) * 0.8)
    my.set(Math.cos(t / 2300) * 0.4)
  })

  const rotateY = useTransform(() => -14 + sx.get() * 24 + scrollYProgress.get() * 60)
  const rotateX = useTransform(() => 6 - sy.get() * 14 + scrollYProgress.get() * 20)
  const phoneY = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const phoneScale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-45%'])
  const titleX = useTransform(sx, (v) => v * -20)
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} className="hero" id="top">
      <div className="hero__bg" aria-hidden>
        <span className="hero__blob hero__blob--1" />
        <span className="hero__blob hero__blob--2" />
        <span className="hero__blob hero__blob--3" />
        <div className="hero__grid" />
      </div>

      <motion.h1 className="hero__title" style={{ y: titleY, x: titleX }} aria-label="AURA X">
        {'AURA X'.split('').map((l, i) => (
          <span key={i} className="hero__letter-mask" aria-hidden>
            <motion.span
              className="hero__letter"
              initial={{ y: '115%' }}
              animate={ready ? { y: '0%' } : undefined}
              transition={{ duration: 1.2, delay: 0.1 + i * 0.07, ease }}
            >
              {l === ' ' ? ' ' : l}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      <motion.div
        className="hero__phone"
        style={{ y: phoneY, scale: phoneScale }}
        initial={{ opacity: 0, y: 120 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.6, delay: 0.35, ease }}
      >
        <div className="hero__float">
          <div className="hero__halo" />
          <Phone color={colors[0]} rotateX={rotateX} rotateY={rotateY} className="hero__device" />
        </div>

        <Chip sx={sx} sy={sy} depth={1.4} className="hero__chip--1" ready={ready} delay={1.1}>
          <b>200 МП</b>
          <span>камера</span>
        </Chip>
        <Chip sx={sx} sy={sy} depth={-1} className="hero__chip--2" ready={ready} delay={1.2}>
          <b>N1 · 3 нм</b>
          <span>процессор</span>
        </Chip>
        <Chip sx={sx} sy={sy} depth={0.8} className="hero__chip--3" ready={ready} delay={1.3}>
          <b>6000 мА·ч</b>
          <span>2 дня работы</span>
        </Chip>
        <Chip sx={sx} sy={sy} depth={-1.6} className="hero__chip--4" ready={ready} delay={1.4}>
          <b>144 Гц</b>
          <span>дисплей</span>
        </Chip>
      </motion.div>

      <motion.div className="hero__bottom container" style={{ opacity: fade }}>
        <motion.p
          className="hero__lead"
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, delay: 0.9, ease }}
        >
          Смартфон, который <span className="grad-text">видит свет</span> там, где его нет. Камера 200 МП, чип N1 и
          титановый корпус толщиной 7.9 мм.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, delay: 1, ease }}
        >
          <Magnetic className="btn btn--primary" href="#preorder" onClick={() => scrollToId('preorder')}>
            <span>Предзаказ от $599</span>
            <Arrow />
          </Magnetic>
          <Magnetic className="btn" href="#design" onClick={() => scrollToId('design')}>
            <span>Смотреть</span>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.button
        className="hero__scroll"
        onClick={() => scrollToId('manifesto')}
        style={{ opacity: fade }}
        aria-label="Прокрутить вниз"
      >
        <span />
      </motion.button>
    </section>
  )
}

type ChipProps = {
  sx: MotionValue<number>
  sy: MotionValue<number>
  depth: number
  className: string
  ready: boolean
  delay: number
  children: ReactNode
}

function Chip({ sx, sy, depth, className, ready, delay, children }: ChipProps) {
  const x = useTransform(sx, (v) => v * depth * 26)
  const y = useTransform(sy, (v) => v * depth * 20)
  return (
    <motion.div className={`hero__chip ${className}`} style={{ x, y }}>
      <motion.div
        className="hero__chip-inner"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={ready ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.9, delay, ease }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
