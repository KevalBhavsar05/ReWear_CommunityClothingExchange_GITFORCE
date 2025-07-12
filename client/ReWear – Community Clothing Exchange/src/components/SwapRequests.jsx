import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { CheckCircle, XCircle, Clock, User, Package } from "lucide-react";

function SwapRequests() {
  const { url } = useAppContext();
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("received");
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchSwapRequests();
  }, []);

  const fetchSwapRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Fetch sent requests
      const sentResponse = await fetch(`${url}/swaps/sent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (sentResponse.ok) {
        const sentData = await sentResponse.json();
        setSentRequests(sentData.swapRequests || []);
      }
      
      // Fetch received requests
      const receivedResponse = await fetch(`${url}/swaps/received`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (receivedResponse.ok) {
        const receivedData = await receivedResponse.json();
        setReceivedRequests(receivedData.swapRequests || []);
      }
    } catch (error) {
      console.error("Error fetching swap requests:", error);
      toast.error("Failed to load swap requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    setActionLoading(prev => ({ ...prev, [requestId]: true }));
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/swaps/${requestId}/accept`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Swap request accepted successfully!");
        fetchSwapRequests();
      } else {
        toast.error(data.message || "Failed to accept swap request");
      }
    } catch (error) {
      console.error("Error accepting swap request:", error);
      toast.error("Failed to accept swap request");
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleReject = async (requestId) => {
    setActionLoading(prev => ({ ...prev, [requestId]: true }));
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/swaps/${requestId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Swap request rejected successfully!");
        fetchSwapRequests();
      } else {
        toast.error(data.message || "Failed to reject swap request");
      }
    } catch (error) {
      console.error("Error rejecting swap request:", error);
      toast.error("Failed to reject swap request");
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleComplete = async (requestId) => {
    setActionLoading(prev => ({ ...prev, [requestId]: true }));
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/swaps/${requestId}/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Swap completed successfully!");
        fetchSwapRequests();
      } else {
        toast.error(data.message || "Failed to complete swap");
      }
    } catch (error) {
      console.error("Error completing swap:", error);
      toast.error("Failed to complete swap");
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
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
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "accepted":
        return <CheckCircle size={16} />;
      case "rejected":
        return <XCircle size={16} />;
      case "completed":
        return <CheckCircle size={16} />;
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

  const requests = activeTab === "sent" ? sentRequests : receivedRequests;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Swap Requests</h2>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("received")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            activeTab === "received"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Received ({receivedRequests.length})
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            activeTab === "sent"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Sent ({sentRequests.length})
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-8">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No {activeTab} swap requests
          </h3>
          <p className="text-gray-600">
            {activeTab === "received" 
              ? "You haven't received any swap requests yet."
              : "You haven't sent any swap requests yet."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {activeTab === "received" 
                      ? `From: ${request.requester?.name || "Unknown"}`
                      : `To: ${request.itemOwner?.name || "Unknown"}`
                    }
                  </span>
                </div>
                <span className={`px-2 py-1 rounded text-xs flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  <span className="capitalize">{request.status}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Requested Item */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">You'll Receive:</h4>
                  <div className="flex space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded">
                      <img
                        src={getImageUrl(request.requestedItem?.images)}
                        alt={request.requestedItem?.title}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='10' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{request.requestedItem?.title}</p>
                      <p className="text-xs text-gray-500">
                        {request.requestedItem?.category} • {request.requestedItem?.size}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Offered Item */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">You'll Give:</h4>
                  <div className="flex space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded">
                      <img
                        src={getImageUrl(request.offeredItem?.images)}
                        alt={request.offeredItem?.title}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='10' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{request.offeredItem?.title}</p>
                      <p className="text-xs text-gray-500">
                        {request.offeredItem?.category} • {request.offeredItem?.size}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {request.message && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700">{request.message}</p>
                </div>
              )}

              {/* Action Buttons */}
              {activeTab === "received" && request.status === "pending" && (
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleAccept(request._id)}
                    disabled={actionLoading[request._id]}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                  >
                    {actionLoading[request._id] ? (
                      <ClipLoader size={16} color="#fff" />
                    ) : (
                      <>
                        <CheckCircle size={16} className="mr-1" />
                        Accept
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    disabled={actionLoading[request._id]}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                  >
                    {actionLoading[request._id] ? (
                      <ClipLoader size={16} color="#fff" />
                    ) : (
                      <>
                        <XCircle size={16} className="mr-1" />
                        Reject
                      </>
                    )}
                  </button>
                </div>
              )}

              {request.status === "accepted" && (
                <div className="mt-4">
                  <button
                    onClick={() => handleComplete(request._id)}
                    disabled={actionLoading[request._id]}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                  >
                    {actionLoading[request._id] ? (
                      <ClipLoader size={16} color="#fff" />
                    ) : (
                      <>
                        <CheckCircle size={16} className="mr-1" />
                        Mark as Completed
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="mt-3 text-xs text-gray-500">
                Requested on {new Date(request.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SwapRequests; 