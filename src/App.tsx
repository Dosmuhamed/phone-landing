import { AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { Cursor } from './components/Cursor'
import { Navbar } from './components/Navbar'
import { Preloader } from './components/Preloader'
import { initSmoothScroll, setScrollLocked } from './lib/smoothScroll'
import { Camera } from './sections/Camera'
import { Design } from './sections/Design'
import { Faq } from './sections/Faq'
import { Features } from './sections/Features'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Lifestyle } from './sections/Lifestyle'
import { Manifesto, Marquee } from './sections/Intro'
import { Models } from './sections/Models'
import { Performance } from './sections/Performance'
import { Preorder } from './sections/Preorder'

export default function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    initSmoothScroll()
  }, [])

  useEffect(() => {
    setScrollLocked(!loaded)
  }, [loaded])

  const onLoaded = useCallback(() => setLoaded(true), [])

  return (
    <>
      <AnimatePresence>{!loaded && <Preloader onDone={onLoaded} />}</AnimatePresence>
      <Cursor />
      <Navbar />
      <main>
        <Hero ready={loaded} />
        <Marquee />
        <Manifesto />
        <Design />
        <Features />
        <Camera />
        <Performance />
        <Lifestyle />
        <Models />
        <Faq />
        <Preorder />
      </main>
      <Footer />
      <div className="noise" aria-hidden />
    </>
  )
}
