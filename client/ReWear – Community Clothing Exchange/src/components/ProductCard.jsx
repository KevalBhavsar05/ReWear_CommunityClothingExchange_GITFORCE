import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, User, MapPin } from "lucide-react";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative h-48 bg-gray-200">
        <img
          src={getImageUrl(product.images)}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3ENo Image Available%3C/text%3E%3C/svg%3E";
          }}
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(product.type)}`}>
            {product.type}
          </span>
        </div>
        {product.type === "Points" && (
          <div className="absolute top-2 left-2">
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
              {product.points} pts
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <User size={14} />
            <span>{product.owner?.name || "Unknown User"}</span>
          </div>
          {product.owner?.city && (
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <MapPin size={14} />
              <span>{product.owner.city}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{product.category}</span>
          <span>{product.size}</span>
          <span>{product.condition}</span>
        </div>

        {product.tags && product.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="text-gray-400 text-xs">+{product.tags.length - 3} more</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard; 