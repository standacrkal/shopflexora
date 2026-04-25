import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Flexora — Movement Should Feel Natural" },
      { name: "description", content: "We built Flexora for people who refuse to let knee pain define their limits." },
      { property: "og:title", content: "About Flexora" },
      { property: "og:description", content: "Movement should feel natural. Discover what drives us." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="font-display text-5xl leading-[0.95] md:text-7xl">
            MOVEMENT<br />SHOULD FEEL <span className="text-primary-foreground/40">NATURAL.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-sm text-primary-foreground/70">
            We built Flexora for the people who refuse to let knee pain define their limits.
          </p>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-lg">
            Too many people live with daily knee discomfort that quietly shrinks their world — fewer stairs climbed, workouts skipped, walks cut short.
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            We created the FlexLock Sleeve to change that. Not with a bulky, restrictive brace — but with precision support that moves with your body, not against it.
          </p>
        </div>
      </section>

      <section className="bg-background pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">Our values</p>
            <h2 className="font-display mt-3 text-5xl md:text-6xl">
              <span className="underline-accent">WHAT DRIVES US</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              ["01", "Precision Over Bulk", "Targeted alignment, adjustable compression, and a fit that respects your body."],
              ["02", "Designed for Real Life", "Training, recovery, work, or daily activity — FlexLock is there all day without reminding you."],
              ["03", "Backed by Our Guarantee", "30-day full refund, no questions. We're confident in what we make."],
              ["04", "Your Confidence Back", "We're not selling a product. We're giving people the confidence to move again."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-2xl border border-border p-8">
                <div className="font-display text-4xl text-muted-foreground/40">{n}</div>
                <h3 className="mt-6 text-xl font-bold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl bg-muted p-10 md:flex-row md:items-center">
            <h3 className="font-display text-3xl md:text-4xl">READY TO MOVE AGAIN?</h3>
            <div className="flex flex-col gap-3">
              <Link to="/product/$handle" params={{ handle: "flexlock-sleeve" }}>
                <Button className="h-12 w-64 rounded-full font-bold">Shop the FlexLock Sleeve</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="h-12 w-64 rounded-full border-2 font-bold">Get in Touch</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
