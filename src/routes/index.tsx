import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, Truck, ShieldCheck, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-runner.jpg";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flexora — Move Freely Without Limits | FlexLock Knee Sleeve" },
      { name: "description", content: "The FlexLock Sleeve: precision knee support without the bulk. Train, work, and live without limits. 50% off today." },
      { property: "og:title", content: "Flexora — Move Freely Without Limits" },
      { property: "og:description", content: "Precision knee support without the bulk. 50% off today." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data } = useQuery({
    queryKey: ["product", "flexlock-sleeve"],
    queryFn: async () => (await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle: "flexlock-sleeve" }))?.data?.product,
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                <Star className="h-3 w-3 fill-current" /> 50% OFF TODAY ONLY
              </span>
              <span className="text-xs text-muted-foreground">Limited stock</span>
            </div>
            <h1 className="font-display mt-6 text-6xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
              MOVE FREELY<br />WITHOUT <span className="text-muted-foreground">LIMITS.</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground">
              The FlexLock Sleeve gives your knees the support they deserve — without the bulk. Train, work, and live without limits.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/product/$handle" params={{ handle: "flexlock-sleeve" }}>
                <Button className="h-14 rounded-full px-8 text-base font-bold">Shop FlexLock — $39.95</Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="h-14 rounded-full border-2 px-8 text-base font-bold">Why Flexora</Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4" /> Free shipping $45+</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> 30-day guarantee</span>
              <span className="inline-flex items-center gap-2"><Headphones className="h-4 w-4" /> 24/7 Support</span>
            </div>
          </div>
          <div className="relative">
            <img src={heroImg} alt="Athlete running with FlexLock knee sleeve" width={1280} height={1280} className="w-full rounded-2xl object-cover shadow-2xl" />
            <div className="absolute -bottom-4 left-8 rotate-[-8deg] rounded-full bg-accent px-5 py-2 text-sm font-black tracking-wider text-accent-foreground shadow-lg">
              SAVE 50%
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4">
          {[
            ["3,500+", "Happy customers"],
            ["4.8", "Average rating"],
            ["94%", "Felt relief within a week"],
            ["30", "Day money-back"],
          ].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="font-display text-4xl">{n}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-primary-foreground/60">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Built for real life */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">Why FlexLock works</p>
            <h2 className="font-display mt-3 text-5xl md:text-6xl">
              BUILT FOR <span className="underline-accent">REAL LIFE</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
              Not a generic brace. Engineered for people who need support without sacrifice.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              ["Adjustable Compression", "Precision dial lets you fine-tune support in seconds. Tighten or loosen without ever removing it."],
              ["Targeted Patella Stability", "Built-in guide aligns your kneecap precisely. Reduces strain, prevents unwanted movement."],
              ["All-Day Comfort", "Breathable knit fabric keeps you cool and dry. Wear it for hours without discomfort or irritation."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl bg-muted p-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three steps */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground/50">How it works</p>
          <h2 className="font-display mt-3 text-5xl md:text-6xl">
            THREE STEPS TO <span className="underline-accent">RELIEF</span>
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              ["01", "Slip It On", "Like a regular sleeve — no straps, no complicated setup. Position it comfortably over your knee."],
              ["02", "Dial Your Support", "Turn the precision dial to adjust compression exactly to your preference. Done in seconds."],
              ["03", "Move Freely", "Train, walk, work — the FlexLock moves with your body. Stable, comfortable, in control all day."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-2xl border border-primary-foreground/15 p-7">
                <div className="font-display text-4xl text-primary-foreground/30">{n}</div>
                <h3 className="mt-6 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm text-primary-foreground/60">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-muted p-10 md:flex-row md:items-center">
            <h3 className="font-display text-3xl md:text-4xl">YOUR KNEES HAVE WAITED<br />LONG ENOUGH.</h3>
            <div className="text-right">
              <Link to="/product/$handle" params={{ handle: "flexlock-sleeve" }}>
                <Button className="h-14 rounded-full px-8 text-base font-bold">Order Now — 50% Off</Button>
              </Link>
              <p className="mt-3 text-xs text-muted-foreground">Free shipping · 30-day guarantee · Limited stock</p>
            </div>
          </div>
        </div>
      </section>

      {/* hidden prefetch usage */}
      {data ? null : null}
    </div>
  );
}
