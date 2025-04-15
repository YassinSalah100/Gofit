import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would call an API
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover opacity-20"
              src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
              alt="Newsletter background"
            />
          </div>
          <div className="relative py-12 px-6 sm:px-12 lg:px-16">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Join Our Community
              </h2>
              <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                Subscribe to receive exclusive deals, early access to new products, and monthly training tips from professional athletes.
              </p>
              <form onSubmit={handleSubmit} className="mt-8 sm:flex sm:max-w-md sm:mx-auto">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  name="email-address"
                  id="email-address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="w-full px-5 py-3 placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:outline-none sm:max-w-xs rounded-l-md"
                  placeholder="Enter your email"
                />
                <div className="mt-3 sm:mt-0 rounded-r-md sm:flex-shrink-0">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-r-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
              {subscribed && (
                <p className="mt-4 text-sm text-green-400">
                  Thank you for subscribing! Check your email for confirmation.
                </p>
              )}
              <p className="mt-4 text-sm text-gray-400">
                By subscribing, you agree to our Privacy Policy and Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;