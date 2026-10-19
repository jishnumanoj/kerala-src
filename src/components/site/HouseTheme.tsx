import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type HouseTheme = "brown" | "grey";

const STORAGE_KEY = "dcasa-house-theme";

type Ctx = {
  theme: HouseTheme;
  setTheme: (t: HouseTheme) => void;
};

const HouseThemeContext = createContext<Ctx>({ theme: "brown", setTheme: () => {} });

export function useHouseTheme() {
  return useContext(HouseThemeContext);
}

export function HouseThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<HouseTheme>("brown");

  // Restore the visitor's selection after hydration.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "grey" || stored === "brown") setThemeState(stored);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-house", theme);
  }, [theme]);

  const setTheme = useCallback((t: HouseTheme) => {
    setThemeState(t);
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <HouseThemeContext.Provider value={value}>{children}</HouseThemeContext.Provider>;
}

const OPTIONS: { id: HouseTheme; label: string; swatches: string[] }[] = [
  { id: "brown", label: "White & Brown", swatches: ["#F7F3EC", "#9A6B3C"] },
  { id: "grey", label: "White & Grey", swatches: ["#F5F5F5", "#4B4F52"] },
];

/**
 * Premium segmented control for switching the architectural palette.
 * `tone` adapts the control to light or dark grounds.
 */
export function HouseThemeSwitch({
  tone = "dark",
  compact = false,
  className,
}: {
  tone?: "dark" | "light";
  compact?: boolean;
  className?: string;
}) {
  const { theme, setTheme } = useHouseTheme();

  const onDark = tone === "dark";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {!compact && (
        <span
          className={cn(
            "hidden whitespace-nowrap text-[0.55rem] uppercase tracking-[0.22em] xl:inline",
            onDark ? "text-ivory/45" : "text-walnut/45",
          )}
        >
          House Theme
        </span>
      )}
      <div
        role="group"
        aria-label="House theme"
        className={cn(
          "flex items-center gap-1 border p-1 transition-colors duration-700",
          onDark ? "border-ivory/15 bg-charcoal/30" : "border-walnut/15 bg-bone/60",
        )}
      >
        {OPTIONS.map((opt) => {
          const active = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              aria-pressed={active}
              title={opt.label}
              className={cn(
                "flex items-center gap-2 px-2.5 py-1.5 text-[0.55rem] uppercase tracking-[0.18em] transition-all duration-700",
                active
                  ? onDark
                    ? "bg-ivory/12 text-ivory"
                    : "bg-walnut/8 text-walnut"
                  : onDark
                    ? "text-ivory/45 hover:text-ivory/80"
                    : "text-walnut/45 hover:text-walnut/80",
              )}
            >
              <span className="flex shrink-0 items-center">
                {opt.swatches.map((c, i) => (
                  <span
                    key={c}
                    style={{ backgroundColor: c }}
                    className={cn(
                      "inline-block h-3 w-3 rounded-full ring-1 transition-transform duration-700",
                      i === 1 && "-ml-1",
                      active ? "ring-ivory/50" : "ring-transparent",
                      onDark ? "" : "ring-walnut/20",
                    )}
                  />
                ))}
              </span>
              <span className={compact ? "" : "hidden lg:inline"}>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Cross-fades between the two palette interpretations of the same photograph.
 */
export function ThemeImage({
  brown,
  grey,
  alt,
  width,
  height,
  className,
  imgClassName,
  loading = "lazy",
  fetchPriority,
}: {
  brown: string;
  grey: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
}) {
  const { theme } = useHouseTheme();

  return (
    <span className={cn("relative block", className)}>
      <img
        src={brown}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        className={cn(
          "block h-auto w-full transition-opacity duration-700 ease-out",
          theme === "brown" ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
      />
      <img
        src={grey}
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        loading={loading}
        className={cn(
          "absolute inset-0 block h-full w-full transition-opacity duration-700 ease-out",
          theme === "grey" ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
      />
    </span>
  );
}

/**
 * Cross-fades two palette variants inside an existing sized container
 * (parent must be positioned). Both images fill the box with object-cover.
 */
export function ThemeCover({
  brown,
  grey,
  alt,
  className,
  imgClassName,
  loading = "lazy",
}: {
  brown: string;
  grey: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
}) {
  const { theme } = useHouseTheme();

  return (
    <span className={cn("absolute inset-0 block", className)}>
      <img
        src={brown}
        alt={alt}
        loading={loading}
        className={cn(
          "absolute inset-0 block h-full w-full object-cover object-center transition-opacity duration-700 ease-out",
          theme === "brown" ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
      />
      <img
        src={grey}
        alt=""
        aria-hidden="true"
        loading={loading}
        className={cn(
          "absolute inset-0 block h-full w-full object-cover object-center transition-opacity duration-700 ease-out",
          theme === "grey" ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
      />
    </span>
  );
}

