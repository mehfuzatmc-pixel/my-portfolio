import About from '../components/About';
import ConsultationFees from '../components/ConsultationFees';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Projects from '../components/Projects';

export default function Home() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <ConsultationFees />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
