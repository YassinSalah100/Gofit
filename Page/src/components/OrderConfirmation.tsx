import React from 'react';
import { useLocation } from 'react-router-dom';
import { Check, Printer } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderDetails } = location.state || {};
  const orderNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

  const handlePrint = () => {
    window.print();
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Order not found</h2>
          <p className="mt-2 text-gray-600">Please try placing your order again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Thank you for your order!</h1>
            <p className="mt-2 text-lg text-gray-600">
              Order #{orderNumber}
            </p>
          </div>

          <div className="border-t border-b border-gray-200 py-6 my-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="space-y-4">
              {orderDetails.products.map((product) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-gray-500">Weight: {product.weight}</p>
                  </div>
                  <p className="font-medium text-gray-900">${product.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Address</h3>
              <p className="text-gray-600">
                {orderDetails.customer.firstName} {orderDetails.customer.lastName}<br />
                {orderDetails.customer.address}<br />
                {orderDetails.customer.city}, {orderDetails.customer.postalCode}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Method</h3>
              <p className="text-gray-600 capitalize">{orderDetails.shipping} Shipping</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="border-t pt-6">
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Printer className="h-5 w-5 mr-2" />
              Print Order Details
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>A confirmation email has been sent to {orderDetails.customer.email}</p>
            <p className="mt-2">
              If you have any questions about your order, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;