# Gevora Backend — Week 4

Express.js REST API for the Gevora homestay intelligence platform.

## Tech Stack
- Node.js + Express
- CORS, dotenv, nodemon

## How to Run Backend Locally

1. Navigate to the backend folder
```bash
   cd gevora/backend
```

2. Install dependencies
```bash
   npm install
```

3. Set up environment variables
```bash
   cp .env.example .env
```

4. Start the development server
```bash
   npm run dev
```

5. Server runs at `http://localhost:5000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/reviews | Get all reviews |
| GET | /api/reviews/:id | Get single review |
| GET | /api/reviews/search?q= | Search reviews |
| POST | /api/reviews | Create review |
| PUT | /api/reviews/:id | Update review |
| DELETE | /api/reviews/:id | Delete review |
| GET | /api/issues | Get all issues |
| GET | /api/issues/:id | Get single issue |
| GET | /api/issues/search?status= | Filter issues |
| POST | /api/issues | Create issue |
| PUT | /api/issues/:id | Update issue |
| DELETE | /api/issues/:id | Delete issue |