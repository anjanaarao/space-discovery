import { useEffect, useRef } from 'react'
import './FactPopup.css'

/**
 * Generic fact modal: name + image + blurb + bullet facts.
 * Knows nothing about 3D — it just takes a data object.
 */
export default function FactPopup({ data, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (data) closeRef.current?.focus()
  }, [data])

  if (!data) return null

  return (
    <div className="fact-popup" role="dialog" aria-modal="false" aria-labelledby="fact-popup-title">
      <button ref={closeRef} className="fact-popup__close" onClick={onClose} aria-label="Close">
        ×
      </button>

      {data.texture && (
        <div className="fact-popup__image">
          <img src={data.texture} alt={`Surface map of ${data.name}`} loading="lazy" />
        </div>
      )}

      <h2 id="fact-popup-title" className="fact-popup__title">
        {data.name}
      </h2>

      {data.blurb && <p className="fact-popup__blurb">{data.blurb}</p>}

      <ul className="fact-popup__facts">
        {data.facts?.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>

      <p className="fact-popup__hint">Press Esc or click empty space to return</p>
    </div>
  )
}
