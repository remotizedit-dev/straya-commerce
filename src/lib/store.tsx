'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  SiteSettings,
  COAItem,
  FAQItem,
  PromoCode,
  Order,
  Lead,
  CustomerRecord,
  CartItem,
  DeliveryOption,
} from './types';
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_PRODUCTS,
  INITIAL_COAS,
  INITIAL_FAQS,
  INITIAL_PROMO_CODES,
  INITIAL_ORDERS,
  INITIAL_LEADS,
  INITIAL_CUSTOMERS,
} from './mockData';
import { ref, onValue, set, push, update, remove } from 'firebase/database';
import { database } from './firebase';

interface AppContextType {
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  // Site Data & CMS State
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;

  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  coas: COAItem[];
  addCOA: (coa: Omit<COAItem, 'id'>) => Promise<void>;
  deleteCOA: (id: string) => Promise<void>;

  faqs: FAQItem[];
  addFAQ: (faq: Omit<FAQItem, 'id'>) => Promise<void>;
  updateFAQ: (id: string, faq: Partial<FAQItem>) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;

  promoCodes: PromoCode[];
  addPromoCode: (promo: Omit<PromoCode, 'id' | 'usedCount' | 'createdAt'>) => Promise<void>;
  togglePromoCode: (id: string, active: boolean) => Promise<void>;
  deletePromoCode: (id: string) => Promise<void>;
  validatePromoCode: (code: string) => PromoCode | null;

  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateLeadStatus: (id: string, status: Lead['status']) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;

  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (id: string, paymentStatus?: Order['paymentStatus'], deliveryStatus?: Order['deliveryStatus']) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  customers: CustomerRecord[];
  addOrUpdateCustomer: (customer: Omit<CustomerRecord, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

  // Call Modal
  isCallModalOpen: boolean;
  openCallModal: () => void;
  closeCallModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  // Storefront & CMS data states with seed fallbacks
  const [siteSettings, setSiteSettingsState] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [coas, setCoas] = useState<COAItem[]>(INITIAL_COAS);
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);

  // Load cart from localStorage on client side
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('straya_cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      }
    } catch (e) {
      console.warn('localStorage cart read error', e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('straya_cart', JSON.stringify(cart));
      }
    } catch (e) {
      console.warn('localStorage cart write error', e);
    }
  }, [cart]);

  // Sync with Firebase Realtime Database
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // 1. Site Settings
      const settingsRef = ref(database, 'siteSettings');
      const unsubSettings = onValue(
        settingsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setSiteSettingsState({ ...INITIAL_SITE_SETTINGS, ...snapshot.val() });
          }
        },
        (err) => {
          if (!err.message.includes('permission_denied')) console.warn('Firebase siteSettings read fallback:', err);
        }
      );

      // 2. Products
      const productsRef = ref(database, 'products');
      const unsubProducts = onValue(
        productsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const list: Product[] = Object.keys(data).map((key) => ({ ...data[key], id: key }));
            setProducts(list);
          }
        },
        (err) => {
          if (!err.message.includes('permission_denied')) console.warn('Firebase products read fallback:', err);
        }
      );

      // 3. COAs
      const coaRef = ref(database, 'coas');
      const unsubCOA = onValue(
        coaRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const list: COAItem[] = Object.keys(data).map((key) => ({ ...data[key], id: key }));
            setCoas(list);
          }
        },
        (err) => {
          if (!err.message.includes('permission_denied')) console.warn('Firebase coas read fallback:', err);
        }
      );

      // 4. FAQs
      const faqsRef = ref(database, 'faqs');
      const unsubFaqs = onValue(
        faqsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const list: FAQItem[] = Object.keys(data).map((key) => ({ ...data[key], id: key }));
            setFaqs(list);
          }
        },
        (err) => {
          if (!err.message.includes('permission_denied')) console.warn('Firebase faqs read fallback:', err);
        }
      );

      // 5. Promo Codes
      const promosRef = ref(database, 'promoCodes');
      const unsubPromos = onValue(
        promosRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const list: PromoCode[] = Object.keys(data).map((key) => ({ ...data[key], id: key }));
            setPromoCodes(list);
          }
        },
        (err) => {
          if (!err.message.includes('permission_denied')) console.warn('Firebase promoCodes read fallback:', err);
        }
      );

      // 6. Leads
      const leadsRef = ref(database, 'leads');
      const unsubLeads = onValue(
        leadsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const list: Lead[] = Object.keys(data).map((key) => ({ ...data[key], id: key }));
            setLeads(list);
          }
        },
        (err) => {
          if (!err.message.includes('permission_denied')) console.warn('Firebase leads read fallback:', err);
        }
      );

      // 7. Orders
      const ordersRef = ref(database, 'orders');
      const unsubOrders = onValue(
        ordersRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const list: Order[] = Object.keys(data).map((key) => ({ ...data[key], id: key }));
            setOrders(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          } else {
            setOrders([]);
          }
        },
        (err) => {
          if (!err.message.includes('permission_denied')) console.warn('Firebase orders read fallback:', err);
        }
      );

      // 8. Customers
      const customersRef = ref(database, 'customers');
      const unsubCustomers = onValue(
        customersRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const list: CustomerRecord[] = Object.keys(data).map((key) => ({ ...data[key], id: key }));
            setCustomers(list);
          }
        },
        (err) => {
          if (!err.message.includes('permission_denied')) console.warn('Firebase customers read fallback:', err);
        }
      );

      return () => {
        unsubSettings();
        unsubProducts();
        unsubCOA();
        unsubFaqs();
        unsubPromos();
        unsubLeads();
        unsubOrders();
        unsubCustomers();
      };
    } catch (err) {
      console.warn('Firebase sync listener fallback to local state', err);
    }
  }, []);

  // Cart operations
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((acc, item) => {
    const price = item.product.discountedPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Call modal handlers
  const openCallModal = () => setIsCallModalOpen(true);
  const closeCallModal = () => setIsCallModalOpen(false);

  // CMS Site Settings Update
  const updateSiteSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = { ...siteSettings, ...newSettings };
    setSiteSettingsState(updated);
    try {
      await set(ref(database, 'siteSettings'), updated);
    } catch (e) {
      console.warn('Firebase set error', e);
    }
  };

  // Products CRUD
  const addProduct = async (prodData: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const newProd: Product = { ...prodData, id };
    setProducts((prev) => [newProd, ...prev]);
    try {
      await set(ref(database, `products/${id}`), newProd);
    } catch (e) {
      console.warn('Firebase addProduct error', e);
    }
  };

  const updateProduct = async (id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    try {
      await update(ref(database, `products/${id}`), patch);
    } catch (e) {
      console.warn('Firebase updateProduct error', e);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await remove(ref(database, `products/${id}`));
    } catch (e) {
      console.warn('Firebase deleteProduct error', e);
    }
  };

  // COA CRUD
  const addCOA = async (coaData: Omit<COAItem, 'id'>) => {
    const id = `coa-${Date.now()}`;
    const newItem: COAItem = { ...coaData, id };
    setCoas((prev) => [newItem, ...prev]);
    try {
      await set(ref(database, `coas/${id}`), newItem);
    } catch (e) {
      console.warn('Firebase addCOA error', e);
    }
  };

  const deleteCOA = async (id: string) => {
    setCoas((prev) => prev.filter((c) => c.id !== id));
    try {
      await remove(ref(database, `coas/${id}`));
    } catch (e) {
      console.warn('Firebase deleteCOA error', e);
    }
  };

  // FAQ CRUD
  const addFAQ = async (faqData: Omit<FAQItem, 'id'>) => {
    const id = `faq-${Date.now()}`;
    const newItem: FAQItem = { ...faqData, id };
    setFaqs((prev) => [...prev, newItem]);
    try {
      await set(ref(database, `faqs/${id}`), newItem);
    } catch (e) {
      console.warn('Firebase addFAQ error', e);
    }
  };

  const updateFAQ = async (id: string, patch: Partial<FAQItem>) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
    try {
      await update(ref(database, `faqs/${id}`), patch);
    } catch (e) {
      console.warn('Firebase updateFAQ error', e);
    }
  };

  const deleteFAQ = async (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    try {
      await remove(ref(database, `faqs/${id}`));
    } catch (e) {
      console.warn('Firebase deleteFAQ error', e);
    }
  };

  // Promo Code CRUD
  const addPromoCode = async (promoData: Omit<PromoCode, 'id' | 'usedCount' | 'createdAt'>) => {
    const id = `promo-${Date.now()}`;
    const newPromo: PromoCode = {
      ...promoData,
      id,
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    setPromoCodes((prev) => [newPromo, ...prev]);
    try {
      await set(ref(database, `promoCodes/${id}`), newPromo);
    } catch (e) {
      console.warn('Firebase addPromoCode error', e);
    }
  };

  const togglePromoCode = async (id: string, active: boolean) => {
    setPromoCodes((prev) => prev.map((p) => (p.id === id ? { ...p, active } : p)));
    try {
      await update(ref(database, `promoCodes/${id}`), { active });
    } catch (e) {
      console.warn('Firebase togglePromoCode error', e);
    }
  };

  const deletePromoCode = async (id: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.id !== id));
    try {
      await remove(ref(database, `promoCodes/${id}`));
    } catch (e) {
      console.warn('Firebase deletePromoCode error', e);
    }
  };

  const validatePromoCode = (code: string): PromoCode | null => {
    const trimmed = code.trim().toUpperCase();
    const found = promoCodes.find((p) => p.code.toUpperCase() === trimmed && p.active);
    if (found && found.usedCount < found.maxUsage) {
      return found;
    }
    return null;
  };

  // Leads
  const addLead = async (leadData: Omit<Lead, 'id' | 'status' | 'createdAt'>) => {
    const id = `lead-${Date.now()}`;
    const newLead: Lead = {
      ...leadData,
      id,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
    try {
      await set(ref(database, `leads/${id}`), newLead);
    } catch (e) {
      console.warn('Firebase addLead error', e);
    }
  };

  const updateLeadStatus = async (id: string, status: Lead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await update(ref(database, `leads/${id}`), { status });
    } catch (e) {
      console.warn('Firebase updateLeadStatus error', e);
    }
  };

  const deleteLead = async (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    try {
      await remove(ref(database, `leads/${id}`));
    } catch (e) {
      console.warn('Firebase deleteLead error', e);
    }
  };

  // Orders & Customers
  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `STRAYA-${randomNum}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString(),
    };

    // 1. Optimistic state update
    setOrders((prev) => [newOrder, ...prev]);

    // 2. Direct database write for the Order
    try {
      await set(ref(database, `orders/${orderId}`), newOrder);
    } catch (e) {
      console.error('Firebase createOrder set error', e);
    }

    // 3. Customer directory update
    try {
      await addOrUpdateCustomer({
        firstName: orderData.customer.firstName,
        lastName: orderData.customer.lastName,
        email: orderData.customer.email,
        phone: orderData.customer.phone,
        street: orderData.customer.address.street,
        suburb: orderData.customer.address.suburb,
        state: orderData.customer.address.state,
        postcode: orderData.customer.address.postcode,
      });
    } catch (e) {
      console.warn('Customer directory update non-fatal error', e);
    }

    // 4. Promo usage update
    if (orderData.promoCode) {
      try {
        const pCode = promoCodes.find((p) => p.code === orderData.promoCode?.code);
        if (pCode) {
          const newCount = pCode.usedCount + 1;
          setPromoCodes((prev) => prev.map((p) => (p.id === pCode.id ? { ...p, usedCount: newCount } : p)));
          await update(ref(database, `promoCodes/${pCode.id}`), { usedCount: newCount });
        }
      } catch (e) {
        console.warn('Promo code count update error', e);
      }
    }

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (
    id: string,
    paymentStatus?: Order['paymentStatus'],
    deliveryStatus?: Order['deliveryStatus']
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          return {
            ...o,
            paymentStatus: paymentStatus !== undefined ? paymentStatus : o.paymentStatus,
            deliveryStatus: deliveryStatus !== undefined ? deliveryStatus : o.deliveryStatus,
          };
        }
        return o;
      })
    );
    const patch: Partial<Order> = {};
    if (paymentStatus !== undefined) patch.paymentStatus = paymentStatus;
    if (deliveryStatus !== undefined) patch.deliveryStatus = deliveryStatus;
    try {
      await update(ref(database, `orders/${id}`), patch);
    } catch (e) {
      console.warn('Firebase updateOrderStatus error', e);
    }
  };

  const deleteOrder = async (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    try {
      await remove(ref(database, `orders/${id}`));
    } catch (e) {
      console.warn('Firebase deleteOrder error', e);
    }
  };

  const addOrUpdateCustomer = async (custData: Omit<CustomerRecord, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>) => {
    const existing = customers.find((c) => c.email.toLowerCase() === custData.email.toLowerCase());
    let customerRecord: CustomerRecord;

    if (existing) {
      customerRecord = {
        ...existing,
        ...custData,
        totalOrders: existing.totalOrders + 1,
      };
      setCustomers((prev) => prev.map((c) => (c.id === existing.id ? customerRecord : c)));
      try {
        await update(ref(database, `customers/${existing.id}`), customerRecord);
      } catch (e) {
        console.warn('Firebase customer update error', e);
      }
    } else {
      const id = `cust-${Date.now()}`;
      customerRecord = {
        ...custData,
        id,
        totalOrders: 1,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
      };
      setCustomers((prev) => [customerRecord, ...prev]);
      try {
        await set(ref(database, `customers/${id}`), customerRecord);
      } catch (e) {
        console.warn('Firebase customer add error', e);
      }
    }
  };

  const deleteCustomer = async (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    try {
      await remove(ref(database, `customers/${id}`));
    } catch (e) {
      console.warn('Firebase deleteCustomer error', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        siteSettings,
        updateSiteSettings,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        coas,
        addCOA,
        deleteCOA,
        faqs,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        promoCodes,
        addPromoCode,
        togglePromoCode,
        deletePromoCode,
        validatePromoCode,
        leads,
        addLead,
        updateLeadStatus,
        deleteLead,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        customers,
        addOrUpdateCustomer,
        deleteCustomer,
        isCallModalOpen,
        openCallModal,
        closeCallModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
