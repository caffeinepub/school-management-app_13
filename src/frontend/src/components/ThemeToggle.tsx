import type { ThemeType } from "../hooks/useTheme";

interface ThemeToggleProps {
  theme: ThemeType;
  onThemeChange: (t: ThemeType) => void;
}

const themes: { key: ThemeType; label: string; dot: string; title: string }[] =
  [
    {
      key: "gold",
      label: "Gold",
      dot: "oklch(0.78 0.18 85)",
      title: "Blue + Gold",
    },
    {
      key: "silver",
      label: "Silver",
      dot: "oklch(0.82 0.02 240)",
      title: "Blue + Silver",
    },
    {
      key: "dark",
      label: "Dark",
      dot: "oklch(0.15 0 0)",
      title: "Black + White",
    },
  ];

export default function ThemeToggle({
  theme,
  onThemeChange,
}: ThemeToggleProps) {
  return (
    <div
      className="flex items-center gap-1 p-1 rounded-full border border-accent/30 bg-card/50"
      data-ocid="header.theme_toggle"
    >
      {themes.map((t) => {
        const isActive = theme === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onThemeChange(t.key)}
            title={t.title}
            data-ocid={`header.theme_toggle.${t.key === "gold" ? "1" : t.key === "silver" ? "2" : "3"}`}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              isActive
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
              style={{ background: t.dot }}
            />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
