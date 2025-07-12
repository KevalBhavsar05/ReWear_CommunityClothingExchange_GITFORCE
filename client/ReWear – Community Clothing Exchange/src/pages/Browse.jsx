import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Categories from "../components/Categories.jsx";
import Items from "../components/Items.jsx";

function Browse() {
  const { url } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    size: "",
    condition: "",
    tag: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    // Update filters when URL params change
    const category = searchParams.get("category") || "";
    setFilters(prev => ({ ...prev, category }));
  }, [searchParams]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url}/items`);
      
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      } else {
        console.error("Failed to fetch items");
        toast.error("Failed to load items");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    
    // Update URL params for category
    if (name === "category") {
      if (value) {
        setSearchParams({ category: value });
      } else {
        setSearchParams({});
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      size: "",
      condition: "",
      tag: "",
    });
    setSearchParams({});
  };

  const filteredItems = items.filter((item) => {
    return (
      (!filters.category || item.category === filters.category) &&
      (!filters.size || item.size === filters.size) &&
      (!filters.condition || item.condition === filters.condition) &&
      (!filters.tag ||
        item.title.toLowerCase().includes(filters.tag.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.tag.toLowerCase()))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader size={50} color="#3B82F6" />
      </div>
    );
  }

  return (
    <div className="px-6">
      <h2 className="text-2xl font-bold mb-4">Browse Items</h2>
      <div className="mb-8">
        <Categories />
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Clear All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Tops">Tops</option>
            <option value="Bottoms">Bottoms</option>
            <option value="Dresses">Dresses</option>
            <option value="Outerwear">Outerwear</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
            <option value="Other">Other</option>
          </select>

          <select
            name="size"
            value={filters.size}
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Sizes</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>

          <select
            name="condition"
            value={filters.condition}
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Conditions</option>
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Used">Used</option>
          </select>

          <input
            type="text"
            name="tag"
            placeholder="Search by title or description"
            value={filters.tag}
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredItems.length} of {items.length} items
          {filters.category && ` in ${filters.category}`}
        </p>
      </div>

      {/* Items */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Items item={item} key={item._id} className="mb-4" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No items match the selected filters.</p>
          <button
            onClick={clearFilters}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default Browse;
