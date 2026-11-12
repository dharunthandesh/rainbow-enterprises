'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Star, Sparkles, Check, Plus } from 'lucide-react';
import { Product } from '@/lib/supabase';
import { useCart } from '@/store/useCart';
import { useToast } from '@/hooks/use-toast';

interface TopProductItem {
  id: string;
  category_id: string;
  name: string;
  shortTitle: string;
  badgeText: string;
  tagline: string;
  description: string;
  price: number;
  original_price: number;
  weight: string;
  stock: number;
  is_featured: boolean;
  slug: string;
  image_url: string;
  images: string[];
  created_at: string;
  accentColor: string;
  highlightTag: string;
  rating: number;
}

const TOP_PRODUCTS: TopProductItem[] = [
  {
    id: 'd0000000-0000-0000-0000-000000000021',
    category_id: 'c0000000-0000-0000-0000-000000000002',
    name: 'Pure Desi Cow Ghee',
    shortTitle: 'Desi Cow Ghee',
    badgeText: 'PURE DESI COW GHEE • 100% BILONA CHURNED • ',
    tagline: 'Traditional A2 Bilona Churned Butter',
    description: 'Golden, granular and deeply aromatic ghee hand-churned from curd using traditional wooden bilona methods.',
    price: 765,
    original_price: 880,
    weight: '240g',
    stock: 100,
    is_featured: true,
    slug: 'desi-cow-ghee-240g',
    image_url: '/products/RAINBOW ENTERPRISES/2. Ghees/COW GHEE_1.png',
    images: [
      '/products/RAINBOW ENTERPRISES/2. Ghees/COW GHEE_1.png',
      '/products/RAINBOW ENTERPRISES/2. Ghees/COW GHEE_2.png',
    ],
    created_at: '2026-06-15T12:00:00Z',
    accentColor: '#e08a3c',
    highlightTag: 'Top Seller #1',
    rating: 4.9,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000002',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Virgin Coconut Oil',
    shortTitle: 'Virgin Coconut Oil',
    badgeText: 'WOOD COLD PRESSED • VIRGIN COCONUT OIL • ',
    tagline: '100% Raw, Cold-Pressed & Unrefined',
    description: 'Freshly extracted from sun-cured copra without applying heat. High in natural lauric acid and delicate coconut scent.',
    price: 320,
    original_price: 368,
    weight: '250ml',
    stock: 100,
    is_featured: true,
    slug: 'virgin-coconut-oil-250ml',
    image_url: '/products/RAINBOW ENTERPRISES/1. Cold Pressed Oils/Virgin_Coconut_Oil_1.png',
    images: [
      '/products/RAINBOW ENTERPRISES/1. Cold Pressed Oils/Virgin_Coconut_Oil_1.png',
      '/products/RAINBOW ENTERPRISES/1. Cold Pressed Oils/Virgin_Coconut_Oil_2.png',
    ],
    created_at: '2026-06-15T12:00:00Z',
    accentColor: '#48a9a6',
    highlightTag: 'Customer Favorite',
    rating: 4.8,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000033',
    category_id: 'c0000000-0000-0000-0000-000000000003',
    name: 'Wild Mountain Cave Honey',
    shortTitle: 'Cave Honey',
    badgeText: 'WILD MOUNTAIN CAVE HONEY • RAW & UNFILTERED • ',
    tagline: 'Rare Harvest from Cliff Caves',
    description: 'Raw, unprocessed wild honey ethically collected from mountain caves and deep forests, loaded with active enzymes.',
    price: 325,
    original_price: 374,
    weight: '250g',
    stock: 100,
    is_featured: true,
    slug: 'cave-honey-250g',
    image_url: '/products/RAINBOW ENTERPRISES/3. Honeys/CAVE_HONEY_2.png',
    images: [
      '/products/RAINBOW ENTERPRISES/3. Honeys/CAVE_HONEY_2.png',
      '/products/RAINBOW ENTERPRISES/3. Honeys/CAVE_HONEY_1.jpg',
    ],
    created_at: '2026-06-15T12:00:00Z',
    accentColor: '#d69e2e',
    highlightTag: 'Rare Harvest',
    rating: 5.0,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000012',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Chekku Groundnut Oil',
    shortTitle: 'Groundnut Oil',
    badgeText: 'TRADITIONAL CHEKKU • WOOD PRESSED GROUNDNUT OIL • ',
    tagline: 'Traditional Vagai Wood Chekku',
    description: 'Crushed slowly in authentic wooden chekku mills to preserve natural antioxidants, nutty aroma, and heart-healthy fats.',
    price: 590,
    original_price: 678,
    weight: '1000ml',
    stock: 100,
    is_featured: true,
    slug: 'groundnut-oil-1000ml',
    image_url: '/products/RAINBOW ENTERPRISES/1. Cold Pressed Oils/Groundnut_Oil_1.png',
    images: [
      '/products/RAINBOW ENTERPRISES/1. Cold Pressed Oils/Groundnut_Oil_1.png',
      '/products/RAINBOW ENTERPRISES/1. Cold Pressed Oils/Groundnut_Oil_2.png',
    ],
    created_at: '2026-06-15T12:00:00Z',
    accentColor: '#c05621',
    highlightTag: 'Daily Staple',
    rating: 4.9,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000015',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Chekku Gingelly Oil',
    shortTitle: 'Gingelly Oil',
    badgeText: 'TRADITIONAL CHEKKU • PURE GINGELLY SESAME OIL • ',
    tagline: 'Traditional Wood Chekku Nalla Ennai',
    description: 'Cold-pressed from select sesame seeds with palm jaggery in traditional wooden chekku mills for rich authentic aroma.',
    price: 405,
    original_price: 466,
    weight: '500ml',
    stock: 100,
    is_featured: true,
    slug: 'gingelly-oil-500ml',
    image_url: '/products/RAINBOW ENTERPRISES/1. Cold Pressed Oils/GINGELLY_OIL_1.png',
    images: [
      '/products/RAINBOW ENTERPRISES/1. Cold Pressed Oils/GINGELLY_OIL_1.png',
      '/products/RAINBOW ENTERPRISES/1. Cold Pressed Oils/GINGELLY_OIL_2.png',
    ],
    created_at: '2026-06-15T12:00:00Z',
    accentColor: '#b7791f',
    highlightTag: 'Heritage Choice',
    rating: 4.9,
  },
];

export function EditorialHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();

  const current = TOP_PRODUCTS[activeIndex];

  // Subtle auto-rotation every 7 seconds when not paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TOP_PRODUCTS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productPayload: Product = {
      id: current.id,
      category_id: current.category_id,
      name: current.name,
      slug: current.slug,
      description: current.description,
      price: current.price,
      original_price: current.original_price,
      weight: current.weight,
      stock: current.stock,
      is_featured: current.is_featured,
      image_url: current.image_url,
      images: current.images,
      created_at: current.created_at,
    };
    addItem(productPayload, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1800);
    toast({
      title: 'Added to Bag',
      description: `${current.name} (${current.weight}) has been added to your cart.`,
    });
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0c262d] text-white min-h-[calc(100svh-6rem)] lg:h-[calc(100svh-6rem)] lg:max-h-[760px] flex flex-col justify-between select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Editorial Cinematic Background & Spotlights ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Rich moody base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#081a1f] via-[#0e2f37] to-[#0a1f25]" />

        {/* Ambient Warm Golden Beam Spotlight directly behind the central product */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-[20%] -translate-y-1/2 w-[550px] h-[550px] sm:w-[700px] sm:h-[700px] rounded-full opacity-35 blur-[100px] transition-colors duration-1000 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${current.accentColor} 0%, rgba(12,38,45,0) 70%)` }}
        />

        {/* Cinematic Directional Light Strip (mimicking the sunlight angle in the reference image) */}
        <div className="absolute -top-32 right-1/4 w-[280px] h-[140%] bg-gradient-to-b from-white/10 via-amber-100/5 to-transparent rotate-12 blur-3xl pointer-events-none" />

        {/* Subtle Fine Film Grain */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ── Main Hero Editorial Content (Fitted to Viewport) ── */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-5 flex-1 flex flex-col justify-between">
        
        {/* Cursive Subtitle Kicker (Humble, warm & respectful) */}
        <div className="mb-1 sm:mb-2">
          <p
            className="font-script text-[#f6d7b0] text-xl sm:text-2xl md:text-3xl font-normal tracking-wide -rotate-1 drop-shadow-sm inline-block"
            style={{ fontFamily: "'Alex Brush', var(--font-elegant), 'Playfair Display', cursive" }}
          >
            Gently handcrafted with love &amp; patience
          </p>
        </div>

        {/* Big Editorial Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center relative my-auto">
          
          {/* ════ LEFT COLUMN: Humble & Attractive Headline + Description + CTA ════ */}
          <div className="lg:col-span-5 z-20 space-y-4 sm:space-y-4.5 max-w-xl">
            {/* Humble, Attractive Headline */}
            <h1 className="font-display font-black tracking-[-0.03em] uppercase text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-[4.2rem] leading-[0.96] text-[#fbf5ee] drop-shadow-sm">
              PURE TRADITION,<br />
              <span className="text-[#f6d7b0]">CRAFTED WITH CARE.</span>
            </h1>

            {/* Humble & Inviting Description Text */}
            <p className="text-[#d8e5e7]/85 font-sans text-xs sm:text-sm md:text-[14.5px] leading-relaxed max-w-lg font-normal">
              We gently cold-press our oils and harvest wild honey with honest ingredients and ancestral patience — bringing wholesome, chemical-free nourishment to your family’s table.
            </p>

            {/* Warm, Welcoming CTA Button + Trust pill */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-[#cb5127] hover:bg-[#b0401b] text-white font-bold tracking-wider uppercase text-xs sm:text-sm px-7 sm:px-8 py-3 rounded-xl border border-white/20 shadow-xl shadow-[#cb5127]/30 transition-all duration-300 hover:scale-[1.03] active:scale-95 group"
              >
                <span>Explore Our Harvest</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-xs text-[#f6d7b0]">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-medium">100% Traditional &amp; Lab-Tested</span>
              </div>
            </div>

            {/* Mini active product benefit badges */}
            <div className="pt-1 flex items-center gap-3 text-xs text-white/60">
              <div className="flex items-center gap-1.5 text-amber-300">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold text-white text-xs">{current.rating}</span>
                <span className="text-white/40">/5 Rating</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-white/70 font-medium">Pan-India Express Delivery</span>
            </div>
          </div>

          {/* ════ CENTER & RIGHT: Product Centerpiece + Rotating Pin Badge (Clean Background) ════ */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[260px] sm:min-h-[300px] lg:min-h-[350px]">
            
            {/* ── Central Hero Product Showcase ── */}
            <div className="relative z-10 w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[320px] h-[240px] sm:h-[280px] lg:h-[320px] flex items-center justify-center group">
              
              {/* Product reflection / shadow on the ground */}
              <div className="absolute bottom-2 w-3/4 h-8 bg-black/50 blur-xl rounded-full scale-y-50 pointer-events-none" />

              {/* Central Product Image with keyframe floating & transition */}
              <div className="relative w-full h-full p-2 flex items-center justify-center transition-all duration-700 ease-out transform group-hover:scale-105">
                <Link href={`/shop/${current.slug}`} className="relative w-full h-full block">
                  <Image
                    src={current.image_url}
                    alt={current.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 260px, 320px"
                    className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.65)] filter transition-all duration-700"
                  />
                </Link>
              </div>

              {/* Active Product Name Float Pill */}
              <div className="absolute top-4 left-0 sm:left-2 z-20 bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10.5px] font-black uppercase tracking-wider text-[#fbf5ee]">
                  {current.highlightTag}
                </span>
                <span className="text-[10px] text-white/50">|</span>
                <span className="text-[10.5px] font-bold text-amber-300">
                  ₹{current.price}
                </span>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                THE CALLOUT POINTER LINE & ROTATING CIRCULAR STAMP BADGE
                (Directly adapted from the reference image)
            ═══════════════════════════════════════════════════════════════ */}
            <div className="absolute -bottom-2 right-0 sm:right-2 lg:bottom-0 lg:right-4 z-30 flex items-center">
              
              {/* Angled Leader Line (Hidden on tiny mobile, visible sm+) */}
              <svg
                className="hidden sm:block absolute right-[105px] bottom-[55px] w-[150px] h-[75px] pointer-events-none"
                viewBox="0 0 150 75"
                fill="none"
              >
                {/* Pointer line connecting from the product out to the badge */}
                <path
                  d="M 10 15 L 60 58 L 145 58"
                  stroke="#cb5127"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="15" r="4" fill="#cb5127" />
              </svg>

              {/* The Circular Stamp Badge */}
              <div className="relative group/badge">
                <div
                  onClick={handleQuickAdd}
                  className="cursor-pointer relative w-[115px] h-[115px] sm:w-[130px] sm:h-[130px] rounded-full p-2 flex items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background: 'radial-gradient(circle, rgba(203,81,39,0.92) 0%, rgba(158,54,18,0.98) 100%)',
                    boxShadow: '0 10px 30px rgba(203,81,39,0.4), 0 0 0 2px rgba(255,255,255,0.2)',
                  }}
                  title="Click to Add to Cart"
                >
                  {/* Rotating Circular Text SVG */}
                  <svg
                    viewBox="0 0 160 160"
                    className="absolute inset-0 w-full h-full animate-[spin_18s_linear_infinite] select-none pointer-events-none"
                  >
                    <path
                      id="badgeCirclePath"
                      d="M 80, 80 m -62, 0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0"
                      fill="transparent"
                    />
                    <text
                      className="text-[10px] font-black uppercase tracking-[0.22em] fill-white"
                      style={{ letterSpacing: '0.22em' }}
                    >
                      <textPath href="#badgeCirclePath" startOffset="0%">
                        {current.badgeText}
                      </textPath>
                    </text>
                  </svg>

                  {/* Inner Circular Cutout with Product Thumbnail */}
                  <div className="relative w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-full bg-white/95 p-1.5 shadow-inner overflow-hidden flex items-center justify-center group-hover/badge:bg-white transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={current.image_url}
                      alt={current.name}
                      className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover/badge:scale-110"
                    />

                    {/* Quick Add Overlay on Badge Hover */}
                    <div className="absolute inset-0 bg-[#cb5127]/90 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover/badge:opacity-100 transition-opacity duration-200">
                      {addedAnimation ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <>
                          <Plus className="w-5 h-5 text-white stroke-[2.5]" />
                          <span className="text-[8px] font-black uppercase tracking-wider">ADD</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating Price Pill underneath badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#fbf5ee] whitespace-nowrap shadow-md flex items-center gap-1">
                  <span>₹{current.price}</span>
                  <span className="text-[8px] text-[#f6d7b0] font-normal">({current.weight})</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ═══════════════════════════════════════════════════════════════
            TOP PRODUCTS INTERACTIVE SWITCHER BAR (Always visible above fold)
            Customers can click between our 5 top products seamlessly
        ═══════════════════════════════════════════════════════════════ */}
        <div className="mt-2 pt-2.5 sm:pt-3 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#cb5127]" />
            <span className="text-[11px] font-black tracking-widest uppercase text-[#f6d7b0]">
              Featured Top Products:
            </span>
          </div>

          {/* Product selector buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {TOP_PRODUCTS.map((prod, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={prod.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`group relative text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-white/15 text-white border-[#cb5127] shadow-md shadow-[#cb5127]/20 scale-[1.02]'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      isActive ? 'bg-[#cb5127]' : 'bg-white/30 group-hover:bg-white/60'
                    }`}
                  />
                  <span className="whitespace-nowrap font-medium text-[11px]">
                    0{idx + 1}. {prod.shortTitle}
                  </span>
                  <span className={`text-[10px] ${isActive ? 'text-amber-300 font-bold' : 'text-white/40'}`}>
                    ₹{prod.price}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick link to all shop */}
          <Link
            href="/shop"
            className="text-[11px] font-bold text-[#f6d7b0] hover:text-white transition-colors flex items-center gap-1 group whitespace-nowrap"
          >
            <span>All 50+ Products</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}

