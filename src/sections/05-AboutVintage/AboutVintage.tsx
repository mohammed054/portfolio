import { useRef } from 'react';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import { COPY } from '../../utils/constants';
import styles from './AboutVintage.module.css';

function AboutVintage() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="section-about-vintage" ref={sectionRef} className={styles.section}>
      <SectionAnchor id="about-us" threshold={0.35} />

      <div className={styles.photoBanner} aria-label="Retro business people standing behind old computers">
        <img
          src="/textures/group_3x2.webp"
          alt=""
          className={styles.photo}
          loading="lazy"
          decoding="async"
        />
        <div className={styles.photoGrain} aria-hidden="true" />
        <span className={styles.watermark} aria-hidden="true">
          SHADER
        </span>
      </div>

      <div className={styles.headingPanel}>
        <h2>{COPY.aboutCopy.headline}</h2>
      </div>
    </section>
  );
}

export default AboutVintage;
