import { ArrowRight, Check, MapPin, Phone } from "lucide-react";

import { Reveal, useParallax } from "./Reveal";
import { ThemeCover, ThemeImage } from "./HouseTheme";
import { CarvedPattern, KasavuBand } from "./Ornaments";
import breakImg from "@/assets/detail-break.jpg";
import breakImgGrey from "@/assets/detail-break-grey.jpg";
import studioMain from "@/assets/studio-main.jpg";
import studioMainGrey from "@/assets/studio-main-grey.jpg";
import studioDetail from "@/assets/studio-detail.jpg";
import studioDetailGrey from "@/assets/studio-detail-grey.jpg";
import svcCustom from "@/assets/svc-custom-homes.jpg";
import svcCustomGrey from "@/assets/svc-custom-homes-grey.jpg";
import svcNew from "@/assets/svc-new-construction.jpg";
import svcNewGrey from "@/assets/svc-new-construction-grey.jpg";
import svcReno from "@/assets/svc-renovation.jpg";
import svcRenoGrey from "@/assets/svc-renovation-grey.jpg";
import svcInteriors from "@/assets/svc-interiors.jpg";
import svcInteriorsGrey from "@/assets/svc-interiors-grey.jpg";
import svcDesign from "@/assets/svc-design-build.jpg";
import svcDesignGrey from "@/assets/svc-design-build-grey.jpg";
import svcPm from "@/assets/svc-management.jpg";
import svcPmGrey from "@/assets/svc-management-grey.jpg";

const SERVICES = [
  {
    id: "01",
    name: "Custom Homes",
    description: "Homes drawn around your plot, your family and the Kerala climate.",
    image: svcCustom,
    imageGrey: svcCustomGrey,
  },
  {
    id: "02",
    name: "New Home Construction",
    description: "Quality construction — from footing to roof tile — supervised end to end.",
    image: svcNew,
    imageGrey: svcNewGrey,
  },
  {
    id: "03",
    name: "Renovations & Extensions",
    description: "Renewing older Kerala homes with new roofs, verandahs and finishes.",
    image: svcReno,
    imageGrey: svcRenoGrey,
  },
  {
    id: "04",
    name: "Interior Transformation",
    description: "Teak joinery, stone floors and warm lighting for everyday family living.",
    image: svcInteriors,
    imageGrey: svcInteriorsGrey,
  },
  {
    id: "05",
    name: "Design & Build",
    description: "Architecture, 3D views and construction under one Kerala team.",
    image: svcDesign,
    imageGrey: svcDesignGrey,
  },
  {
    id: "06",
    name: "Project Management",
    description: "Clear timelines, costs and site coordination from plan to handover.",
    image: svcPm,
    imageGrey: svcPmGrey,
  },
];

export function Overview() {
  return (
    <section className="relative overflow-hidden bg-bone py-16 text-walnut md:py-24">
      {/* warm teak glow inspired by the illuminated sign */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-terracotta/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full bg-palm/10 blur-[110px]" />

      <div className="relative mx-auto max-w-[1500px] px-6 md:px-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-bronze">End-to-end service</p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-8 font-display text-[2.6rem] leading-[1.05] text-walnut sm:text-5xl md:text-[4.5rem]">
                Let D&rsquo;Casa <span className="italic text-terracotta">Homes</span> handle it all.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-8 max-w-md text-sm leading-loose text-walnut/70 md:text-base">
                From the first idea to the final handover, we bring every part of the home-building
                journey under one roof &mdash; Kerala-appropriate design, construction and interiors in
                a single, considered process.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pt-12">
            <ul className="space-y-6">
              {[
                { label: "Design", desc: "Architectural plans tailored around your lifestyle and site." },
                { label: "3D Views", desc: "Realistic visualisations so you can see before you build." },
                { label: "Construction", desc: "Quality execution with careful planning and supervision." },
                { label: "Interiors", desc: "Curated finishes that complete the character of your home." },
              ].map((item, i) => (
                <Reveal key={item.label} delay={i * 80}>
                  <li className="flex items-start gap-5 border-b border-walnut/15 pb-6">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-bronze/50 text-bronze">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl text-walnut md:text-3xl">{item.label}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-walnut/60">{item.desc}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>

        <Reveal delay={300}>
          <div className="mt-10 border-t border-walnut/15 pt-8">
            <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
              <div>
                <p className="font-display text-3xl text-bronze md:text-4xl">
                  Stylish. Functional. Budget-friendly.
                </p>
              </div>

              <div className="flex flex-col gap-4 text-sm text-walnut/70 md:flex-row md:gap-12">
                <a href="tel:7736006377" className="group flex items-center gap-3 hover:text-terracotta">
                  <Phone size={16} strokeWidth={1.4} className="text-bronze" />
                  <span>7736006377</span>
                </a>
                <a href="tel:7902883311" className="group flex items-center gap-3 hover:text-terracotta">
                  <Phone size={16} strokeWidth={1.4} className="text-bronze" />
                  <span>7902883311</span>
                </a>
                <span className="flex items-center gap-3">
                  <MapPin size={16} strokeWidth={1.4} className="text-bronze" />
                  <span>Ernakulam | Thrissur</span>
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-charcoal-soft py-16 text-ivory md:py-24">
      <CarvedPattern />
      <KasavuBand dark className="absolute inset-x-0 top-0" />
      <div className="relative mx-auto max-w-[1500px] px-6 md:px-10">
        <Reveal>
          <p className="eyebrow">What we do</p>
        </Reveal>
        <div className="mt-8 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal delay={100}>
            <h2 className="max-w-2xl font-display text-4xl leading-[1.05] text-ivory md:text-6xl">
              A single Kerala team, from first{" "}
              <span className="italic text-teak-light">sketch</span> to final handover.
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="max-w-sm text-sm leading-loose text-ivory/60">
              Six ways we work with Kerala families &mdash; design, build and interiors, each handled
              by the same team that will hand you the keys.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={i * 90}>
              <a
                href="#contact"
                className="group relative block overflow-hidden bg-charcoal"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <ThemeCover
                    brown={s.image}
                    grey={s.imageGrey}
                    alt={s.name}
                    imgClassName="scale-[1.02] transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.12]"
                  />
                </div>

                {/* cinematic scrim */}
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/15 to-transparent transition-opacity duration-700 group-hover:via-charcoal/30" />
                <span className="pointer-events-none absolute inset-0 cinematic-vignette opacity-40" />
                {/* warm light sweep on hover */}
                <span className="pointer-events-none absolute inset-0 translate-y-full bg-gradient-to-t from-teak/25 to-transparent transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />

                <span className="absolute left-6 top-6 font-display text-2xl text-ivory/45 transition-colors duration-700 group-hover:text-teak-light">
                  {s.id}
                </span>

                <span className="absolute inset-x-6 bottom-6 block">
                  <span className="block h-px w-10 bg-teak-light/70 transition-all duration-700 ease-out group-hover:w-20" />
                  <span className="mt-4 block font-display text-2xl leading-tight text-ivory md:text-3xl">
                    {s.name}
                  </span>
                  <span className="mt-3 block max-h-0 overflow-hidden text-sm leading-relaxed text-ivory/70 opacity-0 transition-all duration-700 ease-out group-hover:max-h-24 group-hover:opacity-100">
                    {s.description}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-teak-light opacity-0 transition-all duration-700 ease-out group-hover:opacity-100">
                    Enquire
                    <ArrowRight
                      size={13}
                      strokeWidth={1.4}
                      className="transition-transform duration-500 group-hover:translate-x-1"
                    />
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const PILLARS = [
  {
    id: "01",
    title: "Thoughtful Design",
    body: "Every plan starts with your family, your plot and the way Kerala light and rain move across it.",
  },
  {
    id: "02",
    title: "Quality Craftsmanship",
    body: "Teak, clay tile, stone and plaster — chosen and executed to last through decades of monsoon.",
  },
  {
    id: "03",
    title: "Clear Communication",
    body: "Clients should understand what is happening throughout their project.",
  },
  {
    id: "04",
    title: "Lasting Relationships",
    body: "The relationship should continue beyond project completion.",
  },
];

export function Philosophy() {
  return (
    <section className="bg-sand py-16 md:py-24">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <Reveal>
          <p className="eyebrow !text-bronze">The D&rsquo;Casa Difference</p>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mt-8 font-display text-[2.4rem] leading-[1.03] text-walnut md:text-[4.5rem]">
            Designed thoughtfully.
            <br />
            Built carefully.
            <br />
            <span className="italic text-terracotta">Made to last.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-px bg-walnut/12 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.id} delay={i * 100} className="border-t-[3px] border-terracotta bg-bone p-8 md:p-10">
              <span className="text-[0.7rem] tracking-[0.22em] text-bronze">{p.id}</span>
              <h3 className="mt-8 font-display text-2xl text-walnut">{p.title}</h3>
              <p className="mt-4 text-sm leading-loose text-walnut/65">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ImageBreak() {
  const ref = useParallax(0.18);

  return (
    <section className="relative overflow-hidden bg-charcoal">
      <KasavuBand dark className="absolute inset-x-0 top-0 z-10" />
      <KasavuBand dark className="absolute inset-x-0 bottom-0 z-10" />
      <div ref={ref} className="relative will-change-transform">
        <ThemeImage
          brown={breakImg}
          grey={breakImgGrey}
          alt="Kerala home detail — window with grille, white plastered wall and roof tiles under a deep overhang"
          width={1920}
          height={1104}
          imgClassName="break-tone"
        />
      </div>
      {/* warm afternoon lift across the architecture */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_75%_at_78%_55%,rgba(201,168,76,0.18),transparent_65%)]" />
      {/* directional shading behind the text, fading toward the building */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-[linear-gradient(100deg,color-mix(in_oklab,var(--color-charcoal)_88%,transparent)_0%,color-mix(in_oklab,var(--color-charcoal)_60%,transparent)_30%,color-mix(in_oklab,var(--color-charcoal)_22%,transparent)_52%,transparent_72%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-charcoal/45 to-transparent" />
      <div className="absolute inset-0 mx-auto flex max-w-[1500px] items-center px-6 md:px-10">
        <Reveal>
          <h2 className="max-w-3xl font-display text-[2.2rem] leading-[1.05] text-ivory [text-shadow:0_2px_24px_rgba(0,0,0,0.4)] md:text-[4.5rem]">
            Deep overhangs.
            <br />
            Teak. Tile. Stone.
            <br />
            <span className="italic text-teak-light">Detail is the design.</span>
          </h2>
        </Reveal>
      </div>
    </section>
  );
}

const STEPS = [
  { id: "01", title: "Discover", body: "Understand the client's vision, lifestyle, requirements and budget." },
  { id: "02", title: "Design", body: "Translate ideas into a considered architectural and interior direction." },
  { id: "03", title: "Plan", body: "Finalise materials, timelines, specifications and project requirements." },
  { id: "04", title: "Build", body: "Execute with careful coordination, craftsmanship and quality control." },
  { id: "05", title: "Deliver", body: "Complete the home with attention to every final detail." },
];

export function Process() {
  return (
    <section id="approach" className="bg-bone py-16 md:py-24">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <Reveal>
          <p className="eyebrow !text-bronze">Our Process</p>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mt-8 font-display text-4xl text-walnut md:text-6xl">
            From idea to <span className="italic text-terracotta">home</span>
          </h2>
        </Reveal>

        <ol className="mt-10 grid gap-8 md:grid-cols-5 md:gap-6">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 110} className="group relative md:pr-6">
              <div className="relative h-px w-full bg-walnut/15">
                <span className="absolute -top-[5px] left-0 block h-[11px] w-[11px] rotate-45 border border-kasavu bg-terracotta transition-transform duration-700 group-hover:scale-125" />
              </div>
              <span className="mt-6 block text-[0.7rem] tracking-[0.22em] text-bronze">
                {s.id}
              </span>
              <h3 className="mt-3 font-display text-3xl text-walnut">{s.title}</h3>
              <p className="mt-4 max-w-xs text-sm leading-loose text-walnut/65">{s.body}</p>
            </Reveal>
          ))}
        </ol>

      </div>
    </section>
  );
}

export function Studio() {
  return (
    <section className="bg-sand py-16 pb-24 md:py-24 md:pb-32">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow !text-bronze">Where ideas take shape</p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-8 font-display text-4xl leading-[1.05] text-walnut md:text-[3.5rem]">
                The studio behind the <span className="italic text-terracotta">homes.</span>
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-10 max-w-sm text-sm leading-loose text-walnut/65">
                Elevations, roof pitches, courtyard sections and material boards &mdash; teak, kota
                stone, clay tile and lime plaster are chosen here, long before the first block is
                laid.
              </p>
            </Reveal>
          </div>

          <Reveal delay={140} className="relative lg:col-span-8 lg:pt-10">
            <figure className="relative">
              <div className="relative overflow-hidden wood-frame">
                <ThemeImage
                  brown={studioMain}
                  grey={studioMainGrey}
                  alt="D'Casa Homes studio with a scale model of a sloping-roof Kerala home, drawings and material samples in bright daylight"
                  width={1600}
                  height={1104}
                  imgClassName="img-zoom"
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-walnut/10" />
              </div>
              <figcaption className="mt-5 max-w-xs text-xs uppercase tracking-[0.16em] text-walnut/50">
                D&rsquo;Casa Homes Studio &mdash; address to be confirmed
              </figcaption>


              <div className="mt-8 w-2/3 overflow-hidden wood-frame sm:w-1/2 lg:absolute lg:-bottom-14 lg:right-6 lg:mt-0 lg:w-[38%] lg:max-w-[300px]">
                <ThemeImage
                  brown={studioDetail}
                  grey={studioDetailGrey}
                  alt="Kota stone, lime plaster, roof tile and cane material samples on a table"
                  width={1008}
                  height={1312}
                  imgClassName="img-zoom"
                />
              </div>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
