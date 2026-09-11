import EyebrowLabel from './EyebrowLabel'

function SectionHeading({ eyebrow, title, className = '' }) {
  return (
    <div className={`text-center ${className}`}>
      {eyebrow && <EyebrowLabel>{eyebrow}</EyebrowLabel>}
      <h2 className="text-[clamp(22px,1.378rem+1.439vw,36px)] text-text-dark leading-tight">
        {title}
      </h2>
    </div>
  )
}

export default SectionHeading
