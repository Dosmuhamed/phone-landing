import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { SectionHead } from '../components/ui'
import { lifestyle } from '../data'
import './Lifestyle.css'

const columns = [lifestyle.slice(0, 3), lifestyle.slice(3, 5), lifestyle.slice(5, 8)]
const speeds = [-120, 120, -220]

/** Галерея из трёх колонок, которые едут с разной скоростью */
export function Lifestyle() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  return (
    <section className="life section">
      <div className="container">
        <SectionHead
          center
          eyebrow="В жизни"
          title="Создан, чтобы быть"
          accent="рядом."
          text="Утром, в дороге, на встрече и в два часа ночи. AURA X выглядит уместно везде."
        />
      </div>
      <div ref={ref} className="life__grid">
        {columns.map((col, i) => (
          <Column key={i} items={col} progress={scrollYProgress} speed={speeds[i]} />
        ))}
      </div>
    </section>
  )
}

function Column({
  items,
  progress,
  speed,
}: {
  items: typeof lifestyle
  progress: MotionValue<number>
  speed: number
}) {
  const y = useTransform(progress, [0, 1], [0, speed])
  return (
    <motion.div className="life__col" style={{ y }}>
      {items.map((it) => (
        <figure key={it.caption} className="life__item" data-cursor="hover">
          <img src={it.src} alt={it.caption} loading="lazy" />
          <figcaption>{it.caption}</figcaption>
        </figure>
      ))}
    </motion.div>
  )
}
