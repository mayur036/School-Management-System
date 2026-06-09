export const ProgressRing = ({ percentage = 0 }) => {
  const radius = 45;
  const stroke = 6;
  // Use radius - stroke to ensure the circle border fits completely within the SVG canvas without clipping
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;

  const validPercentage = isNaN(percentage) ? 0 : Math.max(0, Math.min(100, percentage));
  const strokeDashoffset = circumference - (validPercentage / 100) * circumference;

  const isCompleted = validPercentage === 100;
  const stopColor1 = isCompleted ? '#10b981' : 'hsl(var(--primary))'; // Emerald-500 or Primary Blue
  const stopColor2 = isCompleted ? '#059669' : '#2563eb'; // Emerald-600 or Blue-600 for gradient depth

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <svg
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
      >
        <defs>
          <linearGradient id="progressRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: stopColor1 }} />
            <stop offset="100%" style={{ stopColor: stopColor2 }} />
          </linearGradient>
        </defs>

        {/* Background circle (track) */}
        <circle
          stroke="hsl(var(--muted))"
          strokeOpacity={0.25}
          fill="none"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Foreground progress circle */}
        <circle
          stroke="url(#progressRingGradient)"
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      {/* Center Percentage Label - turns green-500 when completed */}
      <span
        className={`absolute text-sm font-bold tracking-tight ${
          isCompleted ? 'text-emerald-500' : 'text-foreground'
        }`}
      >
        {validPercentage}%
      </span>
    </div>
  );
};

export default ProgressRing;
