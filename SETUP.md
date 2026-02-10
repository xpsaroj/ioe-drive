# Development Environment Setup
This guide provides instructions on how to set up the development environment for both the frontend and backend of IOE Drive.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- Node.js (version 22 or higher)
- PostgreSQL (version 17 or higher)
- Git

## Backend Setup
### Setup Instructions
1. **Navigate to the Backend Directory**:
   ```bash
   cd backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the `.env.example` file to `.env` and fill in the required environment variables.
   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file and set the following variables:
   ```bash
   # Database Configuration
   DATABASE_URL="your_postgresql_connection_string"

   # Server Configuration
   PORT=4000

   # Clerk Configuration
   CLERK_WEBHOOK_SIGNING_SECRET="your_clerk_webhook_signing_secret"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"

   # CORS Configuration
   ALLOWED_ORIGINS="http://localhost:3000"

   # Azure Blob Storage Configuration
   AZURE_STORAGE_CONNECTION_STRING="your_azure_storage_connection_string"
   AZURE_STORAGE_CONTAINER="your_azure_storage_container_name"
   ```

4. **Run Database Migrations**:
   ```bash
   npm run db:migrate
   ```

5. **Start the Backend Server**:
   ```bash
   npm run dev
   ```

### Linting and Building
- To lint the backend code:
  ```bash
  npm run lint
  ```
- To build the backend code:
  ```bash
  npm run build
  ```

### Running Production Build Locally
- To run the production build of the backend locally:
  ```bash
  npm run start
  ```

## Frontend Setup
### Setup Instructions
1. **Navigate to the Frontend Directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the `.env.example` file to `.env` and fill in the required environment variables.
   ```bash
   cp .env.example .env
   ```

    Edit the `.env` file and set the following variables:
    ```bash
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
    CLERK_SECRET_KEY="your_clerk_secret_key"
    NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
    NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/dashboard"
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/dashboard"
    NEXT_PUBLIC_API_BASE_URL="http://localhost:4000/api"
    ```

4. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```

### Linting and Building
- To lint the frontend code:
  ```bash
  npm run lint
  ```
- To build the frontend code:
  ```bash
  npm run build
  ```

### Running Production Build Locally
- To run the production build of the frontend locally:
  ```bash
  npm run start
  ```