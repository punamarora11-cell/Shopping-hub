/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import Button from './ToggleButton';

const ProductCard = ({ product, onAddToCart }) => {
  const shopName = product.shopId.replace('shopId', 'Shop '); // Simple mapping for display
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl flex flex-col">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`w-full h-48 object-cover ${isOutOfStock ? 'grayscale' : ''}`}
        />
        {product.onSale && !isOutOfStock && <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">SALE</div>}
        {isOutOfStock && <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">OUT OF STOCK</div>}
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{shopName}</p>
          {product.options && product.options.length > 0 && (
            <div className="mt-2 space-y-1">
              {product.options.map(opt => (
                <p key={opt.name} className="text-xs text-gray-600">
                  <span className="font-semibold">{opt.name}:</span> {opt.values.join(', ')}
                </p>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
          {isOutOfStock ? (
            <Button
                size="sm"
                disabled
                className="bg-gray-300 text-gray-500 cursor-not-allowed"
            >
              Out of Stock
            </Button>
          ) : (
             <Button
                onClick={() => onAddToCart(product)}
                size="sm"
                aria-label="Add to cart"
             >
               <ShoppingCart size={16} />
             </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;