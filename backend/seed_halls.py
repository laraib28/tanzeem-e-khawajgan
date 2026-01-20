"""
Seed script for initial banquet hall data.
Run: python seed_halls.py
"""

from database import SessionLocal, engine, Base
from models import BanquetHall

# Create all tables
Base.metadata.create_all(bind=engine)

# Initial hall data
HALLS = [
    {
        "name": "Grand Hall",
        "capacity": 500,
        "amenities": ["AC", "Stage", "Sound System", "Parking", "Catering Area"],
        "price_per_hour": 5000.00,
        "status": "active"
    },
    {
        "name": "Conference Room A",
        "capacity": 50,
        "amenities": ["AC", "Projector", "Whiteboard", "WiFi"],
        "price_per_hour": 1000.00,
        "status": "active"
    },
    {
        "name": "Garden Lawn",
        "capacity": 300,
        "amenities": ["Open Air", "Stage", "Catering Area", "Parking"],
        "price_per_hour": 3000.00,
        "status": "active"
    }
]


def seed_halls():
    db = SessionLocal()
    try:
        # Check if halls already exist
        existing = db.query(BanquetHall).count()
        if existing > 0:
            print(f"Halls already seeded ({existing} records). Skipping.")
            return

        # Insert halls
        for hall_data in HALLS:
            hall = BanquetHall(**hall_data)
            db.add(hall)

        db.commit()
        print(f"Successfully seeded {len(HALLS)} halls.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding halls: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_halls()
