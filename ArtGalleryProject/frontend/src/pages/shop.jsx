import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaSignOutAlt,
  FaUserCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaImage,
  FaInfoCircle,
  FaRulerCombined,
  FaUser,
  FaTag,
} from "react-icons/fa";

const Shop = () => {
  const [profile, setProfile] = useState(null);
  const [paintings, setPaintings] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [pageNo, setPageNo] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Manages all loading states
  const [orderInfo, setOrderInfo] = useState({
    name: "",
    address: "",
    mobile: "",
    paymentMode: "Cash on Delivery",
  });
  const token = localStorage.getItem("token");

  // Fetch user profile
  useEffect(() => {
    axiosInstance
      .get("/user/profile")
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setProfile(null);
      });
  }, [token]);

  // Fetch paintings whenever pageNo changes
  useEffect(() => {
    fetchPaintings(pageNo);
  }, [pageNo]);

  // Fetches paintings and manages loading state
  const fetchPaintings = async (page = 0) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/store?pageNo=${page}`);
      const data = res.data.content || res.data;
      setPaintings(data);

      const nextRes = await axiosInstance.get(`/store?pageNo=${page + 1}`);
      const nextData = nextRes.data.content || nextRes.data;
      setHasNextPage(Array.isArray(nextData) ? nextData.length > 0 : false);
    } catch (err) {
      console.error("Failed to fetch paintings:", err);
      setPaintings([]);
      setHasNextPage(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Places the order and manages loading state
  const handlePlaceOrder = async () => {
    if (!selectedPainting || !orderInfo) return;

    const orderPayload = {
      paintingId: selectedPainting.paintingId,
      amount: selectedPainting.startingPrice,
      name: orderInfo.name,
      address: orderInfo.address,
      mobile: orderInfo.mobile,
      paymentMode: orderInfo.paymentMode,
    };

    setShowConfirmationModal(false); // Close modal
    setIsLoading(true); // Start loading
    try {
      await axiosInstance.post("/paymentCallbackCodOrWallet", orderPayload);
      setOrderPlaced(true);
      setTimeout(() => setOrderPlaced(false), 3000);
    } catch (err) {
      console.error("Failed to place order:", err);

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }

      console.log("Error message to display:", errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading Screen UI
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen font-serif text-[#3e2e1e]">
        <svg
          className="animate-spin h-10 w-10 mb-4 text-[#6b4c35]"
          xmlns="http://www.w3.org/2000/svg"
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-2xl">Please wait...</p>
      </div>
    );
  }

  // Main Component UI
  return (
    <div className="px-20 py-10 font-serif relative">
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-4xl font-bold text-center text-[#3e2e1e] mb-12">
        Art Store
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1300px] mx-auto">
        {paintings.length > 0 ? (
          paintings.map((painting) => (
            <motion.div
              key={painting.paintingId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
              className="rounded-2xl bg-[#f0e2d2] h-[550px] transform hover:-translate-y-2 duration-300 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-amber-950 transition flex flex-col"
            >
              {painting.imageUrl && (
                <div className="relative overflow-hidden h-1/2 rounded-t-md group group">
                  <img
                    src={`http://localhost:8085${painting.imageUrl}`}
                    alt={painting.title}
                    className="w-full h-80 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                    onClick={() =>
                      setFullscreenImage(
                        `http://localhost:8085${painting.imageUrl}`
                      )
                    }
                  />

                  {/* Hover message */}
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-[#6b4c35]/50 text-white text-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
                    Click to view image
                  </div>
                </div>
              )}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaImage className="text-[#5a3c28]" />
                    <h2 className="text-2xl font-bold text-[#5a3c28]">
                      {painting.title}
                    </h2>
                  </div>
                  <div className="flex items-start gap-2 text-md text-[#6b4c35] mb-2">
                    <FaInfoCircle className="mt-1 flex-shrink-0" />
                    <p className="line-clamp-2">
                      {painting.description}
                    </p>
                  </div>
                  <p className="text-md text-[#6b4c35] mb-1 flex gap-2">
                    <FaRulerCombined />{" "}
                    <span className="font-bold">Dimensions</span>{" "}
                    {painting.length}cm x {painting.breadth}cm
                  </p>
                  <p className="text-md text-[#6b4c35] flex gap-2 my-2">
                    <FaTag className="" />
                    <span className="font-bold">Starting Price:</span> ₹
                    {painting.startingPrice}
                  </p>
                  <p className="text-md mt-2 font-bold flex gap-2 text-[#6b4c35]">
                    <FaUserCircle className="mt-1" /> Seller:{" "}
                    <span className="font-medium text-[#6b4c35]">
                      {painting.seller || "Unknown"}
                    </span>
                  </p>
                </div>
                <button
                  className="mt-4 w-full text-center bottom-0 cursor-pointer hover:scale-95 duration-300 ease-in-out py-2 rounded-lg bg-[#6b4c35] hover:bg-[#776354] text-white font-semibold transition"
                  onClick={() => {
                    if (!token) {
                      toast.error("Login to buy painting.");
                    } else {
                      setSelectedPainting(painting);
                      setShowAddressModal(true);
                    }
                  }}
                >
                  Buy Now
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No paintings found.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-10 gap-6">
        <button
          onClick={() => setPageNo((p) => Math.max(0, p - 1))}
          disabled={pageNo === 0}
          className="px-5 py-2 bg-[#a17b5d] text-white font-semibold rounded-lg transition-colors cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#8c6448] disabled:hover:bg-[#a17b5d]"
        >
          Previous
        </button>

        <span className="text-lg font-medium text-gray-700">
          Page {pageNo + 1}
        </span>

        <button
          onClick={() => setPageNo((p) => p + 1)}
          disabled={!hasNextPage}
          className="px-5 py-2 bg-[#a17b5d] text-white font-semibold rounded-lg transition-colors cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#8c6448] disabled:hover:bg-[#a17b5d]"
        >
          Next
        </button>
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setFullscreenImage(null)}
          >
            <img
              src={fullscreenImage}
              alt="Fullscreen Preview"
              className="w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
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

      {/* Address & Mobile Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center backdrop-blur-2xl bg-opacity-40 z-50"
          >
            <div
              className="bg-[#f8f1ea] p-8 rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-[#3e2e1e] mb-4 text-center">
                Confirm Address & Mobile
              </h2>
              {/* Wrap content in a form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent default form submission
                  // If the form is valid, proceed with your logic
                  setShowAddressModal(false);
                  setShowOrderModal(true);
                }}
              >
                <label className="block mb-2 text-sm font-medium text-[#5a3c28]">Name</label>
                <input
                  required // This will now work with the form
                  type="text"
                  className="w-full mb-4 px-4 py-2 border rounded-md"
                  placeholder="Enter Name"
                  value={orderInfo.name}
                  onChange={(e) =>
                    setOrderInfo({ ...orderInfo, name: e.target.value })
                  }
                />

                <label className="block mb-2 text-sm font-medium text-[#5a3c28]">Mobile Number</label>
                <input
                  required // This will now work with the form
                  type="tel"
                  className="w-full mb-4 px-4 py-2 border rounded-md"
                  placeholder="Enter mobile number"
                  value={orderInfo.mobile}
                  onChange={(e) =>
                    setOrderInfo({ ...orderInfo, mobile: e.target.value })
                  }
                />

                <label className="block mb-2 text-sm font-medium text-[#5a3c28]">Delivery Address</label>
                <textarea
                  required // This will now work with the form
                  rows="3"
                  className="w-full mb-4 px-4 py-2 border rounded-md"
                  placeholder="Enter delivery address"
                  value={orderInfo.address}
                  onChange={(e) =>
                    setOrderInfo({ ...orderInfo, address: e.target.value })
                  }
                />
                <button
                  type="button" // Keep this as type="button" so it doesn't submit the form
                  className="bg-[#6b4c35] cursor-pointer text-white px-4 py-2 rounded hover:bg-[#5a3c28]"
                  onClick={() => {
                    const fullAddress =
                      [
                        profile.address?.building,
                        profile.address?.landmark,
                        profile.address?.street,
                        profile.address?.city,
                        profile.address?.region,
                        profile.address?.country,
                      ]
                        .filter(Boolean)
                        .join(", ") +
                      (profile.address?.pincode
                        ? `. Pincode - ${profile.address.pincode}`
                        : "");

                    setOrderInfo({
                      ...orderInfo,
                      name: profile.name || "",
                      mobile: profile.phoneNumber || "",
                      address: fullAddress || "",
                    });
                  }}
                >
                  Continue with Profile Info
                </button>

                <div className="flex justify-between mt-6">
                  <button
                    type="button" // Keep as type="button" to prevent form submission
                    className="bg-gray-300 px-4 py-2 rounded cursor-pointer hover:bg-gray-400"
                    onClick={() => setShowAddressModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit" // Change to type="submit" to trigger form validation
                    className="bg-[#6b4c35] text-white px-4 cursor-pointer py-2 rounded hover:bg-[#5a3c28]"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Method Modal */}
      <AnimatePresence>
        {showOrderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center backdrop-blur-2xl bg-opacity-40 z-50"
          >
            <div
              className="bg-[#f8f1ea] p-8 rounded-lg shadow-xl w-full max-w-md text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-[#5a3c28] mb-6">
                Select Payment Method
              </h2>
              <div className="flex justify-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#5a3c28] w-[40%] text-white px-6 py-3 rounded-md hover:bg-[#3d281a] cursor-pointer"
                  onClick={() => {
                    setOrderInfo((prev) => ({
                      ...prev,
                      paymentMode: "Cash on Delivery",
                    }));
                    setShowOrderModal(false);
                    setShowConfirmationModal(true);
                  }}
                >
                  Cash on Delivery
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#5a3c28] w-[40%] text-white px-6 py-3 rounded-md hover:bg-[#3d281a] cursor-pointer"
                  onClick={() => {
                    setOrderInfo((prev) => ({
                      ...prev,
                      paymentMode: "Pay with Wallet",
                    }));
                    setShowOrderModal(false);
                    setShowConfirmationModal(true);
                  }}
                >
                  Pay with Wallet
                </motion.button>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="mt-6 text-sm text-gray-500 hover:text-blackcursor-pointer cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Confirmation Modal */}
      <AnimatePresence>
        {showConfirmationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-2xl bg-black/30 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{
                scale: 1,
                y: 0,
                transition: { duration: 0.4, ease: "easeOut" },
              }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              className="relative bg-[#f8f1ea] text-[#3e2e1e] p-8 rounded-2xl shadow-2xl w-full max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Icon */}
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="absolute top-4 right-4 text-[#3e2e1e] hover:text-red-600 transition-colors text-xl cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold">Order Summary</h2>
                <p className="text-sm text-[#5a3c28]">
                  Please review your order before placing it
                </p>
              </div>

              {/* Receipt with Icons */}
              <div className="border border-[#d3c1b3] rounded-lg overflow-hidden shadow-inner">
                {/* Painting Details */}
                <div className="bg-[#ebddd1] px-6 py-4 border-b border-[#d3c1b3] flex items-center gap-2 font-semibold text-lg">
                  <div className="flex items-center gap-2 font-semibold text-lg">
                    <FaImage className="text-[#5a3c28]" />
                    Painting Details
                  </div>
                </div>
                <div className="px-6 py-4 space-y-2 text-sm text-[#5a3c28]">
                  <div className="flex justify-between">
                    <span className="font-semibold">Title:</span>
                    <span>{selectedPainting?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Base Price:</span>
                    <span>₹{selectedPainting?.startingPrice}</span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-[#ebddd1] px-6 py-4 border-t border-b border-[#d3c1b3] flex items-center gap-2 font-semibold text-lg">
                  <FaUserCircle /> Customer Info
                </div>
                <div className="px-6 py-4 space-y-3 text-sm text-[#5a3c28]">
                  <div className=" items-center gap-2 flex justify-between">
                    <div className="flex items-center gap-2">
                      <FaUserCircle className="text-[#5a3c28]" />
                      <span className="font-semibold w-28">Name:</span>
                    </div>
                    <span>{orderInfo.name}</span>
                  </div>
                  <div className="flex items-center  justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FaPhoneAlt className="text-[#5a3c28]" />
                      <span className="font-semibold w-28">Mobile:</span>
                    </div>
                    <span>{orderInfo.mobile}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#5a3c28] mt-1" />
                      <span className="font-semibold w-28">Address:</span>
                    </div>
                    <span className="text-right max-w-[60%]">
                      {orderInfo.address}
                    </span>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-[#ebddd1] px-6 py-4 border-t border-b border-[#d3c1b3] flex items-center gap-2 font-semibold text-lg">
                  <FaSignOutAlt /> Payment Info
                </div>
                <div className="px-6 py-4 text-sm text-[#5a3c28] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FaSignOutAlt className="text-[#5a3c28]" />
                      <span className="font-semibold w-36">
                        Payment Method:
                      </span>
                    </div>
                    <span>
                      <i>{orderInfo.paymentMode}</i>
                    </span>
                  </div>
                  <hr className="my-2 border-[#d3c1b3]" />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total Payable:</span>
                    <span>₹{selectedPainting?.startingPrice}</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-between gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gray-300 text-[#3e2e1e] py-2 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer"
                  onClick={() => {
                    setShowConfirmationModal(false);
                    setShowOrderModal(true);
                  }}
                >
                  Go Back
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-[#6b4c35] text-white py-2 rounded-lg hover:bg-[#5a3c28] transition-colors cursor-pointer"
                  onClick={handlePlaceOrder}
                >
                  Confirm & Place Order
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Placed Success Message */}
      <AnimatePresence>
        {orderPlaced && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 text-2xl md:text-4xl text-center p-4 text-[#3e2e1e] font-serif flex items-center justify-center z-50 backdrop-blur-3xl cursor-pointer"
            onClick={() => setOrderPlaced(false)}
          >
            ✅ Order placed successfully for "{selectedPainting?.title}"!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
