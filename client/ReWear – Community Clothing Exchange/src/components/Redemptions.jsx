import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { Gift, CheckCircle, XCircle, Clock, Package } from "lucide-react";

function Redemptions() {
  const { url } = useAppContext();
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchRedemptions();
  }, []);

  const fetchRedemptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${url}/redemptions/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setRedemptions(data.redemptions || []);
      } else {
        toast.error("Failed to load redemptions");
      }
    } catch (error) {
      console.error("Error fetching redemptions:", error);
      toast.error("Failed to load redemptions");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (redemptionId) => {
    setActionLoading(prev => ({ ...prev, [redemptionId]: true }));
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/redemptions/${redemptionId}/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Redemption completed successfully!");
        fetchRedemptions();
      } else {
        toast.error(data.message || "Failed to complete redemption");
      }
    } catch (error) {
      console.error("Error completing redemption:", error);
      toast.error("Failed to complete redemption");
    } finally {
      setActionLoading(prev => ({ ...prev, [redemptionId]: false }));
    }
  };

  const handleCancel = async (redemptionId) => {
    setActionLoading(prev => ({ ...prev, [redemptionId]: true }));
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/redemptions/${redemptionId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Redemption cancelled successfully!");
        fetchRedemptions();
      } else {
        toast.error(data.message || "Failed to cancel redemption");
      }
    } catch (error) {
      console.error("Error cancelling redemption:", error);
      toast.error("Failed to cancel redemption");
    } finally {
      setActionLoading(prev => ({ ...prev, [redemptionId]: false }));
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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "completed":
        return <CheckCircle size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <ClipLoader size={40} color="#3B82F6" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Redemptions</h2>
      
      {redemptions.length === 0 ? (
        <div className="text-center py-8">
          <Gift size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No redemptions yet
          </h3>
          <p className="text-gray-600">
            You haven't redeemed any items with points yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {redemptions.map((redemption) => (
            <div
              key={redemption._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Gift size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Points spent: {redemption.pointsSpent}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded text-xs flex items-center space-x-1 ${getStatusColor(redemption.status)}`}>
                  {getStatusIcon(redemption.status)}
                  <span className="capitalize">{redemption.status}</span>
                </span>
              </div>

              <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded">
                  <img
                    src={getImageUrl(redemption.item?.images)}
                    alt={redemption.item?.title}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='10' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{redemption.item?.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {redemption.item?.category} • {redemption.item?.size} • {redemption.item?.condition}
                  </p>
                  <p className="text-sm text-gray-500">
                    Redeemed on {new Date(redemption.createdAt).toLocaleDateString()}
                  </p>
                  {redemption.completedAt && (
                    <p className="text-sm text-gray-500">
                      Completed on {new Date(redemption.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {redemption.status === "pending" && (
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleComplete(redemption._id)}
                    disabled={actionLoading[redemption._id]}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                  >
                    {actionLoading[redemption._id] ? (
                      <ClipLoader size={16} color="#fff" />
                    ) : (
                      <>
                        <CheckCircle size={16} className="mr-1" />
                        Mark as Received
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleCancel(redemption._id)}
                    disabled={actionLoading[redemption._id]}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                  >
                    {actionLoading[redemption._id] ? (
                      <ClipLoader size={16} color="#fff" />
                    ) : (
                      <>
                        <XCircle size={16} className="mr-1" />
                        Cancel
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Redemptions; 