import Image from 'next/image';
import professionalWebsiteHero from '../assets/professional-website-hero.png';

function About() {
  const skills = ['Landing Pages', 'Portfolio Sites', 'Responsive UI', 'Next.js', 'Brand Direction', 'Professional Launch'];

  return (
    <section className="section about" id="about">
      <div className="section-heading">
        <p className="eyebrow">Process</p>
        <h2>Simple ideas become clear, modern web experiences.</h2>
      </div>
      <div className="about-grid">
        <div className="about-copy">
          <p>
            I turn rough notes, references, and goals into a focused website
            structure with strong visuals, clear sections, and a smooth path for
            visitors to take action.
          </p>
          <p>
            Every build is shaped around your message, then refined for mobile,
            desktop, speed, and the kind of first impression your project needs.
          </p>
        </div>
        <div className="about-image-wrap">
          <Image
            className="about-image"
            src={professionalWebsiteHero}
            alt="Website design process from sketch to responsive screens"
            fill
            sizes="(max-width: 820px) 100vw, 54vw"
          />
        </div>
        <div className="skill-list" aria-label="Skills">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
