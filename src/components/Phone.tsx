import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import type { PhoneColor } from '../data'
import './Phone.css'

type PhoneProps = {
  color: PhoneColor
  rotateX?: MotionValue<number>
  rotateY?: MotionValue<number>
  screen?: ReactNode
  cameras?: 2 | 3
  className?: string
  style?: CSSProperties
}

/**
 * Телефон, собранный из CSS-граней в 3D-пространстве:
 * передняя панель с экраном, задняя крышка с камерами и четыре торца.
 */
export function Phone({ color, rotateX, rotateY, screen, cameras = 3, className = '', style }: PhoneProps) {
  const fallbackX = useMotionValue(0)
  const fallbackY = useMotionValue(0)
  const rx = rotateX ?? fallbackX
  const ry = rotateY ?? fallbackY

  // Блик на стекле смещается вместе с поворотом
  const glare = useTransform(ry, (v) => {
    const a = ((((v % 360) + 540) % 360) - 180) / 180
    return `${50 - a * 120}% 0%`
  })

  const vars = {
    '--body': color.body,
    '--frame': color.frame,
    '--glow': color.glow,
    ...style,
  } as CSSProperties

  return (
    <div className={`phone-stage ${className}`} style={vars}>
      <motion.div className="phone" style={{ rotateX: rx, rotateY: ry }}>
        <div className="phone__face phone__front">
          <div className="phone__screen">
            {screen ?? <LockScreen />}
            <motion.div className="phone__glare" style={{ backgroundPosition: glare }} />
          </div>
          <div className="phone__island" />
        </div>

        <div className="phone__face phone__back">
          <div className={`phone__cam phone__cam--${cameras}`}>
            {Array.from({ length: cameras }).map((_, i) => (
              <span key={i} className="phone__lens" />
            ))}
            <span className="phone__flash" />
            <span className="phone__mic" />
          </div>
          <span className="phone__logo">AURA</span>
          <span className="phone__fine">Designed for the bold</span>
        </div>

        <div className="phone__side phone__side--l" />
        <div className="phone__side phone__side--r" />
        <div className="phone__side phone__side--t" />
        <div className="phone__side phone__side--b" />
      </motion.div>
    </div>
  )
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

/** Экран блокировки с живыми часами и анимированными обоями */
export function LockScreen() {
  const now = useClock()
  const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  const date = now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="lock">
      <div className="lock__wall">
        <span />
        <span />
        <span />
      </div>
      <div className="lock__status">
        <span>{time}</span>
        <span className="lock__icons">
          <i className="lock__signal" />
          <i className="lock__bat" />
        </span>
      </div>
      <div className="lock__date">{date}</div>
      <div className="lock__time">{time}</div>
      <div className="lock__widgets">
        <div className="lock__widget">
          <b>18°</b>
          <small>Алматы</small>
        </div>
        <div className="lock__widget lock__widget--ring">
          <svg viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" />
            <circle cx="18" cy="18" r="15" className="lock__ring" />
          </svg>
          <small>87%</small>
        </div>
        <div className="lock__widget">
          <b>8 412</b>
          <small>шагов</small>
        </div>
      </div>
      <div className="lock__bottom">
        <span className="lock__btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 2h6l-1 7h3l-6 13 1-9H8z" />
          </svg>
        </span>
        <span className="lock__btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="7" width="18" height="13" rx="3" />
            <circle cx="12" cy="13.5" r="3.5" />
            <path d="M8 7l2-3h4l2 3" />
          </svg>
        </span>
      </div>
      <div className="lock__home" />
    </div>
  )
}
