import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { calculate, type EstimateItem, type EstimateSettings, type Factor } from "./estimate";

async function loadLink(token: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: link } = await supabaseAdmin
    .from("estimate_links")
    .select("id, client_name, expires_at, revoked, note")
    .eq("token", token)
    .maybeSingle();
  if (!link) return { status: "invalid" as const, supabaseAdmin };
  if (link.revoked || new Date(link.expires_at) < new Date())
    return { status: "expired" as const, supabaseAdmin, link };
  return { status: "ok" as const, supabaseAdmin, link };
}

async function loadCatalog(admin: Awaited<ReturnType<typeof loadLink>>["supabaseAdmin"]) {
  const [{ data: items }, { data: settings }, { data: factors }] = await Promise.all([
    admin
      .from("estimate_items")
      .select("id, category, name, description, unit, rate, quantity, basis, scope, option_group, is_default, sort, benefits, drawbacks")
      .eq("active", true)
      .order("sort"),
    admin.from("estimate_settings").select("location_factors, floor_factor, contingency_pct, gst_pct").eq("id", 1).single(),
    admin
      .from("estimate_factors")
      .select("id, key, label, help, applies_to, sort, options:estimate_factor_options(id, label, multiplier, value, benefits, drawbacks, is_default, sort)")
      .order("sort"),
  ]);
  const fs = ((factors ?? []) as unknown as Factor[]).map((f) => ({ ...f, options: [...f.options].sort((a, b) => a.sort - b.sort) }));
  return { items: (items ?? []) as EstimateItem[], settings: settings as unknown as EstimateSettings, factors: fs };
}

export const getEstimator = createServerFn({ method: "GET" })
  .inputValidator((d: { token: string }) => z.object({ token: z.string().min(8).max(64) }).parse(d))
  .handler(async ({ data }) => {
    const r = await loadLink(data.token);
    if (r.status !== "ok")
      return { status: r.status, clientName: r.status === "expired" ? r.link.client_name : null, items: [], factors: [], settings: null, expiresAt: null, note: null };
    const cat = await loadCatalog(r.supabaseAdmin);
    return { status: "ok" as const, clientName: r.link.client_name, expiresAt: r.link.expires_at, note: r.link.note, ...cat };
  });

const floorSchema = z.object({
  sqft: z.number().min(0).max(50000),
  bedrooms: z.number().int().min(0).max(30),
  bathrooms: z.number().int().min(0).max(30),
  kitchens: z.number().int().min(0).max(10),
  living: z.number().int().min(0).max(10),
  windows: z.number().int().min(0).max(100).optional(),
});

export const submitEstimate = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        token: z.string().min(8).max(64),
        inputs: z.object({
          scope: z.enum(["structure", "interior", "both"]),
          location: z.string().max(60),
          floors: z.array(floorSchema).min(1).max(6),
          selections: z.record(z.string(), z.string()),
          extras: z.array(z.string()).max(200),
          factors: z.record(z.string(), z.string()).optional(),
        }),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const r = await loadLink(data.token);
    if (r.status !== "ok") return { ok: false as const, error: "This estimator link has expired." };
    const cat = await loadCatalog(r.supabaseAdmin);
    // Recalculate on the server so admin rates are the source of truth.
    const result = calculate(cat.items, cat.settings, data.inputs, cat.factors);
    const { error } = await r.supabaseAdmin.from("estimate_submissions").insert({
      link_id: r.link.id,
      inputs: data.inputs,
      lines: result.lines,
      total: result.total,
    });
    if (error) {
      console.error(error);
      return { ok: false as const, error: "Could not save your estimate. Please try again." };
    }
    return { ok: true as const, total: result.total };
  });
