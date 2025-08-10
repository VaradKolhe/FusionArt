import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Timer from "../utils/Timer";
import { BsInfoCircle } from "react-icons/bs";

import {
  FaRulerCombined,
  FaUserCircle,
  FaInfoCircle,
  FaTag,
  FaGavel,
  FaUserCheck,
} from "react-icons/fa";

const BiddingFrontend = () => {
  const { paintingId } = useParams();
  const [painting, setPainting] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupAmount, setPopupAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  // This state is now controlled by the Timer component via a prop
  const [auctionLive, setAuctionLive] = useState(false);

  // Fetch painting details
  useEffect(() => {
    axiosInstance
      .get(`/auctions/${paintingId}`)
      .then((res) => setPainting(res.data))
      .catch(() => setPainting(null));
  }, [paintingId]);

  // Fetch bids
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axiosInstance.get(`/auctions/bid/${paintingId}`);
        setBids(res.data);
      } catch {
        setBids([]);
      }
    };
    fetchBids();
  }, [paintingId]);

  // Place bid
  const handleBid = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axiosInstance.post(`/auctions/bid/${paintingId}`, {
        bidAmount: parseFloat(bidAmount),
      });
      // Set state to show the popup
      setPopupAmount(parseFloat(bidAmount));
      setShowPopup(true);
      setBidAmount("");
      // Refetch bids to show the new top bid
      const res = await axiosInstance.get(`/auctions/bid/${paintingId}`);
      setBids(res.data);
    } catch (err) {
      setError(err?.response?.data || "Failed to place bid.");
    }
  };

  // Popup component that automatically closes
  const BidSuccessPopup = ({ amount, onClose }) => {
    useEffect(() => {
      const timerId = setTimeout(() => {
        onClose();
      }, 3000); // Popup will disappear after 3 seconds

      return () => clearTimeout(timerId);
    }, [onClose]);

    return (
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20, transition: { duration: 0.4 } }}
        className="fixed inset-0 text-4xl text-[#3e2e1e] font-serif flex items-center justify-center z-50 backdrop-blur-2xl cursor-pointer"
      >
        ✅ You have placed a bid successfully for ₹{amount}.
      </motion.div>
    );
  };

  return (
    <div className="font-serif">
      <div className="px-4 pt-6 pb-10 grid grid-cols-1 lg:flex gap-8">
        {/* Painting Section */}
        <section className="bg-white  rounded-2xl shadow-xl w-full p-6 flex-1 flex flex-col md:w-1/3 mx-auto transition-all duration-500">
          {painting ? (
            <>
              <h1 className="text-4xl font-extrabold text-center text-[#3e2e1e] mb-6 tracking-tight">
                {painting.title}
              </h1>
              <div className="relative overflow-hidden h-1/2 rounded-t-2xl group">
                <img
                  src={`http://localhost:8085${painting.imageUrl}`}
                  alt={painting.title}
                  className="w-full h-80 object-cover  cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  onClick={() =>
                    setFullscreenImage(
                      `http://localhost:8085${painting.imageUrl}`
                    )
                  }
                />

                {/* Hover message */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-[#6b4c35]/50 text-white text-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                  Click to view image
                </div>
              </div>

              <div className="mb-1 p-3 bg-[#f5f2f0] rounded-xl shadow-md">
                {/* Description */}
                <div className="mb-4">
                  <h3 className="flex items-center text-[#3e2e1e] text-lg font-semibold mb-2">
                    <FaInfoCircle className="mr-2" /> Description
                  </h3>
                  <p className="text-[#5a3c28] text-sm">
                    {painting.description}
                  </p>
                </div>

                {/* Dimensions & Seller Info */}
                <div className="grid grid-cols-2 gap-4 text-sm text-[#5a3c28] mb-4">
                  <div className="flex items-center gap-2">
                    <FaRulerCombined />{" "}
                    <span>
                      <b>Length:</b> {painting.length} cm
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRulerCombined />{" "}
                    <span>
                      <b>Breadth:</b> {painting.breadth} cm
                    </span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <FaUserCircle />{" "}
                    <span>
                      <b>Seller:</b>{" "}
                      <span className="text-[#6b4c35]">{painting.seller}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    {painting.is_sold ? (
                      <>
                        <FaUserCheck />
                        <span>
                          <b>Buyer ID:</b> {painting.buyer_id ?? "N/A"}
                        </span>
                      </>
                    ) : (
                      <>
                        <FaGavel />
                        <span>
                          <b>Status:</b> Available For Bidding
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="bg-[#ebddd1] rounded-lg p-3 shadow-inner text-sm text-[#3e2e1e]">
                  <h3 className="flex items-center text-lg font-semibold mb-3">
                    <FaTag className="mr-2" /> Pricing
                  </h3>
                  <div className="flex flex-col gap-1 text-base font-semibold">
                    <span className="text-[#483424]">
                      Starting Price: ₹{painting.startingPrice}
                    </span>
                    <span className="text-[#c2804d]">
                      Current Price: ₹
                      {bids.length > 0
                        ? bids[0].bid
                        : painting.final_price > 0
                        ? painting.final_price
                        : painting.starting_price}
                    </span>
                    {painting.final_price > 0 && (
                      <span className="text-purple-700">
                        Final Price: ₹{painting.final_price}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* The self-contained Timer component is rendered here */}
              <Timer setAuctionLive={setAuctionLive} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 animate-pulse">
              <svg
                className="w-12 h-12 mb-4 text-[#c2804d] animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Loading painting details...
            </div>
          )}
        </section>

        {/* Bidding Section */}
        <section className="bg-white rounded-2xl shadow-xl p-6 w-full transition md:w-2/3 ">
          <div className="mt-6 h-1/2">
            <h4 className="text-xl font-bold mb-4 text-[#5a3c28] tracking-wide flex items-center gap-2">
              <span className="inline-block rounded-full px-3 py-1 text-yellow-800 text-base font-semibold shadow-sm">
                Top 3 Bidders
              </span>
            </h4>
            <ul className="space-y-4">
              {bids.length === 0 ? (
                <li className="text-gray-500 italic bg-gray-50 rounded-lg px-4 py-3 shadow-sm">
                  Be a First to bid on this painting!
                </li>
              ) : (
                bids.slice(0, 3).map((bidder, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-[#fefaf6] border border-[#e7d5c0] rounded-xl px-5 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-[#bfa16a]">
                        {bidder.rank}
                      </span>
                      <div className="bg-[#6b4c35] border-2 border-[#6b4c35] rounded-full w-12 h-12 flex items-center justify-center font-bold text-2xl text-white shadow">
                        {bidder.name?.charAt(0).toUpperCase() || "A"}
                      </div>
                      <span className="font-semibold text-[#6b4c35] text-lg tracking-wide">
                        {bidder.name || "Anonymous"}
                      </span>
                    </div>
                    <span className="font-bold text-[#6b4c35] text-xl bg-[#eeae7d] px-4 py-2 rounded-lg shadow">
                      ₹{bidder.bid}
                    </span>
                  </li>
                ))
              )}
            </ul>
            <h3 className="text-2xl font-extrabold text-[#3e2e1e] mb-6 mt-10 tracking-wide">
              Place Your Bid
            </h3>
            <form
              onSubmit={handleBid}
              className="flex flex-col w-full sm:flex-row gap-4 mb-6"
            >
              <div className="relative ">
                <input
                  id="bidAmount"
                  type="number"
                  min="1"
                  disabled={!auctionLive}
                  value={bidAmount}
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter your bid (₹)"
                  className="flex-1 md:w-[750px] w-full px-5 py-3 border border-[#e7d5c0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b4c35] transition-all bg-[#fefaf6] text-[#3e2e1e] font-medium text-lg shadow"
                  required
                />

                {showTooltip && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-[#fffaf4] border border-[#e7d5c0] text-[#3e2e1e] text-sm rounded-lg shadow-md p-3 z-10 opacity-100 scale-100 transition-all duration-200 ease-out">
                    <div className="flex items-center gap-2">
                      <BsInfoCircle className="text-[#6b4c35]" />
                      <span>
                        Your bid should be greater than the current price.
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <motion.button
                type="submit"
                disabled={!auctionLive}
                whileTap={{ scale: 0.95 }}
                className={`group relative overflow-hidden md:w-48 w-full px-8 py-3 md:h-14 h-10 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${
                  auctionLive
                    ? "bg-gradient-to-r from-[#efb181] to-[#ee9b5c] hover:from-[#eb9b5e] hover:to-[#f27616] cursor-pointer text-orange-950"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
              >
                {/* Original Text (slide out) */}
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
                    auctionLive ? "group-hover:-translate-x-full" : ""
                  }`}
                >
                  Place Bid
                </span>

                {/* Hover Text (slide in) */}
                {auctionLive && (
                  <span className="absolute inset-0 flex items-center justify-center translate-x-full group-hover:translate-x-0 transition-transform duration-300">
                    Let's Go
                  </span>
                )}
              </motion.button>
            </form>
            {message &&
              !showPopup && ( // Hide text message when popup is visible
                <div className="text-green-700 font-semibold text-center mb-4 transition duration-300 bg-green-50 rounded-lg px-4 py-3 shadow">
                  {message}
                </div>
              )}
            {error && (
              <div className="text-red-600 font-semibold text-center mb-4 transition duration-300 bg-red-50 rounded-lg px-4 py-3 shadow">
                {error}
              </div>
            )}
          </div>
        </section>

        <AnimatePresence>
          {fullscreenImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              onClick={() => setFullscreenImage(null)}
            >
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                src={fullscreenImage}
                alt="Fullscreen Preview"
                className="max-w-4xl w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
              <button
                onClick={() => setFullscreenImage(null)}
                className="absolute top-3 right-3 text-white bg-black/70 rounded-full px-3 py-1 text-sm hover:bg-black cursor-pointer"
              >
                ✕ Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Popup is now handled here, outside the main grid, and animates smoothly */}
      <AnimatePresence>
        {showPopup && (
          <BidSuccessPopup
            amount={popupAmount}
            onClose={() => setShowPopup(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BiddingFrontend;
