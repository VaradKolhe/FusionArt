import { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotQuestion, setForgotQuestion] = useState("");
  const [forgotAnswer, setForgotAnswer] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    phoneNumber: "",
    building: "",
    landmark: "",
    street: "",
    city: "",
    region: "",
    country: "",
    pincode: "",
  });
  const [userDetailsError, setUserDetailsError] = useState("");
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
    phoneNumber: "",
  });

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    setFormData({
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      securityQuestion: "",
      securityAnswer: "",
      phoneNumber: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserDetailsChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleUserDetailsSubmit = async (e) => {
    e.preventDefault();
    setUserDetailsLoading(true);
    setUserDetailsError("");
    try {
      const payload = {
        name: userDetails.name,
        phoneNumber: userDetails.phoneNumber,
        address: {
          building: userDetails.building,
          landmark: userDetails.landmark,
          street: userDetails.street,
          city: userDetails.city,
          region: userDetails.region,
          country: userDetails.country,
          pincode: userDetails.pincode,
        },
      };
      const res = await axiosInstance.post("/auth/user-info", payload);
      if (res.data === "User info saved") {
        // Store the username in localStorage
        localStorage.setItem("username", userDetails.name);
        navigate("/"); // or set a state to show the profile modal
        window.location.reload(); // to update header/profile
      } else {
        setUserDetailsError(res.data || "Could not save user info.");
      }
    } catch (err) {
      setUserDetailsError(
        err.response?.data || "Could not save user info or server error."
      );
    } finally {
      setUserDetailsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const url = isLogin
      ? "http://localhost:8085/auth/login"
      : "http://localhost:8085/auth/register";

    const payload = isLogin
      ? {
        email: formData.email,
        password: formData.password,
      }
      : {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer,
      };

    try {
      const res = await axiosInstance.post(url, payload);
      const data = res.data;

      if (data?.token) {
        localStorage.setItem("token", data.token);

        // For login, fetch and store the username
        if (isLogin) {
          try {
            const profileRes = await axiosInstance.get("/user/profile");
            if (profileRes.data?.name) {
              localStorage.setItem("username", profileRes.data.name);
            }
          } catch (profileErr) {
            console.error("Failed to fetch profile:", profileErr);
          }
        }
      } else {
        alert("Token missing in response");
        return;
      }

      if (!isLogin) {
        setShowUserDetails(true);
      } else {
        toast.success(data.message || "Login successful");

        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1200);
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
        err.response?.data ||
        "Something went wrong"
      );
    }
  };

  // Forgot Password Handlers
  const handleForgotEmail = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    try {
      const res = await axiosInstance.post(
        "/auth/forgot-password?step=check-email",
        { email: forgotEmail }
      );
      setForgotQuestion(res.data);
      setForgotStep(2);
    } catch (err) {
      setForgotError(
        err.response?.data || "Could not find email or server error."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotAnswer = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    try {
      const res = await axiosInstance.post(
        "/auth/forgot-password?step=verify-answer",
        { email: forgotEmail, answer: forgotAnswer }
      );
      if (res.data === "Verification Success") {
        setForgotStep(3);
      } else {
        setForgotError(res.data || "Incorrect answer.");
      }
    } catch (err) {
      setForgotError(err.response?.data || "Incorrect answer or server error.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotReset = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");

    try {
      const res = await axiosInstance.put(
        "/auth/forgot-password?step=password-reset",
        {
          email: forgotEmail,
          newPassword: forgotNewPassword,
          confirmPassword: forgotConfirmPassword,
        }
      );

      const data = res.data;

      if (typeof data === "string") {
        setForgotError(data);
      } else if (data.token) {
        localStorage.setItem("token", data.token);
        toast.success("Password Reset Successful.");

        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1200);

        setShowForgot(false);
        setForgotStep(1);
        setForgotEmail("");
        setForgotQuestion("");
        setForgotAnswer("");
        setForgotNewPassword("");
        setForgotConfirmPassword("");
      } else {
        setForgotError("Unexpected response format.");
      }
    } catch (err) {
      setForgotError(
        err.response?.data || "Could not reset password or server error."
      );
    } finally {
      setForgotLoading(false);
    }
  };


  return (
    <div className="h-[790px] w-screen bg-gradient-to-tr from-[#f9f9f8] via-[#f9f4ed] to-[#f5ebde] flex items-center justify-center px-4">
      <ToastContainer position="top-right" autoClose={5000} />

      <div>
        <img
          src="https://paperplanedesign.in/cdn/shop/files/collage-wallpaper-featuring-famous-van-gogh-paintings-251088.jpg?v=1715591219&width=1080"
          alt=""
          className="absolute left-0 top-0 w-full h-full object-cover opacity-80"
        />
      </div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-[500px] bg-white/40 backdrop-blur-xl shadow-2xl rounded-3xl p-8"
      >
        {/* Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => {
              setIsLogin(true);
              setShowForgot(false);
              setShowUserDetails(false);
            }}
            className={`px-6 py-2 rounded-full font-semibold cursor-pointer ${isLogin && !showForgot && !showUserDetails
              ? "bg-purple-500 text-white"
              : "bg-white/60 text-gray-800"
              }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setShowForgot(false);
              setShowUserDetails(false);
            }}
            className={`px-6 py-2 rounded-full font-semibold cursor-pointer ${!isLogin && !showForgot && !showUserDetails
              ? "bg-purple-500 text-white"
              : "bg-white/60 text-gray-800"
              }`}
          >
            Sign Up
          </button>
        </div>

        <h2 className="text-3xl font-bold text-center font-serif text-gray-800 mb-6">
          {showForgot
            ? "Forgot Password"
            : showUserDetails
              ? "Complete Your Profile"
              : isLogin
                ? "Welcome Back"
                : "Create Account"}
        </h2>

        {/* User Details Form After Signup */}
        {showUserDetails ? (
          <form onSubmit={handleUserDetailsSubmit} className="space-y-4 ">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              onChange={handleUserDetailsChange}
              value={userDetails.name}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
            />

            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              required
              onChange={handleUserDetailsChange}
              value={userDetails.phoneNumber}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
            />
            <input
              type="text"
              name="building"
              placeholder="Building"
              required
              onChange={handleUserDetailsChange}
              value={userDetails.building}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
            />
            <input
              type="text"
              name="landmark"
              placeholder="Landmark"
              required
              onChange={handleUserDetailsChange}
              value={userDetails.landmark}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
            />
            <input
              type="text"
              name="street"
              placeholder="Street"
              required
              onChange={handleUserDetailsChange}
              value={userDetails.street}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
            />
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                required
                onChange={handleUserDetailsChange}
                value={userDetails.city}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
              />
              <input
                type="text"
                name="region"
                placeholder="Region"
                required
                onChange={handleUserDetailsChange}
                value={userDetails.region}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                name="country"
                placeholder="Country"
                required
                onChange={handleUserDetailsChange}
                value={userDetails.country}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                required
                onChange={handleUserDetailsChange}
                value={userDetails.pincode}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg cursor-pointer"
              disabled={userDetailsLoading}
            >
              {userDetailsLoading ? "Saving..." : "Save & Go to Dashboard"}
            </button>
            {userDetailsError && (
              <p className="text-red-600 text-sm">{userDetailsError}</p>
            )}
          </form>
        ) : showForgot ? (
          <div>
            {forgotStep === 1 && (
              <form onSubmit={handleForgotEmail} className="space-y-4">
                <input
                  type="email"
                  name="forgotEmail"
                  placeholder="Enter your email"
                  required
                  onChange={(e) => setForgotEmail(e.target.value)}
                  value={forgotEmail}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-lg cursor-pointer"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "Checking..." : "Next"}
                </button>
                {forgotError && (
                  <p className="text-red-600 text-sm">{forgotError}</p>
                )}
              </form>
            )}
            {forgotStep === 2 && (
              <form onSubmit={handleForgotAnswer} className="space-y-4">
                <div className="mb-2 text-gray-800 font-medium">
                  Security Question:
                </div>
                <div className="mb-4 text-purple-700 font-semibold">
                  {forgotQuestion}
                </div>
                <input
                  type="text"
                  name="forgotAnswer"
                  placeholder="Your Answer"
                  required
                  onChange={(e) => setForgotAnswer(e.target.value)}
                  value={forgotAnswer}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-lg cursor-pointer"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "Verifying..." : "Next"}
                </button>
                {forgotError && (
                  <p className="text-red-600 text-sm">{forgotError}</p>
                )}
              </form>
            )}
            {forgotStep === 3 && (
              <form onSubmit={handleForgotReset} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="forgotNewPassword"
                    placeholder="New Password"
                    required
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    value={forgotNewPassword}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      // Eye Off Icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.15.195-2.253.55-3.275m5.025-1.725A10.05 10.05 0 0112 5c5.523 0 10 4.477 10 10 0 1.15-.195 2.253-.55 3.275M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18"
                        />
                      </svg>
                    ) : (
                      // Eye Icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="forgotConfirmPassword"
                    placeholder="Confirm New Password"
                    required
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    value={forgotConfirmPassword}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      // Eye Off Icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.15.195-2.253.55-3.275m5.025-1.725A10.05 10.05 0 0112 5c5.523 0 10 4.477 10 10 0 1.15-.195 2.253-.55 3.275M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18"
                        />
                      </svg>
                    ) : (
                      // Eye Icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-lg cursor-pointer"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </button>
                {forgotError && (
                  <p className="text-red-600 text-sm">{forgotError}</p>
                )}
              </form>
            )}
            <button
              className="mt-4 w-full text-blue-600 hover:underline font-medium cursor-pointer"
              onClick={() => {
                setShowForgot(false);
                setForgotStep(1);
                setForgotEmail("");
                setForgotQuestion("");
                setForgotAnswer("");
                setForgotNewPassword("");
                setForgotConfirmPassword("");
                setForgotError("");
              }}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                onChange={handleChange}
                value={formData.email}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handleChange}
                  value={formData.password}
                  className="w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    // Eye Off Icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.15.195-2.253.55-3.275m5.025-1.725A10.05 10.05 0 0112 5c5.523 0 10 4.477 10 10 0 1.15-.195 2.253-.55 3.275M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18"
                      />
                    </svg>
                  ) : (
                    // Eye Icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Forgot Password Button */}
              {isLogin && (
                <button
                  type="button"
                  className="text-blue-600 hover:underline font-medium text-sm float-right mb-2 cursor-pointer"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot Password?
                </button>
              )}
              {!isLogin && (
                <>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      required
                      onChange={handleChange}
                      value={formData.confirmPassword}
                      className="w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
                    />
                    <div
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        // Eye Off Icon
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.15.195-2.253.55-3.275m5.025-1.725A10.05 10.05 0 0112 5c5.523 0 10 4.477 10 10 0 1.15-.195 2.253-.55 3.275M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18"
                          />
                        </svg>
                      ) : (
                        // Eye Icon
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <select
                    name="securityQuestion"
                    required
                    onChange={handleChange}
                    value={formData.securityQuestion}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner hover:cursor-pointer"
                  >
                    <option value="" disabled hidden>
                      Select a security question
                    </option>
                    <option value="What is your mother's maiden name?">
                      What is your mother's maiden name?
                    </option>
                    <option value="What was the name of your first pet?">
                      What was the name of your first pet?
                    </option>
                    <option value="What is your favorite book?">
                      What is your favorite book?
                    </option>
                    <option value="What city were you born in?">
                      What city were you born in?
                    </option>
                    <option value="What is your favorite food?">
                      What is your favorite food?
                    </option>
                  </select>
                  <input
                    type="text"
                    name="securityAnswer"
                    placeholder="Security Answer"
                    required
                    onChange={handleChange}
                    value={formData.securityAnswer}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
                  />
                </>
              )}
              {/* Submit */}
              <button
                type="submit"
                className={`w-full py-3 cursor-pointer rounded-xl bg-gradient-to-r ${isLogin
                  ? "from-purple-500 to-indigo-500 hover:from-indigo-600 hover:to-purple-600"
                  : "from-green-500 to-emerald-500 hover:from-emerald-600 hover:to-green-600"
                  } text-white font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
            {/* Toggle Link */}
            <p className="mt-4 text-center text-sm">
              <button
                onClick={toggleForm}
                className="text-blue-600 hover:underline font-medium cursor-pointer"
              >
                {isLogin
                  ? "Need an account? Sign Up"
                  : "Already have an account? Login"}
              </button>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
