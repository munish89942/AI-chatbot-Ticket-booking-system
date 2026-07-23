# AI Chatbot Ticket Booking System 🏛️🤖

A state-of-the-art, AI-powered museum ticket booking system featuring a conversational intelligent assistant, interactive 3D visualizations, and integrated Razorpay payment processing. The application enables users to book tickets seamlessly using natural language, dynamically query slot availability, complete secure payments, and manage reservations via a comprehensive admin dashboard.

## 🏗️ Tech Stack

- **Frontend**: React (Vite), Framer Motion, Three.js, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **AI**: Google Gemini (`gemini-3-flash-preview`)
- **Payments**: Razorpay

## 📁 Project Structure

```
scratch/
├── client/     # React frontend (Vite)
└── server/     # Express.js backend
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API Key
- A Razorpay Test Account

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Start the server:
```bash
node server.js
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🌐 Deployment

- **Live Frontend (Vercel)**: [https://client-silk-psi-23.vercel.app](https://client-silk-psi-23.vercel.app)
- **Live Backend (Railway)**: `https://<your-railway-app-url>.up.railway.app` (Configure yours and link to Vercel via env variables)

### Frontend Deployment (Vercel)
The client frontend is optimized for deployment on Vercel:
1. Set the build directory / framework root to `client/`.
2. Add the environment variable `VITE_API_URL` pointing to your Railway backend: `https://<your-railway-app-url>.up.railway.app/api`.

### Backend Deployment (Railway)
The server backend is configured for persistent deployment on Railway:
1. Set the service **Root Directory** to `/server`.
2. Attach a **Persistent Volume** and mount it to `/data` to prevent SQLite database resets across container redeploys.
3. Configure the following environment variables on Railway:
   - `GEMINI_API_KEY`: Your Google Gemini API Key
   - `RAZORPAY_KEY_ID`: Your Razorpay Test Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Test Key Secret
   - `DATABASE_PATH`: `/data/db.sqlite`
   - `FRONTEND_URL`: `https://client-silk-psi-23.vercel.app` (to allow CORS requests)

## ✨ Features

- **AI Booking Assistant**: Conversational ticket booking powered by Google Gemini AI with intelligent fallbacks.
- **Real-time Context**: AI fetches live pricing, limits, and time slot availability dynamically from the database.
- **Razorpay Payments**: Secure payment flow with HMAC validation and automatic status updates.
- **Admin Dashboard**: Comprehensive management interface to view bookings and configure ticket pricing/limits in real-time.
- **About Page**: Immersive story experience with modern parallax scroll effects.
- **3D Hero Scene**: High-performance interactive glass prism visualizer using Three.js and Framer Motion.
