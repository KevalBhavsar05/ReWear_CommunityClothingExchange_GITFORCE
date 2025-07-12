import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { Edit, Trash2, Eye, Package, Plus } from "lucide-react";

function MyListedItems() {
  const { url } = useAppContext();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${url}/items/user/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      } else {
        toast.error("Failed to load your items");
      }
    } catch (error) {
      console.error("Error fetching my items:", error);
      toast.error("Failed to load your items");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [itemId]: true }));
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Item deleted successfully!");
        fetchMyItems();
      } else {
        toast.error(data.message || "Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
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

  const getTypeColor = (type) => {
    switch (type) {
      case "Swap":
        return "bg-blue-100 text-blue-800";
      case "Points":
        return "bg-green-100 text-green-800";
      case "Free":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (isApproved, isAvailable) => {
    if (!isApproved) return "bg-yellow-100 text-yellow-800";
    if (!isAvailable) return "bg-red-100 text-red-800";
    return "bg-green-100 text-green-800";
  };

  const getStatusText = (isApproved, isAvailable) => {
    if (!isApproved) return "Pending";
    if (!isAvailable) return "Unavailable";
    return "Available";
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Listed Items</h2>
        <button
          onClick={() => navigate("/upload")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus size={16} />
          <span>Add New Item</span>
        </button>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-8">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No items listed yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start by uploading your first item to share with the community!
          </p>
          <button
            onClick={() => navigate("/upload")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Upload Your First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
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
                <div className="absolute top-2 right-2 flex space-x-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.isApproved, item.isAvailable)}`}>
                    {getStatusText(item.isApproved, item.isAvailable)}
                  </span>
                </div>
                {item.type === "Points" && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                      {item.points} pts
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>{item.category}</span>
                  <span>{item.size}</span>
                  <span>{item.condition}</span>
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-gray-400 text-xs">+{item.tags.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Listed on {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/product/${item._id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    
                    <button
                      onClick={() => navigate(`/edit-item/${item._id}`)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
                      title="Edit Item"
                    >
                      <Edit size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={actionLoading[item._id]}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors duration-200 disabled:opacity-50"
                      title="Delete Item"
                    >
                      {actionLoading[item._id] ? (
                        <ClipLoader size={16} color="#DC2626" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListedItems; 