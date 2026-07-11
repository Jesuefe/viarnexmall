export function RouteLine() {
  return (
    <svg
      viewBox="0 0 1000 200"
      className="w-full h-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Trade route from Chinese factories to African doorsteps"
    >
      <path
        d="M40 160 C 220 40, 380 40, 500 100 S 780 180, 960 60"
        stroke="url(#routeGradient)"
        strokeWidth="2"
        className="route-path"
      />
      <defs>
        <linearGradient id="routeGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E8A33D" />
          <stop offset="50%" stopColor="#8E9AAC" />
          <stop offset="100%" stopColor="#2FA084" />
        </linearGradient>
      </defs>

      {/* Origin marker — factory */}
      <circle cx="40" cy="160" r="5" fill="#E8A33D" />
      <text x="40" y="185" fill="#8E9AAC" fontSize="13" fontFamily="var(--font-mono)" textAnchor="middle">
        Factory · ¥
      </text>

      {/* Waypoint — Skyjet warehouse */}
      <circle cx="500" cy="100" r="4" fill="#F7F5F1" />
      <text x="500" y="80" fill="#5B6B82" fontSize="12" fontFamily="var(--font-mono)" textAnchor="middle">
        Skyjet Warehouse
      </text>

      {/* Destination marker — doorstep */}
      <circle cx="960" cy="60" r="5" fill="#2FA084" />
      <text x="920" y="40" fill="#8E9AAC" fontSize="13" fontFamily="var(--font-mono)" textAnchor="middle">
        Doorstep · ₦
      </text>
    </svg>
  );
}
