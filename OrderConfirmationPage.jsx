/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { CheckCircle, Package } from 'lucide-react';
import Button from './ToggleButton';

const OrderConfirmationPage = ({ order, onNavigate }) => {
  if (!order) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-gray-800">No order details found.</h1>
        <Button onClick={() => onNavigate('home')} className="mt-6">
          Return to Shop
        </Button>
      </div>
    );
  }

  const { id, total, products, paymentMethod } = order;

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Thank you for your order!</h1>
      <p className="mt-4 text-gray-600">Your order has been placed successfully and is now being processed.</p>
      
      <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg text-left shadow-sm">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Order Summary</h2>
          <div className="flex justify-between items-baseline mb-4">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono text-sm font-semibold text-gray-800">{id}</span>
          </div>
           <div className="flex justify-between items-baseline mb-4">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-semibold text-gray-800 capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}</span>
          </div>
          <div className="space-y-2 mb-4">
             <h3 className="font-semibold text-gray-600">Items:</h3>
             {products.map(product => (
                 <div key={product.id} className="flex justify-between text-sm ml-2">
                     <span className="text-gray-600">{product.name} (x{product.quantity})</span>
                 </div>
             ))}
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
          </div>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Button onClick={() => onNavigate('home')}>
          Continue Shopping
        </Button>
        <Button onClick={() => onNavigate('profile')} className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100">
           <Package size={16} className="mr-2"/> View My Orders
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;