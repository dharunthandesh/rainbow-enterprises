import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpCircle, ChevronRight, ShieldCheck, Truck, RefreshCw, Sparkles, PhoneCall } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | Rainbow Enterprises',
  description: 'Find answers about our organic products, cold-pressed extraction methods, shipping times, delivery charges, and refund policies.',
};

const faqs = [
  {
    category: 'Products & Organic Quality',
    icon: Sparkles,
    items: [
      {
        q: 'How are your cold-pressed oils extracted?',
        a: 'Our oils are extracted using traditional wooden cold-press (vagai mara chekku) machinery at low room temperatures. No artificial heat, chemicals, paraffin, or refining agents are added, preserving 100% of the natural nutrients, antioxidants, and original aroma.'
      },
      {
        q: 'Are your honey and ghee 100% natural and pure?',
        a: 'Yes. Our honey is ethically harvested raw from mountain caves and natural forest hives without boiling, pasteurization, or added sugar syrups. Our Desi Cow Ghee is made from grass-fed indigenous cows using the traditional bilona curd-churning method.'
      },
      {
        q: 'Do your products contain artificial preservatives or colors?',
        a: 'Never. All Rainbow Enterprises products are 100% free from synthetic additives, artificial flavors, chemical preservatives, or colorants. We believe in providing food as nature intended.'
      }
    ]
  },
  {
    category: 'Orders & Shipping',
    icon: Truck,
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Orders within Chennai and Tamil Nadu are delivered within 24 to 48 hours. Orders to Bangalore, Hyderabad, and other metropolitan areas take 2 to 4 business days. For the rest of India, delivery takes 3 to 6 business days.'
      },
      {
        q: 'What are the shipping charges?',
        a: 'We offer FREE shipping on all orders of ₹500 and above! For orders below ₹500, a nominal flat shipping fee of ₹50 is charged to cover handling and courier costs.'
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order is dispatched, you will receive an SMS and email notification with your tracking ID. You can also track your shipment status anytime using our Track Order page with your Order Number.'
      }
    ]
  },
  {
    category: 'Payments & Security',
    icon: ShieldCheck,
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major payment methods including UPI (Google Pay, PhonePe, Paytm), Credit & Debit cards (Visa, MasterCard, RuPay), Net Banking across 50+ banks, and Cash on Delivery (COD) for eligible pin codes.'
      },
      {
        q: 'Is online payment secure on Rainbow Enterprises?',
        a: 'Yes, completely. Our platform employs 256-bit SSL encryption. We never store credit or debit card numbers, CVVs, or bank passwords on our servers.'
      }
    ]
  },
  {
    category: 'Returns & Cancellations',
    icon: RefreshCw,
    items: [
      {
        q: 'What is your return policy?',
        a: 'Because our products are edible perishable food goods, unopened bottles and packs can be reported for return or replacement within 7 days of delivery if they arrive damaged, leaked, defective, or incorrect.'
      },
      {
        q: 'How do I cancel an order?',
        a: 'You can request cancellation before your order is packed and dispatched by contacting our customer care via WhatsApp or phone at +91 91760 88989 or emailing raiinbow27@gmail.com with your Order ID.'
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="h-4 w-4" />
          Got Questions?
        </div>
        <h1 className="text-4xl sm:text-5xl font-brand font-black text-[#1e3b26] tracking-tight">
          Frequently Asked <span className="font-serif-elegant italic font-normal text-[#b08953]">Questions</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Everything you need to know about our organic cold-pressed oils, pure farm essentials, shipping times, and ordering process.
        </p>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-10">
        {faqs.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.category} className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-foreground">{section.category}</h2>
              </div>

              <div className="divide-y divide-border/60">
                {section.items.map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-2">
                    <h3 className="font-bold text-base text-foreground flex items-start gap-2.5">
                      <span className="text-primary font-mono text-sm mt-0.5">Q.</span>
                      {item.q}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed pl-6">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Prompt */}
      <div className="bg-gradient-to-br from-[#1e3b26] to-[#14281a] rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-2xl font-bold">Still have questions?</h3>
          <p className="text-white/70 text-sm max-w-md">
            Our customer care team is available Monday to Saturday (9:00 AM - 7:00 PM IST) to assist you.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://wa.me/919176088989"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#4ade80] hover:bg-[#3ec470] text-black font-bold rounded-xl text-sm transition-colors text-center"
          >
            Chat on WhatsApp
          </a>
          <Link
            href="/contact"
            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-colors border border-white/20 text-center"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
