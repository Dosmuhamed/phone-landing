import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Counter, Reveal, SectionHead } from '../components/ui'
import './Performance.css'

// Линии «дорожек» платы, расходящиеся от чипа
const traces = (() => {
  const paths: string[] = []
  const cx = 300
  const cy = 220
  const half = 80
  for (let i = 0; i < 5; i++) {
    const o = -60 + i * 30
    const bend = 30 + (i % 3) * 22
    // вверх
    paths.push(`M${cx + o} ${cy - half} V${cy - half - bend} L${cx + o * 2.2} ${cy - half - bend - 40} V20`)
    // вниз
    paths.push(`M${cx + o} ${cy + half} V${cy + half + bend} L${cx + o * 2.2} ${cy + half + bend + 40} V420`)
    // влево
    paths.push(`M${cx - half} ${cy + o} H${cx - half - bend} L${cx - half - bend - 40} ${cy + o * 1.8} H20`)
    // вправо
    paths.push(`M${cx + half} ${cy + o} H${cx + half + bend} L${cx + half + bend + 40} ${cy + o * 1.8} H580`)
  }
  return paths
})()

const bench = [
  { label: 'CPU · одно ядро', prev: 62, now: 88 },
  { label: 'CPU · многоядерный', prev: 55, now: 92 },
  { label: 'GPU · графика', prev: 48, now: 96 },
  { label: 'NPU · нейросети', prev: 40, now: 100 },
]

export function Performance() {
  const svgRef = useRef<SVGSVGElement>(null)
  const inView = useInView(svgRef, { once: true, amount: 0.4 })

  return (
    <section className="perf section" id="performance">
      <div className="container">
        <SectionHead
          center
          eyebrow="Производительность"
          title="Чип N1."
          accent="Быстрее мысли."
          text="19 миллиардов транзисторов, техпроцесс 3 нм и нейродвижок на 45 триллионов операций в секунду. Игры на максималках — без перегрева."
        />

        <div className="perf__chip-wrap">
          <svg ref={svgRef} viewBox="0 0 600 440" className="perf__svg" aria-hidden>
            <defs>
              <linearGradient id="trace-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#8b7bff" />
                <stop offset=".55" stopColor="#3fe0c5" />
                <stop offset="1" stopColor="#c6ff6b" />
              </linearGradient>
            </defs>
            {traces.map((d, i) => (
              <g key={i}>
                <motion.path
                  d={d}
                  className="perf__trace"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
                  transition={{ duration: 1.6, delay: 0.3 + (i % 5) * 0.08, ease: [0.65, 0, 0.35, 1] }}
                />
                {inView && (
                  <path
                    d={d}
                    pathLength={100}
                    className="perf__pulse"
                    style={{ animationDelay: `${1.6 + ((i * 0.37) % 3)}s`, animationDuration: `${2.4 + (i % 4) * 0.6}s` }}
                  />
                )}
              </g>
            ))}
          </svg>

          <motion.div
            className="perf__chip"
            initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="perf__chip-core">
              <span className="perf__chip-logo">AURA</span>
              <span className="perf__chip-name">N1</span>
              <span className="perf__chip-sub">3 нм · 2026</span>
            </div>
          </motion.div>
        </div>

        <div className="perf__stats">
          {[
            { to: 42, pre: '+', suf: '%', t: 'быстрее CPU' },
            { to: 60, pre: '+', suf: '%', t: 'мощнее GPU' },
            { to: 45, pre: '', suf: ' TOPS', t: 'нейродвижок' },
            { to: 19, pre: '', suf: ' млрд', t: 'транзисторов' },
          ].map((s, i) => (
            <Reveal key={s.t} className="perf__stat" delay={i * 0.08}>
              <b>
                <Counter to={s.to} prefix={s.pre} suffix={s.suf} />
              </b>
              <span>{s.t}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="perf__bench">
          <div className="perf__legend">
            <span>
              <i className="perf__dot perf__dot--prev" /> Прошлое поколение
            </span>
            <span>
              <i className="perf__dot" /> AURA N1
            </span>
          </div>
          {bench.map((b, i) => (
            <div key={b.label} className="perf__row">
              <span className="perf__label">{b.label}</span>
              <div className="perf__bars">
                <motion.div
                  className="perf__bar perf__bar--prev"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${b.prev}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.div
                  className="perf__bar"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${b.now}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
