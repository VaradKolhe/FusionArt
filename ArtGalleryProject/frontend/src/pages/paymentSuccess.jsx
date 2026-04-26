import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [timeLeft, setTimeLeft] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#fffaf5] flex justify-center items-center p-5">
      <div className="bg-white p-10 md:p-[50px_40px] rounded-[24px] shadow-[0_4px_6px_rgba(0,0,0,0.1)] max-w-[500px] w-full text-center transition-all duration-300 hover:shadow-[0_20px_25px_rgba(139,100,72,0.2)] hover:-translate-y-0.5 animate-[slideIn_0.6s_ease-out]">
        <div className="text-[80px] text-[#4CAF50] mb-5 animate-[bounce_0.6s_ease-out_0.3s_both]">
          ✔
        </div>
        <h1 className="text-[#5a3c28] text-[2.5rem] font-bold mb-[15px] font-serif">
          Payment Successful
        </h1>
        <p className="text-[#6b4c35] mb-5 text-[1.1rem] leading-[1.6] font-serif">
          Thank you for your payment. Your transaction has been completed successfully.
        </p>
        <p className="bg-[#f8f5f0] p-4 rounded-xl border-l-4 border-[#a17b5d] mt-[25px] font-semibold font-serif">
          Redirecting to homepage in{" "}
          <span className="text-[#a17b5d] font-bold text-[1.2rem]">
            {timeLeft}
          </span>{" "}
          seconds...
        </p>
        <div className="w-full h-1 bg-[#e5e7eb] rounded-[2px] mt-5 overflow-hidden">
          <div
            className="h-full bg-[#4CAF50] rounded-[2px] transition-[width] duration-1000 linear animate-[progress_3s_linear]"
            style={{ width: `${((3 - timeLeft) / 3) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
