import Image from 'next/image';
import professionalWebsiteHero from '../assets/professional-website-hero.png';

function Hero() {
  return (
    <section className="hero section" id="home">
      <div className="hero-content">
        <p className="eyebrow">Web Design & Development</p>
        <h1>I will turn your ideas into websites.</h1>
        <p className="hero-copy">
          Bring the concept, sketch, or business goal. I will shape it into a
          responsive, polished website that looks sharp and works smoothly.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#projects">
            See What I Build
          </a>
          <a className="button secondary" href="#contact">
            Start a Website
          </a>
        </div>
      </div>
      <div className="hero-visual">
        <Image
          className="hero-image"
          src={professionalWebsiteHero}
          alt="Wireframes transforming into a responsive website on laptop, tablet, and phone"
          fill
          priority
          sizes="(max-width: 820px) 100vw, 52vw"
        />
        <div className="hero-badge">
          <span>From idea to launch</span>
          <strong>Clean design, responsive build, ready to share</strong>
        </div>
      </div>
    </section>
  );
}

export default Hero;
