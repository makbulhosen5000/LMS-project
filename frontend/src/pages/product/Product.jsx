import { useContext, useEffect, useState } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { FaRegUser } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../components/common/Http";
import { toast } from "react-toastify";
import { CartContext } from "../../components/provider/CartProvider";

export default function Product() {
  const [mainImage, setMainImage] = useState("");
  const [productSizes, setProductSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating] = useState(4);
  const [user] = useState("Makbul Hosen");
  const [product, setProduct] = useState({});
  const [productImages, setProductImages] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { id } = useParams();

  const handleAddToCart = () => {
    if (productSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size before adding to cart.");
      return;
    }
    addToCart(product, selectedSize, quantity);
    toast.success("Product added to cart successfully!");
  };

  const getProduct = async () => {
    try {
      const response = await fetch(`${apiUrl}/get-product/${id}`);
      const result = await response.json();
      if (result?.data) {
        setProduct(result.data);
        setProductImages(result.data.product_images || []);
        setMainImage(result.data.image_url || "");
        setProductSizes(result.data.product_sizes || []);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 my-12 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl backdrop-blur-sm">
        {/* Left: Image Gallery */}
        <div>
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img
              src={mainImage}
              alt="Product"
              className="w-full h-[450px] object-cover transform hover:scale-105 transition-all duration-500"
            />
          </div>
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {productImages && productImages.map((img, i) => (
              <img
                key={i}
                src={img.image_url}
                alt={`Thumbnail ${i}`}
                onClick={() => setMainImage(img.image_url)}
                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition-all duration-300 hover:scale-105 ${
                  mainImage === img.image_url
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-between sticky top-6">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
              {product?.title || "Loading..."}
            </h2>

            {/* Price */}
            <h3 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-4 py-1 rounded-xl shadow">
                ${product?.discount_price ?? product?.price ?? 0}
              </span>
              {product?.price && product.discount_price && (
                <span className="ml-3 line-through text-gray-500 text-lg">
                  ${product.price}
                </span>
              )}
            </h3>

            {/* Description */}
            <p className="text-gray-700 mb-4 leading-relaxed">
              {product?.short_description?.slice(0, 150)}
            </p>
            <p className="text-gray-500 mb-6">SKU: {product?.sku}</p>

            {/* Size Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Select Size
              </label>
              <div className="flex flex-wrap gap-3">
                {productSizes.length > 0 ? (
                  productSizes.map((productSize) => (
                    <button
                      key={productSize.id}
                      onClick={() => setSelectedSize(productSize?.size?.size)}
                      className={`px-5 py-2 rounded-xl border transition-all duration-300 ${
                        selectedSize === productSize?.size?.size
                          ? "bg-blue-600 text-white border-blue-600 scale-105"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {productSize?.size?.size}
                    </button>
                  ))
                ) : (
                  <p>No sizes available</p>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  -
                </button>
                <span className="px-5 text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-lg font-bold rounded-2xl shadow-lg hover:opacity-90 transition-all duration-300"
          >
            <ShoppingCart size={20} />
            Add {quantity} to Cart
          </button>
        </div>
      </div>

      {/* Product Description */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8 my-12">
        <h2 className="text-2xl font-bold mb-4 underline">Description</h2>
        <div
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product?.description || "" }}
        />
      </div>

      {/* Reviews */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 underline">
          Reviews and Ratings
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <FaRegUser className="text-gray-600" />
          <p className="font-bold">{user}</p>
        </div>
        <div className="flex items-center text-yellow-500 mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} size={20} fill="currentColor" />
          ))}
          <Star size={20} className="text-gray-300" />
          <span className="ml-2 text-sm text-gray-600">(123 reviews)</span>
        </div>
        <p className="text-gray-700 leading-relaxed mb-3">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </p>
      </div>
    </>
  );
}
