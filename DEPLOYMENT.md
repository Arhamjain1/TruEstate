# Deployment Guide

Since a live link is mandatory, here are instructions on how to deploy this application for free using Render (backend) and Vercel (frontend).

## Prerequisites
- A GitHub account.
- Push this code to a new GitHub repository.

## 1. Deploy Backend (Render)
1.  Go to [Render.com](https://render.com) and sign up/login.
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Settings**:
    -   **Name**: `truestate-backend` (or similar)
    -   **Root Directory**: `backend`
    -   **Environment**: `Node`
    -   **Build Command**: `npm install`
    -   **Start Command**: `npm start` (Ensure you have a start script in `backend/package.json` that runs `node src/server.js` or similar. If not, use `node src/index.js` or whatever your entry point is).
        -   *Note*: You might need to add `"start": "node src/server.js"` to `backend/package.json` if it's missing.
    -   **Environment Variables**:
        -   Add any necessary env vars (e.g., `PORT` is usually handled by Render, but you can set `PORT=10000`).
5.  Click **Create Web Service**.
6.  Wait for deployment. Copy the **Service URL** (e.g., `https://truestate-backend.onrender.com`).

## 2. Deploy Frontend (Vercel)
1.  Go to [Vercel.com](https://vercel.com) and sign up/login.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Project Settings**:
    -   **Framework Preset**: Vite
    -   **Root Directory**: `frontend`
5.  **Environment Variables**:
    -   Create a variable named `VITE_API_URL` (or whatever your frontend uses to point to the backend).
    -   Set the value to your Render Backend URL (e.g., `https://truestate-backend.onrender.com/api`).
    -   *Note*: You might need to update `frontend/src/services/api.js` to use `import.meta.env.VITE_API_URL` instead of hardcoded `localhost`.
6.  Click **Deploy**.
7.  Vercel will give you a live URL (e.g., `https://truestate-frontend.vercel.app`).

## 3. Final Checks
-   Ensure your backend handles CORS correctly to allow requests from your Vercel domain.
-   In `backend/src/server.js` (or app entry), ensure `cors` is configured:
    ```javascript
    const cors = require('cors');
    app.use(cors({ origin: '*' })); // Or specific domain
    ```

## Database Note
-   Since this project uses SQLite (a file-based DB), the data will reset every time the Render server restarts (which happens frequently on free tier).
-   For a persistent production app, you should use a hosted database like PostgreSQL (Render offers a free tier for Postgres too) or MongoDB.
-   However, for this assignment submission, the SQLite file might be sufficient if you seed it on startup, but be aware of the data persistence issue.
