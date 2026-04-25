import React from 'react';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`logo-container ${className}`}>
        <a href="/" title="Trang chủ Hey! Si Mì - Thần số học">
            <img src="https://lh3.googleusercontent.com/d/1-raB1Rp7zS96sofO9BHv8EMw35L7KOME" 
                 alt="Hey! Si Mì Thần số học Logo" 
                 width="250" 
                 height="100" 
                 loading="lazy"
                 className="drop-shadow-md"
                 onError={(e) => {
                   // Fallback if image fails
                   (e.target as HTMLImageElement).style.display = 'none';
                 }}
            />
        </a>
    </div>
  );
}
