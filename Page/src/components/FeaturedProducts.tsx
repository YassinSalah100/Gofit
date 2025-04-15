import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'Professional Dumbbell Set',
    price: 299.99,
    weight: '5-25kg',
    image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    category: 'Heavy Equipment',
  },
  {
    id: 2,
    name: 'Premium Training Shoes',
    price: 129.99,
    weight: '0.8kg',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    category: 'Footwear',
  },
  {
    id: 3,
    name: 'Olympic Barbell',
    price: 249.99,
    weight: '20kg',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    category: 'Heavy Equipment',
  },
  {
    id: 4,
    name: 'Compression Set',
    price: 89.99,
    weight: '0.3kg',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    category: 'Apparel',
  },
];

const FeaturedProducts = () => {
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    // In a real app, this would add to cart state/context
    navigate('/checkout', { state: { products: [product] } });
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Featured Products
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Top-rated gear for your training needs
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden group transform transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-64">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm">
                  {product.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xl font-semibold text-gray-900">${product.price}</p>
                  <span className="text-sm text-gray-500">Weight: {product.weight}</span>
                </div>
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;