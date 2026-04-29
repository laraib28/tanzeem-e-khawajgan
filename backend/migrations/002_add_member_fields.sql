-- Members table mein naye fields add karo
-- Run: psql $DATABASE_URL -f migrations/002_add_member_fields.sql

ALTER TABLE members ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE members ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10);
ALTER TABLE members ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE members ADD COLUMN IF NOT EXISTS qr_url TEXT;

-- gender aur required fields ko nullable banao (import ke liye)
ALTER TABLE members ALTER COLUMN gender DROP NOT NULL;
ALTER TABLE members ALTER COLUMN relationship_type DROP NOT NULL;
ALTER TABLE members ALTER COLUMN relation_name DROP NOT NULL;
ALTER TABLE members ALTER COLUMN cnic DROP NOT NULL;
ALTER TABLE members ALTER COLUMN country DROP NOT NULL;
ALTER TABLE members ALTER COLUMN date_of_birth DROP NOT NULL;
ALTER TABLE members ALTER COLUMN cast DROP NOT NULL;
ALTER TABLE members ALTER COLUMN source_of_income DROP NOT NULL;
ALTER TABLE members ALTER COLUMN education DROP NOT NULL;
ALTER TABLE members ALTER COLUMN occupation DROP NOT NULL;
