/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { User, Mail, Package, ShoppingBag } from 'lucide-react';
import Button from './ToggleButton';

const UserProfilePage = ({ user, orders }) => {
    
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Shipped':
        return 'bg-blue-100 text-blue-700';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-full mr-4">
                <User size={24} className="text-gray-600"/>
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 flex items-center gap-2"><Mail size={14}/> {user.email}</p>
            </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Order History</h2>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">Order ID: <span className="font-mono text-sm text-gray-600">{order.id}</span></h3>
                  <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="border-t pt-3">
                 {order.products.map(product => (
                    <div key={product.id} className="flex justify-between items-center text-sm mb-1">
                        <span className="text-gray-700">{product.name} (x{product.quantity})</span>
                    </div>
                 ))}
              </div>

              <div className="text-right font-bold mt-2 border-t pt-2">
                Total: ${order.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <ShoppingBag size={48} className="mx-auto text-gray-300" />
            <p className="mt-4 text-gray-600">You haven't placed any orders yet.</p>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
