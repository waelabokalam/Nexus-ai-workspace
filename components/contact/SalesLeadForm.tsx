"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import type { ContactMethod, CurrentChannel, Industry, Interest, LocationCount } from "@/lib/sales-lead";

type InitialAttribution = {
  industry: Industry;
  source_page: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

type FormState = {
  full_name: string;
  email: string;
  phone: string;
  preferred_contact_method: ContactMethod;
  business_name: string;
  website_url: string;
  country: string;
  city: string;
  location_count: LocationCount | "";
  current_channels: CurrentChannel[];
  interested_in: Interest[];
  pain_point: string;
  industry: Industry;
  company_website: string;
};

const channelChoices: Array<[CurrentChannel, string]> = [
  ["website", "Website"],
  ["whatsapp", "WhatsApp"],
  ["instagram", "Instagram"],
  ["phone", "Phone"],
  ["delivery_marketplace", "Delivery marketplace"],
  ["in_store_only", "In-store only"],
  ["other", "Other"],
];

const interestChoices: Array<[Interest, string]> = [
  ["too_many_systems", "Too many disconnected systems"],
  ["customer_messages", "Customer messages"],
  ["reservations", "Reservations"],
  ["reviews_reputation", "Reviews and reputation"],
  ["manager_reporting", "Manager reporting"],
  ["repetitive_admin", "Repetitive admin work"],
  ["customer_retention", "Customer retention"],
  ["multi_location_operations", "Multi-location operations"],
  ["supplier_invoice_work", "Supplier and invoice work"],
  ["direct_customer_channel", "Customer-facing direct channel"],
  ["custom_workflow", "Something custom"],
];

function initialFormState(industry: Industry): FormState {
  return {
    full_name: "",
    email: "",
    phone: "",
    preferred_contact_method: "whatsapp",
    business_name: "",
    website_url: "",
    country: "",
    city: "",
    location_count: "",
    current_channels: [],
    interested_in: [],
    pain_point: "",
    industry,
    company_website: "",
  };
}

function toggleSelection<T extends string>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function MultiSelectButton({ selected, children, onClick }: { selected: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      aria-pressed={selected}
      className="nexus-choice nexus-focus min-h-11 rounded-xl px-3.5 py-2.5 text-left text-sm"
      data-selected={selected ? "true" : "false"}
      onClick={onClick}
      type="button"
    >
      <span aria-hidden="true" className="nexus-choice__indicator" />
      {children}
    </button>
  );
}

export default function SalesLeadForm({ initialAttribution, contactEmail }: { initialAttribution: InitialAttribution; contactEmail?: string }) {
  const [form, setForm] = useState<FormState>(() => initialFormState(initialAttribution.industry));
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const phoneRequired = form.preferred_contact_method !== "email";

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    if (form.current_channels.length === 0 || form.interested_in.length === 0) {
      setState("error");
      setMessage(form.current_channels.length === 0 ? "Choose at least one way customers contact you." : "Choose at least one area you want to improve.");
      return;
    }

    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/sales/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phone: form.phone || null,
          website_url: form.website_url || null,
          pain_point: form.pain_point || null,
          source_page: initialAttribution.source_page,
          utm_source: initialAttribution.utm_source,
          utm_medium: initialAttribution.utm_medium,
          utm_campaign: initialAttribution.utm_campaign,
          form_started_at: startedAt.current,
        }),
      });
      const result = await response.json() as { ok?: boolean; error?: string; field?: string };

      if (!response.ok || !result.ok) {
        setState("error");
        setMessage(result.error || "We could not submit your request. Please try again.");
        if (result.field) {
          formRef.current?.querySelector<HTMLElement>(`[name="${result.field}"]`)?.focus();
        }
        return;
      }

      setState("success");
    } catch {
      setState("error");
      setMessage("We could not reach Nexus right now. Your form has been preserved so you can try again.");
    }
  }

  if (state === "success") {
    return (
      <section aria-live="polite" className="nexus-surface flex min-h-[38rem] flex-col justify-between rounded-[var(--nexus-radius-surface)] p-6 sm:p-8">
        <div>
          <span aria-hidden="true" className="grid size-11 place-items-center rounded-full border border-[var(--nexus-border-strong)] text-[var(--nexus-text)]"><svg fill="none" height="18" viewBox="0 0 24 24" width="18"><path d="m7 12.5 3.2 3.2L17.5 8.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg></span>
          <p className="nexus-subtle mt-8 text-xs font-medium uppercase tracking-[0.16em]">Submission complete</p>
          <h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.05em]">Request received.</h2>
          <p className="nexus-copy mt-5 max-w-xl text-base leading-7">We&apos;ve received the information about your business and will review the workflow before contacting you.</p>
        </div>
        <div className="mt-12 border-t border-[var(--nexus-border)] pt-6">
          <p className="nexus-heading text-sm font-medium">While you&apos;re here</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link className="nexus-button-secondary nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] px-4 text-sm font-medium" href="/case-studies/crave-it">View Crave It</Link>
            <Link className="nexus-button-primary nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] px-4 text-sm font-medium" href="/demo">Try Nexus Agent</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <form className="nexus-surface rounded-[var(--nexus-radius-surface)] p-5 sm:p-7" noValidate onSubmit={submit} ref={formRef}>
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="company-website">Company website</label>
        <input autoComplete="off" id="company-website" name="company_website" onChange={(event) => update("company_website", event.target.value)} tabIndex={-1} value={form.company_website} />
      </div>

      <fieldset>
        <legend className="nexus-heading text-sm font-medium">Contact</legend>
        <p className="nexus-copy mt-1 text-xs leading-5">Who should we speak with about the workflow?</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="nexus-label sm:col-span-2" htmlFor="full-name">Full name<span aria-hidden="true"> *</span><input autoComplete="name" className="nexus-input" id="full-name" maxLength={100} name="full_name" onChange={(event) => update("full_name", event.target.value)} required value={form.full_name} /></label>
          <label className="nexus-label" htmlFor="work-email">Work email<span aria-hidden="true"> *</span><input autoComplete="email" className="nexus-input" id="work-email" inputMode="email" maxLength={254} name="email" onChange={(event) => update("email", event.target.value)} required type="email" value={form.email} /></label>
          <label className="nexus-label" htmlFor="phone">Phone / WhatsApp{phoneRequired ? <span aria-hidden="true"> *</span> : null}<input autoComplete="tel" className="nexus-input" id="phone" inputMode="tel" maxLength={32} name="phone" onChange={(event) => update("phone", event.target.value)} required={phoneRequired} type="tel" value={form.phone} /></label>
        </div>
        <div className="mt-5">
          <p className="nexus-label">Preferred contact method<span aria-hidden="true"> *</span></p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {([['whatsapp', 'WhatsApp'], ['email', 'Email'], ['phone', 'Phone']] as const).map(([value, label]) => (
              <label className="nexus-radio nexus-focus" key={value}><input checked={form.preferred_contact_method === value} className="sr-only" name="preferred_contact_method" onChange={() => update("preferred_contact_method", value)} type="radio" value={value} /><span>{label}</span></label>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-8 border-t border-[var(--nexus-border)] pt-7">
        <legend className="nexus-heading text-sm font-medium">Business</legend>
        <p className="nexus-copy mt-1 text-xs leading-5">A small amount of context helps us prepare a useful conversation.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="nexus-label sm:col-span-2" htmlFor="business-name">Restaurant or business name<span aria-hidden="true"> *</span><input autoComplete="organization" className="nexus-input" id="business-name" maxLength={160} name="business_name" onChange={(event) => update("business_name", event.target.value)} required value={form.business_name} /></label>
          <label className="nexus-label sm:col-span-2" htmlFor="website-url">Website or Instagram URL <span className="nexus-subtle">(optional)</span><input autoComplete="url" className="nexus-input" id="website-url" inputMode="url" maxLength={300} name="website_url" onChange={(event) => update("website_url", event.target.value)} placeholder="yourrestaurant.com" value={form.website_url} /></label>
          <label className="nexus-label" htmlFor="country">Country<span aria-hidden="true"> *</span><input autoComplete="country-name" className="nexus-input" id="country" maxLength={80} name="country" onChange={(event) => update("country", event.target.value)} required value={form.country} /></label>
          <label className="nexus-label" htmlFor="city">City<span aria-hidden="true"> *</span><input autoComplete="address-level2" className="nexus-input" id="city" maxLength={80} name="city" onChange={(event) => update("city", event.target.value)} required value={form.city} /></label>
          <label className="nexus-label" htmlFor="location-count">Number of locations<span aria-hidden="true"> *</span><select className="nexus-input" id="location-count" name="location_count" onChange={(event) => update("location_count", event.target.value as LocationCount)} required value={form.location_count}><option value="">Select</option><option value="1">1</option><option value="2-5">2–5</option><option value="6-20">6–20</option><option value="20+">20+</option></select></label>
          <label className="nexus-label" htmlFor="industry">Industry<span aria-hidden="true"> *</span><select className="nexus-input" id="industry" name="industry" onChange={(event) => update("industry", event.target.value as Industry)} required value={form.industry}><option value="restaurants">Restaurants</option><option value="retail">Retail</option><option value="fitness">Fitness</option><option value="other">Other</option></select></label>
        </div>
      </fieldset>

      <fieldset className="mt-8 border-t border-[var(--nexus-border)] pt-7">
        <legend className="nexus-heading text-sm font-medium">Current operations</legend>
        <div className="mt-5">
          <p className="nexus-label">Which channels or systems are part of the workflow today?<span aria-hidden="true"> *</span></p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {channelChoices.map(([value, label]) => <MultiSelectButton key={value} onClick={() => update("current_channels", toggleSelection(form.current_channels, value))} selected={form.current_channels.includes(value)}>{label}</MultiSelectButton>)}
          </div>
        </div>
        <div className="mt-7">
          <p className="nexus-label">What are you most interested in improving?<span aria-hidden="true"> *</span></p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {interestChoices.map(([value, label]) => <MultiSelectButton key={value} onClick={() => update("interested_in", toggleSelection(form.interested_in, value))} selected={form.interested_in.includes(value)}>{label}</MultiSelectButton>)}
          </div>
        </div>
        <label className="nexus-label mt-7" htmlFor="pain-point">What&apos;s the biggest problem you&apos;d like Nexus to solve? <span className="nexus-subtle">(optional)</span><textarea className="nexus-input min-h-28 resize-y" id="pain-point" maxLength={2000} name="pain_point" onChange={(event) => update("pain_point", event.target.value)} placeholder="Describe the handoff, delay or manual work that gets in the way today." value={form.pain_point} /></label>
      </fieldset>

      <div className="mt-8 border-t border-[var(--nexus-border)] pt-6">
        <p className="nexus-copy text-xs leading-5">By submitting, you agree that Nexus may use this information to contact you regarding your request. Read our <Link className="nexus-focus underline decoration-current/30 underline-offset-4 hover:decoration-current" href="/privacy">Privacy</Link> and <Link className="nexus-focus underline decoration-current/30 underline-offset-4 hover:decoration-current" href="/terms">Terms</Link>.</p>
        {state === "error" ? <p aria-live="assertive" className="mt-4 rounded-xl border border-[var(--nexus-border-strong)] bg-[var(--nexus-surface-soft)] p-3 text-sm leading-6 text-[var(--nexus-text)]" role="alert">{message}{contactEmail ? <> You can also email <a className="nexus-focus underline underline-offset-4" href={`mailto:${contactEmail}`}>{contactEmail}</a>.</> : null}</p> : null}
        <button className="nexus-button-primary nexus-focus mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-55" disabled={state === "sending"} type="submit">{state === "sending" ? "Sending request…" : "Request a conversation"}<span aria-hidden="true" className="ml-2">→</span></button>
      </div>
    </form>
  );
}
