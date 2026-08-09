import { GROOM_IMAGE } from '../assets'
import AnimatedSection from '../components/AnimatedSection'
import SectionLabel from '../components/SectionLabel'

function GroomSection() {
  return (
    <AnimatedSection page={2}>
      <h3 className="font-chomsky text-4xl leading-none text-stone-900">The Groom</h3>
      <div className="mt-3">
        <SectionLabel label="Bagas" align="left" />
      </div>

      <figure className="mt-5 overflow-hidden border border-stone-300 bg-stone-200/50">
        <img
          src={GROOM_IMAGE}
          alt="Rahadian Bagaskara Adikusuma"
          className="aspect-[4/5] w-full object-cover"
        />
      </figure>

      <h4 className="mt-5 font-serif text-xl font-bold text-stone-900">
        Rahadian Bagaskara Adikusuma
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        The Son of Mr. Jeki Nurahman Adikusuma
        <br />
        &amp; Mrs. Dyah Yully Marthawati
      </p>

      <a
        href="https://www.instagram.com/adikusuma_bagas?igsh=eHR5cjM3eDY5bms%3D&utm_source=qr"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block font-serif text-xs font-bold uppercase tracking-widest text-stone-800 underline underline-offset-4 transition-colors hover:text-stone-500"
      >
        Instagram
      </a>
    </AnimatedSection>
  )
}

export default GroomSection
