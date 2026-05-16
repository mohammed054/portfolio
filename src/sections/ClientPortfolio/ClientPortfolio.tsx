import {
  CONTACT,
  PROCESS_STEPS,
  PROFILE,
  PROJECTS,
  SERVICES,
  STACK_GROUPS,
  type PortfolioProject,
} from '../../content/portfolio';
import styles from './ClientPortfolio.module.css';

const projectLookup = new Map(PROJECTS.map((project) => [project.id, project]));
const serviceLookup = new Map(SERVICES.map((service) => [service.id, service.title]));

function getProjects(projectIds: string[]) {
  return projectIds
    .map((projectId) => projectLookup.get(projectId))
    .filter((project): project is PortfolioProject => Boolean(project));
}

function ExternalLink({
  href,
  children,
  variant = 'text',
}: {
  href: string;
  children: string;
  variant?: 'primary' | 'secondary' | 'text';
}) {
  const isMail = href.startsWith('mailto:');

  return (
    <a
      href={href}
      className={`${styles.linkButton} ${styles[variant]}`}
      target={isMail ? undefined : '_blank'}
      rel={isMail ? undefined : 'noopener noreferrer'}
    >
      {children}
    </a>
  );
}

function SectionHeader({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className={styles.sectionHeader}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}

function ProjectTags({ project }: { project: PortfolioProject }) {
  return (
    <ul className={styles.tags} aria-label={`${project.name} technologies`}>
      {project.tech.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}

export default function ClientPortfolio() {
  const featuredProjects = PROJECTS.filter((project) => project.featured);

  return (
    <>
      <section className={`${styles.hero} ${styles.section}`} id="home">
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{PROFILE.eyebrow}</p>
          <h1>{PROFILE.headline}</h1>
          <p className={styles.heroCopy}>{PROFILE.summary}</p>

          <div className={styles.ctaRow} aria-label="Primary actions">
            <ExternalLink href={PROFILE.emailHref} variant="primary">
              Email Mohamed
            </ExternalLink>
            <ExternalLink href={PROFILE.githubUrl} variant="secondary">
              View GitHub
            </ExternalLink>
          </div>

          <p className={styles.proofLine}>{PROFILE.proofLine.join(' / ')}</p>
        </div>

        <div className={styles.workflowPanel} aria-label="Workflow build examples">
          <div className={styles.panelTopline}>
            <span>Typical build path</span>
            <span>Client-ready</span>
          </div>
          <div className={styles.workflowRows}>
            <div>
              <span>Input</span>
              <strong>PDFs, CSVs, browser pages, admin tasks</strong>
            </div>
            <div>
              <span>Logic</span>
              <strong>OCR, APIs, rules, databases, AI guardrails</strong>
            </div>
            <div>
              <span>Output</span>
              <strong>Dashboards, reports, extensions, apps</strong>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="services">
        <SectionHeader
          eyebrow="Services"
          title="Software for the work clients actually need done."
          copy="Each service starts with a practical workflow problem, then connects to repositories that show the shape of the build."
        />

        <div className={styles.serviceGrid}>
          {SERVICES.map((service) => {
            const proofProjects = getProjects(service.proofProjectIds);

            return (
              <article className={styles.serviceCard} key={service.id}>
                <h3>{service.title}</h3>
                <div className={styles.cardCopy}>
                  <p>
                    <span>Problem:</span> {service.clientProblem}
                  </p>
                  <p>
                    <span>Build:</span> {service.buildSummary}
                  </p>
                </div>
                <ul className={styles.proofList} aria-label={`${service.title} proof projects`}>
                  {proofProjects.map((project) => (
                    <li key={project.id}>{project.name}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className={`${styles.section} ${styles.proofSection}`} id="proof">
        <SectionHeader
          eyebrow="Proof By Service"
          title="Real project snippets, grouped by the problem they prove."
          copy="A quick scan of what was built, what problem it addresses, and the repository behind it."
        />

        <div className={styles.proofGroups}>
          {SERVICES.map((service) => {
            const proofProjects = getProjects(service.proofProjectIds).slice(0, 3);

            return (
              <div className={styles.proofGroup} key={service.id}>
                <h3>{service.title}</h3>
                <div className={styles.snippetGrid}>
                  {proofProjects.map((project) => (
                    <article className={styles.snippetCard} key={project.id}>
                      <h4>{project.name}</h4>
                      <p>
                        <span>Problem:</span> {project.problem}
                      </p>
                      <p>
                        <span>Build:</span> {project.build}
                      </p>
                      <p>
                        <span>Proof:</span> {project.outcome}
                      </p>
                      <ProjectTags project={project} />
                      <a
                        className={styles.inlineLink}
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub repo
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.section} id="work">
        <SectionHeader
          eyebrow="Selected Work"
          title="A broader scan of client-readable builds."
          copy="These projects cover automation, AI/OCR workflows, full-stack apps, browser extensions, and mobile utilities."
        />

        <div className={styles.workGrid}>
          {featuredProjects.map((project) => (
            <article className={styles.workCard} key={project.id}>
              <div className={styles.workCardTop}>
                <p>{project.type}</p>
                <h3>{project.name}</h3>
              </div>
              <p>{project.summary}</p>
              <ul className={styles.serviceTags} aria-label={`${project.name} service tags`}>
                {project.serviceIds.map((serviceId) => (
                  <li key={serviceId}>{serviceLookup.get(serviceId)}</li>
                ))}
              </ul>
              <ProjectTags project={project} />
              <a
                className={styles.inlineLink}
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View repository
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.processSection}`} id="process">
        <SectionHeader
          eyebrow="Process"
          title="A simple path from messy workflow to usable software."
          copy="The work stays practical: understand the workflow, test the risky parts, ship the useful version, and leave a clear handoff."
        />

        <ol className={styles.processGrid}>
          {PROCESS_STEPS.map((step, index) => (
            <li className={styles.processStep} key={step.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section} id="about">
        <div className={styles.aboutLayout}>
          <div>
            <p className={styles.eyebrow}>About and Stack</p>
            <h2>Focused on practical builds, not resume filler.</h2>
            <div className={styles.aboutCopy}>
              {PROFILE.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className={styles.stackGrid}>
            {STACK_GROUPS.map((group) => (
              <article className={styles.stackGroup} key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.contactSection}`} id="contact">
        <div className={styles.contactBox}>
          <p className={styles.eyebrow}>Contact</p>
          <h2>{CONTACT.heading}</h2>
          <p>{CONTACT.copy}</p>
          <div className={styles.ctaRow} aria-label="Contact actions">
            <ExternalLink href={CONTACT.emailHref} variant="primary">
              Email Mohamed
            </ExternalLink>
            <ExternalLink href={CONTACT.githubUrl} variant="secondary">
              GitHub
            </ExternalLink>
          </div>
          <a className={styles.emailText} href={CONTACT.emailHref}>
            {CONTACT.email}
          </a>
        </div>
      </section>
    </>
  );
}
