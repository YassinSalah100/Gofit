import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    name: 'Fitness Equipment',
    description: 'Professional-grade equipment for your home gym',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  },
  {
    name: 'Sports Apparel',
    description: 'Performance wear for every athlete',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  },
  {
    name: 'Team Sports',
    description: "Equipment for your team's success",
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  },
  {
    name: 'Training Accessories',
    description: 'Essential tools for peak performance',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  },
];

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    // In a real app, this would filter products by category
    navigate('/', { state: { selectedCategory: category.name } });
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Shop by Category
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Find the perfect equipment for your sport
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => handleCategoryClick(category)}
              className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-80">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                  <p className="mt-2 text-sm text-gray-300">{category.description}</p>
                  <button className="mt-4 inline-flex items-center text-sm font-medium text-white hover:text-red-400 transition-colors">
                    Shop Now
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;