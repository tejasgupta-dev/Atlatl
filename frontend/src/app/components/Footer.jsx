"use client";

import Link from "next/link";
import "./Footer.css";
import { FaLink, FaLocationDot, FaPhone } from "react-icons/fa6";
import { FaRegEnvelope, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
        <div>  {/** Atlantl Advisors Information */}
            <h1>ATLANTL ADVISERS</h1>
            <ul className="footer-list">
                <li className="footer-list-item">
                    <FaLocationDot />
                    <div>2921 Landmark Pl, Suite 501 <br /> Madison, WI 53713</div>
                </li>
                <li className="footer-list-item">
                    <FaRegEnvelope />
                    <div>info@atlantladvisers.com</div>
                </li>
                <li className="footer-list-item">
                    <FaPhone />
                    <div>608-351-4500</div>
                </li>
            </ul>
        </div>

        <div>  {/** Quick Links */}
            <h1>QUICK LINKS</h1>
            <nav>
                <div className="footer-list">
                <Link href="/ ">Home</Link>
                <Link href="/">Why Atlatl</Link>
                <Link href="/">Our Services</Link>
                <Link href="/">Meet The Team</Link>
                <Link href="/">Client Experience</Link>
                <Link href="/">Contact Us</Link>
                <Link href="/">FAQ</Link>
                <Link href="/">Blog</Link>
                </div>
            </nav>
        </div>

        <div>  {/** More Information */}
            <h1>MORE INFORMATION</h1>
                        <nav>
                <div className="footer-list">
                <Link href="/ ">Privacy Policy</Link>
                <Link href="/">From ADV2A</Link>
                <Link href="/">From CRS</Link>
                </div>
            </nav>
        </div>

        <div> {/** Connect With Us */}
            <h1>CONNECT WITH US</h1>
            <div className="footer-list-item-2">
            <FaLinkedin />
            <FaInstagram />
            </div>
        </div>
    </footer>
  );
}
