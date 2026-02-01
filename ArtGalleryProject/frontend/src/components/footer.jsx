import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#674d33] text-white py-3">
      <div className="max-w-7xl mx-auto px-4 sm:flex sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-xl font-semibold tracking-wide">Art Fusion</h2>
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Art Fusion. All rights reserved.
          </p>
        </div>

        <div className="flex gap-6 text-sm">
          <a href="/about" className="hover:text-gray-200 transition">
            About Us
          </a>
          <a href="/terms" className="hover:text-gray-200 transition">
            Terms
          </a>
          <a href="/privacy" className="hover:text-gray-200 transition">
            Privacy
          </a>
          <a href="/contact" className="hover:text-gray-200 transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
