import React from "react";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative w-screen bg-black text-white mt-10 overflow-hidden -mx-[calc(50vw-50%)]">
      {/* Full-width black background */}
      <div className="absolute inset-0 bg-black -z-10"></div>

      {/* Content container */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row md:justify-between md:items-start gap-10">
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-3">Sales Insights</h2>
          <p className="text-gray-300 text-sm leading-relaxed max-w-md">
            Transforming your spreadsheets into powerful visual insights.
            Discover sales trends, understand regions, and make confident
            business decisions with clarity.
          </p>
        </div>

        {/* Contact Section */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>📍 Bengaluru, India</li>
            <li>📞 +91 63629 90375</li>
            <li>✉️ surajtendulkar@gmail.com</li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3">Connect with me</h3>
          <div className="flex gap-5 text-2xl">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/suraj-tendulkar-336124154/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 transition-transform transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition-transform transform hover:scale-110"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/suraj.tendulkar/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition-transform transform hover:scale-110"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="w-full border-t border-gray-800 mt-6 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Sales Insights — All rights reserved.
      </div>
    </footer>
  );
}
