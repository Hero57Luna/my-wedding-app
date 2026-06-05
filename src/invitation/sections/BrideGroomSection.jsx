import { BRIDE_IMAGE, GROOM_IMAGE } from '../assets'
import AnimatedSection from '../components/AnimatedSection'

const couples = [
  {
    name: 'Rahadian Bagaskara Adikusuma',
    description: 'Beloved son of Mr. Jeki Nurahman Adikusuma & Mrs. Dyah Yully Marthawati',
    icon: 'fa-user-tie',
    image: GROOM_IMAGE,
    imageAlt: 'Rahadian Bagaskara Adikusuma',
    instagram: 'https://www.instagram.com/adikusuma_bagas?igsh=eHR5cjM3eDY5bms%3D&utm_source=qr',
  },
  {
    name: 'Dhelanda La Nina Dwipa Tiara Andiyani',
    description: 'Beloved daughter of Mr. Pandu Andiyani Gagadang Pamungkas & Mrs. Julidwiasih Soenardjo',
    icon: 'fa-heart',
    image: BRIDE_IMAGE,
    imageAlt: 'Dhelanda La Nina Dwipa Tiara Andiyani',
    instagram: 'https://www.instagram.com/dhelandiyani?igsh=MXduc3ppZnF1aXBuaA==',
  },
]

function BrideGroomSection() {
  return (
    <AnimatedSection page={2}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-chomsky text-4xl text-stone-900">Bride & Groom</h3>
        <i className="fa-solid fa-ring text-lg text-stone-500" />
      </div>

      <div className="space-y-4">
        {couples.map((person) => (
          <article key={person.name} className="rounded-md bg-stone-100 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
              <i className={`fa-solid ${person.icon} mr-2`} />
              Family
            </p>
            <h4 className="mt-2 font-serif text-xl text-stone-900">{person.name}</h4>
            <figure className="mt-3 overflow-hidden rounded border border-stone-200/80 bg-stone-200/50">
              <img
                src={person.image}
                alt={person.imageAlt}
                className="aspect-[4/5] w-full object-cover"
              />
            </figure>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              {person.description}
            </p>
            <a
              href={person.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2 text-xs font-bold tracking-widest text-stone-500 transition-colors hover:text-stone-900"
            >
              <i className="fa-brands fa-instagram text-base" />
              INSTAGRAM
            </a>
          </article>
        ))}
      </div>
    </AnimatedSection>
  )
}

export default BrideGroomSection
