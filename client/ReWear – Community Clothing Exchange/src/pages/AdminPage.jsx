import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { 
  Users, 
  Package, 
  TrendingUp, 
  Gift, 
  AlertCircle, 
  CheckCircle,
  BarChart3,
  Activity,
  UserCheck,
  ShoppingBag,
  XCircle,
  Eye
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

function AdminPage() {
  const { url, userData, isLoggedIn } = useAppContext();
  const [stats, setStats] = useState(null);
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user is admin
  if (!isLoggedIn || !userData?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchAdminStats();
    fetchPendingItems();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${url}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        toast.error("Failed to load admin statistics");
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      toast.error("Failed to load admin statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingItems = async () => {
    try {
      setPendingLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${url}/admin/pending-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPendingItems(data.items || []);
      } else {
        toast.error("Failed to load pending items");
      }
    } catch (error) {
      console.error("Error fetching pending items:", error);
      toast.error("Failed to load pending items");
    } finally {
      setPendingLoading(false);
    }
  };

  const handleApprove = async (itemId) => {
    setActionLoading(prev => ({ ...prev, [itemId]: true }));
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/admin/approve-item/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Item approved successfully!");
        fetchPendingItems();
        fetchAdminStats();
      } else {
        toast.error(data.message || "Failed to approve item");
      }
    } catch (error) {
      console.error("Error approving item:", error);
      toast.error("Failed to approve item");
    } finally {
      setActionLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleReject = async (itemId) => {
    if (!window.confirm("Are you sure you want to reject and delete this item?")) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [itemId]: true }));
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/admin/reject-item/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Item rejected successfully!");
        fetchPendingItems();
        fetchAdminStats();
      } else {
        toast.error(data.message || "Failed to reject item");
      }
    } catch (error) {
      console.error("Error rejecting item:", error);
      toast.error("Failed to reject item");
    } finally {
      setActionLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const getImageUrl = (images) => {
    if (images && images.length > 0) {
      if (images[0].startsWith('http')) {
        return images[0];
      }
      return `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/uploads/${images[0]}`;
    }
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3ENo Image Available%3C/text%3E%3C/svg%3E";
  };

  const chartData = {
    monthlyGrowth: {
      labels: stats?.monthlyGrowth?.map(item => item.month) || [],
      datasets: [
        {
          label: "Items Added",
          data: stats?.monthlyGrowth?.map(item => item.items) || [],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
        },
        {
          label: "New Users",
          data: stats?.monthlyGrowth?.map(item => item.users) || [],
          borderColor: "rgb(16, 185, 129)",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
        },
        {
          label: "Completed Swaps",
          data: stats?.monthlyGrowth?.map(item => item.swaps) || [],
          borderColor: "rgb(245, 158, 11)",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          tension: 0.4,
        },
      ],
    },
    categoryDistribution: {
      labels: stats?.categoryDistribution?.map(item => item._id) || [],
      datasets: [
        {
          data: stats?.categoryDistribution?.map(item => item.count) || [],
          backgroundColor: [
            "#3B82F6",
            "#10B981",
            "#F59E0B",
            "#EF4444",
            "#8B5CF6",
            "#06B6D4",
            "#84CC16",
            "#F97316",
          ],
        },
      ],
    },
    userActivity: {
      labels: stats?.topUsers?.map(user => user.name) || [],
      datasets: [
        {
          label: "Items Listed",
          data: stats?.topUsers?.map(user => user.itemCount) || [],
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Platform overview and statistics
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
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === "pending"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Pending Items ({pendingItems.length})
          </button>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.overview?.totalUsers || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.overview?.totalItems || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Items</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.overview?.pendingItems || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available Items</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.overview?.availableItems || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <UserCheck className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed Swaps</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.overview?.totalSwaps || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Activity className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Swaps</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.overview?.pendingSwaps || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Gift className="h-6 w-6 text-pink-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Redemptions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.overview?.totalRedemptions || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-teal-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Points Spent</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.overview?.totalPointsSpent || 0}
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

            {/* Top Users Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Users by Items Listed
              </h3>
              <Bar data={chartData.userActivity} options={chartOptions} />
            </div>

            {/* Top Users Table */}
            {stats?.topUsers && stats.topUsers.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Top Active Users
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items Listed
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.topUsers.map((user, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.itemCount}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "pending" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Items for Approval</h2>
            
            {pendingLoading ? (
              <div className="flex justify-center py-8">
                <ClipLoader size={40} color="#3B82F6" />
              </div>
            ) : pendingItems.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  All Caught Up!
                </h3>
                <p className="text-gray-600">
                  No items are pending approval.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingItems.map((item) => (
                  <div
                    key={item._id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={getImageUrl(item.images)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3ENo Image Available%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                          Pending
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <p className="font-medium">{item.category}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <p className="font-medium">{item.size}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Condition:</span>
                          <p className="font-medium">{item.condition}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <p className="font-medium">{item.type}</p>
                        </div>
                      </div>

                      {item.points && (
                        <div className="mb-3">
                          <span className="text-gray-500 text-sm">Points:</span>
                          <p className="font-medium text-blue-600">{item.points}</p>
                        </div>
                      )}

                      <div className="mb-3">
                        <span className="text-gray-500 text-sm">Owner:</span>
                        <p className="font-medium">{item.owner?.name || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{item.owner?.email}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(item._id)}
                          disabled={actionLoading[item._id]}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                        >
                          {actionLoading[item._id] ? (
                            <ClipLoader size={16} color="#fff" />
                          ) : (
                            <>
                              <CheckCircle size={16} className="mr-1" />
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(item._id)}
                          disabled={actionLoading[item._id]}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                        >
                          {actionLoading[item._id] ? (
                            <ClipLoader size={16} color="#fff" />
                          ) : (
                            <>
                              <XCircle size={16} className="mr-1" />
                              Reject
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
