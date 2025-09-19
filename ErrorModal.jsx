/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Shield, Mail, Lock, Building, CheckCircle } from 'lucide-react';
import Button from './ToggleButton';

const LoginPage = ({ isOpen, onClose, onLogin, onSignup, onForgotPassword }) => {
  if (!isOpen) return null;

  const [activeRoleTab, setActiveRoleTab] = useState('customer'); // customer, shopkeeper
  const [formType, setFormType] = useState('signin'); // signin, signup, forgotPassword
  const [emailSent, setEmailSent] = useState(false); // For forgot password confirmation

  useEffect(() => {
    // Reset state when modal is closed to ensure it opens in a clean state
    if (!isOpen) {
      setTimeout(() => {
        setFormType('signin');
        setActiveRoleTab('customer');
        setEmailSent(false);
      }, 200); // Delay to allow for closing animation
    }
  }, [isOpen]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    onLogin({ email, password, role: activeRoleTab });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (activeRoleTab === 'customer') {
      const name = e.target.name.value;
      onSignup({ name, email, password, role: 'customer' });
    } else {
      const ownerName = e.target.ownerName.value;
      const shopName = e.target.shopName.value;
      onSignup({ ownerName, shopName, email, password, role: 'shopkeeper' });
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      await onForgotPassword({ email });
      setEmailSent(true);
    } catch (error) {
      console.error("Forgot password submission failed in modal", error);
      // The error alert is handled in the parent component for consistency.
    }
  };
  
  const handleAdminLogin = () => {
    onLogin({ email: 'admin@example.com', role: 'admin' });
  };

  const commonInputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow";

  const renderForm = () => {
    if (formType === 'signin') {
      return (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label htmlFor="email-signin" className="sr-only">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
              <input id="email-signin" name="email" type="email" required placeholder="Email address" className={`${commonInputClasses} pl-10`} />
            </div>
          </div>
          <div>
            <label htmlFor="password-signin" className="sr-only">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
              <input id="password-signin" name="password" type="password" required placeholder="Password" className={`${commonInputClasses} pl-10`} />
            </div>
          </div>
           <div className="text-right text-sm">
             <button
               type="button"
               onClick={() => { setFormType('forgotPassword'); setEmailSent(false); }}
               className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
             >
               Forgot Password?
             </button>
           </div>
          <Button type="submit" className="w-full justify-center">Sign In</Button>
        </form>
      );
    }

    if (formType === 'forgotPassword') {
        if (emailSent) {
          return (
            <div className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-4 text-lg font-semibold text-gray-800">Check your email</h3>
                <p className="mt-2 text-sm text-gray-600">
                    If an account with that email exists, we have sent a password reset link.
                </p>
                <Button onClick={() => setFormType('signin')} className="mt-6 w-full justify-center">
                    Back to Sign In
                </Button>
            </div>
          );
        }
        return (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <p className="text-sm text-gray-600 text-center">Enter your email address and we will send you a link to reset your password.</p>
            <div>
              <label htmlFor="email-forgot" className="sr-only">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                <input id="email-forgot" name="email" type="email" required placeholder="Email address" className={`${commonInputClasses} pl-10`} />
              </div>
            </div>
            <Button type="submit" className="w-full justify-center">Send Reset Link</Button>
            <div className="text-center">
                <button type="button" onClick={() => setFormType('signin')} className="text-sm font-semibold text-gray-600 hover:text-blue-600">Back to Sign In</button>
            </div>
          </form>
        );
    }
    
    if (activeRoleTab === 'customer') {
      return (
        <form onSubmit={handleSignupSubmit} className="space-y-4">
          <div>
            <label htmlFor="name-signup" className="sr-only">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
              <input id="name-signup" name="name" type="text" required placeholder="Full Name" className={`${commonInputClasses} pl-10`} />
            </div>
          </div>
          <div>
            <label htmlFor="email-signup" className="sr-only">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
              <input id="email-signup" name="email" type="email" required placeholder="Email address" className={`${commonInputClasses} pl-10`} />
            </div>
          </div>
          <div>
            <label htmlFor="password-signup" className="sr-only">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
              <input id="password-signup" name="password" type="password" required placeholder="Password" className={`${commonInputClasses} pl-10`} />
            </div>
          </div>
          <Button type="submit" className="w-full justify-center">Create Account</Button>
        </form>
      );
    }
    
    return (
      <form onSubmit={handleSignupSubmit} className="space-y-4">
        <div>
            <label htmlFor="ownerName-signup" className="sr-only">Your Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
              <input id="ownerName-signup" name="ownerName" type="text" required placeholder="Your Name" className={`${commonInputClasses} pl-10`} />
            </div>
        </div>
        <div>
            <label htmlFor="shopName-signup" className="sr-only">Shop Name</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
              <input id="shopName-signup" name="shopName" type="text" required placeholder="Shop Name" className={`${commonInputClasses} pl-10`} />
            </div>
        </div>
        <div>
            <label htmlFor="email-shop-signup" className="sr-only">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
              <input id="email-shop-signup" name="email" type="email" required placeholder="Email address" className={`${commonInputClasses} pl-10`} />
            </div>
        </div>
        <div>
            <label htmlFor="password-shop-signup" className="sr-only">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
              <input id="password-shop-signup" name="password" type="password" required placeholder="Password" className={`${commonInputClasses} pl-10`} />
            </div>
        </div>
        <Button type="submit" className="w-full justify-center">Apply to be a Shopkeeper</Button>
      </form>
    );
  };

  const getRoleTabClasses = (role) => 
    `w-1/2 py-2.5 text-sm font-medium leading-5 text-center rounded-lg focus:outline-none transition-colors duration-200 ${
      activeRoleTab === role
        ? 'bg-blue-600 text-white shadow'
        : 'text-gray-600 hover:bg-gray-200'
    }`;
  
  const getFormToggleClasses = (type) =>
    `font-semibold transition-colors ${formType === type ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500 cursor-pointer'}`;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-800/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div role="dialog" aria-modal="true" aria-labelledby="login-title" className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-200 max-w-sm mx-4 z-10 w-full">
        <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close login">
          <X size={24} />
        </button>
        
        <h2 id="login-title" className="text-xl font-bold text-gray-900 mb-4 text-center">Welcome to Shopping Hub</h2>
        
        {formType !== 'forgotPassword' && (
            <>
                <div className="bg-gray-100 p-1 rounded-lg flex mb-4">
                    <button onClick={() => { setActiveRoleTab('customer'); setFormType('signin'); }} className={getRoleTabClasses('customer')}>
                        <User className="inline-block h-5 w-5 mr-1 align-text-bottom"/> Customer
                    </button>
                    <button onClick={() => { setActiveRoleTab('shopkeeper'); setFormType('signin'); }} className={getRoleTabClasses('shopkeeper')}>
                        <Briefcase className="inline-block h-5 w-5 mr-1 align-text-bottom"/> Shopkeeper
                    </button>
                </div>
                
                <div className="mb-4 text-center">
                    <h3 className="text-lg font-semibold">
                        {activeRoleTab === 'customer' ? 'Customer' : 'Shopkeeper'} Portal
                    </h3>
                </div>

                <div className="flex justify-center gap-6 mb-4 text-sm">
                    <button onClick={() => setFormType('signin')} className={getFormToggleClasses('signin')}>Sign In</button>
                    <button onClick={() => setFormType('signup')} className={getFormToggleClasses('signup')}>Sign Up</button>
                </div>
            </>
        )}
        
        {formType === 'forgotPassword' && (
            <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold">
                   Reset Your Password
                </h3>
            </div>
        )}

        {renderForm()}
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300"></span></div>
          <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">Or</span></div>
        </div>

        <Button onClick={handleAdminLogin} className="w-full justify-center bg-gray-700 hover:bg-gray-800 focus:ring-gray-500">
          <Shield size={16} className="mr-2" />
          Login as Admin
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;