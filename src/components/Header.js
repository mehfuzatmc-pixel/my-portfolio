function Header() {
  const links = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#consultation', label: 'Fees' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <header className="site-header">
      <nav className="nav-bar" aria-label="Portfolio navigation">
        <a className="brand" href="#home" aria-label="Go to home">
          IdeaSite Studio
        </a>
        <div className="nav-links">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Header;
