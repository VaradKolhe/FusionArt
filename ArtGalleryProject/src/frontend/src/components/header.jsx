import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserRole, getUsernameSync, getUsername } from "../utils/auth";
// import WalletModal from "./WalletModal";

const Header = ({ setIsWalletOpen }) => {
  const token = localStorage.getItem("token");
  const userRole = getUserRole();
  const [username, setUsername] = useState(getUsernameSync());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = {
    auctions: "/auctions",
    sell: "/sell",
    // departments: "/departments",
    discover: "/discover",
    shop: "/shop",
  };

  if (userRole === "ROLE_ADMIN") {
    navLinks.admin = "/admin";
  }

  const isLoggedIn = !!token; // Use token for login check
  // Example usage: you can use userRole to conditionally render UI
  // e.g. const isAdmin = userRole === "ADMIN";

  // Fetch username when component mounts and user is logged in
  useEffect(() => {
    const fetchUsername = async () => {
      if (isLoggedIn && !username) {
        try {
          const fetchedUsername = await getUsername();
          if (fetchedUsername) {
            setUsername(fetchedUsername);
          }
        } catch (error) {
          console.error("Failed to fetch username:", error);
        }
      }
    };

    fetchUsername();
  }, [isLoggedIn, username]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl shadow-lg border-b  text-sm">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-5">
        <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-8">
          <Link to="/" className="group inline-block relative w-fit">
            <div className="relative h-6 overflow-hidden">
              {/* Default Text */}
              <h1
                className="text-xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#6b4c35] to-[#b88c5e] 
                 transition-all duration-500 font-bold       ease-in-out group-hover:-translate-y-6"
              >
                FUSION ART
              </h1>

              {/* Hover Text */}
              <h1
                className="absolute top-6 left-0 text-md text-center ml-2 font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#6b4c35] to-[#b88c5e] 
                 transition-all duration-500 ease-in-out group-hover:-translate-y-6"
              >
                Go to Home Page
              </h1>
            </div>

            {/* Underline Animation */}
            <span className="block h-0.5 w-0 bg-[#6b4c35] group-hover:w-full transition-all duration-500 mt-1"></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 uppercase font-serif tracking-wider text-xs text-gray-700">
            {Object.keys(navLinks).map((item) => (
              <Link to={navLinks[item]} key={item} className="relative group">
                {item.charAt(0).toUpperCase() + item.slice(1)}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 shadow hover:bg-gray-200 transition duration-200"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Right side - Profile/Login/Wallet */}
        <div className="hidden md:flex items-center gap-4">




          {isLoggedIn ? (
            <div className="flex flex-row gap-3">
              <button
                onClick={() => setIsWalletOpen(true)}
                className="group flex cursor-pointer items-center overflow-hidden transition-all duration-300 ease-in-out w-9 hover:w-24 bg-orange-50 rounded-full shadow-sm shadow-black"
              >
                {/* Wallet Icon */}
                <div className="w-9 h-9 flex items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 ml-2  text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m4-5h-4a1 1 0 00-1 1v2a1 1 0 001 1h4v-4z"
                    />
                  </svg>
                </div>

                {/* Appearing Text */}
                <span className="whitespace-nowrap text-sm text-[#6b4c35] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Wallet
                </span>
              </button>
              <span className="border-l mt-3 h-4 border-gray-400"></span>
              <Link
                to="/profile"
                className="group flex items-center gap-2 overflow-hidden"
              >
                {/* Profile Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 15c2.21 0 4.29.534 6.121 1.477M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                {/* Default Text */}
                <span className="relative w-[150px] font-serif h-6 overflow-hidden">
                  <span className="absolute transition-all duration-300 ease-in-out group-hover:-translate-y-6 text-base font-bold text-gray-700">
                    Hi,<span className="text-orange-900"> {username} </span>
                  </span>
                  <span className="absolute transition-all text-base duration-300 ease-in-out translate-y-6 group-hover:translate-y-0 font-bold text-gray-700">
                    Explore Yourself
                  </span>
                </span>
              </Link>
            </div>
          ) : (
            <Link to="/login">
              <button className="hover:shadow-lg hover:shadow-gray-300 border-1 h-8 w-16 rounded-2xl px-2 text-sm text-gray-800 hover:cursor-pointer">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pt-4 pb-6 space-y-4 text-gray-700 font-serif shadow-md transition-all duration-300">
          {Object.keys(navLinks).map((item) => (
            <Link
              to={navLinks[item]}
              key={item}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-medium tracking-wide hover:text-gray-900 transition duration-200"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}

          <div className="pt-4 border-t border-gray-200">
            {isLoggedIn ? (
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-semibold hover:text-gray-900 transition duration-200"
              >
                Hi, {username}
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-semibold hover:text-gray-900 transition duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
