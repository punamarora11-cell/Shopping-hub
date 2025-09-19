/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Button from './ToggleButton';

const CartPage = ({ cartItems, onUpdateQuantity, onRemoveItem, onNavigate }) => {
    if (cartItems.length === 0) {
        return (
            <div className="text-center py-20">
                <ShoppingBag size={64} className="mx-auto text-gray-300" />
                <h1 className="mt-4 text-3xl font-bold text-gray-800">Your cart is empty</h1>
                <p className="mt-2 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
                <Button onClick={() => onNavigate('home')} className="mt-6">
                    Start Shopping
                </Button>
            </div>
        );
    }
    
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                            <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                            <div className="ml-4 flex-grow">
                                <h2 className="font-semibold text-lg">{item.name}</h2>
                                <p className="text-gray-600">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button size="sm" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">
                                    <Minus size={16}/>
                                </Button>
                                <span className="w-10 text-center font-semibold">{item.quantity}</span>
                                <Button size="sm" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">
                                    <Plus size={16}/>
                                </Button>
                            </div>
                            <div className="ml-6 text-right w-24">
                                <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <button onClick={() => onRemoveItem(item.id)} className="ml-6 text-gray-400 hover:text-red-500" aria-label={`Remove ${item.name} from cart`}>
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                         <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                         <div className="flex justify-between mb-2 text-gray-600">
                             <span>Subtotal</span>
                             <span>${cartTotal.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between mb-4 text-gray-600">
                             <span>Shipping</span>
                             <span>Free</span>
                         </div>
                         <div className="border-t pt-4 flex justify-between font-bold text-lg">
                             <span>Total</span>
                             <span>${cartTotal.toFixed(2)}</span>
                         </div>
                         <Button onClick={() => onNavigate('checkout')} className="w-full mt-6">
                            Proceed to Checkout
                         </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;