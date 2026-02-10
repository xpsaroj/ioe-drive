# ioe-drive
A collaborative platform for IOE (Institute of Engineering, Nepal) students to share and access academic resources including books, notes, past questions, and study materials organized by semester and subjects.

## Overview
IOE Drive is designed to facilitate the sharing of academic resources among IOE students. It provides a centralized repository where students can upload and access study materials categorized by semester, subjects and departments. The platform aims to enhance the learning experience by making it easier for students to find relevant resources for their courses.

## Architecture
- Architecture Style: Client-Server
- Frontend: Next.js 16 with App Router
- Backend: Node.js with Express
- Server Architecture: Layered architecture (Controller → Service → Repository)
- Database: PostgreSQL with Drizzle ORM
- Authentication: Clerk
- Deployment: Vercel (Client), Render (Server)

## Tech Stack
### Frontend
- Next.js 16 with App Router
- Tailwind CSS for styling
- Clerk for authentication
- Redux Toolkit for state management
- Lucide React for icons
- Zod and React Hook Form for form validation

### Backend
- Node.js with Express
- PostgreSQL with Drizzle ORM
- Clerk for authentication
- Multer for file uploads
- Zod for schema validation

## Project Structure
```
ioe-drive/
├── .github/
│   └── workflows/              # GitHub Actions workflows
│
├── frontend/                   # Frontend code
│   ├── public/                 # Static assets
│   ├── src/                    # Source code for the frontend
│   │   ├── app/                # Next.js App Router files
│   │   ├── components/         # Reusable React components
│   │   ├── constants/          # Constants used across the frontend
│   │   ├── context/            # React context for state management
│   │   ├── lib/                # Utility functions and libraries
│   │   │   ├── api/            # API client for backend communication
│   │   │   ├── store/          # Redux store configuration
│   │   │   ├── validators/     # Zod schemas for validation
│   │   └── types/              # TypeScript types
│   └── package.json
│
├── backend/                    # Backend code
│   ├── src/                    # Source code for the backend
│   │   ├── config/             # Configuration files (e.g., env, clerk config)
│   │   ├── db/                 # Drizzle ORM, database and migration files
│   │   ├── lib/                # Utility functions and libraries
│   │   ├── middlewares/        # Middlewares for auth, error handling, etc.
│   │   ├── modules/            # Feature modules
│   │   │   ├── department/     # Department related code
│   │   │   ├── health/         # Health check related code
│   │   │   ├── me/             # User profile related code
│   │   │   ├── notes/          # Notes related code
│   │   │   ├── subject/        # Subject related code
│   │   │   ├── user/           # User management related code
│   │   │   └── webhook/        # Webhook related code
│   │   ├── routes/             # Express route definitions
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Utility functions
│   │   ├── server.ts           # Express server setup
│   │   ├── index.ts            # App entry point
│   ├── types/                  # Global TypeScript types
│   └── package.json
└── README.md
```

## Contributing
Contributions are welcome! Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to this project.