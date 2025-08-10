import React from "react";
import { motion } from "framer-motion";
import {
  FaUserAlt,
  FaFireAlt,
  FaRegLightbulb,
  FaGavel,
  FaNewspaper,
  FaExternalLinkAlt,
  FaGlobe,
  FaPalette,
  FaCamera,
  FaVideo,
} from "react-icons/fa";

const trends = [
  {
    title: "Trending Now",
    description: "Abstract Expressionism is gaining popularity worldwide.",
    icon: <FaFireAlt className="text-3xl text-[#a17b5d]" />,
  },
  {
    title: "Featured Artist",
    description: "Meet Arjun Patel, redefining Indian contemporary art.",
    icon: <FaUserAlt className="text-3xl text-[#a17b5d]" />,
  },
  {
    title: "Creative Inspiration",
    description: "Nature, emotion & heritage are ruling artist palettes.",
    icon: <FaRegLightbulb className="text-3xl text-[#a17b5d]" />,
  },
];

const artNews = [
  {
    type: "Market Update",
    title: "Contemporary Indian Art Sales Hit Record High",
    detail:
      "Auction houses report 45% increase in sales of contemporary Indian artworks, signaling growing global interest.",
    image:
      "https://auroraathena.com/app/uploads/2024/10/Kumar-Front-without-frame-1449x2048.jpg  ",
    readMoreLink:
      "https://auroraathena.com/journal/trends/indian-art-market-2024/",
    category: "Market",
    icon: <FaGavel className="text-xl text-[#a17b5d]" />,
  },
  {
    type: "Technology",
    title: "AI-Generated Art Wins Prestigious Award",
    detail:
      "An AI-created artwork has won the Digital Art Innovation Award, sparking debate about creativity and technology.",
    image:
      "https://media.cnn.com/api/v1/images/stellar/prod/220902164241-02-thtre-dopra-spatial-ai-generated-art.jpg?q=w_1160,c_fill/f_webp",
    readMoreLink:
      "https://edition.cnn.com/2022/09/03/tech/ai-art-fair-winner-controversy",
    category: "Technology",
    icon: <FaVideo className="text-xl text-[#a17b5d]" />,
  },
  {
    type: "Conservation",
    title: "Ancient Cave Paintings Discovered in Western Ghats",
    detail:
      "Archaeologists have uncovered 10,000-year-old cave paintings in the Western Ghats, revealing India's rich artistic heritage.",
    image:
      "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202506/ancient-cave-paintings-232723832-16x9_0.jpeg?VersionId=S1KauCBSCZ7XQE2jDv7dv.Tjjhfo2nDd&size=690:388",
    readMoreLink:
      "https://www.indiatoday.in/science/story/ancient-cave-paintings-discovered-in-tamil-nadu-could-be-over-9000-years-old-2744969-2025-06-23",
    category: "Archaeology",
    icon: <FaGlobe className="text-xl text-[#a17b5d]" />,
  },
];

const highlights = [
  {
    type: "Trending Artist",
    title: "Ishika Rana",
    detail: "Known for surreal watercolors reflecting Indian mythology.",
    icon: <FaUserAlt className="text-xl text-[#a17b5d]" />,
    onclick: () => {
      window.open(
        "https://www.instagram.com/anchor_ishikarana/?hl=en",
        "_blank"
      );
    },
    image:
      "https://images.unsplash.com/photo-1680506660555-1c225f5da953?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8SXNoaWthJTIwUmFuYXxlbnwwfHwwfHx8MA%3D%3Dg",
  },
  {
    type: "Gallery Opening",
    title: "Tate Modern Mumbai",
    detail:
      "First international branch of Tate Modern opening in Mumbai's art district.",
    icon: <FaCamera className="text-xl text-[#a17b5d]" />,
    onclick: () => {
      window.open("https://www.tate.org.uk/visit/tate-modern", "_blank");
    },
    image:
      "https://media.tate.org.uk/aztate-prd-ew-dg-wgtail-st1-ctr-data/images/tate_modern_1jpg.width-2560.jpg",
  },
  {
    type: "Art Award",
    title: "Young Artist of the Year 2025",
    detail:
      "Neha Patel wins prestigious award for her innovative textile art installations.",
    icon: <FaPalette className="text-xl text-[#a17b5d]" />,
    onclick: () => {
      window.open(
        "https://www.artsy.net/show/artspace-warehouse-emerging-artists-to-watch-in-2025-top-trends-and-must-have-affordable-original-black-white-and-green-art-paintings-for-collectors",
        "_blank"
      );
    },
    image:
      "https://d7hftxdivxxvm.cloudfront.net/?height=1798&quality=85&resize_to=fit&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2Fv-KSTiYrF9CVJbtXZgwNkg%2Fnormalized.jpg&width=1798",
  },
];

const Discover = () => {
  const handleReadMore = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className=" w-auto h-auto px-6 py-12 font-serif">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center text-[#5a3c28] mb-12"
      >
        Discover Art & Trends
      </motion.h1>

      {/* Discover Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {trends.map((trend, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl hover:shadow-orange-950 cursor-pointer transition"
          >
            <div className="mb-4">{trend.icon}</div>
            <h2 className="text-xl font-bold text-[#6b4c35] mb-2">
              {trend.title}
            </h2>
            <p className="text-sm text-gray-700">{trend.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Enhanced What's Hot in the Art World Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16 max-w-7xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-[#6b4c35] mb-8 text-center">
          What's Hot in the Art World
        </h2>

        {/* Trending News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {artNews.map((news, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="bg-white rounded-2xl hover:shadow-2xl hover:shadow-orange-950 overflow-hidden shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-[#a17b5d] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {news.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  {news.icon}
                  <span className="font-medium">{news.type}</span>
                </div>
                <h3 className="font-bold text-[#5a3c28] text-xl mb-3 leading-tight">
                  {news.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {news.detail}
                </p>
                <button
                  onClick={() => handleReadMore(news.readMoreLink)}
                  className="flex items-center gap-2 text-[#a17b5d] hover:text-[#8b6b4d] cursor-pointer font-semibold text-sm transition-colors duration-200"
                >
                  <span>Read More</span>
                  <FaExternalLinkAlt className="text-xs" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Original Highlights Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-[#6b4c35] mb-6 text-center">
            Featured Highlights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className="bg-white rounded-2xl hover:shadow-2xl hover:shadow-orange-950 cursor-pointer overflow-hidden shadow-md transition-all duration-300 transform hover:scale-105"
                onClick={item.onclick}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    {item.icon}
                    <span>{item.type}</span>
                  </div>
                  <h3 className="font-bold text-[#5a3c28] text-lg mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Discover;
