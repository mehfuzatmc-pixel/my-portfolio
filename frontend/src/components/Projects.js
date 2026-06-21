import Image from 'next/image';
import professionalWebsiteHero from '../assets/professional-website-hero.png';

const projects = [
  {
    title: 'Landing Page',
    description: 'A focused one-page website that explains your offer and guides visitors to contact you.',
    image: professionalWebsiteHero,
    tag: 'Launch',
  },
  {
    title: 'Portfolio Website',
    description: 'A clean personal site for showcasing work, skills, services, and credibility.',
    image: professionalWebsiteHero,
    tag: 'Showcase',
  },
  {
    title: 'Business Website',
    description: 'A polished web presence with service sections, trust signals, and a contact flow.',
    image: professionalWebsiteHero,
    tag: 'Growth',
  },
];

function Projects() {
  return (
    <section className="section projects" id="projects">
      <div className="section-heading">
        <p className="eyebrow">Websites</p>
        <h2>What your idea can become</h2>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.title}>
            <div className="project-image-wrap">
              <Image
                className="project-image"
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 820px) 100vw, 33vw"
              />
            </div>
            <span className="project-tag">{project.tag}</span>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Projects;
