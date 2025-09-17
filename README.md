# Event Management System

Full Stack Assignment for Hirekarma Pvt Ltd.

## Tech Stack
- Frontend: Next.js (React) + Tailwind CSS
- Backend: FastAPI (Python)
- Database: PostgreSQL
- Auth: JWT (Bearer)
- Container: Docker, Docker Compose

## Quick Start (Docker)
1. Create an `.env` file in `backend/` (see below).
2. Run:
```bash
docker compose up --build
```
3. API docs: http://localhost:8000/docs

### backend/.env example
```
DATABASE_URL=postgresql+psycopg2://postgres:postgres@db:5432/events
JWT_SECRET=change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=120
CORS_ORIGINS=*
```

## API Overview
- Auth
  - POST /auth/signup
  - POST /auth/login (OAuth2PasswordRequestForm: username=email, password)
  - GET /auth/me
- Events
  - GET /events/
  - GET /events/{id}
  - POST /events/ (admin)
  - PUT /events/{id} (admin)
  - DELETE /events/{id} (admin)

## Project Structure
```
backend/
  main.py
  database.py
  models.py
  schemas.py
  auth.py
  deps.py
  routers/
    users.py
    events.py
  requirements.txt
  Dockerfile
```

## Frontend
To be added: Next.js app with Tailwind, pages for Login, Signup, Event List, Admin Dashboard.

## Deployment
- Frontend: Vercel
- Backend: Render/Railway/Heroku

## License
MIT

