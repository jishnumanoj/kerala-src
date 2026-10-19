export type Scope = "structure" | "interior" | "both";

export type EstimateItem = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  unit: string;
  rate: number;
  quantity: number;
  basis: string;
  scope: string;
  option_group: string | null;
  is_default: boolean;
  sort: number;
  benefits: string;
  drawbacks: string;
};

export type FactorOption = { id: string; label: string; multiplier: number; value: number | null; benefits: string; drawbacks: string; is_default: boolean; sort: number };
export type Factor = { id: string; key: string; label: string; help: string; applies_to: string[]; sort: number; options: FactorOption[] };

export type Floor = { sqft: number; bedrooms: number; bathrooms: number; kitchens: number; living: number; windows?: number | undefined };

export type EstimateSettings = {
  location_factors: Record<string, number>;
  floor_factor: number;
  contingency_pct: number;
  gst_pct: number;
};

export type EstimateInputs = {
  scope: Scope;
  location: string;
  floors: Floor[];
  selections: Record<string, string>; // option_group -> item id
  extras: string[]; // optional non-group item ids switched on
  factors?: Record<string, string> | undefined; // factor id -> option id
};

export function defaultFactors(factors: Factor[]) {
  const sel: Record<string, string> = {};
  for (const f of factors) {
    const o = f.options.find((x) => x.is_default) ?? f.options[0];
    if (o) sel[f.id] = o.id;
  }
  return sel;
}

export const BASIS_LABELS: Record<string, string> = {
  sqft: "per sq.ft built-up",
  ground_sqft: "per sq.ft ground floor",
  room: "per bedroom",
  bathroom: "per bathroom",
  kitchen: "per kitchen",
  living: "per living room",
  floor: "per floor",
  extra_floor: "per upper floor",
  window_sqft: "per sq.ft of window",
  lumpsum: "lump sum",
};

export const GROUP_LABELS: Record<string, string> = {
  concrete_grade: "Concrete grade",
  steel_brand: "Steel grade",
  cement: "Cement",
  masonry: "Walls (bricks / blocks)",
  interior_paint: "Interior paint",
  flooring: "Flooring",
  windows: "Windows",
};

export function inScope(itemScope: string, scope: Scope) {
  return scope === "both" || itemScope === scope;
}

export function defaultSelections(items: EstimateItem[]) {
  const sel: Record<string, string> = {};
  for (const i of items) if (i.option_group && i.is_default && !sel[i.option_group]) sel[i.option_group] = i.id;
  for (const i of items) if (i.option_group && !sel[i.option_group]) sel[i.option_group] = i.id;
  return sel;
}

export function calculate(items: EstimateItem[], settings: EstimateSettings, input: EstimateInputs, factors: Factor[] = []) {
  const f = input.floors;
  const chosen = factors.map((fa) => {
    const id = input.factors?.[fa.id];
    return { fa, opt: fa.options.find((o) => o.id === id) ?? fa.options.find((o) => o.is_default) ?? fa.options[0] };
  });
  const val = (key: string, d: number) => Number(chosen.find((c) => c.fa.key === key)?.opt?.value ?? d);
  const factorMult = (cat: string) =>
    chosen.reduce((m, c) => (c.opt && (c.fa.applies_to.length === 0 || c.fa.applies_to.includes(cat)) ? m * Number(c.opt.multiplier) : m), 1);
  // Windows are counted per floor by the client; fall back to 2 per bedroom/living/kitchen.
  const windowCount = f.reduce((s, x) => s + (x.windows ?? 2 * ((x.bedrooms || 0) + (x.living || 0) + (x.kitchens || 0))), 0);
  const basis: Record<string, number> = {
    sqft: f.reduce((s, x) => s + (x.sqft || 0), 0),
    ground_sqft: f[0]?.sqft ?? 0,
    room: f.reduce((s, x) => s + (x.bedrooms || 0), 0),
    bathroom: f.reduce((s, x) => s + (x.bathrooms || 0), 0),
    kitchen: f.reduce((s, x) => s + (x.kitchens || 0), 0),
    living: f.reduce((s, x) => s + (x.living || 0), 0),
    floor: f.length,
    extra_floor: Math.max(0, f.length - 1),
    lumpsum: 1,
    window_sqft: windowCount * val("window_size", 16),
  };
  const loc = settings.location_factors[input.location] ?? 1;
  const floorMult = 1 + Number(settings.floor_factor) * Math.max(0, f.length - 1);

  const lines = items
    .filter((i) => inScope(i.scope, input.scope))
    .filter((i) =>
      i.option_group ? input.selections[i.option_group] === i.id : i.is_default || input.extras.includes(i.id),
    )
    .map((i) => {
      const qty = Number(i.quantity) * (basis[i.basis] ?? 0);
      const amount = qty * Number(i.rate) * loc * floorMult * factorMult(i.category);
      return { id: i.id, category: i.category, name: i.name, unit: i.unit, rate: Number(i.rate), qty, amount };
    })
    .filter((l) => l.qty > 0);

  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const contingency = (subtotal * Number(settings.contingency_pct)) / 100;
  const gst = ((subtotal + contingency) * Number(settings.gst_pct)) / 100;
  const total = subtotal + contingency + gst;
  return { lines, subtotal, contingency, gst, total, sqft: basis["sqft"]!, perSqft: basis["sqft"]! ? total / basis["sqft"]! : 0 };
}

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
