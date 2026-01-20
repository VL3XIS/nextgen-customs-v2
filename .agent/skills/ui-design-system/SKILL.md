---
name: ui-design-system
description: "Start here for all UI/UX tasks. This skill manages the 'Industrial Garage' aesthetic, Tailwind configuration, and component consistency."
---

# TOBY: The Interface Architect

**Mission:** Ensure NextGen Customs V2 looks like a premium, $50k software product.
**Aesthetic:** "Industrial Garage" (Option B).
**Key Characteristics:**
- **Backgrounds:** Dark, grainy, real garage imagery (blurred), overlaid with technical glass panels.
- **Glass:** Dark semi-transparent grey (`bg-neutral-900/60`), heavy blur (`backdrop-blur-xl`), thin borders (`border-white/10`).
- **Accent:** Neon Red (`#FF3B30`) used sparingly for action buttons and alerts.
- **Typography:** Bold, clean, industrial headings (e.g., 'Inter', 'Oswald', or 'Rajdhani').

## 1. Design Tokens (The Rules)

### Colors
| Name | Value | Usage |
| :--- | :--- | :--- |
| `garage-red` | `#DC2626` | Primary Actions, Alerts, Active States |
| `glass-panel` | `bg-zinc-900/70` | Main content cards (The "Glass" effect) |
| `glass-border`| `border-white/10` | Subtle definition for cards |
| `text-primary`| `#FFFFF` | Headings, Main Text |
| `text-muted` | `#9CA3AF` | Labels, Secondary Text |

### Glassmorphism Recipe (Tailwind)
To create a standard card:
```jsx
<div className="bg-zinc-900/70 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-6">
  {/* Content */}
</div>
```

## 2. Component Guidelines

### Buttons
- **Primary:** `bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg px-4 py-2 shadow-lg hover:shadow-red-600/20 transition-all`
- **Secondary:** `bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg px-4 py-2 backdrop-blur-sm transition-all`

### Dashboard Cards
- Must always use the `Glassmorphism Recipe`.
- Headings should be uppercase and tracking-wide (e.g., `tracking-wider uppercase text-xs text-zinc-400`).

## 3. Workflow for UI Changes
1.  **Check Context:** Before changing a color, check `tailwind.config.js`. Do not hardcode hex values like `#333`. Use `bg-zinc-800`.
2.  **Mobile First:** Always verify how a grid looks on mobile (`grid-cols-1 md:grid-cols-3`).
3.  **Animation:** Use `framer-motion` for smooth entry. (e.g., `initial={{ opacity: 0 }} animate={{ opacity: 1 }}`).

## 4. Troubleshooting
- **"It looks too flat":** Add a subtle gradient to the glass background (`bg-gradient-to-br from-zinc-900/80 to-zinc-900/60`).
- **"Text is hard to read":** Increase the opacity of the glass background or add a text shadow.
