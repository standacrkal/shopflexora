export function Marquee() {
  const items = ["FREE SHIPPING ON ORDERS $45+", "50% OFF TODAY ONLY", "30-DAY MONEY-BACK GUARANTEE"];
  const repeated = Array.from({ length: 6 }, (_, i) => items[i % items.length]);
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[...repeated, ...repeated].map((t, i) => (
          <span key={i} className={t.includes("50%") ? "text-[oklch(0.62_0.22_27)]" : ""}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
