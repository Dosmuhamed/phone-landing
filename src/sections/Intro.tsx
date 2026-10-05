import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import './Intro.css'

const tickerTop = ['Камера 200 МП', 'Чип N1 · 3 нм', 'Титан класса 5', '144 Гц', 'IP69', '120 Вт']
const tickerBottom = ['Ночь как день', 'AI на устройстве', '7 лет обновлений', 'Спутниковая связь', '6000 мА·ч']

/** Две бегущие строки, наклонённые навстречу друг другу */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const shift = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])
  const shiftBack = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <div ref={ref} className="marquee" aria-hidden>
      <MarqueeRow items={tickerTop} offset={shift} className="marquee__row--a" />
      <MarqueeRow items={tickerBottom} offset={shiftBack} className="marquee__row--b" reverse />
    </div>
  )
}

function MarqueeRow({
  items,
  offset,
  className,
  reverse,
}: {
  items: string[]
  offset: MotionValue<string>
  className: string
  reverse?: boolean
}) {
  const content = [...items, ...items]
  return (
    <div className={`marquee__row ${className}`}>
      <motion.div style={{ x: offset }}>
        <div className={`marquee__track ${reverse ? 'marquee__track--rev' : ''}`}>
          {[0, 1].map((k) => (
            <div className="marquee__group" key={k}>
              {content.map((t, i) => (
                <span key={i} className="marquee__item">
                  {t}
                  <svg viewBox="0 0 24 24" className="marquee__star">
                    <path d="M12 0c.8 6.6 5.4 11.2 12 12-6.6.8-11.2 5.4-12 12-.8-6.6-5.4-11.2-12-12C6.6 11.2 11.2 6.6 12 0z" />
                  </svg>
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

const manifesto =
  'AURA X — это не просто смартфон. Это камера, которая *видит в темноте*, чип, который *думает быстрее вас*, и батарея, которая *забывает о розетке*. Мы убрали всё лишнее и оставили только свет.'

// Слова между звёздочками подсвечиваются градиентом
const manifestoWords = (() => {
  let inside = false
  return manifesto.split(' ').map((raw) => {
    if (raw.startsWith('*')) inside = true
    const accent = inside
    if (/\*[,.]?$/.test(raw)) inside = false
    return { word: raw.replace(/\*/g, ''), accent }
  })
})()

/** Текст, слова которого «зажигаются» по мере скролла */
export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const total = manifestoWords.length

  return (
    <section className="manifesto section" id="manifesto">
      <div className="container">
        <span className="eyebrow">Манифест</span>
        <p ref={ref} className="manifesto__text">
          {manifestoWords.map(({ word, accent }, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / total, (i + 1) / total]} accent={accent}>
              {word}
            </Word>
          ))}
        </p>
      </div>
    </section>
  )
}

function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  accent: boolean
}) {
  const opacity = useTransform(progress, range, [0.12, 1])
  const y = useTransform(progress, range, [8, 0])
  return (
    <motion.span className={`manifesto__word ${accent ? 'grad-text' : ''}`} style={{ opacity, y }}>
      {children}{' '}
    </motion.span>
  )
}
