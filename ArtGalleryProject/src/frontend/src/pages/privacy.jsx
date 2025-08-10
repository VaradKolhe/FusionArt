import React from "react";
import { motion } from "framer-motion";
import {
  FaLock,
  FaUserSecret,
  FaCookieBite,
  FaEnvelopeOpenText,
} from "react-icons/fa";

const Privacy = () => (
  <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden ">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative z-20 max-w-4xl mx-10 md:mx-auto bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-[#674d33]/20 p-10 mt-24 mb-24 text-gray-800"
    >
      <h1 className="text-4xl font-serif font-bold mb-4 text-[#674d33] flex items-center gap-3 drop-shadow-lg">
        <FaLock className="text-[#674d33] text-3xl" /> Privacy Policy
      </h1>
      <p className="mb-4">
        Your privacy is important to us. This policy explains how Art Fusion
        collects, uses, and protects your information:
      </p>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li className="flex items-center gap-2">
          <FaUserSecret className="text-[#674d33]" /> We collect personal
          information only for account creation, transactions, and platform
          improvement.
        </li>
        <li className="flex items-center gap-2">
          <FaLock className="text-[#674d33]" /> Your data is stored securely and
          is never sold to third parties.
        </li>
        <li className="flex items-center gap-2">
          <FaCookieBite className="text-[#674d33]" /> Cookies are used to
          enhance your browsing experience and for analytics.
        </li>
        <li className="flex items-center gap-2">
          <FaEnvelopeOpenText className="text-[#674d33]" /> You may request
          deletion or correction of your personal data at any time.
        </li>
        <li className="flex items-center gap-2">
          <FaLock className="text-[#674d33]" /> We implement industry-standard
          security measures to protect your information.
        </li>
      </ul>
      <p className="text-md text-gray-600 border-t pt-4">
        For questions or concerns about your privacy, please contact us at{" "}
        <a
          href="mailto:varad4422@gmail.com"
          className="text-[#674d33] underline"
        >
          fusionart0101@gmail.com
        </a>
        .
      </p>
    </motion.div>
  </div>
);

export default Privacy;
