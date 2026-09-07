create table if not exists public.sales_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  full_name text not null,
  email text not null,
  phone text,
  preferred_contact_method text not null check (preferred_contact_method in ('whatsapp', 'email', 'phone')),
  business_name text not null,
  website_url text,
  country text not null,
  city text not null,
  location_count text not null check (location_count in ('1', '2-5', '6-20', '20+')),
  current_channels text[] not null default '{}',
  interested_in text[] not null default '{}',
  pain_point text,
  industry text not null check (industry in ('restaurants', 'retail', 'fitness', 'other')),
  source_page text not null default '/contact',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  source_metadata jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'demo_booked', 'proposal', 'won', 'lost'))
);

alter table public.sales_leads enable row level security;

create index if not exists sales_leads_created_at_idx on public.sales_leads (created_at desc);
create index if not exists sales_leads_status_idx on public.sales_leads (status);

comment on table public.sales_leads is 'Qualified Nexus sales requests. Writes are performed only by the server-side lead route.';
