# GE-Drive

A Google Drive-like file and folder management system built with Node.js, Express, and Prisma ORM.

## Features

- **User Authentication**
    - Local authentication with email/password
    - Google OAuth 2.0 authentication
    - Secure password hashing with bcryptjs
    - Session management with database persistence

- **File Management**
    - Upload files to organized folders
    - Delete and manage files
    - File metadata tracking (name, size, MIME type, upload date)
    - Integration with Supabase for cloud storage

- **Folder Management**
    - Create and organize nested folder structures
    - Delete folders with cascade delete
    - Root directory management per user
    - Share folders with unique share URLs

- **User Interface**
    - EJS templating for responsive views
    - Form validation and error handling
    - Flash messaging system for user feedback
    - RESTful API endpoints

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Passport.js (Local & Google OAuth 2.0)
- **File Storage**: Supabase
- **Templating**: EJS
- **Session Store**: Prisma Session Store
- **Utilities**:
    - bcryptjs for password hashing
    - multer for file uploads
    - express-validator for input validation
    - method-override for HTTP method override

## Prerequisites

- Node.js (v18+)
- PostgreSQL database
- pnpm package manager
- Supabase account (for file storage)
- Google OAuth credentials (optional, for Google sign-in)

## Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd ge-drive
    ```

2. **Install dependencies**

    ```bash
    pnpm install
    ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

    ```env
    DATABASE_URL=postgresql://user:password@localhost:5432/ge_drive
    SESSION_SECRET=your_session_secret_here
    NODE_ENV=development

    # Supabase credentials
    SUPABASE_URL=your_supabase_url
    SUPABASE_ANON_KEY=your_supabase_anon_key

    # Google OAuth (optional)
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
    ```

4. **Start the development server**

    ```bash
    pnpm run dev
    ```

    The application will be available at `http://localhost:3000`

## Project Structure

```
├── app.js                 # Main Express application entry point
├── controllers/           # Request handlers
│   ├── auth.js           # Authentication logic
│   ├── main.js           # Dashboard/home page
│   ├── file.js           # File operations
│   └── folder.js         # Folder operations
├── routes/               # Express route definitions
│   ├── auth.js
│   ├── main.js
│   ├── file.js
│   └── folder.js
├── lib/                  # Utility modules
│   ├── prisma.js         # Prisma client instance
│   ├── passport.js       # Passport authentication strategies
│   └── supabase.js       # Supabase client configuration
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.js           # Database seeding script
│   └── migrations/       # Database migration history
├── views/                # EJS templates
│   ├── sign-in.ejs       # Sign in page
│   ├── sign-up.ejs       # Sign up page
│   ├── folder.ejs        # Folder view
│   ├── file.ejs          # File view
│   └── snippets/         # Reusable template components
├── public/               # Static assets
│   └── style.css         # Stylesheet
├── utils/                # Helper utilities
│   ├── validators.js     # Input validation functions
│   ├── tryCatch.js       # Error handling wrapper
│   └── redirectToParent.js
└── uploads/              # Temporary file uploads directory
```

## Database Schema

### User

- `id`: Unique user identifier
- `name`: User's full name
- `email`: Email address (unique)
- `password`: Hashed password (optional for OAuth users)

### Folder

- `id`: Unique folder identifier
- `name`: Folder name
- `userId`: Owner's user ID
- `parentFolderId`: Parent folder ID for nested folders
- `shareUrl`: Unique URL for sharing the folder
- Relationships: `subFolders`, `files`, `user`

### File

- `id`: Unique file identifier
- `name`: Original file name
- `supabaseName`: Filename in Supabase storage
- `size`: File size in bytes
- `mimetype`: MIME type of the file
- `encoding`: File encoding
- `uploadedAt`: Upload timestamp
- `userId`: Owner's user ID
- `parentFolderId`: Parent folder ID
- Relationships: `user`, `folder`

### Session

- `id`: Session identifier
- `sid`: Session ID (unique)
- `data`: Session data (serialized)
- `expiresAt`: Session expiration time

## Available Scripts

```bash
# Start development server with auto-reload
pnpm run dev

# Seed the database
pnpm run seed

# Run tests (not yet implemented)
pnpm run test
```

## Authentication

The application uses Passport.js with two authentication strategies:

1. **Local Strategy**: Email and password authentication
2. **Google OAuth 2.0**: Sign in with Google account

Sessions are persisted in the database and expire after 1 day of inactivity.

## Error Handling

The application implements a centralized error handling middleware that:

- Logs errors to the console
- Stores error messages using flash messaging
- Redirects users to appropriate error pages
- Preserves form values for re-submission

## Security Features

- HTTPS-only cookies in production
- Password hashing with bcryptjs (10 salt rounds)
- CSRF protection via method-override
- SQL injection prevention through Prisma ORM
- Input validation with express-validator
- Session secret configuration via environment variables

## Support

For issues or questions, please create an issue in the repository.
