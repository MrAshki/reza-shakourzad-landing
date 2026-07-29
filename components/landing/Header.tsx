"use client";

import { ArrowUpLeft, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  { label: "خانه", href: "#home" },
  { label: "مسیرها", href: "#learning-paths" },
  { label: "درباره من", href: "#about" },
  { label: "منابع", href: "#resources" },
  { label: "تماس با من", href: "#contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 24);
      setIsHidden(y > 120 && !isOpen);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={`site-header ${isScrolled ? "site-header--scrolled" : ""} ${isHidden ? "site-header--hidden" : ""}`}
    >
      <a className="skip-link" href="#main-content">
        پرش به محتوای اصلی
      </a>

      <div className="site-shell header-inner">
        <a className="header-cta focus-ring" href="#learning-paths">
          به اشتراک می‌گذارم
          <ArrowUpLeft size={16} strokeWidth={1.65} aria-hidden="true" />
        </a>

        <nav className="desktop-nav" aria-label="ناوبری اصلی">
          {navigation.map((item) => (
            <a className="nav-link focus-ring" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a
          className="brand focus-ring"
          href="#home"
          aria-label="رضا شکورزاد، صفحه اصلی"
        >
          <span>رضا شکورزاد</span>
          <span className="brand-mark" aria-hidden="true" />
        </a>

        <button
          className="menu-toggle focus-ring"
          type="button"
          aria-label={isOpen ? "بستن منوی اصلی" : "باز کردن منوی اصلی"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={`mobile-nav-wrap ${isOpen ? "mobile-nav-wrap--open" : ""}`}
        id="mobile-navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <nav className="mobile-nav site-shell" aria-label="ناوبری موبایل">
          {navigation.map((item) => (
            <a
              className="nav-link focus-ring"
              href={item.href}
              key={item.href}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
          <a
            className="header-cta focus-ring"
            href="#learning-paths"
            onClick={closeMenu}
          >
            به اشتراک می‌گذارم
            <ArrowUpLeft size={16} strokeWidth={1.65} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}
