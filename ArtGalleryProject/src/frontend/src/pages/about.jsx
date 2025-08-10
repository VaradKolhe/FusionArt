import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaPalette,
  FaGlobe,
  FaUsers,
  FaStar,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const WaveDivider = () => (
  <svg
    className="absolute bottom-0 left-0 w-full h-24 z-10"
    viewBox="0 0 1440 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#674d33"
      fillOpacity="1"
      d="M0,224L48,213.3C96,203,192,181,288,192C384,203,480,245,576,240C672,235,768,181,864,176C960,171,1056,213,1152,229.3C1248,245,1344,235,1392,229.3L1440,224L1440,320L0,320Z"
    ></path>
  </svg>
);

const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="border border-[#674d33]/20 rounded-xl shadow-md backdrop-blur-sm"
  >
    <button
      onClick={onToggle}
      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-[#674d33]/10 transition"
    >
      <span className="font-medium text-[#674d33] text-base sm:text-lg">
        {question}
      </span>
      {isOpen ? (
        <FaChevronUp className="text-[#674d33]" />
      ) : (
        <FaChevronDown className="text-[#674d33]" />
      )}
    </button>
    <motion.div
      initial={false}
      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden"
    >
      <div className="px-4 pb-3 text-sm text-gray-700 leading-relaxed">
        {answer}
      </div>
    </motion.div>
  </motion.div>
);

const About = () => {
  const [openItems, setOpenItems] = useState(new Set([0]));

  const toggleItem = (index) => {
    const updated = new Set(openItems);
    updated.has(index) ? updated.delete(index) : updated.add(index);
    setOpenItems(updated);
  };

  const faqData = [
    {
      question: "How do I create an account?",
      answer:
        "Go to the signup page, enter your details, and verify your email. It's a simple process that takes just a few minutes to get started with Art Fusion.",
    },
    {
      question: "What categories of art do you have?",
      answer:
        "We offer portraits, landscapes, abstract, modern, and traditional art...",
    },
    {
      question: "How do I bid for a painting?",
      answer:
        "Click the painting, enter your bid amount, and submit. Our progressive bidding system ensures fair competition.",
    },
    {
      question: "What happens if I win a bid?",
      answer:
        "You'll receive a confirmation, and the painting will be added to your purchases.",
    },
    {
      question: "How do I add money to my wallet?",
      answer:
        "Go to Wallet > Add Funds and choose a payment method. We accept credit/debit cards, UPI, and net banking.",
    },
    {
      question: "Can I filter paintings by artist or price?",
      answer:
        "Yes, use our advanced search and filter options to find exactly what you're looking for.",
    },
    {
      question: "How do I know if a painting is original?",
      answer:
        'Verified paintings have a "Verified" tag and come with authenticity proof.',
    },
    {
      question: "Where can I see my previous purchases?",
      answer:
        'Visit your profile and check the "Purchase History" tab. You can download receipts too.',
    },
    {
      question: "How do I upload my painting?",
      answer:
        "Go to the Upload page, fill the form, and submit the painting image.",
    },
    {
      question: "What does 'Verified' painting mean?",
      answer:
        "It means our admin has approved and verified the artwork for authenticity.",
    },
  ];

  return (
    <div className="relative  min-h-screen overflow-hidden px-4 sm:px-8 py-20 flex flex-col items-center">
   

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-7xl rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-[#674d33]/20 p-6 sm:p-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* About Section */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#674d33] mb-4 flex items-center gap-3">
              <FaPalette className="text-3xl sm:text-4xl" /> About Art Fusion
            </h1>
            <p className="text-base sm:text-lg mb-6 text-gray-700">
              Art Fusion is a premier online art gallery and auction platform,
              connecting artists, collectors, and enthusiasts from around the
              world...
            </p>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-[#674d33] flex items-center gap-2">
                  <FaGlobe /> Our Vision
                </h2>
                <p className="text-gray-700 text-sm sm:text-base">
                  We believe in the transformative power of art. By bridging the
                  gap between artists and audiences, we aim to inspire and
                  enrich lives...
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-[#674d33] flex items-center gap-2">
                  <FaUsers /> What We Offer
                </h2>
                <ul className="list-disc pl-5 text-gray-700 text-sm sm:text-base">
                  <li>Curated online auctions</li>
                  <li>Secure and transparent bidding</li>
                  <li>Personalized art discovery</li>
                  <li>Global artist showcase support</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600 mt-6 border-t pt-4">
              <FaStar className="text-yellow-500" /> Join us in celebrating the
              world of art, one masterpiece at a time.
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-[#674d33] mb-4 flex items-center gap-3">
              FAQs
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Find answers to your questions. Need help? Contact support!
            </p>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {faqData.map((item, idx) => (
                <FAQItem
                  key={idx}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openItems.has(idx)}
                  onToggle={() => toggleItem(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default About;
