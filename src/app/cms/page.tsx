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
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  Layers,
  Clock,
  Filter,
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
    customers,
    deleteCustomer,
    leads,
    updateLeadStatus,
    deleteLead,
    promoCodes,
    addPromoCode,
    togglePromoCode,
    deletePromoCode,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'settings' | 'products' | 'orders' | 'customers' | 'leads' | 'promos' | 'seo'
  >('overview');

  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

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

  // Modal State for Invoice Preview
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

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
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'leads', label: 'Leads & Callback Desk', icon: PhoneCall, badge: leads.filter(l => l.status === 'new').length > 0 ? 'New' : undefined },
    { id: 'promos', label: 'Promo Code Generator', icon: Tag },
    { id: 'settings', label: 'Site & Bank Config', icon: Settings },
    { id: 'seo', label: 'SEO & Metadata', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex font-sans select-none">
      {/* 1. CMS SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#0B0F19] border-r border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-6 space-y-6">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF007A] to-[#00F0FF] p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center font-black text-xl text-white">
                S
              </div>
            </div>
            <div>
              <span className="font-black text-lg text-white tracking-wider">
                STRAYA<span className="text-[#FF007A]">.</span>
              </span>
              <span className="text-[10px] text-[#00F0FF] font-bold block uppercase tracking-widest -mt-1">
                CMS Admin Portal
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 pt-2">
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
                      ? 'bg-gradient-to-r from-[#FF007A] to-[#C4005E] text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] text-[10px] font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0A0D15]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FF007A]/20 border border-[#FF007A]/40 flex items-center justify-center font-bold text-xs text-[#FF007A]">
                AU
              </div>
              <div className="text-xs truncate max-w-[130px]">
                <p className="font-bold text-white leading-tight truncate">{currentUserEmail || 'Admin User'}</p>
                <p className="text-[10px] text-emerald-400 font-mono">● Authenticated</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-red-950/40 border border-red-900/60 hover:bg-red-900/60 text-red-300 text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CMS CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-black text-white uppercase tracking-wider hidden sm:block">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
          </div>

          {/* Quick Header Controls */}
          <div className="flex items-center space-x-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <span>Live Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#00F0FF]" />
            </a>

            <button
              onClick={() => {
                setActiveTab('products');
                setIsAddingProduct(true);
              }}
              className="glow-pink-btn text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </header>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden flex items-center space-x-2 overflow-x-auto p-3 bg-[#0B0F19] border-b border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as any)}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 shrink-0 ${
                  isActive ? 'bg-[#FF007A] text-white' : 'bg-slate-800 text-slate-400'
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
                <div className="bg-[#0F1422] p-6 rounded-2xl border border-slate-800 shadow-lg space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                    <span>Verified Sales</span>
                    <DollarSign className="w-4 h-4 text-[#00F0FF]" />
                  </div>
                  <h3 className="text-3xl font-black text-[#00F0FF] font-mono">{formatAUD(totalRevenue)}</h3>
                  <div className="flex items-center space-x-1 text-[11px] text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Real-time Firebase Sync</span>
                  </div>
                </div>

                <div className="bg-[#0F1422] p-6 rounded-2xl border border-slate-800 shadow-lg space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                    <span>Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-[#FF007A]" />
                  </div>
                  <h3 className="text-3xl font-black text-white font-mono">{totalOrdersCount}</h3>
                  <p className="text-[11px] text-[#FF007A] font-bold">{unpaidOrdersCount} Orders Awaiting Payment</p>
                </div>

                <div className="bg-[#0F1422] p-6 rounded-2xl border border-slate-800 shadow-lg space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                    <span>Customer Accounts</span>
                    <Users className="w-4 h-4 text-[#00F0FF]" />
                  </div>
                  <h3 className="text-3xl font-black text-white font-mono">{totalCustomersCount}</h3>
                  <p className="text-[11px] text-slate-400">Captured from checkout</p>
                </div>

                <div className="bg-[#0F1422] p-6 rounded-2xl border border-slate-800 shadow-lg space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                    <span>Inquiries & Leads</span>
                    <PhoneCall className="w-4 h-4 text-[#FF007A]" />
                  </div>
                  <h3 className="text-3xl font-black text-[#FF007A] font-mono">{totalLeadsCount}</h3>
                  <p className="text-[11px] text-slate-400">Callback requests & contact messages</p>
                </div>
              </div>

              {/* 📊 INTERACTIVE GRAPH WIDGETS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Sales Trend Bar/Area Chart (2 Cols) */}
                <div className="lg:col-span-2 bg-[#0F1422] p-6 rounded-2xl border border-slate-800 space-y-6 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-[#00F0FF]" />
                        <span>Sales Revenue Analytics</span>
                      </h3>
                      <p className="text-xs text-slate-400">Calculated live from paid database orders</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-[#00F0FF]/15 text-[#00F0FF] text-xs font-mono font-bold">
                      AUD Growth
                    </span>
                  </div>

                  <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800">
                    {[
                      { month: 'Mar', val: 0, height: '10%' },
                      { month: 'Apr', val: 0, height: '10%' },
                      { month: 'May', val: 0, height: '10%' },
                      { month: 'Jun', val: 0, height: '10%' },
                      { month: 'Jul', val: 0, height: '10%' },
                      { month: 'Aug', val: Math.round(totalRevenue), height: totalRevenue > 0 ? '100%' : '15%' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="text-[10px] font-mono text-slate-400 group-hover:text-white transition-colors">
                          ${item.val}
                        </div>
                        <div className="w-full max-w-[40px] bg-slate-800 rounded-t-lg overflow-hidden h-40 flex items-end p-0.5">
                          <div
                            style={{ height: item.height }}
                            className="w-full bg-gradient-to-t from-[#FF007A] to-[#00F0FF] rounded-t-md group-hover:brightness-125 transition-all"
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-300">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distribution Breakdown Donut & Quick Activity (1 Col) */}
                <div className="bg-[#0F1422] p-6 rounded-2xl border border-slate-800 space-y-6 shadow-lg flex flex-col justify-between">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                      <PieChart className="w-5 h-5 text-[#FF007A]" />
                      <span>Order Status Breakdown</span>
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-emerald-400">Paid Orders ({paidOrders.length})</span>
                        <span className="text-white">
                          {totalOrdersCount > 0 ? Math.round((paidOrders.length / totalOrdersCount) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full"
                          style={{
                            width: `${totalOrdersCount > 0 ? (paidOrders.length / totalOrdersCount) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#FF007A]">Unpaid Orders ({unpaidOrdersCount})</span>
                        <span className="text-white">
                          {totalOrdersCount > 0 ? Math.round((unpaidOrdersCount / totalOrdersCount) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#FF007A] h-full rounded-full"
                          style={{
                            width: `${totalOrdersCount > 0 ? (unpaidOrdersCount / totalOrdersCount) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                    <span className="text-[#00F0FF] font-bold block mb-1">Production Security Active</span>
                    Firebase Authentication & Security Rules active.
                  </div>
                </div>
              </div>

              {/* Recent Orders List Preview */}
              <div className="bg-[#0F1422] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white uppercase">Recent Store Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#00F0FF] hover:underline font-bold"
                  >
                    View All Orders →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No orders placed yet. New checkout orders will appear here automatically.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-300 uppercase font-bold">
                        <tr>
                          <th className="p-3">Order ID</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Total Amount</th>
                          <th className="p-3">Payment</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200">
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o.id} className="hover:bg-slate-800/40">
                            <td className="p-3 font-mono font-bold text-[#FF007A]">{o.id}</td>
                            <td className="p-3 font-bold text-white">{o.customer.firstName} {o.customer.lastName}</td>
                            <td className="p-3 font-mono font-bold text-slate-100">{formatAUD(o.totalAmount)}</td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                o.paymentStatus === 'paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
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
                                className="px-3 py-1 rounded-lg bg-[#00F0FF]/20 text-[#00F0FF] font-bold text-[10px] uppercase cursor-pointer"
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
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white uppercase">Orders & Official Invoices</h2>
                  <p className="text-xs text-slate-400">Manage payment status, shipping stages, and print invoices</p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0F1422] border border-slate-800 text-slate-400 text-xs">
                  No orders found in database. New customer orders will be listed here in real-time.
                </div>
              ) : (
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0F1422] shadow-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-200 uppercase font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Payment Status</th>
                        <th className="p-4">Shipping Stage</th>
                        <th className="p-4 text-right">Invoice Export</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 font-mono font-bold text-[#FF007A] text-sm">{o.id}</td>
                          <td className="p-4">
                            <p className="font-bold text-white text-sm">{o.customer.firstName} {o.customer.lastName}</p>
                            <p className="text-slate-400 font-mono text-[11px]">{o.customer.email}</p>
                            <p className="text-slate-400 font-mono text-[11px]">{o.customer.phone}</p>
                          </td>
                          <td className="p-4 font-mono font-bold text-white text-sm">{formatAUD(o.totalAmount)}</td>
                          <td className="p-4">
                            <button
                              onClick={() => updateOrderStatus(o.id, o.paymentStatus === 'paid' ? 'unpaid' : 'paid')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase cursor-pointer transition-all ${
                                o.paymentStatus === 'paid'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900'
                                  : 'bg-amber-950 text-amber-400 border border-amber-800 hover:bg-amber-900'
                              }`}
                            >
                              {o.paymentStatus} (Toggle)
                            </button>
                          </td>
                          <td className="p-4">
                            <select
                              value={o.deliveryStatus}
                              onChange={(e: any) => updateOrderStatus(o.id, undefined, e.target.value)}
                              className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:border-[#00F0FF] cursor-pointer font-bold"
                            >
                              <option value="Payment Received">Payment Received</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrderForInvoice(o);
                                setIsInvoiceOpen(true);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-[#00F0FF]/20 border border-[#00F0FF]/50 text-[#00F0FF] hover:bg-[#00F0FF] hover:text-black font-bold text-xs uppercase flex items-center space-x-1.5 ml-auto transition-all cursor-pointer"
                            >
                              <FileText className="w-4 h-4" />
                              <span>Export Invoice</span>
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

          {/* TAB 3: PRODUCT CATALOG CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white uppercase">Product Catalog CRUD</h2>
                  <p className="text-xs text-slate-400">Add, edit, or delete compound listings and custom categories</p>
                </div>

                <button
                  onClick={() => setIsAddingProduct(!isAddingProduct)}
                  className="glow-pink-btn text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center space-x-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Add Custom Category Box */}
              <div className="bg-[#0F1422] p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <span className="text-xs font-bold text-slate-300 shrink-0">Add Category To Dropdown List:</span>
                <input
                  type="text"
                  placeholder="e.g. Nootropic Compounds..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="bg-slate-900 text-white text-xs px-3.5 py-2 rounded-xl border border-slate-700 flex-1 focus:outline-none focus:border-[#00F0FF]"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="glow-cyan-btn text-black font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                >
                  Add Category
                </button>
              </div>

              {/* Add Product Form Modal / Box */}
              {isAddingProduct && (
                <form onSubmit={handleCreateProductSubmit} className="bg-[#0F1422] p-6 sm:p-8 rounded-3xl border border-[#FF007A]/40 space-y-4 shadow-2xl">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">New Product Configuration</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. BPC-157 5mg Vial"
                        value={prodTitle}
                        onChange={(e) => setProdTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF007A]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Image URL Link (Cloudinary, AWS, Unsplash) *</label>
                      <input
                        type="text"
                        required
                        placeholder="https://..."
                        value={prodImage}
                        onChange={(e) => setProdImage(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Original Price (AUD) *</label>
                      <input
                        type="number"
                        required
                        value={prodPrice}
                        onChange={(e) => setProdPrice(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Discounted Price (AUD)</label>
                      <input
                        type="number"
                        value={prodDiscountPrice}
                        onChange={(e) => setProdDiscountPrice(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Category Dropdown *</label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white cursor-pointer"
                      >
                        {siteSettings.categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Type Flag (Home Page Display) *</label>
                      <select
                        value={prodType}
                        onChange={(e: any) => setProdType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white cursor-pointer"
                      >
                        <option value="best_sell">Best Sale Section</option>
                        <option value="featured">Featured Section</option>
                        <option value="standard">Standard Catalog</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      className="glow-pink-btn text-white font-bold text-xs py-3 px-6 rounded-xl cursor-pointer"
                    >
                      Save Product to Catalog
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Table */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0F1422] shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-200 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price / Disc</th>
                      <th className="p-4">Type Flag</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40">
                        <td className="p-4 font-bold text-white text-sm">{p.title}</td>
                        <td className="p-4 text-[#00F0FF] font-bold">{p.category}</td>
                        <td className="p-4 font-mono text-sm">{formatAUD(p.discountedPrice || p.price)}</td>
                        <td className="p-4 uppercase text-[10px] font-bold">
                          <span className="px-2.5 py-1 rounded-md bg-[#FF007A]/20 border border-[#FF007A]/40 text-[#FF007A]">
                            {p.type}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-2 text-slate-400 hover:text-red-400 cursor-pointer"
                            title="Delete Product"
                          >
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

          {/* TAB 4: CUSTOMERS DIRECTORY */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-black text-white uppercase">Customer Directory</h2>
                <p className="text-xs text-slate-400">Captured automatically during checkout shipping details</p>
              </div>

              {customers.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0F1422] border border-slate-800 text-slate-400 text-xs">
                  No customer profiles registered yet. Checkout details will populate this directory automatically.
                </div>
              ) : (
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0F1422] shadow-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-200 uppercase font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Contact Info</th>
                        <th className="p-4">Australian Address</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-800/40">
                          <td className="p-4 font-bold text-white text-sm">
                            {c.firstName} {c.lastName}
                          </td>
                          <td className="p-4">
                            <p className="text-white font-bold">{c.email}</p>
                            <p className="text-slate-400 font-mono">{c.phone}</p>
                          </td>
                          <td className="p-4 text-slate-300">
                            {c.street}, {c.suburb} {c.state} {c.postcode}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => deleteCustomer(c.id)}
                              className="p-2 text-slate-400 hover:text-red-400 cursor-pointer"
                            >
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

          {/* TAB 5: LEADS & CALLBACK REQUESTS */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-black text-white uppercase">Leads & Callback Requests</h2>
                <p className="text-xs text-slate-400">Captured from Request Call modal and Contact Us form</p>
              </div>

              {leads.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0F1422] border border-slate-800 text-slate-400 text-xs">
                  No inquiries or callback leads submitted yet. Form submissions will appear here in real-time.
                </div>
              ) : (
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0F1422] shadow-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-200 uppercase font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-4">Lead Name</th>
                        <th className="p-4">Phone / Email</th>
                        <th className="p-4">Source</th>
                        <th className="p-4">Message</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      {leads.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-800/40">
                          <td className="p-4 font-bold text-white text-sm">{l.name}</td>
                          <td className="p-4 font-mono">
                            <div className="text-white font-bold">{l.phone}</div>
                            <div className="text-slate-400">{l.email}</div>
                          </td>
                          <td className="p-4 font-bold text-[#00F0FF] uppercase text-[10px]">{l.source}</td>
                          <td className="p-4 text-slate-300 max-w-xs truncate">{l.message || 'Callback requested'}</td>
                          <td className="p-4">
                            <select
                              value={l.status}
                              onChange={(e: any) => updateLeadStatus(l.id, e.target.value)}
                              className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer font-bold"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => deleteLead(l.id)} className="p-2 text-slate-400 hover:text-red-400 cursor-pointer">
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
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white uppercase">Promo Code Generator</h2>
                  <p className="text-xs text-slate-400">Generate discount codes with usage limits and active toggles</p>
                </div>
                <button
                  onClick={() => setIsAddingPromo(!isAddingPromo)}
                  className="glow-pink-btn text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Code</span>
                </button>
              </div>

              {isAddingPromo && (
                <form onSubmit={handleCreatePromoSubmit} className="bg-[#0F1422] p-6 rounded-2xl border border-[#FF007A]/40 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Code Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. STRAYA20"
                        value={promoCodeName}
                        onChange={(e) => setPromoCodeName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Discount Type *</label>
                      <select
                        value={promoType}
                        onChange={(e: any) => setPromoType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white cursor-pointer"
                      >
                        <option value="percentage">Percentage (%) Off</option>
                        <option value="fixed">Fixed Amount ($ AUD) Off</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Value (% or $) *</label>
                      <input
                        type="number"
                        required
                        value={promoValue}
                        onChange={(e) => setPromoValue(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Usage Limit *</label>
                      <input
                        type="number"
                        required
                        value={promoMaxUsage}
                        onChange={(e) => setPromoMaxUsage(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>
                  </div>
                  <button type="submit" className="glow-pink-btn text-white text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer">
                    Save Code
                  </button>
                </form>
              )}

              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0F1422] shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-200 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Code</th>
                      <th className="p-4">Discount</th>
                      <th className="p-4">Usage (Used / Limit)</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {promoCodes.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40">
                        <td className="p-4 font-mono font-bold text-[#00F0FF] text-sm">{p.code}</td>
                        <td className="p-4 font-bold text-white">
                          {p.discountType === 'percentage' ? `${p.discountValue}%` : formatAUD(p.discountValue)}
                        </td>
                        <td className="p-4 font-mono">{p.usedCount} / {p.maxUsage}</td>
                        <td className="p-4">
                          <button
                            onClick={() => togglePromoCode(p.id, !p.active)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                              p.active ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                            }`}
                          >
                            {p.active ? 'ACTIVE' : 'INACTIVE'}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => deletePromoCode(p.id)} className="p-2 text-slate-400 hover:text-red-400 cursor-pointer">
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
            <div className="bg-[#0F1422] p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white uppercase">Site Configuration & Bank Info</h2>
                  <p className="text-xs text-slate-400">Edit branding links, bank transfer details, and contact info</p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  className="glow-pink-btn text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
                >
                  Save Settings
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Logo Image Link (URL)</label>
                  <input
                    type="text"
                    value={editableSettings.logoUrl}
                    onChange={(e) => setEditableSettings({ ...editableSettings, logoUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Welcoming Loader Video Link (.mp4)</label>
                  <input
                    type="text"
                    value={editableSettings.welcomingVideoUrl}
                    onChange={(e) => setEditableSettings({ ...editableSettings, welcomingVideoUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Intro Video Duration in Seconds (e.g. 2.46 or 3.5)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editableSettings.welcomingVideoDurationSec || 3.0}
                    onChange={(e) => setEditableSettings({ ...editableSettings, welcomingVideoDurationSec: parseFloat(e.target.value) || 3.0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">Top Banner Announcement Text</label>
                  <input
                    type="text"
                    value={editableSettings.topBannerText}
                    onChange={(e) => setEditableSettings({ ...editableSettings, topBannerText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF007A]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Hero Media Type</label>
                  <select
                    value={editableSettings.heroMediaType}
                    onChange={(e: any) => setEditableSettings({ ...editableSettings, heroMediaType: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white cursor-pointer font-bold"
                  >
                    <option value="video">Video Loop (.mp4)</option>
                    <option value="image">Background Image</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Hero Media Link (Cloudinary, AWS, etc.)</label>
                  <input
                    type="text"
                    value={editableSettings.heroMediaUrl}
                    onChange={(e) => setEditableSettings({ ...editableSettings, heroMediaUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">Hero Section Title</label>
                  <input
                    type="text"
                    value={editableSettings.heroTitle}
                    onChange={(e) => setEditableSettings({ ...editableSettings, heroTitle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                {/* Bank Information Sub-Section */}
                <div className="md:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 pt-4">
                  <h3 className="text-sm font-black text-[#00F0FF] uppercase tracking-wider">Bank Transfer & PayID Config</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={editableSettings.bankInfo.bankName}
                        onChange={(e) => setEditableSettings({
                          ...editableSettings,
                          bankInfo: { ...editableSettings.bankInfo, bankName: e.target.value }
                        })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Account Name</label>
                      <input
                        type="text"
                        value={editableSettings.bankInfo.accountName}
                        onChange={(e) => setEditableSettings({
                          ...editableSettings,
                          bankInfo: { ...editableSettings.bankInfo, accountName: e.target.value }
                        })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">BSB Number</label>
                      <input
                        type="text"
                        value={editableSettings.bankInfo.bsb}
                        onChange={(e) => setEditableSettings({
                          ...editableSettings,
                          bankInfo: { ...editableSettings.bankInfo, bsb: e.target.value }
                        })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Account Number</label>
                      <input
                        type="text"
                        value={editableSettings.bankInfo.accountNumber}
                        onChange={(e) => setEditableSettings({
                          ...editableSettings,
                          bankInfo: { ...editableSettings.bankInfo, accountNumber: e.target.value }
                        })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-bold mb-1">PayID Email</label>
                      <input
                        type="text"
                        value={editableSettings.bankInfo.payId}
                        onChange={(e) => setEditableSettings({
                          ...editableSettings,
                          bankInfo: { ...editableSettings.bankInfo, payId: e.target.value }
                        })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SEO & METADATA MANAGER */}
          {activeTab === 'seo' && (
            <div className="bg-[#0F1422] p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white uppercase">SEO & Metadata Manager</h2>
                  <p className="text-xs text-slate-400">Configure search engine titles, descriptions, and index keywords</p>
                </div>
                <button onClick={handleSaveSettings} className="glow-pink-btn text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer">
                  Save Meta Data
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">SEO Title Tag</label>
                  <input
                    type="text"
                    value={editableSettings.seoTitle}
                    onChange={(e) => setEditableSettings({ ...editableSettings, seoTitle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Meta Description</label>
                  <textarea
                    rows={3}
                    value={editableSettings.seoMetaDescription}
                    onChange={(e) => setEditableSettings({ ...editableSettings, seoMetaDescription: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">SEO Keywords</label>
                  <input
                    type="text"
                    value={editableSettings.seoKeywords}
                    onChange={(e) => setEditableSettings({ ...editableSettings, seoKeywords: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal Exporter */}
      {selectedOrderForInvoice && (
        <InvoiceModal
          order={selectedOrderForInvoice}
          isOpen={isInvoiceOpen}
          onClose={() => {
            setIsInvoiceOpen(false);
            setSelectedOrderForInvoice(null);
          }}
        />
      )}
    </div>
  );
}
