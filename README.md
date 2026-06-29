# Sanskruti

A boutique storefront + admin panel, built with React + Vite, **Supabase** (database + auth), and **Cloudinary** (media hosting).

## Running the code

1. `npm i` — install dependencies.
2. Copy `.env.example` to `.env` and fill in your Supabase + Cloudinary values.
3. Follow **[SETUP.md](SETUP.md)** once to create the Supabase project, run the schema, enable Google sign-in, and configure Cloudinary.
4. `npm run dev` — start the dev server.

Auth supports **username + password** and **Sign in with Google**. Passwords are bcrypt-hashed by Supabase Auth (never stored in plain text).
