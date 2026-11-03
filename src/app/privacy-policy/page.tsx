import React from 'react';
import type { Metadata } from 'next';
import { Lock, Shield, Eye, Database, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Rainbow Enterprises',
  description: 'Understand how Rainbow Enterprises collects, protects, and handles your personal information, contact details, and transactions.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <Lock className="h-3.5 w-3.5" />
          Data Protection
        </div>
        <h1 className="text-3xl sm:text-4xl font-brand font-black text-[#1e3b26] tracking-tight">
          Privacy <span className="font-serif-elegant italic font-normal text-[#b08953]">Policy</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Effective Date: June 01, 2026 • Rainbow Enterprises, West Mambalam, Chennai
        </p>
      </div>

      {/* Trust Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl space-y-2 shadow-sm">
          <Shield className="h-6 w-6 text-emerald-600" />
          <h3 className="font-bold text-sm text-foreground">Zero Data Selling</h3>
          <p className="text-xs text-muted-foreground">We never rent, lease, or monetize your contact or purchase information.</p>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl space-y-2 shadow-sm">
          <Lock className="h-6 w-6 text-primary" />
          <h3 className="font-bold text-sm text-foreground">Encrypted Transactions</h3>
          <p className="text-xs text-muted-foreground">All communications and checkout orders are secured via TLS 1.3 / SSL encryption.</p>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl space-y-2 shadow-sm">
          <Eye className="h-6 w-6 text-amber-600" />
          <h3 className="font-bold text-sm text-foreground">User Transparency</h3>
          <p className="text-xs text-muted-foreground">You can request profile updates or account deletion at any time.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-foreground/90 leading-relaxed text-sm">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Introduction</h2>
          <p className="text-muted-foreground">
            Rainbow Enterprises (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates the website and ecommerce store delivering organic and natural products to customers across India. We respect your privacy and are committed to protecting the personally identifiable information you share with us.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect information strictly necessary to process orders, provide customer service, and improve your shopping experience:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li><strong className="text-foreground">Contact & Identity:</strong> Name, phone number, email address, billing address, and shipping address.</li>
            <li><strong className="text-foreground">Order & Transaction Details:</strong> Products purchased, quantities, pricing, order timestamps, and delivery progress.</li>
            <li><strong className="text-foreground">Payment Records:</strong> We store payment method references (e.g. COD or payment transaction ID). <span className="font-semibold text-foreground">We do NOT store credit/debit card numbers, CVVs, or online banking passwords.</span> All payment handling is conducted by certified PCI-DSS compliant payment gateways.</li>
            <li><strong className="text-foreground">Technical Data:</strong> Browser type, IP address, and cookie preferences used solely for essential session preservation and shopping cart persistence.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. How We Use Your Information</h2>
          <p className="text-muted-foreground">
            The collected information is utilized strictly to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>Process and fulfill orders, print shipping labels, and dispatch packages to your delivery location.</li>
            <li>Send order confirmations, invoice copies, and real-time shipping tracking alerts via Email, SMS, or WhatsApp.</li>
            <li>Assist you with customer care inquiries, replacements, and refund claims.</li>
            <li>Prevent fraudulent transactions and protect our customers from duplicate charges.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Sharing with Third-Party Service Providers</h2>
          <p className="text-muted-foreground">
            We share relevant order details only with reputable partners strictly for order completion:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li><strong className="text-foreground">Courier Partners:</strong> ST Courier, Delhivery, BlueDart, India Post (to enable door delivery).</li>
            <li><strong className="text-foreground">Payment Gateways:</strong> Authorized banking payment gateways (to process secure digital transactions).</li>
          </ul>
          <p className="text-muted-foreground">
            We will never sell or disclose your private information to third-party advertising brokers or spammers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">5. Data Retention & Your Rights</h2>
          <p className="text-muted-foreground">
            You have the right to inspect, update, or request the deletion of your account records. To exercise these rights or question our data practices, reach our Privacy Officer at <strong className="text-foreground">raiinbow27@gmail.com</strong> or write to Rainbow Enterprises, S2, Second Floor, Vandikaran Street, West Mambalam, Chennai – 600033.
          </p>
        </section>
      </div>
    </div>
  );
}
