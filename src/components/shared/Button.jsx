import { Link } from 'react-router-dom'

function Button({ to, children, variant = 'primary', className = '' }) {
  const baseStyles = 'btn-pill'
  const variants = {
    primary: 'btn-pill-primary',
    outline: 'btn-pill-outline',
  }

  if (to) {
    return (
      <Link to={to} className={`${baseStyles} ${variants[variant]} ${className}`}>
        {children}
      </Link>
    )
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

export default Button
