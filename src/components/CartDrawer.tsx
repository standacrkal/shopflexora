import { useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Loader2, Truck } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export function CartDrawer() {
  const { items, isOpen, isLoading, isSyncing, setOpen, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);

  const subtotal = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const FREE_SHIP = 45;
  const remaining = Math.max(0, FREE_SHIP - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP) * 100);
  const currency = items[0]?.price.currencyCode || "USD";

  const checkout = () => {
    const url = getCheckoutUrl();
    if (url) { window.open(url, "_blank"); setOpen(false); }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border p-6">
          <SheetTitle className="text-2xl font-bold">Your cart</SheetTitle>
          {items.length > 0 && (
            <div className="mt-3">
              {remaining > 0 ? (
                <p className="text-center text-sm font-bold">Spend ${remaining.toFixed(2)} more to get <span className="text-accent">FREE shipping!</span></p>
              ) : (
                <p className="text-center text-sm font-bold text-accent">You unlocked free shipping! 🎉</p>
              )}
              <div className="relative mt-3 h-3 rounded-full bg-muted">
                <div className="absolute inset-y-0 left-0 stripe-bg rounded-full transition-all" style={{ width: `${progress}%` }} />
                <div
                  className="absolute -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-foreground bg-background transition-all"
                  style={{ left: `calc(${progress}% - 12px)` }}
                >
                  <Truck className="h-3 w-3" />
                </div>
              </div>
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-muted-foreground">Your cart is empty.</p>
          ) : (
            <div className="space-y-5">
              {items.map((item) => {
                const img = item.product.node.images?.edges?.[0]?.node?.url;
                const compareAtPrice = parseFloat(item.price.amount) * 2;
                return (
                  <div key={item.variantId} className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      {img && <img src={img} alt={item.product.node.title} className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <h4 className="font-bold">{item.product.node.title}</h4>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground line-through">${compareAtPrice.toFixed(2)}</div>
                          <div className="font-bold">${parseFloat(item.price.amount).toFixed(2)}</div>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.selectedOptions.map((o) => o.value).join(" / ")}
                      </p>
                      <div className="mt-auto flex items-center gap-3 pt-2">
                        <div className="flex items-center rounded-md border border-border">
                          <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="px-2 py-1 hover:bg-muted"><Minus className="h-3 w-3" /></button>
                          <span className="px-3 text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="px-2 py-1 hover:bg-muted"><Plus className="h-3 w-3" /></button>
                        </div>
                        <button onClick={() => removeItem(item.variantId)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-6">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-bold">Estimated total</span>
              <span className="text-lg font-bold">${subtotal.toFixed(2)} {currency}</span>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">Taxes included. Discounts and shipping calculated at checkout.</p>
            <Button onClick={checkout} disabled={isLoading || isSyncing} className="h-14 w-full rounded-full text-base font-bold">
              {isLoading || isSyncing ? <Loader2 className="h-5 w-5 animate-spin" /> : "Check out"}
            </Button>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {["VISA", "AMEX", "Pay", "G Pay", "Disc", "PayPal", "Shop", "MC"].map((p) => (
                <span key={p} className="flex h-6 min-w-[2.5rem] items-center justify-center rounded border border-border bg-background px-1.5 text-[9px] font-bold text-muted-foreground">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
