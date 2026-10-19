import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { getEstimator, submitEstimate } from "@/lib/estimate.functions";
import {
  BASIS_LABELS, GROUP_LABELS, calculate, defaultFactors, defaultSelections, inScope, inr,
  type Floor, type Scope,
} from "@/lib/estimate";

export const Route = createFileRoute("/estimate/$token")({
  head: () => ({
    meta: [
      { title: "Your Home Cost Estimate — D'Casa Homes" },
      { name: "description", content: "An initial-level construction and interior cost estimate for your Kerala home." },
      { property: "og:title", content: "Your Home Cost Estimate — D'Casa Homes" },
      { property: "og:description", content: "An initial-level construction and interior cost estimate for your Kerala home." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EstimatorPage,
});

const emptyFloor: Floor = { sqft: 1200, bedrooms: 2, bathrooms: 2, kitchens: 1, living: 1, windows: 8 };
const field = "w-full border border-border bg-background px-3 py-2 text-sm focus:border-teak focus:outline-none";

function EstimatorPage() {
  const { token } = Route.useParams();
  const fetchEst = useServerFn(getEstimator);
  const submit = useServerFn(submitEstimate);
  const { data, isLoading } = useQuery({ queryKey: ["estimator", token], queryFn: () => fetchEst({ data: { token } }) });

  const [scope, setScope] = useState<Scope>("both");
  const [location, setLocation] = useState("Ernakulam");
  const [floors, setFloors] = useState<Floor[]>([emptyFloor]);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [extras, setExtras] = useState<string[]>([]);
  const [factorSel, setFactorSel] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const items = data?.status === "ok" ? data.items : [];
  const factors = data?.status === "ok" ? data.factors : [];
  useEffect(() => { if (factors.length) setFactorSel(defaultFactors(factors)); }, [factors.length]);
  useEffect(() => { if (items.length) setSelections(defaultSelections(items)); }, [items.length]);

  const result = useMemo(
    () => (data?.status === "ok" && data.settings ? calculate(items, data.settings, { scope, location, floors, selections, extras, factors: factorSel }, factors) : null),
    [data, items, factors, scope, location, floors, selections, extras, factorSel],
  );

  if (isLoading) return <Shell><p className="text-sm text-muted-foreground">Loading your estimator…</p></Shell>;
  if (!data || data.status !== "ok")
    return (
      <Shell>
        <h1 className="font-display text-4xl">{data?.status === "expired" ? "This link has expired" : "Link not found"}</h1>
        <p className="mt-4 max-w-md text-sm text-muted-foreground">
          Please contact D&rsquo;Casa Homes on WhatsApp at +91 90615 65999 for a fresh estimator link.
        </p>
      </Shell>
    );

  const visible = items.filter((i) => inScope(i.scope, scope));
  const groups = [...new Set(visible.filter((i) => i.option_group).map((i) => i.option_group!))];
  const optional = visible.filter((i) => !i.option_group && !i.is_default);
  const setFloor = (idx: number, patch: Partial<Floor>) => setFloors((f) => f.map((x, i) => (i === idx ? { ...x, ...patch } : x)));
  const byCat = result ? Object.entries(result.lines.reduce<Record<string, typeof result.lines>>((a, l) => ((a[l.category] ??= []).push(l), a), {})) : [];

  const send = async () => {
    setBusy(true);
    const r = await submit({ data: { token, inputs: { scope, location, floors, selections, extras, factors: factorSel } } });
    setBusy(false);
    setSent(r.ok ? "Thank you — your estimate has been shared with the D'Casa Homes team. We'll call you shortly." : r.error);
  };

  return (
    <Shell>
      <p className="eyebrow">Initial cost estimate</p>
      <h1 className="mt-4 font-display text-4xl md:text-5xl">Hello {data.clientName}, <span className="italic text-teak">let&rsquo;s size your home.</span></h1>
      {data.note && <p className="mt-4 max-w-2xl text-sm text-muted-foreground">{data.note}</p>}
      <p className="mt-2 text-xs text-muted-foreground">This link is valid until {new Date(data.expiresAt!).toLocaleString("en-IN")}.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="grid content-start gap-8 lg:col-span-7">
          <Section title="1. What should we build?">
            <div className="grid grid-cols-3 gap-2">
              {([["structure", "Structure only"], ["interior", "Interior only"], ["both", "Structure + Interior"]] as [Scope, string][]).map(([k, l]) => (
                <button key={k} onClick={() => setScope(k)} className={`border px-3 py-3 text-xs uppercase tracking-[0.12em] ${scope === k ? "border-teak bg-teak/15" : "border-border"}`}>{l}</button>
              ))}
            </div>
            <label className="mt-4 grid gap-1 text-xs text-muted-foreground">Location
              <select className={field} value={location} onChange={(e) => setLocation(e.target.value)}>
                {Object.keys(data.settings!.location_factors).map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
          </Section>

          <Section title="2. Floors & rooms">
            {floors.map((f, idx) => (
              <div key={idx} className="mb-4 border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.16em]">{idx === 0 ? "Ground floor" : `Floor ${idx + 1}`}</p>
                  {idx > 0 && <button onClick={() => setFloors(floors.filter((_, i) => i !== idx))} className="text-xs text-terracotta underline">Remove</button>}
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
                  {([["sqft", "Area (sq.ft)"], ["bedrooms", "Bedrooms"], ["bathrooms", "Bathrooms"], ["kitchens", "Kitchens"], ["living", "Living rooms"], ["windows", "Windows"]] as [keyof Floor, string][]).map(([k, l]) => (
                    <label key={k} className="grid gap-1 text-xs text-muted-foreground">{l}
                      <input type="number" min={0} className={field} value={f[k] ?? 0} onChange={(e) => setFloor(idx, { [k]: Math.max(0, Number(e.target.value)) })} />
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-[0.7rem] text-muted-foreground">Total windows on this floor — count each room separately (e.g. master bedroom 3, kids room 2, kitchen 1).</p>
              </div>
            ))}
            {floors.length < 6 && (
              <button onClick={() => setFloors([...floors, { ...emptyFloor, kitchens: 0, sqft: 1000, windows: 6 }])} className="border border-border px-4 py-2 text-xs uppercase tracking-[0.16em]">+ Add floor</button>
            )}
          </Section>

          {factors.length > 0 && (
            <Section title="3. Design factors">
              <p className="mb-5 text-xs text-muted-foreground">These choices change how much material and labour your home needs. Compare and pick what suits you.</p>
              <div className="grid gap-8">
                {factors.map((fa) => (
                  <div key={fa.id}>
                    <p className="text-xs uppercase tracking-[0.18em]">{fa.label}</p>
                    {fa.help && <p className="mb-3 mt-1 text-xs text-muted-foreground">{fa.help}</p>}
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {fa.options.map((o) => (
                        <CompareCard key={o.id} on={factorSel[fa.id] === o.id} title={o.label}
                          sub={o.value != null && fa.key === "window_size" ? `${o.value} sq.ft per window` : o.value != null ? `${o.value} per room` : impact(Number(o.multiplier))}
                          benefits={o.benefits} drawbacks={o.drawbacks} onClick={() => setFactorSel({ ...factorSel, [fa.id]: o.id })} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {groups.length > 0 && (
            <Section title="4. Material choices">
              <p className="mb-5 text-xs text-muted-foreground">Compare the options side by side and tap the one you prefer.</p>
              <div className="grid gap-8">
                {groups.map((g) => (
                  <div key={g}>
                    <p className="mb-3 text-xs uppercase tracking-[0.18em]">{GROUP_LABELS[g] ?? g}</p>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {visible.filter((i) => i.option_group === g).map((i) => (
                        <CompareCard key={i.id} on={selections[g] === i.id} title={i.name} sub={`${inr(i.rate)} / ${i.unit}`} benefits={i.benefits} drawbacks={i.drawbacks} onClick={() => setSelections({ ...selections, [g]: i.id })} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {optional.length > 0 && (
            <Section title="5. Optional add-ons">
              {optional.map((i) => (
                <label key={i.id} className="flex items-center gap-3 py-1 text-sm">
                  <input type="checkbox" checked={extras.includes(i.id)} onChange={(e) => setExtras(e.target.checked ? [...extras, i.id] : extras.filter((x) => x !== i.id))} />
                  {i.name} <span className="text-xs text-muted-foreground">({inr(i.rate)} {BASIS_LABELS[i.basis]})</span>
                </label>
              ))}
            </Section>
          )}
        </div>

        <aside className="lg:col-span-5">
          <div className="sticky top-6 border border-border bg-charcoal p-6 text-ivory">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-teak">Estimated total</p>
            <p className="mt-2 font-display text-5xl">{inr(result?.total ?? 0)}</p>
            <p className="mt-1 text-xs text-ivory/60">{result?.sqft ?? 0} sq.ft · approx. {inr(result?.perSqft ?? 0)} / sq.ft</p>
            <div className="mt-6 max-h-[45vh] overflow-y-auto pr-2 text-xs">
              {byCat.map(([cat, lines]) => (
                <div key={cat} className="mb-4">
                  <p className="mb-1 uppercase tracking-[0.16em] text-teak">{cat}</p>
                  {lines.map((l) => (
                    <div key={l.id} className="flex justify-between gap-3 border-b border-ivory/10 py-1">
                      <span className="text-ivory/80">{l.name} <span className="text-ivory/40">· {l.qty.toFixed(l.qty < 10 ? 1 : 0)} {l.unit}</span></span>
                      <span>{inr(l.amount)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-1 border-t border-ivory/20 pt-4 text-xs">
              <Row l="Subtotal" v={result?.subtotal} />
              <Row l={`Contingency (${data.settings!.contingency_pct}%)`} v={result?.contingency} />
              <Row l={`GST (${data.settings!.gst_pct}%)`} v={result?.gst} />
            </div>
            {sent ? (
              <p className="mt-6 text-sm text-teak-light">{sent}</p>
            ) : (
              <button disabled={busy} onClick={send} className="mt-6 w-full border border-teak bg-teak/20 px-4 py-3 text-xs uppercase tracking-[0.2em] hover:bg-teak/35 disabled:opacity-50">
                {busy ? "Sending…" : "Send estimate to D'Casa Homes"}
              </button>
            )}
            <p className="mt-4 text-[0.65rem] leading-relaxed text-ivory/45">
              Indicative estimate based on current Kerala market rates. Final pricing depends on site survey, structural design and final specifications.
            </p>
          </div>
        </aside>
      </div>
    </Shell>
  );
}

const toList = (t: string) => t.split("\n").map((x) => x.trim()).filter((x) => x && x !== "—");
function CompareCard({ on, title, sub, benefits, drawbacks, onClick }: { on: boolean; title: string; sub: string; benefits: string; drawbacks: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`flex flex-col justify-start border p-4 text-left transition-colors ${on ? "border-teak bg-teak/10" : "border-border hover:border-teak/50"}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium">{title}</p>
        {on && <span className="text-[0.6rem] uppercase tracking-[0.16em] text-teak">Selected</span>}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      {toList(benefits).length > 0 && (
        <ul className="mt-3 grid gap-1 text-xs">{toList(benefits).map((b) => <li key={b} className="flex gap-2"><span className="text-palm">+</span>{b}</li>)}</ul>
      )}
      {toList(drawbacks).length > 0 && (
        <ul className="mt-2 grid gap-1 text-xs text-muted-foreground">{toList(drawbacks).map((d) => <li key={d} className="flex gap-2"><span className="text-terracotta">−</span>{d}</li>)}</ul>
      )}
    </button>
  );
}
const impact = (m: number) => (m === 1 ? "Base cost" : m > 1 ? `+${Math.round((m - 1) * 100)}% on affected work` : `−${Math.round((1 - m) * 100)}% on affected work`);

function Row({ l, v }: { l: string; v: number | undefined }) {
  return <div className="flex justify-between"><span className="text-ivory/60">{l}</span><span>{inr(v ?? 0)}</span></div>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="border-t border-border pt-6"><h2 className="mb-4 font-display text-2xl">{title}</h2>{children}</section>;
}
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border"><div className="mx-auto max-w-7xl px-6 py-5 font-display text-xl">D&rsquo;Casa Homes</div></header>
      <main className="mx-auto max-w-7xl px-6 py-12">{children}</main>
    </div>
  );
}
