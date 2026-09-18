export default function EyebrowLabel({ children, className = '' }) {
  return (
    <p className={`text-xs font-semibold uppercase tracking-[2px] text-muted ${className}`}>
      {children}
    </p>
  )
}
