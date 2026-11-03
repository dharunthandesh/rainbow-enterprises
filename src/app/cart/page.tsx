'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getCartSubtotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const subtotal = getCartSubtotal();
  const freeShippingThreshold = 500;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 50;
  const total = Math.max(0, subtotal + shippingFee - promoDiscount);

  const handleApplyPromo = () => {
    setPromoMessage(null);
    if (!promoCode.trim()) {
      setPromoMessage({ text: 'Please enter a coupon code.', isError: true });
      return;
    }

    if (promoCode.trim().toUpperCase() === 'RAINBOW10') {
      const discount = subtotal * 0.10;
      setPromoDiscount(discount);
      setPromoMessage({ text: 'Success! 10% discount applied.', isError: false });
    } else if (promoCode.trim().toUpperCase() === 'FIRSTBUY') {
      const discount = 50;
      setPromoDiscount(discount);
      setPromoMessage({ text: 'Success! ₹50 introductory discount applied.', isError: false });
    } else {
      setPromoMessage({ text: 'Invalid promo code. Try RAINBOW10 for 10% off.', isError: true });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb and Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-brand font-black text-[#1e3b26] tracking-tight">
          Shopping <span className="font-serif-elegant italic font-normal text-[#b08953]">Cart</span>
        </h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/shop" className="hover:text-primary">Shop</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-foreground">Cart</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-12 text-center max-w-lg mx-auto space-y-6 shadow-sm">
          <div className="w-20 h-20 bg-muted/60 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Your cart is empty</h2>
            <p className="text-sm text-muted-foreground">
              Looks like you haven&apos;t added any natural organic products to your basket yet.
            </p>
          </div>
          <Link href="/shop">
            <Button className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-8 py-6 rounded-2xl shadow-md">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 space-y-6">
            {/* Free Shipping Alert Bar */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                  <Truck className="h-4 w-4" />
                  {amountNeededForFreeShipping === 0
                    ? '🎉 You unlocked FREE Shipping on this order!'
                    : `Add ₹${amountNeededForFreeShipping.toFixed(0)} more to unlock FREE Delivery!`}
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-mono">
                  {Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%
                </span>
              </div>
              <div className="w-full h-2 bg-emerald-500/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>

            {/* Cart Items Table */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              <div className="p-4 sm:p-6 border-b border-border flex justify-between items-center">
                <h2 className="text-base font-bold text-foreground">
                  Products in Your Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-xs text-destructive hover:underline font-bold"
                >
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-border/60">
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Item Details */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-2xl bg-muted overflow-hidden flex-shrink-0 border border-border">
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="space-y-1">
                        <Link href={`/shop/${item.product.slug}`} className="font-bold text-foreground text-sm sm:text-base hover:text-primary transition-colors line-clamp-1">
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-muted-foreground font-medium">
                          Pack size: <span className="font-bold text-foreground">{item.product.weight}</span>
                        </p>
                        <p className="text-xs font-mono font-bold text-primary">
                          ₹{item.product.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Controls */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                      <div className="flex items-center border border-border rounded-xl bg-muted/20 p-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-black font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-black text-sm sm:text-base text-foreground font-mono">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-muted-foreground hover:text-destructive p-2 rounded-xl transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline">
                <ArrowLeft className="h-4 w-4" /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-3">
                Order Summary
              </h3>

              {/* Promo code form */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Discount Coupon
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter RAINBOW10"
                    className="flex-1 px-3 py-2.5 bg-muted/30 border border-border rounded-xl text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                  <Button
                    type="button"
                    onClick={handleApplyPromo}
                    className="bg-secondary text-secondary-foreground text-xs font-bold px-4 rounded-xl"
                  >
                    Apply
                  </Button>
                </div>

                {promoMessage && (
                  <p className={`text-[11px] font-bold ${promoMessage.isError ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-3 text-sm border-t border-border pt-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-foreground font-mono">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-foreground font-mono">
                    {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shippingFee.toFixed(2)}`}
                  </span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      Promo Code Discount
                    </span>
                    <span className="font-bold font-mono">-₹{promoDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black border-t border-border pt-3">
                  <span>Grand Total</span>
                  <span className="text-primary text-xl font-mono">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link href="/checkout" className="block">
                <Button className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/20 border border-border rounded-xl p-3">
                <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>100% Organic Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
