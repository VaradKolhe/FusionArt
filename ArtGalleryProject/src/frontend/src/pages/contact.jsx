import React from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaComments,
} from "react-icons/fa";

const Contact = () => (
  <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden ">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative z-20 max-w-4xl mx-10 md:mx-auto bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-[#674d33]/20 p-10 mt-24 mb-24 text-gray-800"
    >
      <h1 className="text-4xl font-serif font-bold mb-4 text-[#674d33] flex items-center gap-3 drop-shadow-lg">
        <FaComments className="text-[#674d33] text-3xl" /> Contact Us
      </h1>
      <p className="mb-4">
        We'd love to hear from you! Reach out with any questions, feedback, or
        partnership inquiries.
      </p>
      <div className="mb-4 flex items-center gap-3">
        <FaEnvelope className="text-[#674d33] text-xl" />
        <div>
          <div className="font-semibold">Email:</div>
          <a
            href="mailto:fusionart0101@gmail.com"
            className="text-[#674d33] underline"
          >
            fusionart0101@gmail.com
          </a>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-3">
        <FaPhoneAlt className="text-[#674d33] text-xl" />
        <div>
          <div className="font-semibold">Phone:</div>
          <span className="text-[#674d33]">+91 9175955466</span>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-3">
        <FaMapMarkerAlt className="text-[#674d33] text-xl" />
        <div>
          <div className="font-semibold">Address:</div>
          <span className="text-[#674d33]">
            123 Art Lane, Creativity City, 45678
          </span>
        </div>
      </div>
      <p className="text-md text-gray-600 border-t pt-4">
        Or use the contact form on our website for a quick response.
      </p>
    </motion.div>
  </div>
);

export default Contact;
