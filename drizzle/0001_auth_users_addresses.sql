CREATE TYPE "user_status" AS ENUM ('active', 'blocked');
CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "mobile" text NOT NULL,
  "first_name" text,
  "last_name" text,
  "status" "user_status" DEFAULT 'active' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "last_login_at" timestamp with time zone
);
CREATE UNIQUE INDEX "users_mobile_unique" ON "users" ("mobile");

CREATE TABLE "otp_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "mobile" text NOT NULL,
  "code_hash" text NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "attempt_count" integer DEFAULT 0 NOT NULL,
  "sent_at" timestamp with time zone DEFAULT now() NOT NULL,
  "verified_at" timestamp with time zone,
  "ip" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX "otp_requests_mobile_created_idx" ON "otp_requests" ("mobile", "created_at");

CREATE TABLE "sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token_hash" text NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "last_used_at" timestamp with time zone DEFAULT now() NOT NULL,
  "ip" text,
  "user_agent" text,
  "revoked_at" timestamp with time zone
);
CREATE UNIQUE INDEX "sessions_token_hash_unique" ON "sessions" ("token_hash");
CREATE INDEX "sessions_user_idx" ON "sessions" ("user_id");

CREATE TABLE "addresses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "receiver_name" text NOT NULL,
  "mobile" text NOT NULL,
  "province" text NOT NULL,
  "city" text NOT NULL,
  "address" text NOT NULL,
  "plaque" text,
  "unit" text,
  "postal_code" text NOT NULL,
  "is_default" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX "addresses_user_idx" ON "addresses" ("user_id");
CREATE UNIQUE INDEX "addresses_one_default_per_user" ON "addresses" ("user_id") WHERE "is_default" = true;
