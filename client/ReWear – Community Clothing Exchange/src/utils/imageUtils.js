// Sample clothing images for testing and demonstration
export const sampleImages = [
  {
    name: "Blue Denim Jacket",
    category: "Outerwear",
    url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
    type: "Swap"
  },
  {
    name: "White T-Shirt",
    category: "Tops",
    url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    type: "Points"
  },
  {
    name: "Black Jeans",
    category: "Bottoms",
    url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    type: "Swap"
  },
  {
    name: "Summer Dress",
    category: "Dresses",
    url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
    type: "Points"
  },
  {
    name: "Leather Jacket",
    category: "Outerwear",
    url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    type: "Swap"
  },
  {
    name: "Sneakers",
    category: "Shoes",
    url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    type: "Points"
  },
  {
    name: "Sunglasses",
    category: "Accessories",
    url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    type: "Swap"
  },
  {
    name: "Hoodie",
    category: "Tops",
    url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    type: "Points"
  },
  {
    name: "Formal Shirt",
    category: "Tops",
    url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop",
    type: "Swap"
  },
  {
    name: "Winter Coat",
    category: "Outerwear",
    url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
    type: "Points"
  }
];

// Download image as blob
export const downloadImage = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
};

// Convert blob to file
export const blobToFile = (blob, fileName) => {
  return new File([blob], fileName, { type: blob.type });
};

// Download multiple images
export const downloadMultipleImages = async (imageUrls) => {
  const downloadedImages = [];
  
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const blob = await downloadImage(imageUrls[i]);
      const file = blobToFile(blob, `image_${i + 1}.jpg`);
      downloadedImages.push(file);
    } catch (error) {
      console.error(`Error downloading image ${i + 1}:`, error);
    }
  }
  
  return downloadedImages;
};

// Generate sample form data based on image
export const generateSampleFormData = (sampleImage) => {
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
  const conditions = ["New", "Like New", "Good", "Fair", "Used"];
  
  return {
    title: sampleImage.name,
    description: `A beautiful ${sampleImage.category.toLowerCase()} item. Perfect condition and ready for exchange.`,
    category: sampleImage.category,
    type: sampleImage.type,
    size: sizes[Math.floor(Math.random() * sizes.length)],
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    points: sampleImage.type === "Points" ? Math.floor(Math.random() * 100) + 50 : "",
    tags: `${sampleImage.category.toLowerCase()}, ${sampleImage.type.toLowerCase()}, fashion, clothing`
  };
}; 