export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 120 120" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Elegant J-shaped flower */}
      <g>
        {/* Stem forming J */}
        <path
          d="M 60 20 Q 60 50 60 70 Q 60 85 50 90 Q 40 95 30 85"
          stroke="#D4AF37"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Petals forming flower at top */}
        {/* Center */}
        <circle cx="60" cy="20" r="4" fill="#D4AF37" />
        
        {/* Pink petals */}
        <ellipse cx="60" cy="10" rx="6" ry="10" fill="#FAD4E8" opacity="0.9" />
        <ellipse cx="70" cy="15" rx="6" ry="10" fill="#FAD4E8" opacity="0.9" transform="rotate(45 60 20)" />
        <ellipse cx="70" cy="25" rx="6" ry="10" fill="#FAD4E8" opacity="0.9" transform="rotate(90 60 20)" />
        <ellipse cx="60" cy="30" rx="6" ry="10" fill="#FAD4E8" opacity="0.9" transform="rotate(135 60 20)" />
        <ellipse cx="50" cy="25" rx="6" ry="10" fill="#FAD4E8" opacity="0.9" transform="rotate(180 60 20)" />
        <ellipse cx="50" cy="15" rx="6" ry="10" fill="#FAD4E8" opacity="0.9" transform="rotate(225 60 20)" />
        
        {/* Accent petals in gold */}
        <ellipse cx="65" cy="12" rx="4" ry="7" fill="#D4AF37" opacity="0.6" transform="rotate(30 60 20)" />
        <ellipse cx="55" cy="12" rx="4" ry="7" fill="#D4AF37" opacity="0.6" transform="rotate(-30 60 20)" />
      </g>
    </svg>
  );
}
