# Creative Showcase 🎨

A full-stack web application for artists and creators to showcase their work. This platform allows users to register, manage their profiles, upload artwork, and share a public portfolio with a custom URL.

Built with the **MERN Stack** (MongoDB, Express, Node.js) and vanilla JavaScript/TailwindCSS.

## 🚀 Live Demo

- **Frontend (Website):** [Click here to visit](https://creative-showcase-azure.vercel.app)
- **Backend (API):** [Click here to view API root](https://creative-showcase-xhpn.onrender.com)

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5, Vanilla JavaScript
- Tailwind CSS (Styling)
- Axios (API Requests)

**Backend:**
- Node.js & Express.js
- MongoDB (Database) & Mongoose
- Cloudinary (Image Storage)
- JSON Web Tokens (JWT) for secure authentication
- Multer (File handling)

---

## ✨ Features

- **User Authentication:** Secure Login/Signup with HttpOnly Cookies (Access & Refresh Tokens).
- **Dashboard:** Private user area to view profile details.
- **Image Upload:** Upload profile pictures and artwork directly to Cloudinary.
- **Public Profiles:** Shareable dynamic URLs (e.g., `/profile/john`).
- **Responsive Design:** Fully mobile-friendly UI using Tailwind CSS.
- **Security:** Password hashing (Bcrypt), CORS protection, and secure cookie handling.

---

## ⚙️ Environment Variables

To run this project, you need to set up the following environment variables in your `.env` file (Backend) and your deployment platforms.

`PORT`=8000
`MONGODB_URI`=mongodb+srv://<your-db-string>
`CORS_ORIGIN`=http://localhost:5500 (Local) OR https://your-app.vercel.app (Production)
`ACCESS_TOKEN_SECRET`=your_secret_key
`ACCESS_TOKEN_EXPIRY`=1d
`REFRESH_TOKEN_SECRET`=your_refresh_secret
`REFRESH_TOKEN_EXPIRY`=10d
`CLOUDINARY_CLOUD_NAME`=your_cloud_name
`CLOUDINARY_API_KEY`=your_api_key
`CLOUDINARY_API_SECRET`=your_api_secret

---

## 💻 Installation & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/purkait03/Creative-Showcase.git
cd creative-showcase
```
### 2. Backend Setup
```bash
cd server
npm install
```
Create a .env file with the variables listed above.

Start the server:
```bash
npm start
```
### 3. Frontend Setup
```bash
cd client
```
Update js/api.js base URL to http://localhost:8000/api/v1 for local development.

Open index.html with Live Preview (VS Code Extension).

---

## ☁️ Deployment Strategy

This project uses a split deployment strategy to ensure security and performance.

### Frontend (Vercel)
The client folder is deployed on Vercel.

Uses a vercel.json rewrite rule to proxy API requests to the backend. This avoids CORS issues and allows secure HttpOnly Cookies to work across domains.

vercel.json configuration:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "(https://creative-showcase-xhpn.onrender.com/api/:path)*"
    }
  ]
}
```

## Backend (Render)
The server folder is deployed on Render.

Handles all database logic, authentication, and image processing.

CORS_ORIGIN is set to the Vercel frontend URL to allow credentialed requests.
