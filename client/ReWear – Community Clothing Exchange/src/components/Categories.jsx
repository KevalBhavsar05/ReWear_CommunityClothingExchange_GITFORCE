import React from "react";
import { useNavigate } from "react-router-dom";

function Categories() {
  const navigate = useNavigate();
  
  const categories = [
    { name: "Tops", icon: "👕", color: "bg-blue-50" },
    { name: "Bottoms", icon: "👖", color: "bg-indigo-50" },
    { name: "Dresses", icon: "👗", color: "bg-pink-50" },
    { name: "Outerwear", icon: "🧥", color: "bg-gray-50" },
    { name: "Shoes", icon: "👟", color: "bg-green-50" },
    { name: "Accessories", icon: "👜", color: "bg-purple-50" },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/browse?category=${category}`);
  };

  return (
    <section className="mt-10 px-6">
      <h3 className="text-xl font-semibold mb-4">Browse by Category</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <div
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            className={`${category.color} p-4 rounded-lg shadow-sm text-center cursor-pointer hover:shadow-md transition-shadow duration-200 hover:scale-105 transition-transform duration-200`}
          >
            <div className="text-3xl mb-2">{category.icon}</div>
            <div className="font-medium text-gray-700">{category.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;
