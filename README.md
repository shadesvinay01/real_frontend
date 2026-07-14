# Jugnu AI — Real Estate Lead Generation Platform

Welcome to the Jugnu AI Real Estate CRM! This platform has been upgraded into a production-ready **AI Lead Generation Platform** powered by **Gemini Flash**.

This system handles the complete funnel: capturing leads, running AI analysis, property matching, and providing a unified dashboard for brokers and admins.

## 🌟 Key Features Built So Far

### 1. Frontend Web App (Next.js)
The frontend is a beautiful, highly animated Next.js application using Tailwind CSS and Framer Motion.
- **6-Step Property Finder Wizard**: A premium full-screen modal that captures a buyer's Name, Phone, Budget, Preferences, CIBIL score, and Contact Timing (`/`).
- **AI Thank You Page**: Dynamically renders AI-matched properties from the SQLite database with match scores (`/thank-you`).
- **Marketing Landing Pages**: Standalone entry points like `/find-property`, `/request-callback`, and `/book-site-visit`.
- **Broker Dashboard**: A comprehensive dashboard showing the "🔥 New Buyer Requests" widget with AI summaries, intent scores, and quick action buttons (`/dashboard`).
- **Admin Insights**: An overview dashboard tracking Daily Enquiries, Conversion Rates, Top Lead Sources, and Top Micro-Markets (`/dashboard/admin`).
- **Buyer CRM**: A fully featured page for managing leads with real-time editing and search capabilities (`/dashboard/buyers`).

### 2. Backend Engine (NestJS)
The backend is a scalable NestJS architecture that serves as the AI engine and CRM core.
- **SQLite Database**: A 100% free, local SQLite database (`backend/prisma/dev.db`) using Prisma ORM. No expensive cloud DB required. Includes normalized schema for `Organizations`, `Users`, `Customers`, `Leads`, and `Properties`.
- **AI Integration (`@google/generative-ai`)**: 
  - Uses the **Gemini 1.5 Flash Free API**.
  - Generates a **Professional Buyer Summary** upon lead submission.
  - Assigns an **Intent Quality Score (0-100)** based on budget, timeline, and CIBIL inputs.
- **Property Matching Algorithm**: A custom matching engine that fuzzy-matches a buyer's preferred locations, budget, and property types against available properties in the database to recommend the top 5 options instantly.
- **Enterprise Standards**: Includes JWT Auth (`/auth/login`, `/auth/signup`), `Helmet`, `CORS`, `ValidationPipe`, and Swagger UI (`/api/docs`).

---

## 🚀 How to Run the Platform Locally

To run this platform, you will need two terminal windows: one for the backend and one for the frontend.

### 1. Set Up the Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Create a `.env` file in the `backend/` directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_google_gemini_flash_api_key_here"
   JWT_SECRET="super-secret-key-for-local-dev"
   ```
   *(Note: If no API key is provided, the backend safely falls back to a simulated AI response).*
4. Push the schema to SQLite and start the server:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run start:dev
   ```
   *The backend will run on `http://localhost:3001`.*

### 2. Set Up the Frontend
1. Open a new terminal and navigate to the root folder:
   ```bash
   cd sales_os
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:3000`.*

---

## 🗄️ How to View & Edit Your Database

Since we are using Prisma and SQLite, you can easily view your raw data using a beautiful web UI.

1. Open a terminal in the `backend` directory.
2. Run the Prisma Studio command:
   ```bash
   npx prisma studio
   ```
3. Open `http://localhost:5555` in your browser. From here you can add `Properties`, edit `Customers`, or create new `Users`!

---

## 🧪 Testing the Funnel

1. Go to `http://localhost:3000`.
2. Click the **"Find My Property"** button in the hero section to open the 6-step Wizard.
3. Fill out the dummy data and click Submit.
4. The Wizard will send the data to the NestJS Backend (`/lead-engine/submit`), which will query Gemini Flash, save the data to SQLite, and run the matching algorithm.
5. You will be redirected to the `/thank-you` page where the matched properties will be displayed.
6. Navigate to `http://localhost:3000/dashboard` to see the new AI Lead show up in the Broker Dashboard widget!
