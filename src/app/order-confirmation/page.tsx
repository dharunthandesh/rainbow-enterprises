'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ShoppingBag, 
  Printer, 
  Truck, 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'RWB-784291';
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('rainbow-admin-orders');
      if (stored) {
        const orders = JSON.parse(stored);
        const match = orders.find((o: any) => o.order_number === orderNumber);
        if (match) {
          setOrder(match);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Default simulated order data
    setOrder({
      order_number: orderNumber,
      customer_name: 'Valued Customer',
      customer_email: 'customer@example.com',
      shipping_address: 'S2 Vandikaran Street, West Mambalam',
      shipping_city: 'Chennai',
      shipping_state: 'Tamil Nadu',
      shipping_zip_code: '600033',
      payment_method: 'COD',
      subtotal: 950,
      shipping_cost: 0,
      discount_amount: 95,
      total_amount: 855,
      created_at: new Date().toISOString(),
      order_items: [
        { product_name: 'Traditional Cold Pressed Sesame Oil', quantity: 1, weight: '1000ml', product_price: 450 },
        { product_name: 'Pure Desi Cow Ghee (A2 Bilona Method)', quantity: 1, weight: '500ml', product_price: 500 }
      ]
    });
  }, [orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Success Badge & Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle2 className="h-12 w-12" />
        </motion.div>

        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-brand font-black text-[#1e3b26] tracking-tight">
            Order <span className="font-serif-elegant italic font-normal text-[#b08953]">Confirmed!</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Thank you for supporting traditional organic farming. We have received your order and our depot team in West Mambalam is preparing your package.
          </p>
        </div>
      </div>

      {/* Printable Invoice / Receipt Box */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-md space-y-6 print:border-none print:shadow-none">
        {/* Receipt Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 border-b border-border pb-6">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Receipt for Order</span>
            <h2 className="text-2xl font-black font-mono text-primary">{order.order_number}</h2>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="flex gap-2 print:hidden">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="rounded-xl flex items-center gap-1.5 text-xs font-bold"
            >
              <Printer className="h-4 w-4" />
              Print Receipt
            </Button>
          </div>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-border pb-6">
          <div className="space-y-1.5">
            <span className="font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Delivery Destination
            </span>
            <p className="font-bold text-sm text-foreground">{order.customer_name}</p>
            <p className="text-muted-foreground leading-relaxed">
              {order.shipping_address}<br />
              {order.shipping_city}, {order.shipping_state} - {order.shipping_zip_code}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <CreditCard className="h-3.5 w-3.5 text-primary" /> Payment Method
            </span>
            <p className="font-bold text-sm text-foreground uppercase">{order.payment_method}</p>
            <p className="text-muted-foreground leading-relaxed">
              Status: <span className="text-emerald-600 font-bold">Authorized / In Process</span><br />
              Estimated Delivery: 2 to 4 Business Days
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Purchased Organic Products
          </h3>
          <div className="divide-y divide-border/60 border border-border rounded-2xl overflow-hidden">
            {(order.order_items || []).map((item: any, idx: number) => (
              <div key={idx} className="p-4 flex justify-between items-center text-sm">
                <div>
                  <p className="font-bold text-foreground">{item.product_name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{item.weight ? `${item.weight} • ` : ''}Qty: {item.quantity}</p>
                </div>
                <span className="font-bold font-mono">
                  ₹{(item.product_price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Calculations */}
        <div className="space-y-2 text-sm border-t border-border pt-4">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-mono font-semibold text-foreground">₹{order.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Shipping & Handling</span>
            <span className="font-mono font-semibold text-foreground">
              {order.shipping_cost === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${order.shipping_cost.toFixed(2)}`}
            </span>
          </div>

          {order.discount_amount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Promotional Discount</span>
              <span className="font-mono font-bold">-₹{order.discount_amount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-base font-black border-t border-border pt-3">
            <span>Total Paid</span>
            <span className="text-primary text-xl font-mono">₹{order.total_amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Notification note */}
        <div className="bg-muted/30 border border-border rounded-2xl p-4 flex items-center gap-3 text-xs text-muted-foreground">
          <Mail className="h-5 w-5 text-primary flex-shrink-0" />
          <span>A copy of this confirmation receipt along with invoice has been sent to your registered contact.</span>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 print:hidden">
        <Link href={`/track-order`}>
          <Button variant="outline" className="w-full sm:w-auto font-bold rounded-2xl px-6 py-6 border-primary/30 text-primary hover:bg-primary/5">
            <Truck className="h-4 w-4 mr-2" />
            Track Shipment
          </Button>
        </Link>
        <Link href="/shop">
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-2xl px-8 py-6 shadow-md">
            Continue Shopping
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold">Loading order receipt...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
