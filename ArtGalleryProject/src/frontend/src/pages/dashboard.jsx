import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../axiosInstance";
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
const artNews = [
  {
    type: "Breaking News",
    title: "NFT Art Market Surges 300% in Q1 2024",
    detail:
      "Digital art and NFTs continue to dominate the contemporary art scene with unprecedented growth in sales and collector interest.",
    image:
      "https://d7hftxdivxxvm.cloudfront.net/?quality=80&resize_to=width&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2FpiVxgtRPE_r4QPWVcBqtGQ%252FSquares_Dan2%2B%25281%2529.JPG&width=1820",
    readMoreLink:
      "https://www.artsy.net/article/artsy-editorial-digital-art-fared-nft-boom",
    category: "Digital Art",
    icon: <FaPalette className="text-xl text-[#a17b5d]" />,
  },
  {
    type: "Exhibition Alert",
    title: "Van Gogh Immersive Experience Coming to Mumbai",
    detail:
      "The world-famous Van Gogh immersive exhibition will make its Indian debut at the National Museum of Modern Art.",
    image:
      "https://imgmediagumlet.lbb.in/media/2022/11/636ba9c5d775304d3669a5a6_1668000197625.jpg",
    readMoreLink:
      "https://lbb.in/mumbai/vincent-van-gogh-immersive-art-exhibit/",
    category: "Exhibition",
    icon: <FaCamera className="text-xl text-[#a17b5d]" />,
  },
  {
    type: "Artist Spotlight",
    title: "Amrita Sher-Gil's Lost Masterpiece Found",
    detail:
      "A previously unknown painting by the iconic Indian artist has been discovered in a private collection in Paris.",
    image:
      "https://media.cnn.com/api/v1/images/stellar/prod/210304083900-amrita-sher-gil-portrait-of-denyse.jpg?q=w_2000,c_fill/f_webp",
    readMoreLink:
      "https://edition.cnn.com/style/article/amrita-sher-gil-auction",
    category: "Heritage",
    icon: <FaUserAlt className="text-xl text-[#a17b5d]" />,
  },
];
const newsItems = [
  {
    title: "Record-Breaking Sale: Monet’s Water Lilies",
    description:
      "Claude Monet’s 'Nymphéas' sold for a staggering $110 million, setting a new record in the modern art category.",
    price: "$110M",
    date: "2 JUL 2025",
    seller: "Sotheby’s London",
    image:
      "https://images.unsplash.com/photo-1578301977886-43be7b983104?w=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Basquiat’s ‘Skull’ Dominates New York Auction",
    description:
      "Jean-Michel Basquiat's iconic piece sold for $93 million during Christie’s spring evening sale.",
    price: "$93M",
    date: "28 JUN 2025",
    seller: "Christie’s NY",
    image:
      "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Da Vinci Sketch Draws Global Bids",
    description:
      "A rare Leonardo da Vinci sketch attracted over 30 international bids, closing at $65 million.",
    price: "$65M",
    date: "26 JUN 2025",
    seller: "Private Auction",
    image:
      "https://images.unsplash.com/photo-1578926078693-4eb3d4499e43?w=500&auto=format&fit=crop&q=60",
  },
];

const Dashboard = () => {
  const handleReadMore = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const [index, setIndex] = useState(0);
  const [paintings, setPaintings] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Fetch paintings from backend API with pagination
  const fetchPaintings = async (page = 0) => {
    try {
      const res = await axiosInstance.get(`/auctions?pageNo=${page}`);
      const data = res.data.content || res.data;
      setPaintings(data);

      // Check if next page has paintings
      const nextRes = await axiosInstance.get(`/auctions?pageNo=${page + 1}`);
      const nextData = nextRes.data.content || nextRes.data;
      setHasNextPage(Array.isArray(nextData) ? nextData.length > 0 : false);

      // Use first 3 unsold paintings for carousel
      const unsold = data.filter((p) => !p.isSold);
      setCarouselItems(unsold.slice(0, 3));
    } catch (err) {
      setPaintings([]);
      setHasNextPage(false);
    }
  };

  useEffect(() => {
    fetchPaintings();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) =>
        carouselItems.length > 0 ? (prev + 1) % carouselItems.length : 0
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselItems]);

  // const SlideCard = ({ data }) => (
  //   <div className="flex flex-col md:flex-row w-full font-serif md:h-[890px] h-screen ">
  //     <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-[#f8f5f0]">
  //       <div className="text-xs uppercase text-gray-600 mb-2">
  //         Auction Series
  //       </div>
  //       <h1 className="text-3xl md:text-5xl font-serif mb-4">{data.title}</h1>
  //       <p className="text-base md:text-lg text-gray-700 md:mb-6">
  //         {data.description || "Art at its finest"}
  //       </p>

  //       <div className="flex md:mt-10 mt-5 gap-2">
  //         {carouselItems.map((_, i) => (
  //           <div
  //             key={i}
  //             className={`w-2 h-2 rounded-full transition-all ${
  //               i === index ? "bg-black" : "bg-gray-400"
  //             }`}
  //           ></div>
  //         ))}
  //       </div>
  //     </div>

  //     <div className="w-full md:w-1/2 h-64 md:h-full">
  //       <img
  //         src={`http://localhost:8085${data.imageUrl}`}
  //         alt={data.title}
  //         className="w-full h-full object-cover"
  //       />
  //     </div>
  //   </div>
  // );

  const SlideCard = ({ data, index, carouselItems = [] }) => {
    return (
      <div className="flex flex-col md:flex-row w-full font-serif h-[890px]">
        {/* Text Section for Desktop */}
        <div className="hidden md:flex w-1/2 pt-10 px-10 flex-col justify-center bg-[#f8f5f0]">
          <div className="text-xs uppercase text-gray-600 mb-2">
            Auction Series
          </div>
          <h1 className="text-5xl font-serif mb-4">{data.title}</h1>
          <p className="text-lg text-gray-700 mb-6">
            {data.description || "Art at its finest"}
          </p>

          <div className="flex mt-10 gap-2">
            {Array.isArray(carouselItems) &&
              carouselItems.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === index ? "bg-black" : "bg-gray-400"
                  }`}
                ></div>
              ))}
          </div>
        </div>
        {/* Image Section */}
        <div className="relative w-full md:w-1/2 h-[890px] md:h-auto">
          <img
            src={`http://localhost:8085${data.imageUrl}`}
            alt={data.title}
            className="w-full h-full object-cover"
          />

          {/* Text Overlay for Mobile */}
          <div className="absolute inset-0 backdrop-blur-xs bg-opacity-70 flex flex-col justify-center items-start px-6 text-black md:hidden">
            <div className="text-xs uppercase mb-1">Auction Series</div>
            <h1 className="text-3xl font-serif mb-2">{data.title}</h1>
            <p className="text-sm">{data.description || "Art at its finest"}</p>
          </div>
        </div>
      </div>
    );
  };

  console.log(paintings);
  console.log(typeof paintings);

  const upcomingAuctions = paintings.filter((p) => !p.isSold);

  return (
    <>
      {/* 🔹 Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative h-[890px] w-full overflow-hidden font-serif">
          <div className="absolute inset-0">
            <AnimatePresence initial={false} mode="wait">
              {carouselItems.map((item, i) =>
                i === index ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-full h-full z-20"
                  >
                    <SlideCard data={item} />
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* 🔹 Upcoming Auctions */}
      <div className="py-16 px-10 font-serif">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-serif text-[#6b4c35]">
            Upcoming auctions
          </h2>
          <Link to="/auctions" className="ml-4 text-sm font-medium underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {upcomingAuctions.length > 0 ? (
            upcomingAuctions.map((auction, i) => (
              <div
                key={i}
                className="flex hover:scale-105 bg-[#f8f5f0] duration-500 hover:shadow-2xl hover:shadow-black rounded-2xl cursor-pointer gap-4"
              >
                <img
                  src={`http://localhost:8085${auction.imageUrl}`}
                  alt={auction.title}
                  className="w-32 h-32 object-cover rounded-l-2xl"
                />
                <div className="mt-4">
                  <p className="text-xs text-gray-500 uppercase">
                    {auction.date || "Upcoming"} | Auction
                  </p>
                  <h3 className="text-lg font-medium hover:text-gray-700">
                    {auction.title}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    📍 {auction.location || "Online"}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Click on{" "}
                    <Link
                      to="/auctions"
                      className=" text-sm text-blue-800 font-medium "
                    >
                      View All
                    </Link>{" "}
                    to see more details
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No upcoming auctions found.
            </p>
          )}
        </div>
      </div>

      {/* 🔹 Auction News */}
      {/* <div className="px-10 py-16 font-serif">
        <h2 className="text-4xl font-serif mb-10">Auction News & Highlights</h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
          {newsItems.map((item, i) => (
            <div
              key={i}
              className="shadow-2xl rounded overflow-hidden bg-[#f8f5f0] duration-400 hover:shadow-2xl hover:shadow-black cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-80 w-full object-cover"
              />
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">
                  {item.date} | {item.seller}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                <div className="text-sm font-bold text-black">
                  Final Bid: {item.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16 mx-10 "
      >
        <h2 className="text-4xl font-serif text-[#6b4c35] mb-8 text-center">
          Auction News & Highlights
        </h2>

        {/* Trending News Grid */}
        <div className="grid grid-cols-1 font-serif md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {artNews.map((news, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="shadow-2xl rounded overflow-hidden bg-[#f8f5f0] duration-400 hover:shadow-2xl hover:shadow-black cursor-pointer"
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
      </motion.div>
    </>
  );
};

export default Dashboard;
