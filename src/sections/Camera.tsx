import { AnimatePresence, motion, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { useLayoutEffect, useRef, useState } from 'react'
import { Counter, Reveal, SectionHead } from '../components/ui'
import { images, shots } from '../data'
import './Camera.css'

export function Camera() {
  return (
    <section className="camera" id="camera">
      <div className="section">
        <div className="container">
          <SectionHead
            eyebrow="Камера"
            title="200 мегапикселей."
            accent="Ночь как день."
            text="Сенсор размером 1 дюйм, оптика Aura Optics и нейросеть, которая собирает кадр из 12 снимков за долю секунды."
          />
          <div className="camera__grid">
            <Reveal className="camera__card camera__card--compare">
              <Compare />
            </Reveal>
            <Reveal className="camera__card camera__card--zoom" delay={0.1}>
              <Zoom />
            </Reveal>
          </div>
          <div className="camera__specs">
            {[
              { n: 200, s: ' МП', t: 'Основная, 1″ сенсор' },
              { n: 50, s: ' МП', t: 'Ультраширокая 120°' },
              { n: 10, s: '×', t: 'Перископ без потерь' },
              { n: 8, s: 'K', t: 'Видео 30 к/с · 4K 120' },
            ].map((s, i) => (
              <Reveal key={s.t} className="camera__spec" delay={i * 0.08}>
                <b>
                  <Counter to={s.n} suffix={s.s} duration={1.8} />
                </b>
                <span>{s.t}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <Rail />
    </section>
  )
}

/** Слайдер «до / после» для ночного режима */
function Compare() {
  const [pos, setPos] = useState(50)
  return (
    <div className="compare" data-cursor="drag" data-cursor-label="Тяни">
      <img src={images.shotNight} alt="Ночной пейзаж, снятый в режиме AURA Night" className="compare__img" draggable={false} />
      <div className="compare__before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={images.shotNight} alt="" className="compare__img" draggable={false} />
      </div>
      <span className="compare__tag compare__tag--l">Обычная камера</span>
      <span className="compare__tag compare__tag--r">AURA Night</span>
      <div className="compare__handle" style={{ left: `${pos}%` }}>
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Сравнение: обычная камера и AURA Night"
        className="compare__range"
      />
    </div>
  )
}

const zoomLevels = [
  { label: '0.6', scale: 1 },
  { label: '1', scale: 1.6 },
  { label: '3', scale: 3.4 },
  { label: '10', scale: 7 },
  { label: '100', scale: 15 },
]

/** Видоискатель с переключением зума */
function Zoom() {
  const [level, setLevel] = useState(1)
  const z = zoomLevels[level]
  return (
    <div className="zoom">
      <div className="zoom__view">
        <motion.img
          src={images.shotCity}
          alt="Панорама города с зумом"
          className="zoom__img"
          draggable={false}
          animate={{ scale: z.scale, filter: level === 4 ? 'blur(1.2px) contrast(1.15)' : 'blur(0px) contrast(1)' }}
          transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
        />
        <div className="zoom__hud" aria-hidden>
          <span className="zoom__corner zoom__corner--tl" />
          <span className="zoom__corner zoom__corner--tr" />
          <span className="zoom__corner zoom__corner--bl" />
          <span className="zoom__corner zoom__corner--br" />
          <span className="zoom__focus" key={level} />
          <div className="zoom__top">
            <span>
              <i className="zoom__rec" /> REC
            </span>
            <span>ISO 64 · 1/1000 · f/1.6</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={z.label}
              className="zoom__value"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.4 }}
              transition={{ duration: 0.35 }}
            >
              {z.label}×{level === 4 && <small>AI Super Res</small>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="zoom__controls" role="tablist" aria-label="Уровень зума">
        {zoomLevels.map((l, i) => (
          <button key={l.label} role="tab" aria-selected={i === level} className={i === level ? 'is-active' : ''} onClick={() => setLevel(i)}>
            {i === level && <motion.span layoutId="zoom-pill" className="zoom__pill" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
            <span>{l.label}×</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/** Горизонтальная галерея, которая едет по мере вертикального скролла */
function Rail() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const distanceMv = useMotionValue(0)

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    const measure = () => {
      const d = Math.max(0, track.scrollWidth - window.innerWidth)
      setDistance(d)
      distanceMv.set(d)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [distanceMv])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useTransform(() => -scrollYProgress.get() * distanceMv.get())

  return (
    <div ref={sectionRef} className="rail" style={{ height: `calc(100svh + ${distance}px)` }}>
      <div className="rail__sticky">
        <div className="rail__head container">
          <h3>
            Снято на <span className="grad-text">AURA X</span>
          </h3>
          <p>Без обработки. Без фильтров. Просто наведи и нажми.</p>
        </div>
        <motion.div ref={trackRef} className="rail__track" style={{ x }}>
          {shots.map((s, i) => (
            <figure key={s.title} className={`rail__item ${i % 2 ? 'rail__item--low' : ''}`}>
              <div className="rail__img">
                <img src={s.src} alt={s.title} loading="lazy" draggable={false} />
              </div>
              <figcaption>
                <b>{s.title}</b>
                <span>{s.meta}</span>
              </figcaption>
            </figure>
          ))}
        </motion.div>
        <div className="rail__bar container">
          <div>
            <motion.span style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </div>
  )
}
