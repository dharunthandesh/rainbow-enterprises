'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  Bell,
  LogOut,
  Leaf,
  TrendingUp,
  Users,
  Package,
  IndianRupee,
  Search,
  X,
  ChevronRight,
  Phone,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  Ban,
  RefreshCw,
  Eye,
  Download,
  Printer,
  Plus,
  Trash2,
  Tag,
  Percent,
  Check,
  AlertTriangle,
  Edit,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/store/useAuth';
import { useAdminOrders, Order } from '@/store/useAdminOrders';
import { mockProducts, mockCategories } from '@/lib/mockData';
import { Product } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  New:       { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',    icon: Clock,         next: 'Accepted'  },
  Accepted:  { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: CheckCircle2,  next: 'Packed'    },
  Packed:    { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: PackageCheck, next: 'Shipped'  },
  Shipped:   { color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',    icon: Truck,         next: 'Delivered' },
  Delivered: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle2,  next: null        },
  Cancelled: { color: 'bg-red-500/20 text-red-400 border-red-500/30',       icon: Ban,           next: null        },
};

const STATUS_FLOW: Order['status'][] = ['New', 'Accepted', 'Packed', 'Shipped', 'Delivered'];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// ─── Metric Card ─────────────────────────────────────────────────────────────
function MetricCard({ title, value, icon: Icon, color, sub }: { title: string; value: string; icon: React.ElementType; color: string; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start justify-between gap-3"
    >
      <div>
        <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-black text-white">{value}</p>
        {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
    </motion.div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Order['status'] }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.New;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${cfg.color}`}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

// ─── Coupon Interface ─────────────────────────────────────────────────────────
interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minOrder: number;
  isActive: boolean;
}

// ─── Order Detail Drawer ──────────────────────────────────────────────────────
function OrderDetailDrawer({ order, onClose, onStatusUpdate }: {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (id: string, status: Order['status']) => void;
}) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.New;
  const currentStep = STATUS_FLOW.indexOf(order.status);
  const [updating, setUpdating] = useState(false);

  const handleAdvance = async () => {
    const next = cfg.next as Order['status'];
    if (!next) return;
    setUpdating(true);
    await onStatusUpdate(order.id, next);
    setUpdating(false);
  };

  const handleCancel = async () => {
    setUpdating(true);
    await onStatusUpdate(order.id, 'Cancelled');
    setUpdating(false);
  };

  const handlePrint = () => {
    window.open(`/order-confirmation?orderNumber=${order.order_number}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="ml-auto relative w-full max-w-lg h-full bg-[#0d1f13] border-l border-white/10 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0d1f13]/95 backdrop-blur border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Order Details</p>
            <h2 className="text-lg font-black text-white font-mono">{order.order_number}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print Customer Invoice"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-[#4ade80]" />
              Invoice
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status + Progress */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <StatusBadge status={order.status} />
              <span className="text-xs text-white/30">{formatDate(order.created_at)}</span>
            </div>

            {/* Progress bar */}
            {order.status !== 'Cancelled' && (
              <div className="space-y-2">
                <div className="flex gap-1.5">
                  {STATUS_FLOW.map((s, i) => (
                    <div
                      key={s}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                        i <= currentStep ? 'bg-[#4ade80]' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-white/30 font-bold">
                  {STATUS_FLOW.map(s => <span key={s}>{s}</span>)}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              {cfg.next && (
                <button
                  onClick={handleAdvance}
                  disabled={updating}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#1e3b26] to-[#2d5a3d] hover:from-[#2d5a3d] hover:to-[#3d7a53] border border-[#4ade80]/20 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {updating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4 text-[#4ade80]" />}
                  Mark as {cfg.next}
                </button>
              )}
              {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                <button
                  onClick={handleCancel}
                  disabled={updating}
                  className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-sm font-bold text-red-400 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  <Ban className="h-4 w-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-black text-white/40 uppercase tracking-wider">Customer Information</h3>
            <div className="space-y-2">
              <p className="font-bold text-white">{order.customer_name}</p>
              <a href={`mailto:${order.customer_email}`} className="flex items-center gap-2 text-sm text-white/50 hover:text-[#4ade80] transition-colors">
                <span className="text-[10px] font-bold text-white/25 uppercase w-12">Email</span>
                {order.customer_email}
              </a>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Phone className="h-3.5 w-3.5 flex-shrink-0 text-white/25" />
                {order.customer_phone}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <h3 className="text-xs font-black text-white/40 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Shipping Address
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              {order.shipping_address},<br />
              {order.shipping_city}, {order.shipping_state} – {order.shipping_zip_code}
            </p>
          </div>

          {/* Order Items */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-black text-white/40 uppercase tracking-wider">
              Order Items ({order.order_items?.length || 0})
            </h3>
            <div className="space-y-2">
              {(order.order_items || []).map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-white">{item.product_name}</p>
                    {item.weight && <p className="text-xs text-white/30">{item.weight} × {item.quantity}</p>}
                  </div>
                  <span className="text-sm font-bold text-[#b08953]">
                    {formatCurrency(item.product_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Total */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-black text-white/40 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" /> Payment Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-white/50">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Shipping</span>
                <span>{order.shipping_cost === 0 ? 'Free' : formatCurrency(order.shipping_cost)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>−{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-white border-t border-white/10 pt-2 mt-1 text-base">
                <span>Total</span>
                <span className="text-[#b08953]">{formatCurrency(order.total_amount)}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-white/30 text-xs uppercase font-bold">Payment:</span>
                <span className="text-xs font-bold text-white uppercase">{order.payment_method}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, logout, initialize, isInitialized } = useAuth();
  const { orders, isLoading, notificationCount, fetchOrders, updateOrderStatus, subscribeRealtime, unsubscribeRealtime, clearNotifications, getMetrics } = useAdminOrders();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'coupons'>('overview');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [realtimeAlert, setRealtimeAlert] = useState<Order | null>(null);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  // Products state
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category_id: mockCategories[0]?.id || '',
    price: 350,
    original_price: 450,
    weight: '500ml',
    stock: 50,
    description: '',
    image_url: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&auto=format&fit=crop&q=80',
    is_featured: false,
  });

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>([
    { code: 'RAINBOW10', type: 'percent', value: 10, minOrder: 500, isActive: true },
    { code: 'FIRSTBUY', type: 'flat', value: 50, minOrder: 300, isActive: true },
    { code: 'ORGANIC20', type: 'percent', value: 20, minOrder: 1500, isActive: true },
  ]);
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    code: '',
    type: 'percent',
    value: 10,
    minOrder: 500,
    isActive: true,
  });

  // Load products & coupons from localStorage or fallback
  useEffect(() => {
    try {
      const storedProds = localStorage.getItem('rainbow_custom_products');
      if (storedProds) {
        setProductsList(JSON.parse(storedProds));
      } else {
        setProductsList(mockProducts.slice(0, 30));
      }

      const storedCoupons = localStorage.getItem('rainbow_active_coupons');
      if (storedCoupons) {
        setCoupons(JSON.parse(storedCoupons));
      }
    } catch (e) {
      setProductsList(mockProducts.slice(0, 30));
    }
  }, []);

  // Auth guard
  useEffect(() => {
    if (!isInitialized) { initialize(); return; }
    if (!user) { router.replace('/admin/login'); return; }
    if (!user.isAdmin) { router.replace('/'); }
  }, [user, isInitialized, initialize, router]);

  // Fetch & subscribe
  useEffect(() => {
    if (user?.isAdmin) {
      fetchOrders();
      subscribeRealtime();
    }
    return () => unsubscribeRealtime();
  }, [user?.isAdmin, fetchOrders, subscribeRealtime, unsubscribeRealtime]);

  // Realtime alert toast
  useEffect(() => {
    const handler = (e: Event) => {
      const order = (e as CustomEvent<Order>).detail;
      setRealtimeAlert(order);
      setTimeout(() => setRealtimeAlert(null), 6000);
    };
    window.addEventListener('rainbow-realtime-order', handler);
    return () => window.removeEventListener('rainbow-realtime-order', handler);
  }, []);

  const handleStatusUpdate = useCallback(async (orderId: string, status: Order['status']) => {
    await updateOrderStatus(orderId, status);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status } : prev);
    }
  }, [updateOrderStatus, selectedOrder]);

  const handleLogout = async () => {
    await logout();
    router.replace('/admin/login');
  };

  const metrics = getMetrics();

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Email', 'Phone', 'City', 'Status', 'Payment Method', 'Subtotal', 'Shipping', 'Discount', 'Total'];
    const rows = orders.map(o => [
      o.order_number,
      new Date(o.created_at).toISOString().split('T')[0],
      `"${(o.customer_name || '').replace(/"/g, '""')}"`,
      o.customer_email || '',
      o.customer_phone || '',
      `"${(o.shipping_city || '').replace(/"/g, '""')}"`,
      o.status,
      o.payment_method,
      o.subtotal,
      o.shipping_cost,
      o.discount_amount,
      o.total_amount
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rainbow_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Product Add Handler
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;

    const id = 'prod-' + Date.now();
    const slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const product: Product = {
      id,
      slug,
      name: newProduct.name,
      category_id: newProduct.category_id,
      price: Number(newProduct.price),
      original_price: Number(newProduct.original_price),
      weight: newProduct.weight,
      stock: Number(newProduct.stock),
      description: newProduct.description || 'Pure traditional organic harvest.',
      image_url: newProduct.image_url,
      is_featured: newProduct.is_featured,
      created_at: new Date().toISOString(),
    };

    const updated = [product, ...productsList];
    setProductsList(updated);
    try {
      localStorage.setItem('rainbow_custom_products', JSON.stringify(updated));
    } catch (err) {}
    setIsAddProductOpen(false);
    setNewProduct({
      name: '',
      category_id: mockCategories[0]?.id || '',
      price: 350,
      original_price: 450,
      weight: '500ml',
      stock: 50,
      description: '',
      image_url: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&auto=format&fit=crop&q=80',
      is_featured: false,
    });
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to remove this product?')) {
      const updated = productsList.filter(p => p.id !== id);
      setProductsList(updated);
      try {
        localStorage.setItem('rainbow_custom_products', JSON.stringify(updated));
      } catch (err) {}
    }
  };

  // Quick Stock Update
  const handleUpdateStock = (id: string, delta: number) => {
    const updated = productsList.map(p => {
      if (p.id === id) {
        return { ...p, stock: Math.max(0, p.stock + delta) };
      }
      return p;
    });
    setProductsList(updated);
    try {
      localStorage.setItem('rainbow_custom_products', JSON.stringify(updated));
    } catch (err) {}
  };

  // Coupon Add
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;
    const updated = [...coupons, { ...newCoupon, code: newCoupon.code.toUpperCase().trim() }];
    setCoupons(updated);
    try {
      localStorage.setItem('rainbow_active_coupons', JSON.stringify(updated));
    } catch (err) {}
    setIsAddCouponOpen(false);
    setNewCoupon({ code: '', type: 'percent', value: 10, minOrder: 500, isActive: true });
  };

  const handleToggleCoupon = (code: string) => {
    const updated = coupons.map(c => c.code === code ? { ...c, isActive: !c.isActive } : c);
    setCoupons(updated);
    try {
      localStorage.setItem('rainbow_active_coupons', JSON.stringify(updated));
    } catch (err) {}
  };

  const filteredOrders = orders.filter(o => {
    const matchSearch = !searchTerm ||
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredProducts = productsList.filter(p => {
    const matchSearch = !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase());
    const matchCat = categoryFilter === 'All' || p.category_id === categoryFilter;
    return matchSearch && matchCat;
  });

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a1a0f] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-[#4ade80]/30 border-t-[#4ade80] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1a0f] text-white flex flex-col">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-[#0d1f13]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1e3b26] to-[#2d5a3d] border border-[#4ade80]/20 flex items-center justify-center">
              <Leaf className="h-4 w-4 text-[#4ade80]" />
            </div>
            <span className="font-black text-sm tracking-tight hidden sm:block">
              Rainbow <span className="text-[#b08953]">Admin</span>
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-white/5 rounded-xl p-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'coupons', label: 'Discounts', icon: Tag },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-[#1e3b26] text-[#4ade80] shadow-sm' : 'text-white/40 hover:text-white/70'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Store Link */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white/50 hover:text-white transition-colors"
            >
              <span>Live Store</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifPanel(!showNotifPanel); clearNotifications(); }}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors relative cursor-pointer"
              >
                <Bell className="h-4 w-4" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showNotifPanel && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-11 w-64 bg-[#0d1f13] border border-white/10 rounded-2xl shadow-2xl p-4 z-50"
                  >
                    <p className="text-xs font-black text-white/40 uppercase tracking-wider mb-3">Recent Alerts</p>
                    {orders.filter(o => o.status === 'New').slice(0, 5).length > 0 ? (
                      orders.filter(o => o.status === 'New').slice(0, 5).map(o => (
                        <div key={o.id} onClick={() => { setSelectedOrder(o); setShowNotifPanel(false); }} className="flex items-center gap-2 py-2 cursor-pointer hover:bg-white/5 rounded-lg px-2 transition-colors">
                          <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-white">{o.order_number}</p>
                            <p className="text-[10px] text-white/30">{o.customer_name}</p>
                          </div>
                        </div>
                      ))
                    ) : <p className="text-xs text-white/20 text-center py-3">No new orders</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 flex items-center justify-center text-white/50 hover:text-red-400 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Realtime Alert Toast */}
      <AnimatePresence>
        {realtimeAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 z-50 bg-[#1e3b26] border border-[#4ade80]/30 rounded-2xl p-4 shadow-2xl flex items-center gap-3 max-w-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#4ade80]/10 flex items-center justify-center flex-shrink-0">
              <Bell className="h-5 w-5 text-[#4ade80]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-[#4ade80] uppercase tracking-wider">New Order Received!</p>
              <p className="text-sm font-bold text-white truncate">{realtimeAlert.order_number}</p>
              <p className="text-xs text-white/50 truncate">{realtimeAlert.customer_name} — {formatCurrency(realtimeAlert.total_amount)}</p>
            </div>
            <button onClick={() => setRealtimeAlert(null)} className="text-white/30 hover:text-white/60">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* ── OVERVIEW TAB ─────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div>
              <h1 className="text-2xl font-black text-white">Dashboard <span className="text-[#b08953] font-serif italic font-normal">Overview</span></h1>
              <p className="text-sm text-white/30 mt-1">Welcome back, {user.name}. Here is Rainbow Enterprises live summary.</p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="Today's Orders" value={String(metrics.todayOrders)} icon={ShoppingBag} color="bg-blue-500/10 text-blue-400" sub="Orders placed today" />
              <MetricCard title="Total Revenue" value={formatCurrency(metrics.revenue)} icon={IndianRupee} color="bg-[#b08953]/10 text-[#b08953]" sub="Realized earnings" />
              <MetricCard title="Customers" value={String(metrics.customersCount)} icon={Users} color="bg-purple-500/10 text-purple-400" sub="Total buyers" />
              <MetricCard title="Active Products" value={String(productsList.length)} icon={Package} color="bg-green-500/10 text-green-400" sub="Listed items" />
            </div>

            {/* Orders by Status */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-sm font-black text-white/50 uppercase tracking-wider mb-4">Orders Pipeline Status</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
                  const count = orders.filter(o => o.status === status).length;
                  return (
                    <div key={status} className={`rounded-xl border p-3 text-center ${cfg.color}`}>
                      <p className="text-2xl font-black">{count}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-70">{status}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Orders List */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-sm font-black text-white/50 uppercase tracking-wider">Recent Orders</h2>
                <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-[#4ade80] hover:underline flex items-center gap-1 cursor-pointer">
                  View All <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-6 w-6 border-2 border-white/10 border-t-[#4ade80] rounded-full animate-spin" />
                </div>
              ) : orders.slice(0, 5).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-white/20">
                  <ShoppingBag className="h-10 w-10 mb-3 opacity-30" />
                  <p className="font-bold">No orders yet</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {orders.slice(0, 5).map(order => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm font-bold text-white">{order.order_number}</p>
                        <p className="text-xs text-white/30 truncate">{order.customer_name}</p>
                      </div>
                      <StatusBadge status={order.status} />
                      <span className="text-sm font-bold text-[#b08953] hidden sm:block">{formatCurrency(order.total_amount)}</span>
                      <Eye className="h-4 w-4 text-white/20" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── ORDERS TAB ───────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-white">Order <span className="text-[#b08953] font-serif italic font-normal">Fulfillment</span></h1>
                <p className="text-sm text-white/30 mt-0.5">{filteredOrders.length} of {orders.length} orders shown</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1e3b26] hover:bg-[#274c32] border border-[#4ade80]/30 rounded-xl text-xs font-bold text-[#4ade80] transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export CSV
                </button>
                <button
                  onClick={fetchOrders}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white/60 hover:text-white transition-all cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search order ID, customer name, email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/30"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['All', 'New', 'Accepted', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      statusFilter === s
                        ? 'bg-[#1e3b26] border-[#4ade80]/30 text-[#4ade80]'
                        : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'
                    }`}
                  >
                    {s}
                    {s !== 'All' && <span className="ml-1.5 opacity-60 text-[10px]">({orders.filter(o => o.status === s).length})</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="h-8 w-8 border-2 border-white/10 border-t-[#4ade80] rounded-full animate-spin" />
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-white/20">
                  <ShoppingBag className="h-12 w-12 mb-4 opacity-30" />
                  <p className="font-bold text-lg">No orders found</p>
                </div>
              ) : (
                <>
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/10 text-[10px] font-black text-white/30 uppercase tracking-wider">
                    <div className="col-span-2">Order</div>
                    <div className="col-span-3">Customer</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Amount</div>
                    <div className="col-span-1" />
                  </div>

                  <div className="divide-y divide-white/5">
                    {filteredOrders.map(order => (
                      <motion.div
                        key={order.id}
                        layout
                        onClick={() => setSelectedOrder(order)}
                        className="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-white/[0.03] cursor-pointer transition-colors items-center"
                      >
                        <div className="col-span-1 md:col-span-2">
                          <p className="font-mono text-sm font-bold text-white">{order.order_number}</p>
                          <p className="text-[10px] text-white/30 md:hidden mt-0.5">{order.customer_name}</p>
                        </div>
                        <div className="col-span-1 md:col-span-3 hidden md:block">
                          <p className="text-sm text-white/80 font-semibold truncate">{order.customer_name}</p>
                          <p className="text-[10px] text-white/30 truncate">{order.customer_email}</p>
                        </div>
                        <div className="col-span-1 md:col-span-2 hidden md:block">
                          <p className="text-xs text-white/40">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="col-span-1 md:col-span-2 text-right">
                          <p className="font-bold text-[#b08953] text-sm">{formatCurrency(order.total_amount)}</p>
                        </div>
                        <div className="hidden md:flex col-span-1 justify-end">
                          <Eye className="h-4 w-4 text-white/20" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* ── PRODUCTS TAB ─────────────────────────────────────────── */}
        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-white">Product <span className="text-[#b08953] font-serif italic font-normal">Catalog</span></h1>
                <p className="text-sm text-white/30 mt-0.5">Manage stock levels, pricing, and new inventory listings</p>
              </div>
              <Button
                onClick={() => setIsAddProductOpen(true)}
                className="bg-[#1e3b26] hover:bg-[#274c32] text-[#4ade80] border border-[#4ade80]/30 font-bold px-4 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </div>

            {/* Search and Category Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search products by title..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/30"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 bg-[#0d1f13] border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none"
              >
                <option value="All">All Categories</option>
                {mockCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Products Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/10 text-[10px] font-black text-white/30 uppercase tracking-wider">
                <div className="col-span-5">Product</div>
                <div className="col-span-2">Weight / Variant</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Stock Level</div>
                <div className="col-span-1 text-right">Action</div>
              </div>

              <div className="divide-y divide-white/5">
                {filteredProducts.map(p => {
                  const isOutOfStock = p.stock <= 0;
                  const isLowStock = p.stock > 0 && p.stock <= 10;

                  return (
                    <div key={p.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 px-6 py-4 items-center hover:bg-white/[0.02]">
                      <div className="col-span-1 md:col-span-5 flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                          <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-white truncate">{p.name}</p>
                          <p className="text-[10px] text-white/30 font-mono">SKU: {p.id.slice(0, 10)}</p>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-2 text-xs text-white/70 font-mono">
                        {p.weight}
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <span className="font-bold text-sm text-[#b08953] font-mono">₹{p.price}</span>
                        {p.original_price && (
                          <span className="text-[10px] text-white/30 line-through ml-2">₹{p.original_price}</span>
                        )}
                      </div>

                      <div className="col-span-1 md:col-span-2 flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isOutOfStock
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : isLowStock
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-green-500/10 text-green-400 border-green-500/20'
                        }`}>
                          {p.stock} in stock
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleUpdateStock(p.id, -5)}
                            className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center font-bold"
                            title="Reduce by 5"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleUpdateStock(p.id, 10)}
                            className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center font-bold"
                            title="Add 10"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="col-span-1 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-white/30 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Product Modal */}
            <AnimatePresence>
              {isAddProductOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#0d1f13] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl"
                  >
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <h3 className="text-lg font-black text-white">Add New Organic Product</h3>
                      <button onClick={() => setIsAddProductOpen(false)} className="text-white/40 hover:text-white">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-white/50 uppercase">Product Name</label>
                        <input
                          type="text"
                          required
                          value={newProduct.name}
                          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="e.g. Cold Pressed Groundnut Oil"
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-bold text-white/50 uppercase">Category</label>
                          <select
                            value={newProduct.category_id}
                            onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0d1f13] border border-white/10 rounded-xl text-white text-sm"
                          >
                            {mockCategories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-white/50 uppercase">Weight / Pack</label>
                          <input
                            type="text"
                            required
                            value={newProduct.weight}
                            onChange={e => setNewProduct({ ...newProduct, weight: e.target.value })}
                            placeholder="e.g. 1000ml or 500g"
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="font-bold text-white/50 uppercase">Price (₹)</label>
                          <input
                            type="number"
                            required
                            value={newProduct.price}
                            onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-white/50 uppercase">Original (₹)</label>
                          <input
                            type="number"
                            value={newProduct.original_price}
                            onChange={e => setNewProduct({ ...newProduct, original_price: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-white/50 uppercase">Stock Count</label>
                          <input
                            type="number"
                            required
                            value={newProduct.stock}
                            onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-white/50 uppercase">Image URL</label>
                        <input
                          type="text"
                          value={newProduct.image_url}
                          onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-white/50 uppercase">Description</label>
                        <textarea
                          rows={2}
                          value={newProduct.description}
                          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                          placeholder="Traditional extraction process and organic health benefits..."
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddProductOpen(false)}
                          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold"
                        >
                          Cancel
                        </button>
                        <Button
                          type="submit"
                          className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-6 py-2 rounded-xl"
                        >
                          Save Product
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── COUPONS TAB ─────────────────────────────────────────── */}
        {activeTab === 'coupons' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-white">Discounts & <span className="text-[#b08953] font-serif italic font-normal">Coupons</span></h1>
                <p className="text-sm text-white/30 mt-0.5">Manage customer promotional vouchers and minimum cart rules</p>
              </div>
              <Button
                onClick={() => setIsAddCouponOpen(true)}
                className="bg-[#1e3b26] hover:bg-[#274c32] text-[#4ade80] border border-[#4ade80]/30 font-bold px-4 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Create Coupon
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coupons.map(coupon => (
                <div key={coupon.code} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">PROMO CODE</span>
                      <h3 className="text-xl font-black font-mono text-[#4ade80] tracking-wider">{coupon.code}</h3>
                    </div>
                    <button
                      onClick={() => handleToggleCoupon(coupon.code)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                        coupon.isActive
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <div className="space-y-1 text-xs text-white/70">
                    <p className="flex justify-between">
                      <span className="text-white/40">Discount:</span>
                      <span className="font-bold text-white">
                        {coupon.type === 'percent' ? `${coupon.value}% Off` : `₹${coupon.value} Off`}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-white/40">Min Cart Value:</span>
                      <span className="font-bold text-white">₹{coupon.minOrder}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Coupon Modal */}
            <AnimatePresence>
              {isAddCouponOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#0d1f13] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl"
                  >
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <h3 className="text-lg font-black text-white">Create New Coupon</h3>
                      <button onClick={() => setIsAddCouponOpen(false)} className="text-white/40 hover:text-white">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <form onSubmit={handleAddCoupon} className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-white/50 uppercase">Coupon Code</label>
                        <input
                          type="text"
                          required
                          value={newCoupon.code}
                          onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                          placeholder="e.g. FESTIVAL15"
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm uppercase font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-bold text-white/50 uppercase">Discount Type</label>
                          <select
                            value={newCoupon.type}
                            onChange={e => setNewCoupon({ ...newCoupon, type: e.target.value as 'percent' | 'flat' })}
                            className="w-full px-3 py-2 bg-[#0d1f13] border border-white/10 rounded-xl text-white text-sm"
                          >
                            <option value="percent">Percentage (%)</option>
                            <option value="flat">Flat Amount (₹)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-white/50 uppercase">Discount Value</label>
                          <input
                            type="number"
                            required
                            value={newCoupon.value}
                            onChange={e => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-white/50 uppercase">Min Cart Value (₹)</label>
                        <input
                          type="number"
                          required
                          value={newCoupon.minOrder}
                          onChange={e => setNewCoupon({ ...newCoupon, minOrder: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddCouponOpen(false)}
                          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold"
                        >
                          Cancel
                        </button>
                        <Button
                          type="submit"
                          className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-6 py-2 rounded-xl"
                        >
                          Save Coupon
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Order Detail Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailDrawer
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
