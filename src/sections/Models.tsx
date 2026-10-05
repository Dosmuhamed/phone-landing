import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useState, type CSSProperties, type PointerEvent } from 'react'
import { Phone } from '../components/Phone'
import { Reveal, SectionHead } from '../components/ui'
import { models, specRows, type Model } from '../data'
import { scrollToId } from '../lib/smoothScroll'
import './Models.css'

export function Models() {
  const [selected, setSelected] = useState('x')

  return (
    <section className="models section" id="models">
      <div className="container">
        <SectionHead
          center
          eyebrow="Линейка"
          title="Выбери свой"
          accent="AURA."
          text="Три модели — один характер. Сравни и выбери ту, что подходит именно тебе."
        />

        <div className="models__grid">
          {models.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.1}>
              <ModelCard model={m} active={selected === m.id} onSelect={() => setSelected(m.id)} />
            </Reveal>
          ))}
        </div>

        <Reveal className="compare-table">
          <div className="compare-table__scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Характеристика</th>
                  {models.map((m) => (
                    <th key={m.id} scope="col" className={selected === m.id ? 'is-active' : ''}>
                      <button onClick={() => setSelected(m.id)}>{m.name.replace('AURA ', '')}</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specRows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {row.values.map((v, i) => (
                      <td key={i} className={selected === models[i].id ? 'is-active' : ''}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ModelCard({ model, active, onSelect }: { model: Model; active: boolean; onSelect: () => void }) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(-22)
  const srx = useSpring(rx, { stiffness: 120, damping: 14 })
  const sry = useSpring(ry, { stiffness: 120, damping: 14 })

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(-22 + px * 50)
    rx.set(-py * 20)
  }
  const onLeave = () => {
    ry.set(-22)
    rx.set(0)
  }

  return (
    <div
      className={`model ${active ? 'is-active' : ''}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onSelect}
      style={{ '--glow': model.color.glow } as CSSProperties}
    >
      {active && <motion.div layoutId="model-border" className="model__border" transition={{ type: 'spring', stiffness: 260, damping: 30 }} />}
      {model.id === 'x' && <span className="model__badge">Хит продаж</span>}

      <div className="model__stage">
        <div className="model__glow" />
        <Phone
          color={model.color}
          cameras={model.cameras}
          rotateX={srx}
          rotateY={sry}
          className="model__phone"
          style={{ '--w': `${Math.round(150 * model.size)}px` } as CSSProperties}
        />
      </div>

      <div className="model__body">
        <h3>{model.name}</h3>
        <p className="model__tagline">{model.tagline}</p>
        <ul>
          {model.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <div className="model__foot">
          <div className="model__price">
            <small>от</small> ${model.price}
          </div>
          <button
            className={`btn ${active ? 'btn--primary' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
              scrollToId('preorder')
            }}
          >
            <span>Купить</span>
          </button>
        </div>
      </div>
    </div>
  )
}
