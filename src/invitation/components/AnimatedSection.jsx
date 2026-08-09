import { useEffect, useRef, useState } from 'react'
import SectionFooter from './SectionFooter'

function AnimatedSection({ children, className = '', page, dark = false }) {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.25 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const darkBleed = dark
    ? '-mx-5 bg-stone-950 px-5 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10'
    : ''

  return (
    <section
      ref={sectionRef}
      className={`transform pb-8 pt-2 transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-20'
      } ${darkBleed} ${className}`}
    >
      {children}
      {typeof page === 'number' ? <SectionFooter page={page} dark={dark} /> : null}
    </section>
  )
}

export default AnimatedSection
