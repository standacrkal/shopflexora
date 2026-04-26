import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Star, Truck, ShieldCheck, Headphones, Loader2, Check, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import beforeAfterImg from "@/assets/before-after.png";
import sizeChartImg from "@/assets/size-chart.png";
import productBlackExploded from "@/assets/product-black-exploded.jpg";
import productWhiteExploded from "@/assets/product-white-exploded.jpg";
import productOnLeg from "@/assets/product-on-leg.png";
import productFeatures from "@/assets/product-features.png";
import productBike from "@/assets/product-bike.jpg";
import productPair from "@/assets/product-pair.jpg";
import customerKneeInCar from "@/assets/customer-knee-in-car.png";
import customerKneeInHand from "@/assets/customer-knee-in-hand.png";
import customerKneeGym from "@/assets/customer-knee-gym.jpg";
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

  // Countdown timer (resets to 15 minutes on mount)
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const sizes = product?.options?.find((o: { name: string }) => o.name === "Size")?.values || [];
  const colors = product?.options?.find((o: { name: string }) => o.name === "Color")?.values || [];
  // Gallery — exact order as supplied
  const galleryImages = [
    { url: productBlackExploded, altText: "FlexLock Sleeve — black exploded view" },
    { url: productWhiteExploded, altText: "FlexLock Sleeve — white exploded view" },
    { url: productOnLeg, altText: "FlexLock Sleeve worn on leg" },
    { url: productFeatures, altText: "FlexLock Sleeve — features overview" },
    { url: productBike, altText: "FlexLock Sleeve in use on bike" },
    { url: productPair, altText: "FlexLock Sleeve — pair, black and white" },
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
    2: { total: 69.95, was: 159.80, savePct: 56, label: "Buy 2",            sub: "Both knees covered · Free Shipping" },
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
        <div id="product-top" className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-start">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
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
            <h1 className="font-display text-4xl md:text-5xl">FLEXLOCK SLEEVE</h1>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
              <span className="font-bold">4.8</span>
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

            {/* Countdown + Bundles */}
            <div className="mt-6">
              <div className="relative mb-3 flex flex-col items-center gap-2 rounded-xl border-2 border-[#ef4444] bg-[#fff5f5] px-4 py-4">
                <span className="absolute -right-2 -top-2 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground shadow-md">
                  <Flame className="h-3 w-3 fill-current" /> Special Offer
                </span>
                <div className="flex items-center gap-2 font-mono text-3xl font-bold tabular-nums tracking-widest text-[#7a1414]">
                  <span className="rounded bg-white px-3 py-1.5 shadow-inner">{mm}</span>
                  <span className="text-[#7a1414]/60">:</span>
                  <span className="rounded bg-white px-3 py-1.5 shadow-inner">{ss}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-[#7a1414]/20" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a1414]">50% OFF Today Only</span>
                  <div className="h-px w-8 bg-[#7a1414]/20" />
                </div>
              </div>
              <div className="space-y-2">
                {([1, 2, 3] as const).map((b) => {
                  const bp = bundlePrices[b];
                  const isMost = b === 2;
                  return (
                    <button
                      key={b}
                      onClick={() => setBundle(b)}
                      className={`relative flex w-full items-center justify-between rounded-xl border-2 bg-background text-left transition ${isMost ? "p-5" : "p-4"} ${bundle === b ? (isMost ? "border-accent shadow-md" : "border-foreground") : "border-border"}`}
                    >
                      {isMost && (
                        <span className="absolute -right-2 -top-2 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground shadow-md">
                          <Flame className="h-3 w-3 fill-current" /> Most Popular
                        </span>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${bundle === b ? "border-foreground" : "border-border"}`}>
                          {bundle === b && <div className="h-2.5 w-2.5 rounded-full bg-foreground" />}
                        </div>
                        <div>
                          <span className={`font-bold ${isMost ? "text-lg" : ""}`}>{bp.label}</span>
                          <div className="mt-0.5 text-xs text-muted-foreground">{bp.sub}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${isMost ? "text-lg" : ""}`}>${bp.total.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground line-through">${bp.was.toFixed(2)}</div>
                        {bp.savePct > 0 && <div className="mt-1 inline-block rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold text-accent-foreground">Save {bp.savePct}%</div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button onClick={handleAdd} disabled={cartLoading} className="mt-4 h-14 w-full rounded-full text-base font-bold">
              {cartLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : `Add to Cart — $${bundlePrices[bundle].total.toFixed(2)}`}
            </Button>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
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
                <li key={b} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" strokeWidth={3} />
                  <span>{b}</span>
                </li>
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
            <h2 className="font-display mt-3 text-5xl leading-[1.05]">
              <span className="inline-block pb-2">FROM <span className="underline-accent">PAIN</span></span>
              <br />
              <span className="inline-block">TO FREE.</span>
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
              { img: customerKneeInCar, quote: "After years of knee pain, I can finally hike again without stopping every 5 minutes. Total game changer.", rating: 5.0 },
              { img: customerKneeInHand, quote: "I'm a nurse on my feet 12 hours a day. This is the only brace that lasts the full shift without slipping.", rating: 5.0 },
              { img: customerKneeGym, quote: "Started cycling again after 8 months off. The dial compression is unlike anything I've tried before.", rating: 4.9 },
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
          <Button
            onClick={() => {
              document.getElementById("product-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            variant="secondary"
            className="mt-6 h-12 rounded-full px-8 font-bold text-primary"
          >
            Try it Risk-Free
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-center text-5xl">FAQ</h2>
          <Accordion type="single" collapsible className="mt-8 space-y-3">
            {[
              ["Can I wear it all day?", <><strong>Yes</strong>. The breathable material is designed for <strong>extended use</strong> without overheating or discomfort. Most customers wear it <strong>during daily activities</strong> and workouts comfortably.</>],
              ["Will it fit my knee size?", <>The sleeve is <strong>flexible and adapts</strong> to most leg shapes. Combined with the <strong>adjustable dial</strong>, you get a personalized fit every time.</>],
              ["Is it good for sports?", <><strong>Absolutely</strong>. It provides stability without <strong>restricting movement</strong>, making it ideal for running, gym workouts, cycling, and more.</>],
              ["Does it help with existing knee pain?", <><strong>Yes</strong>. The compression and <strong>patella support</strong> reduce strain and improve alignment, which helps <strong>relieve common</strong> knee discomfort.</>],
              ["How fast is shipping?", "We process orders within 24-72 hours and deliver them within 6-15 days depending on your location, with tracked shipment included for your convenience."],
              ["How do I get in contact?", <>You can message support by clicking the "<Link to="/contact" className="underline"><strong>Contact Us</strong></Link>" section on our store.</>],
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
