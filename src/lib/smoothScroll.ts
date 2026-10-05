import Lenis from 'lenis'

let lenis: Lenis | null = null

export function initSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 })
  const raf = (time: number) => {
    lenis?.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}

export function setScrollLocked(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  if (locked) lenis?.stop()
  else lenis?.start()
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: id === 'top' ? 0 : -40, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
