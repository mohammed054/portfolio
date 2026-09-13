import { Link } from 'react-router-dom'

function Button({ to, children, variant = 'primary', className = '' }) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold text-[0.833rem] transition-all duration-300 cursor-pointer'
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover hover:shadow-[0_7px_25px_rgba(255,91,74,0.2)]',
    outline: 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white',
    dark: 'bg-text-dark text-white hover:bg-text-dark/90',
  }

  const style = {
    padding: '17px 57px',
    fontFamily: "'sofia-pro', 'Poppins', sans-serif",
  }

  if (to) {
    return (
      <Link to={to} className={`${baseStyles} ${variants[variant]} ${className}`} style={style}>
        {children}
      </Link>
    )
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} style={style}>
      {children}
    </button>
  )
}

export default Button
