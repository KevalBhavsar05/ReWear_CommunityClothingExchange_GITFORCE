import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const storedToken = localStorage.getItem("token");
    const tokenCreatedAt = localStorage.getItem("tokenCreatedAt");

    const oneDayInMs = 24 * 60 * 60 * 1000;

    if (
      storedToken &&
      tokenCreatedAt &&
      Date.now() - parseInt(tokenCreatedAt) < oneDayInMs
    ) {
      setIsLoggedIn(true);
      await getUserData();
    } else {
      // Token is expired or missing
      localStorage.removeItem("token");
      localStorage.removeItem("tokenCreatedAt");
      localStorage.setItem("isLoggedIn", "false");
      setIsLoggedIn(false);
      setUserData({});
    }
    setLoading(false);
  };

  const login = async (userData, token) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("token", token);
    localStorage.setItem("tokenCreatedAt", Date.now());
    setIsLoggedIn(true);
    setUserData(userData);
  };

  const logout = () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("token");
    localStorage.removeItem("tokenCreatedAt");
    setIsLoggedIn(false);
    setUserData({});
  };

  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      const res = await fetch(`${url}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        console.log("User data:", data);
        if (data.success) {
          setUserData(data.user);
        } else {
          // Token is invalid, logout
          logout();
        }
      } else {
        console.error("Failed to fetch user data:", res.status);
        // Token is invalid, logout
        logout();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Don't logout on network errors, just log
    }
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        url,
        userData,
        setUserData,
        loading,
        getUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
