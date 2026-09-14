'use client';

import React, { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

interface ArtisticImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'tall';
  exhibitNumber?: string;
  materialTag?: string;
}

export function ArtisticImage({
  src,
  alt,
  aspectRatio = 'portrait',
  exhibitNumber,
  materialTag,
  className = '',
  priority = false,
  fill = false,
  width,
  height,
  ...rest
}: ArtisticImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback visual generator: Sleek dark-mode SVG placeholder with "14K Specimen" text (PRD Requirement)
  const renderArtisticFallback = () => (
    <div className="relative w-full h-full min-h-[300px] bg-[#0C0C0E] overflow-hidden flex flex-col justify-between p-8 border border-zinc-800/60 select-none">
      {/* Editorial Grain & Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,202,151,0.1)_0%,rgba(10,10,12,0.95)_75%)]" />
      
      {/* Architectural Wireframe Sculpture */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <svg viewBox="0 0 200 200" className="w-48 h-48 animate-pulse text-zinc-400">
          <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.75" fill="none" strokeDasharray="3 3" />
          <ellipse cx="100" cy="100" rx="85" ry="35" stroke="currentColor" strokeWidth="1" fill="none" transform="rotate(-25 100 100)" />
          <ellipse cx="100" cy="100" rx="35" ry="85" stroke="currentColor" strokeWidth="0.5" fill="none" transform="rotate(35 100 100)" />
          <circle cx="100" cy="100" r="12" stroke="#E6CA97" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* Header Metadata */}
      <div className="relative z-10 flex justify-between items-start text-[10px] tracking-[0.25em] uppercase font-mono text-zinc-500">
        <span>{exhibitNumber || '14K SPECIMEN ARCHIVE'}</span>
        <span className="text-[#E6CA97]">14K CHAMPAGNE GOLD</span>
      </div>

      {/* Centerpiece Typographic Display */}
      <div className="relative z-10 my-auto text-center space-y-2">
        <p className="font-serif italic text-2xl text-zinc-200 tracking-wide">{alt}</p>
        <div className="w-8 h-[1px] bg-[#E6CA97]/50 mx-auto" />
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#E6CA97] font-mono">
          14K SPECIMEN // {materialTag || 'CHAMPAGNE GOLD & 925 SILVER'}
        </p>
      </div>

      {/* Archival Coordinates Footer */}
      <div className="relative z-10 flex justify-between items-end text-[9px] tracking-[0.2em] font-mono text-zinc-600">
        <span>MUMBAI • JAIPUR • PARIS</span>
        <span>BIS 925 CERTIFIED</span>
      </div>
    </div>
  );

  if (hasError || !src) {
    return renderArtisticFallback();
  }

  // Consistent editorial photography filter
  const editorialFilterClass = 'filter contrast-[1.08] saturate-[0.88] brightness-[0.98] transition-all duration-700 hover:contrast-[1.12] hover:saturate-[0.95]';

  return (
    <div className={`relative overflow-hidden bg-zinc-950 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-900 animate-pulse z-10" />
      )}

      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`${editorialFilterClass} object-cover w-full h-full ${
            isLoading ? 'opacity-0 scale-102' : 'opacity-100 scale-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
          {...rest}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width || 800}
          height={height || 1000}
          priority={priority}
          className={`${editorialFilterClass} object-cover w-full h-full ${
            isLoading ? 'opacity-0 scale-102' : 'opacity-100 scale-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
          {...rest}
        />
      )}

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/25 via-transparent to-black/10 mix-blend-multiply" />
    </div>
  );
}

export default ArtisticImage;
