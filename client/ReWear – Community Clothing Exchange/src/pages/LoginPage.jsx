import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

function LoginPage() {
  const navigate = useNavigate();
  const [isLogInPage, setIsLogInPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    country: "",
  });

  const { login, url } = useAppContext();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, email, password, confirmPassword, city, country } = formData;

    try {
      if (isLogInPage) {
        if (!email || !password) {
          toast.error("Please fill all fields.");
          return setIsLoading(false);
        }

        const res = await fetch(`${url}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        setIsLoading(false);

        console.log("Login response:", data); // Debug log

        if (res.ok && data.success) {
          // Check if user data exists
          if (!data.user) {
            console.error("No user data in response:", data);
            toast.error("Invalid response from server");
            return;
          }
          
          // Check if token exists
          if (!data.token) {
            console.error("No token in response:", data);
            toast.error("Authentication token not received");
            return;
          }
          
          console.log("User data:", data.user); // Debug log
          console.log("User isAdmin:", data.user.isAdmin); // Debug log
          
          // Call login with user data and token
          await login(data.user, data.token);
          toast.success(data.message);
          
          // Navigate based on user role with null check
          if (data.user.isAdmin === true) {
            console.log("Navigating to admin panel");
            navigate("/admin", { replace: true });
          } else {
            console.log("Navigating to home page");
            navigate("/", { replace: true });
          }
        } else {
          console.error("Login failed:", data);
          toast.error(data.message || "Login failed");
        }
      } else {
        if (
          !name ||
          !email ||
          !password ||
          !confirmPassword ||
          !city ||
          !country
        ) {
          toast.error("Please fill all fields.");
          return setIsLoading(false);
        }

        if (password !== confirmPassword) {
          toast.error("Passwords do not match.");
          return setIsLoading(false);
        }

        const res = await fetch(`${url}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, email, password, city, country }),
        });

        const data = await res.json();
        setIsLoading(false);

        if (res.ok && data.success) {
          toast.success(data.message);
          setIsLogInPage(true);

          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            city: "",
            country: "",
          });
        } else {
          toast.error(data.message || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 mt-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isLogInPage ? "Login" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogInPage && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@domain.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {!isLogInPage && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select City</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <ClipLoader size={20} color="#fff" />
            ) : isLogInPage ? (
              "Login"
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-center text-sm text-gray-600">
            {isLogInPage
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <span
              onClick={() => {
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                  city: "",
                  country: "",
                });
                setIsLogInPage((prev) => !prev);
              }}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              {isLogInPage ? "Sign Up" : "Login"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
