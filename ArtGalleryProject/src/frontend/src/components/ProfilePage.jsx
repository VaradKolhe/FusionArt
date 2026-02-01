import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../axiosInstance";
import { Navigate } from "react-router-dom";
import logo from "../utils/logo.png";
import ArtLover from "../utils/ArtLover.jpg";
import {
  FaSignOutAlt,
  FaUserCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPalette,
  FaMoneyBillWave,
} from "react-icons/fa";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const token = localStorage.getItem("token");
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewType, setViewType] = useState("sold");

  // 🎨 Adjusted Painting Card with more details
  const renderPaintingCard = (painting, type) => (
    <motion.div
      key={painting.paintingId}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-[#fdfaf6] rounded-xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 border border-gray-200 md:h-48"
    >
      <div className="relative h-1/2 overflow-hidden">
        <img
          src={`http://localhost:8085${painting.imageUrl}`}
          alt={painting.title}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
          onClick={() =>
            setFullscreenImage(`http://localhost:8085${painting.imageUrl}`)
          }
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <p className="text-white text-sm font-semibold">View Image</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-[#5a3c28] truncate">
          {painting.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 h-10 my-2">
          {painting.description}
        </p>
        <div className="mt-4 pt-4 border-t border-gray-200 text-sm space-y-2">
          <div className="flex items-center text-gray-600">
            <FaMoneyBillWave className="mr-3 text-[#6b4c35]" />
            <span className="font-semibold">
              {type === "sold" ? "Sold For:" : "Bought For:"}
            </span>
            <span className="ml-auto font-bold text-[#3e2e1e]">
              ₹{painting.finalPrice || painting.startingPrice}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaUserCircle className="mr-3 text-[#6b4c35]" />
            <span className="font-semibold">
              {type === "sold" ? "Buyer:" : "Seller:"}
            </span>
            <span className="ml-auto font-medium text-[#3e2e1e] truncate">
              {type === "sold"
                ? painting.buyer?.name || "N/A"
                : painting.seller?.name || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  useEffect(() => {
    axiosInstance
      .get("/user/profile")
      .then((res) => {
        console.dir(res.data, { depth: null });
        setProfile(res.data);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setProfile(null);
      });
  }, [axiosInstance, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    try {
      await axiosInstance.put("/user/profile-update", form);
      setEditMode(false);
      setProfile((prev) => ({ ...prev, ...form }));
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3000);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update profile.");
    }
  };

  const handleEditToggle = () => {
    if (!editMode) {
      setForm(profile);
    }
    setEditMode((prev) => !prev);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!token)
    return (
      <div className="p-10 text-center">Please login to view your profile.</div>
    );
  if (!profile)
    return <div className="p-10 text-center">Loading profile...</div>;

  const tabButton = (label) => (
    <button
      onClick={() => setActiveTab(label)}
      className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === label
        ? "bg-[#3e2e1e] text-white"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
    >
      {label === "profile" ? "Profile" : "My Paintings"}
    </button>
  );
  return (
    <div className="font-serif p-6 sm:p-10 text-[#3e2e1e]">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            onClick={handleClose}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 text-3xl font-serif flex items-center justify-center z-50 backdrop-blur-sm cursor-pointer"
          >
            ✅ You have Updated Profile successfully
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-12 px-4"
      >
        {/* Profile Section */}
        <div className="flex flex-col items-center justify-center w-full ">
          <motion.div
            className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] mt-10"
            style={{ perspective: "1200px" }}
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
          >
            <motion.div
              className="relative w-full h-full"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.8 }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Front */}
              <motion.div
                className="absolute w-full h-full"
                style={{
                  backfaceVisibility: "hidden",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1740252117070-7aa2955b25f8?w=600&auto=format&fit=crop&q=60"
                  alt=""
                  className="rounded-full w-full h-full object-cover  shadow-2xl shadow-black"
                />
              </motion.div>

              {/* Back */}
              <motion.div
                className="absolute w-full h-full"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <img
                  src={ArtLover}
                  alt=""
                  className="rounded-full w-full h-full object-fit  shadow-2xl  shadow-black"
                />
              </motion.div>
            </motion.div>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-center font-serif font-bold mt-12">
            Hello {profile.name} !
          </h2>
        </div>

        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl w-full max-w-4xl  sm:p-6 lg:p-8"
        >
          <div className="  sm:p-10 text-[#3e2e1e]">
            {/* Tab Buttons */}
            <div className="flex flex-row gap-2 justify-center sm:gap-4 text-sm sm:text-base mb-6">
              {tabButton("profile")}
              {tabButton("paintings")}
            </div>

            {/* Animate section switch */}
            <AnimatePresence mode="wait">
              {activeTab === "profile" ? (
                <motion.div
                  key="profile"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl "
                >
                  <div className="flex items-center mb-6 gap-4">
                    <FaUserCircle className="text-4xl" />
                    <h1 className="text-3xl font-bold">My Profile</h1>
                    <button
                      onClick={handleEditToggle}
                      className="ml-auto px-4 py-1 bg-[#94520f] text-white rounded-full"
                    >
                      {editMode ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  {/* Name */}
                  <label className="block mb-3">
                    <b>
                      <FaUserCircle className="inline-block mr-2" /> Name:
                    </b>{" "}
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-1 w-full mt-1"
                      />
                    ) : (
                      <span className="ml-2">{profile.name}</span>
                    )}
                  </label>

                  {/* Email */}
                  <p className="mb-3">
                    <FaEnvelope className="inline-block mr-2" />
                    <b>Email:</b> {profile.email}
                  </p>

                  {/* Phone */}
                  <label className="block mb-3">
                    <b>
                      <FaPhoneAlt className="inline-block mr-2" /> Phone:
                    </b>{" "}
                    {editMode ? (
                      <input
                        type="text"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-1 w-full mt-1"
                      />
                    ) : (
                      <span className="ml-2">{profile.phoneNumber}</span>
                    )}
                  </label>

                  {/* Address */}
                  <div className="mt-4">
                    <p className="font-bold flex items-center mb-2">
                      <FaMapMarkerAlt className="inline-block mr-2" /> Address:
                    </p>
                    <div className="text-sm text-gray-700">
                      {editMode ? (
                        <div className="flex flex-wrap gap-2">
                          {[
                            "building",
                            "landmark",
                            "street",
                            "city",
                            "region",
                            "country",
                            "pincode",
                          ].map((field) => (
                            <div key={field} className="flex flex-col">
                              <input
                                type="text"
                                name={`address.${field}`}
                                placeholder={field}
                                value={form.address?.[field] || ""}
                                onChange={handleInputChange}
                                className="border rounded px-2 py-1 w-[120px] sm:w-[140px]"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span>
                          {[
                            profile.address?.building,
                            profile.address?.landmark,
                            profile.address?.street,
                            profile.address?.city,
                            profile.address?.region,
                            profile.address?.country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                          {profile.address?.pincode &&
                            `. Pincode - ${profile.address.pincode}`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Save Button */}
                  {editMode && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleUpdate}
                      className="relative overflow-hidden h-10 cursor-pointer pb-5 mt-6  bg-green-500 hover:bg-green-600 text-white rounded-full w-[180px] group"
                    >
                      {/* Initial Text */}
                      <motion.span className="absolute left-0 right-0 flex justify-center items-center transition-transform duration-700 group-hover:translate-x-full">
                        Save Changes
                      </motion.span>

                      {/* Hover Text */}
                      <motion.span className="absolute left-0 right-0 flex justify-center items-center transition-transform duration-700 -translate-x-full group-hover:translate-x-0">
                        Have you done?
                      </motion.span>
                    </motion.button>
                  )}

                  {/* Logout */}
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/";
                    }}
                    className="relative overflow-hidden cursor-pointer mt-6 w-full px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow group"
                  >
                    {/* Sliding Content Container */}
                    <div className="flex items-center justify-center gap-2 transition-transform duration-700 group-hover:translate-x-full">
                      <FaSignOutAlt />
                      <span className="font-semibold">Logout</span>
                    </div>

                    {/* Sliding In New Text */}
                    <div className="absolute inset-0 flex items-center justify-center text-md font-semibold text-white transition-transform duration-700 -translate-x-full group-hover:translate-x-0">
                      Nice to meet you
                    </div>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="paintings"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 lg:p-8"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <FaPalette className="text-3xl text-[#6b4c35]" />
                    <h2 className="text-3xl font-bold">My Collection</h2>
                  </div>

                  {/* 👇 New Toggle Buttons */}
                  <div className="flex w-full bg-[#f0e2d2] p-1 rounded-lg mb-8 shadow-inner">
                    <button
                      className={`w-1/2 py-2 text-center rounded-md font-semibold transition-all duration-300 ${viewType === "sold"
                        ? "bg-white text-[#6b4c35] shadow"
                        : "text-gray-500 hover:bg-white/50"
                        }`}
                      onClick={() => setViewType("sold")}
                    >
                      Sold Paintings
                    </button>
                    <button
                      className={`w-1/2 py-2 text-center rounded-md font-semibold transition-all duration-300 ${viewType === "bought"
                        ? "bg-white text-[#6b4c35] shadow"
                        : "text-gray-500 hover:bg-white/50"
                        }`}
                      onClick={() => setViewType("bought")}
                    >
                      Bought Paintings
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={viewType}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {viewType === "sold" ? (
                        <div>
                          {profile.paintingsSold?.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">
                              You haven't sold any paintings yet.
                            </p>
                          ) : (
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 md:gap-3 gap-3">
                              {/* 👇 Updated function call */}
                              {profile.paintingsSold.map((p) => renderPaintingCard(p, "sold"))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          {profile.paintingsBought?.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">
                              You haven't bought any paintings yet.
                            </p>
                          ) : (
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                              {/* 👇 Updated function call */}
                              {profile.paintingsBought.map((p) => renderPaintingCard(p, "bought"))}
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
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
                    className="absolute top-3 right-3 text-white bg-black/70 rounded-full px-3 py-1 text-sm hover:bg-black"
                  >
                    ✕ Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
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
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0.8 }}
                          className="relative max-w-4xl w-full"
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
                      </motion.div>
                    )}
                  </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
