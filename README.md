# InternMix - Internship Platform

A React-based internship platform with minimal cookie-based authentication.

## Features

- **Minimal Authentication**: Simple cookie-based login system
- **User Types**: Support for students and recruiters
- **Responsive Design**: Modern UI with Tailwind CSS
- **Dashboard**: Different dashboards for students and recruiters

## Authentication

### Dummy Users

The system includes two dummy users for testing:

- **Student**: username: `student`, password: `student`
- **Recruiter**: username: `recruiter`, password: `recruiter`

### How to Login

1. Navigate to `/login`
2. Enter one of the dummy credentials above
3. You'll be redirected to the dashboard based on your user type

### Authentication Flow

- Login state is stored in browser cookies
- Authenticated users are redirected to `/dashboard`
- Unauthenticated users trying to access `/dashboard` are redirected to `/login`
- Logout clears the cookie and redirects to home

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Navigation with auth state
│   ├── Footer.tsx
│   └── sections/           # Landing page sections
├── context/
│   └── AuthContext.tsx     # Authentication context
├── pages/
│   ├── Home.tsx           # Landing page (redirects if authenticated)
│   ├── Login.tsx          # Login form
│   ├── Dashboard.tsx      # User dashboard
│   └── ...
├── utils/
│   └── auth.ts            # Cookie-based auth utilities
└── App.tsx                # Main app with routing
```

## Authentication Implementation

The authentication system uses:

- **Cookies**: Simple browser cookies for session storage
- **Context API**: React Context for state management
- **Protected Routes**: Automatic redirects based on auth state

### Key Files

- `src/utils/auth.ts`: Cookie utilities and authentication logic
- `src/context/AuthContext.tsx`: React context for auth state
- `src/pages/Login.tsx`: Login form with validation
- `src/pages/Dashboard.tsx`: Protected dashboard with user-specific content

## Future Enhancements

This is a dummy implementation. For production, consider:

- JWT tokens instead of simple cookies
- Server-side authentication
- Password hashing
- User registration
- Password reset functionality
- Role-based access control 