/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';

// FIX: Made the onClick prop optional by providing a default empty function. This resolves errors where the Button component was used without an onClick handler.
const Button = ({ children, onClick = () => {}, className = '', type = 'button', size = 'md', ...props }) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const baseStyles = 'inline-flex items-center gap-2 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const defaultStyles = 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${className || defaultStyles}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;