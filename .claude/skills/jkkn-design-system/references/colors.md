# Color Tokens

All values are the exact tokens defined in `app/globals.css`. The file has three layers:

1. `:root` — raw CSS variables (brand + semantic + sidebar + charts)
2. `@theme inline` — maps raw variables to Tailwind v4 theme tokens (so `bg-primary`, `text-foreground`, etc. work)
3. `.dark` — overrides the raw variables for dark mode

Using a semantic Tailwind utility (`bg-primary`, `bg-background`, `text-muted-foreground`) is preferred over referencing the raw CSS variable directly, because the utility automatically adapts to dark mode.

---

## 1. Brand Palette

### Primary Green (the JKKN green)

| CSS variable               | Light mode  | Dark mode   | Tailwind class          | Notes                                              |
|----------------------------|-------------|-------------|-------------------------|----------------------------------------------------|
| `--brand-primary`          | `#0b6d41`   | `#0f8f56`   | `bg-brand-primary`      | Primary brand green; also mapped to `--primary`    |
| `--brand-primary-light`    | `#0f8f56`   | `#3bb583`   | `bg-brand-primary-light` | Hover/lighter surfaces                            |
| `--brand-primary-dark`     | `#085032`   | `#0b6d41`   | `bg-brand-primary-dark`  | Pressed states, gradients                         |
| `--brand-primary-darker`   | `#032816`   | (same)      | CSS var only            | Bottom stop of dark-green gradients                |
| `--brand-primary-lighter`  | `#d4f1e4`   | (same)      | CSS var only            | Light surfaces; also mapped to `--accent` (light)  |

### Secondary Yellow (gold accent)

| CSS variable             | Light mode  | Dark mode   | Tailwind class           |
|--------------------------|-------------|-------------|--------------------------|
| `--brand-secondary`      | `#ffde59`   | `#ffea9a`   | `bg-brand-secondary`     |
| `--brand-secondary-light`| `#ffea9a`   | `#fff3c7`   | `bg-brand-secondary-light` |
| `--brand-secondary-dark` | `#e6c64d`   | (same)      | CSS var only             |

### Cream Background

| CSS variable      | Light mode  | Dark mode   | Tailwind class       |
|-------------------|-------------|-------------|----------------------|
| `--brand-cream`   | `#fbfbee`   | `#1a1a1a`   | `bg-brand-cream` or `bg-cream` |

### Supplementary Gold

| CSS variable         | Light mode  | Usage                                  |
|----------------------|-------------|----------------------------------------|
| `--brand-gold`       | `#ffd700`   | Decorative gold for rings, gradients   |
| `--brand-gold-light` | `#ffdf4d`   | Lighter gold accent                    |

---

## 2. Accessible Gold System (WCAG AA/AAA)

Gold is low-contrast. **Never use raw `#D4AF37` for text** — pick the right tier for the background context.

| CSS variable          | Hex (light) | Hex (dark)  | Contrast ratio          | Use for                                     |
|-----------------------|-------------|-------------|-------------------------|---------------------------------------------|
| `--gold-decorative`   | `#D4AF37`   | (same)      | 2.8:1 (fails AA text)   | Backgrounds, borders, rings — **NOT text**  |
| `--gold-text`         | `#735E1E`   | (same)      | 6.27:1 (AA+ on light)   | Text on white/light backgrounds             |
| `--gold-text-aa`      | `#735E1E`   | (same)      | 6.27:1                  | Alias of `--gold-text`; AA-minimum text     |
| `--gold-text-large`   | `#A88B2F`   | (same)      | 3.28:1 (AA large only)  | Large text ≥18pt on light backgrounds       |
| `--gold-accent`       | → decorative | (same)     | —                       | Default accent color                        |
| `--gold-on-light`     | → text      | (same)      | —                       | Semantic: gold text on light bg             |
| `--gold-on-dark`      | → decorative | `#F4D03F`  | —                       | Semantic: gold text on dark bg              |

**Tailwind utilities (from `@theme inline`):** `text-gold-text`, `text-gold-text-large`, `bg-gold-decorative`, `text-gold-on-light`, `text-gold-on-dark`.

**Rule of thumb:**

- Dark green / dark image backgrounds → `--brand-secondary` (`#ffde59`) or `--gold-on-dark`
- White / cream backgrounds, body text size → `--gold-text` (`#735E1E`)
- White / cream backgrounds, large headings → `--gold-text-large` (`#A88B2F`)
- Decorative only (never for text) → `--gold-decorative` (`#D4AF37`)

---

## 3. Semantic (shadcn-Mapped) Tokens

These are the shadcn/ui slots, remapped to JKKN brand values. Use the Tailwind utility whenever possible — dark mode switches automatically.

| CSS variable              | Light value          | Dark value              | Tailwind class              |
|---------------------------|----------------------|-------------------------|-----------------------------|
| `--background`            | `#fbfbee`            | `#0f0f0f`               | `bg-background`             |
| `--foreground`            | `#171717`            | `#fafafa`               | `text-foreground`           |
| `--card`                  | `#ffffff`            | `rgba(38,38,38,0.8)`    | `bg-card`                   |
| `--card-foreground`       | `#171717`            | `#fafafa`               | `text-card-foreground`      |
| `--popover`               | `#ffffff`            | `#1a1a1a`               | `bg-popover`                |
| `--popover-foreground`    | `#171717`            | `#fafafa`               | `text-popover-foreground`   |
| `--primary`               | `#0b6d41`            | `#0f8f56`               | `bg-primary`                |
| `--primary-foreground`    | `#ffffff`            | `#ffffff`               | `text-primary-foreground`   |
| `--secondary`             | `#ffde59`            | `#ffea9a`               | `bg-secondary`              |
| `--secondary-foreground`  | `#171717`            | `#171717`               | `text-secondary-foreground` |
| `--muted`                 | `#f5f5f0`            | `#262626`               | `bg-muted`                  |
| `--muted-foreground`      | `#525252`            | `#a3a3a3`               | `text-muted-foreground`     |
| `--accent`                | `#d4f1e4`            | `rgba(15,143,86,0.2)`   | `bg-accent`                 |
| `--accent-foreground`     | `#085032`            | `#3bb583`               | `text-accent-foreground`    |
| `--destructive`           | `#dc2626`            | `#f87171`               | `bg-destructive`            |
| `--border`                | `#e5e5e5`            | `rgba(255,255,255,0.1)` | `border-border`             |
| `--input`                 | `#e5e5e5`            | `rgba(255,255,255,0.15)`| `border-input`              |
| `--ring`                  | `#0b6d41`            | `#0f8f56`               | `ring-ring`                 |

---

## 4. Chart Colors

Ordered series palette for Recharts / any data viz.

| Token      | Light     | Dark      | Role                    |
|------------|-----------|-----------|-------------------------|
| `--chart-1` | `#0b6d41` | `#3bb583` | Primary (brand green)   |
| `--chart-2` | `#ffde59` | `#ffea9a` | Secondary (brand gold)  |
| `--chart-3` | `#3b82f6` | `#60a5fa` | Blue                    |
| `--chart-4` | `#f59e0b` | `#fbbf24` | Amber                   |
| `--chart-5` | `#8b5cf6` | `#a78bfa` | Violet                  |

Tailwind: `fill-chart-1` / `stroke-chart-2` / etc.

---

## 5. Sidebar (Admin Panel, Glassmorphism)

| CSS variable                     | Light                            | Dark                              |
|----------------------------------|----------------------------------|-----------------------------------|
| `--sidebar`                      | `rgba(255,255,255,0.85)`         | `rgba(26,26,26,0.9)`              |
| `--sidebar-foreground`           | `#171717`                        | `#fafafa`                         |
| `--sidebar-primary`              | `#0b6d41`                        | `#0f8f56`                         |
| `--sidebar-primary-foreground`   | `#ffffff`                        | `#ffffff`                         |
| `--sidebar-accent`               | `rgba(11,109,65,0.1)`            | `rgba(15,143,86,0.2)`             |
| `--sidebar-accent-foreground`    | `#0b6d41`                        | `#3bb583`                         |
| `--sidebar-border`               | `rgba(11,109,65,0.15)`           | `rgba(255,255,255,0.1)`           |
| `--sidebar-ring`                 | `#0b6d41`                        | `#0f8f56`                         |

Tailwind: `bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-accent`, etc.

---

## 6. Border Radius Scale

| Token        | Value                     | Tailwind class |
|--------------|---------------------------|----------------|
| `--radius`   | `0.625rem` (10px)         | — (base)       |
| `--radius-sm` | `calc(var(--radius) - 4px)` | `rounded-sm` |
| `--radius-md` | `calc(var(--radius) - 2px)` | `rounded-md` |
| `--radius-lg` | `var(--radius)`           | `rounded-lg`   |
| `--radius-xl` | `calc(var(--radius) + 4px)` | `rounded-xl` |
