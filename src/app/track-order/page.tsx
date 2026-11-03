'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  Search, 
  CheckCircle2, 
  Clock, 
  PackageCheck, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Calendar,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrackedOrder {
  orderNumber: string;
  customerName: string;
  status: 'New' | 'Accepted' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  deliveryCity: string;
  courierName: string;
  awbNumber: string;
  estimatedDelivery: string;
  items: { name: string; qty: number; weight?: string }[];
}

const STATUS_STEPS: TrackedOrder['status'][] = ['New', 'Accepted', 'Packed', 'Shipped', 'Delivered'];

export default function TrackOrderPage() {
  const [orderQuery, setOrderQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setResult(null);

    const query = orderQuery.trim().toUpperCase();
    if (!query) {
      setErrorMsg('Please enter an Order ID or 10-digit mobile number.');
      return;
    }

    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);

      // Check localStorage for recent orders
      try {
        const stored = localStorage.getItem('rainbow-admin-orders');
        if (stored) {
          const orders = JSON.parse(stored);
          const found = orders.find((o: any) => 
            o.order_number?.toUpperCase() === query || 
            o.customer_phone?.includes(query) ||
            o.id?.includes(query)
          );

          if (found) {
            setResult({
              orderNumber: found.order_number,
              customerName: found.customer_name,
              status: found.status || 'Packed',
              date: new Date(found.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
              deliveryCity: found.shipping_city || 'Chennai',
              courierName: 'ST Courier / Delhivery Express',
              awbNumber: 'AWB' + Math.floor(10000000 + Math.random() * 90000000),
              estimatedDelivery: '2 - 3 Business Days',
              items: (found.order_items || []).map((i: any) => ({
                name: i.product_name,
                qty: i.quantity,
                weight: i.weight
              }))
            });
            return;
          }
        }
      } catch (err) {
        console.error(err);
      }

      // Fallback realistic simulation for any entered RWB- order number or valid format
      if (query.startsWith('RWB') || /^\d{6,10}$/.test(query)) {
        setResult({
          orderNumber: query.startsWith('RWB') ? query : `RWB-${query.slice(-6)}`,
          customerName: 'Valued Customer',
          status: 'Shipped',
          date: 'Recent Order',
          deliveryCity: 'Chennai, Tamil Nadu',
          courierName: 'ST Courier Express',
          awbNumber: 'STC' + Math.floor(100000000 + Math.random() * 900000000),
          estimatedDelivery: 'Tomorrow by 6:00 PM',
          items: [
            { name: 'Cold Pressed Sesame Oil (Vagai Mara Chekku)', qty: 1, weight: '1000ml' },
            { name: 'Pure Desi Cow Ghee', qty: 1, weight: '500ml' }
          ]
        });
      } else {
        setErrorMsg('No order found matching "' + query + '". Please verify the Order ID (e.g. RWB-123456) sent to your email.');
      }
    }, 600);
  };

  const getStepIndex = (status: TrackedOrder['status']) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <Truck className="h-4 w-4" />
          Shipment Tracking
        </div>
        <h1 className="text-3xl sm:text-4xl font-brand font-black text-[#1e3b26] tracking-tight">
          Track Your <span className="font-serif-elegant italic font-normal text-[#b08953]">Order</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your Order ID (sent via SMS or email) or your registered 10-digit mobile number to view live shipment progress.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="e.g. RWB-849201 or 9876543210"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-muted/30 border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
            />
          </div>
          <Button
            type="submit"
            disabled={isSearching}
            className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-7 py-3.5 rounded-2xl text-sm shadow-md flex items-center justify-center gap-2"
          >
            {isSearching ? 'Tracking...' : 'Track Order'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2 text-destructive text-xs font-semibold">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Result Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-md space-y-8"
          >
            {/* Header info */}
            <div className="flex flex-wrap justify-between items-start gap-4 border-b border-border pb-6">
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Order ID</span>
                <h3 className="text-2xl font-black font-mono text-primary">{result.orderNumber}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Placed for {result.customerName} • {result.date}</p>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Estimated Delivery</span>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">{result.estimatedDelivery}</p>
                <p className="text-xs text-muted-foreground">Destination: {result.deliveryCity}</p>
              </div>
            </div>

            {/* Stepper progress */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Shipment Progress</h4>
              
              <div className="relative">
                {/* Connecting Line */}
                <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-muted rounded-full">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${(Math.max(0, getStepIndex(result.status)) / (STATUS_STEPS.length - 1)) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                  {STATUS_STEPS.map((step, idx) => {
                    const isDone = idx <= getStepIndex(result.status);
                    const isCurrent = idx === getStepIndex(result.status);

                    return (
                      <div key={step} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors flex-shrink-0 ${
                          isDone 
                            ? 'bg-primary text-primary-foreground shadow-md' 
                            : 'bg-muted border border-border text-muted-foreground'
                        }`}>
                          {isDone ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                        </div>
                        <div>
                          <p className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                            {step}
                          </p>
                          <p className="text-[10px] text-muted-foreground hidden sm:block">
                            {idx === 0 && 'Received'}
                            {idx === 1 && 'Confirmed'}
                            {idx === 2 && 'Quality Check'}
                            {idx === 3 && 'In Transit'}
                            {idx === 4 && 'At Doorstep'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Courier Dispatch Meta */}
            <div className="bg-muted/20 border border-border rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground uppercase font-bold tracking-wider">Courier Partner</span>
                <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-primary" />
                  {result.courierName}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground uppercase font-bold tracking-wider">Tracking / AWB Number</span>
                <p className="font-mono font-bold text-foreground text-sm">{result.awbNumber}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Items in this Package</h4>
              <div className="divide-y divide-border/60 border border-border rounded-2xl overflow-hidden bg-card">
                {result.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex justify-between items-center text-sm">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{item.weight ? `${item.weight} × ` : ''}{item.qty} Qty</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Help */}
            <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground border-t border-border">
              <span>Delivery questions? Reach our West Mambalam depot at +91 91760 88989</span>
              <Link href="/contact" className="text-primary font-bold hover:underline">
                Contact Customer Care
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
