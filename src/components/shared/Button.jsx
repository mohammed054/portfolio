import { Link } from 'react-router-dom'

function Button({ to, children, variant = 'primary', className = '' }) {
  const baseStyles = 'inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold transition-all duration-300'
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
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
