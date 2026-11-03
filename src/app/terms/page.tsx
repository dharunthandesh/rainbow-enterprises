import React from 'react';
import type { Metadata } from 'next';
import { FileText, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Rainbow Enterprises',
  description: 'Review the terms of service, acceptable use, product pricing, and purchase conditions for Rainbow Enterprises.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <FileText className="h-3.5 w-3.5" />
          Legal Agreement
        </div>
        <h1 className="text-3xl sm:text-4xl font-brand font-black text-[#1e3b26] tracking-tight">
          Terms & <span className="font-serif-elegant italic font-normal text-[#b08953]">Conditions</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Last Updated: June 01, 2026 • Rainbow Enterprises, Chennai
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-foreground/90 leading-relaxed text-sm">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Overview</h2>
          <p className="text-muted-foreground">
            This website is operated by Rainbow Enterprises. Throughout the site, the terms &quot;we&quot;, &quot;us&quot; and &quot;our&quot; refer to Rainbow Enterprises. By visiting our site and/or purchasing items from us, you engage in our &quot;Service&quot; and agree to be bound by the following terms and conditions (&quot;Terms of Service&quot;, &quot;Terms&quot;).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Accuracy of Product Information & Natural Variations</h2>
          <p className="text-muted-foreground">
            We make every effort to display as accurately as possible the colors, descriptions, weights, and images of our products. Because our oils, honey, pulses, and spices are 100% natural and harvested in batches without synthetic stabilizers, slight variations in natural color, aroma, and sediment consistency are natural indicators of pure, unfiltered foods.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. Pricing & Promotions</h2>
          <p className="text-muted-foreground">
            Prices for our products are subject to change without notice in accordance with raw agricultural market conditions. We reserve the right at any time to modify or discontinue any product or promotional offer (including coupon codes like RAINBOW10) without prior liability.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Billing & Account Accuracy</h2>
          <p className="text-muted-foreground">
            You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and contact information, including your email address, phone number, and physical delivery address, so that we can complete your transactions and contact you as needed.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">5. Intellectual Property</h2>
          <p className="text-muted-foreground">
            All text, branding, graphics, product photography, trademarks, logos, and software code on this website are the intellectual property of Rainbow Enterprises or its respective licensors and are protected under Indian copyright and intellectual property laws.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">6. Governing Law & Jurisdiction</h2>
          <p className="text-muted-foreground">
            These Terms of Service and any separate agreements whereby we provide you goods or services shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with this site shall be subject to the exclusive jurisdiction of the competent courts in Chennai, Tamil Nadu.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">7. Contact Information</h2>
          <p className="text-muted-foreground">
            Questions regarding the Terms & Conditions should be addressed to our legal desk at <strong className="text-foreground">raiinbow27@gmail.com</strong> or mailed to: Rainbow Enterprises, S2, Second Floor, Vandikaran Street, West Mambalam, Chennai – 600033.
          </p>
        </section>
      </div>
    </div>
  );
}
