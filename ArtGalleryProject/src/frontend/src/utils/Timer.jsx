import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const Timer = ({ setAuctionLive }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [auctionMode, setAuctionMode] = useState("");

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const currentDay = now.getDay() === 0 ? 7 : now.getDay();

      const auctionStart = new Date(now);
      auctionStart.setDate(now.getDate() - currentDay + 4); //  day(sunday:0  and saturday:6)
      auctionStart.setHours(17, 0, 0, 0);

      const auctionEndCheck = new Date(auctionStart);
      auctionEndCheck.setDate(auctionStart.getDate() + 2);
      if (now.getTime() > auctionEndCheck.getTime()) {
        auctionStart.setDate(auctionStart.getDate() + 7);
      }

      const auctionEnd = new Date(auctionStart);
      auctionEnd.setDate(auctionStart.getDate() + 2);

      let target, mode;

      if (now.getTime() >= auctionStart.getTime() && now.getTime() < auctionEnd.getTime()) {
        target = auctionEnd;
        mode = "Auction ends in";
        setAuctionLive(true);
        axiosInstance.get('/auctions/live');
      } else {
        target = auctionStart;
        mode = "Auction starts in";
        setAuctionLive(false);
        axiosInstance.get('/auctions/upcoming');
      }
      
      setAuctionMode(mode);

      const diff = target.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTime();
    const timerId = setInterval(calculateTime, 1000);

    return () => clearInterval(timerId);
  }, [setAuctionLive]);

  return (
    <div className="flex flex-col items-center mt-2">
      <span className="text-base font-semibold text-[#6b4c35] mb-1">
        {auctionMode}
      </span>
      <span className="text-sm text-gray-700 font-semibold">
        ⏳ {String(timeLeft.hours).padStart(2, "0")} hrs :{" "}
        {String(timeLeft.minutes).padStart(2, "0")} min :{" "}
        {String(timeLeft.seconds).padStart(2, "0")} sec
      </span>
    </div>
  );
};

export default Timer;