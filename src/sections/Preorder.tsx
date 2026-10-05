import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Phone } from '../components/Phone'
import { Arrow, SplitText } from '../components/ui'
import { colors } from '../data'
import './Preorder.css'

const LAUNCH = new Date('2026-11-20T10:00:00+05:00').getTime()

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])
  const diff = Math.max(0, target - now)
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  }
}

export function Preorder() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const phoneY = useTransform(scrollYProgress, [0, 1], ['30%', '-10%'])
  const rotY = useTransform(scrollYProgress, [0, 1], [-50, 30])
  const rotX = useTransform(scrollYProgress, [0, 1], [20, -10])
  const t = useCountdown(LAUNCH)

  return (
    <section ref={ref} className="pre section" id="preorder">
      <div className="container">
        <div className="pre__card">
          <div className="pre__bg" aria-hidden />
          <div className="pre__content">
            <span className="eyebrow">Предзаказ открыт</span>
            <h2>
              <SplitText text="Будь первым." />
              <br />
              <SplitText text="Свет уже близко." className="grad-text" delay={0.2} />
            </h2>
            <p className="pre__lead">
              Оформи предзаказ до старта продаж и получи наушники <b>AURA Buds</b> в подарок и бесплатную доставку в день
              релиза.
            </p>

            <div className="pre__timer" aria-label="До старта продаж">
              {(
                [
                  ['days', 'дней'],
                  ['hours', 'часов'],
                  ['minutes', 'минут'],
                  ['seconds', 'секунд'],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="pre__unit">
                  <Digits value={t[key]} />
                  <small>{label}</small>
                </div>
              ))}
            </div>

            <PreorderForm />
          </div>

          <motion.div className="pre__phone" style={{ y: phoneY }}>
            <Phone color={colors[1]} rotateX={rotX} rotateY={rotY} className="pre__device" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/** Цифры, которые перелистываются при изменении */
function Digits({ value }: { value: number }) {
  const str = String(value).padStart(2, '0')
  return (
    <b className="pre__digits">
      {str.split('').map((d, i) => (
        <span key={i} className="pre__digit">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={d}
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {d}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </b>
  )
}

function PreorderForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'error' | 'loading' | 'done'>('idle')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setStatus('error')
      return
    }
    // Это демо-лендинг: имитируем запрос к серверу
    setStatus('loading')
    window.setTimeout(() => setStatus('done'), 1200)
  }

  return (
    <AnimatePresence mode="wait">
      {status === 'done' ? (
        <motion.div
          key="done"
          className="pre__done"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <svg viewBox="0 0 52 52" className="pre__check">
            <motion.circle
              cx="26"
              cy="26"
              r="24"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7 }}
            />
            <motion.path
              d="M15 27l7 7 15-15"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            />
          </svg>
          <div>
            <b>Ты в списке!</b>
            <p>Мы напишем на {email}, как только начнутся продажи.</p>
          </div>
        </motion.div>
      ) : (
        <motion.form key="form" className={`pre__form ${status === 'error' ? 'is-error' : ''}`} onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }}>
          <input
            type="email"
            placeholder="Твой e-mail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === 'error') setStatus('idle')
            }}
            aria-label="E-mail"
            aria-invalid={status === 'error'}
          />
          <button type="submit" className="btn btn--primary" disabled={status === 'loading'}>
            <span>{status === 'loading' ? 'Отправляем…' : 'Оформить'}</span>
            {status !== 'loading' && <Arrow />}
          </button>
          <AnimatePresence>
            {status === 'error' && (
              <motion.small className="pre__error" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                Похоже, в адресе опечатка
              </motion.small>
            )}
          </AnimatePresence>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
