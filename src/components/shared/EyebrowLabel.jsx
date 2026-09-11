function EyebrowLabel({ children, className = '' }) {
  return (
    <span className={`inline-block text-sm font-semibold tracking-[2px] uppercase text-text-muted mb-4 ${className}`}>
      {children}
    </span>
  )
}

export default EyebrowLabel
