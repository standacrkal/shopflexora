import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Star, Truck, ShieldCheck, Headphones, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import beforeAfterImg from "@/assets/before-after.png";
import sizeChartImg from "@/assets/size-chart.png";
import kneeExploded from "@/assets/knee-exploded.jpg";
import kneeInHand from "@/assets/knee-in-hand.png";
import kneeInCar from "@/assets/knee-in-car.png";
import kneeGym from "@/assets/knee-gym.jpg";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.handle === "flexlock-sleeve" ? "FlexLock Sleeve" : "Product"} — Flexora` },
      { name: "description", content: "FlexLock Sleeve — precision knee support without the bulk. 50% off today." },
      { property: "og:title", content: "FlexLock Sleeve — Flexora" },
      { property: "og:description", content: "Precision knee support. From pain to free." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", handle],
    queryFn: async () => (await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle }))?.data?.product,
  });

  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const cartLoading = useCartStore((s) => s.isLoading);

  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [bundle, setBundle] = useState<1 | 2 | 3>(1);
  const [activeImg, setActiveImg] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const sizes = product?.options?.find((o: { name: string }) => o.name === "Size")?.values || [];
  const colors = product?.options?.find((o: { name: string }) => o.name === "Color")?.values || [];
  // Use the user-supplied product images for the gallery (matches design mockup)
  const galleryImages = [
    { url: kneeExploded, altText: "FlexLock Sleeve — exploded view" },
    { url: kneeInHand, altText: "FlexLock Sleeve in hand" },
    { url: kneeInCar, altText: "FlexLock Sleeve detail" },
  ];

  const variant = useMemo(() => {
    if (!product) return null;
    return product.variants.edges
      .map((e: { node: { id: string; title: string; availableForSale: boolean; price: { amount: string; currencyCode: string }; compareAtPrice: { amount: string } | null; selectedOptions: { name: string; value: string }[] } }) => e.node)
      .find((v: { selectedOptions: { name: string; value: string }[] }) =>
        v.selectedOptions.find((o) => o.name === "Size")?.value === size &&
        v.selectedOptions.find((o) => o.name === "Color")?.value === color
      );
  }, [product, size, color]);

  const price = variant ? parseFloat(variant.price.amount) : 39.95;
  const compareAt = variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : 79.9;

  // Bundles per design mockup: Buy 1 = $39.95, Buy 2 = $69.90 (save 56%), Buy 3 = $126.95 (save 60%)
  const bundlePrices: Record<1 | 2 | 3, { total: number; was: number; savePct: number; label: string; sub: string }> = {
    1: { total: 39.95, was: 79.90, savePct: 0,  label: "Buy 1",            sub: "One sleeve" },
    2: { total: 69.90, was: 159.80, savePct: 56, label: "Buy 2",            sub: "Both knees covered · Free Shipping" },
    3: { total: 126.95, was: 319.60, savePct: 60, label: "Buy 3, Get 1 FREE", sub: "Best value · Free Shipping" },
  };

  const handleAdd = async () => {
    if (!variant) {
      toast.error("Please select size and color");
      return;
    }
    for (let i = 0; i < bundle; i++) {
      await addItem({
        product: { node: product },
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions,
      });
    }
    setOpen(true);
  };

  if (isLoading || !product) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div>
      <section className="bg-background py-10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
              <img src={galleryImages[activeImg].url} alt={galleryImages[activeImg].altText ?? product.title} className="h-full w-full object-contain" />
            </div>
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {galleryImages.map((img, i) => (
                <button key={img.url} onClick={() => setActiveImg(i)} className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 ${i === activeImg ? "border-primary" : "border-transparent"}`}>
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">50% OFF Today Only</span>
            <h1 className="font-display mt-3 text-4xl md:text-5xl">FLEXLOCK SLEEVE</h1>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
              <span className="font-bold">4.9</span>
              <span className="text-muted-foreground">(3,500+ verified reviews)</span>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-accent">${price.toFixed(2)}</span>
              <span className="text-lg text-muted-foreground line-through">${compareAt.toFixed(2)}</span>
            </div>

            {/* Size */}
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {sizes.map((s: string) => (
                  <button key={s} onClick={() => setSize(s)} className={`h-10 min-w-[3rem] rounded-full border-2 px-4 text-sm font-bold ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}>{s}</button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="mt-2 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                Size guide — measure 5.5"/14cm above the kneecap.
              </button>
            </div>

            {/* Color */}
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider">Color & side</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {colors.map((c: string) => (
                  <button key={c} onClick={() => setColor(c)} className={`h-10 rounded-full border-2 px-4 text-xs font-semibold ${color === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Bundles */}
            <div className="mt-6 rounded-2xl border-2 border-foreground p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-foreground" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent">50% OFF Today Only</span>
                <div className="h-px flex-1 bg-foreground" />
              </div>
              <div className="space-y-2">
                {([1, 2, 3] as const).map((b) => {
                  const bp = bundlePrices[b];
                  const isMost = b === 2;
                  return (
                    <button
                      key={b}
                      onClick={() => setBundle(b)}
                      className={`relative flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition ${bundle === b ? (isMost ? "border-accent" : "border-foreground") : "border-border"} ${isMost ? "bg-accent/10" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${bundle === b ? "border-foreground" : "border-border"}`}>
                          {bundle === b && <div className="h-2.5 w-2.5 rounded-full bg-foreground" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{bp.label}</span>
                            {isMost && <span className="rounded bg-accent px-2 py-0.5 text-[9px] font-bold uppercase text-accent-foreground">Most Popular</span>}
                          </div>
                          <div className="mt-0.5 text-xs text-muted-foreground">{bp.sub}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${bp.total.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground line-through">${bp.was.toFixed(2)}</div>
                        {bp.savePct > 0 && <div className="mt-1 inline-block rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold text-accent-foreground">Save {bp.savePct}%</div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button onClick={handleAdd} disabled={cartLoading} className="mt-5 h-14 w-full rounded-full text-base font-bold">
              {cartLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : `Add to Cart — $${bundlePrices[bundle].total.toFixed(2)}`}
            </Button>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Truck className="h-3 w-3" /> Free Shipping</span>
              <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> 30-Day Guarantee</span>
              <span className="inline-flex items-center gap-1"><Headphones className="h-3 w-3" /> 24/7 Support</span>
            </div>

            <ul className="mt-6 space-y-2 text-sm">
              {[
                "Pain-free movement with total knee confidence",
                "All-day comfort without sweat or irritation",
                "Precision support for sport to your home",
                "Lightweight and flexible under clothing",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="bg-background py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-2xl">
            <img src={beforeAfterImg} alt="Before and after using FlexLock Sleeve" className="w-full object-cover" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">The difference</p>
            <h2 className="font-display mt-3 text-5xl leading-[1.15]">
              FROM <span className="underline-accent">PAIN</span>
              <br />
              <span className="mt-2 inline-block">TO FREE.</span>
            </h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-border p-5">
                <p className="text-xs font-bold text-muted-foreground">01 — Before FlexLock</p>
                <p className="mt-1 text-sm">Every step hurts. Every day movements limited. Stairs, downhill walks — all constant reminders.</p>
              </div>
              <div className="rounded-xl border border-border p-5">
                <p className="text-xs font-bold text-muted-foreground">02 — After FlexLock</p>
                <p className="mt-1 text-sm">Real support and alignment with confidence. Move more easily — so you can live more.</p>
              </div>
            </div>
            <Button onClick={handleAdd} className="mt-6 h-12 rounded-full px-8 font-bold">Get Yours — $39.95</Button>
          </div>
        </div>
      </section>

      {/* Stats panel */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <div className="space-y-8 text-center md:text-left">
            {[
              ["94%", "felt immediate knee stability when they first put it on"],
              ["87%", "said pain was reduced during movement within one week"],
              ["96%", "stayed active longer without pain compared to before"],
            ].map(([n, d]) => (
              <div key={n} className="mx-auto md:mx-0 md:max-w-md">
                <div className="font-display text-5xl">{n}</div>
                <p className="mt-2 text-sm text-primary-foreground/70">{d}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="flex aspect-[9/16] items-center justify-center rounded-2xl bg-primary-foreground/10 text-primary-foreground/40">
                <span className="text-2xl font-bold tracking-widest">VIDEO</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer images */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">Verified owners</p>
          <h2 className="font-display mt-3 text-5xl">CUSTOMERS <span className="underline-accent">LOVE IT</span></h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { img: kneeInCar, quote: "After years of knee pain, I can finally hike again without stopping every 5 minutes. Total game changer.", rating: 5.0 },
              { img: kneeInHand, quote: "I'm a nurse on my feet 12 hours a day. This is the only brace that lasts the full shift without slipping.", rating: 5.0 },
              { img: kneeGym, quote: "Started cycling again after 8 months off. The dial compression is unlike anything I've tried before.", rating: 4.9 },
            ].map((t) => (
              <div key={t.quote} className="overflow-hidden rounded-2xl bg-muted text-left">
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-yellow-400" />)}
                    </div>
                    <span className="text-xs font-bold">{t.rating.toFixed(1)}</span>
                  </div>
                  <p className="mt-2 text-sm text-foreground/80">"{t.quote}"</p>
                </div>
                <img src={t.img} alt="Customer photo of FlexLock Sleeve" className="aspect-[4/5] w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground/50">Risk-free purchase</p>
          <h2 className="font-display mt-3 text-4xl md:text-5xl">30-DAY MONEY-BACK<br />GUARANTEE</h2>
          <p className="mt-4 text-sm text-primary-foreground/60">Try the FlexLock Sleeve for 30 days. Not satisfied? Full refund, no questions asked.</p>
          <Button onClick={handleAdd} variant="secondary" className="mt-6 h-12 rounded-full px-8 font-bold text-primary">Try it Risk-Free</Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-center text-5xl">FAQ</h2>
          <Accordion type="single" collapsible className="mt-8 space-y-3">
            {[
              ["Can I wear it all day?", "Yes — the breathable knit is designed for all-day wear without irritation. Most customers wear it 8+ hours comfortably."],
              ["Will it fit my knee size?", "Sizes M–XXL fit knee circumferences from 13\" to 21\". Check the size chart for precise measurements."],
              ["Is it good for sports?", "Absolutely. The FlexLock provides patella stability for running, lifting, hiking, and field sports."],
              ["Does it help with existing knee pain?", "Many customers report significant relief, but always consult a medical professional for diagnosed conditions."],
              ["How fast is shipping?", "Orders ship within 24 hours. Delivery typically takes 3–5 business days in the US, 7–14 internationally."],
              ["How do I get in contact?", <span key="c">Visit our <Link to="/contact" className="underline">Contact page</Link> — we respond within 24–48 hours.</span>],
            ].map(([q, a], i) => (
              <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border border-border bg-background px-5">
                <AccordionTrigger className="text-left text-base font-bold text-foreground hover:no-underline">{q as string}</AccordionTrigger>
                <AccordionContent className="text-sm text-foreground/75">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Size Guide Modal */}
      <Dialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-background">
          <DialogTitle className="sr-only">How to Measure</DialogTitle>
          <img src={sizeChartImg} alt="How to measure — size chart" className="h-auto w-full" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
