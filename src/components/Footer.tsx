import { Link } from "@tanstack/react-router";
export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center">
        <div className="font-display text-3xl tracking-wider">FLEXORA</div>
        <p className="mt-3 text-sm text-primary-foreground/60">Move without limits.</p>
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm">
          <Link to="/" className="hover:text-accent">Home</Link>
          <Link to="/product/$handle" params={{ handle: "flexlock-sleeve" }} className="hover:text-accent">FlexLock Sleeve</Link>
          <Link to="/about" className="hover:text-accent">About Us</Link>
          <Link to="/contact" className="hover:text-accent">Contact</Link>
          <span className="text-primary-foreground/60">Shipping Policy</span>
          <span className="text-primary-foreground/60">Refund Policy</span>
          <span className="text-primary-foreground/60">Privacy Policy</span>
          <span className="text-primary-foreground/60">Terms of Service</span>
        </nav>
        <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-xs text-primary-foreground/40">
          © 2026 Flexora. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
