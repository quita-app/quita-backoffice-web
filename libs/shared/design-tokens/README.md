# shared-design-tokens

Quita design system (Céu) for shell, operations and analytics. **Copies** of `quita-docs/design/tokens/` and `quita-docs/design/assets/`: never change a value here. Change it in `quita-docs` first, then copy the file again.

| File | What it is |
| --- | --- |
| `src/tokens.css` | All CSS variables (light on `:root`, dark on `.dark` / `[data-theme="dark"]`), base, `q-*` keyframes, reduced motion. Loaded by every app. |
| `src/tailwind.css` | Tailwind 4 theme (`@theme inline`). Import after `tailwindcss` and `tokens.css`, only in an app that uses Tailwind. |
| `src/components.css` | Reference CSS of every prototype component. Spec for the Spartan/shadcn variants below; importing it is optional. |
| `src/assets/` | Brand SVGs, Pix icon, favicons. Served at `/assets/<file>` by shell and operations. |

## How it reaches each app

- **shell, operations:** `tokens.css` in `project.json` → `styles`; `src/assets` in `project.json` → `assets` (output `assets`).
- **analytics:** `apps/analytics/src/styles.css` imports `tokens.css` and is injected into the Shadow DOM (keyframes are scoped, so they must be inside). Variables inherit from the shell document. Assets come from the shell's `/assets` at runtime.
- **Font:** Geist and Geist Mono from Google Fonts in each `index.html`.
- **Icons:** Lucide, stroke 1.8. Pix: `assets/global-icone-pix.svg`.

## Variant map (`components.css` → Spartan UI / shadcn/ui)

Sizes in px. Colors are token names. States: hover, `:focus-visible` (3px `--ring`, offset 3), disabled (opacity .42), loading (`aria-busy`, 16px spinner `q-spin`).

| Component | Spartan / shadcn | Variant | Spec from `components.css` |
| --- | --- | --- | --- |
| Button | Button | base | h 48, px 22, 16/500, `rounded-pill`, border 1.5 transparent, gap 8, active scale .98 |
| | | size `lg` / `sm` / `icon` | h 56 px 28 17px / h 36 px 14 14px / 48×48 (36×36 with `sm`), round |
| | | `default` (primary) | `--primary` / `--primary-foreground`; hover: mix 84% primary + `--signature` |
| | | `signature` (new) | `--signature` / `--signature-foreground`; hover: mix 86% signature + foreground. One per screen |
| | | `outline` (secondary) | transparent, text `--foreground`, border `--input`; hover `--accent` |
| | | `ghost` | transparent; hover `--accent` / `--accent-foreground` |
| | | `destructive` | outline: text and border `--destructive`; hover fills `--destructive` / `--destructive-foreground` |
| Input + Label | Input, Label, Form Field | default | label 14/500; control h 52, px 16, `rounded-field`, border 1.5 `--input`, bg `--card`, text 17; hint 13/18 `--muted-foreground` |
| | | focus / error / disabled | border `--ring` + ring 2 / border and hint `--destructive` / bg `--muted`, border `--border` |
| Input OTP | Input OTP | cell | 48×58, `rounded-field`, border 1.5 `--input`, 24/500 tabular; active: `--ring` + ring 2 and `q-caret`; error: `--destructive` |
| Slider | Slider | simulator | track h 10 `rounded-pill` `--accent`; thumb 34, `--primary`, border 6 `--card`, shadow `--elevation-thumb`; focus ring 6 `--ring` |
| Badge | Badge | base | h 28, px 11, 13/16 500, `rounded-pill`, nowrap |
| | | `open` / `negotiating` / `agreement` / `paid` / `broken` | outline `--input` / `--secondary` + inset `--info` 55% / `--signature` / `--celebrate` / outline and text `--destructive` |
| | | aging 1–5 (new) | `--aging-1` … `--aging-5`, always with the range text and the 5-step meter |
| Filter pill | Toggle Group | `pill` | h 40, px 16, 14px, border 1.5 `--border`, bg `--card`; hover `--accent`; pressed `--primary` with count at opacity .65 |
| Segmented / Tabs | Tabs / Toggle Group | `seg` | track `--muted` p 4 gap 4 pill; item 14/500 `--muted-foreground`; active `--card` + `--elevation-raised` |
| Card | Card | default / KPI / KPI signature | bg `--card`, `rounded-card`, p 24, no shadow / number 48/52 300 −4% tabular / `--signature` |
| Table | Table | row / header / selected / new | min-h 60, px 20, gap 12, border-top `--border`, 14/20 / min-h 44, 13/500 `--muted-foreground` on `--muted` / `--accent` / mix 22% `--celebrate` |
| Toast | Sonner / Toast | default / success | `--primary` bg, `rounded-card`, p 12 12 12 16, `--elevation-float` / 28px `--celebrate` mark |
| Sheet | Sheet | right | w 420 (`--sheet-width`), inset 16, `rounded-card`, `--card`, `--elevation-float`, scrim `--scrim` |
| Dialog / Alert Dialog | Dialog | default | w 440, p 28, `rounded-card`, `--popover`, `--elevation-float` |
| Popover / Dropdown | Popover, Dropdown Menu | default | w 380, p 8, `rounded-card`, `--popover`, `--elevation-float`; item p 12 `rounded-field`, divider `--border` |
| Switch | Switch | default | 44×26 pill, off `--input`, on `--primary` |
| Checkbox | Checkbox | default | 22×22, radius 7, border 1.5 `--input`; checked `--primary` |
| Skeleton | Skeleton | default | `rounded-pill`, gradient `--muted` → `--accent`, `q-shimmer` 1.6s (stops on reduced motion) |
| Alert | Alert | `notice` | p 14 16, `rounded-field`, `--secondary`, left bar 3px in the state color (`--info`, `--warning`, `--destructive`, `--success`) |
| Avatar | Avatar | default | 44 round, 15/500, `--secondary` |
| Upload | (custom) | `drop` | border 1.5 dashed `--input`, `rounded-card`, p 32, `--card` |
| Navigation rail | Sidebar | `rail` | w 232 / 76 collapsed, `--card`, border-right `--border`; item min-h 44, 14px, radius 14; active `--primary` |
| Top bar | (custom) | `gtb` | h 68 (`--topbar-height`), px 28, border-bottom `--border`, bg `--background` |

Never wrap: badge, pill, button text, money, date, CPF, KPI number, column header (`white-space: nowrap`).
