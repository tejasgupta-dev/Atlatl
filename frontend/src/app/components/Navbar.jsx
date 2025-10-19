"use client";

import Link from "next/link";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo with Link to Home */}
      <div className="navbar-logo">
        <Link href="/">
          <img src="/logo.png" alt="Logo" />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <Link href="/about-us">ABOUT US</Link>
        <Link href="/services">SERVICES</Link>
        <Link href="/resources">RESOURCES</Link>
        <Link href="/contact-us">CONTACT US</Link>
        <Link href="/log-in" className="login-button">LOG IN</Link>
      </div>
    </nav>
  );
}
