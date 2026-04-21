import { useRef, useEffect, useState } from 'react';
import styles from './ContactTease.module.css';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
}

function ContactTease() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 40 + Math.random() * 40,
      speed: 0.5 + Math.random() * 1.5,
      rotation: Math.random() * 360,
    }));
    setStars(newStars);
  }, []);

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.vignette} />

      <div className={styles.stars}>
        {stars.map((star) => (
          <div
            key={star.id}
            className={styles.star}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              animationDuration: `${3 + star.speed}s`,
              transform: `rotate(${star.rotation}deg)`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="url(#goldGradient)">
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffd700" />
                  <stop offset="50%" stopColor="#c9a84c" />
                  <stop offset="100%" stopColor="#8b6914" />
                </linearGradient>
              </defs>
              <path d="M12 0l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 16.74l-6.18 3.28L7 14.14l-5-4.87 6.91-3.01L12 0z" />
            </svg>
          </div>
        ))}
      </div>

      <div className={styles.content}>
        <h2 className={styles.headline}>
          Still Not
          <br />
          Convinced We're
          <br />
          Serious About
          <br />
          Business?
        </h2>
        <p className={styles.subtext}>We've got one last trick up our sleeve.</p>
      </div>
    </section>
  );
}

export default ContactTease;