const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const rawContactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

function normalizeSiteUrl(value: string) {
  const url = new URL(value);
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  return url.toString().replace(/\/$/, "");
}

const isProduction = process.env.NODE_ENV === "production";
let configuredSiteUrl: string | undefined;

if (rawSiteUrl) {
  try {
    configuredSiteUrl = normalizeSiteUrl(rawSiteUrl);
  } catch {
    console.warn("Nexus configuration warning: NEXT_PUBLIC_SITE_URL must be a valid absolute URL.");
  }
}

export const siteConfig = {
  contactEmail: rawContactEmail || undefined,
  isProduction,
  siteUrl: configuredSiteUrl
    ? configuredSiteUrl
    : isProduction
      ? undefined
      : "http://localhost:3000",
};

if (isProduction && !configuredSiteUrl) {
  console.warn(
    "Nexus configuration warning: NEXT_PUBLIC_SITE_URL is required in production for canonical URLs, sitemap, robots, and social metadata.",
  );
}

if (isProduction && !rawContactEmail) {
  console.warn(
    "Nexus configuration warning: NEXT_PUBLIC_CONTACT_EMAIL is required before the public contact experience is deployment-ready.",
  );
}

export function absoluteSiteUrl(path: string) {
  if (!siteConfig.siteUrl) return undefined;
  return new URL(path, `${siteConfig.siteUrl}/`).toString();
}
