import Header from "../components/header";
import Footer from "../components/footer";
import { Outlet } from "react-router-dom";
import WalletModal from "../components/WalletModal";
import React, { useState } from "react";

const AppLayout = () => {
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* 🔹 Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1] fade-in-bg"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔹 Overlay for theme */}
      <div className="absolute inset-0 bg-[#fffaf3]/80 z-[-1]" />

      {/* 🔹 Main Layout Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header
          setIsWalletOpen={setIsWalletOpen}
        />
        {/* Backdrop and Modal */}
        {isWalletOpen && (
          <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30">
            <WalletModal
              isOpen={isWalletOpen}
              onClose={() => setIsWalletOpen(false)}
            />
          </div>
        )}

        
        <main className="flex-grow pt-16">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
