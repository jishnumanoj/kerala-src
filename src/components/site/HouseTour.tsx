import { useRef, useState } from "react";
import { ArrowRight, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Reveal } from "./Reveal";
import exteriorClip from "@/assets/house-tour.mp4.asset.json";
import interiorClip from "@/assets/house-tour-interior.mp4.asset.json";
import courtyardClip from "@/assets/house-tour-courtyard.mp4.asset.json";
import livingClip from "@/assets/house-tour-living.mp4.asset.json";
import posterExterior from "@/assets/project-01.jpg";
import posterInterior from "@/assets/project-02.jpg";
import posterCourtyard from "@/assets/project-03.jpg";
import posterLiving from "@/assets/project-04.jpg";

const CHAPTERS = [
  {
    label: "Veranda House",
    home: "Veranda House",
    location: "Ernakulam",
    focus: "Arrival & verandah",
    src: exteriorClip.url,
    poster: posterExterior,
  },
  {
    label: "Teak & Courtyard Living",
    home: "Teak & Courtyard Living",
    location: "Ernakulam",
    focus: "Living room & teak wall",
    src: interiorClip.url,
    poster: posterInterior,
  },
  {
    label: "Nadumuttam Villa",
    home: "Nadumuttam Villa",
    location: "Thrissur",
    focus: "Open-to-sky courtyard",
    src: courtyardClip.url,
    poster: posterCourtyard,
  },
  {
    label: "Monsoon Dining Room",
    home: "Monsoon Dining Room",
    location: "Thrissur",
    focus: "Dining & kitchen",
    src: livingClip.url,
    poster: posterLiving,
  },
];

const HIGHLIGHTS = [
  { label: "Four completed homes", detail: "Each clip is a different D'Casa residence, not one house" },
  { label: "Verandah to courtyard", detail: "Deep overhangs, teak columns, open-to-sky nadumuttam" },
  { label: "Teak & stone interiors", detail: "Kota floors, teak joinery, warm evening lighting" },
];

export function HouseTour() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [chapter, setChapter] = useState(0);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const selectChapter = (index: number) => {
    setChapter(index);
    setPlaying(true);
    requestAnimationFrame(() => {
      const v = videoRef.current;
      if (v) void v.play();
    });
  };

  const handleEnded = () => {
    if (chapter < CHAPTERS.length - 1) {
      selectChapter(chapter + 1);
    } else {
      setPlaying(false);
      setChapter(0);
    }
  };

  const active = CHAPTERS[chapter] ?? CHAPTERS[0]!;

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section id="house-tour" className="bg-sand">
      <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24">
        <Reveal>
          <div className="h-px w-full bg-walnut/12" />
        </Reveal>

        <div className="flex flex-col justify-between gap-6 pt-10 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow !text-bronze">Walk Through D&rsquo;Casa Homes</p>
            <h2 className="mt-6 font-display text-4xl tracking-tight text-walnut md:text-6xl lg:text-7xl">
              Take a <span className="italic text-terracotta">house tour</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-sm text-sm leading-loose text-walnut/65">
              Four short films, four completed Kerala homes &mdash; a verandah arrival, a teak-lined
              living room, an open-to-sky nadumuttam and a monsoon dining room. Choose a home below.
            </p>
          </Reveal>
        </div>

        <Reveal delay={160} className="mt-12">
          <div className="group relative aspect-[16/9] max-h-[68svh] w-full overflow-hidden bg-charcoal">
            <video
              key={active.src}
              ref={videoRef}
              src={active.src}
              poster={active.poster}
              muted={muted}
              autoPlay={playing}
              onEnded={handleEnded}
              playsInline
              preload="metadata"
              className="absolute inset-0 block h-full w-full object-contain object-center"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/5 to-charcoal/20 transition-opacity duration-700 group-hover:opacity-90" />

            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause house tour" : "Play house tour"}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-ivory/50 bg-ivory/10 text-ivory backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-hover:border-ivory group-hover:bg-ivory group-hover:text-charcoal">
                {playing ? (
                  <Pause size={22} strokeWidth={1.4} />
                ) : (
                  <Play size={22} strokeWidth={1.4} className="ml-1" />
                )}
              </span>
            </button>

            <div className="pointer-events-none absolute bottom-6 left-6 z-10">
              <p className="text-[0.58rem] uppercase tracking-[0.3em] text-ivory/60">
                Completed Home &middot; {active.location} &middot; {active.focus}
              </p>
              <p className="mt-2 font-display text-2xl text-ivory md:text-3xl">{active.home}</p>
            </div>


            <button
              type="button"
              onClick={toggleSound}
              aria-label={muted ? "Unmute house tour" : "Mute house tour"}
              className="absolute bottom-6 right-6 z-10 flex h-11 w-11 items-center justify-center border border-ivory/30 text-ivory/80 transition-colors duration-500 hover:border-ivory hover:text-ivory"
            >
              {muted ? <VolumeX size={16} strokeWidth={1.4} /> : <Volume2 size={16} strokeWidth={1.4} />}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {CHAPTERS.map((c, i) => (
              <button
                key={c.label}
                type="button"
                onClick={() => selectChapter(i)}
                className={`border px-6 py-3 text-[0.62rem] uppercase tracking-[0.24em] transition-colors duration-500 ${
                  i === chapter
                    ? "border-bronze bg-bronze text-ivory"
                    : "border-walnut/20 text-walnut/70 hover:border-bronze hover:text-bronze"
                }`}
              >
                {`0${i + 1} · ${c.label}`}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.label} delay={i * 100}>
              <p className="text-[0.6rem] uppercase tracking-[0.28em] text-terracotta">
                0{i + 1}
              </p>
              <p className="mt-4 font-display text-2xl text-walnut">{h.label}</p>
              <p className="mt-3 text-sm leading-loose text-walnut/65">{h.detail}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <a
            href="#contact"
            className="group mt-12 inline-flex items-center gap-3 border border-bronze/50 px-8 py-4 text-[0.66rem] uppercase tracking-[0.24em] text-bronze transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-bronze hover:text-ivory"
          >
            Book a site visit
            <ArrowRight
              size={14}
              strokeWidth={1.4}
              className="transition-transform duration-500 group-hover:translate-x-1"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
