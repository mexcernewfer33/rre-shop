# RRe Shop (Next.js + Express + MongoDB (Mongoose))

Animated product shop with:
- Storefront (list + details)
- Buy button redirects to your URL
- Admin panel (create/edit/delete + multiple images)
- Smooth animations (Framer Motion)

## Structure
- `backend/` — Express API + MongoDB (Mongoose)
- `frontend/` — Next.js (App Router) + Framer Motion

## Local run

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Put your MongoDB connection string into DATABASE_URL in .env
npm run dev
```

Health check:
- http://localhost:10000/health

### Frontend
```bash
cd ../frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open:
- http://localhost:3000
