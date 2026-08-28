/** A brass tack, drawn rather than dotted. The head gets a specular hotspot
 *  and a terminator so it reads as a sphere lit from the upper left; the shaft
 *  disappears under the head; the drop shadow lands down-right of the light.
 *  A flat circle is the tell that a "physical" card is a CSS costume. */
export function PushPin({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <radialGradient id="pinHead" cx="34%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#f6e6c0" />
          <stop offset="38%" stopColor="#d9b26a" />
          <stop offset="78%" stopColor="#9a7638" />
          <stop offset="100%" stopColor="#6d5227" />
        </radialGradient>
        <linearGradient id="pinShaft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7a6a57" />
          <stop offset="45%" stopColor="#c9bda9" />
          <stop offset="100%" stopColor="#6b5c49" />
        </linearGradient>
        <filter id="pinCast" x="-60%" y="-60%" width="240%" height="240%">
          <feDropShadow
            dx="1.1"
            dy="2.2"
            stdDeviation="1.5"
            floodColor="#2a1b3d"
            floodOpacity="0.42"
          />
        </filter>
      </defs>

      <g filter="url(#pinCast)">
        {/* Shaft, angled so the pin looks pushed in rather than resting on top */}
        <path d="M11 9.5 L12.4 16.6 L11 18.4 L9.6 16.6 Z" fill="url(#pinShaft)" />
        <circle cx="11" cy="8.4" r="6.1" fill="url(#pinHead)" />
        {/* Specular hotspot */}
        <ellipse cx="8.7" cy="6.1" rx="2.1" ry="1.5" fill="#fff8e6" opacity="0.75" />
        {/* Rim light along the shadowed edge keeps it from going muddy */}
        <path
          d="M15.9 10.9a6.1 6.1 0 0 1-8.6 2.4"
          stroke="#f0d9a4"
          strokeOpacity="0.35"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
