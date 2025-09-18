# 🎉 Event Management System

A modern, full-stack Event Management System built with **Next.js**, **FastAPI**, and **PostgreSQL**. Features role-based authentication, image uploads via Cloudinary, and a beautiful responsive UI.

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure password hashing
- **Role-based access control** (Admin vs Normal User)
- **Protected routes** and API endpoints
- **Session management** with automatic token refresh

### 👑 Admin Users
- ✅ **Create, edit, and delete events** with full CRUD operations
- ✅ **Upload event images** via Cloudinary integration
- ✅ **Professional admin dashboard** with event management
- ✅ **Real-time form validation** and error handling
- ✅ **Image preview and management** in event forms

### 👥 Normal Users
- ✅ **View all events** with beautiful card layouts
- ✅ **Event details** with images, descriptions, dates, and times
- ✅ **Responsive design** that works on all devices
- ✅ **No modification permissions** (view-only access)

### 🎨 Modern UI/UX
- ✅ **Responsive design** with Tailwind CSS
- ✅ **Professional card layouts** for events
- ✅ **Loading states** and error handling
- ✅ **Smooth animations** and hover effects
- ✅ **Clean, modern interface** with consistent styling

## 🛠 Tech Stack

- **Frontend**: Next.js 14 with App Router, JavaScript, Tailwind CSS
- **Backend**: FastAPI (Python) with async support
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens with role-based access
- **File Uploads**: Cloudinary for image storage
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git with clean commit history

## 🚀 Quick Start

### Prerequisites
- **Docker and Docker Compose** (recommended)
- **Node.js 18+** (for local development)
- **Python 3.11+** (for local backend development)

### 🐳 Running with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ankitmohanty2/Event-Management-System.git
   cd Event-Management-System
   ```

2. **Start all services**
   ```bash
   docker compose up -d
   ```

3. **Access the application**
   - 🌐 **Frontend**: http://localhost:3000
   - 🔧 **Backend API**: http://localhost:8000
   - 📚 **API Documentation**: http://localhost:8000/docs
   - 🗄️ **Database**: localhost:6969 (PostgreSQL)

4. **Create your first admin account**
   - Go to http://localhost:3000/signup
   - Create an account with role "admin"
   - Start managing events!

### 🛠 Manual Setup

<details>
<summary>Click to expand manual setup instructions</summary>

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database and Cloudinary credentials
   ```

5. **Run the backend**
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API URL
   ```

4. **Run the frontend**
   ```bash
   npm run dev
   ```

</details>

## 📡 API Endpoints

### 🔐 Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login  
- `GET /auth/me` - Get current user info

### 📅 Events
- `GET /events/` - List all events (public access)
- `POST /events/` - Create event (admin only)
- `GET /events/{id}` - Get event details
- `PUT /events/{id}` - Update event (admin only)
- `DELETE /events/{id}` - Delete event (admin only)

### 📸 File Upload
- `POST /upload/image` - Upload event image (admin only)

## 📁 Project Structure

```
├── backend/                 # FastAPI backend
│   ├── routers/            # API route handlers
│   │   ├── users.py        # Authentication routes
│   │   ├── events.py       # Event CRUD routes
│   │   └── upload.py       # Image upload routes
│   ├── models.py           # SQLAlchemy database models
│   ├── schemas.py          # Pydantic request/response schemas
│   ├── auth.py             # JWT authentication logic
│   ├── deps.py             # FastAPI dependencies
│   ├── database.py         # Database configuration
│   ├── cloudinary_config.py # Cloudinary setup
│   └── main.py             # FastAPI application
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   │   ├── login/     # Login page
│   │   │   ├── signup/    # Signup page
│   │   │   ├── events/    # Events listing page
│   │   │   └── admin/     # Admin dashboard
│   │   ├── components/    # Reusable React components
│   │   │   ├── ui/        # UI components (Button, Card, etc.)
│   │   │   ├── EventCard.jsx
│   │   │   ├── ImageUpload.jsx
│   │   │   └── EditEventModal.jsx
│   │   ├── context/       # React context providers
│   │   └── lib/           # API utilities and helpers
│   └── public/            # Static assets
├── docker-compose.yml      # Docker services configuration
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🎯 Core Features Implementation

### ✅ Authentication System
- **Secure JWT tokens** with configurable expiration
- **Password hashing** using bcrypt
- **Role-based middleware** for protecting admin routes
- **Automatic token refresh** and session management

### ✅ Event Management
- **Full CRUD operations** for events
- **Image upload integration** with Cloudinary
- **Date and time validation** with proper formatting
- **Real-time updates** in the admin dashboard

### ✅ User Experience
- **Responsive design** that works on mobile, tablet, and desktop
- **Loading states** and error handling throughout the app
- **Professional UI components** with consistent styling
- **Intuitive navigation** with clear user role indicators

## 🖼 Screenshots

*Screenshots will be added here showing:*
- *Login/Signup pages*
- *Events listing page*
- *Admin dashboard*
- *Event creation/editing forms*
- *Mobile responsive design*

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
3. Deploy automatically on push to main branch

### Backend (Render/Railway/Heroku)
1. Connect your GitHub repository
2. Set environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Random secret key (32+ characters)
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `CORS_ORIGINS`: Comma-separated list of allowed origins
3. Deploy and get your API URL

### Database (PostgreSQL)
- **Local**: Docker Compose (included)
- **Production**: AWS RDS, Railway PostgreSQL, or Supabase

## 🧪 Testing

The system includes comprehensive testing for:
- ✅ **API endpoints** with proper status codes
- ✅ **Authentication flow** (login/logout)
- ✅ **Role-based access control**
- ✅ **Event CRUD operations**
- ✅ **Image upload functionality**
- ✅ **Frontend component rendering**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** for the excellent Python web framework
- **Next.js** for the powerful React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Cloudinary** for image upload and management
- **PostgreSQL** for the reliable database system

---

**Built with ❤️ for modern event management**