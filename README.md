Consultation Recording Manager
A full-stack MERN application for managing consultation recordings — upload audio/video files, store them securely on Cloudinary, organize them by client and date, and generate AI-powered summaries from consultation notes.
🚀 Features

🔐 JWT Authentication — Secure register/login with bcrypt password hashing
🎙️ Recording Upload — Drag-and-drop audio/video upload with progress bar
☁️ Cloudinary Storage — Media files stored and streamed from the cloud
🔍 Search & Filter — Search by title, client name, and filter by consultation date
✏️ Full CRUD — Create, view, update, and delete recordings
✨ AI Summary Generation — Auto-generate consultation summaries from notes
📊 Dashboard Analytics — Stats cards, charts, recent uploads, and activity timeline
🌗 Dark/Light Mode — Theme toggle with persistent preference
📱 Responsive UI — Premium glassmorphism design, mobile-friendly navigation

🛠️ Tech Stack
Backend

Node.js & Express.js
MongoDB Atlas & Mongoose
JWT for authentication
bcryptjs for password hashing
Multer + Cloudinary for media uploads
Joi for validation

Frontend

React.js (Vite)
Tailwind CSS
React Router DOM
Axios
Framer Motion
Lucide React Icons
Recharts
React Hot Toast

📁 Project Structure
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validations/
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        ├── context/
        ├── hooks/
        ├── routes/
        └── utils/
⚙️ Setup & Installation
Prerequisites

Node.js (v18+)
MongoDB Atlas account
Cloudinary account
Google Gemini API key (optional, for AI summaries)

Backend Setup
bashcd backend
npm install

Create a .env file in backend/:
envPORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:3000
Run the backend:
bashnpm run dev
Server runs on http://localhost:5000
Frontend Setup
bashcd frontend
npm install

Create a .env file in frontend/:
envVITE_API_BASE_URL=http://localhost:5000/api
Run the frontend:
bashnpm run dev
App runs on http://localhost:5173 (or 3000 depending on Vite config)

🤝 Contributing
Contributions, issues, and feature requests are welcome. Feel free to check the issues page.
📄 License
This project is licensed under the MIT License.
👤 Author
Built with ❤️ by Shivani Thakur