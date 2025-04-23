# SymptoTrack

A medical symptom tracking and condition analysis application.

## Features

- Track symptoms and their severity
- Get potential condition matches based on symptoms
- View detailed treatment information
- Save and share health reports
- User authentication system
- Profile management

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YassineMouden/symptotrack.git
   cd symptotrack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # Next Auth
   AUTH_SECRET="QC+KgH0JR8uRZNGy8XHEVf+KMrWg5/wSKrYu0f2JOZ0="

   # Next Auth Discord Provider
   AUTH_DISCORD_ID="your-discord-id"
   AUTH_DISCORD_SECRET="your-discord-secret"

   # Next Auth Google Provider
   AUTH_GOOGLE_ID="your-google-id"
   AUTH_GOOGLE_SECRET="your-google-secret"

   # Next Auth GitHub Provider
   AUTH_GITHUB_ID="your-github-id"
   AUTH_GITHUB_SECRET="your-github-secret"

   # Prisma
   DATABASE_URL="postgresql://postgres:password@localhost:5432/symptotrack"

   # OpenAI API
   OPENAI_API_KEY="your-openai-api-key"

   # Email Service
   RESEND_API_KEY="your-resend-api-key"
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Important Notes

- The application currently uses mock data instead of a real database connection
- For testing, use these credentials:
  - Email: `test@example.com`
  - Password: `password`
- Authentication test pages:
  - `/test-auth` - Simple authentication test page
  - `/auth/test` - Detailed diagnostic page

## Development Workflow

For team collaboration, follow these steps:

1. Create a new branch for each feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```

2. Make changes and commit them:
   ```bash
   git add .
   git commit -m "Descriptive message"
   ```

3. Push changes to GitHub:
   ```bash
   git push origin feature-name
   ```

4. Create a Pull Request on GitHub to merge changes into the main branch
5. Review each other's code before merging

## Technology Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- NextAuth.js for authentication
- OpenAI API for symptom analysis

## Project Structure

- `/src/app` - Main application code
- `/src/app/_components` - Shared UI components
- `/src/app/api` - API routes
- `/src/server/auth` - Authentication configuration
- `/src/utils` - Utility functions

## Overview

SymptoTrack is a comprehensive symptom tracking and analysis application that helps users identify potential medical conditions based on their symptoms. By leveraging artificial intelligence and an interactive body model, SymptoTrack provides a user-friendly interface to track health symptoms, receive potential condition matches, and access treatment recommendations.

**Key Features:**
- Interactive body model for intuitive symptom selection
- AI-powered symptom analysis with confidence scoring
- Detailed condition information with treatment recommendations
- Medical resource finder to connect with healthcare providers
- Save and share capabilities for treatment plans

> **Medical Disclaimer:** SymptoTrack is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## Tech Stack

SymptoTrack is built with the modern [T3 Stack](https://create.t3.gg/):

- **Frontend**: [Next.js](https://nextjs.org), [TypeScript](https://www.typescriptlang.org), [Tailwind CSS](https://tailwindcss.com)
- **Authentication**: [NextAuth.js](https://next-auth.js.org)
- **Database**: [Prisma](https://prisma.io) with SQLite (configurable for PostgreSQL)
- **AI Integration**: [OpenAI GPT-4](https://openai.com/gpt-4)
- **Interactive UI**: [reactjs-human-body](https://www.npmjs.com/package/reactjs-human-body)

## Getting Started

### Prerequisites

- Node.js 
- npm or yarn
- OpenAI API key for AI-powered features

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/symptotrack.git
   cd symptotrack
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file and add your OpenAI API key and other required variables.

4. Set up the database:
   ```bash
   npx prisma migrate dev
   # or
   yarn prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Application Structure

SymptoTrack follows a 5-step process to guide users through symptom tracking and analysis:

1. **Info**: Collection of basic user information (age, sex)
2. **Symptoms**: Interactive selection of symptoms using a body model or search
3. **Conditions**: AI-generated potential conditions based on reported symptoms
4. **Details**: Additional targeted questions based on potential conditions
5. **Treatment**: Treatment recommendations and next steps

## Core Components

### Interactive Body Model

The application uses a visual body model allowing users to click on different body parts to select symptoms. This provides an intuitive way to specify symptom locations without medical terminology.

### AI Symptom Analysis

SymptoTrack uses OpenAI's GPT-4 to analyze reported symptoms and generate potential matching conditions with confidence scores. This analysis includes:

- Condition descriptions and symptom matching
- Potential severity assessment
- Treatment approaches
- When to see a doctor recommendations

### Treatment Recommendations

For each potential condition, the application provides:

- Categorized treatment options (medications, lifestyle changes, procedures)
- Medical resource finder to locate healthcare providers
- Shareable treatment reports

## Development

### Project Structure

```
symptotrack/
├── prisma/                # Database schema and migrations
├── public/                # Static files
├── src/
│   ├── app/               # Next.js App Router pages and components
│   │   ├── _components/   # Shared UI components
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   ├── conditions/    # Conditions results page
│   │   ├── details/       # Additional details page
│   │   ├── symptoms/      # Symptoms input page
│   │   ├── treatment/     # Treatment recommendations page
│   │   └── page.tsx       # Home page (user info)
│   ├── env.js             # Environment variable validation
│   ├── server/            # Server-side code
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions incl. AI integration
└── ...
```



