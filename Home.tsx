/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  Settings,
  Users,
  Package,
  DollarSign,
  BarChart,
  Truck,
  Search,
  Bell,
  Briefcase,
  Tag,
  PlusCircle,
} from 'lucide-react';

import Header from './components/Header';
import LoginPage from './components/ErrorModal';
import ProductCard from './components/CodePreview';
import Button from './components/ToggleButton';
import CartPage from './components/CartPage';
import UserProfilePage from './components/UserProfilePage';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import ConfirmationModal from './components/ConfirmationModal';


// --- MOCK DATA & SIMULATED BACKEND ---
// In a real application, this data would come from a Firebase backend.

let MOCK_ALL_USERS = [
    { id: 'cust1', name: 'John Doe', email: 'john.doe@example.com', role: 'customer' },
    { id: 'shop1', name: 'Alice', email: 'alice@example.com', role: 'shopkeeper', shopId: 'shopId1', canAddProducts: true },
    { id: 'admin1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    { id: 'cust2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'customer' },
    { id: 'shop2', name: 'Bob', email: 'bob@example.com', role: 'shopkeeper', shopId: 'shopId2', canAddProducts: false },
    { id: 'shop3', name: 'Charlie', email: 'charlie@example.com', role: 'shopkeeper', shopId: 'shopId3', canAddProducts: false },
];

let MOCK_SHOPS = [
  { id: 'shopId1', name: 'Alice\'s Gadgets', ownerId: 'shop1', approved: true },
  { id: 'shopId2', name: 'Bob\'s Books', ownerId: 'shop2', approved: true },
  { id: 'shopId3', name: 'Charlie\'s Crafts', ownerId: 'shop3', approved: false },
];

let MOCK_CATEGORIES = [
    { id: 'cat1', name: 'Electronics' },
    { id: 'cat2', name: 'Books' },
    { id: 'cat3', name: 'Clothing' },
    { id: 'cat4', name: 'Home Goods' },
];


let MOCK_PRODUCTS = [
  { id: 'prod1', name: 'Wireless Mouse', price: 25.99, shopId: 'shopId1', imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800', category: 'Electronics', stock: 10, options: [{name: 'Color', values: ['Black', 'White']}] },
  { id: 'prod2', name: 'Ergonomic Keyboard', price: 79.99, shopId: 'shopId1', imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800', category: 'Electronics', stock: 5, options: [] },
  { id: 'prod3', name: 'Sci-Fi Novel', price: 15.00, shopId: 'shopId2', imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800', category: 'Books', stock: 0, options: [{name: 'Format', values: ['Paperback', 'Hardcover']}] },
  { id: 'prod4', name: 'Handmade Scarf', price: 35.50, shopId: 'shopId3', imageUrl: 'https://images.unsplash.com/photo-1542060748-10c28b62716f?q=80&w=800', category: 'Clothing', stock: 20, options: [{name: 'Color', values: ['Red', 'Blue']}, {name: 'Material', values: ['Wool', 'Cotton']}] },
  { id: 'prod5', name: 'Bluetooth Speaker', price: 45.00, shopId: 'shopId1', imageUrl: 'https://images.unsplash.com/photo-1545454675-3533b33421d5?q=80&w=800', onSale: true, category: 'Electronics', stock: 0, options: [] },
];

let MOCK_ORDERS = [
    { id: 'order1', userId: 'cust1', shopId: 'shopId1', products: [{id: 'prod1', name: 'Wireless Mouse', quantity: 1}], total: 25.99, status: 'Delivered', date: '2024-07-15', paymentMethod: 'upi' },
    { id: 'order2', userId: 'cust1', shopId: 'shopId2', products: [{id: 'prod3', name: 'Sci-Fi Novel', quantity: 2}], total: 30.00, status: 'Shipped', date: '2024-07-18', paymentMethod: 'cod' },
    { id: 'order3', userId: 'cust1', shopId: 'shopId1', products: [{id: 'prod2', name: 'Ergonomic Keyboard', quantity: 1}, {id: 'prod5', name: 'Bluetooth Speaker', quantity: 1}], total: 124.99, status: 'Processing', date: '2024-07-20', paymentMethod: 'upi' },
];

let MOCK_AUTOMATIONS = [
    { id: 'auto1', name: 'Low Stock Alert', trigger: 'stock_below', action: 'email_admin', config: { threshold: 5 } },
    { id: 'auto2', name: 'New Shopkeeper Notification', trigger: 'new_application', action: 'email_admin', config: {} }
];


// --- Simulated Firebase API ---
const api = {
  login: async ({ email, password, role }) => {
    console.log(`Simulating login for email: ${email}, role: ${role}`);
    // NOTE: Password is not checked in this mock implementation
    const user = MOCK_ALL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (user) {
        // If shopkeeper, check if their shop exists
        if (role === 'shopkeeper') {
            const shop = MOCK_SHOPS.find(s => s.id === user.shopId);
            if (!shop) {
                return Promise.reject(new Error('Associated shop not found for this shopkeeper.'));
            }
        }
        return Promise.resolve(user);
    }
    return Promise.reject(new Error('User not found or role mismatch. Please check your credentials or sign up.'));
  },
  signupCustomer: async ({ name, email, password }) => {
    console.log(`Simulating signup for customer: ${name}`);
    if (MOCK_ALL_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return Promise.reject(new Error('Email already in use.'));
    }
    const newUser = {
        id: `cust${Date.now()}`,
        name,
        email,
        role: 'customer'
    };
    MOCK_ALL_USERS.push(newUser);
    return Promise.resolve(newUser);
  },
  signupShopkeeper: async ({ ownerName, shopName, email, password }) => {
    console.log(`Simulating signup for shopkeeper: ${ownerName} for shop ${shopName}`);
    if (MOCK_ALL_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return Promise.reject(new Error('Email already in use.'));
    }
    const newUserId = `shop${Date.now()}`;
    const newShopId = `shopId${Date.now()}`;
    const newUser = {
        id: newUserId,
        name: ownerName,
        email,
        role: 'shopkeeper',
        shopId: newShopId,
        canAddProducts: false,
    };
    MOCK_ALL_USERS.push(newUser);
    
    const newShop = {
        id: newShopId,
        name: shopName,
        ownerId: newUserId,
        approved: false,
    };
    MOCK_SHOPS.push(newShop);
    
    return Promise.resolve(newUser);
  },
  getProducts: async () => {
    console.log('Simulating fetching all products');
    return Promise.resolve(MOCK_PRODUCTS);
  },
  getShopProducts: async (shopId) => {
    console.log(`Simulating fetching products for shop: ${shopId}`);
    return Promise.resolve(MOCK_PRODUCTS.filter(p => p.shopId === shopId));
  },
  getShopkeepers: async () => {
    return Promise.resolve(MOCK_SHOPS);
  },
  getShopDetails: async (shopId) => {
    console.log(`Fetching details for shop ${shopId}`);
    return Promise.resolve(MOCK_SHOPS.find(s => s.id === shopId));
  },
  getAllOrders: async () => {
    return Promise.resolve(MOCK_ORDERS);
  },
  getUsers: async () => {
    return Promise.resolve(MOCK_ALL_USERS);
  },
  getShopOrders: async (shopId) => {
    return Promise.resolve(MOCK_ORDERS.filter(o => o.shopId === shopId));
  },
  getUserOrders: async (userId) => {
    console.log(`Simulating fetching orders for user: ${userId}`);
    return Promise.resolve(MOCK_ORDERS.filter(o => o.userId === userId));
  },
  updateOrderStatus: async (orderId, newStatus) => {
    console.log(`Simulating update for order ${orderId} to status ${newStatus}`);
    const orderIndex = MOCK_ORDERS.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      MOCK_ORDERS[orderIndex].status = newStatus;
      return Promise.resolve(MOCK_ORDERS[orderIndex]);
    }
    return Promise.reject(new Error('Order not found'));
  },
  updateUserRole: async (userId, newRole) => {
    console.log(`Simulating update for user ${userId} to role ${newRole}`);
    const userIndex = MOCK_ALL_USERS.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        MOCK_ALL_USERS[userIndex].role = newRole;
        return Promise.resolve(MOCK_ALL_USERS[userIndex]);
    }
    return Promise.reject(new Error('User not found'));
  },
  deleteUser: async (userId) => {
    console.log(`Simulating deleting user ${userId}`);
    const initialLength = MOCK_ALL_USERS.length;
    MOCK_ALL_USERS = MOCK_ALL_USERS.filter(u => u.id !== userId);
    if (MOCK_ALL_USERS.length < initialLength) {
        return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error('User not found'));
  },
  approveShop: async (shopId) => {
    console.log(`Simulating approving shop ${shopId}`);
    const shopIndex = MOCK_SHOPS.findIndex(s => s.id === shopId);
    if (shopIndex !== -1) {
        MOCK_SHOPS[shopIndex].approved = true;
        // Also grant the owner product add permissions by default
        const ownerId = MOCK_SHOPS[shopIndex].ownerId;
        const ownerIndex = MOCK_ALL_USERS.findIndex(u => u.id === ownerId);
        if (ownerIndex !== -1) {
            MOCK_ALL_USERS[ownerIndex].canAddProducts = true;
        }
        return Promise.resolve(MOCK_SHOPS[shopIndex]);
    }
    return Promise.reject(new Error('Shop not found'));
  },
  rejectShop: async (shopId) => {
    console.log(`Simulating rejecting shop ${shopId}`);
    const shop = MOCK_SHOPS.find(s => s.id === shopId);
    if (shop) {
        // Delete the shop and the associated user
        MOCK_SHOPS = MOCK_SHOPS.filter(s => s.id !== shopId);
        MOCK_ALL_USERS = MOCK_ALL_USERS.filter(u => u.id !== shop.ownerId);
        return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error('Shop not found'));
  },
  placeOrder: async (orderData) => {
    console.log("Simulating placing an order:", orderData);
    const newOrder = {
      id: `order${Date.now()}`,
      userId: orderData.userId,
      shopId: orderData.items[0].shopId, // simplified for mock
      products: orderData.items.map(item => ({ id: item.id, name: item.name, quantity: item.quantity })),
      total: orderData.total,
      status: 'Processing',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: orderData.paymentMethod,
    };
    MOCK_ORDERS.unshift(newOrder); // Add to beginning of array
    return Promise.resolve(newOrder);
  },
  sendPasswordResetEmail: async ({ email }) => {
    console.log(`Simulating sending password reset email to: ${email}`);
    const userExists = MOCK_ALL_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
        // In a real app, an email would be sent via a service like Firebase Auth, SendGrid, etc.
        console.log(`User with email ${email} found. A password reset email would be sent now.`);
    } else {
        // To prevent email enumeration attacks, we don't reveal if the user exists or not.
        // The console log is for simulation purposes only.
        console.log(`User with email ${email} not found, but we are not revealing this to the client.`);
    }
    // Always resolve successfully to prevent user enumeration.
    return Promise.resolve({ success: true });
  },
  updateShopkeeperPermission: async (userId, canAddProducts) => {
    console.log(`Simulating updating permission for user ${userId} to ${canAddProducts}`);
    const userIndex = MOCK_ALL_USERS.findIndex(u => u.id === userId);
    if (userIndex !== -1 && MOCK_ALL_USERS[userIndex].role === 'shopkeeper') {
        MOCK_ALL_USERS[userIndex].canAddProducts = canAddProducts;
        return Promise.resolve(MOCK_ALL_USERS[userIndex]);
    }
    return Promise.reject(new Error('Shopkeeper not found'));
  },
  deleteProduct: async (productId) => {
    console.log(`Simulating deleting product ${productId}`);
    const initialLength = MOCK_PRODUCTS.length;
    MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== productId);
    if (MOCK_PRODUCTS.length < initialLength) {
        return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error('Product not found'));
  },
  addProduct: async (productData) => {
      console.log("Simulating admin adding a product:", productData);
      const newProduct = {
          id: `prod${Date.now()}`,
          ...productData,
      };
      MOCK_PRODUCTS.push(newProduct);
      return Promise.resolve(newProduct);
  },
  getAutomations: async () => {
    return Promise.resolve(MOCK_AUTOMATIONS);
  },
  addAutomation: async (ruleData) => {
    console.log("Simulating adding an automation rule:", ruleData);
    const newRule = { id: `auto${Date.now()}`, ...ruleData };
    MOCK_AUTOMATIONS.push(newRule);
    return Promise.resolve(newRule);
  },
  deleteAutomation: async (ruleId) => {
    console.log(`Simulating deleting automation rule ${ruleId}`);
    const initialLength = MOCK_AUTOMATIONS.length;
    MOCK_AUTOMATIONS = MOCK_AUTOMATIONS.filter(r => r.id !== ruleId);
    if (MOCK_AUTOMATIONS.length < initialLength) {
        return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error('Automation rule not found'));
  },
  getCategories: async () => {
    return Promise.resolve(MOCK_CATEGORIES);
  },
  addCategory: async (categoryData) => {
    const newCategory = { id: `cat${Date.now()}`, name: categoryData.name };
    MOCK_CATEGORIES.push(newCategory);
    return Promise.resolve(newCategory);
  },
  updateCategory: async (categoryId, categoryData) => {
    const catIndex = MOCK_CATEGORIES.findIndex(c => c.id === categoryId);
    if (catIndex !== -1) {
        MOCK_CATEGORIES[catIndex].name = categoryData.name;
        return Promise.resolve(MOCK_CATEGORIES[catIndex]);
    }
    return Promise.reject(new Error("Category not found"));
  },
  deleteCategory: async (categoryId) => {
    const initialLength = MOCK_CATEGORIES.length;
    MOCK_CATEGORIES = MOCK_CATEGORIES.filter(c => c.id !== categoryId);
    if (MOCK_CATEGORIES.length < initialLength) {
        return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error("Category not found"));
  },
};

// --- Page Components ---

const HomePage = ({ products, onAddToCart, activeFilter, onFilterChange, categories }) => (
  <div>
    <section className="bg-gray-900 text-white rounded-lg p-8 mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Flash Sale!</h2>
        <p className="text-lg mb-4">Up to 50% off on selected gadgets. Limited time only!</p>
        <Button onClick={() => onFilterChange('onSale')} className="bg-white text-gray-900 hover:bg-gray-200">Shop Now</Button>
    </section>

    <h2 className="text-2xl font-bold mb-4">All Products</h2>

    <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button
          onClick={() => onFilterChange('all')}
          className={activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}
          size="sm"
        >All</Button>
        <Button
          onClick={() => onFilterChange('onSale')}
          className={activeFilter === 'onSale' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}
          size="sm"
        >On Sale</Button>
      {categories.map(cat => (
        <Button
          key={cat.id}
          onClick={() => onFilterChange(cat.name)}
          className={
            activeFilter === cat.name
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
          }
          size="sm"
        >
          {cat.name}
        </Button>
      ))}
    </div>

    {products.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    ) : (
      <div className="text-center py-16">
        <Search size={48} className="mx-auto text-gray-300" />
        <p className="mt-4 text-gray-600 text-lg font-semibold">No Products Found</p>
        <p className="mt-1 text-gray-500">Try adjusting your search or filters.</p>
      </div>
    )}
  </div>
);

const AdminDashboard = () => {
    const [activeView, setActiveView] = useState('overview');
    const [shops, setShops] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [automations, setAutomations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [adminSearchTerm, setAdminSearchTerm] = useState('');
    const [permissionFilter, setPermissionFilter] = useState('all');
    const [shopOrderFilter, setShopOrderFilter] = useState('all');

    const [userToDelete, setUserToDelete] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    const [automationToDelete, setAutomationToDelete] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    
    const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
    const [isDeleteProductModalOpen, setDeleteProductModalOpen] = useState(false);
    const [isDeleteAutomationModalOpen, setDeleteAutomationModalOpen] = useState(false);
    const [isDeleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);

    const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
    const [isAddAutomationModalOpen, setAddAutomationModalOpen] = useState(false);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        api.getShopkeepers().then(setShops);
        api.getAllOrders().then(setOrders);
        api.getUsers().then(setUsers);
        api.getProducts().then(setProducts);
        api.getAutomations().then(setAutomations);
        api.getCategories().then(setCategories);
    }, []);

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.updateOrderStatus(orderId, newStatus);
            setOrders(prevOrders => 
                prevOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
            );
        } catch (error) {
            console.error("Failed to update order status:", error);
            alert("Failed to update order status.");
        }
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        try {
            await api.updateUserRole(userId, newRole);
            setUsers(prevUsers =>
                prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u)
            );
        } catch (error) {
            console.error("Failed to update user role:", error);
            alert("Failed to update user role.");
        }
    };

    const handleUpdatePermission = async (userId, canAddProducts) => {
        try {
            await api.updateShopkeeperPermission(userId, canAddProducts);
            setUsers(prevUsers =>
                prevUsers.map(u => u.id === userId ? { ...u, canAddProducts } : u)
            );
        } catch (error) {
            console.error("Failed to update permission:", error);
            alert("Failed to update permission.");
        }
    };

    const openDeleteUserModal = (user) => { setUserToDelete(user); setDeleteUserModalOpen(true); };
    const closeDeleteUserModal = () => { setUserToDelete(null); setDeleteUserModalOpen(false); };

    const handleConfirmDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            await api.deleteUser(userToDelete.id);
            setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
        } catch (error) {
            console.error("Failed to delete user:", error);
            alert("Failed to delete user.");
        }
        closeDeleteUserModal();
    };
    
    const handleApproveShop = async (shopId) => {
        try {
            await api.approveShop(shopId);
            setShops(prevShops => prevShops.map(s => s.id === shopId ? { ...s, approved: true } : s));
            // We need to refetch users to get the updated `canAddProducts` permission
            api.getUsers().then(setUsers);
        } catch (error) {
            alert('Failed to approve shop.');
        }
    };

    const handleRejectShop = async (shopId) => {
        if (window.confirm('Are you sure you want to reject this application? This will permanently delete the shop and the shopkeeper account.')) {
            try {
                await api.rejectShop(shopId);
                setShops(prevShops => prevShops.filter(s => s.id !== shopId));
                api.getUsers().then(setUsers); // Re-fetch users
            } catch (error) {
                alert('Failed to reject shop.');
            }
        }
    };

    const openDeleteProductModal = (product) => { setProductToDelete(product); setDeleteProductModalOpen(true); };
    const closeDeleteProductModal = () => { setProductToDelete(null); setDeleteProductModalOpen(false); };

    const handleConfirmDeleteProduct = async () => {
        if (!productToDelete) return;
        try {
            await api.deleteProduct(productToDelete.id);
            setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));
        } catch (error) {
            console.error("Failed to delete product:", error);
            alert("Failed to delete product.");
        }
        closeDeleteProductModal();
    };

    const handleAdminAddProduct = async (productData) => {
        try {
            const newProduct = await api.addProduct(productData);
            setProducts(prev => [...prev, newProduct]);
            setAddProductModalOpen(false);
        } catch (error) {
            console.error("Failed to add product:", error);
            alert("Failed to add product.");
        }
    };
    
    const openDeleteAutomationModal = (automation) => { setAutomationToDelete(automation); setDeleteAutomationModalOpen(true); };
    const closeDeleteAutomationModal = () => { setAutomationToDelete(null); setDeleteAutomationModalOpen(false); };

    const handleConfirmDeleteAutomation = async () => {
        if (!automationToDelete) return;
        try {
            await api.deleteAutomation(automationToDelete.id);
            setAutomations(prev => prev.filter(a => a.id !== automationToDelete.id));
        } catch (error) {
            console.error("Failed to delete automation:", error);
            alert("Failed to delete automation.");
        }
        closeDeleteAutomationModal();
    };

    const handleAddAutomation = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newRuleData = {
            name: String(formData.get('name')),
            trigger: String(formData.get('trigger')),
            action: String(formData.get('action')),
            config: {
                threshold: formData.get('trigger') === 'stock_below' ? parseInt(String(formData.get('threshold')), 10) : null,
            },
        };
        try {
            const newRule = await api.addAutomation(newRuleData);
            setAutomations(prev => [...prev, newRule]);
            setAddAutomationModalOpen(false);
            e.target.reset();
        } catch (error) {
            console.error("Failed to add automation rule:", error);
            alert("Failed to add automation rule.");
        }
    };
    
    // Category Management Handlers
    const openCategoryModal = (category = null) => { setEditingCategory(category); setCategoryModalOpen(true); };
    const closeCategoryModal = () => { setEditingCategory(null); setCategoryModalOpen(false); };
    
    const handleSaveCategory = async (e) => {
        e.preventDefault();
        const categoryName = e.target.categoryName.value;
        try {
            if (editingCategory) {
                const updatedCategory = await api.updateCategory(editingCategory.id, { name: categoryName });
                setCategories(prev => prev.map(c => c.id === editingCategory.id ? updatedCategory : c));
            } else {
                const newCategory = await api.addCategory({ name: categoryName });
                setCategories(prev => [...prev, newCategory]);
            }
            closeCategoryModal();
        } catch (error) {
            alert(`Failed to save category: ${error.message}`);
        }
    };
    
    const openDeleteCategoryModal = (category) => { setCategoryToDelete(category); setDeleteCategoryModalOpen(true); };
    const closeDeleteCategoryModal = () => { setCategoryToDelete(null); setDeleteCategoryModalOpen(false); };
    
    const handleConfirmDeleteCategory = async () => {
        if (!categoryToDelete) return;
        try {
            await api.deleteCategory(categoryToDelete.id);
            setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
        } catch (error) {
            alert(`Failed to delete category: ${error.message}`);
        }
        closeDeleteCategoryModal();
    };


    const getOwner = (ownerId) => users.find(u => u.id === ownerId);
    const getShopName = (shopId) => shops.find(s => s.id === shopId)?.name || 'N/A';
    
    const getStatusColor = (status) => {
        switch (status) {
          case 'Delivered': return 'bg-green-100 text-green-700';
          case 'Shipped': return 'bg-blue-100 text-blue-700';
          case 'Processing': return 'bg-yellow-100 text-yellow-700';
          default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
          case 'admin': return 'bg-purple-100 text-purple-700';
          case 'shopkeeper': return 'bg-indigo-100 text-indigo-700';
          case 'customer': return 'bg-blue-100 text-blue-700';
          default: return 'bg-gray-100 text-gray-700';
        }
    };

    const navItems = [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'stores', label: 'Store Management', icon: Store },
      { id: 'users', label: 'User Management', icon: Users },
      { id: 'inventory', label: 'Inventory', icon: Package },
      { id: 'categories', label: 'Categories', icon: Tag },
      { id: 'orders', label: 'Orders', icon: Truck },
      { id: 'automation', label: 'Automation Hub', icon: Bell },
    ];
    
    const Sidebar = () => (
      <aside className="w-64 bg-white border-r p-4 flex-shrink-0">
        <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
        <nav>
          <ul>
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left font-medium transition-colors ${activeView === item.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    );
    
    const Overview = () => (
       <div>
            <h1 className="text-3xl font-bold mb-6">Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <button onClick={() => setActiveView('stores')} className="text-left bg-white p-6 rounded-lg shadow transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Store className="text-blue-500 mb-2" />
                    <h3 className="font-bold text-xl">{shops.filter(s => s.approved).length}</h3>
                    <p className="text-gray-500">Approved Shopkeepers</p>
                </button>
                <button onClick={() => setActiveView('inventory')} className="text-left bg-white p-6 rounded-lg shadow transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Package className="text-green-500 mb-2" />
                    <h3 className="font-bold text-xl">{products.length}</h3>
                    <p className="text-gray-500">Total Products</p>
                </button>
                <button onClick={() => setActiveView('orders')} className="text-left bg-white p-6 rounded-lg shadow transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Truck className="text-yellow-500 mb-2" />
                    <h3 className="font-bold text-xl">{orders.length}</h3>
                    <p className="text-gray-500">Total Orders</p>
                </button>
                <button onClick={() => setActiveView('users')} className="text-left bg-white p-6 rounded-lg shadow transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Users className="text-indigo-500 mb-2" />
                    <h3 className="font-bold text-xl">{users.length}</h3>
                    <p className="text-gray-500">Total Users</p>
                </button>
            </div>
       </div>
    );
    
    const StoreManagement = () => {
        const approvedShops = shops.filter(s => s.approved);
        const filteredApprovedShops = approvedShops
            .filter(shop => {
                const owner = getOwner(shop.ownerId);
                if (!owner) return false;
                if (permissionFilter === 'all') return true;
                if (permissionFilter === 'allowed') return owner.canAddProducts;
                if (permissionFilter === 'denied') return !owner.canAddProducts;
                return true;
            })
            .filter(s => {
                const owner = getOwner(s.ownerId);
                const searchTermLower = adminSearchTerm.toLowerCase();
                return adminSearchTerm === '' || 
                       s.name.toLowerCase().includes(searchTermLower) || 
                       (owner?.name.toLowerCase().includes(searchTermLower));
            });
        
        return (
            <div>
                <h1 className="text-3xl font-bold mb-6">Store Management</h1>
                {shops.filter(s => !s.approved).length > 0 && (
                     <div className="bg-white p-6 rounded-lg shadow mb-8 border-l-4 border-yellow-400">
                        <h2 className="text-xl font-bold mb-4">Pending Shopkeeper Applications</h2>
                        <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead><tr className="border-b"><th className="p-2">Application ID</th><th className="p-2">Shop Name</th><th className="p-2">Owner Name</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead>
                            <tbody>
                                {shops.filter(s => !s.approved).map(shop => (
                                    <tr key={shop.id} className="border-b">
                                        <td className="p-2 font-mono text-sm">{shop.id}</td>
                                        <td className="p-2">{shop.name}</td>
                                        <td className="p-2">{getOwner(shop.ownerId)?.name || 'N/A'}</td>
                                        <td className="p-2"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">Pending</span></td>
                                        <td className="p-2 flex gap-2">
                                            <Button onClick={() => handleApproveShop(shop.id)} size="sm" className="bg-green-500 text-white hover:bg-green-600">Approve</Button>
                                            <Button onClick={() => handleRejectShop(shop.id)} size="sm" className="bg-red-500 text-white hover:bg-red-600">Reject</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Manage Approved Shopkeepers</h2>
                        <select value={permissionFilter} onChange={(e) => setPermissionFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md">
                            <option value="all">All Permissions</option>
                            <option value="allowed">Permissions Allowed</option>
                            <option value="denied">Permissions Denied</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b"><th className="p-2">Shop Name</th><th className="p-2">Owner Name</th><th className="p-2">Product Permissions</th><th className="p-2">Status</th></tr></thead>
                        <tbody>
                            {filteredApprovedShops.map(shop => {
                                const owner = getOwner(shop.ownerId);
                                return (
                                    <tr key={shop.id} className="border-b">
                                        <td className="p-2">{shop.name}</td>
                                        <td className="p-2">{owner?.name || 'N/A'}</td>
                                        <td className="p-2">
                                            {owner && (
                                                <label htmlFor={`perm-${owner.id}`} className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" id={`perm-${owner.id}`} className="sr-only peer" checked={owner.canAddProducts} onChange={() => handleUpdatePermission(owner.id, !owner.canAddProducts)} />
                                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    <span className="ml-3 text-sm font-medium text-gray-900">{owner.canAddProducts ? 'Allowed' : 'Denied'}</span>
                                                </label>
                                            )}
                                        </td>
                                        <td className="p-2"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Approved</span></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        );
    }
    
    const UserManagement = () => {
        const [roleFilter, setRoleFilter] = useState('all');
        const filteredUsers = users
            .filter(u => adminSearchTerm === '' || u.name.toLowerCase().includes(adminSearchTerm.toLowerCase()) || u.email.toLowerCase().includes(adminSearchTerm.toLowerCase()))
            .filter(u => roleFilter === 'all' || u.role === roleFilter);

        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">User Management</h1>
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">All Users</h2>
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md">
                        <option value="all">All Roles</option>
                        <option value="customer">Customer</option>
                        <option value="shopkeeper">Shopkeeper</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead><tr className="border-b"><th className="p-2">User ID</th><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Role</th><th className="p-2">Actions</th></tr></thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b">
                                <td className="p-2 font-mono text-sm">{user.id}</td>
                                <td className="p-2">{user.name}</td>
                                <td className="p-2">{user.email}</td>
                                <td className="p-2">
                                     <select value={user.role} onChange={(e) => handleUpdateUserRole(user.id, e.target.value)} className={`capitalize px-2 py-1 rounded-full text-xs font-semibold border-none outline-none appearance-none focus:ring-2 focus:ring-blue-400 ${getRoleColor(user.role)}`} aria-label={`Update role for ${user.name}`}>
                                        <option value="customer">Customer</option>
                                        <option value="shopkeeper">Shopkeeper</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="p-2 flex gap-2">
                                  <Button onClick={() => openDeleteUserModal(user)} size="sm" className="bg-red-500 text-white hover:bg-red-600 focus:ring-red-400" aria-label={`Delete user ${user.name}`}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
          </div>
        )
    };

    const InventoryManagement = () => {
        const [categoryFilter, setCategoryFilter] = useState('all');
        const [shopFilter, setShopFilter] = useState('all');
        const filteredProducts = products
            .filter(p => adminSearchTerm === '' || p.name.toLowerCase().includes(adminSearchTerm.toLowerCase()))
            .filter(p => categoryFilter === 'all' || p.category === categoryFilter)
            .filter(p => shopFilter === 'all' || p.shopId === shopFilter);

        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">All Products</h2>
                    <div className="flex gap-4">
                        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md">
                            <option value="all">All Categories</option>
                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                        <select value={shopFilter} onChange={(e) => setShopFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md">
                            <option value="all">All Shops</option>
                            {shops.filter(s => s.approved).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <Button onClick={() => setAddProductModalOpen(true)}>Add New Product</Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b"><th className="p-2">Product</th><th className="p-2">Shop</th><th className="p-2">Price</th><th className="p-2">Stock</th><th className="p-2">Actions</th></tr></thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="border-b">
                                    <td className="p-2 flex items-center gap-3"><img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded"/> {product.name}</td>
                                    <td className="p-2">{getShopName(product.shopId)}</td>
                                    <td className="p-2">${product.price.toFixed(2)}</td>
                                    <td className="p-2">{product.stock > 0 ? product.stock : <span className="text-red-500 font-semibold">Out of Stock</span>}</td>
                                    <td className="p-2"><Button onClick={() => openDeleteProductModal(product)} size="sm" className="bg-red-500 text-white hover:bg-red-600">Delete</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        )
    };

    const CategoryManagement = () => (
      <div>
        <h1 className="text-3xl font-bold mb-6">Category Management</h1>
        <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">All Categories</h2>
                <Button onClick={() => openCategoryModal()}>Add New Category</Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead><tr className="border-b"><th className="p-2">Category Name</th><th className="p-2">Actions</th></tr></thead>
                    <tbody>
                        {categories.filter(c => adminSearchTerm === '' || c.name.toLowerCase().includes(adminSearchTerm.toLowerCase())).map(category => (
                            <tr key={category.id} className="border-b">
                                <td className="p-2 font-semibold">{category.name}</td>
                                <td className="p-2 flex gap-2">
                                    <Button onClick={() => openCategoryModal(category)} size="sm">Edit</Button>
                                    <Button onClick={() => openDeleteCategoryModal(category)} size="sm" className="bg-red-500 text-white hover:bg-red-600">Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    );
    
    const OrderManagement = () => {
        const [statusFilter, setStatusFilter] = useState('all');
        const filteredOrders = orders
            .filter(o => {
                const searchTermLower = adminSearchTerm.toLowerCase();
                return adminSearchTerm === '' ||
                       o.id.toLowerCase().includes(searchTermLower) ||
                       o.userId.toLowerCase().includes(searchTermLower) ||
                       getShopName(o.shopId).toLowerCase().includes(searchTermLower);
            })
            .filter(o => statusFilter === 'all' || o.status === statusFilter)
            .filter(o => shopOrderFilter === 'all' || o.shopId === shopOrderFilter);

        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">Order Management</h1>
             <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">All Orders</h2>
                    <div className="flex gap-4">
                        <select value={shopOrderFilter} onChange={(e) => setShopOrderFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md">
                            <option value="all">All Shops</option>
                            {shops.filter(s => s.approved).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md">
                            <option value="all">All Statuses</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead><tr className="border-b"><th className="p-2">Order ID</th><th className="p-2">Customer ID</th><th className="p-2">Shop Name</th><th className="p-2">Total</th><th className="p-2">Status</th></tr></thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id} className="border-b">
                                <td className="p-2 font-mono text-sm font-semibold text-gray-700">{order.id}</td>
                                <td className="p-2 font-mono text-sm">{order.userId}</td>
                                <td className="p-2">{getShopName(order.shopId)}</td>
                                <td className="p-2">${order.total.toFixed(2)}</td>
                                <td className="p-2">
                                    <select value={order.status} onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)} className={`px-2 py-1 rounded-full text-xs font-semibold border-none outline-none appearance-none focus:ring-2 focus:ring-blue-400 ${getStatusColor(order.status)}`} aria-label={`Update status for order ${order.id}`}>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
          </div>
        );
    };

    const AutomationHub = () => {
        const [newRuleTrigger, setNewRuleTrigger] = useState('stock_below');

        const getTriggerText = (rule) => {
            switch(rule.trigger) {
                case 'stock_below': return `Product stock falls below ${rule.config.threshold}`;
                case 'new_application': return 'A new shopkeeper applies';
                default: return 'Unknown trigger';
            }
        };

        const getActionText = (action) => {
            switch(action) {
                case 'email_admin': return 'Send email to Admin';
                default: return 'Unknown action';
            }
        };

        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">Automation Hub</h1>
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Automation Rules</h2>
                    <Button onClick={() => setAddAutomationModalOpen(true)}>Create New Rule</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b"><th className="p-2">Rule Name</th><th className="p-2">Trigger</th><th className="p-2">Action</th><th className="p-2">Actions</th></tr></thead>
                        <tbody>
                            {automations.map(rule => (
                                <tr key={rule.id} className="border-b">
                                    <td className="p-2 font-semibold">{rule.name}</td>
                                    <td className="p-2">{getTriggerText(rule)}</td>
                                    <td className="p-2">{getActionText(rule.action)}</td>
                                    <td className="p-2"><Button onClick={() => openDeleteAutomationModal(rule)} size="sm" className="bg-red-500 text-white hover:bg-red-600">Delete</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isAddAutomationModalOpen && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center">
                   <div className="absolute inset-0 bg-gray-800/60" onClick={() => setAddAutomationModalOpen(false)}></div>
                   <div className="relative bg-white rounded-lg p-8 shadow-lg max-w-lg w-full">
                       <h2 className="text-xl font-bold mb-4">Create New Automation Rule</h2>
                       <form onSubmit={handleAddAutomation} className="space-y-4">
                           <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Rule Name</label><input type="text" name="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/></div>
                           <div>
                                <label htmlFor="trigger" className="block text-sm font-medium text-gray-700">When...</label>
                                <select name="trigger" value={newRuleTrigger} onChange={(e) => setNewRuleTrigger(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                                    <option value="stock_below">Product stock falls below a threshold</option>
                                    <option value="new_application">A new shopkeeper applies</option>
                                </select>
                           </div>
                           {newRuleTrigger === 'stock_below' && (
                               <div>
                                   <label htmlFor="threshold" className="block text-sm font-medium text-gray-700">Stock Threshold</label>
                                   <input type="number" name="threshold" defaultValue="5" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
                               </div>
                           )}
                           <div>
                               <label htmlFor="action" className="block text-sm font-medium text-gray-700">Then...</label>
                               <select name="action" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                                   <option value="email_admin">Send email notification to Admin</option>
                               </select>
                           </div>
                           <div className="flex justify-end gap-3 pt-4">
                               <Button onClick={() => setAddAutomationModalOpen(false)} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
                               <Button type="submit">Create Rule</Button>
                           </div>
                       </form>
                   </div>
                 </div>
            )}
          </div>
        );
    };

    const renderActiveView = () => {
        switch (activeView) {
            case 'overview': return <Overview />;
            case 'stores': return <StoreManagement />;
            case 'users': return <UserManagement />;
            case 'inventory': return <InventoryManagement />;
            case 'categories': return <CategoryManagement />;
            case 'orders': return <OrderManagement />;
            case 'automation': return <AutomationHub />;
            default: return <Overview />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-end items-center mb-6">
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="search"
                            placeholder="Search by name, ID, email..."
                            value={adminSearchTerm}
                            onChange={(e) => setAdminSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white"
                        />
                    </div>
                </div>
                {renderActiveView()}
            </main>
            
            {/* Modals */}
            <ConfirmationModal isOpen={isDeleteUserModalOpen} onClose={closeDeleteUserModal} onConfirm={handleConfirmDeleteUser} title="Delete User">
                Are you sure you want to delete the user <strong>{userToDelete?.name}</strong>? This action cannot be undone.
            </ConfirmationModal>
            <ConfirmationModal isOpen={isDeleteProductModalOpen} onClose={closeDeleteProductModal} onConfirm={handleConfirmDeleteProduct} title="Delete Product">
                Are you sure you want to delete the product <strong>{productToDelete?.name}</strong>? This action cannot be undone.
            </ConfirmationModal>
            <ConfirmationModal isOpen={isDeleteAutomationModalOpen} onClose={closeDeleteAutomationModal} onConfirm={handleConfirmDeleteAutomation} title="Delete Automation Rule">
                Are you sure you want to delete the rule <strong>{automationToDelete?.name}</strong>? This action cannot be undone.
            </ConfirmationModal>
            <ConfirmationModal isOpen={isDeleteCategoryModalOpen} onClose={closeDeleteCategoryModal} onConfirm={handleConfirmDeleteCategory} title="Delete Category">
                Are you sure you want to delete the category <strong>{categoryToDelete?.name}</strong>? This may affect existing products.
            </ConfirmationModal>

            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                   <div className="absolute inset-0 bg-gray-800/60" onClick={closeCategoryModal}></div>
                   <div className="relative bg-white rounded-lg p-8 shadow-lg max-w-md w-full">
                       <h2 className="text-xl font-bold mb-4">{editingCategory ? 'Edit' : 'Add'} Category</h2>
                       <form onSubmit={handleSaveCategory}>
                           <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Category Name</label>
                           <input type="text" name="categoryName" defaultValue={editingCategory?.name || ''} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
                           <div className="flex justify-end gap-3 pt-4">
                               <Button onClick={closeCategoryModal} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
                               <Button type="submit">Save Category</Button>
                           </div>
                       </form>
                   </div>
                 </div>
            )}
            
            {isAddProductModalOpen && (
                <AddProductModal
                    isOpen={isAddProductModalOpen}
                    onClose={() => setAddProductModalOpen(false)}
                    onSave={handleAdminAddProduct}
                    shops={shops.filter(s => s.approved)}
                    categories={categories}
                />
            )}
        </div>
    );
};

const AddProductModal = ({ isOpen, onClose, onSave, shops, categories, defaultShopId = null }) => {
    const [options, setOptions] = useState([{ name: '', values: '' }]);

    if (!isOpen) return null;

    const handleAddOption = () => setOptions([...options, { name: '', values: '' }]);
    const handleRemoveOption = (index) => setOptions(options.filter((_, i) => i !== index));
    const handleOptionChange = (index, field, value) => {
        const newOptions = [...options];
        newOptions[index][field] = value;
        setOptions(newOptions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newProductData = {
            name: String(formData.get('name')),
            price: parseFloat(String(formData.get('price'))),
            imageUrl: String(formData.get('imageUrl')),
            shopId: defaultShopId || String(formData.get('shopId')),
            category: String(formData.get('category')),
            stock: parseInt(String(formData.get('stock')), 10),
            options: options
                .filter(opt => opt.name.trim() !== '' && opt.values.trim() !== '')
                .map(opt => ({ name: opt.name.trim(), values: opt.values.split(',').map(v => v.trim()) })),
        };
        onSave(newProductData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-800/60" onClick={onClose}></div>
            <div className="relative bg-white rounded-lg p-8 shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                     <h3 className="font-bold text-xl mb-2">Add New Product</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="col-span-full"><label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label><input type="text" name="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/></div>
                         <div><label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label><input type="number" name="price" step="0.01" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/></div>
                         <div><label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label><input type="number" name="stock" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/></div>
                         <div className="col-span-full"><label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Product Image URL</label><input type="url" name="imageUrl" required placeholder="https://..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/></div>
                         <div><label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label><select name="category" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">{categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
                         {!defaultShopId && <div><label htmlFor="shopId" className="block text-sm font-medium text-gray-700">Assign to Shop</label><select name="shopId" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">{shops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>}
                     </div>

                     <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">Product Options (e.g., Size, Color)</h4>
                        {options.map((opt, index) => (
                            <div key={index} className="flex gap-2 items-center mb-2">
                                <input type="text" placeholder="Option Name" value={opt.name} onChange={e => handleOptionChange(index, 'name', e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md"/>
                                <input type="text" placeholder="Values, comma-separated" value={opt.values} onChange={e => handleOptionChange(index, 'values', e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md"/>
                                <Button type="button" onClick={() => handleRemoveOption(index)} className="bg-red-500 text-white hover:bg-red-600">&times;</Button>
                            </div>
                        ))}
                        <Button type="button" onClick={handleAddOption} size="sm" className="bg-gray-200 text-gray-800 hover:bg-gray-300"><PlusCircle size={16} className="mr-1"/>Add Option</Button>
                     </div>

                     <div className="col-span-full flex justify-end gap-3 pt-4">
                        <Button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
                        <Button type="submit">Save Product</Button>
                     </div>
                </form>
           </div>
        </div>
    );
};

const ShopkeeperDashboard = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [shop, setShop] = useState(null);
    const [categories, setCategories] = useState([]);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user?.shopId) {
            api.getShopDetails(user.shopId).then(setShop);
            api.getShopProducts(user.shopId).then(setProducts);
            api.getShopOrders(user.shopId).then(setOrders);
            api.getCategories().then(setCategories);
        }
    }, [user]);

    if (!shop) {
        return (
            <div className="text-center py-20">
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (!shop.approved) {
        return (
            <div>
                <h1 className="text-3xl font-bold mb-6">Application Status</h1>
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                        <Briefcase className="h-6 w-6 text-yellow-600" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">Your Application is Pending</h2>
                    <p className="text-gray-600">Your shop, <strong>{shop.name}</strong>, is currently under review by our admin team.</p>
                    <p className="text-gray-600 mt-1">You will be notified once it has been approved. You can then start adding products and managing your orders.</p>
                </div>
            </div>
        );
    }

    const handleAddProduct = async (productData) => {
        try {
            const newProduct = await api.addProduct(productData);
            setProducts(prev => [...prev, newProduct]);
            setShowAddProduct(false);
            alert("Product added successfully! (Simulated)");
        } catch(error) {
            alert("Failed to add product.");
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.updateOrderStatus(orderId, newStatus);
            setOrders(prevOrders => 
                prevOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
            );
            alert(`Order ${orderId} status updated to ${newStatus}`);
        } catch (error) {
            console.error("Failed to update order status:", error);
            alert("Failed to update order status.");
        }
    };

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
    
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Shopkeeper Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow"><Package className="text-green-500 mb-2" /> <h3 className="font-bold text-xl">{products.length}</h3><p className="text-gray-500">Your Products</p></div>
                <div className="bg-white p-6 rounded-lg shadow"><Truck className="text-yellow-500 mb-2" /> <h3 className="font-bold text-xl">{orders.length}</h3><p className="text-gray-500">Your Orders</p></div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Your Products</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="search"
                                placeholder="Search your products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                aria-label="Search your products"
                            />
                        </div>
                        {user?.canAddProducts && (
                          <Button onClick={() => setShowAddProduct(true)}>Add Product</Button>
                        )}
                    </div>
                </div>

                {user?.canAddProducts && (
                    <AddProductModal 
                        isOpen={showAddProduct}
                        onClose={() => setShowAddProduct(false)}
                        onSave={handleAddProduct}
                        categories={categories}
                        defaultShopId={user.shopId}
                        shops={[]}
                    />
                )}

                <div className="overflow-x-auto">
                    {filteredProducts.length > 0 ? (
                        <table className="w-full text-left">
                            <thead><tr className="border-b"><th className="p-2">Product</th><th className="p-2">Price</th><th className="p-2">Stock</th><th className="p-2">Actions</th></tr></thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product.id} className="border-b">
                                        <td className="p-2 flex items-center gap-3"><img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded"/> {product.name}</td>
                                        <td className="p-2">${product.price.toFixed(2)}</td>
                                        <td className="p-2">{product.stock > 0 ? product.stock : <span className="text-red-500 font-semibold">Out of Stock</span>}</td>
                                        <td className="p-2"><Button onClick={() => alert('Edit product!')} size="sm">Edit</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12">
                            <Search size={40} className="mx-auto text-gray-300" />
                            <h3 className="mt-3 text-lg font-semibold text-gray-700">No Products Found</h3>
                            <p className="mt-1 text-gray-500">
                                {searchTerm
                                    ? `Your search for "${searchTerm}" did not match any products.`
                                    : "You haven't added any products yet."}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                 <h2 className="text-xl font-bold mb-4">Your Orders</h2>
                 {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead><tr className="border-b"><th className="p-2">Order ID</th><th className="p-2">Total</th><th className="p-2">Status</th></tr></thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id} className="border-b">
                                        <td className="p-2 font-mono text-sm">{order.id}</td>
                                        <td className="p-2">${order.total.toFixed(2)}</td>
                                        <td className="p-2">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                className={`px-2 py-1 rounded-full text-xs font-semibold border-none outline-none appearance-none focus:ring-2 focus:ring-blue-400 ${getStatusColor(order.status)}`}
                                                aria-label={`Update status for order ${order.id}`}
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 ) : (
                    <p className="text-gray-500">You have no orders yet.</p>
                 )}
            </div>
        </div>
    );
};

// --- Main App Component ---

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [userOrders, setUserOrders] = useState([]);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  useEffect(() => {
    // Fetch initial data on load
    api.getProducts().then(setProducts);
    api.getCategories().then(setCategories);
  }, []);

  const handleAddToCart = (productToAdd) => {
    if (productToAdd.stock <= 0) {
        alert("Sorry, this item is out of stock.");
        return;
    }
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productToAdd.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...productToAdd, quantity: 1 }];
    });
    alert(`${productToAdd.name} added to cart!`);
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const handleUpdateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const handlePlaceOrder = async (paymentDetails) => {
    if (!currentUser) {
        alert("Please log in to place an order.");
        setLoginOpen(true);
        return;
    }
    const orderData = {
        userId: currentUser.id,
        items: cart,
        total: cart.reduce((total, item) => total + item.price * item.quantity, 0),
        paymentMethod: paymentDetails.method,
        upiId: paymentDetails.upiId,
    };
    try {
        const newOrder = await api.placeOrder(orderData);
        setLastPlacedOrder(newOrder);
        setCart([]);
        setCurrentPage('confirmation');
    } catch (error) {
        console.error("Failed to place order:", error);
        alert("There was an error placing your order. Please try again.");
    }
  };

  const handleLogin = async (credentials) => {
    try {
        const user = await api.login(credentials);
        setCurrentUser(user);
        setCurrentPage(user.role === 'admin' || user.role === 'shopkeeper' ? 'dashboard' : 'home');
        setLoginOpen(false);
    } catch (error) {
        console.error("Login failed:", error);
        alert(error.message || "Login failed. Please check your credentials.");
    }
  };
  
  const handleSignup = async (details) => {
    try {
        let user;
        if (details.role === 'customer') {
            user = await api.signupCustomer(details);
            alert('Account created successfully! You can now sign in.');
            // Automatically log in the new customer
            handleLogin({ email: user.email, password: details.password, role: 'customer' });
        } else {
            user = await api.signupShopkeeper(details);
            alert('Application submitted! It will be reviewed by an admin. You can sign in to check the status.');
             // Automatically log in the new shopkeeper to see the pending status
            handleLogin({ email: user.email, password: details.password, role: 'shopkeeper' });
        }
    } catch (error) {
        console.error("Signup failed:", error);
        alert(error.message || "Signup failed. Please try again.");
    }
  };

  const handleForgotPassword = async ({ email }) => {
    try {
        await api.sendPasswordResetEmail({ email });
        // The confirmation message is handled within the modal itself.
    } catch (error) {
        console.error("Password reset request failed:", error);
        alert(error.message || "Failed to send reset link.");
    }
  };


  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleNavigate = (page) => {
    if (page === 'profile' && currentUser) {
        api.getUserOrders(currentUser.id).then(setUserOrders);
    }
    setCurrentPage(page);
    if (page === 'home') {
        setActiveFilter('all');
    }
  };

  const filteredProducts = products
    .filter(product => {
      // First, apply the category filter
      if (activeFilter === 'all') return true;
      if (activeFilter === 'onSale') return product.onSale;
      return product.category === activeFilter;
    })
    .filter(product => {
      // Then, apply the real-time search filter
      if (!searchTerm) return true; // Show all products if search bar is empty
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  
  const renderPage = () => {
    if (currentPage === 'dashboard' && currentUser?.role === 'admin') {
      return <AdminDashboard />;
    }
    if (currentPage === 'dashboard' && currentUser?.role === 'shopkeeper') {
      return <ShopkeeperDashboard user={currentUser} />;
    }
    if (currentPage === 'cart') {
      return <CartPage
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onNavigate={handleNavigate}
      />;
    }
    if (currentPage === 'checkout') {
        return <CheckoutPage
            cartItems={cart}
            onPlaceOrder={handlePlaceOrder}
            onNavigate={handleNavigate}
        />;
    }
    if (currentPage === 'profile' && currentUser) {
        return <UserProfilePage user={currentUser} orders={userOrders} />;
    }
    if (currentPage === 'confirmation' && lastPlacedOrder) {
        return <OrderConfirmationPage order={lastPlacedOrder} onNavigate={handleNavigate} />;
    }
    return <HomePage
      products={filteredProducts}
      onAddToCart={handleAddToCart}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      categories={categories}
    />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={currentUser}
        onLoginClick={() => setLoginOpen(true)}
        onLogoutClick={handleLogout}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        cartCount={cart.reduce((count, item) => count + item.quantity, 0)}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>
      <LoginPage
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onForgotPassword={handleForgotPassword}
      />
    </div>
  );
}