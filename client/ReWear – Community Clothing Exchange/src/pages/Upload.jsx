import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useAppContext } from "../context/AppContext";
import { Download, Plus, X } from "lucide-react";
import {
  sampleImages,
  downloadMultipleImages,
  generateSampleFormData,
} from "../utils/imageUtils";

function Upload() {
  const navigate = useNavigate();
  const { url, userData, isLoggedIn } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "Swap",
    size: "",
    condition: "",
    points: "",
    tags: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setImages(files);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);

    setImages(newImages);
    setPreviewImages(newPreviews);
  };

  const handleSampleImageDownload = async (sampleImage) => {
    try {
      setDownloading(true);

      // Download the image
      const downloadedImages = await downloadMultipleImages([sampleImage.url]);

      if (downloadedImages.length > 0) {
        setImages(downloadedImages);
        setPreviewImages([sampleImage.url]);

        // Generate and populate form data
        const sampleData = generateSampleFormData(sampleImage);
        setFormData(sampleData);

        toast.success(`Downloaded ${sampleImage.name} and populated form!`);
      }
    } catch (error) {
      console.error("Error downloading sample image:", error);
      toast.error("Failed to download sample image");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAllSamples = async () => {
    try {
      setDownloading(true);

      // Download all sample images
      const imageUrls = sampleImages.map((img) => img.url);
      const downloadedImages = await downloadMultipleImages(imageUrls);

      if (downloadedImages.length > 0) {
        setImages(downloadedImages);
        setPreviewImages(imageUrls);

        toast.success(`Downloaded ${downloadedImages.length} sample images!`);
      }
    } catch (error) {
      console.error("Error downloading sample images:", error);
      toast.error("Failed to download sample images");
    } finally {
      setDownloading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userData._id) {
        toast.error("Please login to upload items");
        setLoading(false);
        return;
      }

      if (images.length === 0) {
        toast.error("Please select at least one image");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();

      // Add form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add images
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const token = localStorage.getItem("token");

      const response = await fetch(`${url}/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Item uploaded successfully! Pending approval.");
        navigate("/browse");
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Check if user is logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">Please log in to upload items.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-center mb-8">
            Upload New Item
          </h1>

          {/* Sample Images Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Sample Images
              </h2>
              <button
                type="button"
                onClick={handleDownloadAllSamples}
                disabled={downloading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <ClipLoader size={16} color="#fff" />
                ) : (
                  <>
                    <Download size={16} className="mr-2" />
                    Download All Samples
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {sampleImages.map((sample, index) => (
                <div key={index} className="relative group">
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleSampleImageDownload(sample)}
                      disabled={downloading}
                      className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                    >
                      {downloading ? (
                        <ClipLoader size={12} color="#fff" />
                      ) : (
                        "Use This"
                      )}
                    </button>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-gray-800">
                      {sample.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {sample.category} • {sample.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Blue Denim Jacket"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your item..."
                required
              />
            </div>

            {/* Category and Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Swap">Swap</option>
                  <option value="Points">Points</option>
                </select>
              </div>
            </div>

            {/* Size and Condition */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Size *</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Size</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                  <option value="One Size">One Size</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Condition</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Used">Used</option>
                </select>
              </div>
            </div>

            {/* Points (only for Points type) */}
            {formData.type === "Points" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Points Required *
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter points required"
                  min="1"
                  required
                />
              </div>
            )}

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., denim, casual, vintage (comma separated)"
              />
            </div>

            {/* Image Upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  Images * (Max 5)
                </label>
                {images.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setImages([]);
                      setPreviewImages([]);
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />

              {/* Image Previews */}
              {previewImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Images ({previewImages.length}/5)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 py-1 rounded-b-lg">
                          Image {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : "Upload Item"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Upload;
