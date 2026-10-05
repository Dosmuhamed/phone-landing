import { AnimatePresence, animate, motion, useAnimationFrame, useInView, useMotionValue } from 'framer-motion'
import { useRef, useState, type PointerEvent } from 'react'
import { Phone } from '../components/Phone'
import { Reveal, SectionHead } from '../components/ui'
import { colors, type PhoneColor } from '../data'
import './Design.css'

const facts = [
  { k: '7.9 мм', v: 'толщина корпуса' },
  { k: '198 г', v: 'вес с батареей 6000 мА·ч' },
  { k: 'Титан', v: 'рама класса 5' },
  { k: 'Ceramic 2', v: 'стекло, в 4 раза прочнее' },
]

export function Design() {
  const [active, setActive] = useState<PhoneColor>(colors[0])
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { amount: 0.2 })

  const rotY = useMotionValue(-30)
  const rotX = useMotionValue(-6)
  const dragging = useRef(false)
  const pausedUntil = useRef(0)
  const last = useRef({ x: 0, y: 0 })

  // Медленное автовращение, пока пользователь не трогает телефон
  useAnimationFrame((_, delta) => {
    if (!inView || dragging.current || performance.now() < pausedUntil.current) return
    rotY.set(rotY.get() + delta * 0.018)
  })

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    last.current = { x: e.clientX, y: e.clientY }
    rotY.stop()
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    last.current = { x: e.clientX, y: e.clientY }
    rotY.set(rotY.get() + dx * 0.55)
    rotX.set(Math.max(-35, Math.min(35, rotX.get() - dy * 0.3)))
  }

  const onUp = () => {
    if (!dragging.current) return
    dragging.current = false
    pausedUntil.current = performance.now() + 2500
    animate(rotX, -6, { type: 'spring', stiffness: 60, damping: 14 })
  }

  // При смене цвета — эффектный разворот к задней крышке
  const pick = (c: PhoneColor) => {
    if (c.id === active.id) return
    setActive(c)
    const base = rotY.get()
    const m = ((base % 360) + 360) % 360
    const target = base - m + 360 + 160
    pausedUntil.current = performance.now() + 4000
    animate(rotY, target, { duration: 1.6, ease: [0.65, 0, 0.35, 1] })
  }

  return (
    <section className="design section" id="design">
      <motion.div
        className="design__glow"
        animate={{ backgroundColor: active.glow }}
        transition={{ duration: 1 }}
        aria-hidden
      />

      <div className="container design__inner">
        <div className="design__copy">
          <SectionHead
            eyebrow="Дизайн"
            title="Покрути его."
            accent="Влюбись."
            text="Титановая рама, матовое стекло с мягким переливом и камера, которая выглядит как украшение. Тяни телефон пальцем или мышкой — он весь твой."
          />

          <Reveal delay={0.1}>
            <div className="design__colors" role="radiogroup" aria-label="Цвет корпуса">
              {colors.map((c) => (
                <button
                  key={c.id}
                  role="radio"
                  aria-checked={c.id === active.id}
                  aria-label={c.name}
                  className={`design__swatch ${c.id === active.id ? 'is-active' : ''}`}
                  style={{ background: c.swatch }}
                  onClick={() => pick(c)}
                >
                  {c.id === active.id && (
                    <motion.span layoutId="swatch-ring" className="design__swatch-ring" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
                </button>
              ))}
              <div className="design__color-name">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={active.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    {active.name}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          <div className="design__facts">
            {facts.map((f, i) => (
              <Reveal key={f.k} delay={0.1 + i * 0.08} className="design__fact">
                <b>{f.k}</b>
                <span>{f.v}</span>
              </Reveal>
            ))}
          </div>
        </div>

        <div
          ref={stageRef}
          className="design__stage"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          data-cursor="drag"
          data-cursor-label="Тяни"
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={active.id}
              className="design__bigname"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(12px)' }}
              transition={{ duration: 0.8 }}
              aria-hidden
            >
              {active.name.split(' ')[0]}
            </motion.span>
          </AnimatePresence>

          <div className="design__ring" aria-hidden>
            <span />
            <span />
          </div>

          <Phone color={active} rotateX={rotX} rotateY={rotY} className="design__phone" />

          <div className="design__hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" />
              <path d="M18 3v4h-4M6 21v-4h4" />
            </svg>
            360° — потяни
          </div>
        </div>
      </div>
    </section>
  )
}
