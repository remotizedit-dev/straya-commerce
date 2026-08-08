'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useApp } from '@/lib/store';
import { Product, Order, CustomerRecord, Lead, PromoCode, SiteSettings, COAItem, FAQItem } from '@/lib/types';
import { formatAUD } from '@/lib/utils';
import { InvoiceModal } from '@/components/ui/InvoiceModal';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  PhoneCall,
  Tag,
  Settings,
  Globe,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Eye,
  FileText,
  DollarSign,
  TrendingUp,
  Award,
  Search,
  CheckCircle2,
  LogOut,
  ChevronRight,
  BarChart3,
  PieChart,
  ExternalLink,
  MapPin,
  HelpCircle,
} from 'lucide-react';

export default function CMSDashboardPage() {
  const router = useRouter();
  const {
    siteSettings,
    updateSiteSettings,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    deleteOrder,
    customers,
    deleteCustomer,
    leads,
    updateLeadStatus,
    deleteLead,
    promoCodes,
    addPromoCode,
    togglePromoCode,
    deletePromoCode,
    coas,
    addCOA,
    deleteCOA,
    faqs,
    addFAQ,
    updateFAQ,
    deleteFAQ,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'settings' | 'products' | 'coas' | 'faqs' | 'contact' | 'orders' | 'customers' | 'leads' | 'promos' | 'seo'
  >('overview');

  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  // Modals & Forms State
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // COA Form State
  const [isAddingCOA, setIsAddingCOA] = useState(false);
  const [coaTitle, setCoaTitle] = useState('');
  const [coaBatch, setCoaBatch] = useState('STRAYA-2026-01');
  const [coaPurity, setCoaPurity] = useState('99.6%');
  const [coaImage, setCoaImage] = useState('');
  const [coaPdf, setCoaPdf] = useState('');

  // FAQ Form State
  const [isAddingFAQ, setIsAddingFAQ] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState('General');
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);

  // 🔒 STRICT PRODUCTION FIREBASE AUTH CHECK
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      } else {
        const isAuthSession = typeof window !== 'undefined' && sessionStorage.getItem('straya_cms_auth');
        if (!isAuthSession) {
          router.push('/cms/login');
        }
      }
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout error', e);
    }
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('straya_cms_auth');
    }
    router.push('/cms/login');
  };

  // New Category Input State
  const [newCategoryName, setNewCategoryName] = useState('');

  // Form State for Adding Product
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [prodTitle, setProdTitle] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodPrice, setProdPrice] = useState(120);
  const [prodDiscountPrice, setProdDiscountPrice] = useState(99);
  const [prodCategory, setProdCategory] = useState(siteSettings.categories[0] || 'Tissue Repair');
  const [prodType, setProdType] = useState<'best_sell' | 'featured' | 'standard'>('best_sell');
  const [prodDesc, setProdDesc] = useState('');

  // Form State for Adding Promo Code
  const [isAddingPromo, setIsAddingPromo] = useState(false);
  const [promoCodeName, setPromoCodeName] = useState('');
  const [promoType, setPromoType] = useState<'percentage' | 'fixed'>('percentage');
  const [promoValue, setPromoValue] = useState(15);
  const [promoMaxUsage, setPromoMaxUsage] = useState(500);

  // Local Editable Site Settings
  const [editableSettings, setEditableSettings] = useState<SiteSettings>(siteSettings);

  useEffect(() => {
    setEditableSettings(siteSettings);
  }, [siteSettings]);

  // Analytics Calculations
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  const totalRevenue = paidOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const unpaidOrdersCount = orders.filter((o) => o.paymentStatus === 'unpaid').length;
  const totalCustomersCount = customers.length;
  const totalLeadsCount = leads.length;

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const updatedCategories = [...(siteSettings.categories || []), newCategoryName.trim()];
    updateSiteSettings({ categories: updatedCategories });
    setProdCategory(newCategoryName.trim());
    setNewCategoryName('');
  };

  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduct({
      title: prodTitle,
      images: [prodImage || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop'],
      description: prodDesc || 'High purity laboratory research peptide compound.',
      technicalSpecs: [
        { label: 'Purity', value: '99.6% HPLC' },
        { label: 'Form', value: 'Lyophilized Powder' },
      ],
      price: Number(prodPrice),
      discountedPrice: Number(prodDiscountPrice),
      category: prodCategory,
      type: prodType,
      stock: 50,
      rating: 5.0,
      reviewsCount: 1,
    });
    setIsAddingProduct(false);
    setProdTitle('');
    setProdImage('');
    setProdDesc('');
  };

  const handleCreatePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPromoCode({
      code: promoCodeName.toUpperCase(),
      discountType: promoType,
      discountValue: Number(promoValue),
      maxUsage: Number(promoMaxUsage),
      active: true,
    });
    setIsAddingPromo(false);
    setPromoCodeName('');
  };

  const handleSaveSettings = async () => {
    await updateSiteSettings(editableSettings);
    alert('Site settings updated successfully in Realtime Database!');
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders & Invoices', icon: ShoppingBag, badge: unpaidOrdersCount > 0 ? `${unpaidOrdersCount} Unpaid` : undefined },
    { id: 'products', label: 'Product Catalog', icon: Package },
    { id: 'coas', label: 'COA Reports', icon: Award },
    { id: 'faqs', label: 'FAQ Accordions', icon: FileText },
    { id: 'contact', label: 'Contact Us & Map', icon: PhoneCall },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'leads', label: 'Leads & Callback Desk', icon: PhoneCall, badge: leads.filter(l => l.status === 'new').length > 0 ? 'New' : undefined },
    { id: 'promos', label: 'Promo Code Generator', icon: Tag },
    { id: 'settings', label: 'Site & Bank Config', icon: Settings },
    { id: 'seo', label: 'SEO & Metadata', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex font-sans select-none">
      {/* 1. CMS SIDEBAR NAVIGATION - Pure White & Black Accent */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 hidden md:flex shadow-xs">
        <div className="p-6 space-y-6">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-black text-xl text-white">
                S
              </div>
            </div>
            <div>
              <span className="font-black text-lg text-slate-900 tracking-wider">
                STRAYA<span className="text-[#FF007A]">.</span>
              </span>
              <span className="text-[10px] text-slate-600 font-bold block uppercase tracking-widest -mt-1">
                CMS Admin Portal
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-700 hover:text-black hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF007A]' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FF007A] text-white text-[10px] font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                AU
              </div>
              <div className="text-xs truncate max-w-[130px]">
                <p className="font-bold text-slate-900 leading-tight truncate">{currentUserEmail || 'Admin User'}</p>
                <p className="text-[10px] text-emerald-600 font-mono font-bold">● Authenticated</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CMS CONTENT AREA - Pure White & Black */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-black text-slate-900 uppercase tracking-wider hidden sm:block">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
          </div>

          {/* Quick Header Controls */}
          <div className="flex items-center space-x-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <span>Live Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#FF007A]" />
            </a>

            <button
              onClick={() => {
                setActiveTab('products');
                setIsAddingProduct(true);
              }}
              className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </header>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden flex items-center space-x-2 overflow-x-auto p-3 bg-white border-b border-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as any)}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 shrink-0 ${
                  isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT PANELS */}
        <div className="p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
                    <span>Verified Sales</span>
                    <DollarSign className="w-4 h-4 text-slate-900" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 font-mono">{formatAUD(totalRevenue)}</h3>
                  <p className="text-[11px] text-emerald-600 font-bold">● {paidOrders.length} Paid Invoices</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
                    <span>Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-[#FF007A]" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 font-mono">{totalOrdersCount}</h3>
                  <p className="text-[11px] text-amber-600 font-bold">● {unpaidOrdersCount} Pending Bank Payments</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
                    <span>Active Products</span>
                    <Package className="w-4 h-4 text-slate-900" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 font-mono">{products.length}</h3>
                  <p className="text-[11px] text-slate-600 font-bold">● HPLC Tested Stock</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
                    <span>Registered Customers</span>
                    <Users className="w-4 h-4 text-slate-900" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 font-mono">{totalCustomersCount}</h3>
                  <p className="text-[11px] text-slate-600 font-bold">● Australian Client Profiles</p>
                </div>
              </div>

              {/* Recent Orders List Preview */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900 uppercase">Recent Store Orders ({orders.length})</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#FF007A] hover:underline font-bold"
                  >
                    View All Orders →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No orders placed yet. New checkout orders will appear here automatically.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-white uppercase font-bold">
                        <tr>
                          <th className="p-3">Order ID</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Total Amount</th>
                          <th className="p-3">Payment</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-900">
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-[#FF007A]">{o.id}</td>
                            <td className="p-3 font-bold text-slate-900">{o.customer?.firstName || 'Guest'} {o.customer?.lastName || ''}</td>
                            <td className="p-3 font-mono font-bold text-slate-900">{formatAUD(o.totalAmount)}</td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                o.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}>
                                {o.paymentStatus}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedOrderForInvoice(o);
                                  setIsInvoiceOpen(true);
                                }}
                                className="px-3 py-1 rounded-lg bg-slate-900 text-white font-bold text-[10px] uppercase cursor-pointer"
                              >
                                Invoice
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT & PDF/PNG INVOICES */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase">Orders & Official Invoices ({orders.length})</h2>
                  <p className="text-xs text-slate-500">Manage payment status, shipping stages, and print official invoices</p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs">
                  No orders found in database. New customer orders will be listed here in real-time.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white uppercase font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Payment Status</th>
                        <th className="p-4">Shipping Stage</th>
                        <th className="p-4 text-right">Invoice Export</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-900">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-mono font-bold text-[#FF007A] text-sm">{o.id}</td>
                          <td className="p-4">
                            <p className="font-bold text-slate-900 text-sm">{o.customer?.firstName || 'Guest'} {o.customer?.lastName || ''}</p>
                            <p className="text-slate-600 font-mono text-[11px]">{o.customer?.email || 'N/A'}</p>
                            <p className="text-slate-600 font-mono text-[11px]">{o.customer?.phone || 'N/A'}</p>
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-900 text-sm">{formatAUD(o.totalAmount)}</td>
                          <td className="p-4">
                            <button
                              onClick={() => updateOrderStatus(o.id, o.paymentStatus === 'paid' ? 'unpaid' : 'paid')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase cursor-pointer transition-all ${
                                o.paymentStatus === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                              }`}
                            >
                              {o.paymentStatus} (Toggle)
                            </button>
                          </td>
                          <td className="p-4">
                            <select
                              value={o.deliveryStatus}
                              onChange={(e: any) => updateOrderStatus(o.id, undefined, e.target.value)}
                              className="bg-slate-50 text-slate-900 text-xs px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900 cursor-pointer font-bold"
                            >
                              <option value="Payment Received">Payment Received</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => setViewingOrder(o)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-black cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedOrderForInvoice(o);
                                  setIsInvoiceOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase flex items-center space-x-1 hover:bg-black transition-all cursor-pointer shadow-xs"
                                title="View/Export Tax Invoice"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Invoice</span>
                              </button>
                              <button
                                onClick={() => deleteOrder(o.id)}
                                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                                title="Delete Order"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCT CATALOG CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase">Product Catalog CRUD</h2>
                  <p className="text-xs text-slate-500">Add, edit, or delete compound listings and custom categories</p>
                </div>

                <button
                  onClick={() => setIsAddingProduct(!isAddingProduct)}
                  className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center space-x-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Add Custom Category Box */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 shadow-xs">
                <span className="text-xs font-bold text-slate-700 shrink-0">Add Category To Dropdown List:</span>
                <input
                  type="text"
                  placeholder="e.g. Nootropic Compounds..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="bg-slate-50 text-slate-900 text-xs px-3.5 py-2 rounded-xl border border-slate-300 flex-1 focus:outline-none focus:border-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                >
                  Add Category
                </button>
              </div>

              {/* Add Product Form Box */}
              {isAddingProduct && (
                <form onSubmit={handleCreateProductSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 space-y-4 shadow-xl text-slate-900">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">New Product Configuration</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. BPC-157 5mg Vial"
                        value={prodTitle}
                        onChange={(e) => setProdTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Image URL Link (Cloudinary, AWS, Unsplash) *</label>
                      <input
                        type="text"
                        required
                        placeholder="https://..."
                        value={prodImage}
                        onChange={(e) => setProdImage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Original Price (AUD) *</label>
                      <input
                        type="number"
                        required
                        value={prodPrice}
                        onChange={(e) => setProdPrice(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Discounted Price (AUD)</label>
                      <input
                        type="number"
                        value={prodDiscountPrice}
                        onChange={(e) => setProdDiscountPrice(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-bold mb-1">Product Description & Technical Notes</label>
                      <textarea
                        rows={3}
                        placeholder="Detailed compound research notes, purity level, usage specs..."
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Category Dropdown *</label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none cursor-pointer"
                      >
                        {siteSettings.categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Product Display Type *</label>
                      <select
                        value={prodType}
                        onChange={(e: any) => setProdType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none cursor-pointer"
                      >
                        <option value="best_sell">Best Sale (Top Badge)</option>
                        <option value="featured">Featured Product</option>
                        <option value="standard">Standard Catalog</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" className="bg-slate-900 hover:bg-black text-white font-bold text-xs py-3 px-6 rounded-xl cursor-pointer shadow-md">
                      Save & Publish Product
                    </button>
                    <button type="button" onClick={() => setIsAddingProduct(false)} className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Product Catalog Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white uppercase font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Type</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-900">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-900 text-sm">{p.title}</td>
                        <td className="p-4 text-slate-700 font-bold">{p.category}</td>
                        <td className="p-4 font-mono text-sm font-bold">{formatAUD(p.discountedPrice || p.price)}</td>
                        <td className="p-4 uppercase text-[10px] font-bold">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-300 text-slate-900">
                            {p.type}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setViewingProduct(p)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-2 rounded-xl bg-slate-900 text-white hover:bg-black cursor-pointer"
                              title="Edit Compound"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: COA MANAGEMENT */}
          {activeTab === 'coas' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase">COA Reports Management</h2>
                  <p className="text-xs text-slate-500">Add, view, and manage HPLC mass spec laboratory report documents</p>
                </div>
                <button
                  onClick={() => setIsAddingCOA(!isAddingCOA)}
                  className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center space-x-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New COA Report</span>
                </button>
              </div>

              {/* Add COA Form */}
              {isAddingCOA && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await addCOA({
                      productTitle: coaTitle,
                      batchNumber: coaBatch,
                      purity: coaPurity,
                      imageUrl: coaImage || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop',
                      pdfUrl: coaPdf || undefined,
                      date: new Date().toISOString().split('T')[0],
                    });
                    setIsAddingCOA(false);
                    setCoaTitle('');
                    setCoaImage('');
                  }}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 space-y-4 shadow-xl text-slate-900"
                >
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">New COA Report Document</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Compound Product Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. BPC-157 5mg High Purity"
                        value={coaTitle}
                        onChange={(e) => setCoaTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Batch Number *</label>
                      <input
                        type="text"
                        required
                        value={coaBatch}
                        onChange={(e) => setCoaBatch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Purity Percentage *</label>
                      <input
                        type="text"
                        required
                        value={coaPurity}
                        onChange={(e) => setCoaPurity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Report Image URL (Cloudinary, AWS) *</label>
                      <input
                        type="text"
                        required
                        placeholder="https://..."
                        value={coaImage}
                        onChange={(e) => setCoaImage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" className="bg-slate-900 hover:bg-black text-white font-bold text-xs py-3 px-6 rounded-xl cursor-pointer">
                      Save COA Document
                    </button>
                    <button type="button" onClick={() => setIsAddingCOA(false)} className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* COA Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white uppercase font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-4">Compound Title</th>
                      <th className="p-4">Batch Number</th>
                      <th className="p-4">Purity</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-900">
                    {coas.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-900 text-sm">{c.productTitle}</td>
                        <td className="p-4 font-mono font-bold text-slate-900">{c.batchNumber}</td>
                        <td className="p-4 font-bold text-emerald-700">{c.purity}</td>
                        <td className="p-4 text-slate-600">{c.date}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => deleteCOA(c.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: FAQ ACCORDIONS MANAGEMENT */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase">FAQ Accordions</h2>
                  <p className="text-xs text-slate-500">Add, edit, or delete customer question & answer items</p>
                </div>
                <button
                  onClick={() => setIsAddingFAQ(!isAddingFAQ)}
                  className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center space-x-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New FAQ</span>
                </button>
              </div>

              {/* Add FAQ Form */}
              {isAddingFAQ && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await addFAQ({
                      question: faqQuestion,
                      answer: faqAnswer,
                      category: faqCategory,
                    });
                    setIsAddingFAQ(false);
                    setFaqQuestion('');
                    setFaqAnswer('');
                  }}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 space-y-4 shadow-xl text-slate-900"
                >
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">New FAQ Accordion Item</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Question *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. How are peptides dispatched within Australia?"
                        value={faqQuestion}
                        onChange={(e) => setFaqQuestion(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Answer Content *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Detailed answer text..."
                        value={faqAnswer}
                        onChange={(e) => setFaqAnswer(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Category</label>
                      <select
                        value={faqCategory}
                        onChange={(e) => setFaqCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 cursor-pointer"
                      >
                        <option value="General">General</option>
                        <option value="Quality & HPLC">Quality & HPLC</option>
                        <option value="Shipping & Delivery">Shipping & Delivery</option>
                        <option value="Orders & Payment">Orders & Payment</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" className="bg-slate-900 hover:bg-black text-white font-bold text-xs py-3 px-6 rounded-xl cursor-pointer">
                      Save FAQ Item
                    </button>
                    <button type="button" onClick={() => setIsAddingFAQ(false)} className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* FAQ Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white uppercase font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-4">Question</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-900">
                    {faqs.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-900">{f.question}</td>
                        <td className="p-4 text-slate-700 font-bold">{f.category}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button onClick={() => setEditingFAQ(f)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 cursor-pointer">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteFAQ(f.id)} className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CONTACT US & LOCATION CONFIG */}
          {activeTab === 'contact' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase">Contact Details & Map Embed</h2>
                  <p className="text-xs text-slate-500">Edit support phone, email, address, operating hours, and Google Maps embed</p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer shadow-md"
                >
                  Save Contact Settings
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Support Email Address</label>
                  <input
                    type="email"
                    value={editableSettings.contactEmail}
                    onChange={(e) => setEditableSettings({ ...editableSettings, contactEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={editableSettings.contactPhone}
                    onChange={(e) => setEditableSettings({ ...editableSettings, contactPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Australian Laboratory Address</label>
                  <input
                    type="text"
                    value={editableSettings.address}
                    onChange={(e) => setEditableSettings({ ...editableSettings, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Business Operating Hours</label>
                  <input
                    type="text"
                    value={editableSettings.businessHours}
                    onChange={(e) => setEditableSettings({ ...editableSettings, businessHours: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Google Maps Embed URL (iframe src)</label>
                  <input
                    type="text"
                    value={editableSettings.mapEmbedUrl}
                    onChange={(e) => setEditableSettings({ ...editableSettings, mapEmbedUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS DIRECTORY */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-black text-slate-900 uppercase">Customer Directory</h2>
                <p className="text-xs text-slate-500">Captured automatically during checkout shipping details</p>
              </div>

              {customers.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs">
                  No customer profiles registered yet. Checkout details will populate this directory automatically.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white uppercase font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Location</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-900">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="p-4 font-bold text-slate-900 text-sm">{c.firstName} {c.lastName}</td>
                          <td className="p-4 font-mono font-bold text-slate-900">{c.email}</td>
                          <td className="p-4 font-mono text-slate-600">{c.phone}</td>
                          <td className="p-4 text-slate-700">{c.suburb}, {c.state}</td>
                          <td className="p-4 text-right">
                            <button onClick={() => deleteCustomer(c.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: LEADS & CALLBACK DESK */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-black text-slate-900 uppercase">Leads & Callback Desk</h2>
                <p className="text-xs text-slate-500">Inbound requests submitted via "Request Call Back" button</p>
              </div>

              {leads.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs">
                  No callback requests submitted yet.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white uppercase font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Phone Number</th>
                        <th className="p-4">Preferred Time</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-900">
                      {leads.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-50">
                          <td className="p-4 font-bold text-slate-900 text-sm">{l.name}</td>
                          <td className="p-4 font-mono font-bold text-slate-900">{l.phone}</td>
                          <td className="p-4 text-slate-700">{l.message || 'Callback Request'}</td>
                          <td className="p-4">
                            <select
                              value={l.status}
                              onChange={(e: any) => updateLeadStatus(l.id, e.target.value)}
                              className="bg-slate-50 text-slate-900 text-xs px-3 py-1.5 rounded-xl border border-slate-300 font-bold cursor-pointer"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => deleteLead(l.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: PROMO CODE GENERATOR */}
          {activeTab === 'promos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase">Promo Code Generator</h2>
                  <p className="text-xs text-slate-500">Create discount coupons for checkout validation</p>
                </div>
                <button
                  onClick={() => setIsAddingPromo(!isAddingPromo)}
                  className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center space-x-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Promo Code</span>
                </button>
              </div>

              {/* Add Promo Code Form */}
              {isAddingPromo && (
                <form onSubmit={handleCreatePromoSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 space-y-4 shadow-xl text-slate-900">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">New Coupon Code</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Coupon Code (Uppercase) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. STRAYA20"
                        value={promoCodeName}
                        onChange={(e) => setPromoCodeName(e.target.value.toUpperCase())}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Discount Type *</label>
                      <select
                        value={promoType}
                        onChange={(e: any) => setPromoType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 cursor-pointer"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (AUD $)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Discount Value *</label>
                      <input
                        type="number"
                        required
                        value={promoValue}
                        onChange={(e) => setPromoValue(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Max Usages Limit *</label>
                      <input
                        type="number"
                        required
                        value={promoMaxUsage}
                        onChange={(e) => setPromoMaxUsage(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" className="bg-slate-900 hover:bg-black text-white font-bold text-xs py-3 px-6 rounded-xl cursor-pointer">
                      Activate Coupon
                    </button>
                    <button type="button" onClick={() => setIsAddingPromo(false)} className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Promo Code Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white uppercase font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-4">Coupon Code</th>
                      <th className="p-4">Discount</th>
                      <th className="p-4">Used Count</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-900">
                    {promoCodes.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-4 font-mono font-bold text-slate-900 text-sm">{p.code}</td>
                        <td className="p-4 font-bold text-slate-700">
                          {p.discountType === 'percentage' ? `${p.discountValue}% OFF` : `$${p.discountValue} OFF`}
                        </td>
                        <td className="p-4 font-mono text-slate-600">{p.usedCount} / {p.maxUsage}</td>
                        <td className="p-4">
                          <button
                            onClick={() => togglePromoCode(p.id, !p.active)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                              p.active ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-600 border border-slate-300'
                            }`}
                          >
                            {p.active ? 'ACTIVE' : 'INACTIVE'}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => deletePromoCode(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: SITE SETTINGS & BANK CONFIG */}
          {activeTab === 'settings' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase">Site Configuration & Bank Info</h2>
                  <p className="text-xs text-slate-500">Edit branding links, bank transfer details, and contact info</p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer shadow-md"
                >
                  Save Settings
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Logo Image Link (URL)</label>
                  <input
                    type="text"
                    value={editableSettings.logoUrl}
                    onChange={(e) => setEditableSettings({ ...editableSettings, logoUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Intro Loader Video Duration in Seconds (e.g. 2.46 or 3.5)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editableSettings.welcomingVideoDurationSec || 3.0}
                    onChange={(e) => setEditableSettings({ ...editableSettings, welcomingVideoDurationSec: parseFloat(e.target.value) || 3.0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900"
                  />
                </div>

                <div className="md:col-span-2 pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Australian Bank Transfer / PayID Details</h3>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={editableSettings.bankInfo?.bankName || ''}
                    onChange={(e) => setEditableSettings({ ...editableSettings, bankInfo: { ...editableSettings.bankInfo, bankName: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Account Name</label>
                  <input
                    type="text"
                    value={editableSettings.bankInfo?.accountName || ''}
                    onChange={(e) => setEditableSettings({ ...editableSettings, bankInfo: { ...editableSettings.bankInfo, accountName: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">BSB Number</label>
                  <input
                    type="text"
                    value={editableSettings.bankInfo?.bsb || ''}
                    onChange={(e) => setEditableSettings({ ...editableSettings, bankInfo: { ...editableSettings.bankInfo, bsb: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Account Number</label>
                  <input
                    type="text"
                    value={editableSettings.bankInfo?.accountNumber || ''}
                    onChange={(e) => setEditableSettings({ ...editableSettings, bankInfo: { ...editableSettings.bankInfo, accountNumber: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">PayID Identifier (Email or Phone)</label>
                  <input
                    type="text"
                    value={editableSettings.bankInfo?.payId || ''}
                    onChange={(e) => setEditableSettings({ ...editableSettings, bankInfo: { ...editableSettings.bankInfo, payId: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SEO & METADATA CONFIG */}
          {activeTab === 'seo' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase">SEO & Open Graph Metadata</h2>
                  <p className="text-xs text-slate-500">Edit page titles, meta descriptions, and social preview cards</p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer shadow-md"
                >
                  Save SEO Config
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Meta Title Tag</label>
                  <input
                    type="text"
                    value={editableSettings.seoTitle || ''}
                    onChange={(e) => setEditableSettings({ ...editableSettings, seoTitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Meta Description</label>
                  <textarea
                    rows={3}
                    value={editableSettings.seoMetaDescription || ''}
                    onChange={(e) => setEditableSettings({ ...editableSettings, seoMetaDescription: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Order Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 rounded-3xl p-6 max-w-lg w-full text-slate-900 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] text-[#FF007A] font-bold uppercase font-mono">ORDER DETAILS</span>
                <h3 className="text-lg font-black font-mono text-slate-900">{viewingOrder.id}</h3>
              </div>
              <button onClick={() => setViewingOrder(null)} className="p-2 text-slate-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <p><strong>Customer:</strong> {viewingOrder.customer?.firstName || 'Guest'} {viewingOrder.customer?.lastName || ''}</p>
                <p><strong>Email:</strong> {viewingOrder.customer?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {viewingOrder.customer?.phone || 'N/A'}</p>
                <p><strong>Address:</strong> {viewingOrder.customer?.address?.street || 'N/A'}, {viewingOrder.customer?.address?.suburb || ''} {viewingOrder.customer?.address?.state || ''} {viewingOrder.customer?.address?.postcode || ''}</p>
              </div>

              <div>
                <p className="font-bold mb-1">Ordered Items:</p>
                <div className="space-y-1">
                  {viewingOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between bg-slate-100 p-2 rounded-lg text-slate-900 font-bold">
                      <span>{item.quantity}x {item.product.title}</span>
                      <span className="font-mono">{formatAUD((item.product.discountedPrice || item.product.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-black">
                <span>Total AUD Due:</span>
                <span className="text-[#FF007A] font-mono">{formatAUD(viewingOrder.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateProduct(editingProduct.id, editingProduct);
              setEditingProduct(null);
            }}
            className="bg-white border border-slate-300 rounded-3xl p-6 max-w-xl w-full text-slate-900 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold uppercase text-slate-900">Edit Product: {editingProduct.title}</h3>
              <button type="button" onClick={() => setEditingProduct(null)} className="p-2 text-slate-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Title</label>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Image Link</label>
                <input
                  type="text"
                  value={editingProduct.images[0] || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Original Price (AUD)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Discounted Price (AUD)</label>
                <input
                  type="number"
                  value={editingProduct.discountedPrice || editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, discountedPrice: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Description & Notes</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
              <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs rounded-xl font-bold border border-slate-300">
                Cancel
              </button>
              <button type="submit" className="bg-slate-900 hover:bg-black text-white text-xs px-6 py-2 rounded-xl font-bold cursor-pointer">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Product Details Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 rounded-3xl p-6 max-w-md w-full text-slate-900 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 uppercase">{viewingProduct.title}</h3>
              <button onClick={() => setViewingProduct(null)} className="p-2 text-slate-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={viewingProduct.images[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop'} alt={viewingProduct.title} className="w-full h-full object-cover" />
            </div>
            <div className="text-xs space-y-1.5 text-slate-700">
              <p><strong>Category:</strong> <span className="text-[#FF007A] font-bold">{viewingProduct.category}</span></p>
              <p><strong>Price:</strong> <span className="font-mono text-slate-900 font-bold">{formatAUD(viewingProduct.discountedPrice || viewingProduct.price)}</span></p>
              <p><strong>Purity Spec:</strong> {viewingProduct.purity || '>99% HPLC Verified'}</p>
              <p><strong>Dosage Form:</strong> {viewingProduct.dosage || 'Standard Vial'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit FAQ Modal */}
      {editingFAQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateFAQ(editingFAQ.id, editingFAQ);
              setEditingFAQ(null);
            }}
            className="bg-white border border-slate-300 rounded-3xl p-6 max-w-xl w-full text-slate-900 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold uppercase text-slate-900">Edit FAQ Item</h3>
              <button type="button" onClick={() => setEditingFAQ(null)} className="p-2 text-slate-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Question</label>
                <input
                  type="text"
                  value={editingFAQ.question}
                  onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Answer Content</label>
                <textarea
                  rows={3}
                  value={editingFAQ.answer}
                  onChange={(e) => setEditingFAQ({ ...editingFAQ, answer: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category</label>
                <select
                  value={editingFAQ.category}
                  onChange={(e) => setEditingFAQ({ ...editingFAQ, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 cursor-pointer"
                >
                  <option value="General">General</option>
                  <option value="Quality & HPLC">Quality & HPLC</option>
                  <option value="Shipping & Delivery">Shipping & Delivery</option>
                  <option value="Orders & Payment">Orders & Payment</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
              <button type="button" onClick={() => setEditingFAQ(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs rounded-xl font-bold border border-slate-300">
                Cancel
              </button>
              <button type="submit" className="bg-slate-900 hover:bg-black text-white text-xs px-6 py-2 rounded-xl font-bold cursor-pointer">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Official Corporate Tax Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={selectedOrderForInvoice}
      />
    </div>
  );
}
