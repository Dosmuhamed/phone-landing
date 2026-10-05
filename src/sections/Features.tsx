import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { Counter, Reveal, SectionHead } from '../components/ui'
import './Features.css'

/** Карточка с «прожектором», который следует за курсором */
function Card({ className = '', delay = 0, children }: { className?: string; delay?: number; children: ReactNode }) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <Reveal className={`bento__card ${className}`} delay={delay} onPointerMove={onMove}>
      {children}
    </Reveal>
  )
}

export function Features() {
  return (
    <section className="features section" id="features">
      <div className="container">
        <SectionHead
          eyebrow="Возможности"
          title="Мелочей не бывает."
          text="Каждая деталь AURA X спроектирована так, чтобы ты о ней не думал. Она просто работает — быстрее, дольше и надёжнее."
        />

        <div className="bento">
          <Card className="bento__display">
            <DisplayDemo />
          </Card>

          <Card className="bento__battery" delay={0.1}>
            <BatteryDemo />
          </Card>

          <Card className="bento__charge" delay={0.15}>
            <div className="bento__bolt" aria-hidden>
              <svg viewBox="0 0 24 24">
                <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
              </svg>
            </div>
            <h3>
              <Counter to={120} /> Вт
            </h3>
            <p>0 → 100% за 19 минут. Пока ты пьёшь кофе.</p>
          </Card>

          <Card className="bento__water" delay={0.2}>
            <div className="bento__ripples" aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <h3>IP69</h3>
            <p>Пыль, дождь, горячая вода под давлением — без проблем.</p>
          </Card>

          <Card className="bento__ai" delay={0.1}>
            <AiDemo />
          </Card>

          <Card className="bento__finger" delay={0.15}>
            <div className="bento__fp" aria-hidden>
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M20 54c-3-6-4-12-4-20a16 16 0 0 1 32 0" />
                <path d="M26 58c-3-7-4-15-4-24a10 10 0 0 1 20 0c0 6 0 12-2 18" />
                <path d="M32 34c0 9-1 17-4 24" />
                <path d="M48 40c0 6-1 11-3 16" />
                <path d="M14 22a22 22 0 0 1 36 0" />
                <path d="M20 12a26 26 0 0 1 24 0" />
              </svg>
              <span className="bento__scan" />
            </div>
            <h3>Ультразвук</h3>
            <p>Сканер под экраном, который узнаёт тебя даже мокрым пальцем.</p>
          </Card>

          <Card className="bento__sat" delay={0.2}>
            <div className="bento__orbit" aria-hidden>
              <span className="bento__earth" />
              <span className="bento__sat-dot" />
            </div>
            <h3>SOS через спутник</h3>
            <p>Связь там, где нет ни одной вышки.</p>
          </Card>
        </div>
      </div>
    </section>
  )
}

/** Интерактивное сравнение 60 Гц и 144 Гц */
function DisplayDemo() {
  const [hz, setHz] = useState<60 | 144>(144)
  return (
    <>
      <div className="bento__head">
        <span className="eyebrow">Дисплей</span>
        <h3>
          6.7″ Super Aurora <span className="grad-text">144 Гц</span>
        </h3>
        <p>LTPO-матрица с яркостью до 3000 нит. Переключи частоту и почувствуй разницу.</p>
      </div>
      <div className={`hz hz--${hz}`}>
        <div className="hz__screen">
          <div className="hz__lines" />
          <span className="hz__ball" />
          <span className="hz__ball hz__ball--2" />
        </div>
        <div className="hz__toggle" role="tablist" aria-label="Частота обновления">
          {([60, 144] as const).map((v) => (
            <button key={v} role="tab" aria-selected={hz === v} onClick={() => setHz(v)} className={hz === v ? 'is-active' : ''}>
              {hz === v && <motion.span layoutId="hz-pill" className="hz__pill" />}
              <span>{v} Гц</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

function BatteryDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  return (
    <>
      <div ref={ref} className="battery" aria-hidden>
        <div className="battery__cap" />
        <div className="battery__body">
          <motion.div
            className="battery__fill"
            initial={{ height: '4%' }}
            animate={inView ? { height: '92%' } : undefined}
            transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="battery__wave" />
          </motion.div>
        </div>
      </div>
      <div className="bento__foot">
        <h3>
          <Counter to={6000} duration={2.4} />
          <small> мА·ч</small>
        </h3>
        <p>Кремний-углеродная батарея. До двух дней без зарядки.</p>
      </div>
    </>
  )
}

const prompts = [
  'Убери прохожих с фото',
  'Озвучь заметку моим голосом',
  'Сделай конспект встречи',
  'Найди фото с моря 2024',
]

/** Печатающийся текст — демонстрация AI-ассистента */
function AiDemo() {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')

  useEffect(() => {
    const full = prompts[index]
    let i = 0
    let timeout: number
    const type = () => {
      i++
      setText(full.slice(0, i))
      if (i < full.length) timeout = window.setTimeout(type, 45 + Math.random() * 40)
      else timeout = window.setTimeout(() => setIndex((n) => (n + 1) % prompts.length), 1800)
    }
    timeout = window.setTimeout(type, 300)
    return () => window.clearTimeout(timeout)
  }, [index])

  return (
    <>
      <div className="bento__head">
        <span className="eyebrow">Aura Intelligence</span>
        <h3>AI, который работает без интернета.</h3>
      </div>
      <div className="ai">
        <div className="ai__orb" aria-hidden />
        <div className="ai__input">
          <span>{text}</span>
          <i className="ai__caret" />
        </div>
        <div className="ai__chips">
          {['Фото', 'Голос', 'Текст', 'Поиск'].map((c, i) => (
            <span key={c} className={i === index ? 'is-active' : ''}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
