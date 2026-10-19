import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Reveal } from "./Reveal";

const schema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  message: z.string().min(10, "Tell us a little more about your project."),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function Enquiry() {
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const result = schema.safeParse(data);
    if (!result.success) {
      const next: Errors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof Errors;
        if (!next[key]) next[key] = issue.message;
      });
      setErrors(next);
      return;
    }
    setErrors({});
    e.currentTarget.reset();
    toast("Thank you — we'll be in touch shortly.");
  };

  const field =
    "w-full border-b border-teak/25 bg-transparent py-4 text-sm text-ivory placeholder:text-ivory/45 focus:border-teak focus:outline-none transition-colors duration-500";

  return (
    <section id="enquiry" className="bg-charcoal pb-24 pt-8 text-ivory">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <Reveal>
          <div className="grid gap-10 border-t border-teak/15 pt-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="eyebrow">Enquiry</p>
              <h2 className="mt-8 font-display text-4xl leading-[1.05] text-ivory md:text-5xl">
                Tell us about <span className="italic text-teak">your home.</span>
              </h2>
              <p className="mt-8 max-w-xs text-sm leading-loose text-ivory/65">
                Every residence begins with a conversation. Share a few details and we&rsquo;ll
                shape the possibilities together.
              </p>
            </div>

            <form onSubmit={onSubmit} noValidate className="lg:col-span-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="eyebrow !text-ivory/55">
                    Name
                  </label>
                  <input id="name" name="name" className={field} placeholder="Your full name" />
                  {errors.name && <p className="mt-2 text-xs text-teak-light">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="eyebrow !text-ivory/55">
                    Email
                  </label>
                  <input id="email" name="email" className={field} placeholder="you@email.com" />
                  {errors.email && <p className="mt-2 text-xs text-teak-light">{errors.email}</p>}
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="phone" className="eyebrow !text-ivory/55">
                    Phone (optional)
                  </label>
                  <input id="phone" name="phone" className={field} placeholder="Phone number" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="message" className="eyebrow !text-ivory/55">
                    Project
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className={field}
                    placeholder="What are you imagining?"
                  />
                  {errors.message && (
                    <p className="mt-2 text-xs text-teak-light">{errors.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="mt-10 border border-teak px-10 py-4 text-[0.7rem] uppercase tracking-[0.24em] text-teak transition-colors duration-500 hover:bg-teak hover:text-charcoal"
              >
                Send enquiry
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
