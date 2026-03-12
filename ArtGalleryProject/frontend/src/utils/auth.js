import { jwtDecode } from "jwt-decode";
import axiosInstance from '../axiosInstance';
import { useState, useEffect } from 'react';

// Get role by decoding the JWT token using jwt-decode library
export function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch (e) {
    return null;
  }
}

// Get username from localStorage or fetch from profile
export async function getUsername() {
  // First try to get from localStorage
  const cachedUsername = localStorage.getItem("username");
  if (cachedUsername) {
    return cachedUsername;
  }

  // If not in localStorage, fetch from profile
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    const response = await axiosInstance.get("/user/profile");
    const username = response.data.name;
    if (username) {
      localStorage.setItem("username", username);
      return username;
    }
    return null;
  } catch (e) {
    console.error("Failed to fetch username:", e);
    return null;
  }
}

// Get username synchronously (for immediate use in components)
export function getUsernameSync() {
  return localStorage.getItem("username");
}

// useAuth hook for React components
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded JWT token:", decoded);
        setUser({
          email: decoded.email,
          userId: decoded.userId,
          role: decoded.role
        });
      } catch (e) {
        console.error("Failed to decode token:", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  return { user, loading };
}