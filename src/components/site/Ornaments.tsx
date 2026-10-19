import { cn } from "@/lib/utils";

/** Gold-striped kasavu border, as on a Kerala set-mundu. */
export function KasavuBand({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(dark ? "kasavu-band-dark" : "kasavu-band", className)}
    />
  );
}

/** Overlapping clay roof tiles (odu) — a scalloped terracotta edge. */
export function TileEdge({ flip = false, className }: { flip?: boolean; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("roof-tiles pointer-events-none", flip && "-scale-y-100", className)}
    />
  );
}

/** Carved-timber lattice laid softly over a dark teak section. */
export function CarvedPattern({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("carved-pattern pointer-events-none absolute inset-0", className)}
    />
  );
}

/** Nilavilakku — the traditional Kerala brass oil lamp. */
export function Nilavilakku({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 64"
      aria-hidden="true"
      className={cn("h-10 w-auto text-kasavu", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* flame */}
      <path d="M20 2c3 4 4 7 0 11-4-4-3-7 0-11Z" fill="currentColor" fillOpacity="0.55" />
      {/* oil bowl */}
      <path d="M9 17c0 5 5 8 11 8s11-3 11-8" />
      <path d="M7 17h26" />
      {/* stem with rings */}
      <path d="M20 25v6" />
      <path d="M15 31h10M16.5 35h7M15 39h10" />
      <path d="M20 31v8" />
      {/* base */}
      <path d="M20 39c-1 4-6 6-9 9h18c-3-3-8-5-9-9Z" />
      <path d="M8 48h24l-2 6H10Z" />
    </svg>
  );
}

/** Ornamental divider: gold rules either side of a nilavilakku. */
export function LampDivider({
  className,
  align = "left",
}: {
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center gap-3",
        align === "center" ? "justify-center" : "justify-start",
        className,
      )}
    >
      <span className="h-px w-10 bg-kasavu md:w-16" />
      <Nilavilakku className="h-12" />
      <span className="h-px w-10 bg-kasavu md:w-16" />
    </div>
  );
}
