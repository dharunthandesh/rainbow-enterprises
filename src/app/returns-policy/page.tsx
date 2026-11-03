import React from 'react';
import type { Metadata } from 'next';
import { RefreshCw, ShieldAlert, CheckCircle2, IndianRupee, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Returns & Refund Policy | Rainbow Enterprises',
  description: 'Understand Rainbow Enterprises cancellation, replacement, return eligibility, and refund timelines for organic products.',
};

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <RefreshCw className="h-3.5 w-3.5" />
          Customer Protection
        </div>
        <h1 className="text-3xl sm:text-4xl font-brand font-black text-[#1e3b26] tracking-tight">
          Returns & <span className="font-serif-elegant italic font-normal text-[#b08953]">Refund Policy</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Last Updated: June 2026 • Rainbow Enterprises, Chennai
        </p>
      </div>

      {/* Main Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl space-y-2 shadow-sm">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          <h3 className="font-bold text-sm text-foreground">7-Day Replacement</h3>
          <p className="text-xs text-muted-foreground">Easy replacement for transit damage, leaking bottles, or wrong items.</p>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl space-y-2 shadow-sm">
          <IndianRupee className="h-6 w-6 text-primary" />
          <h3 className="font-bold text-sm text-foreground">100% Refund</h3>
          <p className="text-xs text-muted-foreground">Approved refunds are credited to original payment source within 3-5 business days.</p>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl space-y-2 shadow-sm">
          <ShieldAlert className="h-6 w-6 text-amber-600" />
          <h3 className="font-bold text-sm text-foreground">Food Safety Standards</h3>
          <p className="text-xs text-muted-foreground">Opened or consumed edible items cannot be returned due to hygiene regulations.</p>
        </div>
      </div>

      {/* Detailed Policy Content */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-foreground/90 leading-relaxed text-sm">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Eligibility for Returns & Replacements</h2>
          <p className="text-muted-foreground">
            Due to the organic, food-grade nature of our cold-pressed oils, pure honey, cow ghee, millets, and health foods, we accept return or replacement requests strictly under the following circumstances within <strong className="text-foreground">7 calendar days of delivery</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>Item received was broken, cracked, or leaking during transit.</li>
            <li>Item delivered is expired or was shipped with seal tampered.</li>
            <li>Incorrect item or variant was dispatched contrary to your confirmed order.</li>
            <li>Quality discrepancy verified by our customer experience team.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Non-Returnable Items</h2>
          <p className="text-muted-foreground">
            The following categories cannot be returned or refunded:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>Items where the safety seal has been opened or the product has been partially consumed.</li>
            <li>Items damaged due to improper customer storage (e.g. exposure to direct moisture, sunlight, or heat).</li>
            <li>Requests initiated beyond 7 days of package delivery confirmation.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. How to Request a Return or Replacement</h2>
          <p className="text-muted-foreground">
            To submit a replacement or refund claim:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
            <li>Take 2–3 clear photographs or a short video showing the outer shipping label, damaged seal, or affected bottle.</li>
            <li>Send the details with your Order Number to <strong className="text-foreground">raiinbow27@gmail.com</strong> or WhatsApp our support line at <strong className="text-foreground">+91 91760 88989</strong>.</li>
            <li>Our team will respond within 24 hours to arrange an immediate free replacement dispatch or refund.</li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Refund Processing Timeline</h2>
          <p className="text-muted-foreground">
            Once your return request is approved:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li><strong className="text-foreground">Prepaid Orders (UPI / Card / Netbanking):</strong> The refund amount will be credited back to your original payment method within 3 to 5 business days, depending on your bank's settlement cycle.</li>
            <li><strong className="text-foreground">Cash on Delivery (COD) Orders:</strong> Our customer support will contact you to transfer the refund safely via UPI ID or direct NEFT bank transfer within 2 business days.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">5. Order Cancellations</h2>
          <p className="text-muted-foreground">
            You may cancel an order free of charge at any time before it has been marked as <em>Shipped</em>. Once handed over to the courier partner, an order cannot be cancelled in transit, but you may refuse delivery upon arrival for a full refund of prepaid amounts.
          </p>
        </section>
      </div>
    </div>
  );
}
