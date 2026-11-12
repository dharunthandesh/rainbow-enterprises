'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Leaf, Check } from 'lucide-react';
import { Product } from '@/lib/supabase';
import { useCart } from '@/store/useCart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  variants?: Product[];
}

export function ProductCard({ product, variants = [] }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();
  
  // Sort variants by price/size if list is provided, to keep it ordered
  const sortedVariants = [...variants].sort((a, b) => a.price - b.price);
  
  // If the passed product is not in the variants, add it
  const allVariants = sortedVariants.length > 0 
    ? sortedVariants 
    : [product];

  const [activeVariant, setActiveVariant] = useState<Product>(product);
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync state with prop product changes during render
  const [prevProductId, setPrevProductId] = useState(product.id);
  if (product.id !== prevProductId) {
    setPrevProductId(product.id);
    const matchingVariant = allVariants.find(v => v.id === product.id) || allVariants[0] || product;
    setActiveVariant(matchingVariant);
    setHoveredImageIndex(0);
  }

  // Determine which images to display
  const displayImages = activeVariant.images && activeVariant.images.length > 0
    ? activeVariant.images
    : activeVariant.image_url
      ? [activeVariant.image_url]
      : [];

  // When hovering on product card: switch images every 5 seconds (5000ms)
  useEffect(() => {
    if (isHovering && displayImages.length > 1) {
      // Advance to second image right on hover if starting on first
      setHoveredImageIndex((prev) => (prev === 0 ? 1 : prev));

      // Calm, elegant 5-second slideshow interval
      intervalRef.current = setInterval(() => {
        setHoveredImageIndex((prev) => (prev + 1) % displayImages.length);
      }, 5000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setHoveredImageIndex(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovering, displayImages.length]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(activeVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
    toast({
      title: 'Added to Cart',
      description: `${activeVariant.name} (${activeVariant.weight}) has been added.`,
    });
  };

  const discount = activeVariant.original_price
    ? Math.round(((activeVariant.original_price - activeVariant.price) / activeVariant.original_price) * 100)
    : 0;
  const savings = activeVariant.original_price
    ? activeVariant.original_price - activeVariant.price
    : 0;

  const currentImage = displayImages[hoveredImageIndex] || displayImages[0] || '';

  return (
    <div className="group relative bg-card border border-border/80 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full select-none">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        {discount > 0 ? (
          <span className="bg-[#cb5127] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
            {discount}% OFF
          </span>
        ) : (
          <span className="bg-primary/90 text-primary-foreground text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
            100% Pure
          </span>
        )}

        {/* Multi-angle count badge */}
        {displayImages.length > 1 && (
          <span className="bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {hoveredImageIndex + 1}/{displayImages.length}
          </span>
        )}
      </div>

      {/* Product Image */}
      {currentImage ? (
        <Link
          href={`/shop/${activeVariant.slug}`}
          className="relative w-full pt-[100%] bg-gradient-to-b from-stone-50/50 to-stone-100/50 dark:from-stone-900/20 dark:to-stone-950/20 block overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setHoveredImageIndex(0);
          }}
        >
          {/* Render all images stacked with smooth crossfade */}
          {displayImages.map((img, idx) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img}
              src={img}
              alt={`${activeVariant.name} - view ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-contain p-4 transition-all duration-700 ease-out ${
                idx === hoveredImageIndex
                  ? 'opacity-100 scale-105'
                  : 'opacity-0 scale-100 pointer-events-none'
              }`}
            />
          ))}

          {/* Modern Elongated Dash Indicators for 5-second image carousel */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 py-1 px-2.5 rounded-full bg-black/35 backdrop-blur-xs">
              {displayImages.map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setHoveredImageIndex(idx);
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setHoveredImageIndex(idx);
                  }}
                  aria-label={`View image ${idx + 1}`}
                  className={`block rounded-full transition-all duration-500 ${
                    idx === hoveredImageIndex
                      ? 'w-5 h-1.5 bg-white shadow-xs'
                      : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          )}
        </Link>
      ) : (
        <Link href={`/shop/${activeVariant.slug}`} className="relative w-full pt-[100%] bg-gradient-to-br from-[#1e3b26]/5 to-[#b08953]/10 block overflow-hidden border-b border-border">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center select-none">
            <div className="w-14 h-14 rounded-full bg-[#1e3b26]/10 flex items-center justify-center text-[#1e3b26] mb-3 group-hover:scale-110 group-hover:bg-[#1e3b26]/20 transition-all duration-300">
              <Leaf className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-black tracking-widest text-[#b08953] uppercase leading-none">
              100% Organic
            </span>
            <span className="text-[11px] font-extrabold text-[#1e3b26]/60 mt-1 uppercase max-w-[85%] line-clamp-1">
              Pure Traditional
            </span>
          </div>
        </Link>
      )}

      {/* Info & Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block">
              {activeVariant.weight} Pack
            </span>
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                <Star className="h-3.5 w-3.5 fill-current" />
              </div>
              <span className="text-xs font-bold text-foreground">4.8</span>
              <span className="text-[10px] text-muted-foreground font-medium">(120+)</span>
            </div>
          </div>

          <Link href={`/shop/${activeVariant.slug}`}>
            <h3 className="font-bold text-base sm:text-[17px] hover:text-primary transition-colors line-clamp-1 leading-snug">
              {activeVariant.name}
            </h3>
          </Link>

          {/* Size / Weight Selector Toggles */}
          {allVariants.length > 1 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {allVariants.map((v) => (
                <button
                  key={v.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveVariant(v);
                  }}
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border transition-all ${
                    activeVariant.id === v.id
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs font-extrabold scale-[1.02]'
                      : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {v.weight}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Cart Button */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-primary">
                ₹{activeVariant.price.toFixed(0)}
              </span>
              {activeVariant.original_price && (
                <span className="text-xs text-muted-foreground line-through font-semibold">
                  ₹{activeVariant.original_price.toFixed(0)}
                </span>
              )}
            </div>
            {savings > 0 && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                Save ₹{savings.toFixed(0)}
              </span>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            size="sm"
            className={`rounded-xl px-3.5 transition-all duration-300 font-bold flex items-center gap-1.5 ${
              isAdded
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white scale-105'
                : 'bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4" />
                <span className="text-xs">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">Add</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
