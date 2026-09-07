export function CurvedBadge({
  text = "VEHICLE GUIDES · SPARES · WORKSHOPS · MOTORING ·",
}: {
  text?: string;
}) {
  return (
    <div className="curved-badge" aria-hidden="true">
      <svg viewBox="0 0 180 180">
        <defs>
          <path id="curve" d="M25 90a65 65 0 1 1 130 0a65 65 0 1 1-130 0" />
        </defs>
        <text>
          <textPath href="#curve">{text}</textPath>
        </text>
        <circle cx="90" cy="90" r="3" />
        <path d="M90 66v48M66 90h48" />
      </svg>
    </div>
  );
}
