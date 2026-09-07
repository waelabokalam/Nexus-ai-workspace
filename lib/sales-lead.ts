export const contactMethods = ["whatsapp", "email", "phone"] as const;
export const locationCounts = ["1", "2-5", "6-20", "20+"] as const;
export const industries = ["restaurants", "retail", "fitness", "other"] as const;
export const currentChannelOptions = [
  "website",
  "whatsapp",
  "instagram",
  "phone",
  "delivery_marketplace",
  "in_store_only",
  "other",
] as const;
export const interestOptions = [
  "website_digital_experience",
  "online_ordering",
  "customer_support",
  "whatsapp_automation",
  "reservations",
  "customer_crm",
  "delivery_workflow",
  "admin_operations",
  "analytics",
  "full_restaurant_system",
  "something_custom",
] as const;

export type ContactMethod = (typeof contactMethods)[number];
export type LocationCount = (typeof locationCounts)[number];
export type Industry = (typeof industries)[number];
export type CurrentChannel = (typeof currentChannelOptions)[number];
export type Interest = (typeof interestOptions)[number];

export type SalesLeadInput = {
  full_name: string;
  email: string;
  phone: string | null;
  preferred_contact_method: ContactMethod;
  business_name: string;
  website_url: string | null;
  country: string;
  city: string;
  location_count: LocationCount;
  current_channels: CurrentChannel[];
  interested_in: Interest[];
  pain_point: string | null;
  industry: Industry;
  source_page: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  form_started_at: number;
};

export type SalesLeadRecord = Omit<SalesLeadInput, "form_started_at"> & {
  status: "new";
};

export type SalesLeadValidationResult =
  | { ok: true; value: SalesLeadInput }
  | { ok: false; message: string; field?: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d][\d\s().-]{5,31}$/;
const UTM_PATTERN = /^[\p{L}\p{N} _./:+-]*$/u;
const MINIMUM_COMPLETION_MS = 1_200;
const MAXIMUM_FORM_AGE_MS = 24 * 60 * 60 * 1_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned || cleaned.length > maxLength) return null;
  return cleaned;
}

function cleanOptionalText(value: unknown, maxLength: number) {
  if (value === undefined || value === null || value === "") return null;
  return cleanText(value, maxLength);
}

function isOneOf<const T extends readonly string[]>(value: unknown, options: T): value is T[number] {
  return typeof value === "string" && options.includes(value);
}

function cleanSelections<const T extends readonly string[]>(value: unknown, options: T) {
  if (!Array.isArray(value) || value.length === 0 || value.length > options.length) return null;
  const selected = [...new Set(value)];
  if (!selected.every((item): item is T[number] => isOneOf(item, options))) return null;
  return selected;
}

export function normalizeWebsiteUrl(value: unknown) {
  const cleaned = cleanOptionalText(value, 300);
  if (!cleaned) return cleaned;

  try {
    const candidate = /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || !url.hostname.includes('.')) return null;
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function normalizeSourcePage(value: unknown) {
  const cleaned = cleanOptionalText(value, 300);
  if (!cleaned || !cleaned.startsWith("/") || cleaned.startsWith("//")) return "/contact";
  return cleaned;
}

function cleanUtm(value: unknown) {
  const cleaned = cleanOptionalText(value, 100);
  if (!cleaned || !UTM_PATTERN.test(cleaned)) return null;
  return cleaned;
}

export function validateSalesLeadPayload(value: unknown, now = Date.now()): SalesLeadValidationResult {
  if (!isRecord(value)) return { ok: false, message: "Please review the form and try again." };

  if (typeof value.company_website === "string" && value.company_website.trim()) {
    return { ok: false, message: "We could not process that request." };
  }

  const fullName = cleanText(value.full_name, 100);
  if (!fullName || fullName.length < 2) return { ok: false, field: "full_name", message: "Enter your full name." };

  const email = cleanText(value.email, 254)?.toLowerCase() ?? null;
  if (!email || !EMAIL_PATTERN.test(email)) return { ok: false, field: "email", message: "Enter a valid work email." };

  if (!isOneOf(value.preferred_contact_method, contactMethods)) {
    return { ok: false, field: "preferred_contact_method", message: "Choose how you would like us to contact you." };
  }

  const phone = cleanOptionalText(value.phone, 32);
  if (phone && !PHONE_PATTERN.test(phone)) return { ok: false, field: "phone", message: "Enter a valid phone or WhatsApp number." };
  if (value.preferred_contact_method !== "email" && !phone) {
    return { ok: false, field: "phone", message: "Add a phone number for your preferred contact method." };
  }

  const businessName = cleanText(value.business_name, 160);
  if (!businessName || businessName.length < 2) return { ok: false, field: "business_name", message: "Enter your restaurant or business name." };

  const websiteUrl = normalizeWebsiteUrl(value.website_url);
  if (value.website_url && websiteUrl === null) return { ok: false, field: "website_url", message: "Enter a valid website or Instagram URL." };

  const country = cleanText(value.country, 80);
  if (!country) return { ok: false, field: "country", message: "Enter the country where the business operates." };

  const city = cleanText(value.city, 80);
  if (!city) return { ok: false, field: "city", message: "Enter the city where the business operates." };

  if (!isOneOf(value.location_count, locationCounts)) return { ok: false, field: "location_count", message: "Choose the number of locations." };
  if (!isOneOf(value.industry, industries)) return { ok: false, field: "industry", message: "Choose an industry." };

  const channels = cleanSelections(value.current_channels, currentChannelOptions);
  if (!channels) return { ok: false, field: "current_channels", message: "Choose at least one current customer channel." };

  const interests = cleanSelections(value.interested_in, interestOptions);
  if (!interests) return { ok: false, field: "interested_in", message: "Choose at least one area you want to improve." };

  const painPoint = cleanOptionalText(value.pain_point, 2_000);
  if (value.pain_point && painPoint === null) return { ok: false, field: "pain_point", message: "Keep the workflow description under 2,000 characters." };

  if (typeof value.form_started_at !== "number" || !Number.isFinite(value.form_started_at)) {
    return { ok: false, message: "Please reload the form and try again." };
  }
  const completionTime = now - value.form_started_at;
  if (completionTime < MINIMUM_COMPLETION_MS || completionTime > MAXIMUM_FORM_AGE_MS) {
    return { ok: false, message: "Please reload the form and try again." };
  }

  return {
    ok: true,
    value: {
      full_name: fullName,
      email,
      phone,
      preferred_contact_method: value.preferred_contact_method,
      business_name: businessName,
      website_url: websiteUrl,
      country,
      city,
      location_count: value.location_count,
      current_channels: channels,
      interested_in: interests,
      pain_point: painPoint,
      industry: value.industry,
      source_page: normalizeSourcePage(value.source_page),
      utm_source: cleanUtm(value.utm_source),
      utm_medium: cleanUtm(value.utm_medium),
      utm_campaign: cleanUtm(value.utm_campaign),
      form_started_at: value.form_started_at,
    },
  };
}

export function toSalesLeadRecord(input: SalesLeadInput): SalesLeadRecord {
  const { form_started_at: _formStartedAt, ...record } = input;
  void _formStartedAt;
  return { ...record, status: "new" };
}
