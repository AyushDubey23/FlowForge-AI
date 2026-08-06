# Design System & Aesthetic Guidelines — FlowForge AI

This document establishes the official visual design architecture, color palette, typography hierarchy, component standards, and anti-pattern rules for **FlowForge AI**.

---

## 🎨 Color Palette & Theme System

FlowForge AI uses a curated dark mode color architecture designed for developer tools, ensuring high contrast, low eye fatigue, and visual hierarchy.

### 1. Brand & Accent Palette
- **Primary Accent (`--primary`)**: `hsl(263.4 70% 50.4%)` — Vivid Deep Violet `#7C3AED`
- **Primary Hover / Light (`--primary-hover`)**: `hsl(263.4 75% 58%)` — Bright Violet `#8B5CF6`
- **Secondary Accent (`--secondary`)**: `hsl(240 3.7% 15.9%)` — Dark Graphite `#27272A`
- **Accent Glow**: `rgba(124, 58, 237, 0.15)`

### 2. Neutral Surface Palette
- **Canvas Base (`--background`)**: `hsl(240 10% 3.9%)` — Deep Obsidian `#09090B`
- **Card / Panel Surface (`--card`)**: `hsl(240 10% 5.5%)` — Dark Slate `#0E0E11`
- **Border Neutral (`--border`)**: `hsl(240 3.7% 15.9%)` — Subtle Divider `#27272A`
- **Border Highlight (`--border-bright`)**: `hsl(240 5% 26%)` — Focused Border `#3F3F46`

### 3. Text & Typography Colors (High Contrast)
- **Primary Heading (`text-foreground`)**: `#FAFAFA` (Pure high-contrast neutral light)
- **Body Text (`text-foreground/90`)**: `#F4F4F5`
- **Muted Text (`text-muted-foreground`)**: `#A1A1AA` (Crisp readable neutral, never washed out)
- **Subtle Code / Meta (`text-zinc-500`)**: `#71717A`

### 4. Semantic Status Colors
- **Success (Completed)**: `hsl(142.1 70.6% 45.3%)` — Emerald Green `#10B981`
- **Warning (Pending / Paused)**: `hsl(37.7 92.1% 50.2%)` — Amber Gold `#F59E0B`
- **Error (Failed)**: `hsl(0 84.2% 60.2%)` — Crisp Coral Red `#EF4444`
- **Info (Running / Processing)**: `hsl(217.2 91.2% 59.8%)` — Sky Blue `#3B82F6`

---

## 🔤 Typography System

FlowForge AI uses standard Next.js optimized variable fonts: **Geist Sans** for interface text and **Geist Mono** for code, node IDs, and keyboard shortcuts.

### 1. Font Families
- **Interface / Headings**: `var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Code / Monospace**: `var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

### 2. Typographic Scale & Usage
| Scale | Font Size | Weight | Tracking | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display 1** | `2.5rem` (40px) | `700` (Bold) | `-0.03em` | `1.1` | Main landing hero headlines |
| **Heading 1** | `1.875rem` (30px) | `700` (Bold) | `-0.025em` | `1.2` | Main page titles, view headers |
| **Heading 2** | `1.5rem` (24px) | `600` (SemiBold) | `-0.02em` | `1.25` | Section headers, modal titles |
| **Heading 3** | `1.125rem` (18px) | `600` (SemiBold) | `-0.015em` | `1.3` | Card headers, node titles |
| **Body Lead** | `1rem` (16px) | `400` / `500` | `-0.01em` | `1.5` | Lead intro paragraphs |
| **Body Base** | `0.875rem` (14px) | `400` (Normal) | `0em` | `1.5` | Default body text, form fields |
| **Caption / Small** | `0.75rem` (12px) | `500` (Medium) | `0.01em` | `1.4` | Labels, badges, metadata |
| **Mono Code / Shortcut** | `0.75rem` (12px) | `500` (Medium) | `0em` | `1.4` | Keyboard shortcuts, JSON data |

---

## 🚫 Impeccable Anti-Pattern Rules

To maintain high UI standard and eliminate AI slop:
1. **No Decorative Text Gradients**: Avoid `bg-clip-text text-transparent` on headings or metrics. Use crisp solid colors (`text-foreground` or high-contrast accent colors) to maximize legibility.
2. **No Generic Primary Colors**: Avoid raw `blue-500` or generic `purple-500`. Stick strictly to the CSS HSL design tokens (`primary`, `card`, `muted`).
3. **No Unclear Contrast**: Ensure muted text always maintains WCAG AA standard legibility against dark backgrounds (at least `#A1A1AA`).
4. **Consistent Glassmorphism & Elevation**: Use `.glass-panel` and subtle backdrop blurs (`backdrop-blur-md`) with soft 1px borders (`border-white/10`) rather than harsh drop shadows.
