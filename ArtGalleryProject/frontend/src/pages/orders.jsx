import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../axiosInstance";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Orders = () => {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [item, setItem] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const amountParam = searchParams.get("amount");
    const itemParam = searchParams.get("item");

    if (amountParam) setAmount(amountParam);
    if (itemParam) setItem(itemParam);
    
    // Preload script when on orders page
    loadRazorpayScript();
  }, [searchParams]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!name || !email || !amount || parseFloat(amount) <= 0) {
      alert("Please fill in all details correctly.");
      return;
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Failed to load Razorpay SDK. Please check your connection.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/createOrder", {
        name: name,
        email: email,
        amount: parseFloat(amount),
      });

      const order = response.data;

      const options = {
        key: order.razorpayId || import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_OnnlSk7bO4zTnD",
        amount: order.amount,
        currency: "INR",
        name: "Fusion Art",
        description: `Order for ${item || "Art"}`,
        order_id: order.razorpayOrderId,
        callback_url: new URL(`${axiosInstance.defaults.baseURL}/paymentCallback`, window.location.origin).href,
        prefill: {
          name: order.name,
          email: order.email,
        },
        theme: {
          color: "#A17B5D",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] flex justify-center align-center p-5 items-center">
      {loading && (
        <div className="fixed inset-0 bg-[rgba(255,250,245,0.8)] backdrop-blur-[4px] flex flex-col justify-center items-center z-[1000] text-[#5a3c28] text-xl">
          <div className="border-[6px] border-[#f3f3f3] border-top-[6px] border-t-[#a17b5d] rounded-full w-[50px] h-[50px] animate-spin mb-5"></div>
          <p>Processing Your Order...</p>
        </div>
      )}

      <div className="bg-white p-10 rounded-[24px] shadow-[0_4px_6px_rgba(0,0,0,0.1)] max-w-[500px] w-full transition-all duration-300 hover:shadow-[0_20px_25px_rgba(139,100,72,0.2)] hover:-translate-y-0.5">
        <div className="text-center mb-[30px]">
          <h2 className="text-[#5a3c28] text-[2rem] font-bold mb-[10px] font-serif">
            {item ? `Order for: ${item}` : "Complete Your Order"}
          </h2>
        </div>

        <form onSubmit={handlePayment}>
          <div className="mb-5">
            <label className="block text-[#6b4c35] font-semibold mb-2 text-base font-serif">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-xl text-base font-serif transition-all duration-300 bg-[#fafafa] focus:outline-none focus:border-[#a17b5d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(161,123,93,0.1)]"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-[#6b4c35] font-semibold mb-2 text-base font-serif">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-xl text-base font-serif transition-all duration-300 bg-[#fafafa] focus:outline-none focus:border-[#a17b5d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(161,123,93,0.1)]"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-[#6b4c35] font-semibold mb-2 text-base font-serif">
              Amount
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-xl text-base font-serif transition-all duration-300 bg-[#fafafa] focus:outline-none focus:border-[#a17b5d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(161,123,93,0.1)]"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-[#a17b5d] text-white px-7 py-3.5 border-none rounded-[50px] text-base font-semibold font-serif cursor-pointer transition-all duration-300 w-full mt-2.5 hover:bg-[#8c6448] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(161,123,93,0.3)] active:translate-y-0"
          >
            Proceed To Pay
          </button>
        </form>
      </div>
    </div>
  );
};

export default Orders;
