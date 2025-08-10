import { useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sell = () => {
  const [step, setStep] = useState(1);
  const [sellingMode, setSellingMode] = useState(""); // "auction" or "store"

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    file: null,
    title: "",
    description: "",
    length: "",
    breadth: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      const file = files[0];
      if (!file) return;

      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

      if (file.size > maxSizeInBytes) {
        alert("File size exceeds 5MB. Please choose a smaller file.");

        e.target.value = null;

        setFormData((prev) => ({
          ...prev,
          file: null,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          file: file,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", formData.file);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("length", formData.length);
    data.append("breadth", formData.breadth);
    data.append("price", parseFloat(formData.price));
    if (sellingMode === "auction") {
      data.append("isForAuction", true);
    } else {
      data.append("isForAuction", false);
    }

    try {
      const url = "/upload-painting";
      await axiosInstance.post(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Painting uploaded successfully");
      setStep(4);
    } catch (err) {
      alert("Failed to upload painting");
      console.error(err);
    }
  };

  return (
    <div className="w-full min-h-screen mt-5 px-4 py-12 font-serif">
      <ToastContainer position="top-right" autoClose={5000} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8"
      >
        <h1 className="text-4xl font-bold text-center text-[#5a3c28] mb-8">
          Sell Your Artwork
        </h1>

        {step === 1 && (
          <div>
            {/* Intro cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-[#5a3c28]">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-[#fffaf3] p-6 rounded-xl border border-[#e0d7cb]"
              >
                <h2 className="text-xl font-semibold mb-2">
                  1. Submit Your Artwork
                </h2>
                <p>
                  Provide basic details and images of the piece you wish to
                  consign.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-[#fffaf3] p-6 rounded-xl border border-[#e0d7cb]"
              >
                <h2 className="text-xl font-semibold mb-2">
                  2. Review Process
                </h2>
                <p>
                  Our team will evaluate your submission to ensure it meets our
                  standards. You will receive a response within 10 business
                  days.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-[#fffaf3] p-6 rounded-xl border border-[#e0d7cb]"
              >
                <h2 className="text-xl font-semibold mb-2">
                  3. Collect Your Payment
                </h2>
                <p>
                  Once your artwork is sold, you will receive your payment
                  promptly.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-[#fffaf3] p-6 rounded-xl border border-[#e0d7cb]"
              >
                <h2 className="text-xl font-semibold mb-2">4. Auction Time</h2>
                <p>
                  Auction will be live for 2 days form Thursday 5 PM to Saturday
                  5 PM in every week.
                </p>
              </motion.div>
            </div>

            <div className="text-center mt-10">
              <button
                onClick={() => {
                  if (!token) {
                    toast.error("Login to sell paintings.");
                  } else {
                    setStep(2)
                  }
                }
                }
                className="bg-[#5a3c28] text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg hover:bg-[#3d281a] transition duration-300 cursor-pointer"
              >
                Start Selling
              </button>
            </div>
          </div>
        )}

        {/* 🔸Step 2: Choose Selling Mode */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center space-y-6">
              <h2 className="text-xl font-semibold text-[#5a3c28]">
                How do you want to sell your painting?
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSellingMode("auction");
                    setStep(3);
                  }}
                  className="bg-[#5a3c28] w-full sm:w-48 text-white px-6 py-3 rounded-md hover:bg-[#3d281a] cursor-pointer text-sm sm:text-base"
                >
                  Sell in Auction
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSellingMode("store");
                    setStep(3);
                  }}
                  className="bg-[#5a3c28] w-full sm:w-48 text-white px-6 py-3 rounded-md hover:bg-[#3d281a] cursor-pointer text-sm sm:text-base"
                >
                  Sell in Store
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 🔸Step 3: Form based on selling mode */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6 text-[#5a3c28]">
              <div>
                <label className="block font-medium mb-1">
                  Painting Image: &lt; 5Mb
                </label>
                <input
                  type="file"
                  name="file"
                  required
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 sm:p-3 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Title:</label>
                <input
                  type="text"
                  name="title"
                  required
                  onChange={handleChange}
                  value={formData.title}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Description:</label>
                <textarea
                  name="description"
                  required
                  onChange={handleChange}
                  value={formData.description}
                  rows="3"
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Length (cm):</label>
                  <input
                    type="number"
                    name="length"
                    required
                    min="0"
                    step="any"
                    onChange={handleChange}
                    value={formData.length}
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">
                    Breadth (cm):
                  </label>
                  <input
                    type="number"
                    name="breadth"
                    required
                    min="0"
                    step="any"
                    onChange={handleChange}
                    value={formData.breadth}
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>
              </div>

              {/* Auction Price or Fixed Price */}
              {sellingMode === "auction" ? (
                <div>
                  <label className="block font-medium mb-1">
                    Starting Price (₹):
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="any"
                    onChange={handleChange}
                    value={formData.price}
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-medium mb-1">Price (₹):</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="any"
                    onChange={handleChange}
                    value={formData.price}
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>
              )}
              <button
                type="submit"
                className="bg-[#5a3c28] text-white px-6 py-3 rounded-lg text-base hover:bg-[#3d281a] transition duration-300 w-full sm:w-auto"
              >
                Submit Application
              </button>
            </form>
          </motion.div>
        )}

        {/* 🔸Step 4: Success screen (same for both) */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-[#5a3c28] text-center space-y-4 px-2 sm:px-4">
              <h2 className="text-2xl font-semibold">
                Your application is being processed!
              </h2>
              <p>
                Thank you for your interest in becoming a seller. We are
                reviewing your application and will notify you via email once
                approved.
              </p>
              <p className="italic">
                Please wait while we verify your details.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Sell;
