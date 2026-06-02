-- Simplify nda_templates: customization fields only (no free-form agreement body).

alter table public.nda_templates
  add column if not exists company_name text,
  add column if not exists product_name text,
  add column if not exists presenter_name text,
  add column if not exists agreement_version text;

-- Backfill from legacy columns when present
update public.nda_templates
set
  company_name = coalesce(nullif(trim(company_name), ''), nullif(trim(template_name), ''), 'Your Company'),
  product_name = coalesce(nullif(trim(product_name), ''), 'Pitch Lock'),
  agreement_version = coalesce(nullif(trim(agreement_version), ''), nullif(trim(version), ''), 'nda-v1')
where company_name is null
   or product_name is null
   or agreement_version is null;

alter table public.nda_templates
  alter column company_name set default 'Your Company',
  alter column product_name set default 'Pitch Lock';

update public.nda_templates set company_name = 'Your Company' where company_name is null;
update public.nda_templates set product_name = 'Pitch Lock' where product_name is null;
update public.nda_templates set agreement_version = 'nda-v1' where agreement_version is null;

alter table public.nda_templates
  alter column company_name set not null,
  alter column product_name set not null,
  alter column agreement_version set not null;

alter table public.nda_templates
  drop column if exists template_name,
  drop column if exists agreement_body,
  drop column if exists version,
  drop column if exists is_default,
  drop column if exists qr_code_url;

comment on column public.nda_templates.company_name is 'Presenter company name inserted into standard NDA text.';
comment on column public.nda_templates.product_name is 'Product or pitch name inserted into standard NDA text.';
comment on column public.nda_templates.presenter_name is 'Presenter display name on the agreement.';
comment on column public.nda_templates.agreement_version is 'Version-controlled legal record label.';
