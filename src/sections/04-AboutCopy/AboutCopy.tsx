import styles from './AboutCopy.module.css';

const column1 = `Shader is a creative development studio specialized in building interactive 3D and AI solutions for the web. Serious about business, based in Sweden, and working with brands, agencies and designers worldwide. Plugged into the future. While we're a small team of creative engineers, we have a hand-picked network of collaborators: designers, 3D artists, copywriters, animators, and creative technologists, ready to plug in with an array of capabilities.`;

const column2 = `This modular approach means we can scale and adapt to each challenge. Whether it's a WebGL experiment, an interactive product visualization, a mobile app, or an AI-driven experience, we help bold brands stand out across every screen. We build storytelling platforms that demand attention and reward curiosity. We push digital mediums to places you haven't seen before, and have fun doing it. Beyond code, we offer 3D design and animation, UI and motion design, concepts and digital strategy, full-stack development, and creative consulting.`;

const column3 = `Whether it's prototyping an idea, launching an augmented reality experience, or bringing high-fidelity visuals to life, Shader bridges the gap between creative ambition and technical execution. Our process is hands-on, collaborative, and tailored for teams that value both craft and innovation. We combine technical expertise with a designer's eye, ensuring that every interaction feels natural and every pixel is perfectly placed. We're not your regular IT department. We don't troubleshoot printers.`;

function AboutCopy() {
  return (
    <section className={styles.section}>
      <h2 className={styles.headline}>
        Making Digital
        <br />
        Storytelling More Playful,
        <br />
        Powerful, and Alive
      </h2>

      <div className={styles.columns}>
        <div className={styles.column}>
          <p>{column1}</p>
        </div>
        <div className={styles.column}>
          <p>{column2}</p>
        </div>
        <div className={styles.column}>
          <p>{column3}</p>
        </div>
      </div>
    </section>
  );
}

export default AboutCopy;