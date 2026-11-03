import React from 'react';
import type { Metadata } from 'next';
import { Truck, Clock, ShieldCheck, MapPin, IndianRupee } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | Rainbow Enterprises',
  description: 'Learn about our shipping rates, delivery zones, order fulfillment process, and tracking procedures across India.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <Truck className="h-3.5 w-3.5" />
          Fulfillment Guidelines
        </div>
        <h1 className="text-3xl sm:text-4xl font-brand font-black text-[#1e3b26] tracking-tight">
          Shipping & <span className="font-serif-elegant italic font-normal text-[#b08953]">Delivery Policy</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Last Updated: June 2026 • Rainbow Enterprises, West Mambalam, Chennai
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl space-y-2 text-center sm:text-left shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto sm:mx-0">
            <IndianRupee className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Free Delivery Above ₹500</h3>
          <p className="text-xs text-muted-foreground">Orders below ₹500 attract a nominal handling & shipping fee of ₹50.</p>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl space-y-2 text-center sm:text-left shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto sm:mx-0">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">1 to 2 Days in TN</h3>
          <p className="text-xs text-muted-foreground">Express local fulfillment within Chennai and Tamil Nadu districts.</p>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl space-y-2 text-center sm:text-left shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto sm:mx-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Secure Packaging</h3>
          <p className="text-xs text-muted-foreground">Glass bottles and food containers are secured with heavy-duty eco-cushioning.</p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-foreground/90 leading-relaxed text-sm">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Order Processing Time</h2>
          <p className="text-muted-foreground">
            All orders are processed and packed within 24 business hours of order confirmation. Orders placed on Sundays or gazetted public holidays will be dispatched on the next operational business day. We verify all orders prior to packaging to ensure optimal product freshness.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Estimated Delivery Timelines</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border border-border rounded-xl overflow-hidden">
              <thead className="bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3 border-b border-border">Destination Region</th>
                  <th className="p-3 border-b border-border">Courier Partner</th>
                  <th className="p-3 border-b border-border">Estimated Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="p-3 font-semibold">Chennai Metropolitan Area</td>
                  <td className="p-3 text-muted-foreground">Local Express / Porter</td>
                  <td className="p-3 font-bold text-emerald-600">Same Day / 24 Hours</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Tamil Nadu, Puducherry & Kerala</td>
                  <td className="p-3 text-muted-foreground">ST Courier / Professional</td>
                  <td className="p-3 font-bold text-emerald-600">1 to 2 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Bangalore, Hyderabad, Mumbai, Delhi</td>
                  <td className="p-3 text-muted-foreground">Delhivery / BlueDart / XpressBees</td>
                  <td className="p-3 font-bold text-emerald-600">2 to 4 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Rest of India & Remote Areas</td>
                  <td className="p-3 text-muted-foreground">India Post Speed Post / Delhivery</td>
                  <td className="p-3 font-bold text-emerald-600">4 to 6 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. Shipping Fees & Free Shipping</h2>
          <p className="text-muted-foreground">
            We are proud to offer <strong className="text-foreground">Free Shipping on all cart totals of ₹500 or more</strong>. For carts valuing below ₹500, a standardized shipping and handling charge of ₹50 is added automatically at checkout.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Real-time Tracking</h2>
          <p className="text-muted-foreground">
            Once your package has been handed over to the courier partner, an automated confirmation message containing your tracking AWB number and courier tracking link is dispatched to your registered email address and mobile number via SMS / WhatsApp. You can also monitor delivery milestones directly through our Track Order portal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">5. Damaged or Tampered Shipments</h2>
          <p className="text-muted-foreground">
            In the rare event that your package arrives visibly broken, leaking, or with tape tampered, please do not accept the parcel, or take an unboxing video/photo immediately and reach out to our team at <strong className="text-foreground">raiinbow27@gmail.com</strong> or call <strong className="text-foreground">+91 91760 88989</strong> within 24 hours. We will initiate a prompt replacement without delay.
          </p>
        </section>
      </div>
    </div>
  );
}
