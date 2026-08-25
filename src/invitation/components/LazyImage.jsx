import { useState } from 'react'

function LazyImage({ src, alt, className = '', ...imgProps }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        aria-hidden="true"
        className={`absolute inset-0 animate-pulse bg-stone-300 transition-opacity duration-300 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <img
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className="absolute inset-0 h-full w-full object-cover"
        {...imgProps}
      />
    </div>
  )
}

export default LazyImage
