import { useEffect, useRef, useState } from 'react'
import SectionFooter from './SectionFooter'

function AnimatedSection({ children, className = '', page }) {
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

  return (
    <section
      ref={sectionRef}
      className={`transform pb-8 pt-2 transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-20'
      } ${className}`}
    >
      {children}
      {typeof page === 'number' ? <SectionFooter page={page} /> : null}
    </section>
  )
}

export default AnimatedSection
