function EyebrowLabel({ children, className = '' }) {
  return (
    <span className={`eyebrow ${className}`}>
      {children}
    </span>
  )
}

export default EyebrowLabel
