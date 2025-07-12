import React from "react";
import { Link } from "react-router-dom";

function Items({ item }) {
  const getImageUrl = (images) => {
    if (images && images.length > 0) {
      // If it's a full URL, use it directly
      if (images[0].startsWith('http')) {
        return images[0];
      }
      // If it's a relative path, construct the full URL
      return `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/uploads/${images[0]}`;
    }
    // Default placeholder image
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3ENo Image Available%3C/text%3E%3C/svg%3E";
  };

  return (
    <div className="bg-white rounded shadow overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <img
        src={getImageUrl(item.images)}
        alt={item.title}
        className="w-full h-40 object-cover"
        onError={(e) => {
          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3ENo Image Available%3C/text%3E%3C/svg%3E";
        }}
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">{item.category}</span>
          <span className="text-sm text-gray-500">{item.size}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">{item.condition}</span>
          <span className={`px-2 py-1 rounded text-xs ${
            item.type === 'Points' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {item.type}
          </span>
        </div>
        {item.points && (
          <div className="text-sm text-gray-600 mb-3">
            Points: {item.points}
          </div>
        )}
        <Link
          to={`/product/${item._id}`}
          className="inline-block w-full text-center bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-3 rounded transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default Items;
