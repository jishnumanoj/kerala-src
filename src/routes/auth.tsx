import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin sign in — D'Casa Homes ERP" },
      { name: "description", content: "Sign in to the D'Casa Homes estimator admin portal." },
      { property: "og:title", content: "Admin sign in — D'Casa Homes ERP" },
      { property: "og:description", content: "Sign in to the D'Casa Homes estimator admin portal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
      else nav({ to: "/admin" });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error) setMsg(error.message);
      else if (data.session) nav({ to: "/admin" });
      else setMsg("Check your email to confirm your account, then sign in.");
    }
    setBusy(false);
  };

  const field = "w-full border border-border bg-background px-4 py-3 text-sm focus:border-teak focus:outline-none";
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <form onSubmit={submit} className="w-full max-w-sm border border-border bg-card p-8">
        <p className="eyebrow">D&rsquo;Casa Homes · ERP</p>
        <h1 className="mt-4 font-display text-3xl text-foreground">
          {mode === "in" ? "Admin sign in" : "Create admin account"}
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">The first account created becomes the administrator.</p>
        <div className="mt-6 grid gap-4">
          <input className={field} type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={field} type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {msg && <p className="text-xs text-terracotta">{msg}</p>}
          <button disabled={busy} className="bg-primary px-4 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-60">
            {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Sign up"}
          </button>
          <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="text-xs text-muted-foreground underline">
            {mode === "in" ? "No account? Sign up" : "Have an account? Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
