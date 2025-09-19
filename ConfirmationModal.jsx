/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from './ToggleButton';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gray-800/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-md mx-4 z-10 w-full"
      >
        <div className="flex items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="ml-4 text-left">
                <h2 id="confirm-title" className="text-lg font-bold text-gray-900">
                  {title}
                </h2>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">{children}</p>
                </div>
            </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onClose} className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;