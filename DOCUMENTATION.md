# DOCUMENTATION - ApniSec Platform

## Architecture Overview

ApniSec is a full-stack cybersecurity management platform built with Next.js 15+, following strict Object-Oriented Programming (OOP) principles in the backend.

## System Design

### High-Level Architecture

```
┌─────────────────┐
│   Frontend      │
│  (Next.js App)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   API Routes    │
│   (Handlers)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Services      │
│ (Business Logic)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Repositories   │
│  (Data Access)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Database      │
│  (PostgreSQL)   │
└─────────────────┘
```

## Backend OOP Structure

### 1. Error Layer (`core/errors/`)

Custom error classes extending base `AppError`:

- **AppError** - Base error class with statusCode and isOperational
- **AuthError** - Authentication failures (401)
- **ValidationError** - Input validation errors (400)
- **NotFoundError** - Resource not found (404)
- **RateLimitError** - Rate limit exceeded (429)

### 2. Utilities Layer (`core/utils/`)

Pure utility classes with static methods:

- **JWT** - Token signing and verification
- **Password** - Hashing and comparison with bcrypt
- **ApiResponse** - Consistent API response formatting

### 3. Middleware Layer (`core/middlewares/`)

- **AuthMiddleware** - JWT token verification
- **RateLimiter** - Custom rate limiting (100 req/15min)

### 4. Validators Layer (`core/validators/`)

Input validation using Zod schemas:

- **AuthValidator** - Registration and login validation
- **IssueValidator** - Issue creation and update validation
- **UserValidator** - Profile update validation

### 5. Repository Layer (`core/repositories/`)

Data access layer with Prisma:

- **UserRepository** - User CRUD operations
- **IssueRepository** - Issue CRUD operations with filtering

### 6. Service Layer (`core/services/`)

Business logic layer:

- **AuthService** - Registration, login, user retrieval
- **IssueService** - Issue management with email notifications
- **UserService** - Profile management
- **EmailService** - Email sending with Resend API

### 7. Handler Layer (`core/handlers/`)

HTTP request/response processing:

- **AuthHandler** - Authentication endpoints
- **IssueHandler** - Issue management endpoints
- **UserHandler** - User profile endpoints

### 8. API Routes (`app/api/`)

Next.js route handlers that instantiate handlers and apply middleware.

## Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  issues    Issue[]
}
```

### Issue Model

```prisma
model Issue {
  id          String         @id @default(cuid())
  type        IssueType      # CLOUD_SECURITY | REDTEAM_ASSESSMENT | VAPT
  title       String
  description String
  priority    IssuePriority  # LOW | MEDIUM | HIGH | CRITICAL
  status      IssueStatus    # OPEN | IN_PROGRESS | RESOLVED | CLOSED
  userId      String
  user        User           @relation(fields: [userId], references: [id])
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}
```

## Authentication Flow

1. **Registration**
   - User submits email, password, name
   - Validator checks input format
   - Service checks if email exists
   - Password is hashed with bcrypt (12 rounds)
   - User created in database
   - JWT token generated
   - Welcome email sent asynchronously
   - Token returned to client

2. **Login**
   - User submits email, password
   - Service finds user by email
   - Password compared with bcrypt
   - JWT token generated
   - Token returned to client

3. **Protected Routes**
   - Client sends JWT in Authorization header
   - AuthMiddleware verifies token
   - User ID extracted from token
   - Request processed with user context

## Rate Limiting

### Implementation

- In-memory Map storage
- Key: `endpoint:ip`
- Limit: 100 requests
- Window: 15 minutes (900,000ms)
- Auto-cleanup every 5 minutes

### Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2024-12-24T13:30:00.000Z
Retry-After: 900 (if exceeded)
```

## Email Integration

### Resend API

Transactional emails sent for:

1. **Welcome Email** - On registration
2. **Issue Created** - When new issue is created
3. **Profile Updated** - When profile is updated

### Email Templates

HTML templates with:
- Professional design
- Cybersecurity branding
- Responsive layout
- Clear call-to-actions

## Frontend Architecture

### Pages

- `/` - Landing page with SEO optimization
- `/login` - Authentication
- `/register` - User registration
- `/dashboard` - Protected issue management
- `/profile` - Protected user profile

### API Client

Class-based client (`lib/api-client.ts`):
- Token management
- Automatic header injection
- Error handling
- Type-safe methods

### State Management

React hooks for:
- User authentication state
- Issue list management
- Form handling
- Loading/error states

## Security Features

1. **Password Security**
   - Bcrypt hashing (12 rounds)
   - Minimum 8 characters
   - Requires: uppercase, lowercase, number

2. **JWT Security**
   - Signed tokens
   - 7-day expiration
   - Stored in localStorage

3. **Input Validation**
   - Zod schemas on frontend and backend
   - SQL injection prevention (Prisma)
   - XSS prevention (React escaping)

4. **Rate Limiting**
   - Prevents brute force attacks
   - DDoS protection
   - Per-endpoint limits

## Performance Optimizations

1. **Database**
   - Indexed fields (email, userId)
   - Connection pooling
   - Select only required fields

2. **Frontend**
   - Next.js App Router
   - Automatic code splitting
   - Image optimization
   - Font optimization

3. **Caching**
   - Static page generation
   - API response caching potential
   - CDN delivery (on Vercel)

## SEO Optimization

1. **Meta Tags**
   - Title, description for each page
   - Open Graph tags
   - Keywords

2. **Technical SEO**
   - Sitemap.xml
   - Robots.txt
   - Semantic HTML
   - Fast loading times

3. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Color contrast

## Deployment Strategy

### Vercel Deployment

1. **Database**
   - Supabase PostgreSQL (free tier)
   - Connection pooling enabled

2. **Environment Variables**
   - Secure secret management
   - Separate dev/prod configs

3. **Build Process**
   - TypeScript compilation
   - Prisma client generation
   - Tailwind CSS optimization

4. **CI/CD**
   - Automatic deployments from main branch
   - Preview deployments for PRs
   - Environment-specific builds

## Error Handling

### Backend

- Try-catch blocks in all handlers
- Custom error classes
- Proper HTTP status codes
- Detailed error messages (dev only)

### Frontend

- Error boundaries
- Toast notifications
- Form validation feedback
- Graceful degradation

## Testing Strategy

### Manual Testing Checklist

- [ ] User registration flow
- [ ] User login flow
- [ ] Token persistence
- [ ] Protected route access
- [ ] Issue creation
- [ ] Issue filtering
- [ ] Issue update
- [ ] Issue deletion
- [ ] Profile update
- [ ] Email delivery
- [ ] Rate limiting
- [ ] Error handling
- [ ] Responsive design
- [ ] SEO scores

## Future Enhancements

1. **Security**
   - Refresh tokens
   - Password reset
   - Email verification
   - 2FA support

2. **Features**
   - Issue comments
   - File attachments
   - Notifications
   - Analytics dashboard

3. **Performance**
   - Redis caching
   - Background jobs
   - Real-time updates (WebSocket)

4. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Playwright)

## Conclusion

ApniSec demonstrates a production-ready full-stack application with:
- ✅ Complete OOP backend architecture
- ✅ Secure authentication system
- ✅ Custom rate limiting
- ✅ Email integration
- ✅ CRUD issue management
- ✅ SEO optimization
- ✅ Professional UI/UX
- ✅ Comprehensive documentation

Built with modern best practices and scalable architecture.
