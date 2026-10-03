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
AI-chatbot-Ticket-booking-system/
├── client/     # React frontend (Vite)
└── server/     # Express.js backend
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API Key
- A Razorpay Test Account

### Clone Repository

```bash
git clone https://github.com/munish89942/AI-chatbot-Ticket-booking-system.git
cd AI-chatbot-Ticket-booking-system
```

### Quick Start (Single Command)

```bash
# 1. Install all dependencies for root, server, and client
npm run install:all

# 2. Configure environment in server/.env
cp server/.env.example server/.env # or create server/.env

# 3. Start both backend and frontend concurrently
npm run dev
```

The app will be available at:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`

---

### Manual Setup (Separate Terminals)

#### 1. Backend Setup

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
npm run dev # or node server.js
```

#### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🌐 Deployment

- **Live Frontend (Vercel)**: [https://client-silk-psi-23.vercel.app](https://client-silk-psi-23.vercel.app)
- **Live Backend (Render - Free Tier)**: [https://museum-booking-api.onrender.com](https://museum-booking-api.onrender.com)

### 🚀 Backend Deployment (Render)
Since this repository is a monorepo, follow these steps to deploy the backend (`/server`) service on Render (Free Tier):

1. **Create a Web Service**:
   - Go to [dashboard.render.com](https://dashboard.render.com/) and log in with GitHub.
   - Click **New +** -> **Web Service**.
   - Select this repository (`AI-chatbot-Ticket-booking-system`).
   
2. **Configure Service Settings**:
   - **Name**: `museum-booking-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

3. **Configure Environment Variables**:
   - Add the following environment variables in the Render Dashboard:
     * `GEMINI_API_KEY`: Your Google Gemini API Key.
     * `RAZORPAY_KEY_ID`: Your Razorpay Key ID.
     * `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret.
     * `FRONTEND_URL`: `https://client-silk-psi-23.vercel.app` (to allow CORS requests).
     * `NODE_ENV`: `production`

4. **Deploy**:
   - Click **Create Web Service** (or use the included `render.yaml` Blueprint).

### 🎨 Frontend Deployment (Vercel)
The React client frontend is deployed on Vercel:
1. Connect this repository to Vercel.
2. In project settings, set **Framework Preset** to `Vite` and **Root Directory** to `client`.
3. Add the environment variable:
   - `VITE_API_URL`: `https://museum-booking-api.onrender.com/api`


## ✨ Features

- **AI Booking Assistant**: Conversational ticket booking powered by Google Gemini AI with intelligent fallbacks.
- **Real-time Context**: AI fetches live pricing, limits, and time slot availability dynamically from the database.
- **Razorpay Payments**: Secure payment flow with HMAC validation and automatic status updates.
- **Admin Dashboard**: Comprehensive management interface to view bookings and configure ticket pricing/limits in real-time.
- **About Page**: Immersive story experience with modern parallax scroll effects.
- **3D Hero Scene**: High-performance interactive glass prism visualizer using Three.js and Framer Motion.
