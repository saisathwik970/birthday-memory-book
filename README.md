# Birthday Memory Book 🎂

A private, premium digital birthday scrapbook. Members log in to browse photos, videos, an
interactive timeline, a page-turning memory book, and a guestbook of birthday wishes. Admins
manage all content and approve members from a dedicated dashboard.

## Stack

- **Frontend:** React + Vite, Tailwind CSS, Framer Motion, React Router, React Icons
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT stored in an httpOnly cookie, bcrypt password hashing
- **Media storage:** Cloudinary

## Project structure

```
birthday-memory-book/
├── backend/           Express API, MongoDB models, JWT auth, Cloudinary upload routes
└── frontend/          React + Vite app (Tailwind, Framer Motion, GSAP-ready)
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB database (local `mongod`, or a free MongoDB Atlas cluster)
- A free Cloudinary account (for photo/video storage)

## 2. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env with your MongoDB URI, a long random JWT_SECRET, and your Cloudinary credentials
npm install
npm run seed     # creates the first admin user from ADMIN_* values in .env
npm run dev      # starts the API on http://localhost:5000
```

The seed script only needs to be run once — it creates the admin account you'll log in with.
Any additional admins can be promoted directly in MongoDB (set `role: "admin"`).

## 3. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev      # starts the app on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so both servers need to
be running at the same time in development.

Visit `http://localhost:5173/login` and sign in with the admin credentials you set in
`backend/.env`.

## 4. How the roles work

- **Admin** (created via `npm run seed`): can upload/edit/delete photos and videos, manage the
  timeline and memory-book pages, moderate guestbook messages, approve or reject new member
  sign-ups, and edit site settings (final surprise message, background music, hero text).
- **Members**: register at `/register`, then wait for an admin to approve them from
  **Admin → Members** before they can log in. Once approved, they can view everything, like
  photos, leave guestbook wishes, and react with emoji/hearts — but cannot upload or delete.

## 5. Adding content

1. Log in as admin → **Admin Dashboard**.
2. **Gallery / Videos tabs:** upload files directly — they're stored on Cloudinary and the
   returned URL is saved to MongoDB automatically. Drag photo cards to reorder them.
3. **Timeline tab:** add a year, title, and story. (Photo/video arrays for each year can be
   populated via the API directly, or extend the form with an uploader the same way Gallery
   uploads work — the model already supports `photos: []` / `videos: []`.)
4. **Pages tab:** build the page-turning "Memory Book" by adding pages with a photo URL (copy
   one from Gallery once uploaded), caption, date, sticker, and decoration style.
5. **Settings tab:** set the hero title/subtitle, the background music URL, and the Final
   Surprise page's video, message, and collage photos.

## 6. What's included vs. what to extend

This is a complete, working full-stack app covering the core experience: JWT auth with
role-based access, admin CRUD for every content type, Cloudinary uploads, the animated login
page, hero with cake/candle/gift interactions, masonry gallery with lightbox, video gallery,
page-turning memory book, guestbook with hearts/emoji, a floating music player, a final-surprise
reveal, and an admin dashboard with stats.

A few of the more decorative extras from the original spec are easy to layer on top of this
architecture but weren't built in to keep the codebase clean and correct:

- Full dark/light theme toggle (Tailwind `darkMode: "class"` is already configured — just add a
  toggle button that flips a class on `<html>`)
- Rich text editor for admin captions (drop in an editor like Tiptap and wire it to the existing
  `caption` fields)
- Push notifications when the admin uploads new memories (would need a service like web-push)
- Branded PWA icons (`icon-192.png` / `icon-512.png` — add real files to `frontend/public` and
  reference them in `vite.config.js`)

## 7. Production deployment notes

- Set `NODE_ENV=production` in the backend `.env`; cookies will then be sent with `secure: true`,
  so the frontend must be served over HTTPS.
- Set `CLIENT_URL` in the backend `.env` to your deployed frontend URL (for CORS).
- Build the frontend with `npm run build` (outputs to `frontend/dist`) and serve it from any
  static host (Vercel, Netlify, S3+CloudFront) or from Express via `express.static`.
- Common backend hosts: Render, Railway, Fly.io, or a small VPS behind Nginx.
- Rotate `JWT_SECRET` and the admin password before going live; never commit `.env` files.

## 8. Security features already in place

- JWT in an httpOnly cookie (not readable by JS, mitigates XSS token theft)
- bcrypt password hashing
- Role-based route protection (`protect` + `requireRole("admin")` middleware)
- Rate limiting on login and on the API generally (`express-rate-limit`)
- Input validation (`express-validator`) on auth and guestbook routes
- CORS locked to `CLIENT_URL`
