import { motion } from 'framer-motion'

/**
 * Reveal — generic section reveal wrapper per Phase 4 spec row:
 * trigger: scroll into view (~20% visible)
 * property: opacity, transform: translateY
 * from: 0, 24px → to: 1, 0
 * duration: 500ms
 * easing: ease-out
 * loop/repeat: once
 */
const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, easing: 'easeOut' } },
}

export default function Reveal({ children, customClassName = '' }) {
  return (
    <motion.div
      variants={revealVariants}
      whileInView="visible"
      once
      className={customClassName}
    >
      {children}
    </motion.div>
  )
}