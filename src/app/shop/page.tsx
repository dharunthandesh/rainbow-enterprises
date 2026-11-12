'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, ChevronDown, X, Sparkles, Check } from 'lucide-react';
import { getCategories, mockCategories, mockProducts } from '@/lib/mockData';
import { Product } from '@/lib/supabase';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Initialize directly from sync mock — instant render, no async delay
  const [categories, setCategories] = useState<any[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState<Product[]>(mockProducts);

  // Background sync from Supabase (if configured) — updates silently after first paint
  useEffect(() => {
    getCategories().then((cats) => {
      if (cats && cats.length > 0) setCategories(cats);
    });
  }, []);

  // Update selected category based on searchParams url ?category=oils-ghee
  useEffect(() => {
    const categoryQuery = searchParams.get('category');
    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    } else {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  // Apply filters and sort
  useEffect(() => {
    let filtered = [...mockProducts];

    // Filter by Category slug
    if (selectedCategory !== 'all') {
      const matchedCat = categories.find((c) => c.slug === selectedCategory);
      if (matchedCat) {
        filtered = filtered.filter((p) => p.category_id === matchedCat.id);
      } else {
        // Fallback check if category is stored by slug in category_id for mockup
        filtered = filtered.filter((p) => p.category_id === selectedCategory);
      }
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // 'featured'
      filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    // Deduplicate by product name to show a single card per product
    const uniqueProducts: Product[] = [];
    const seenNames = new Set<string>();
    filtered.forEach((p) => {
      if (!seenNames.has(p.name)) {
        seenNames.add(p.name);
        uniqueProducts.push(p);
      }
    });

    setProducts(uniqueProducts);
  }, [selectedCategory, searchQuery, sortBy, categories]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    // Update URL query params without reloading page
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 select-none">
      {/* Modern Store Hero Banner */}
      <div className="text-center space-y-3 py-8 px-4 sm:px-6 bg-gradient-to-b from-[#1e3b26]/8 via-muted/30 to-background rounded-3xl border border-border/80 shadow-xs relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>100% Traditional &amp; Pure • Direct from Heritage Artisans</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-brand font-black text-[#1e3b26] tracking-tight">
          Our Heritage <span className="font-serif-elegant italic font-normal text-[#b08953] tracking-normal">Collection</span>
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Pure cold-pressed oils, bilona churned A2 cow ghee, raw cave honey, and nutritious ancient millets. Delivered fresh across India.
        </p>
      </div>

      {/* Top Quick-Category Filter Pills Bar (Instant 1-Click Filtering on Any Device) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
        <button
          onClick={() => handleCategorySelect('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 ${
            selectedCategory === 'all'
              ? 'bg-[#1e3b26] text-white border-[#1e3b26] shadow-sm'
              : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'
          }`}
        >
          <span>All Products</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'}`}>
            50+
          </span>
        </button>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#1e3b26] text-white border-[#1e3b26] shadow-sm'
                  : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Control Panel: Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card border border-border p-3.5 sm:p-4 rounded-2xl shadow-xs">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search oils, ghee, honey, millets..."
            className="w-full pl-10 pr-9 py-2.5 sm:py-3 bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Live Product Counter & Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xs font-bold text-muted-foreground">
            Showing <strong className="text-foreground">{products.length}</strong> items
          </span>
          <div className="relative w-44 sm:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <option value="featured">Best Selling</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(selectedCategory !== 'all' || searchQuery.trim() !== '') && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-muted-foreground font-semibold">Active filters:</span>
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              Category: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
              <button
                onClick={() => handleCategorySelect('all')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {searchQuery.trim() !== '' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              Query: &quot;{searchQuery}&quot;
              <button
                onClick={() => setSearchQuery('')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              router.push('/shop');
            }}
            className="text-xs text-muted-foreground hover:text-foreground font-semibold underline underline-offset-2 ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar & Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6 hidden lg:block">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs sticky top-28">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <SlidersHorizontal className="h-4.5 w-4.5 text-primary" />
              <h3 className="font-bold text-sm uppercase tracking-wider">All Categories</h3>
            </div>
            <div className="flex flex-col gap-1.5 select-none">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                onClick={() => handleCategorySelect('all')}
                className="justify-between rounded-xl text-xs font-bold w-full py-4"
              >
                <span>All Products</span>
                <span className="text-[10px] opacity-70">50+</span>
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.slug ? 'default' : 'ghost'}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className="justify-start rounded-xl text-xs font-bold w-full py-4 text-left"
                >
                  <span className="truncate">{cat.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="h-96 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-3">
              <p className="font-bold text-lg text-muted-foreground">No products found</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Try searching for something else or explore a different category.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  handleCategorySelect('all');
                }}
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl mt-2"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  variants={mockProducts.filter(v => v.name === product.name)} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground animate-pulse">Loading products store...</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
