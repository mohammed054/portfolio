import { useRef } from 'react';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import { COPY } from '../../utils/constants';
import styles from './AboutVintage.module.css';

const BUILD_LINES = [
  'profile.load("Mohamed Hassoun")',
  'stack.use(["React", "Python", "Node", "Android"])',
  'workflow.clean(messyInput).ship(usefulSoftware)',
];

function AboutVintage() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="section-about-vintage" ref={sectionRef} className={styles.section}>
      <SectionAnchor id="about-vintage" threshold={0.35} />

      <div className={styles.photoBanner} aria-label="Portfolio code board">
        <div className={styles.codeBoard}>
          <div className={styles.codeHeader}>
            <span>MOHAMED.EXE</span>
            <span>READY</span>
          </div>
          <div className={styles.codeLines}>
            {BUILD_LINES.map((line) => (
              <p key={line}>
                <span>&gt;</span>
                {line}
              </p>
            ))}
          </div>
        </div>
        <div className={styles.photoGrain} aria-hidden="true" />
        <span className={styles.watermark} aria-hidden="true">
          HASSOUN
        </span>
      </div>

      <div className={styles.headingPanel}>
        <h2>{COPY.aboutCopy.headline}</h2>
      </div>
    </section>
  );
}

export default AboutVintage;
