export default function EyebrowLabel({ children, className = '', withDash = false }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {withDash && <span className="h-[2px] w-8 bg-accent" />}
      <p className="text-xs font-semibold uppercase tracking-[2px] text-muted">
        {children}
      </p>
    </div>
  )
}
