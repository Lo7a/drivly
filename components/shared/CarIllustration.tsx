export function CarIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Road / Ground reflection */}
      <ellipse cx="400" cy="340" rx="350" ry="20" fill="url(#roadGlow)" />

      {/* Car body - sleek sedan */}
      <g transform="translate(120, 80)">
        {/* Shadow under car */}
        <ellipse cx="280" cy="240" rx="220" ry="15" fill="hsl(192 80% 40% / 0.15)" />

        {/* Main body */}
        <path
          d="M80 180 L60 180 Q40 180 35 165 L30 150 Q28 140 35 135 L100 120 L180 80 Q200 70 230 65 L350 60 Q400 58 430 65 L480 80 Q500 90 510 110 L520 135 Q525 145 520 155 L515 170 Q510 180 495 180 L480 180"
          fill="url(#bodyGradient)"
          stroke="hsl(192 80% 50% / 0.4)"
          strokeWidth="1"
        />

        {/* Roof / Windows area */}
        <path
          d="M160 120 L200 80 Q210 72 230 68 L340 63 Q370 62 390 68 L430 80 L465 110 Q470 118 460 120 Z"
          fill="url(#windowGradient)"
          stroke="hsl(192 80% 60% / 0.3)"
          strokeWidth="0.5"
        />

        {/* Window divider */}
        <line x1="320" y1="65" x2="310" y2="120" stroke="hsl(192 80% 50% / 0.3)" strokeWidth="2" />

        {/* Front windshield highlight */}
        <path
          d="M345 67 L395 70 L440 85 L460 115 L325 118 Z"
          fill="hsl(192 80% 70% / 0.15)"
        />

        {/* Headlight */}
        <ellipse cx="505" cy="145" rx="12" ry="8" fill="hsl(192 80% 70% / 0.8)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="505" cy="145" rx="20" ry="12" fill="none" stroke="hsl(192 80% 60% / 0.3)" strokeWidth="1" />

        {/* Headlight glow */}
        <ellipse cx="530" cy="145" rx="30" ry="20" fill="hsl(192 80% 70% / 0.1)">
          <animate attributeName="rx" values="30;40;30" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.1;0.2;0.1" dur="2s" repeatCount="indefinite" />
        </ellipse>

        {/* Tail light */}
        <ellipse cx="50" cy="155" rx="8" ry="6" fill="hsl(0 80% 55% / 0.8)">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
        </ellipse>

        {/* Body line detail */}
        <path
          d="M70 150 Q200 142 350 140 Q450 139 510 145"
          fill="none"
          stroke="hsl(192 80% 60% / 0.2)"
          strokeWidth="1"
        />

        {/* Door handle */}
        <rect x="260" y="135" width="20" height="3" rx="1.5" fill="hsl(192 80% 60% / 0.3)" />

        {/* Front wheel */}
        <circle cx="420" cy="185" r="32" fill="hsl(220 30% 12%)" stroke="hsl(220 20% 25%)" strokeWidth="3" />
        <circle cx="420" cy="185" r="22" fill="hsl(220 20% 18%)" />
        <circle cx="420" cy="185" r="12" fill="hsl(220 15% 25%)" />
        <circle cx="420" cy="185" r="4" fill="hsl(192 80% 50% / 0.5)" />
        {/* Wheel spokes */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <line
            key={angle}
            x1="420"
            y1="185"
            x2={420 + 18 * Math.cos((angle * Math.PI) / 180)}
            y2={185 + 18 * Math.sin((angle * Math.PI) / 180)}
            stroke="hsl(220 15% 30%)"
            strokeWidth="2"
          />
        ))}

        {/* Rear wheel */}
        <circle cx="130" cy="185" r="32" fill="hsl(220 30% 12%)" stroke="hsl(220 20% 25%)" strokeWidth="3" />
        <circle cx="130" cy="185" r="22" fill="hsl(220 20% 18%)" />
        <circle cx="130" cy="185" r="12" fill="hsl(220 15% 25%)" />
        <circle cx="130" cy="185" r="4" fill="hsl(192 80% 50% / 0.5)" />
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <line
            key={`r${angle}`}
            x1="130"
            y1="185"
            x2={130 + 18 * Math.cos((angle * Math.PI) / 180)}
            y2={185 + 18 * Math.sin((angle * Math.PI) / 180)}
            stroke="hsl(220 15% 30%)"
            strokeWidth="2"
          />
        ))}
      </g>

      {/* Speed lines */}
      <g opacity="0.15">
        <line x1="50" y1="200" x2="110" y2="200" stroke="hsl(192 80% 50%)" strokeWidth="1.5">
          <animate attributeName="x1" values="20;50;20" dur="3s" repeatCount="indefinite" />
          <animate attributeName="x2" values="80;110;80" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="30" y1="220" x2="100" y2="220" stroke="hsl(192 80% 50%)" strokeWidth="1">
          <animate attributeName="x1" values="10;30;10" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="x2" values="70;100;70" dur="2.5s" repeatCount="indefinite" />
        </line>
        <line x1="60" y1="240" x2="120" y2="240" stroke="hsl(192 80% 50%)" strokeWidth="0.8">
          <animate attributeName="x1" values="40;60;40" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="x2" values="90;120;90" dur="3.5s" repeatCount="indefinite" />
        </line>
      </g>

      {/* Gradients */}
      <defs>
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(210 30% 20%)" />
          <stop offset="50%" stopColor="hsl(215 25% 25%)" />
          <stop offset="100%" stopColor="hsl(220 30% 18%)" />
        </linearGradient>
        <linearGradient id="windowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(192 60% 30% / 0.6)" />
          <stop offset="100%" stopColor="hsl(210 40% 20% / 0.8)" />
        </linearGradient>
        <radialGradient id="roadGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="hsl(192 80% 50% / 0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  );
}
