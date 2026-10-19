import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logoLight from "@/assets/D'casa.png";
import { HouseThemeSwitch } from "./HouseTheme";
import { KasavuBand } from "./Ornaments";

const NAV = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Our Approach", href: "#approach" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,padding,box-shadow] duration-700",
        solid
          ? "bg-charcoal/85 py-1 shadow-[0_1px_24px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          : "bg-gradient-to-b from-charcoal/70 via-charcoal/25 to-transparent py-2"
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 md:px-10">
        <a
          href="#top"
          aria-label="D'Casa Homes — home"
          className="inline-flex shrink-0 animate-hero-rise items-center [animation-delay:80ms]"
        >
          <img
            src={logoLight}
            alt="D'Casa Homes"
            className={cn(
              "w-auto transition-all duration-700",
              solid ? "h-11 md:h-12" : "h-14 md:h-16"
            )}
          />
        </a>

        <nav
          className="hidden items-center gap-5 lg:flex xl:gap-8"
          aria-label="Primary"
        >
          {NAV.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              style={{ animationDelay: `${420 + i * 90}ms` }}
              className="relative animate-nav-in whitespace-nowrap text-[0.62rem] uppercase tracking-[0.16em] text-ivory/75 transition-colors duration-500 hover:text-teak xl:text-[0.68rem] xl:tracking-[0.18em]"
            >
              {item.label}
            </a>
          ))}

          <HouseThemeSwitch className="ml-1 animate-hero-rise [animation-delay:900ms]" />

          <a
            href="#contact"
            style={{
              animationDelay: `${420 + NAV.length * 90 + 120}ms`,
            }}
            className="ml-1 animate-hero-rise whitespace-nowrap border border-teak/45 px-4 py-2 text-[0.58rem] uppercase tracking-[0.2em] text-teak transition-colors duration-700 hover:bg-teak hover:text-charcoal xl:px-5"
          >
            Start a Project
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="text-ivory lg:hidden"
        >
          {open ? (
            <X size={22} strokeWidth={1.2} />
          ) : (
            <Menu size={22} strokeWidth={1.2} />
          )}
        </button>
      </div>

      {/* Kasavu gold trim along the lower edge */}
      <KasavuBand
        dark
        className={cn(
          "absolute inset-x-0 bottom-0 transition-opacity duration-700",
          solid ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        className={cn(
          "overflow-hidden bg-charcoal transition-[max-height,opacity] duration-700 lg:hidden",
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav
          className="flex flex-col gap-1 px-6 pb-10 pt-8"
          aria-label="Mobile"
        >
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-teak/12 py-4 font-display text-3xl text-ivory"
            >
              {item.label}
            </a>
          ))}

          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-8 border border-teak/45 px-6 py-4 text-center text-[0.7rem] uppercase tracking-[0.24em] text-teak"
          >
            Start a Project
          </a>

          <div className="mt-8 border-t border-teak/12 pt-8">
            <p className="mb-3 text-[0.55rem] uppercase tracking-[0.24em] text-ivory/45">
              House Theme
            </p>
            <HouseThemeSwitch tone="dark" compact />
          </div>
        </nav>
      </div>
    </header>
  );
}