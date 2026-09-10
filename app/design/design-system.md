# Nexus Design System

## Principles

1. Product meaning comes before visual spectacle.
2. Quiet surfaces support operational content; they do not decorate every section.
3. One clear primary action per page is better than repeated conversion pressure.
4. Motion communicates hierarchy or live state and respects reduced-motion preferences.
5. Every claim should distinguish live, early-access and planned capability.

---

## Border Radius

Surfaces: 24px

Buttons and inputs: 14px

Small status controls: pills only when their compact shape conveys status.

---

## Shadows

Use a single quiet dark surface with a thin neutral border. Raised surfaces may use one soft shadow; avoid glow stacks and decorative blur.

---

## Animation

Fast, interruptible, 160–240ms ease-out transitions. Do not use constant ambient animation. All nonessential motion must reduce under `prefers-reduced-motion`.

---

## Theme

Dark and light themes share the same semantic roles: canvas, surface, raised surface, border, primary text, supporting copy and status. Marketing components use the `nexus-*` semantic classes or the corresponding CSS variables rather than theme-specific color utilities.

---

## Public Product Architecture

The shared marketing shell owns company navigation, theme controls and the footer. Industry pages and case studies only compose content sections inside that shell. Protected product UI, public demo workspaces and backend integration boundaries remain separate from marketing components.

Product representations must be sanitized public compositions. They may reflect real interface language and information hierarchy, but must not query protected data or imply integrations that have not been configured.

Industry maturity is always explicit:

- Restaurant: pilot ready
- Retail: in development
- Fitness: planned

Custom systems are presented as operational technology built around a workflow, not as a catalogue of commodity development services.

---

## Feeling

Calm, precise, operational and trustworthy.
