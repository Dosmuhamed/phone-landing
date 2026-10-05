import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { navLinks } from '../data'
import { scrollToId } from '../lib/smoothScroll'
import './Footer.css'

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['40%', '0%'])
  const letterSpacing = useTransform(scrollYProgress, [0, 1], ['0.3em', '-0.04em'])

  return (
    <footer ref={ref} className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__col footer__col--wide">
            <p className="footer__claim">Смартфон, который видит свет. Концепт-проект, созданный для портфолио.</p>
          </div>
          <div className="footer__col">
            <h4>Разделы</h4>
            {navLinks.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId(l.id)
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="footer__col">
            <h4>Соцсети</h4>
            <a href="#top" onClick={(e) => e.preventDefault()}>
              Instagram
            </a>
            <a href="#top" onClick={(e) => e.preventDefault()}>
              Telegram
            </a>
            <a href="#top" onClick={(e) => e.preventDefault()}>
              YouTube
            </a>
          </div>
          <div className="footer__col">
            <h4>Поддержка</h4>
            <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToId('faq') }}>
              Вопросы и ответы
            </a>
            <a href="#preorder" onClick={(e) => { e.preventDefault(); scrollToId('preorder') }}>
              Предзаказ
            </a>
            <button className="footer__up" onClick={() => scrollToId('top')}>
              Наверх ↑
            </button>
          </div>
        </div>
      </div>

      <motion.div className="footer__brand" style={{ y, letterSpacing }} aria-hidden>
        AURA
      </motion.div>

      <div className="container footer__bottom">
        <span>© 2026 AURA. Все права защищены. Бренд вымышленный.</span>
        <span>
          Фото: <a href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a>
        </span>
      </div>
    </footer>
  )
}
