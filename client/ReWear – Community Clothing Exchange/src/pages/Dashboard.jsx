import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { 
  User, 
  Package, 
  TrendingUp, 
  Gift, 
  Users, 
  Calendar,
  BarChart3,
  Activity,
  ShoppingBag,
  Heart
} from "lucide-react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import SwapRequests from "../components/SwapRequests";
import Redemptions from "../components/Redemptions";
import MyListedItems from "../components/MyListedItems";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const { url, isLoggedIn } = useAppContext();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user is logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Fetch user data
      const userResponse = await fetch(`${url}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.user);
      }
      
      // Fetch user stats
      const statsResponse = await fetch(`${url}/auth/user/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    monthlyGrowth: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Items Added",
          data: [12, 19, 15, 25, 22, 30],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
        },
      ],
    },
    categoryDistribution: {
      labels: ["Tops", "Bottoms", "Dresses", "Outerwear", "Accessories"],
      datasets: [
        {
          data: [30, 25, 20, 15, 10],
          backgroundColor: [
            "#3B82F6",
            "#10B981",
            "#F59E0B",
            "#EF4444",
            "#8B5CF6",
          ],
        },
      ],
    },
    activityChart: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Activity",
          data: [5, 8, 12, 6, 9, 15, 7],
          backgroundColor: "rgba(59, 130, 246, 0.8)",
        },
      ],
    },
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <ClipLoader size={40} color="#3B82F6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name || "User"}!
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === "overview"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("my-items")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === "my-items"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            My Items
          </button>
          <button
            onClick={() => setActiveTab("swaps")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === "swaps"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Swap Requests
          </button>
          <button
            onClick={() => setActiveTab("redemptions")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === "redemptions"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Redemptions
          </button>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.totalItems || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Items</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.activeItems || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed Swaps</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.completedSwaps || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Gift className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Points Balance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {user?.points || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Monthly Growth
                </h3>
                <Line data={chartData.monthlyGrowth} options={chartOptions} />
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Category Distribution
                </h3>
                <Doughnut data={chartData.categoryDistribution} options={chartOptions} />
              </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Weekly Activity
              </h3>
              <Bar data={chartData.activityChart} options={chartOptions} />
            </div>

            {/* User Profile Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Name</p>
                  <p className="text-lg text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-lg text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">City</p>
                  <p className="text-lg text-gray-900">{user?.city || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Country</p>
                  <p className="text-lg text-gray-900">{user?.country || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Points Earned</p>
                  <p className="text-lg text-gray-900">{stats?.pointsEarned || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Points Spent</p>
                  <p className="text-lg text-gray-900">{stats?.pointsSpent || 0}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "my-items" && <MyListedItems />}
        {activeTab === "swaps" && <SwapRequests />}
        {activeTab === "redemptions" && <Redemptions />}
      </div>
    </div>
  );
}

export default Dashboard; 