"""Run: python run_migration.py"""
import os, sys
from dotenv import load_dotenv
load_dotenv()
sys.path.insert(0, os.path.dirname(__file__))
from database import engine
from sqlalchemy import text

migrations = [
    "ALTER TABLE members ADD COLUMN IF NOT EXISTS phone VARCHAR(20)",
    "ALTER TABLE members ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10)",
    "ALTER TABLE members ADD COLUMN IF NOT EXISTS category VARCHAR(100)",
    "ALTER TABLE members ADD COLUMN IF NOT EXISTS qr_url TEXT",
    "ALTER TABLE members ALTER COLUMN gender DROP NOT NULL",
    "ALTER TABLE members ALTER COLUMN relationship_type DROP NOT NULL",
    "ALTER TABLE members ALTER COLUMN relation_name DROP NOT NULL",
    "ALTER TABLE members ALTER COLUMN cnic DROP NOT NULL",
    "ALTER TABLE members ALTER COLUMN country DROP NOT NULL",
    "ALTER TABLE members ALTER COLUMN date_of_birth DROP NOT NULL",
    'ALTER TABLE members ALTER COLUMN "cast" DROP NOT NULL',
    "ALTER TABLE members ALTER COLUMN source_of_income DROP NOT NULL",
    "ALTER TABLE members ALTER COLUMN education DROP NOT NULL",
    "ALTER TABLE members ALTER COLUMN occupation DROP NOT NULL",
]

for sql in migrations:
    try:
        with engine.connect() as conn:
            conn.execute(text(sql))
            conn.commit()
        print(f"✅ {sql[:60]}...")
    except Exception as e:
        print(f"⚠️  {sql[:60]}... → {e}")

print("\n🎉 Migration mukammal!")
