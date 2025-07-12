import React, { useState } from "react";
import { Download, Plus } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { 
  sampleImages, 
  downloadMultipleImages, 
  generateSampleFormData 
} from "../utils/imageUtils";

function SampleImages({ onImageSelect, onFormDataPopulate, showDownloadAll = true }) {
  const [downloading, setDownloading] = useState(false);

  const handleSampleImageDownload = async (sampleImage) => {
    try {
      setDownloading(true);
      
      // Download the image
      const downloadedImages = await downloadMultipleImages([sampleImage.url]);
      
      if (downloadedImages.length > 0) {
        // Call the callback with downloaded images
        if (onImageSelect) {
          onImageSelect(downloadedImages, [sampleImage.url]);
        }
        
        // Generate and populate form data
        if (onFormDataPopulate) {
          const sampleData = generateSampleFormData(sampleImage);
          onFormDataPopulate(sampleData);
        }
        
        toast.success(`Downloaded ${sampleImage.name}!`);
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
      const imageUrls = sampleImages.map(img => img.url);
      const downloadedImages = await downloadMultipleImages(imageUrls);
      
      if (downloadedImages.length > 0) {
        if (onImageSelect) {
          onImageSelect(downloadedImages, imageUrls);
        }
        
        toast.success(`Downloaded ${downloadedImages.length} sample images!`);
      }
    } catch (error) {
      console.error("Error downloading sample images:", error);
      toast.error("Failed to download sample images");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Sample Images</h2>
        {showDownloadAll && (
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
                Download All
              </>
            )}
          </button>
        )}
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
              <p className="text-sm font-medium text-gray-800">{sample.name}</p>
              <p className="text-xs text-gray-500">{sample.category} • {sample.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SampleImages; 