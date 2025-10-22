# 🏗️ Architecture Documentation

Подробная архитектура астрологической платформы.

## 📐 Общая архитектура

```
┌─────────────────────────────────────────────────────────┐
│                     Nginx (Port 80/443)                 │
│              Reverse Proxy + Load Balancer              │
└────────────┬────────────────────────────┬───────────────┘
             │                            │
             ▼                            ▼
    ┌────────────────┐          ┌──────────────────┐
    │   Next.js      │          │    FastAPI       │
    │   Frontend     │◄────────►│    Backend       │
    │   (Port 3000)  │   API    │   (Port 8000)    │
    └────────────────┘          └─────────┬────────┘
                                          │
                    ┌─────────────────────┼─────────────────┐
                    ▼                     ▼                 ▼
            ┌───────────────┐    ┌──────────────┐  ┌─────────────┐
            │  PostgreSQL   │    │    Redis     │  │   OpenAI    │
            │  (Port 5432)  │    │ (Port 6379)  │  │     API     │
            └───────────────┘    └──────────────┘  └─────────────┘
```

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Hooks + SWR
- **Forms**: React Hook Form + Zod
- **Auth**: NextAuth.js v5
- **Payments**: Stripe.js

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL 15 (async via asyncpg)
- **ORM**: SQLAlchemy 2.0 (async)
- **Cache**: Redis
- **Migrations**: Alembic
- **Auth**: JWT (python-jose)
- **Validation**: Pydantic v2

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt (optional)
- **CI/CD**: GitHub Actions (optional)

### External Services
- **Astrology Calculations**: kerykeion (Swiss Ephemeris)
- **AI Interpretations**: OpenAI GPT-4
- **Payments**: Stripe
- **Email**: SMTP (optional)
- **Monitoring**: Sentry (optional)

## 📊 Database Schema

### Users Table
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,
  full_name VARCHAR,
  subscription_tier ENUM('free', 'basic', 'premium'),
  subscription_end_date TIMESTAMP,
  stripe_customer_id VARCHAR,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
)
```

### Natal Charts Table
```sql
natal_charts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR NOT NULL,
  birth_date TIMESTAMP NOT NULL,
  birth_time VARCHAR NOT NULL,
  birth_timezone VARCHAR NOT NULL,
  birth_latitude FLOAT NOT NULL,
  birth_longitude FLOAT NOT NULL,
  birth_city VARCHAR NOT NULL,
  birth_country VARCHAR NOT NULL,
  chart_data JSONB,
  interpretation_text TEXT,
  svg_chart TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
)
```

### Subscriptions Table
```sql
subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  tier ENUM('free', 'basic', 'premium'),
  status ENUM('active', 'trialing', 'past_due', 'canceled', 'unpaid'),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  stripe_subscription_id VARCHAR UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
)
```

### Horoscope Cache Table
```sql
horoscope_cache (
  id UUID PRIMARY KEY,
  sign ENUM('aries', 'taurus', ..., 'pisces'),
  date DATE NOT NULL,
  period ENUM('daily', 'weekly', 'monthly'),
  content_text TEXT NOT NULL,
  mood VARCHAR,
  keywords JSONB,
  lucky_color VARCHAR,
  lucky_number VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(sign, date, period)
)
```

## 🔐 Authentication Flow

```
1. User Registration/Login
   ├─► POST /api/v1/auth/register
   │   └─► Create user → Hash password → Generate JWT
   │
   ├─► POST /api/v1/auth/login
   │   └─► Verify credentials → Generate JWT
   │
   └─► JWT Token returned to client

2. Authenticated Requests
   ├─► Client sends JWT in Authorization header
   │
   ├─► Backend validates JWT
   │   └─► Decode token → Load user from DB
   │
   └─► Request processed with user context

3. Subscription Tier Checks
   └─► Middleware checks user.subscription_tier
       ├─► Free: Limited features
       ├─► Basic: Standard features
       └─► Premium: All features
```

## 🎯 API Architecture

### Endpoint Structure

```
/api/v1/
  ├─ auth/
  │  ├─ POST /register
  │  ├─ POST /login
  │  └─ GET /me
  │
  ├─ charts/
  │  ├─ POST /                    (Create chart)
  │  ├─ GET /                     (List user charts)
  │  ├─ GET /{chart_id}           (Get chart)
  │  ├─ DELETE /{chart_id}        (Delete chart)
  │  └─ POST /{chart_id}/transits (Premium only)
  │
  ├─ horoscopes/
  │  ├─ GET /daily?sign=aries
  │  └─ GET /all-signs
  │
  └─ webhooks/
     └─ POST /stripe              (Stripe webhooks)
```

### Request/Response Flow

```
Client Request
    ↓
Nginx (Reverse Proxy)
    ↓
FastAPI Application
    ↓
Middleware Layer
    ├─ CORS
    ├─ Authentication (JWT)
    └─ Rate Limiting
    ↓
API Router
    ↓
Endpoint Handler
    ├─ Validate input (Pydantic)
    ├─ Check tier permissions
    └─ Call service layer
    ↓
Service Layer
    ├─ Business logic
    ├─ External API calls
    └─ Database operations
    ↓
Database/Cache
    ↓
Response (Pydantic model)
    ↓
JSON Response to Client
```

## 🧮 Astrology Calculation Flow

```
User submits birth data
    ↓
AstroCalculatorService.generate_natal_chart()
    ↓
Kerykeion AstrologicalSubject
    ├─ Calculate planet positions
    ├─ Calculate houses (12 houses)
    ├─ Calculate aspects (major + minor)
    └─ Generate chart data (JSON)
    ↓
InterpretationEngine.interpret_natal_chart()
    ├─ Free tier: Template-based interpretation
    └─ Paid tier: GPT-4 AI interpretation
    ↓
Save to database (chart_data JSONB)
    ↓
Return to client
```

## 💾 Caching Strategy

### Redis Caching

```
1. Horoscopes
   └─ Key: horoscope:{sign}:{date}:{period}
   └─ TTL: 24 hours

2. Chart Interpretations (AI)
   └─ Key: interpretation:{chart_id}
   └─ TTL: 30 days

3. User Sessions
   └─ Key: session:{user_id}
   └─ TTL: 7 days
```

### Database Caching

```
HoroscopeCache table stores daily horoscopes
  └─ Prevents regeneration for same sign/date
  └─ Background job updates daily at midnight
```

## 🚀 Deployment Architecture

### Development
```
Docker Compose (dev)
  ├─ frontend (with hot reload)
  ├─ backend (with --reload)
  ├─ postgres
  └─ redis

Ports exposed:
  - 3000: Frontend
  - 8000: Backend
  - 5432: PostgreSQL
  - 6379: Redis
```

### Production
```
Docker Compose (prod)
  ├─ nginx (reverse proxy)
  │  └─ Routes / → frontend
  │  └─ Routes /api → backend
  │
  ├─ frontend (optimized build)
  ├─ backend (multiple workers)
  ├─ postgres (persistent volume)
  └─ redis (persistent volume)

Ports exposed:
  - 80: HTTP (nginx)
  - 443: HTTPS (nginx with SSL)
```

### Scaling Strategy

```
Horizontal Scaling:
  ├─ Backend: Multiple replicas behind nginx
  ├─ Frontend: CDN + multiple replicas
  └─ Database: Read replicas (future)

Vertical Scaling:
  ├─ Increase container resources
  └─ Optimize queries and caching
```

## 🔒 Security Measures

### Application Level
- JWT token authentication (7-day expiration)
- Password hashing (bcrypt)
- Input validation (Pydantic)
- CORS configuration
- Rate limiting (nginx)
- SQL injection prevention (SQLAlchemy ORM)

### Infrastructure Level
- HTTPS/SSL (Let's Encrypt)
- Security headers (X-Frame-Options, etc.)
- Non-root Docker users
- Environment variable secrets
- Firewall rules (ufw)

### API Security
```
Rate Limits:
  - General: 10 req/sec
  - API endpoints: 30 req/sec
  - Auth endpoints: 5 req/min

Request Validation:
  - All inputs validated with Pydantic
  - Maximum payload size: 20MB
  - Request timeout: 60 seconds
```

## 📈 Monitoring & Logging

### Logs
```
Nginx:
  - Access logs: /var/log/nginx/access.log
  - Error logs: /var/log/nginx/error.log

Application:
  - Docker logs: docker-compose logs -f
  - Structured logging with uvicorn

Database:
  - PostgreSQL logs in container
  - Query logging (dev only)
```

### Health Checks
```
HTTP Endpoints:
  - GET / health (nginx)
  - GET /api/health (backend)

Docker Health Checks:
  - All containers have healthcheck config
  - Automatic restart on failure
```

### Metrics (Optional)
```
Prometheus + Grafana:
  - Request rates
  - Response times
  - Error rates
  - Resource usage
```

## 🔄 Data Flow Examples

### Creating a Natal Chart
```
1. POST /api/v1/charts
   {
     "name": "Моя карта",
     "birth_date": "1990-01-01",
     "birth_time": "12:00",
     "birth_city": "Moscow",
     ...
   }

2. Backend validates JWT token

3. Check subscription tier
   - Free: Max 1 chart
   - Paid: Unlimited

4. Calculate chart (kerykeion)
   - Planet positions
   - Houses
   - Aspects

5. Generate interpretation
   - Free: Templates
   - Paid: GPT-4

6. Save to database

7. Return chart data
   {
     "id": "uuid",
     "chart_data": {...},
     "interpretation_text": "...",
     "svg_chart": "<svg>...</svg>"
   }
```

### Daily Horoscope Request
```
1. GET /api/v1/horoscopes/daily?sign=aries

2. Check Redis cache
   └─ Hit: Return cached

3. Check database cache
   └─ Hit: Return + cache in Redis

4. Generate new horoscope
   - Calculate current transits
   - Generate text (template or LLM)
   - Save to database
   - Cache in Redis

5. Return horoscope
```

## 🎨 Frontend Architecture

### Directory Structure
```
frontend/
├── app/
│   ├── (marketing)/      # Public pages
│   │   ├── page.tsx      # Landing
│   │   └── pricing/
│   │
│   ├── (dashboard)/      # Protected pages
│   │   ├── layout.tsx
│   │   ├── natal-chart/
│   │   ├── horoscope/
│   │   └── settings/
│   │
│   └── api/              # API routes
│       ├── auth/
│       └── webhooks/
│
├── components/
│   ├── ui/               # shadcn components
│   ├── dashboard/        # Dashboard components
│   ├── charts/           # Chart visualization
│   └── forms/            # Form components
│
└── lib/
    ├── api-client.ts     # API wrapper
    ├── auth.ts           # Auth config
    └── utils.ts          # Utilities
```

## 🔧 Development Best Practices

### Code Organization
- **Backend**: Layered architecture (routes → services → models)
- **Frontend**: Component-based with hooks
- **Types**: Shared types via Pydantic → TypeScript generation

### Testing Strategy
```
Backend:
  - Unit tests (pytest)
  - Integration tests (TestClient)
  - API tests (httpx)

Frontend:
  - Component tests (Jest + React Testing Library)
  - E2E tests (Playwright)
```

### CI/CD Pipeline
```
GitHub Actions:
  1. Lint code
  2. Run tests
  3. Build Docker images
  4. Deploy to staging
  5. Run smoke tests
  6. Deploy to production
```

---

📚 Дополнительная документация:
- [README.md](README.md) - Основная документация
- [DEPLOYMENT.md](DEPLOYMENT.md) - Руководство по развертыванию
- [QUICKSTART.md](QUICKSTART.md) - Быстрый старт
