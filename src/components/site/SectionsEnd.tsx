import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Play, X, Youtube } from "lucide-react";
import { Reveal } from "./Reveal";
import logoAsset from "@/assets/dcasa-logo.png.asset.json";
import logoLightAsset from "@/assets/dcasa-logo-light.png.asset.json";

import { ThemeCover } from "./HouseTheme";
import { CarvedPattern, KasavuBand, LampDivider, TileEdge } from "./Ornaments";
import p01 from "@/assets/project-01.jpg";
import p01g from "@/assets/project-01-grey.jpg";
import p02 from "@/assets/project-02.jpg";
import p02g from "@/assets/project-02-grey.jpg";
import p04 from "@/assets/project-04.jpg";
import p04g from "@/assets/project-04-grey.jpg";
import p05 from "@/assets/project-05.jpg";
import p05g from "@/assets/project-05-grey.jpg";

const INSTAGRAM_URL = "https://www.instagram.com/reel/Da-Qg2PzeS4/?igsh=Z3A0bzVjemtldHFu";

const STATS = [
  { value: "10+", label: "Years of Experience" },
  { value: "—", label: "Homes Delivered" },
  { value: "—", label: "Happy Clients" },
  { value: "—", label: "Projects in Progress" },
];

export function Stats() {
  return (
    <section className="bg-bone py-12 text-walnut md:py-16">
      <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-y-14 px-6 md:grid-cols-4 md:px-10">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 100}>
            <p className="font-display text-5xl text-bronze md:text-7xl">{s.value}</p>
            <p className="mt-4 text-[0.7rem] uppercase tracking-[0.22em] text-walnut/55">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
      <p className="mx-auto mt-10 max-w-[1500px] px-6 text-xs text-walnut/45 md:px-10">
        Figures marked &ldquo;&mdash;&rdquo; are placeholders pending confirmed numbers from
        D&rsquo;Casa Homes.
      </p>
    </section>
  );
}

const YOUTUBE_CHANNEL = "https://www.youtube.com/@dcasaHOMES-y3n";

const VIDEOS = [
  { id: "pIam144t_Yc", title: "Pullan House", meta: "3800 sqft · Family home" },
  { id: "vxIc3tV1yAc", title: "Padayattil House", meta: "6250 sqft · Family house" },
  { id: "TioJPQVoaQs", title: "Bethel — House of God", meta: "4500 sqft · Family home" },
  { id: "AkAkcrO4_Es", title: "Theckanath House", meta: "3000 sqft · Family home" },
  { id: "zDIlvtInjcE", title: "The Shack", meta: "3000 sqft · Family home" },
];

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

function VideoCard({
  id,
  title,
  meta,
  featured = false,
  onPlay,
}: {
  id: string;
  title: string;
  meta: string;
  featured?: boolean;
  onPlay: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPlay(id)}
      className="group block w-full overflow-hidden photo-frame text-left"
      aria-label={`Play video: ${title}`}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumb(id)}
          alt={`${title} — D'Casa Homes home tour`}
          loading="lazy"
          className="img-zoom photo-tone h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/15 to-transparent transition-opacity duration-500 group-hover:from-charcoal/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-teak/50 bg-charcoal/30 text-teak backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-teak group-hover:bg-teak group-hover:text-charcoal md:h-16 md:w-16">
            <Play size={18} strokeWidth={1.4} className="ml-0.5" />
          </span>
        </div>
        <div className="absolute bottom-0 p-5 md:p-6">
          <p
            className={`font-display text-ivory ${featured ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}
          >
            {title}
          </p>
          <p className="mt-1 text-[0.7rem] uppercase tracking-[0.18em] text-teak/80">{meta}</p>
        </div>
      </div>
    </button>
  );
}

export function Testimonials() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  const featured = VIDEOS[0]!;
  const rest = VIDEOS.slice(1);

  return (
    <section className="relative bg-charcoal py-16 md:py-24">
      <CarvedPattern />
      <KasavuBand dark className="absolute inset-x-0 top-0" />
      <div className="relative mx-auto max-w-[1500px] px-6 md:px-10">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 pt-10 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Home tours & client stories</p>
              <h2 className="mt-5 font-display text-4xl text-ivory md:text-5xl">
                See the homes, <span className="italic text-teak-light">hear the owners.</span>
              </h2>
            </div>
            <a
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.22em] text-teak"
            >
              <Youtube size={15} strokeWidth={1.5} />
              Watch on YouTube
              <ArrowUpRight
                size={14}
                strokeWidth={1.4}
                className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10">
            <VideoCard
              id={featured.id}
              title={featured.title}
              meta={featured.meta}
              featured
              onPlay={setActive}
            />
          </div>
        </Reveal>

        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {rest.map((v, i) => (
            <Reveal key={v.id} delay={i * 90}>
              <VideoCard id={v.id} title={v.title} meta={v.meta} onPlay={setActive} />
            </Reveal>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close video"
              onClick={() => setActive(null)}
              className="absolute -top-11 right-0 flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-ivory/70 transition-colors duration-300 hover:text-teak"
            >
              Close
              <X size={16} strokeWidth={1.4} />
            </button>
            <div className="aspect-video w-full overflow-hidden border border-teak/30 bg-black shadow-[0_0_80px_-10px_rgba(0,0,0,0.8)]">
              <iframe
                src={`https://www.youtube.com/embed/${active}?autoplay=1&rel=0&modestbranding=1`}
                title="D'Casa Homes home tour"
                className="h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const FEED = [
  { src: p01, grey: p01g, alt: "Premium Kerala veranda house with wide shaded sit-out, sloping clay-tiled roof, white walls and tropical coconut palms" },
  { src: p02, grey: p02g, alt: "Teak panelled living room in a Kerala home with courtyard greenery" },
  { src: p04, grey: p04g, alt: "Teak dining room opening to a tropical garden in a Kerala home" },
  { src: p05, grey: p05g, alt: "Contemporary Kerala twin gable home with two clearly visible steep sloping gables, warm white walls, teak details and tropical landscaping" },
];

export function Social() {
  return (
    <section className="bg-sand pb-16 pt-16 md:pb-24 md:pt-20">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 border-t border-walnut/15 pt-12 md:flex-row md:items-end">
            <h2 className="font-display text-4xl text-walnut md:text-5xl">
              Follow the <span className="italic text-terracotta">journey</span>
            </h2>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.22em] text-bronze"
            >
              Follow D&rsquo;Casa Homes on Instagram
              <ArrowUpRight
                size={14}
                strokeWidth={1.4}
                className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </Reveal>

        <div className="mt-12 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 md:mx-0 md:grid md:grid-cols-4 md:px-0">
          {FEED.map((f, i) => (
            <Reveal key={i} delay={i * 90} className="min-w-[72%] snap-start md:min-w-0">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block aspect-[4/5] overflow-hidden photo-frame"
              >
                <ThemeCover
                  brown={f.src}
                  grey={f.grey}
                  alt={f.alt}
                  imgClassName="img-zoom photo-tone"
                />
              </a>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section id="contact" className="relative overflow-hidden bg-charcoal py-20 text-ivory md:py-28">
      {/* warm teak glow */}
      <CarvedPattern />
      <div className="pointer-events-none absolute -right-20 -top-10 h-[420px] w-[420px] rounded-full bg-teak/10 blur-[120px]" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-[360px] w-[360px] rounded-full bg-palm/12 blur-[110px]" />

      <div className="relative mx-auto max-w-[1500px] px-6 md:px-10">
        <Reveal>
          <LampDivider className="mb-10" />
          <h2 className="max-w-4xl font-display text-[2.4rem] leading-[1.03] text-ivory md:text-[5rem]">
            Your Kerala home starts
            <br />
            with a <span className="italic text-teak-light">conversation.</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-10 max-w-md text-sm leading-loose text-ivory/65">
            Tell us about your plot and what you&rsquo;re imagining. We&rsquo;ll help you explore what&rsquo;s possible in Kerala.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#enquiry"
              className="group inline-flex items-center justify-center gap-3 bg-teak px-10 py-4 text-[0.7rem] uppercase tracking-[0.24em] text-charcoal transition-colors duration-500 hover:bg-teak-light"
            >
              Start your project
              <ArrowRight
                size={15}
                strokeWidth={1.4}
                className="transition-transform duration-500 group-hover:translate-x-1"
              />
            </a>
            <a
              href="#enquiry"
              className="inline-flex items-center justify-center border border-teak/45 px-10 py-4 text-[0.7rem] uppercase tracking-[0.24em] text-teak transition-colors duration-500 hover:border-teak"
            >
              Get in touch
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-charcoal pb-8 text-ivory">
      <TileEdge className="mb-12" />
      <div className="mx-auto grid max-w-[1500px] gap-14 px-6 md:grid-cols-4 md:px-10">
        <div>
          <img
            src={logoLightAsset.url}
            alt="D'Casa Homes"
            loading="lazy"
            className="h-20 w-auto"
          />
          <p className="mt-5 max-w-xs text-xs leading-loose text-ivory/55">
            Kerala architecture, construction and interiors — homes made to last.
          </p>
        </div>


        <nav aria-label="Footer">
          <p className="eyebrow">Navigate</p>
          <ul className="mt-6 space-y-3 text-sm text-ivory/65">
            {["Home", "About", "Services", "Projects", "Contact"].map((l) => (
              <li key={l}>
                <a
                  href={`#${l === "Home" ? "top" : l.toLowerCase()}`}
                  className="transition-colors duration-500 hover:text-teak"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-6 space-y-3 text-sm text-ivory/65">
            <li>Phone — to be confirmed</li>
            <li>Email — to be confirmed</li>
            <li>Office address — to be confirmed</li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Social</p>
          <ul className="mt-6 space-y-3 text-sm text-ivory/65">
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-500 hover:text-teak"
              >
                Instagram
              </a>
            </li>
            <li>Facebook — to be confirmed</li>
            <li>LinkedIn — to be confirmed</li>
          </ul>
        </div>
      </div>

      {/* hidden logo reference kept for asset continuity */}
      <span className="sr-only">
        <img src={logoAsset.url} alt="D'Casa Homes" />
      </span>

      <div className="mx-auto mt-10 flex max-w-[1500px] flex-col gap-4 border-t border-teak/12 px-6 pt-8 text-xs text-ivory/45 md:flex-row md:items-center md:justify-between md:px-10">
        <p>&copy; {new Date().getFullYear()} D&rsquo;Casa Homes. All rights reserved.</p>
        <div className="flex gap-8">
          <span>Privacy Policy</span>
          <span>Terms</span>
        </div>
      </div>
    </footer>
  );
}
