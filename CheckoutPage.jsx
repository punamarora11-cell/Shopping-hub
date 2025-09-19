/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import Button from './ToggleButton';

const CheckoutPage = ({ cartItems, onPlaceOrder, onNavigate }) => {
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [upiId, setUpiId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (paymentMethod === 'upi' && !upiId.match(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/)) {
            alert('Please enter a valid UPI ID (e.g., yourname@bank).');
            return;
        }
        setIsProcessing(true);
        // Simulate a small delay for processing
        setTimeout(() => {
            onPlaceOrder({
                method: paymentMethod,
                upiId: paymentMethod === 'upi' ? upiId : null,
            });
        }, 1500);
    };
    
    if (cartItems.length === 0) {
        return (
             <div className="text-center py-20">
                <h1 className="mt-4 text-3xl font-bold text-gray-800">Your cart is empty</h1>
                <p className="mt-2 text-gray-500">Add items to your cart to proceed to checkout.</p>
                <Button onClick={() => onNavigate('home')} className="mt-6">
                    Return to Shop
                </Button>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                    <div className="space-y-4">
                         <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}>
                            <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden"/>
                            <Wallet className="mr-4 text-gray-600" />
                            <div>
                                <h3 className="font-semibold">Cash on Delivery</h3>
                                <p className="text-sm text-gray-500">Pay with cash upon delivery.</p>
                            </div>
                         </label>
                         <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}>
                             <input type="radio" name="paymentMethod" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="hidden"/>
                             <CreditCard className="mr-4 text-gray-600" />
                             <div>
                                <h3 className="font-semibold">UPI</h3>
                                <p className="text-sm text-gray-500">Pay with your UPI ID.</p>
                             </div>
                         </label>
                         {paymentMethod === 'upi' && (
                             <div className="pl-10 pt-2">
                                 <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">UPI ID</label>
                                 <input
                                     type="text"
                                     id="upiId"
                                     value={upiId}
                                     onChange={(e) => setUpiId(e.target.value)}
                                     placeholder="yourname@bank"
                                     required
                                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                 />
                             </div>
                         )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                         <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                         <div className="space-y-2 mb-4 border-b pb-4">
                             {cartItems.map(item => (
                                 <div key={item.id} className="flex justify-between text-sm">
                                     <span className="text-gray-600 truncate pr-2 flex-1">{item.name} x {item.quantity}</span>
                                     <span className="text-gray-800 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                 </div>
                             ))}
                         </div>
                         <div className="flex justify-between mb-2 text-gray-600">
                             <span>Subtotal</span>
                             <span>${cartTotal.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between mb-4 text-gray-600">
                             <span>Shipping</span>
                             <span className="font-semibold text-green-600">Free</span>
                         </div>
                         <div className="border-t pt-4 flex justify-between font-bold text-lg">
                             <span>Total</span>
                             <span>${cartTotal.toFixed(2)}</span>
                         </div>
                         <Button type="submit" className="w-full mt-6" disabled={isProcessing}>
                            {isProcessing ? 'Placing Order...' : `Place Order`}
                         </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;