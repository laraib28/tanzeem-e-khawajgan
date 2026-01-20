# Tanzeem-e-Khawjgan Membership Backend

## Prerequisites

- Python 3.9+
- MySQL Server

## Setup

### 1. Create MySQL Database

```sql
CREATE DATABASE tanzeem_membership;
```

### 2. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=tanzeem_membership
```

### 5. Run Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| POST | `/submit-membership` | Submit membership form |

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Example Request

```bash
curl -X POST http://localhost:8000/submit-membership \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "male",
    "full_name": "Muhammad Ali",
    "relationship_type": "son_of",
    "relation_name": "Muhammad Aslam",
    "cnic": "33100-1234567-1",
    "country": "Pakistan",
    "city": "Bhera",
    "date_of_birth": "1990-01-15",
    "cast": "Roar",
    "source_of_income": "Employment",
    "education": "Bachelor'\''s",
    "occupation": "Private Employee"
  }'
```
