# SymptoTrack Deployment Guide

This guide will help you deploy SymptoTrack to Vercel with a Supabase PostgreSQL database.

## Prerequisites

- A GitHub account (for deployment)
- A Vercel account (for hosting)
- A Supabase account (for the database)

## Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com/) and sign up or log in
2. Create a new project
3. Make note of your Supabase credentials:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - API Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Database connection string for Prisma

4. In the SQL Editor, run the following script to create basic tables:

```sql
-- Create the notes table
create table notes (
  id bigint primary key generated always as identity,
  title text not null
);

-- Insert some sample data into the table
insert into notes (title)
values
  ('Today I created a Supabase project.'),
  ('I added some data and queried it from Next.js.'),
  ('It was awesome!');

alter table notes enable row level security;

-- Make the data in your table publicly readable by adding an RLS policy
create policy "public can read countries"
on public.notes
for select to anon
using (true);
```

## Step 2: Prepare Your codebase

Make sure the following files are properly configured:

1. `package.json` - Has `"type": "module"` and all necessary dependencies
2. `next.config.mjs` - Uses ESM export syntax
3. `src/utils/supabase/server.ts` - Properly configured to connect to Supabase
4. `.env.production` - Contains the necessary environment variables

## Step 3: Deploy to Vercel

1. Push your code to GitHub 
2. Log in to [vercel.com](https://vercel.com) with your GitHub account
3. Click "Add New" → "Project"
4. Select your GitHub repository
5. Configure the project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run vercel-build`
   - Install Command: `npm install --legacy-peer-deps`

6. Configure environment variables:
   - Add all variables from `.env.production`
   - Add Supabase credentials including `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Add PostgreSQL connection details as `DATABASE_URL`
   - Add OAuth credentials and other required variables

7. Click "Deploy"

## Step 4: Set Up the Database

1. After deployment, go to the Supabase project.
2. Run the Prisma migration SQL manually or use the Vercel CLI to run migrations.

## Step 5: Verify Deployment

1. Access your deployed application at the Vercel-provided URL
2. Test the `/notes` route to ensure your Supabase connection works
3. Test the authentication flows to ensure OAuth providers are properly configured

## Troubleshooting

- If you encounter module loading issues, ensure that `package.json` has `"type": "module"` and that your Next.js configuration file is `next.config.mjs`
- If you're having database connection issues, make sure your Supabase connection strings are properly formatted and included in your environment variables
- For authentication issues, verify that your OAuth provider configurations are correct and that the callback URLs in your OAuth provider dashboards match your Vercel deployment URL 