# ApniSec - Cybersecurity Management Platform

A production-ready full-stack Next.js application for managing cybersecurity issues with JWT authentication, rate limiting, and email notifications.

## 🚀 Features

- **Full OOP Backend Architecture** - Complete class-based implementation
- **JWT Authentication** - Custom implementation with bcrypt password hashing
- **Rate Limiting** - Custom 100 requests/15 minutes per IP
- **Email Integration** - Resend API for transactional emails
- **Issue Management** - Create, Read, Update, Delete security issues
- **Real-time Filtering** - Filter issues by type (Cloud Security, Redteam, VAPT)
- **SEO Optimized** - 80%+ Lighthouse score
- **Responsive Design** - Works on mobile, tablet, and desktop

## 📋 Tech Stack

### Frontend
- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS
- React 19+

### Backend
- Next.js API Routes with OOP
- Prisma ORM
- PostgreSQL (Supabase)
- JWT (jsonwebtoken)
- bcryptjs
- Resend (Email Service)
- Zod (Validation)

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Supabase account)
- Resend API key

### Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd apnisec-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/apnisec?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
RESEND_API_KEY="re_your_resend_api_key"
FROM_EMAIL="onboarding@resend.dev"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Set up the database**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
apnisec-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── issues/               # Issue management endpoints
│   │   └── users/                # User endpoints
│   ├── dashboard/                # Dashboard page
│   ├── login/                    # Login page
│   ├── profile/                  # Profile page
│   ├── register/                 # Registration page
│   └── page.tsx                  # Landing page
├── core/                         # OOP Backend Architecture
│   ├── errors/                   # Error classes
│   ├── handlers/                 # HTTP handlers
│   ├── middlewares/              # Middleware (Auth, RateLimit)
│   ├── repositories/             # Data access layer
│   ├── services/                 # Business logic layer
│   ├── utils/                    # Utility classes
│   └── validators/               # Input validation
├── lib/                          # Shared utilities
│   ├── api-client.ts            # Frontend API client
│   └── prisma.ts                # Prisma client
└── prisma/                       # Database schema
    └── schema.prisma
```

## 🔐 OOP Architecture

The backend follows a strict Object-Oriented Programming pattern:

1. **Handlers** - Process HTTP requests/responses
2. **Services** - Contain business logic
3. **Repositories** - Handle database operations
4. **Validators** - Validate input data
5. **Middlewares** - Authentication & Rate limiting
6. **Utils** - Helper classes (JWT, Password, Response)

Example flow:
```
Request → Handler → Validator → Service → Repository → Database
```

## 📧 Email Templates

The application sends emails for:
- Welcome email on registration
- Issue creation notifications
- Profile update notifications

## 🔒 Authentication

- Custom JWT-based authentication  
- Bcrypt password hashing (12 rounds)
- Token stored in localStorage
- Protected routes with middleware

## ⚡ Rate Limiting

- 100 requests per 15 minutes per IP
- Custom in-memory implementation
- Rate limit headers included in responses
- 429 status code when limit exceeded

## 🎨 UI/UX

- Modern cybersecurity-themed design
- Dark mode with purple/pink gradients
- Responsive across all devices
- Loading states and error handling
- Form validation with real-time feedback

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Issues
- `GET /api/issues` - List all issues (with filtering)
- `POST /api/issues` - Create new issue
- `GET /api/issues/[id]` - Get single issue
- `PUT /api/issues/[id]` - Update issue
- `DELETE /api/issues/[id]` - Delete issue

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Strong secret key
- `RESEND_API_KEY` - Your Resend API key
- `FROM_EMAIL` - Verified sender email
- `NEXT_PUBLIC_APP_URL` - Your production URL

## 🧪 Testing

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

## 📈 SEO

- Meta tags optimized
- Open Graph tags
- Sitemap.xml
- Robots.txt
- Semantic HTML
- Fast loading times

## 📝 License

MIT

## 👨‍💻 Author

Built for ApniSec SDE Internship Assignment

## 🆘 Support

For issues or questions, contact: atish.thakur@apnisec.com
