import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AppLayout from "./layouts/app-layout";

import "./App.css";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Auction from "./pages/auction";
import Sell from "./pages/sell";
import Discover from "./pages/discover";
import Shop from "./pages/shop";
import BiddingFrontend from "./pages/biddingFrontend";
import Admin from "./pages/admin";
import ProfilePage from "./components/ProfilePage";
import { isTokenExpired, logoutUser } from './axiosInstance';
import About from "./pages/about";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import Contact from "./pages/contact";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/auctions",
        element: <Auction />,
      },
      {
        path: "/sell",
        element: <Sell />,
      },

      {
        path: "/discover",
        element: <Discover />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/terms",
        element: <Terms />,
      },
      {
        path: "/privacy",
        element: <Privacy />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },

      {
        path: "/biddingFrontend/:paintingId", // Dynamic route with paintingId
        element: <BiddingFrontend />,
      },
    ],
  },
]);

// Check token on app load
const token = localStorage.getItem('token');

// Uncomment the line below to clear token on app load (for testing purposes)
// localStorage.removeItem('token');

if (token && isTokenExpired(token)) {
  logoutUser();
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
