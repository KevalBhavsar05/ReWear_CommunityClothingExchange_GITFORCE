import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { url, userData, isLoggedIn, getUserData, setUserData } = useAppContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [userInteractions, setUserInteractions] = useState({
    hasRequestedSwap: false,
    hasRedeemed: false
  });

  useEffect(() => {
    fetchProduct();
    if (isLoggedIn) {
      checkUserInteractions();
    }
  }, [id, isLoggedIn]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url}/items/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setProduct(data.item);
      } else {
        toast.error("Failed to load product details");
        navigate("/browse");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
      navigate("/browse");
    } finally {
      setLoading(false);
    }
  };

  const checkUserInteractions = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Check if user has requested a swap for this item
      const swapResponse = await fetch(`${url}/swaps/sent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (swapResponse.ok) {
        const swapData = await swapResponse.json();
        const hasRequestedSwap = swapData.swapRequests?.some(
          request => request.requestedItem._id === id && 
          (request.status === "pending" || request.status === "accepted")
        );
        setUserInteractions(prev => ({ ...prev, hasRequestedSwap }));
      }
      
      // Check if user has redeemed this item
      const redemptionResponse = await fetch(`${url}/redemptions/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (redemptionResponse.ok) {
        const redemptionData = await redemptionResponse.json();
        const hasRedeemed = redemptionData.redemptions?.some(
          redemption => redemption.item._id === id && 
          (redemption.status === "pending" || redemption.status === "completed")
        );
        setUserInteractions(prev => ({ ...prev, hasRedeemed }));
      }
    } catch (error) {
      console.error("Error checking user interactions:", error);
    }
  };

  const getImageUrl = (images, index = 0) => {
    if (images && images.length > index) {
      if (images[index].startsWith('http')) {
        return images[index];
      }
      return `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/uploads/${images[index]}`;
    }
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='%236b7280'%3ENo Image Available%3C/text%3E%3C/svg%3E";
  };

  const handleSwap = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to request a swap");
      navigate("/login");
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/items/${id}/swap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Swap request sent successfully!");
        setUserInteractions(prev => ({ ...prev, hasRequestedSwap: true }));
        // Refresh product data to show updated status
        await fetchProduct();
      } else {
        toast.error(data.message || "Failed to request swap");
      }
    } catch (error) {
      console.error("Error requesting swap:", error);
      toast.error("Failed to request swap");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to redeem with points");
      navigate("/login");
      return;
    }

    if (!product.points) {
      toast.error("This item is not available for points redemption");
      return;
    }

    if (userData.points < product.points) {
      toast.error("Insufficient points to redeem this item");
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/items/${id}/redeem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Item redeemed successfully!");
        setUserInteractions(prev => ({ ...prev, hasRedeemed: true }));
        // Update user data with the response data
        if (data.user) {
          setUserData(data.user);
        } else {
          // Fallback to refresh user data
          await getUserData();
        }
        // Refresh product data to show it's no longer available
        await fetchProduct();
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Failed to redeem item");
      }
    } catch (error) {
      console.error("Error redeeming item:", error);
      toast.error("Failed to redeem item");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader size={50} color="#3B82F6" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate("/browse")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  // Check if user owns this item
  const isOwner = isLoggedIn && userData?._id === product.owner?._id;

  return (
    <div className="max-w-4xl mx-auto pt-24 px-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Product Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div>
            <img
              src={getImageUrl(product.images)}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='%236b7280'%3ENo Image Available%3C/text%3E%3C/svg%3E";
              }}
            />
            {/* Additional Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {product.images.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={getImageUrl(product.images, index)}
                    alt={`${product.title} ${index + 1}`}
                    className="w-20 h-20 object-cover rounded cursor-pointer"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='10' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
            <p className="text-gray-600 text-lg">{product.description}</p>
            
            {/* Owner Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Listed by</p>
              <p className="font-medium text-gray-900">{product.owner?.name || "Unknown User"}</p>
              {product.owner?.city && (
                <p className="text-sm text-gray-600">{product.owner.city}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Category</span>
                <p className="text-lg">{product.category}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Size</span>
                <p className="text-lg">{product.size}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Condition</span>
                <p className="text-lg">{product.condition}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Type</span>
                <p className="text-lg">{product.type}</p>
              </div>
            </div>

            {product.points && (
              <div>
                <span className="text-sm font-medium text-gray-500">Points Required</span>
                <p className="text-2xl font-bold text-blue-600">{product.points}</p>
                {isLoggedIn && (
                  <p className="text-sm text-gray-600">
                    Your points: {userData.points || 0}
                  </p>
                )}
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-500">Tags</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!isOwner && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {/* Swap Button */}
                {product.type === 'Swap' && !userInteractions.hasRequestedSwap && (
                  <button
                    onClick={handleSwap}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {actionLoading ? (
                      <ClipLoader size={20} color="#fff" />
                    ) : (
                      "Request Swap"
                    )}
                  </button>
                )}
                
                {/* Already Requested Swap */}
                {product.type === 'Swap' && userInteractions.hasRequestedSwap && (
                  <div className="flex-1 bg-blue-100 text-blue-800 px-6 py-3 rounded-lg text-center">
                    Swap Requested ✓
                  </div>
                )}
                
                {/* Redeem Button */}
                {product.type === 'Points' && !userInteractions.hasRedeemed && (
                  <button
                    onClick={handleRedeem}
                    disabled={actionLoading || !isLoggedIn || (userData.points || 0) < (product.points || 0)}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {actionLoading ? (
                      <ClipLoader size={20} color="#fff" />
                    ) : (
                      "Redeem with Points"
                    )}
                  </button>
                )}
                
                {/* Already Redeemed */}
                {product.type === 'Points' && userInteractions.hasRedeemed && (
                  <div className="flex-1 bg-green-100 text-green-800 px-6 py-3 rounded-lg text-center">
                    Item Redeemed ✓
                  </div>
                )}
              </div>
            )}

            {/* Owner Actions */}
            {isOwner && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => navigate(`/edit-item/${product._id}`)}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Edit Item
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  View in Dashboard
                </button>
              </div>
            )}

            {!isLoggedIn && !isOwner && (
              <p className="text-sm text-gray-600 text-center">
                Please <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 hover:underline"
                >
                  login
                </button> to interact with this item
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
