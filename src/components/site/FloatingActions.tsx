import { useEffect, useState } from "react";
import { X, CalendarCheck, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "919061565999";
const WHATSAPP_DISPLAY = "+91 90615 65999";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi D'Casa Homes, I'd like to discuss building my home in Kerala.",
)}`;

export function WhatsAppButton() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with D'Casa Homes on WhatsApp at ${WHATSAPP_DISPLAY}`}
      className={`group fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full border border-palm/30 bg-palm px-4 py-3 text-ivory shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)] transition-all duration-[900ms] ease-out hover:gap-4 hover:bg-palm/90 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <MessageCircle size={20} strokeWidth={1.6} />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs tracking-[0.14em] opacity-0 transition-all duration-700 ease-out group-hover:max-w-[12rem] group-hover:opacity-100 md:max-w-[12rem] md:opacity-100">
        {WHATSAPP_DISPLAY}
      </span>
    </a>
  );
}

export function ConsultationPopup() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("dcasa-consult-seen")) return;
    const t = setTimeout(() => {
      setMounted(true);
      sessionStorage.setItem("dcasa-consult-seen", "1");
      requestAnimationFrame(() => setVisible(true));
    }, 12000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(() => setMounted(false), 900);
  };

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted]);

  if (!mounted) return null;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (!data["name"]?.trim() || !data["phone"]?.trim()) {
      toast("Please share your name and phone number.");
      return;
    }
    close();
    toast("Thank you — our team will call you to confirm your consultation.");
  };

  const field =
    "w-full border-b border-teak/25 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/45 focus:border-teak focus:outline-none transition-colors duration-500";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book a consultation"
      className={`fixed inset-0 z-50 flex items-center justify-center px-5 transition-opacity duration-[900ms] ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
      />
      <div
        className={`relative w-full max-w-lg overflow-hidden border border-teak/20 bg-charcoal text-ivory shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] transition-all duration-[1100ms] ease-out ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-[0.97] opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close consultation popup"
          className="absolute right-4 top-4 text-ivory/60 transition-colors duration-500 hover:text-terracotta"
        >
          <X size={18} strokeWidth={1.4} />
        </button>

        <div className="px-8 py-10 md:px-10">
          <p className="eyebrow">Free consultation</p>
          <h2 className="mt-5 font-display text-3xl leading-[1.1] md:text-4xl">
            Let&rsquo;s plan <span className="italic text-teak">your Kerala home.</span>
          </h2>
          <p className="mt-4 text-sm leading-loose text-ivory/65">
            A 30-minute conversation with our architects — site, budget, roof form and interiors.
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-6">
            <input name="name" className={field} placeholder="Your name" aria-label="Your name" />
            <input
              name="phone"
              className={field}
              placeholder="Phone number"
              aria-label="Phone number"
              inputMode="tel"
            />
            <input
              name="location"
              className={field}
              placeholder="Plot location (optional)"
              aria-label="Plot location"
            />
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 border border-teak/40 bg-teak/15 px-6 py-3 text-xs tracking-[0.16em] uppercase text-ivory transition-colors duration-500 hover:bg-teak/30"
              >
                <CalendarCheck size={16} strokeWidth={1.5} />
                Book consultation
              </button>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase text-ivory/70 transition-colors duration-500 hover:text-palm"
              >
                <MessageCircle size={16} strokeWidth={1.5} />
                WhatsApp {WHATSAPP_DISPLAY}
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
