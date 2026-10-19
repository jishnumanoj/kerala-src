import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { BASIS_LABELS, inr } from "@/lib/estimate";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Estimator Admin — D'Casa Homes ERP" },
      { name: "description", content: "Manage cost estimator links, material rates and client estimates." },
      { property: "og:title", content: "Estimator Admin — D'Casa Homes ERP" },
      { property: "og:description", content: "Manage cost estimator links, material rates and client estimates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Tab = "links" | "items" | "factors" | "subs" | "settings";
const cell = "border border-border bg-background px-2 py-1.5 text-sm focus:border-teak focus:outline-none";
const btn = "bg-primary px-4 py-2 text-xs uppercase tracking-[0.16em] text-primary-foreground";

function Admin() {
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("links");
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase.rpc("has_role", { _user_id: u.user!.id, _role: "admin" });
      return !!data;
    },
  });
  const signOut = async () => {
    await supabase.auth.signOut();
    nav({ to: "/auth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <header className="border-b border-border bg-charcoal text-ivory">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-teak">D&rsquo;Casa Homes ERP</p>
            <h1 className="font-display text-2xl">Cost Estimator Portal</h1>
          </div>
          <button onClick={signOut} className="text-xs uppercase tracking-[0.2em] text-ivory/70 hover:text-teak">Sign out</button>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-6 px-6 text-xs uppercase tracking-[0.18em]">
          {(
            [
              ["links", "Client links"],
              ["items", "Items & rates"],
              ["factors", "Design factors"],
              ["subs", "Estimates received"],
              ["settings", "Settings"],
            ] as [Tab, string][]
          ).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`border-b-2 pb-3 ${tab === k ? "border-teak text-teak" : "border-transparent text-ivory/60"}`}>
              {l}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !isAdmin ? (
          <p className="text-sm text-muted-foreground">Your account doesn&rsquo;t have admin access. Ask an administrator to grant it.</p>
        ) : tab === "links" ? (
          <Links />
        ) : tab === "items" ? (
          <Items />
        ) : tab === "factors" ? (
          <Factors />
        ) : tab === "subs" ? (
          <Subs />
        ) : (
          <SettingsTab />
        )}
      </main>
    </div>
  );
}

function Links() {
  const qc = useQueryClient();
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await supabase.from("estimate_settings").select("*").eq("id", 1).single()).data,
  });
  const { data: links } = useQuery({
    queryKey: ["links"],
    queryFn: async () => (await supabase.from("estimate_links").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const [form, setForm] = useState({ client_name: "", client_phone: "", client_email: "", note: "", days: "" });

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_name.trim()) { toast("Client name is required."); return; }
    const days = Number(form.days || settings?.default_expiry_days || 7);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("estimate_links").insert({
      client_name: form.client_name.trim(),
      client_phone: form.client_phone || null,
      client_email: form.client_email || null,
      note: form.note || null,
      expires_at: new Date(Date.now() + days * 86400000).toISOString(),
      created_by: u.user?.id ?? null,
    });
    if (error) { toast(error.message); return; }
    setForm({ client_name: "", client_phone: "", client_email: "", note: "", days: "" });
    qc.invalidateQueries({ queryKey: ["links"] });
    toast("Link created.");
  };
  const url = (t: string) => `${window.location.origin}/estimate/${t}`;
  const update = async (id: string, patch: { revoked?: boolean; expires_at?: string }) => {
    await supabase.from("estimate_links").update(patch).eq("id", id);
    qc.invalidateQueries({ queryKey: ["links"] });
  };

  return (
    <div className="grid gap-10">
      <form onSubmit={create} className="grid gap-3 border border-border bg-card p-6 md:grid-cols-6">
        <h2 className="font-display text-2xl md:col-span-6">Send a new estimator link</h2>
        <input className={`${cell} md:col-span-2`} placeholder="Client name *" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
        <input className={cell} placeholder="Phone" value={form.client_phone} onChange={(e) => setForm({ ...form, client_phone: e.target.value })} />
        <input className={`${cell} md:col-span-2`} placeholder="Email" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} />
        <input className={cell} type="number" min={1} placeholder={`Expiry days (${settings?.default_expiry_days ?? 7})`} value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} />
        <input className={`${cell} md:col-span-5`} placeholder="Note shown to client (optional)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        <button className={btn}>Create link</button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <tr><th className="py-2">Client</th><th>Expires</th><th>Status</th><th>Link</th><th /></tr>
          </thead>
          <tbody>
            {links?.map((l) => {
              const expired = new Date(l.expires_at) < new Date();
              const status = l.revoked ? "Revoked" : expired ? "Expired" : "Active";
              return (
                <tr key={l.id} className="border-t border-border">
                  <td className="py-3">{l.client_name}<div className="text-xs text-muted-foreground">{l.client_phone ?? l.client_email}</div></td>
                  <td>{new Date(l.expires_at).toLocaleString("en-IN")}</td>
                  <td className={status === "Active" ? "text-palm" : "text-terracotta"}>{status}</td>
                  <td>
                    <button className="text-xs underline" onClick={() => { navigator.clipboard.writeText(url(l.token)); toast("Link copied."); }}>Copy</button>
                    {" · "}
                    <a className="text-xs underline" href={url(l.token)} target="_blank" rel="noreferrer">Open</a>
                    {l.client_phone && (<>{" · "}<a className="text-xs underline" target="_blank" rel="noreferrer" href={`https://wa.me/${l.client_phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${l.client_name}, here is your D'Casa Homes cost estimator: ${url(l.token)}`)}`}>WhatsApp</a></>)}
                  </td>
                  <td className="text-right text-xs">
                    <button className="underline" onClick={() => update(l.id, { expires_at: new Date(Date.now() + 7 * 86400000).toISOString(), revoked: false })}>+7 days</button>
                    {" · "}
                    <button className="underline" onClick={() => update(l.id, { revoked: !l.revoked })}>{l.revoked ? "Restore" : "Revoke"}</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type ItemRow = {
  id?: string; category: string; name: string; description: string | null; unit: string; rate: number; quantity: number;
  basis: string; scope: string; option_group: string | null; is_default: boolean; active: boolean; sort: number; benefits: string; drawbacks: string;
};

function Items() {
  const qc = useQueryClient();
  const { data: items } = useQuery({
    queryKey: ["items"],
    queryFn: async () => ((await supabase.from("estimate_items").select("*").order("sort")).data ?? []) as ItemRow[],
  });
  const [edits, setEdits] = useState<Record<string, Partial<ItemRow>>>({});
  const set = (id: string, patch: Partial<ItemRow>) => setEdits((e) => ({ ...e, [id]: { ...e[id], ...patch } }));

  const saveAll = async () => {
    for (const [id, patch] of Object.entries(edits)) {
      const { error } = await supabase.from("estimate_items").update(patch).eq("id", id);
      if (error) { toast(error.message); return; }
    }
    setEdits({});
    qc.invalidateQueries({ queryKey: ["items"] });
    toast("Rates saved.");
  };
  const add = async () => {
    await supabase.from("estimate_items").insert({ category: "Miscellaneous", name: "New item", unit: "nos", rate: 0, quantity: 1, basis: "lumpsum", scope: "structure", sort: 999 });
    qc.invalidateQueries({ queryKey: ["items"] });
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await supabase.from("estimate_items").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["items"] });
  };
  const dirty = Object.keys(edits).length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl">Items &amp; rates</h2>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
            Quantity is multiplied by the basis (e.g. 4 kg steel per sq.ft). Items sharing a &ldquo;choice group&rdquo; are
            alternatives — the client picks one, and the default is pre-selected. Ungrouped items marked default are always
            included; ungrouped non-default items appear as optional add-ons.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={add} className="border border-border px-4 py-2 text-xs uppercase tracking-[0.16em]">Add item</button>
          <button onClick={saveAll} disabled={!dirty} className={`${btn} disabled:opacity-40`}>Save {dirty ? `(${dirty})` : ""}</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] text-sm">
          <thead className="text-left text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
            <tr><th>Category</th><th>Item</th><th>Unit</th><th>Rate ₹</th><th>Qty</th><th>Basis</th><th>Scope</th><th>Choice group</th><th>Default</th><th>Active</th><th /></tr>
          </thead>
          <tbody>
            {items?.map((raw) => {
              const i = { ...raw, ...edits[raw.id!] };
              const id = raw.id!;
              return (
                <Fragment key={id}>
                <tr className="border-t border-border">
                  <td className="py-1 pr-1"><input className={`${cell} w-36`} value={i.category} onChange={(e) => set(id, { category: e.target.value })} /></td>
                  <td className="pr-1"><input className={`${cell} w-56`} value={i.name} onChange={(e) => set(id, { name: e.target.value })} /></td>
                  <td className="pr-1"><input className={`${cell} w-20`} value={i.unit} onChange={(e) => set(id, { unit: e.target.value })} /></td>
                  <td className="pr-1"><input type="number" className={`${cell} w-24`} value={i.rate} onChange={(e) => set(id, { rate: Number(e.target.value) })} /></td>
                  <td className="pr-1"><input type="number" step="0.001" className={`${cell} w-20`} value={i.quantity} onChange={(e) => set(id, { quantity: Number(e.target.value) })} /></td>
                  <td className="pr-1">
                    <select className={cell} value={i.basis} onChange={(e) => set(id, { basis: e.target.value })}>
                      {Object.entries(BASIS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </td>
                  <td className="pr-1">
                    <select className={cell} value={i.scope} onChange={(e) => set(id, { scope: e.target.value })}>
                      <option value="structure">Structure</option><option value="interior">Interior</option>
                    </select>
                  </td>
                  <td className="pr-1"><input className={`${cell} w-32`} value={i.option_group ?? ""} placeholder="—" onChange={(e) => set(id, { option_group: e.target.value || null })} /></td>
                  <td className="text-center"><input type="checkbox" checked={i.is_default} onChange={(e) => set(id, { is_default: e.target.checked })} /></td>
                  <td className="text-center"><input type="checkbox" checked={i.active} onChange={(e) => set(id, { active: e.target.checked })} /></td>
                  <td><button onClick={() => remove(id)} className="text-xs text-terracotta underline">Delete</button></td>
                </tr>
                <tr>
                  <td colSpan={11} className="pb-3">
                    <div className="grid gap-2 md:grid-cols-2">
                      <label className="grid gap-1 text-[0.65rem] uppercase tracking-[0.14em] text-palm">Benefits (one per line)
                        <textarea rows={2} className={cell} value={i.benefits} onChange={(e) => set(id, { benefits: e.target.value })} />
                      </label>
                      <label className="grid gap-1 text-[0.65rem] uppercase tracking-[0.14em] text-terracotta">Drawbacks (one per line)
                        <textarea rows={2} className={cell} value={i.drawbacks} onChange={(e) => set(id, { drawbacks: e.target.value })} />
                      </label>
                    </div>
                  </td>
                </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Subs() {
  const [open, setOpen] = useState<string | null>(null);
  const { data } = useQuery({
    queryKey: ["subs"],
    queryFn: async () =>
      (await supabase.from("estimate_submissions").select("*, estimate_links(client_name, client_phone)").order("created_at", { ascending: false })).data ?? [],
  });
  if (!data?.length) return <p className="text-sm text-muted-foreground">No estimates submitted yet.</p>;
  return (
    <div className="grid gap-3">
      {data.map((s) => {
        const inp = s.inputs as { scope: string; location: string; floors: { sqft: number }[] };
        const lines = s.lines as { name: string; qty: number; unit: string; amount: number }[];
        return (
          <div key={s.id} className="border border-border bg-card p-5">
            <button className="flex w-full flex-wrap items-center justify-between gap-3 text-left" onClick={() => setOpen(open === s.id ? null : s.id)}>
              <div>
                <p className="font-display text-xl">{s.estimate_links?.client_name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(s.created_at).toLocaleString("en-IN")} · {inp.location} · {inp.floors.length} floor(s) ·{" "}
                  {inp.floors.reduce((a, f) => a + f.sqft, 0)} sq.ft · {inp.scope}
                </p>
              </div>
              <p className="font-display text-2xl text-teak">{inr(Number(s.total))}</p>
            </button>
            {open === s.id && (
              <table className="mt-4 w-full text-xs">
                <tbody>
                  {lines.map((l, idx) => (
                    <tr key={idx} className="border-t border-border"><td className="py-1">{l.name}</td><td>{l.qty.toFixed(1)} {l.unit}</td><td className="text-right">{inr(l.amount)}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}

type Settings = { default_expiry_days: string; floor_factor: string; contingency_pct: string; gst_pct: string; location_factors: string };
function SettingsTab() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await supabase.from("estimate_settings").select("*").eq("id", 1).single()).data,
  });
  const [draft, setDraft] = useState<Settings | null>(null);
  if (!data) return null;
  const v = draft ?? {
    default_expiry_days: String(data.default_expiry_days),
    floor_factor: String(data.floor_factor),
    contingency_pct: String(data.contingency_pct),
    gst_pct: String(data.gst_pct),
    location_factors: JSON.stringify(data.location_factors, null, 2),
  };
  const save = async () => {
    let lf;
    try { lf = JSON.parse(v.location_factors); } catch { { toast("Location factors must be valid JSON."); return; } }
    const { error } = await supabase.from("estimate_settings").update({
      default_expiry_days: Number(v.default_expiry_days), floor_factor: Number(v.floor_factor),
      contingency_pct: Number(v.contingency_pct), gst_pct: Number(v.gst_pct), location_factors: lf,
    }).eq("id", 1);
    if (error) { toast(error.message); return; }
    setDraft(null);
    qc.invalidateQueries({ queryKey: ["settings"] });
    toast("Settings saved.");
  };
  const row = (k: keyof Settings, label: string) => (
    <label className="grid gap-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
      {label}
      <input className={cell} value={v[k]} onChange={(e) => setDraft({ ...v, [k]: e.target.value })} />
    </label>
  );
  return (
    <div className="grid max-w-xl gap-5">
      <h2 className="font-display text-3xl">Settings</h2>
      {row("default_expiry_days", "Default link expiry (days)")}
      {row("floor_factor", "Extra cost per upper floor (e.g. 0.04 = 4%)")}
      {row("contingency_pct", "Contingency %")}
      {row("gst_pct", "GST %")}
      <label className="grid gap-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        Location cost factors
        <textarea rows={9} className={`${cell} font-mono`} value={v.location_factors} onChange={(e) => setDraft({ ...v, location_factors: e.target.value })} />
      </label>
      <button onClick={save} className={btn}>Save settings</button>
    </div>
  );
}

type Opt = { id: string; factor_id: string; label: string; multiplier: number; value: number | null; benefits: string; drawbacks: string; is_default: boolean; sort: number };

function Factors() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["factors"],
    queryFn: async () => {
      const [{ data: f }, { data: o }] = await Promise.all([
        supabase.from("estimate_factors").select("*").order("sort"),
        supabase.from("estimate_factor_options").select("*").order("sort"),
      ]);
      return { factors: f ?? [], options: (o ?? []) as Opt[] };
    },
  });
  const [edits, setEdits] = useState<Record<string, Partial<Opt>>>({});
  const [fEdits, setFEdits] = useState<Record<string, { label?: string; help?: string; applies_to?: string[] }>>({});
  const dirty = Object.keys(edits).length + Object.keys(fEdits).length;
  const reload = () => qc.invalidateQueries({ queryKey: ["factors"] });

  const save = async () => {
    for (const [id, p] of Object.entries(fEdits)) {
      const { error } = await supabase.from("estimate_factors").update(p).eq("id", id);
      if (error) { toast(error.message); return; }
    }
    for (const [id, p] of Object.entries(edits)) {
      const { error } = await supabase.from("estimate_factor_options").update(p).eq("id", id);
      if (error) { toast(error.message); return; }
    }
    setEdits({}); setFEdits({}); reload(); toast("Design factors saved.");
  };
  const addOpt = async (factor_id: string) => {
    await supabase.from("estimate_factor_options").insert({ factor_id, label: "New option", multiplier: 1, sort: 99 });
    reload();
  };
  const delOpt = async (id: string) => {
    if (!confirm("Delete this option?")) return;
    await supabase.from("estimate_factor_options").delete().eq("id", id);
    reload();
  };
  if (!data) return null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl">Design factors</h2>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
            Each factor multiplies the cost of the categories it applies to (leave empty for all). Multiplier 1 = base cost,
            1.10 = +10%. For window size the value is sq.ft per window; for windows per room it is the count.
          </p>
        </div>
        <button onClick={save} disabled={!dirty} className={`${btn} disabled:opacity-40`}>Save {dirty ? `(${dirty})` : ""}</button>
      </div>
      <div className="grid gap-6">
        {data.factors.map((f) => {
          const fv = { ...f, ...fEdits[f.id] };
          return (
            <div key={f.id} className="border border-border bg-card p-5">
              <div className="grid gap-2 md:grid-cols-3">
                <input className={`${cell} font-display text-lg`} value={fv.label} onChange={(e) => setFEdits({ ...fEdits, [f.id]: { ...fEdits[f.id], label: e.target.value } })} />
                <input className={`${cell} md:col-span-2`} value={fv.help} placeholder="Explanation for clients" onChange={(e) => setFEdits({ ...fEdits, [f.id]: { ...fEdits[f.id], help: e.target.value } })} />
                <input className={`${cell} md:col-span-3 text-xs`} value={fv.applies_to.join(", ")} placeholder="Applies to categories (comma separated) — empty = all"
                  onChange={(e) => setFEdits({ ...fEdits, [f.id]: { ...fEdits[f.id], applies_to: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) } })} />
              </div>
              <div className="mt-4 grid gap-3">
                {data.options.filter((o) => o.factor_id === f.id).map((raw) => {
                  const o = { ...raw, ...edits[raw.id] };
                  const set = (p: Partial<Opt>) => setEdits({ ...edits, [raw.id]: { ...edits[raw.id], ...p } });
                  return (
                    <div key={raw.id} className="grid gap-2 border-t border-border pt-3 md:grid-cols-12">
                      <input className={`${cell} md:col-span-3`} value={o.label} onChange={(e) => set({ label: e.target.value })} />
                      <label className="flex items-center gap-1 text-xs md:col-span-2">×<input type="number" step="0.01" className={`${cell} w-full`} value={o.multiplier} onChange={(e) => set({ multiplier: Number(e.target.value) })} /></label>
                      <input type="number" className={`${cell} md:col-span-2`} placeholder="Value" value={o.value ?? ""} onChange={(e) => set({ value: e.target.value === "" ? null : Number(e.target.value) })} />
                      <label className="flex items-center gap-2 text-xs md:col-span-2"><input type="checkbox" checked={o.is_default} onChange={(e) => set({ is_default: e.target.checked })} />Default</label>
                      <button onClick={() => delOpt(raw.id)} className="text-left text-xs text-terracotta underline md:col-span-3">Delete</button>
                      <textarea rows={2} className={`${cell} md:col-span-6`} placeholder="Benefits (one per line)" value={o.benefits} onChange={(e) => set({ benefits: e.target.value })} />
                      <textarea rows={2} className={`${cell} md:col-span-6`} placeholder="Drawbacks (one per line)" value={o.drawbacks} onChange={(e) => set({ drawbacks: e.target.value })} />
                    </div>
                  );
                })}
              </div>
              <button onClick={() => addOpt(f.id)} className="mt-3 text-xs underline">+ Add option</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
