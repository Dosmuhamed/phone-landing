import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { navLinks } from '../data'
import { scrollToId, setScrollLocked } from '../lib/smoothScroll'
import './Navbar.css'

export function Navbar() {
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(y > 40)
    setHidden(y > prev && y > 400)
  })

  // Подсветка текущего раздела
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setScrollLocked(open)
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    // ждём, пока меню закроется и скролл разблокируется
    window.setTimeout(() => scrollToId(id), open ? 350 : 0)
  }

  return (
    <>
      <motion.div className="progress" style={{ scaleX: progress }} />
      <motion.header
        className={`nav ${solid ? 'nav--solid' : ''}`}
        animate={{ y: hidden && !open ? '-110%' : '0%' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="nav__inner">
          <a
            href="#top"
            className="nav__logo"
            onClick={(e) => {
              e.preventDefault()
              go('top')
            }}
          >
            <svg viewBox="0 0 64 64" aria-hidden>
              <defs>
                <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#8b7bff" />
                  <stop offset=".55" stopColor="#3fe0c5" />
                  <stop offset="1" stopColor="#c6ff6b" />
                </linearGradient>
              </defs>
              <path d="M14 50 32 12l18 38" fill="none" stroke="url(#logo-g)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="32" cy="40" r="5" fill="url(#logo-g)" />
            </svg>
            AURA
          </a>

          <nav className="nav__links" aria-label="Основная навигация">
            {navLinks.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={active === l.id ? 'is-active' : ''}
                onClick={(e) => {
                  e.preventDefault()
                  go(l.id)
                }}
              >
                {active === l.id && <motion.span layoutId="nav-pill" className="nav__pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span>{l.label}</span>
              </a>
            ))}
          </nav>

          <a
            href="#preorder"
            className="btn btn--primary nav__cta"
            onClick={(e) => {
              e.preventDefault()
              go('preorder')
            }}
          >
            <span>Предзаказ</span>
          </a>

          <button
            className={`nav__burger ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ clipPath: 'circle(0% at 92% 36px)' }}
            animate={{ clipPath: 'circle(150% at 92% 36px)' }}
            exit={{ clipPath: 'circle(0% at 92% 36px)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="menu__glow" />
            <nav className="menu__links">
              {[...navLinks, { id: 'preorder', label: 'Предзаказ' }].map((l, i) => (
                <div key={l.id} className="menu__item">
                  <motion.a
                    href={`#${l.id}`}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    onClick={(e) => {
                      e.preventDefault()
                      go(l.id)
                    }}
                  >
                    <small>0{i + 1}</small>
                    {l.label}
                  </motion.a>
                </div>
              ))}
            </nav>
            <motion.p
              className="menu__foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              exit={{ opacity: 0 }}
            >
              AURA X · от $599 · Поставки с 20 ноября
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
