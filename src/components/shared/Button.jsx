import { Link } from 'react-router-dom'

export default function Button({ to, href, children, className = '', variant = 'solid', ...rest }) {
  const base = 'inline-flex items-center gap-2 rounded-pill px-8 py-3 text-sm font-semibold transition-colors'
  const styles =
    variant === 'solid'
      ? `${base} bg-accent text-white hover:opacity-90`
      : `${base} px-0 text-accent underline underline-offset-4`

  if (to) {
    return (
      <Link to={to} className={`${styles} ${className}`} {...rest}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={`${styles} ${className}`} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button className={`${styles} ${className}`} {...rest}>
      {children}
    </button>
  )
}
