import { SectionAnchor } from '../../components/shared/SectionAnchor';
import styles from './Clients.module.css';

const CLIENTS = [
  'ICA',
  'Region Ostergotland',
  'Pepsi',
  'hi.se',
  'spp',
  'Suicide Zero',
  'Scandic',
  'Cloetta',
  'SON',
  'oooo',
  'stadium',
  'Garageport',
];

function Businessman({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`${styles.businessman} ${styles[side]}`} aria-hidden="true">
      <span className={styles.head} />
      <span className={styles.body} />
      <span className={styles.tie} />
      <span className={`${styles.arm} ${styles.armOne}`} />
      <span className={`${styles.arm} ${styles.armTwo}`} />
    </div>
  );
}

function Clients() {
  return (
    <section id="section-clients" className={styles.section}>
      <SectionAnchor id="clients" threshold={0.35} />
      <div className={styles.texture} aria-hidden="true" />

      <Businessman side="left" />
      <Businessman side="right" />

      <div className={styles.container}>
        <h2>A Showcase of Valued Clients</h2>
        <p>
          A selection of partnerships, campaigns, launches, and strange little internet machines.
        </p>

        <div className={styles.logoGrid} aria-label="Client logos">
          {CLIENTS.map((client) => (
            <div key={client} className={styles.logoCell}>
              {client}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Clients;
