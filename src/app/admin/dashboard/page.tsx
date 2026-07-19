'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import { useAuth } from '@/store/useAuth';
import { useAdminOrders, Order } from '@/store/useAdminOrders';

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
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${cfg.color}`}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

// ─── Order Detail Drawer ──────────────────────────────────────────────────────
function OrderDetailDrawer({ order, onClose, onStatusUpdate }: {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (id: string, status: Order['status']) => void;
}) {
  const cfg = STATUS_CONFIG[order.status];
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
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
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
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#1e3b26] to-[#2d5a3d] hover:from-[#2d5a3d] hover:to-[#3d7a53] border border-[#4ade80]/20 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4 text-[#4ade80]" />}
                  Mark as {cfg.next}
                </button>
              )}
              {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                <button
                  onClick={handleCancel}
                  disabled={updating}
                  className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-sm font-bold text-red-400 transition-all disabled:opacity-50 flex items-center gap-2"
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

  const [activeTab, setActiveTab] = useState<'overview' | 'orders'>('overview');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [realtimeAlert, setRealtimeAlert] = useState<Order | null>(null);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

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

  const filteredOrders = orders.filter(o => {
    const matchSearch = !searchTerm ||
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
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

          {/* Tabs */}
          <nav className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
            {[{ id: 'overview', label: 'Overview', icon: LayoutDashboard }, { id: 'orders', label: 'Orders', icon: ShoppingBag }].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                  activeTab === tab.id ? 'bg-[#1e3b26] text-[#4ade80] shadow-sm' : 'text-white/40 hover:text-white/70'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifPanel(!showNotifPanel); clearNotifications(); }}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors relative"
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

            {/* User */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
                <p className="text-[10px] text-[#4ade80] font-bold">Admin</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 flex items-center justify-center text-white/50 hover:text-red-400 transition-all"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
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
              <p className="text-xs font-black text-[#4ade80] uppercase tracking-wider">New Order!</p>
              <p className="text-sm font-bold text-white truncate">{realtimeAlert.order_number}</p>
              <p className="text-xs text-white/50 truncate">{realtimeAlert.customer_name} — {formatCurrency(realtimeAlert.total_amount)}</p>
            </div>
            <button onClick={() => setRealtimeAlert(null)} className="text-white/30 hover:text-white/60">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ── Overview Tab ─────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div>
              <h1 className="text-2xl font-black text-white">Dashboard <span className="text-[#b08953] font-serif italic font-normal">Overview</span></h1>
              <p className="text-sm text-white/30 mt-1">Welcome back, {user.name}. Here's what's happening today.</p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="Today's Orders" value={String(metrics.todayOrders)} icon={ShoppingBag} color="bg-blue-500/10 text-blue-400" sub="Orders placed today" />
              <MetricCard title="Total Revenue" value={formatCurrency(metrics.revenue)} icon={IndianRupee} color="bg-[#b08953]/10 text-[#b08953]" sub="Excluding cancelled" />
              <MetricCard title="Customers" value={String(metrics.customersCount)} icon={Users} color="bg-purple-500/10 text-purple-400" sub="Unique customers" />
              <MetricCard title="Products" value={String(metrics.activeProductsCount)} icon={Package} color="bg-green-500/10 text-green-400" sub="Active products" />
            </div>

            {/* Order status summary */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-sm font-black text-white/50 uppercase tracking-wider mb-4">Orders by Status</h2>
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

            {/* Recent Orders */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-sm font-black text-white/50 uppercase tracking-wider">Recent Orders</h2>
                <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-[#4ade80] hover:underline flex items-center gap-1">
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

            {/* Revenue Trend placeholder */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="h-4.5 w-4.5 text-[#4ade80]" />
                <h2 className="text-sm font-black text-white/50 uppercase tracking-wider">Revenue Trend</h2>
              </div>
              <div className="flex items-end gap-1.5 h-28">
                {[35, 55, 40, 70, 60, 85, 65, 90, 75, 88, 92, 80].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    style={{ height: `${h}%`, transformOrigin: 'bottom' }}
                    className="flex-1 bg-gradient-to-t from-[#1e3b26] to-[#4ade80]/20 rounded-t-md"
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
                  <span key={m} className="text-[9px] text-white/20 font-bold">{m}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Orders Tab ───────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-white">All <span className="text-[#b08953] font-serif italic font-normal">Orders</span></h1>
                <p className="text-sm text-white/30 mt-0.5">{filteredOrders.length} of {orders.length} orders</p>
              </div>
              <button
                onClick={fetchOrders}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white/50 hover:text-white transition-all"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search orders, customers…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/30 focus:border-[#4ade80]/30 transition-all"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['All', 'New', 'Accepted', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
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

            {/* Orders Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="h-8 w-8 border-2 border-white/10 border-t-[#4ade80] rounded-full animate-spin" />
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-white/20">
                  <ShoppingBag className="h-12 w-12 mb-4 opacity-30" />
                  <p className="font-bold text-lg">No orders found</p>
                  <p className="text-sm mt-1">Try adjusting your search or filters</p>
                </div>
              ) : (
                <>
                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/10 text-[10px] font-black text-white/30 uppercase tracking-wider">
                    <div className="col-span-2">Order</div>
                    <div className="col-span-3">Customer</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Amount</div>
                    <div className="col-span-1" />
                  </div>

                  {/* Rows */}
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
                        <div className="col-span-1 md:col-span-2 text-right md:text-right">
                          <p className="font-bold text-[#b08953] text-sm">{formatCurrency(order.total_amount)}</p>
                        </div>
                        <div className="hidden md:flex col-span-1 justify-end">
                          <Eye className="h-4 w-4 text-white/20 group-hover:text-white/50" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
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
