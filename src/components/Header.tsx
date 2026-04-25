import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export function Header() {
  const totalItems = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const setOpen = useCartStore((s) => s.setOpen);
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-display text-2xl tracking-wider">FLEXORA</Link>
        <nav className="hidden items-center gap-2 md:flex">
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground" }}
              inactiveProps={{ className: "px-5 py-2 text-sm font-medium text-foreground hover:opacity-70" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button onClick={() => setOpen(true)} className="relative flex h-10 w-10 items-center justify-center rounded-md border border-border hover:bg-muted">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
