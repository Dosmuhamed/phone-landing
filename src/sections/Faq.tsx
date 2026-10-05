import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Reveal, SectionHead } from '../components/ui'
import { faq } from '../data'
import './Faq.css'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="faq section" id="faq">
      <div className="container faq__inner">
        <SectionHead eyebrow="FAQ" title="Остались" accent="вопросы?" text="Собрали самое важное. Не нашёл ответ — напиши нам, ответим за 5 минут." />

        <div className="faq__list">
          {faq.map((item, i) => {
            const isOpen = open === i
            return (
              <Reveal key={item.q} delay={i * 0.06} className={`faq__item ${isOpen ? 'is-open' : ''}`}>
                <button className="faq__q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                  <span>{item.q}</span>
                  <i className="faq__icon" aria-hidden />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="faq__a"
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
