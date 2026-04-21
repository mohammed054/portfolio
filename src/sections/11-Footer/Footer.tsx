import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.contactGrid}>
        <div className={styles.column}>
          <h3>General Enquiries</h3>
          <p>
            <a href="mailto:hello@shader.se">hello@shader.se</a>
          </p>
          <p>
            <a href="https://cal.com/simon-hedlund-kglzne" target="_blank" rel="noopener noreferrer">
              Book a call
            </a>
          </p>
        </div>
        <div className={styles.column}>
          <h3>Visit us</h3>
          <p>Laxholmstorget 3</p>
          <p>602 21 Norrköping</p>
          <p>Sweden</p>
        </div>
        <div className={styles.column}>
          <h3>Social</h3>
          <p>
            <a href="https://linkedin.com/company/shadersweden/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </p>
          <p>
            <a href="https://instagram.com/shadersweden/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </p>
          <p>
            <a href="https://x.com/shadersweden" target="_blank" rel="noopener noreferrer">
              X (Twitter)
            </a>
          </p>
        </div>
      </div>

      <div className={styles.ceoCard}>
        <div className={styles.ceoPlaceholder}>📞</div>
        <div className={styles.ceoText}>
          <h4>New business</h4>
          <p>Reach out today to our CEO for new business enquiries at <a href="mailto:ceo@shader.se">ceo@shader.se</a></p>
        </div>
      </div>

      <div className={styles.footerBar}>
        <div className={styles.leftBadge}>
          <div className={styles.globe}>🌐</div>
          <p>WORLDWIDE BUSINESS<br />CERTIFIED COMPANY</p>
        </div>

        <div className={styles.center}>
          <div className={styles.logo}>
            <svg viewBox="0 0 40 40" fill="none">
              <rect x="0" y="0" width="40" height="6" fill="var(--color-rainbow-1)" />
              <rect x="0" y="8" width="40" height="6" fill="var(--color-rainbow-2)" />
              <rect x="0" y="16" width="40" height="6" fill="var(--color-rainbow-3)" />
              <rect x="0" y="24" width="40" height="6" fill="var(--color-rainbow-4)" />
              <rect x="0" y="32" width="40" height="6" fill="var(--color-rainbow-5)" />
            </svg>
            <span>SHADER</span>
          </div>
          <p className={styles.tagline}>A High Tech Business Solutions Company</p>
          <p className={styles.copyright}>© Shader Sweden AB. All Rights Reserved.</p>
        </div>

        <div className={styles.rightBadge}>
          <div className={styles.laurels}>🌿 🌿</div>
          <p>READ OUR<br />ACCESSIBILITY<br />STATEMENT</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;