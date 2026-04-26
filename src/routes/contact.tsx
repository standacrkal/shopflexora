import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Flexora — Get in Touch" },
      { name: "description", content: "Questions, feedback, or order help? Our team responds within 24–48 hours." },
      { property: "og:title", content: "Contact Flexora" },
      { property: "og:description", content: "Reach our team — we respond within 24–48 hours." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState("Order question");
  const [emailError, setEmailError] = useState("");
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="font-display text-center text-5xl md:text-6xl">GET IN TOUCH</h1>
        <p className="mx-auto mt-6 max-w-md text-center text-sm text-muted-foreground">
          Questions, feedback, or order help? Fill out the form and our team will get back to you within 24–48 hours.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const emailValue = (form.elements.namedItem("email") as HTMLInputElement)?.value.trim();
            if (!emailValue) {
              setEmailError("Please enter your email");
              return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailValue)) {
              setEmailError("Please enter a valid email");
              return;
            }
            setEmailError("");
            setSubmitting(true);
            setTimeout(() => {
              setSubmitting(false);
              toast.success("Thanks! We'll be in touch shortly.");
              form.reset();
              setSubject("Order question");
            }, 600);
          }}
          className="mt-12 space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input className="h-14 rounded-xl" placeholder="Name" name="name" />
            <div>
              <Input
                className={`h-14 rounded-xl ${emailError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                placeholder="Email *"
                type="email"
                name="email"
                onChange={() => emailError && setEmailError("")}
              />
              {emailError && (
                <p className="mt-1 pl-2 text-xs text-destructive">{emailError}</p>
              )}
            </div>
          </div>
          <Input className="h-14 rounded-xl" placeholder="Phone number" name="phone" />
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="h-14 rounded-xl text-base data-[placeholder]:text-muted-foreground">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Order question">Order question</SelectItem>
              <SelectItem value="Refund">Refund</SelectItem>
              <SelectItem value="Shipping">Shipping</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" name="subject" value={subject} />
          <Textarea className="min-h-[160px] rounded-xl" placeholder="Comment" name="comment" />
          <Button disabled={submitting} className="h-14 w-full rounded-full text-base font-bold">
            {submitting ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </section>
  );
}
