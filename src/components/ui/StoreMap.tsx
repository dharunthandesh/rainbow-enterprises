'use client';

import React from 'react';
import { MapPin, Clock, Navigation, ExternalLink } from 'lucide-react';

// Rainbow Enterprises — physical store location
const STORE = {
  name: 'Rainbow Enterprises',
  address: 'S2, Second Floor, Vandikaran Street, West Mambalam, Chennai – 600033',
  lat: 13.0308828,
  lng: 80.2240753,
  mapsUrl:
    'https://www.google.com/maps/place/Harith+Garden+And+Pest+Clinic/@13.0308828,80.2240753,17z',
  // No API key needed — plain embed URL works via coordinates
  embedUrl:
    'https://maps.google.com/maps?q=13.0308828,80.2240753&z=16&t=&ie=UTF8&iwloc=&output=embed',
};

interface StoreMapProps {
  /** Height of the iframe; defaults to 420px */
  height?: number;
  /** Show the info bar above the map */
  showInfoBar?: boolean;
}

export function StoreMap({ height = 420, showInfoBar = true }: StoreMapProps) {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-[#e5d8c5]">
      {showInfoBar && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-[#1e3b26] px-5 py-4">
          {/* Store Info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#b08953]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="h-4.5 w-4.5 text-[#b08953]" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-white leading-tight">{STORE.name}</p>
              <p className="text-xs text-white/60 leading-snug mt-0.5 truncate">
                S2, Second Floor, Vandikaran Street,<br />West Mambalam, Chennai – 600033
              </p>
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-center gap-2 text-white/70 text-xs flex-shrink-0">
            <Clock className="h-3.5 w-3.5 text-[#b08953]" />
            <span>Mon – Sun &nbsp;·&nbsp; 9 AM – 9 PM</span>
          </div>

          {/* CTA */}
          <a
            href={STORE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#b08953] hover:bg-[#9a7540] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex-shrink-0"
          >
            <Navigation className="h-3.5 w-3.5" />
            Get Directions
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        </div>
      )}

      <div className="relative w-full" style={{ height }}>
        <iframe
          title="Rainbow Enterprises Store Location"
          src={STORE.embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
