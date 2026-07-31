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
- **Live Backend (Railway)**: [https://backend-production-1f7f.up.railway.app](https://backend-production-1f7f.up.railway.app)

### 🚀 Backend Deployment (Railway)
Since this repository is a monorepo, follow these steps to deploy the backend (`/server`) service correctly on Railway:

1. **Create a Railway Project**:
   - Go to [Railway](https://railway.app/) and log in.
   - Click **New Project** -> **Deploy from GitHub repo**.
   - Select this repository (`AI-chatbot-Ticket-booking-system`).
   
2. **Configure Service Root Directory**:
   - In the Railway project board, click on the newly created service.
   - Go to the **Settings** tab.
   - Under the **General** section, locate the **Root Directory** field and set it to `/server`.
   - Scroll down to the **Config as Code** setting and specify `/server/railway.json` if it's not automatically detected.

3. **Configure Environment Variables**:
   - Go to the **Variables** tab of the service.
   - Add the following environment variables:
     * `GEMINI_API_KEY`: Your Google Gemini API Key.
     * `RAZORPAY_KEY_ID`: Your Razorpay Test Key ID.
     * `RAZORPAY_KEY_SECRET`: Your Razorpay Test Key Secret.
     * `DATABASE_PATH`: `/data/db.sqlite` (points to the persistent volume path).
     * `FRONTEND_URL`: `https://client-silk-psi-23.vercel.app` (to allow CORS requests).

4. **Attach a Persistent Volume** (Required for SQLite database persistence):
   - Under the service settings, go to the **Volume** tab.
   - Click **Add Volume**.
   - Set the mount path to `/data`.
   - This ensures the SQLite database file (`db.sqlite`) persists across redeployments and container restarts.

5. **Deploy**:
   - Save all configurations. Railway will trigger a build using the Nixpacks builder specified in `server/railway.json` and start the server.

### 🎨 Frontend Deployment (Vercel)
The React client frontend is optimized for deployment on Vercel:
1. Connect this repository to Vercel.
2. In the project settings, set the **Framework Preset** to `Vite` and the **Root Directory** to `client`.
3. Add the following environment variable:
   - `VITE_API_URL`: Point this to your Railway backend: `https://backend-production-1f7f.up.railway.app/api`.


## ✨ Features

- **AI Booking Assistant**: Conversational ticket booking powered by Google Gemini AI with intelligent fallbacks.
- **Real-time Context**: AI fetches live pricing, limits, and time slot availability dynamically from the database.
- **Razorpay Payments**: Secure payment flow with HMAC validation and automatic status updates.
- **Admin Dashboard**: Comprehensive management interface to view bookings and configure ticket pricing/limits in real-time.
- **About Page**: Immersive story experience with modern parallax scroll effects.
- **3D Hero Scene**: High-performance interactive glass prism visualizer using Three.js and Framer Motion.
