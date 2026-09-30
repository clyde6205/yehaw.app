-- Yehaw directory foundation
-- This migration is designed for an empty database. Review before applying.

BEGIN;

CREATE TABLE schema_migrations (
  id text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE service_categories (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  display_order integer NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT service_categories_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT service_categories_display_order_positive CHECK (display_order > 0)
);

CREATE TABLE services (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id bigint NOT NULL REFERENCES service_categories(id) ON DELETE RESTRICT,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short_description text NOT NULL,
  canonical_url text NOT NULL,
  icon_url text,
  display_order integer NOT NULL DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  is_verified boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  last_reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT services_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT services_canonical_url_https CHECK (canonical_url ~ '^https://'),
  CONSTRAINT services_icon_url_https CHECK (icon_url IS NULL OR icon_url ~ '^https://'),
  CONSTRAINT services_display_order_positive CHECK (display_order > 0),
  CONSTRAINT services_verified_timestamp CHECK (
    (is_verified = false AND verified_at IS NULL)
    OR (is_verified = true AND verified_at IS NOT NULL)
  )
);

CREATE TABLE service_aliases (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  service_id bigint NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  alias text NOT NULL,
  normalized_alias text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT service_aliases_alias_not_blank CHECK (length(trim(alias)) > 0),
  CONSTRAINT service_aliases_normalized_alias_not_blank CHECK (length(trim(normalized_alias)) > 0),
  CONSTRAINT service_aliases_service_normalized_alias_unique UNIQUE (service_id, normalized_alias)
);

CREATE TABLE service_link_reports (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  service_id bigint NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  report_type text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  CONSTRAINT service_link_reports_report_type_valid CHECK (report_type IN ('broken_link', 'incorrect_destination', 'security_concern', 'other')),
  CONSTRAINT service_link_reports_status_valid CHECK (status IN ('open', 'reviewing', 'resolved', 'dismissed')),
  CONSTRAINT service_link_reports_resolution_valid CHECK (
    (status IN ('resolved', 'dismissed') AND resolved_at IS NOT NULL)
    OR (status IN ('open', 'reviewing') AND resolved_at IS NULL)
  )
);

CREATE TABLE service_audit_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  service_id bigint REFERENCES services(id) ON DELETE SET NULL,
  action text NOT NULL,
  actor_type text NOT NULL DEFAULT 'editorial',
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT service_audit_log_action_not_blank CHECK (length(trim(action)) > 0),
  CONSTRAINT service_audit_log_actor_type_valid CHECK (actor_type IN ('system', 'editorial', 'admin'))
);

CREATE INDEX service_categories_active_order_idx
  ON service_categories (is_active, display_order, name);

CREATE INDEX services_public_directory_idx
  ON services (category_id, is_active, is_verified, display_order, name);

CREATE INDEX services_review_idx
  ON services (is_verified, last_reviewed_at);

CREATE INDEX service_aliases_lookup_idx
  ON service_aliases (normalized_alias);

CREATE INDEX service_link_reports_queue_idx
  ON service_link_reports (status, created_at);

CREATE INDEX service_audit_log_service_created_idx
  ON service_audit_log (service_id, created_at DESC);

INSERT INTO service_categories (slug, name, description, display_order)
VALUES
  ('money-payments', 'Money & Payments', 'E-wallets, banking, bills, remittance, and payment services.', 1),
  ('government', 'Government', 'Official Philippine government services and public information.', 2),
  ('ofw-work', 'OFW & Work', 'Overseas employment, work, and practical OFW services.', 3),
  ('travel-transport', 'Travel & Transport', 'Flights, travel, transport, and trip services.', 4),
  ('shopping', 'Shopping', 'Retail, marketplaces, and everyday shopping.', 5),
  ('food', 'Food', 'Food ordering, groceries, and dining services.', 6),
  ('health', 'Health', 'Healthcare, pharmacies, and wellness services.', 7),
  ('communication', 'Communication', 'Messaging, social, and communication services.', 8),
  ('entertainment', 'Entertainment', 'Video, music, games, and leisure services.', 9);

INSERT INTO schema_migrations (id)
VALUES ('001_yehaw_directory_foundation');

COMMIT;
