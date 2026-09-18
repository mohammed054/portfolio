export default function SectionHeading({ children, className = '' }) {
  return (
    <h2 className={`text-4xl font-extrabold leading-tight text-ink md:text-5xl ${className}`}>
      {children}
    </h2>
  )
}
