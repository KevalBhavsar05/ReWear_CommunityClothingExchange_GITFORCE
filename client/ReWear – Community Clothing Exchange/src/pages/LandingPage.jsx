import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Star,
  Users,
  Package,
  TrendingUp,
  Heart
} from "lucide-react";
import Footer from "../components/footer.jsx";
import Categories from "../components/Categories.jsx";

function LandingPage() {
  const { url, isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url}/items?limit=8&approved=true`);
      
      if (response.ok) {
        const data = await response.json();
        setFeaturedItems(data.items || []);
      } else {
        console.error("Failed to fetch featured items");
      }
    } catch (error) {
      console.error("Error fetching featured items:", error);
    } finally {
      setLoading(false);
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredItems.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? Math.ceil(featuredItems.length / 4) - 1 : prev - 1
    );
  };

  const carouselItems = featuredItems.slice(currentSlide * 4, (currentSlide + 1) * 4);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-100 via-yellow-50 to-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Swap clothes. <span className="text-yellow-500">Save the planet.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Give your unused clothes a second life and earn points or swap items directly. 
            Join the sustainable fashion revolution today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate("/browse")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 flex items-center justify-center"
            >
              Start Browsing
              <ArrowRight size={20} className="ml-2" />
            </button>
            <button 
              onClick={() => navigate("/upload")}
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 flex items-center justify-center"
            >
              Upload Items
              <Package size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">500+</h3>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package size={24} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">1,200+</h3>
              <p className="text-gray-600">Items Listed</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp size={24} className="text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">300+</h3>
              <p className="text-gray-600">Successful Swaps</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart size={24} className="text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">50kg</h3>
              <p className="text-gray-600">CO2 Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Items</h2>
            <button 
              onClick={() => navigate("/browse")}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              View All
              <ArrowRight size={16} className="ml-1" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <ClipLoader size={40} color="#3B82F6" />
            </div>
          ) : featuredItems.length > 0 ? (
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {carouselItems.map((item) => (
                  <div 
                    key={item._id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <div className="h-48 bg-gray-200">
                      <img
                        src={getImageUrl(item.images)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3ENo Image Available%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">{item.category}</span>
                        <span className="text-xs text-gray-500">{item.size}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.type === 'Points' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {item.type}
                        </span>
                        {item.points && (
                          <span className="text-xs text-blue-600 font-medium">
                            {item.points} pts
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Navigation */}
              {featuredItems.length > 4 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <button
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.ceil(featuredItems.length / 4) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                          index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Items Available</h3>
              <p className="text-gray-600 mb-4">Be the first to upload items!</p>
              <button
                onClick={() => navigate("/upload")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Upload First Item
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <Categories />

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Your Items</h3>
              <p className="text-gray-600">
                Take photos of your unused clothes and upload them to the platform. 
                Set your preferred exchange method.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Browse & Connect</h3>
              <p className="text-gray-600">
                Explore items from other users. Request swaps or redeem with points. 
                Connect with fellow fashion enthusiasts.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Complete Exchange</h3>
              <p className="text-gray-600">
                Arrange meetups or shipping. Complete your exchange and earn points 
                for future redemptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Sustainable Fashion Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already making a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isLoggedIn ? (
              <>
                <button 
                  onClick={() => navigate("/login")}
                  className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  Sign Up Now
                </button>
                <button 
                  onClick={() => navigate("/login")}
                  className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
                >
                  Login
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate("/browse")}
                className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Start Browsing
              </button>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}

export default LandingPage;
