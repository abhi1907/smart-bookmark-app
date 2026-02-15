# Smart Bookmark App

A full-stack bookmark manager built with Next.js (App Router), Supabase, and Tailwind CSS.

## Live Demo
https://smart-bookmark-app-lake-nine.vercel.app

## GitHub Repository
https://github.com/abhi1907/smart-bookmark-app

---

## Tech Stack

- Next.js (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS
- Vercel (Deployment)

---

## Features

- Google OAuth authentication (no email/password)
- Add bookmarks (title + URL)
- Private bookmarks per user (Row Level Security enabled)
- Realtime updates across multiple tabs
- Delete bookmarks
- Secure production deployment

---

## Database Design

Table: `bookmarks`

- id (UUID, primary key)
- title (text)
- url (text)
- user_id (UUID, references auth.users)
- created_at (timestamp)

### Row Level Security (RLS)

- Users can SELECT only their own bookmarks
- Users can INSERT only their own bookmarks
- Users can DELETE only their own bookmarks

---

## Challenges Faced & Solutions

### 1. OAuth Redirect Issue in Production

Initially, Google login redirected to localhost in production.
Fixed by dynamically setting:

redirectTo: `${window.location.origin}/dashboard`

This ensures correct redirect for both local and deployed environments.

---

### 2. Supabase Realtime Not Triggering

Realtime updates were not working because the `bookmarks` table was not added to the `supabase_realtime` publication.

Solution:
- Added table under Database → Publications.
- Configured postgres_changes listener.
- Added separate DELETE event listener.

---

### 3. Session Handling in Next.js App Router

Used `supabase.auth.getSession()` to properly restore session in client components.

---

## How to Run Locally

1. Clone repository
2. Add `.env.local` file:

NEXT_PUBLIC_SUPABASE_URL=your_url  
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key  

3. Install dependencies:

npm install

4. Run development server:

npm run dev

---

## Production Deployment

Deployed on Vercel with environment variables configured and Supabase Auth URL settings updated.
