import { useEffect, useState } from 'react'

/**
 * useCountdown — ticks down to targetDate. See spec Section 9 item 13:
 * the REAL target timestamp is unconfirmed, currently defaulted in
 * CTACountdown.jsx to "7 days from load" as an obvious placeholder value.
 */
export function useCountdown(targetDate) {
  const [remaining, setRemaining] = useState(() => Math.max(targetDate.getTime() - Date.now(), 0))

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.max(targetDate.getTime() - Date.now(), 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((remaining / (1000 * 60)) % 60)
  const seconds = Math.floor((remaining / 1000) % 60)

  return { days, hours, minutes, seconds }
}
