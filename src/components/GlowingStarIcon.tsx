import React from 'react';

interface GlowingStarIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const GlowingStarIcon: React.FC<GlowingStarIconProps> = ({ 
  className = "w-5 h-5", 
  size = 20,
  glow = true 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${glow ? 'glowing-star' : ''} ${className}`}
    >
      {/* 4-point / 5-point Gothic Y2K racing star */}
      <path 
        d="M12 1.5L14.7 8.3L22 9.5L16.8 14.8L18 22L12 18.5L6 22L7.2 14.8L2 9.5L9.3 8.3L12 1.5Z" 
        fill="#FFFFFF" 
        stroke="#FFFFFF" 
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Center radiant spark */}
      <circle cx="12" cy="12" r="1.5" fill="#000000" />
    </svg>
  );
};

export const StarBadge: React.FC<{ label: string; className?: string }> = ({ label, className = "" }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black border border-white/40 text-white font-mono text-[11px] shadow-[0_0_10px_rgba(255,255,255,0.2)] ${className}`}>
      <GlowingStarIcon size={12} />
      <span className="font-bold tracking-wider">{label}</span>
    </div>
  );
};
