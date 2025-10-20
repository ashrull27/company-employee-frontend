# Company-Employee Management Frontend

A modern React-based admin panel for managing companies and their employees with GitHub OAuth authentication.

**Live Application**: https://companymanagement27.netlify.app

## Tech Stack

- **React** 18.2.0 - UI framework
- **React Router** 6.20.0 - Client-side routing
- **Bootstrap** 5.3.2 - CSS framework
- **Axios** 1.6.2 - HTTP client
- **JWT Decode** 3.1.2 - Token decoding
- **React Icons** 4.12.0 - Icon library

## Features

- GitHub OAuth 2.0 authentication
- JWT-based session management
- Company management (Create, Read, Update, Delete)
- Employee management (Create, Read, Update, Delete)
- Paginated data tables
- Responsive Bootstrap UI
- Form validation
- Protected routes

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see deployment section)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/ashrull27/company-employee-frontend.git
cd company-employee-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=https://company-employee-api-d29n.onrender.com/api
```

For local development:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run Locally

```bash
npm start
```

The application will open at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Deployment to Netlify

### Prerequisites
- Netlify account
- GitHub account

### Steps

1. **Connect Repository**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Select GitHub and authorize
   - Choose `company-employee-frontend` repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `build`
   - Leave other settings as default

3. **Add Environment Variables**
   - Go to "Site settings" → "Build & deploy" → "Environment"
   - Add variable:
     ```
     Key: REACT_APP_API_URL
     Value: https://company-employee-api-d29n.onrender.com/api
     ```

4. **Deploy**
   - Click "Deploy site"
   - Wait 3-5 minutes for build and deployment
   - Your site will be live at the provided Netlify URL

## API Endpoints

All endpoints require Bearer token authentication in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/github` | Initiate GitHub OAuth login |
| GET | `/api/auth/github/callback` | GitHub OAuth callback |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user info |

### Companies

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies?page=1&limit=10` | Get paginated companies list |
| GET | `/api/companies/:id` | Get single company details |
| POST | `/api/companies` | Create new company |
| PUT | `/api/companies/:id` | Update company |
| DELETE | `/api/companies/:id` | Delete company |

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees?page=1&limit=10` | Get paginated employees list |
| GET | `/api/employees/:id` | Get single employee details |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

## Backend Repository

For backend setup and API documentation, see:
https://github.com/ashrull27/company-employee-api

## Author

ashrull27

## Support

For issues or questions, please create an issue in the GitHub repository.
