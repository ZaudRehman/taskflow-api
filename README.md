# TaskFlow API 🚀

<div align="center">

**A full-stack task management application with RESTful API backend built using FastAPI and PostgreSQL**

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

[Live Demo](https://taskflow-api-tzoh.onrender.com/app) · [API Docs](https://taskflow-api-tzoh.onrender.com/docs) · [Report Bug](https://github.com/ZaudRehman/taskflow-api/issues) · [Request Feature](https://github.com/ZaudRehman/taskflow-api/issues)

</div>

***

## 📖 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

***

## 🎯 About The Project

TaskFlow is a full-stack task management application I built to learn and demonstrate modern backend development practices. The project features a **RESTful API** built with FastAPI, JWT authentication, and a responsive frontend interface.


### Why TaskFlow API?

This project demonstrates mastery of critical backend competencies:

-  **RESTful API Design** - Clean, consistent endpoints following industry standards  
- **Secure Authentication** - JWT-based auth with access/refresh token mechanism  
- **Database Architecture** - Normalized PostgreSQL schema with proper relationships  
- **Async Programming** - Modern Python async/await patterns with SQLAlchemy 2.0  
- **Security Best Practices** - Bcrypt hashing, rate limiting, input validation  
- **Production Readiness** - Error handling, logging, health checks, CORS  

### What I Learned

- Building RESTful APIs with proper HTTP methods and status codes
- Implementing JWT-based authentication and authorization
- Working with PostgreSQL databases using SQLAlchemy ORM
- Writing async Python code for better performance
- Frontend integration with vanilla JavaScript
- Deploying applications to production

***

## ✨ Key Features

### 🔐 Authentication & Authorization
- **JWT Token Authentication** with secure access (15-min) and refresh (7-day) tokens
- **Password Security** using Bcrypt with proper salt rounds
- **Rate Limiting** to prevent brute force attacks (5 login attempts per 15 minutes)
- **Token Refresh** mechanism for seamless user experience

### 📝 Task Management
- **Full CRUD Operations** - Create, Read, Update, Delete tasks
- **Advanced Filtering** - Filter by status, priority, category, due date
- **Smart Search** - Full-text search across title and description
- **Flexible Sorting** - Sort by created date, due date, or priority
- **Pagination** - Efficient data retrieval with configurable page sizes (max 100 items)
- **Task Priorities** - LOW, MEDIUM, HIGH, URGENT levels
- **Task Statuses** - TODO, IN_PROGRESS, COMPLETED workflows

### 🗂️ Category Organization
- **Custom Categories** - Create personalized task categories
- **Color Coding** - Assign hex colors for visual organization
- **Category Assignment** - Link tasks to categories with proper relationships
- **Cascade Behavior** - Configurable handling when categories are deleted

### 📊 API Standards
- **RESTful Design** - Proper HTTP methods and status codes[1]
- **API Versioning** - URL-based versioning (`/api/v1/...`)
- **Consistent Responses** - Standardized JSON response format
- **Error Handling** - Detailed error messages with proper codes
- **CORS Support** - Configurable cross-origin resource sharing

***

## 🛠️ Tech Stack

### Backend Framework
- **[FastAPI](https://fastapi.tiangolo.com/)** 0.109.0 - Modern, fast web framework for building APIs[3][2]
- **[Uvicorn](https://www.uvicorn.org/)** - Lightning-fast ASGI server

### Database & ORM
- **[PostgreSQL](https://www.postgresql.org/)** 15+ - Powerful, open-source relational database
- **[SQLAlchemy](https://www.sqlalchemy.org/)** 2.0 - Modern async ORM with full type support[2]
- **[asyncpg](https://github.com/MagicStack/asyncpg)** - Fast PostgreSQL database client for Python
- **[Alembic](https://alembic.sqlalchemy.org/)** - Database migration tool

### Authentication & Security
- **[python-jose](https://github.com/mpdavis/python-jose)** - JWT token implementation
- **[passlib](https://passlib.readthedocs.io/)** - Password hashing with bcrypt
- **[SlowAPI](https://github.com/laurentS/slowapi)** - Rate limiting middleware

### Validation & Configuration
- **[Pydantic](https://docs.pydantic.dev/)** v2 - Data validation using Python type hints[2]
- **[python-dotenv](https://github.com/theskumar/python-dotenv)** - Environment variable management

### Testing
- **[pytest](https://docs.pytest.org/)** - Testing framework
- **[pytest-asyncio](https://pytest-asyncio.readthedocs.io/)** - Async test support
- **[httpx](https://www.python-httpx.org/)** - Modern HTTP client for testing

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Neo-Brutalism UI design


***

## 🏗️ Architecture

TaskFlow API follows a **clean layered architecture** for maintainability and scalability:

```
┌─────────────────────────────────────────────────────────┐
│                    FastAPI Application                  │
├─────────────────────────────────────────────────────────┤
│  Presentation Layer                                     │
│  ├─ API Routes (v1)                                     │
│  ├─ Request/Response Models (Pydantic Schemas)          │
│  └─ Authentication Middleware                           │
├─────────────────────────────────────────────────────────┤
│  Business Logic Layer                                   │
│  ├─ Authentication & Authorization                      │
│  ├─ Task Management Logic                               │
│  ├─ Category Management Logic                           │
│  └─ Input Validation & Error Handling                   │
├─────────────────────────────────────────────────────────┤
│  Data Access Layer                                      │
│  ├─ SQLAlchemy Models                                   │
│  ├─ Database Session Management                         │
│  └─ Query Optimization                                  │
├─────────────────────────────────────────────────────────┤
│  PostgreSQL Database                                    │
│  ├─ Users Table                                         │
│  ├─ Tasks Table                                         │
│  └─ Categories Table                                    │
└─────────────────────────────────────────────────────────┘
```

### Design Patterns Used
- **Dependency Injection** - FastAPI's built-in DI system
- **Repository Pattern** - Data access abstraction
- **Factory Pattern** - Token and session creation
- **Middleware Pattern** - Authentication and rate limiting
- **DTO Pattern** - Pydantic schemas for data transfer

***

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have these installed:

- **Python 3.11+** - [Download Python](https://www.python.org/downloads/)
- **PostgreSQL 15+** - [Download PostgreSQL](https://www.postgresql.org/download/) or use free cloud option
- **Git** - [Download Git](https://git-scm.com/downloads/)
- **pip** - Python package manager (included with Python)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZaudRehman/taskflow-api.git
   cd taskflow-api
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the project root:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/taskflow_db
   
   # JWT Configuration
   JWT_SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters-long
   JWT_ALGORITHM=HS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15
   JWT_REFRESH_TOKEN_EXPIRE_DAYS=7
   
   # API Configuration
   API_V1_PREFIX=/api/v1
   PROJECT_NAME=TaskFlow API
   VERSION=1.0.0
   DEBUG=True
   
   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000,http://127.0.0.1:8000
   
   # Rate Limiting
   RATE_LIMIT_PER_MINUTE=60
   LOGIN_RATE_LIMIT=5
   ```

5. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb taskflow_db
   
   # Database tables will be created automatically on first run
   ```

6. **Run the application**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

7. **Access the API**
   - API Root: `http://localhost:8000`
   - Frontend: `http://localhost:8000/app`
   - Swagger Docs: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`
   - Health Check: `http://localhost:8000/health`



***

## 📚 API Documentation

### Interactive API Documentation

TaskFlow API provides **auto-generated, interactive documentation**:

- **Swagger UI**: `http://localhost:8000/docs` - Try endpoints directly in browser
- **ReDoc**: `http://localhost:8000/redoc` - Beautiful, responsive documentation

### API Endpoints Overview

#### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user account |
| `POST` | `/api/v1/auth/login` | Login and receive JWT tokens | 
| `POST` | `/api/v1/auth/refresh` | Refresh access token | 
| `POST` | `/api/v1/auth/logout` | Logout (client-side token deletion) | 

#### Task Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/tasks` | Create new task |
| `GET` | `/api/v1/tasks` | List all tasks with filters/pagination |
| `GET` | `/api/v1/tasks/{task_id}` | Get specific task by ID |
| `PATCH` | `/api/v1/tasks/{task_id}` | Update task (partial update) |
| `DELETE` | `/api/v1/tasks/{task_id}` | Delete task permanently |

#### Category Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/categories` | Create new category |
| `GET` | `/api/v1/categories` | List all categories |
| `GET` | `/api/v1/categories/{category_id}` | Get specific category |
| `PATCH` | `/api/v1/categories/{category_id}` | Update category |
| `DELETE` | `/api/v1/categories/{category_id}` | Delete category |


### HTTP Status Codes

TaskFlow API uses standard HTTP status codes:

| Code | Status | Description |
|------|--------|-------------|
| `200` | OK | Successful GET, PATCH requests |
| `201` | Created | Successful POST requests |
| `204` | No Content | Successful DELETE requests |
| `400` | Bad Request | Invalid request data/validation errors |
| `401` | Unauthorized | Missing or invalid authentication |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate resource (e.g., email exists) |
| `422` | Unprocessable Entity | Semantic validation errors |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server-side errors |

***

## 🗄️ Database Schema

### Entity Relationship Diagram

```
              ┌─────────────────────────┐
              │         Users           │
              ├─────────────────────────┤
              │ id (PK, UUID)           │
              │ username (UNIQUE)       │
              │ email (UNIQUE)          │
              │ password_hash           │
              │ first_name              │
              │ last_name               │
              │ created_at              │
              │ updated_at              │
              └────────────┬────────────┘
                           │
                           │ 1:N
                           │
              ┌────────────┴──────────────────┐
              │                               │
              │                               │
              ▼                               ▼
        ┌─────────────────────┐   ┌─────────────────────┐
        │     Categories      │   │        Tasks        │
        ├─────────────────────┤   ├─────────────────────┤
        │ id (PK, UUID)       │   │ id (PK, UUID)       │
        │ user_id (FK)        │   │ user_id (FK)        │
        │ name                │◄──┤ category_id (FK)    │
        │ color               │1:N│ title               │
        │ description         │   │ description         │
        │ created_at          │   │ status              │
        │ updated_at          │   │ priority            │
        └─────────────────────┘   │ due_date            │
                                  │ created_at          │
                                  │ updated_at          │
                                  └─────────────────────┘
```

### Table Definitions

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
);
```

#### Tasks Table
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'TODO' 
        CHECK (status IN ('TODO', 'IN_PROGRESS', 'COMPLETED')),
    priority VARCHAR(20) DEFAULT 'MEDIUM' 
        CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date),
    INDEX idx_priority (priority)
);
```

#### Categories Table
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);
```

### Database Optimizations

- **Indexes** on frequently queried columns (user_id, status, due_date)
- **Foreign Key Constraints** for referential integrity
- **Cascade Deletes** for users (removes all related data)
- **SET NULL** for category deletion (preserves tasks)
- **Unique Constraints** to prevent duplicates
- **Connection Pooling** for efficient resource usage

***

## 🚀 Deployment

TaskFlow API can be deployed on multiple **free hosting platforms**.

### Free Database Options

#### Option 1: Supabase (Recommended)
- **500MB database** free tier
- **Automatic backups**
- **Connection pooling** included
- **Setup**: [supabase.com](https://supabase.com/)

```env
DATABASE_URL=postgresql+asyncpg://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

#### Option 2: Railway.app
- **5GB storage** free tier
- **Easy PostgreSQL** deployment
- **Setup**: [railway.app](https://railway.app/)

```env
DATABASE_URL=postgresql+asyncpg://postgres:[PASSWORD]@[HOST]:[PORT]/railway
```

#### Option 3: Neon.tech
- **3GB storage** free tier
- **Serverless PostgreSQL**
- **Setup**: [neon.tech](https://neon.tech/)

### Free API Hosting Options

#### Option 1: Railway.app (Recommended)

1. **Sign up** at [railway.app](https://railway.app/)
2. **Connect GitHub** repository
3. **Add PostgreSQL** service
4. **Deploy FastAPI** service
5. **Set environment variables** from Railway dashboard
6. **Deploy** with one click

**Environment Variables to Set:**
- `DATABASE_URL` (auto-populated by Railway)
- `JWT_SECRET_KEY`
- `ALLOWED_ORIGINS`
- `DEBUG=False`

#### Option 2: Render.com

1. **Sign up** at [render.com](https://render.com/)
2. **Create PostgreSQL** database
3. **Create Web Service** (select Python)
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. **Set environment variables**

#### Option 3: Firebase Studio + App Hosting

1. **Deploy from Firebase Studio** with one click
2. **Built-in hosting** and deployment
3. **Integrated development** environment

***

## 📂 Project Structure

```
taskflow-api/
├── 📄 main.py                      # Application entry point
├── 📄 requirements.txt              # Python dependencies
├── 📄 .env.example                  # Environment variables template
├── 📄 .gitignore                    # Git ignore rules
├── 📄 alembic.ini                   # Database migration config
├── 📄 README.md                     # This file
│
├── 📁 config/                       # Configuration management
│   ├── __init__.py
│   └── settings.py                  # Pydantic settings
│
├── 📁 database/                     # Database configuration
│   ├── __init__.py
│   ├── base.py                      # Base model and mixins
│   └── session.py                   # Async session factory
│
├── 📁 models/                       # SQLAlchemy ORM models
│   ├── __init__.py
│   ├── user.py                      # User model
│   ├── task.py                      # Task model
│   └── category.py                  # Category model
│
├── 📁 schemas/                      # Pydantic schemas
│   ├── __init__.py
│   ├── user.py                      # User schemas
│   ├── task.py                      # Task schemas
│   ├── category.py                  # Category schemas
│   └── auth.py                      # Auth schemas
│
├── 📁 api/                          # API layer
│   ├── __init__.py
│   ├── deps.py                      # Dependencies (auth)
│   └── v1/                          # API version 1
│       ├── __init__.py
│       ├── router.py                # Main API router
│       └── endpoints/               # Endpoint modules
│           ├── __init__.py
│           ├── auth.py              # Auth endpoints
│           ├── tasks.py             # Task endpoints
│           └── categories.py        # Category endpoints
│
├── 📁 core/                         # Core functionality
│   ├── __init__.py
│   ├── security.py                  # JWT & password hashing
│   └── exceptions.py                # Custom exceptions
│
├── 📁 frontend/                     # Frontend files
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
│
├── 📁 utils/                        # Utility functions
│   ├── __init__.py
│   └── rate_limiter.py              # Rate limiting
│
├── 📁 migrations/                   # Alembic migrations
│   └── versions/                    # Migration scripts
│
└── 📁 tests/                        # Test suite
    ├── __init__.py
    ├── conftest.py                  # Test configuration
    └── test_auth.py                 # Auth tests
```

This structure follows **FastAPI best practices** for scalability and maintainability.

***

## 🔒 Security

TaskFlow API implements **multiple layers of security** to protect user data and prevent common vulnerabilities.

### Authentication Security

- **JWT Tokens**: Industry-standard JSON Web Tokens for stateless authentication
- **Token Expiration**: Short-lived access tokens (15 min) with refresh tokens (7 days)
- **Secure Token Storage**: Tokens never stored server-side (stateless design)
- **Password Requirements**: Minimum 8 characters with uppercase, number, and special character

### Password Security

- **Bcrypt Hashing**: Industry-standard password hashing algorithm
- **Salt Rounds**: Configurable salt rounds (default: 12) for computation hardness
- **No Plain Text**: Passwords never stored or logged in plain text
- **Secure Comparison**: Constant-time comparison to prevent timing attacks

### Rate Limiting

- **Login Protection**: 5 attempts per 15 minutes per IP address
- **Registration Throttling**: 5 registrations per hour per IP
- **API Rate Limits**: 60 requests per minute per authenticated user
- **DDoS Prevention**: SlowAPI middleware for request throttling

### Input Validation

- **Pydantic Validation**: All inputs validated against strict schemas
- **SQL Injection Prevention**: SQLAlchemy ORM prevents SQL injection attacks
- **XSS Prevention**: Automatic escaping of user inputs
- **Type Safety**: Python type hints enforced at runtime

### CORS Configuration

- **Whitelist Origins**: Only specified origins allowed (configurable)
- **Credential Support**: Secure cookie and authorization header handling
- **Method Restrictions**: Only required HTTP methods enabled

### Additional Security Measures

- **HTTPS Enforcement**: Production deployment requires HTTPS
- **Secure Headers**: Security headers configured (handled by hosting platforms)
- **Error Messages**: Generic error messages to prevent information leakage
- **Logging**: Comprehensive audit logging without sensitive data

***

## 🔮 Future Improvements

- [ ] Add task sharing between users
- [ ] Implement email notifications for due dates
- [ ] Add file attachments to tasks
- [ ] Create mobile app version
- [ ] Add recurring tasks feature
- [ ] Implement team workspaces

***

## 🤝 Contributing

While this is a personal learning project, I'm open to suggestions! Feel free to:

- Report bugs by opening an issue
- Suggest new features
- Submit pull requests


### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow PEP 8 style guide for Python code
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Add meaningful commit messages
- Keep PRs focused on a single feature/fix

***

## 📄 License

Distributed under the [**MIT License**](LICENSE). See `LICENSE` file for more information.

***

## 📧 Contact

**Zaud Rehman** - [@RehmanZaud](https://x.com/RehmanZaud) · [LinkedIn](https://www.linkedin.com/in/zaud-rehman-31514a288/) · zaudrehman@gmail.com

**Project Link**: [https://github.com/ZaudRehman/taskflow-api](https://github.com/ZaudRehman/taskflow-api)

**Live Demo**: [https://taskflow-api-tzoh.onrender.com/app](https://taskflow-api-tzoh.onrender.com/app)

**API Documentation**: [https://taskflow-api-tzoh.onrender.com/docs](https://taskflow-api-tzoh.onrender.com/docs)

***

## 🙏 Acknowledgments

This project was built with the help of amazing open-source tools and resources:

- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework
- [SQLAlchemy](https://www.sqlalchemy.org/) - Python SQL toolkit
- [Pydantic](https://docs.pydantic.dev/) - Data validation
- [PostgreSQL](https://www.postgresql.org/) - Powerful database
- [python-jose](https://github.com/mpdavis/python-jose) - JWT implementation
- [passlib](https://passlib.readthedocs.io/) - Password hashing
- [pytest](https://docs.pytest.org/) - Testing framework

***

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ and FastAPI**

[⬆ Back to Top](#taskflow-api-)

</div>