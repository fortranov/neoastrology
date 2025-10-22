# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an automated astrology platform project. Currently, the repository contains a comprehensive business plan and technical specification document (`compass_artifact_wf-48d8b93c-e4fa-4c46-9cc5-1bfa31a8dac8_text_markdown.md`) written in Russian that outlines the complete architecture and implementation strategy.

## Planned Architecture (Not Yet Implemented)

The specification document describes a full-stack astrology platform with:

**Frontend Stack:**
- Next.js 14 with TypeScript
- Tailwind CSS + shadcn/ui components
- NextAuth.js v5 for authentication
- Stripe integration for payments

**Backend Stack:**
- FastAPI (Python 3.11+)
- PostgreSQL with SQLAlchemy ORM
- Redis for caching
- Alembic for database migrations

**Core Functionality:**
- Natal chart generation using Swiss Ephemeris via `kerykeion` library
- Astrological calculations (planets, houses, aspects, transits, synastry)
- AI-powered interpretations using OpenAI GPT-4
- Daily/weekly/monthly horoscopes
- Freemium subscription model (Free/Basic/Premium tiers)

## Key Technical Details from Specification

**Astrology Calculation Engine:**
- Primary library: `kerykeion` (AGPL-3.0 license, Python)
- Alternative APIs: Prokerala API (free tier available), FreeAstrologyAPI.com
- Calculation precision: 0.001 arc seconds using NASA JPL DE431 ephemeris
- 100% automated calculation without human astrologer involvement

**Subscription Tiers (Planned):**
- Free: 1 natal chart, daily sun-sign horoscopes, ads
- Basic ($9.99/month): Unlimited charts, template interpretations, no ads
- Premium ($14.99/month): Real-time transits, unlimited AI readings, advanced reports

**Database Models (Planned):**
- User: authentication, subscription tier, Stripe customer ID
- NatalChart: birth data, chart_data (JSONB), interpretations, SVG rendering
- Subscription: Stripe subscription management
- HoroscopeCache: cached daily/weekly/monthly horoscopes by sign

**API Structure (Planned):**
```
/api/v1/auth/          - Authentication endpoints
/api/v1/charts/        - Natal chart CRUD, transits calculation
/api/v1/horoscopes/    - Daily/weekly/monthly horoscopes
/api/v1/compatibility/ - Synastry calculations
```

## Development Timeline (from Specification)

The document outlines a 9-week MVP development plan:
- Weeks 1-2: Authentication + database setup
- Weeks 3-4: Astrological calculations core
- Weeks 5-6: Frontend development
- Week 6: Payment integration
- Week 7: Horoscope generation
- Week 8: Testing and polish
- Week 9: Deployment

## Deployment (Planned)

- Frontend: Vercel
- Backend: Railway
- Database: Railway PostgreSQL or Neon/Supabase
- Cache: Upstash Redis
- Monitoring: Sentry + Vercel Analytics

## Language and Localization

The primary language is **Russian**. All user-facing content, interpretations, and marketing materials are planned in Russian, targeting the Russian market (7M monthly visits per top platform, 74% growth in interest).

## Important Notes

1. **Licensing Consideration:** Swiss Ephemeris uses AGPL-3.0 license. For commercial closed-source use, either:
   - Purchase commercial license (€750)
   - Use MIT-licensed alternatives (e.g., astronomy-engine)
   - Use third-party APIs that handle licensing

2. **Cost Optimization:** The plan emphasizes caching LLM-generated interpretations for 30 days and using GPT-3.5-turbo for non-premium features to minimize OpenAI costs.

3. **Market Context:** The global astrology app market is projected to reach $29.82B by 2033 with 24.93% CAGR. Top US apps generate $40M+ annually.

## Project Status

✅ **Completed:**
- Full Next.js 14 frontend with TypeScript and Tailwind CSS
- Complete FastAPI backend with async PostgreSQL
- Docker containerization (frontend, backend, postgres, redis, nginx)
- Database models and schemas (User, NatalChart, Subscription, HoroscopeCache)
- Authentication system with JWT
- Astrology calculation service using kerykeion
- Interpretation engine with template-based and LLM-ready logic
- API endpoints for auth, charts, and horoscopes
- Nginx reverse proxy with rate limiting
- Docker Compose for dev and production
- Deployment scripts (bash and PowerShell)
- Makefile with all common commands
- Complete documentation (README, QUICKSTART, DEPLOYMENT)

🔨 **To Complete:**
- Stripe webhook endpoints for subscriptions
- NextAuth.js full configuration on frontend
- Dashboard UI components (forms, chart visualization)
- OpenAI GPT-4 integration for premium interpretations
- SVG chart generation using kerykeion
- Full transit calculation implementation
- Email notifications
- Unit and integration tests

## Docker Commands

### Development
```bash
make dev              # Start development environment
make dev-down         # Stop development
make dev-logs         # View logs
```

### Production
```bash
make prod             # Start production
make prod-deploy      # Full deployment (pull, build, migrate)
make ssl-setup        # Setup SSL certificates
```

### Database
```bash
make migrate          # Apply migrations
make backup           # Backup database
make restore          # Restore database
```

## Development Workflow

1. **Start services**: `make dev`
2. **Make changes** in `frontend/` or `backend/`
3. **View logs**: `make logs` or `make logs service=backend`
4. **Run migrations**: `make migrate` (after model changes)
5. **Test**: Access http://localhost:8001/docs for API testing

## Important Notes for Future Development

- **Russian language**: All user-facing content must be in Russian
- **Tier enforcement**: Always check `current_user.subscription_tier` in endpoints
- **Performance**: Chart generation must be <3 seconds
- **Caching**: Horoscopes 24h, interpretations 30 days
- **Error handling**: Always return meaningful Russian error messages
- **Security**: Never expose SECRET_KEY, validate all inputs
- **Licensing**: kerykeion uses AGPL-3.0 - consider alternatives for commercial use
