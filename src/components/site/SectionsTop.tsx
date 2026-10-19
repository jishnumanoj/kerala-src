import { ArrowDown, ArrowRight } from "lucide-react";
import { Reveal, useHeroMotion } from "./Reveal";
import { useHouseTheme, ThemeImage } from "./HouseTheme";
import { KasavuBand, LampDivider, TileEdge } from "./Ornaments";
import hero from "@/assets/hero.jpg";
import heroGrey from "@/assets/hero-grey.jpg";
import intro from "@/assets/intro.jpg";
import p01 from "@/assets/project-01.jpg";
import p02 from "@/assets/project-02.jpg";
import p03 from "@/assets/project-03.jpg";
import p04 from "@/assets/project-04.jpg";
import p05 from "@/assets/project-05.jpg";
import p01g from "@/assets/project-01-grey.jpg";
import p02g from "@/assets/project-02-grey.jpg";
import p03g from "@/assets/project-03-grey.jpg";
import p04g from "@/assets/project-04-grey.jpg";
import p05g from "@/assets/project-05-grey.jpg";

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function anchor(id: string) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    smoothScrollTo(id);
  };
}

export function Hero() {
  const { imageRef, contentRef } = useHeroMotion();
  const { theme } = useHouseTheme();

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-charcoal px-6 pb-40 pt-32 text-center md:pb-44 md:pt-36"
    >
      {/* Full-bleed cinematic hero photograph */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div ref={imageRef} className="absolute -inset-[3%] animate-veil-in will-change-transform">
          <img
            src={hero}
            alt="Traditional Kerala nalukettu-inspired home with a sloping terracotta clay-tile roof, timber pillars, deep shaded verandah, warm ivory walls and coconut palms"
            width={1920}
            height={1280}
            fetchPriority="high"
            className={`h-full w-full animate-hero-zoom object-cover object-bottom hero-tone transition-opacity duration-700 ease-out ${
              theme === "brown" ? "opacity-100" : "opacity-0"
            }`}
          />
          <img
            src={heroGrey}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1280}
            className={`absolute inset-0 h-full w-full animate-hero-zoom object-cover object-bottom hero-tone transition-opacity duration-700 ease-out ${
              theme === "grey" ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Barely-there warm sun sweep across the elevation */}
          <div className="pointer-events-none absolute inset-0 architectural-light" />
        </div>
        <div className="absolute inset-0 animate-veil-in bg-gradient-to-b from-charcoal/70 via-charcoal/40 to-charcoal/85 [animation-delay:180ms]" />
        <div className="absolute inset-0 animate-veil-in cinematic-vignette [animation-delay:180ms]" />
      </div>

      <div ref={contentRef} className="relative z-10 mx-auto max-w-5xl will-change-transform">
        <p className="malayalam animate-hero-rise text-xl text-teak-light [animation-delay:300ms] md:text-2xl">
          സ്വാഗതം
        </p>
        <p className="mt-3 animate-hero-rise text-[0.66rem] uppercase tracking-[0.4em] text-teak-light [animation-delay:400ms]">
          Kerala Architecture &middot; Construction &middot; Interiors
        </p>

        <h1 className="mt-7 font-display text-[2.7rem] leading-[1.02] tracking-tight text-ivory sm:text-[3.8rem] md:text-[4.8rem] lg:text-[5.8rem]">
          <span className="block overflow-hidden pb-1">
            <span className="block animate-line-reveal [animation-delay:600ms]">
              Inspired by Kerala's Heritage.
            </span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span className="block animate-line-reveal italic text-teak-light [animation-delay:800ms]">
              Made for Generations.
            </span>
          </span>
        </h1>

        <div className="mx-auto mt-10 max-w-2xl">
          <div className="mx-auto h-px w-20 animate-line-grow bg-teak-light" />
          <p className="mt-8 animate-hero-rise text-sm leading-loose text-ivory/85 [animation-delay:1050ms] md:text-base">
            Creating timeless homes inspired by Kerala's traditional architecture — sloping clay-tile roofs,
            carved timber, shaded verandahs and courtyards — thoughtfully adapted for family life today.
          </p>
          <p className="mt-5 animate-hero-rise text-[0.6rem] uppercase tracking-[0.28em] text-teak-light/80 [animation-delay:1150ms]">
            {theme === "brown"
              ? "Shown in White & Brown — warm white walls, teak and terracotta"
              : "Shown in White & Grey — warm white walls, grey stone and charcoal"}
          </p>
        </div>

        <div className="mt-11 flex animate-hero-rise flex-col items-center justify-center gap-4 [animation-delay:1250ms] sm:flex-row">
          <a
            href="#projects"
            onClick={anchor("projects")}
            className="group inline-flex items-center justify-center gap-3 whitespace-nowrap border border-teak-light px-8 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-teak-light shadow-[0_0_0_rgba(0,0,0,0)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.035] hover:bg-teak-light hover:text-charcoal hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.65)]"
          >
            Explore Our Homes
            <ArrowRight
              size={15}
              strokeWidth={1.4}
              className="transition-transform duration-700 ease-out group-hover:translate-x-1.5"
            />
          </a>
          <a
            href="#contact"
            onClick={anchor("contact")}
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap border border-ivory/20 px-8 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-ivory/85 transition-colors duration-700 hover:border-ivory/50 hover:text-ivory"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-ivory/10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            <span className="relative">Start Your Home Journey</span>
            <ArrowRight
              size={15}
              strokeWidth={1.4}
              className="relative transition-transform duration-700 ease-out group-hover:translate-x-1.5"
            />
          </a>
        </div>
      </div>

      {/* Clay roof-tile edge where the hero meets the cream page */}
      <TileEdge className="absolute inset-x-0 bottom-0 z-10" />

      {/* Scroll cue */}
      <a
        href="#about"
        onClick={anchor("about")}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 animate-hero-rise flex-col items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-ivory/60 transition-colors duration-500 [animation-delay:1500ms] hover:text-ivory md:flex"
      >
        Scroll to Discover
        <ArrowDown size={14} strokeWidth={1.4} className="animate-cue-drift" />
      </a>

      {/* Featured home teaser */}
      <a
        href="#projects"
        onClick={anchor("projects")}
        className="group absolute bottom-8 right-6 z-10 hidden animate-hero-rise items-end gap-4 text-left [animation-delay:1650ms] lg:flex"
      >
        <span className="h-14 w-20 overflow-hidden opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100">
          <img
            src={theme === "grey" ? p03g : p03}
            alt="Nadumuttam Villa — open-to-sky central courtyard"
            width={1600}
            height={1072}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </span>
        <span className="block border-l border-teak-light/40 pl-4">
          <span className="block text-[0.58rem] uppercase tracking-[0.3em] text-ivory/55">
            Featured Home
          </span>
          <span className="mt-2 flex items-center gap-2 font-display text-lg text-ivory">
            Nadumuttam Villa
            <ArrowRight
              size={14}
              strokeWidth={1.4}
              className="text-teak-light transition-transform duration-700 group-hover:translate-x-1"
            />
          </span>
        </span>
      </a>
    </section>
  );
}



export function Intro() {
  return (
    <section id="about" className="bg-bone">
      <div className="flex flex-col lg:flex-row lg:items-center">
        {/* Image side — shown complete, no cropping */}
        <div className="relative w-full lg:w-1/2">
          <img
            src={intro}
            alt="Naturally lit Kerala courtyard sit-out with white walls, teak columns, exposed roof rafters and grey stone flooring"
            width={934}
            height={1246}
            loading="lazy"
            className="block h-auto w-full interior-tone"
          />
        </div>


        {/* Text side */}
        <div className="flex w-full items-center bg-bone px-6 py-16 lg:w-1/2 lg:px-20 lg:py-24">
          <Reveal className="max-w-lg">
            <p className="eyebrow !text-bronze">Rooted in Kerala</p>
            <h2 className="mt-8 font-display text-[2.4rem] leading-[1.05] tracking-tight text-walnut sm:text-5xl lg:text-[4rem]">
              Kerala traditions, <span className="italic text-terracotta">modern family living.</span>
            </h2>
            <LampDivider className="mt-10" />
            <p className="mt-8 text-sm leading-loose text-walnut/70 md:text-base">
              We design for the Kerala climate and the Kerala family &mdash; sloping tiled roofs and
              deep overhangs that handle the monsoon, verandahs and courtyards that draw in light and
              breeze, teak joinery that ages beautifully, and calm white and grey elevations that
              feel premium without shouting.
            </p>
            <p className="mt-6 font-display text-2xl italic text-bronze">
              Built for the monsoon. Made for the family.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );

}

type Project = {
  id: string;
  title: string;
  location: string;
  type: string;
  image: string;
  imageGrey: string;
  alt: string;
  w: number;
  h: number;
  blurb: string;
};

const PROJECTS: Project[] = [
  {
    id: "01",
    title: "Veranda House",
    location: "Ernakulam",
    type: "Custom Kerala Home",
    image: p01,
    imageGrey: p01g,
    alt: "Premium Kerala veranda house with a wide shaded front sit-out, traditional sloping clay-tiled roof, white walls, grey stone base, teak columns and doors, and tropical coconut palms",
    w: 1200,
    h: 800,
    blurb:
      "A single-storey Kerala home built around a deep, shaded verandah — white walls over a grey stone base, teak windows and a tiled roof with generous overhangs.",
  },
  {
    id: "02",
    title: "Teak & Courtyard Living",
    location: "Ernakulam",
    type: "Interiors",
    image: p02,
    imageGrey: p02g,
    alt: "Kerala home living room with white walls, teak panelling, grey stone floor and a courtyard view of tropical greenery",
    w: 928,
    h: 1246,
    blurb:
      "A double-height living room where a teak feature wall, grey kota floor and courtyard greenery carry the warmth of a traditional Kerala home.",
  },
  {
    id: "03",
    title: "Nadumuttam Villa",
    location: "Thrissur",
    type: "Design & Build",
    image: p03,
    imageGrey: p03g,
    alt: "Central open-to-sky nadumuttam courtyard of a modern Kerala Nalukettu home, with carved teak pillars, clay-tiled sloping roofs, white walls and a small tree in the courtyard",
    w: 1600,
    h: 1072,
    blurb:
      "A Nalukettu-inspired residence planned around a true nadumuttam — an open-to-sky courtyard ringed by teak-pillared verandahs, sloping clay-tiled roofs and warm white walls.",

  },
  {
    id: "04",
    title: "Monsoon Dining Room",
    location: "Thrissur",
    type: "Interior Transformation",
    image: p04,
    imageGrey: p04g,
    alt: "Kerala home dining room with teak dining set, white walls, sheer curtains and doors opening to a tropical garden",
    w: 930,
    h: 1214,
    blurb:
      "Teak joinery, cane pendants and full-height doors that open the dining room to the garden — cool and cross-ventilated through the monsoon.",
  },
  {
    id: "05",
    title: "Twin Gable Home",
    location: "Ernakulam",
    type: "New Home Construction",
    image: p05,
    imageGrey: p05g,
    alt: "Contemporary Kerala twin gable home with two clearly visible steep sloping charcoal grey tiled gables, warm white walls, teak windows and doors, deep overhangs, pillared verandah and tropical coconut palms",
    w: 976,
    h: 688,
    blurb:
      "Two distinct gabled roofs define the front elevation — steep Kerala-style slopes, deep overhangs, warm white walls and teak detailing give this new family home a calm, familiar arrival.",
  },
];


function SplitRow({
  project,
  reverse = false,
  light = false,
}: {
  project: Project;
  reverse?: boolean;
  /** Warm-white ground when true, sand ground when false. */
  light?: boolean;
}) {
  

  return (
    <div className="flex flex-col lg:flex-row lg:items-center">
      {/* Image side — full frame, never cropped */}
      <div
        className={`relative w-full overflow-hidden lg:w-1/2 ${
          reverse ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <ThemeImage
          brown={project.image}
          grey={project.imageGrey}
          alt={project.alt}
          width={project.w}
          height={project.h}
          className="group"
          imgClassName="photo-tone transition-transform duration-[1600ms] ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute left-6 top-6 z-10 bg-bone/85 px-4 py-2 text-[0.6rem] uppercase tracking-[0.24em] text-walnut backdrop-blur-sm">
          {project.id}
        </span>


      </div>

      {/* Text side */}
      <div
        className={`flex w-full items-center px-6 py-16 lg:w-1/2 lg:px-20 lg:py-24 ${
          light ? "bg-bone" : "bg-sand"

        } ${reverse ? "lg:order-1" : "lg:order-2"}`}
      >
        <Reveal className="max-w-lg">
          <p className="eyebrow !text-bronze">{project.type}</p>
          <h3 className="mt-6 font-display text-[2.2rem] leading-[1.05] text-walnut md:text-5xl lg:text-[3.4rem]">
            {project.title}
          </h3>
          <p className="mt-4 text-[0.66rem] uppercase tracking-[0.24em] text-terracotta">
            {project.location}
          </p>
          <div className="mt-8 h-px w-20 bg-bronze/50" />
          <p className="mt-8 text-sm leading-loose text-walnut/70 md:text-base">{project.blurb}</p>
          <a
            href="#contact"
            className="group mt-10 inline-flex items-center gap-3 text-[0.66rem] uppercase tracking-[0.24em] text-bronze transition-colors duration-500 hover:text-terracotta"
          >
            Enquire about this project
            <ArrowRight
              size={14}
              strokeWidth={1.4}
              className="transition-transform duration-500 group-hover:translate-x-1"
            />
          </a>
        </Reveal>
      </div>
    </div>
  );
}

/** Grey-palette visitors see the grey-forward elevations first. */
const GREY_ORDER = ["05", "03", "01", "02", "04"];

export function Projects() {
  const { theme } = useHouseTheme();
  const ordered =
    theme === "grey"
      ? GREY_ORDER.map((id) => PROJECTS.find((p) => p.id === id)!).filter(Boolean)
      : PROJECTS;

  return (
    <section id="projects" className="bg-bone">
      {/* Section header */}
      <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24">
        <Reveal>
          <KasavuBand />
        </Reveal>
        <div className="flex flex-col justify-between gap-6 pt-10 md:flex-row md:items-end">
          <Reveal>
            <h2 className="font-display text-4xl tracking-tight text-walnut md:text-6xl lg:text-7xl">
              Kerala homes we&rsquo;ve <span className="italic text-terracotta">built</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-sm text-sm leading-loose text-walnut/65">
              Traditional Kerala homes across Ernakulam and Thrissur &mdash; clay-tiled roofs, carved timber,
              shaded verandahs, nadumuttam courtyards and warm natural materials.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Alternating split-screen project rows on warm white and sand grounds */}
      <div className="flex flex-col">
        {ordered.map((p, i) => (
          <SplitRow key={p.id} project={p} reverse={i % 2 === 1} light={i % 2 === 1} />
        ))}
      </div>
    </section>
  );

}
