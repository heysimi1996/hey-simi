import React from 'react';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`logo-container relative ${className}`}>
        {/* Ambient magical background circle for astrology vibes */}
        <div className="absolute inset-0 bg-brand-gold/10 blur-xl rounded-full scale-75 animate-pulse pointer-events-none" />
        
        <a href="/" title="Trang chủ Hey! Si Mì - Thần số học" className="relative z-10 block">
            <img src="https://lh3.googleusercontent.com/d/10IfkZiqW1gDoEthE18YBjII2XgInD7rY" 
                 alt="Hey! Si Mì Thần số học Logo" 
                 width="250" 
                 height="100" 
                 loading="lazy"
                 className="drop-shadow-[0_4px_12px_rgba(197,160,89,0.35)] animate-cosmic-logo hover:scale-105 transition-transform duration-500"
                 onError={(e) => {
                   // Fallback if image fails
                   (e.target as HTMLImageElement).style.display = 'none';
                 }}
            />
        </a>
    </div>
  );
}
