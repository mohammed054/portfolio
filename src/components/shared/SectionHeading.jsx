import EyebrowLabel from './EyebrowLabel'

function SectionHeading({ eyebrow, title, className = '' }) {
  return (
    <div className={`text-center ${className}`}>
      {eyebrow && <EyebrowLabel>{eyebrow}</EyebrowLabel>}
      <h2 className="text-[clamp(28px,1.5rem+1.2vw,42px)] font-bold text-text-dark leading-tight">
        {title}
      </h2>
    </div>
  )
}

export default SectionHeading
