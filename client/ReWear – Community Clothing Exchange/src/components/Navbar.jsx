import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAppContext } from "../context/AppContext";

function Navbar() {
  const { isLoggedIn, logout, userData } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClass =
    "px-3 py-2 rounded-md font-medium transition-colors duration-200";
  const activeClass = "text-yellow-400";
  const inactiveClass = "text-white hover:text-yellow-300";

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 fixed top-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className="text-white text-2xl font-bold">
            ReWear
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 items-center">
            <NavLink
              to="/browse"
              className={({ isActive }) =>
                `${navLinkClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              Browse
            </NavLink>
            <NavLink
              to="/upload"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `${navLinkClass} block ${
                  isActive ? activeClass : inactiveClass
                }`
              }
            >
              Upload
            </NavLink>

            {isLoggedIn && (
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `${navLinkClass} block ${
                    isActive ? activeClass : inactiveClass
                  }`
                }
              >
                Dashboard
              </NavLink>
            )}

            {userData?.isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `${navLinkClass} block ${
                    isActive ? activeClass : inactiveClass
                  }`
                }
              >
                Admin
              </NavLink>
            )}

            {!isLoggedIn ? (
              <NavLink
                to="/login"
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-1.5 rounded-md font-semibold"
              >
                Login
              </NavLink>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md font-semibold"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 px-4 pb-4 pt-2 space-y-2">
          <NavLink
            to="/browse"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `${navLinkClass} block ${isActive ? activeClass : inactiveClass}`
            }
          >
            Browse
          </NavLink>

          <NavLink
            to="/upload"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `${navLinkClass} block ${isActive ? activeClass : inactiveClass}`
            }
          >
            Upload
          </NavLink>

          {isLoggedIn && (
            <NavLink
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `${navLinkClass} block ${
                  isActive ? activeClass : inactiveClass
                }`
              }
            >
              Dashboard
            </NavLink>
          )}

          {userData?.isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `${navLinkClass} block ${
                  isActive ? activeClass : inactiveClass
                }`
              }
            >
              Admin
            </NavLink>
          )}

          {!isLoggedIn ? (
            <NavLink
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md"
            >
              Login
            </NavLink>
          ) : (
            <button
              onClick={handleLogout}
              className="block w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
