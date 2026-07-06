import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, Leaf, ShieldCheck, ShoppingBag, Star,
  Play, FlaskConical, Award, Truck, CheckCircle2, Sparkles,
} from 'lucide-react';
import { getProducts } from '@/lib/mockData';
import { ProductCard } from '@/components/shop/ProductCard';
import { MapPlaceholder } from '@/components/ui/MapPlaceholder';

export default async function Home() {
  const featuredProducts = await getProducts(undefined, true);

  return (
    <div className="bg-[#f4ece0] min-h-screen overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════
          HERO — Full-viewport, product-first, no central image box
          Products are each independent floating 3D elements
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative w-full overflow-hidden min-h-[100svh] flex items-center bg-[#f4ece0]"
      >
        {/* Background Image with 3D styled animation */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden" style={{ perspective: '1200px' }}>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes float3D {
              0% {
                transform: rotateX(1deg) rotateY(-1.5deg) scale(1.03) translateZ(0px);
              }
              50% {
                transform: rotateX(-1.5deg) rotateY(1.5deg) scale(1.06) translateZ(15px);
              }
              100% {
                transform: rotateX(1deg) rotateY(-1.5deg) scale(1.03) translateZ(0px);
              }
            }
          `}} />
          <Image
            src="/hero_bg_hq.jpg"
            alt="RootsVeyr Products Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            style={{
              animation: 'float3D 18s ease-in-out infinite',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              willChange: 'transform',
              imageRendering: 'auto',
            }}
            quality={100}
          />
        </div>
        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full pl-3 pr-6 sm:pl-4 sm:pr-8 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Headline and Badges */}
          <div className="space-y-8 max-w-xl pr-20 sm:pr-32 lg:pr-0 -ml-2 sm:-ml-4 lg:ml-0 relative lg:-left-[10%] z-20">
            {/* Headline */}
            <h1 className="font-brand font-black text-[#1e3b26] leading-[1.08] tracking-tight text-5xl sm:text-6xl md:text-7xl">
              Tradition<br />
              You Can<br />
              Taste.<br />
              <span className="text-[#b08953]">Purity You<br />Can Trust.</span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 font-sans text-sm sm:text-base leading-relaxed max-w-md">
              Premium traditional food products sourced naturally and delivered by <strong className="text-gray-900 font-semibold">Rainbow Enterprises</strong>.
            </p>

            {/* CTA */}
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2.5 bg-[#1d3824] hover:bg-[#142318] text-white font-bold rounded-full shadow-lg shadow-[#1d3824]/28 hover:shadow-xl transition-all duration-300 px-7 py-3.5 text-sm sm:text-base group"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                Shop Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Stacked Info Cards */}
          <div className="flex flex-col gap-5 w-full max-w-[330px] ml-auto relative lg:-top-48 lg:-right-[22%] z-20">
            {/* Video / Tradition Card */}
            <div className="bg-[#f0e6d3] border border-[#d9c9b0] shadow-lg rounded-[1.75rem] p-4 flex items-center gap-4 w-full">
              <div className="relative flex-shrink-0 rounded-xl overflow-hidden w-20 h-14 bg-amber-50">
                <Image
                  src="/preserve_tradition.png"
                  alt="Cold pressing tradition"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md">
                    <Play className="w-2.5 h-2.5 fill-[#1d3824] text-[#1d3824] ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="font-brand font-black text-sm text-[#1e3b26] leading-tight">
                  How We Preserve Tradition
                </h3>
                <p className="text-[10px] text-gray-500 leading-snug">
                  Watch our cold-pressing process.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-[#b08953] hover:text-[#946e3a] transition-colors pt-0.5"
                >
                  Watch Now <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Customer Rating Card */}
            <div className="bg-[#f0e6d3] border border-[#d9c9b0] shadow-lg rounded-[1.75rem] p-5 w-full space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1d3824] flex items-center justify-center">
                <Star className="w-3.5 h-3.5 fill-white text-white" />
              </div>
              <div className="space-y-0.5">
                <div className="font-brand font-black text-2xl text-[#1e3b26] leading-none">
                  4.8<span className="text-lg font-normal text-gray-400">/5</span>
                </div>
                <h4 className="font-bold text-[#1e3b26] text-xs mt-0.5">Customer Rating</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Trusted by thousands of happy customers.
                </p>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-1 text-[10px] font-bold text-[#b08953] hover:text-[#946e3a] transition-colors"
              >
                Read Reviews <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* ── End Hero ── */}

      {/* ═══════════════ TRUST STRIP ═══════════════ */}
      <div className="bg-[#1d3824]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-center md:justify-between items-center gap-y-3 gap-x-6">
          {([
            { icon: <Leaf className="h-3.5 w-3.5" />, label: 'Sustainably Sourced' },
            { icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 10a8 8 0 0 0 16 0v-2H4v2Z"/><path d="M12 4v4"/><path d="M10 2h4"/></svg>, label: 'Traditional Methods' },
            { icon: <FlaskConical className="h-3.5 w-3.5" />, label: 'Lab Tested for Purity' },
            { icon: <ShieldCheck className="h-3.5 w-3.5" />, label: 'No Added Preservatives' },
            { icon: <Truck className="h-3.5 w-3.5" />, label: 'Pan India Delivery' },
          ] as { icon: React.ReactNode; label: string }[]).map((item, idx, arr) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-[#c5a880]">{item.icon}</span>
                <span className="text-[10.5px] font-bold uppercase tracking-wider whitespace-nowrap">{item.label}</span>
              </div>
              {idx < arr.length - 1 && <span className="hidden md:block w-px h-3 bg-white/15" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ═══════════════ CATEGORY CARDS ═══════════════ */}
      <section className="py-14 px-4 sm:px-6 lg:px-10 bg-[#f4ece0]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b08953] mb-1.5">Browse the Range</p>
              <h2 className="text-2xl sm:text-3xl font-brand font-black text-[#1e3b26] tracking-tight">
                Shop by <span className="font-serif-elegant italic font-normal text-[#b08953] tracking-normal">Category</span>
              </h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1e3b26] hover:text-[#b08953] transition-colors group">
              All Products <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { title: 'Cold Pressed\nOils', sub: '12 products', img: '/products/RAINBOW ENTERPRISES/1. Cold Pressed Oils/Groundnut_Oil_1.png', href: '/shop?category=oils-ghee', bg: 'bg-amber-50' },
              { title: 'Millets &\nGrains', sub: '8 products', img: '/cat_millets.png', href: '/shop?category=millets-pulses', bg: 'bg-green-50' },
              { title: 'Pure Honey', sub: '6 varieties', img: '/products/RAINBOW ENTERPRISES/3. Honeys/CAVE_HONEY_1.jpg', href: '/shop?category=honey-sweeteners', bg: 'bg-orange-50' },
              { title: 'Desi Ghee', sub: '4 products', img: '/products/RAINBOW ENTERPRISES/2. Ghees/COW GHEE_1.png', href: '/shop?category=oils-ghee', bg: 'bg-yellow-50' },
              { title: 'Traditional\nFoods', sub: '15+ items', img: '/products/RAINBOW ENTERPRISES/5. Cookies/MULTIGRAIN_COOKIES.JPG', href: '/shop?category=snacks-nuts', bg: 'bg-stone-50' },
            ].map((cat, idx) => (
              <Link key={idx} href={cat.href} className="group">
                <div className={`${cat.bg} border border-white/80 hover:border-[#b08953]/25 rounded-2xl p-4 sm:p-5 relative overflow-hidden min-h-[135px] sm:min-h-[155px] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
                  <div className="absolute -right-3 -bottom-3 w-[80px] h-[80px] sm:w-[95px] sm:h-[95px] opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-400">
                    <Image src={cat.img} alt={cat.title} fill className="object-contain" sizes="95px" />
                  </div>
                  <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                    <div>
                      <div className="font-brand font-bold text-sm sm:text-base text-[#1e3b26] leading-tight whitespace-pre-line">{cat.title}</div>
                      <div className="text-[9px] text-[#1e3b26]/45 font-semibold mt-0.5">{cat.sub}</div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#1e3b26] text-white flex items-center justify-center group-hover:bg-[#b08953] transition-colors duration-300">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ BEST SELLERS ═══════════════ */}
      <section className="py-14 px-4 sm:px-6 lg:px-10 bg-white/35">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b08953] mb-1.5">Customer Favourites</p>
              <h2 className="text-2xl sm:text-3xl font-brand font-black text-[#1e3b26] tracking-tight">
                Best <span className="font-serif-elegant italic font-normal text-[#b08953] tracking-normal">Sellers</span>
              </h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1e3b26] hover:text-[#b08953] transition-colors group">
              View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-14 px-4 sm:px-6 lg:px-10 bg-[#ede4d2]">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b08953] mb-2">What Families Say</p>
            <h2 className="text-2xl sm:text-3xl font-brand font-black text-[#1e3b26] tracking-tight">
              Loved Across <span className="font-serif-elegant italic font-normal text-[#b08953] tracking-normal">India</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Priya Srinivasan', loc: 'Chennai', text: '"The Desi Cow Ghee smells exactly like what my grandmother used to make. Perfect grainy texture, deep aroma. 100% genuine!"', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80' },
              { name: 'Rohan Mathews',    loc: 'Bangalore', text: '"Finding genuine cold-pressed coconut oil was tough until I ordered from Rainbow. It makes our traditional cooking taste incredible."', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80' },
            ].map((t, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#e5d8c5] space-y-4">
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                </div>
                <p className="text-[#1e3b26]/68 text-sm leading-relaxed italic">{t.text}</p>
                <div className="flex items-center gap-3 pt-3 border-t border-[#ece2d5]">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#1e3b26]">{t.name}</div>
                    <div className="text-[10px] text-gray-400 font-medium">Verified Buyer · {t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ MAP ═══════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-brand font-black text-[#1e3b26] tracking-tight">
            Visit Our <span className="font-serif-elegant italic font-normal text-[#b08953] tracking-normal">Store</span>
          </h2>
          <p className="text-[#1e3b26]/52 text-sm max-w-md mx-auto">Experience the full organic range in person at our Chennai store.</p>
        </div>
        <MapPlaceholder />
      </section>
    </div>
  );
}
