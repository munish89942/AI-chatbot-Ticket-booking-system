# Museum Booking System

A modern, AI-powered museum ticket booking system with a conversational interface, 3D visuals, and Razorpay payment integration.

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

### Frontend (Vercel)
The `client/` directory is configured for Vercel deployment with `vercel.json`.

Set the `VITE_API_URL` environment variable in your Vercel project settings to point to your backend URL.

### Backend
For persistent storage, deploy the backend to a platform with filesystem persistence (e.g., Render, Railway, Fly.io).

## ✨ Features

- **AI Booking Assistant**: Conversational ticket booking via Gemini AI
- **Real-time Context**: AI fetches live pricing and slot data from the database  
- **Razorpay Payments**: Secure HMAC-verified payment flow
- **Admin Dashboard**: View all bookings and manage ticket pricing
- **About Page**: Immersive museum story with parallax scrolling
- **3D Hero**: Interactive glass prism visualization using Three.js
