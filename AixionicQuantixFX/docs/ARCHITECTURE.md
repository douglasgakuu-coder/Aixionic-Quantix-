# AixionicQuantixFX — Architecture & Implementation Roadmap

## 1. Technology Stack

### Frontend
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | React 19 (TypeScript) | Concurrent rendering, modern hooks, server-component-ready |
| Build | Vite 5 | Fast HMR, optimized production bundles, native ESM |
| Styling | Tailwind CSS 3.4 + PostCSS | Utility-first, design-system scalability, zero runtime |
| State | Zustand + React Query v5 | Lightweight global state + server-state caching/background refetch |
| Routing | React Router v6 | Data routers, lazy loading, nested layouts |
| Real-time | Native WebSocket API | Low-latency bi-directional streams for markets, signals, news |
| Charts | TradingView Lightweight Charts + D3.js overlay | Financial-grade candlestick + custom signal overlays |
| Forms | React Hook Form + Zod | Type-safe validation, minimal re-renders |
| Animation | Framer Motion | Smooth page transitions, micro-interactions |
| Testing | Vitest + React Testing Library | Fast unit/integration tests aligned with Vite |

### Backend (Monolithic)
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Runtime | Node.js 20 LTS + Express 4 | Mature ecosystem, wide middleware support |
| Language | TypeScript 5.4 | Type safety across the stack |
| ORM | Prisma 5 | Migrations, type-safe queries, introspection |
| Database | PostgreSQL 15+ | ACID compliance, JSONB for flexible metadata, strong indexing |
| Cache / PubSub | Redis 7 | In-memory caching, WebSocket scaling, rate-limiting, session store |
| Real-time | ws (WebSocket) + Redis Pub/Sub | Horizontal scaling, broadcast/subscribe patterns |
| Auth | JWT (access + refresh) + Argon2id | Stateless auth, secure password hashing |
| Email | Nodemailer + SMTP | Direct SMTP configuration, no external service lock-in |
| Payments | Stripe SDK | Escrow, subscriptions, webhooks |
| Validation | Zod | Shared schemas with frontend via `packages/shared` |
| Logging | Pino | Structured JSON logs for observability |
| Rate Limiting | express-rate-limit + Redis store | Distributed rate limiting |

### Shared
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Contracts | Zod schemas | Single source of truth for API payloads, re-exported to FE & BE |
| Types | TypeScript type inference from Zod | No manual type duplication |

---

## 2. Directory Structure

### Root Monorepo
```
AixionicQuantixFX/
├── package.json                  # Workspace root, dev scripts
├── tsconfig.base.json            # Shared TS config
├── .env.example                  # Root-level env template (commented)
├── packages/
│   ├── shared/                   # Shared contracts & types
│   ├── backend/                  # Monolithic backend
│   └── frontend/                 # SPA frontend
├── docs/
│   ├── ARCHITECTURE.md           # This file
│   ├── DEPLOYMENT.md             # Environment setup without Docker
│   └── API_SPEC.md               # OpenAPI-style endpoint reference
├── scripts/
│   ├── migrate.sh                # Prisma migration runner (PowerShell/Bash)
│   ├── seed.ts                   # Database seeding
│   └── healthcheck.ts            # Startup health probe
└── .github/workflows/
    └── ci.yml                    # Lint, test, build checks
```

### Frontend (`packages/frontend/`)
```
packages/frontend/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── .env.example
├── public/
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── main.tsx                  # Entry: providers, router
│   ├── App.tsx                   # Shell layout, error boundaries
│   ├── index.css                 # Tailwind directives, CSS variables
│   ├── vite-env.d.ts
│   ├── types/
│   │   ├── api.d.ts              # API response shapes
│   │   ├── websocket.d.ts        # WS message envelopes
│   │   ├── trading.d.ts          # Order, Portfolio, Signal types
│   │   └── news.d.ts             # News article, category types
│   ├── lib/
│   │   ├── api.ts                # Fetch client with interceptors
│   │   ├── ws.ts                 # WebSocket singleton
│   │   ├── utils.ts              # Formatters, currency, dates
│   │   └── constants.ts          # SYMBOLS, TIMEFRAMES, WS_CHANNELS
│   ├── store/
│   │   ├── auth.store.ts         # Zustand: user, token, 2FA state
│   │   ├── market.store.ts       # Zustand: subscribed symbols, cached prices
│   │   ├── news.store.ts         # Zustand: news feed state, filters
│   │   ├── signal.store.ts       # Zustand: live signals, history
│   │   └── ui.store.ts           # Zustand: modals, toasts, sidebar
│   ├── services/
│   │   ├── api.ts                # Axios-based API service
│   │   └── ws.ts                 # WebSocket service (reconnect, heartbeats)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── RootLayout.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── AdminLayout.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── TwoFactorForm.tsx
│   │   ├── trading/
│   │   │   ├── OrderForm.tsx
│   │   │   ├── OrderBook.tsx
│   │   │   ├── CandlestickChart.tsx
│   │   │   └── SignalOverlay.tsx
│   │   ├── market/
│   │   │   ├── MarketList.tsx
│   │   │   ├── PriceTicker.tsx
│   │   │   └── Watchlist.tsx
│   │   ├── news/
│   │   │   ├── NewsFeed.tsx         # Real-time infinite scroll
│   │   │   ├── NewsCard.tsx
│   │   │   └── NewsFilter.tsx
│   │   ├── signals/
│   │   │   ├── SignalPanel.tsx      # Live signal feed + confidence meter
│   │   │   ├── SignalChart.tsx      # Signal overlay on price chart
│   │   │   └── SignalHistory.tsx    # Backtested performance
│   │   ├── wallet/
│   │   │   ├── BalanceCard.tsx
│   │   │   ├── TransactionList.tsx
│   │   │   └── DepositWithdraw.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Toast.tsx
│   │       ├── DataTable.tsx
│   │       └── LoadingSpinner.tsx
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── trading/
│   │   │   └── TradingPage.tsx
│   │   ├── wallet/
│   │   │   └── WalletPage.tsx
│   │   ├── signals/
│   │   │   └── SignalsPage.tsx      # Dedicated signal analysis page
│   │   └── admin/
│   │       └── AdminDashboard.tsx
│   ├── hooks/
│   │   ├── useWebSocket.ts
│   │   ├── useMarketData.ts
│   │   ├── useNewsFeed.ts
│   │   ├── useSignals.ts
│   │   └── useAuth.ts
│   ├── routes.tsx                # React Router config
│   └── __tests__/
│       ├── components/
│       ├── hooks/
│       └── utils/
└── __tests__/
    └── e2e/
        └── auth.spec.ts
```

### Backend (`packages/backend/`)
```
packages/backend/
├── tsconfig.json
├── .env.example
├── prisma/
│   ├── schema.prisma            # Single source of truth for data model
│   ├── migrations/               # Versioned schema changes
│   └── seed.ts                   # Seed script
├── src/
│   ├── index.ts                  # App bootstrap, server listen
│   ├── config/
│   │   ├── env.ts                # Zod-validated env config
│   │   ├── database.ts           # Prisma client singleton
│   │   ├── redis.ts              # Redis client singleton
│   │   ├── logger.ts             # Pino logger setup
│   │   └── middleware.ts         # Body parser, CORS, helmet, rate-limit
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT verification, attach user to req
│   │   ├── error.middleware.ts   # Global error handler
│   │   ├── validation.middleware.ts  # Zod schema validation
│   │   └── rateLimit.middleware.ts   # Express-rate-limit configs
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── trading.routes.ts
│   │   ├── wallet.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── news.routes.ts        # News API endpoints
│   │   ├── signals.routes.ts     # Signal processing API
│   │   └── index.ts              # Router aggregation
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── trading.controller.ts
│   │   ├── wallet.controller.ts
│   │   ├── admin.controller.ts
│   │   ├── news.controller.ts    # News CRUD + aggregation
│   │   └── signals.controller.ts # Signal generation & history
│   ├── services/
│   │   ├── user.service.ts
│   │   ├── auth.service.ts
│   │   ├── trading.service.ts
│   │   ├── wallet.service.ts
│   │   ├── email.service.ts
│   │   ├── redis.service.ts      # Caching + pub/sub helpers
│   │   ├── websocket.service.ts  # WS gateway + room management
│   │   ├── news.service.ts       # News ingestion, filtering, push
│   │   ├── signal.service.ts     # Technical analysis, signal generation
│   │   └── marketData.service.ts # External API polling, cache warming
│   ├── workers/
│   │   ├── news.worker.ts        # News scraping / RSS ingestion
│   │   └── signal.worker.ts      # Background signal computation
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── argon2.ts
│   │   ├── validators.ts
│   │   └── errors.ts
│   └── __tests__/
│       ├── unit/
│       ├── integration/
│       └── e2e/
└── dist/                         # Compiled output
```

---

## 3. Database Schema Design

### Core Models (Existing — Expanded)
The existing Prisma schema provides a solid foundation. The following additions support real-time features.

### New Models for Real-Time Features

```prisma
// --- Real-time News Feed ---
model NewsArticle {
  id          String      @id @default(uuid())
  title       String
  summary     String?
  content     String?
  source      String
  sourceUrl   String?
  category    NewsCategory
  tags        String[]    @default([])
  sentiment   Sentiment?  @default(NEUTRAL)
  impactLevel ImpactLevel @default(MEDIUM)
  relatedSymbols String[] @default([])
  isPublished Boolean     @default(false)
  publishedAt DateTime?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([publishedAt])
  @@index([category])
  @@index([source])
  @@map("news_articles")
}

model NewsSubscription {
  id        String    @id @default(uuid())
  userId    String
  categories String[] @default([])
  symbols   String[]  @default([])
  keywords  String[]  @default([])
  createdAt DateTime  @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId])
  @@map("news_subscriptions")
}

// --- Live Signal Processing ---
model Signal {
  id            String      @id @default(uuid())
  symbol        String
  timeframe     String
  type          SignalType
  direction     SignalDirection @default(HOLD)
  confidence    Float       // 0.0 – 1.0
  entryPrice    Decimal?
  targetPrice   Decimal?
  stopLoss      Decimal?
  reasoning     String?
  indicators    Json        // { rsi: 45.2, macd: {...}, ... }
  status        SignalStatus @default(ACTIVE)
  expiresAt     DateTime?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([symbol, timeframe, status])
  @@index([createdAt])
  @@map("signals")
}

model SignalHistory {
  id          String   @id @default(uuid())
  signalId    String
  symbol      String
  timeframe   String
  type        SignalType
  direction   SignalDirection
  confidence  Float
  result      SignalResult @default(PENDING)
  pnl         Decimal?
  executedAt  DateTime?

  @@index([signalId])
  @@index([symbol, executedAt])
  @@map("signal_history")
}

model UserSignalPreference {
  id          String   @id @default(uuid())
  userId      String   @unique
  enabled     Boolean  @default(true)
  minConfidence Float  @default(0.6)
  timeframes  String[] @default(["1h", "4h", "1d"])
  signalTypes String[] @default(["MOMENTUM", "MEAN_REVERSION", "BREAKOUT"])
  notifyPush  Boolean  @default(true)
  notifyEmail Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_signal_preferences")
}

// --- Enums ---
enum NewsCategory {
  MARKET
  REGULATORY
  ECONOMIC
  TECHNOLOGY
  OPINION
  EARNINGS
}

enum Sentiment {
  BULLISH
  BEARISH
  NEUTRAL
}

enum ImpactLevel {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum SignalType {
  MOMENTUM
  MEAN_REVERSION
  BREAKOUT
  SUPPORT_RESISTANCE
  VOLUME_SPIKE
  VOLATILITY
}

enum SignalDirection {
  BUY
  SELL
  HOLD
}

enum SignalStatus {
  ACTIVE
  EXPIRED
  CANCELLED
  EXECUTED
}

enum SignalResult {
  PENDING
  WIN
  LOSS
  BREAKEVEN
}
```

### Index Strategy
- Composite indexes on `(symbol, timeframe, status)` for signal lookups
- `(publishedAt)` descending for news pagination
- `(userId, isRead)` for notification queries
- `(userId, expiresAt)` for session cleanup

---

## 4. Real-Time Data Stream Architecture

### 4.1 WebSocket Gateway (`websocket.service.ts`)

```
┌─────────────────────────────────────────────────────────────────┐
│                      WebSocket Gateway                          │
│                                                                 │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │  Client A   │    │   Redis      │    │  Signal Worker   │   │
│  │  (Browser)  │◄──►│  Pub/Sub     │◄──►│  (Background)    │   │
│  └─────────────┘    └──────────────┘    └──────────────────┘   │
│         ▲                    ▲                    ▲             │
│         │                    │                    │             │
│  ┌──────┴──────┐    ┌───────┴────────┐  ┌──────┴──────────┐   │
│  │  Client B   │    │  News Worker   │  │ Market Data Srv │   │
│  └─────────────┘    └────────────────┘  └─────────────────┘   │
│                                                                 │
│  Channels: market:{symbol}, news, signals:{userId}, alerts     │
└─────────────────────────────────────────────────────────────────┘
```

**Message Envelope:**
```typescript
interface WSMessage {
  type: 'AUTH' | 'SUBSCRIBE' | 'UNSUBSCRIBE' | 'PING' | 'PONG'
  payload: {
    token?: string
    channels?: string[]
    data?: unknown
  }
}

interface WSOutbound {
  channel: string
  event: string
  data: unknown
  timestamp: number
}
```

**Room Management:**
- `market:{SYMBOL}` — Broadcast price ticks to subscribers
- `news` — Global news push (filtered client-side by preferences)
- `signals:{userId}` — Personalized signal stream
- `alerts:{userId}` — Price alerts, order fills, KYC status

**Scaling:**
- Single gateway handles ~10k concurrent connections on Node.js cluster
- Horizontal scaling via Redis Pub/Sub across multiple gateway instances
- Each instance subscribes to the same Redis channels and relays to local WS clients

### 4.2 Real-Time News Feed Logic

**Ingestion Pipeline:**
```typescript
// workers/news.worker.ts
class NewsWorker {
  async ingestRSS(feeds: string[]) {
    for (const feed of feeds) {
      const articles = await this.parseRSS(feed)
      for (const article of articles) {
        const enriched = await this.enrichWithMarketContext(article)
        await this.storeAndBroadcast(enriched)
      }
    }
  }

  async storeAndBroadcast(article: NewsArticle) {
    // 1. Persist to PostgreSQL
    const saved = await prisma.newsArticle.create({ data: article })

    // 2. Cache in Redis for fast pagination
    await redis.zadd('news:feed', { score: saved.publishedAt.getTime(), member: JSON.stringify(saved) })

    // 3. Publish to global Redis channel
    await redis.publish('channel:news', JSON.stringify({
      type: 'NEW_ARTICLE',
      payload: saved
    }))
  }
}
```

**Frontend Consumption:**
```typescript
// hooks/useNewsFeed.ts
export function useNewsFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [page, setPage] = useState(0)

  // Initial load via REST (paginated, cached)
  useEffect(() => {
    api.get(`/news?page=${page}`).then(res => {
      setArticles(prev => page === 0 ? res.data : [...prev, ...res.data])
    })
  }, [page])

  // Real-time push via WebSocket
  useEffect(() => {
    const ws = connectWS()
    ws.subscribe('news')

    ws.onMessage((msg) => {
      if (msg.type === 'NEW_ARTICLE') {
        setArticles(prev => [msg.payload, ...prev].slice(0, 100))
      }
    })

    return () => ws.unsubscribe('news')
  }, [])
}
```

**Client-Side Filtering:**
- Fetch user preferences via `/api/news/preferences`
- Apply category/symbol filters before render
- Virtualized list (react-window) for 1000+ items

### 4.3 Live Signal Processing Logic

**Signal Generation Engine:**
```typescript
// services/signal.service.ts
export class SignalService {
  async generateSignals(symbol: string, timeframe: string) {
    // 1. Fetch OHLCV data from cache or external API
    const candles = await this.getCandles(symbol, timeframe, limit: 200)

    // 2. Compute technical indicators
    const indicators = {
      rsi: this.calculateRSI(candles, 14),
      macd: this.calculateMACD(candles),
      bollinger: this.calculateBollingerBands(candles, 20, 2),
      volume: this.calculateVolumeProfile(candles),
      ema: this.calculateEMA(candles, [9, 21, 50]),
    }

    // 3. Run strategy detectors
    const signals: RawSignal[] = []
    signals.push(...this.detectMomentum(candles, indicators))
    signals.push(...this.detectMeanReversion(candles, indicators))
    signals.push(...this.detectBreakout(candles, indicators))
    signals.push(...this.detectSupportResistance(candles, indicators))

    // 4. Score and rank
    const ranked = signals
      .map(s => ({ ...s, confidence: this.calculateConfidence(s, indicators) }))
      .filter(s => s.confidence >= 0.6)
      .sort((a, b) => b.confidence - a.confidence)

    // 5. Persist and broadcast
    for (const signal of ranked.slice(0, 5)) {
      const saved = await prisma.signal.create({ data: signal })
      await redis.publish(`channel:signals:${symbol}`, JSON.stringify(saved))
    }
  }
}
```

**Signal Worker (Background):**
```typescript
// workers/signal.worker.ts
class SignalWorker {
  constructor(private signalService: SignalService) {}

  async start() {
    // Run every 60s for 1h timeframe, 5min for 5m timeframe
    setInterval(async () => {
      const symbols = await this.getActiveSymbols()
      for (const symbol of symbols) {
        await this.signalService.generateSignals(symbol, '1h')
      }
    }, 60_000)
  }
}
```

**WebSocket Broadcasting:**
```typescript
// Inside WebSocketService
private async broadcastSignal(signal: Signal) {
  // Find all users subscribed to this symbol
  const subscribers = await redis.smembers(`subscribers:signals:${signal.symbol}`)

  for (const userId of subscribers) {
    // Check user preferences
    const prefs = await prisma.userSignalPreference.findUnique({
      where: { userId },
    })

    if (prefs?.enabled && signal.confidence >= prefs.minConfidence) {
      // Push to personalized channel
      await redis.publish(`channel:signals:${userId}`, JSON.stringify({
        type: 'NEW_SIGNAL',
        payload: signal,
      }))

      // Also send push notification if enabled
      if (prefs.notifyPush) {
        await this.sendPushNotification(userId, signal)
      }
    }
  }
}
```

**Frontend Signal Panel:**
```typescript
// hooks/useSignals.ts
export function useSignals(symbol: string) {
  const [signals, setSignals] = useState<Signal[]>([])

  useEffect(() => {
    const ws = connectWS()

    // Subscribe to symbol-specific signal channel
    ws.send({ type: 'SUBSCRIBE', payload: { channels: [`signals:${symbol}`] } })

    ws.onMessage((msg) => {
      if (msg.channel === `signals:${symbol}` && msg.event === 'NEW_SIGNAL') {
        setSignals(prev => [msg.data, ...prev].slice(0, 50))
      }
    })

    return () => ws.send({ type: 'UNSUBSCRIBE', payload: { channels: [`signals:${symbol}`] } })
  }, [symbol])

  return signals
}
```

---

## 5. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-3)
**Objective:** Establish solid core infrastructure.

| Week | Tasks | Deliverables |
|------|-------|--------------|
| 1 | Environment setup (no Docker), CI pipeline, monorepo hygiene | `.env.example` per package, root `tsconfig.base.json`, GitHub Actions CI |
| 1 | Database: Run Prisma migrations, seed initial data | `MarketDataCache` populated, admin user |
| 2 | Backend: Refactor `index.ts` into modular router registry | `src/routes/index.ts`, clean error handling middleware |
| 2 | Backend: Enhance Redis service with connection pooling, health checks | Redis singleton, graceful shutdown |
| 3 | Frontend: Component library audit + unified design tokens | `ui/` components, `index.css` variables |
| 3 | Frontend: Routing + layout stabilization | Protected routes, role-based layout guards |

### Phase 2: Real-Time Infrastructure (Weeks 4-5)
**Objective:** Build the WebSocket backbone.

| Week | Tasks | Deliverables |
|------|-------|--------------|
| 4 | Backend: Rewrite `WebSocketService` with Redis Pub/Sub | Room management, heartbeat/ping-pong, auto-reconnect logic |
| 4 | Backend: Implement `news.worker.ts` with RSS ingestion | Configurable feed list, deduplication, enrichment pipeline |
| 5 | Backend: Implement `signal.worker.ts` with TA strategies | RSI, MACD, Bollinger, volume profile, signal scoring |
| 5 | Frontend: Build `useWebSocket` hook with reconnection | Exponential backoff, channel subscription API, message normalization |

### Phase 3: Feature Implementation (Weeks 6-8)
**Objective:** Deliver real-time user-facing features.

| Week | Tasks | Deliverables |
|------|-------|--------------|
| 6 | Backend: News API (`news.routes.ts` + `news.controller.ts`) | Paginated REST feed, preference CRUD, admin moderation |
| 6 | Backend: Signal API (`signals.routes.ts` + `signals.controller.ts`) | History, backtesting endpoint, preference management |
| 7 | Frontend: Real-time News Feed | Infinite scroll, category filters, sentiment badges, push updates |
| 7 | Frontend: Live Signal Processing UI | Signal panel with confidence meters, overlay on charts, history view |
| 8 | Frontend: Trading page enhancement | Real-time order book, signal-triggered order suggestions |

### Phase 4: Hardening & Polish (Weeks 9-10)
**Objective:** Production readiness.

| Week | Tasks | Deliverables |
|------|-------|--------------|
| 9 | Backend: Test suite expansion | Unit tests for services, integration tests for WS, E2E auth flows |
| 9 | Backend: Observability | Structured logging, request tracing, Redis cache hit/miss metrics |
| 10 | Frontend: Performance | Code splitting, image optimization, virtualized lists, bundle analysis |
| 10 | Frontend: Accessibility + E2E | a11y audit, Playwright smoke tests |

### Phase 5: Deployment Preparation (Week 11)
**Objective:** Ship it. No Docker, no YAML.

| Tasks | Deliverables |
|-------|--------------|
| Environment config | Direct `.env` files per environment (`.env.production`, `.env.staging`) |
| Process management | `pm2` ecosystem config (`ecosystem.config.js`) for backend + Vite preview |
| Database | Production PostgreSQL connection via direct env var |
| Redis | Production Redis URL via direct env var |
| SSL/TLS | Reverse proxy via nginx or Node.js `https` module |
| Deployment | `DEPLOYMENT.md` with step-by-step production setup |

---

## 6. Deployment Architecture (No Docker, No YAML)

### Production Stack
```
                    ┌──────────────┐
                    │   nginx      │ (reverse proxy, SSL termination)
                    │   :443       │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                         │
        ┌─────▼─────┐           ┌──────▼──────┐
        │   Vite    │           │   Express   │
        │  Preview  │           │  Backend    │
        │  :4173    │           │  :4000      │
        └───────────┘           └──────┬──────┘
                                        │
                              ┌─────────┴──────────┐
                              │                    │
                        ┌────▼────┐          ┌────▼────┐
                        │Postgres │          │  Redis  │
                        │  :5432  │          │  :6379  │
                        └─────────┘          └─────────┘
```

### Environment Configuration
All configuration via environment variables — no YAML, no Docker Compose.

```bash
# .env.production (backend)
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://quantix:${DB_PASSWORD}@db.internal.example.com:5432/quantix_prod
REDIS_URL=redis://redis.internal.example.com:6379
JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
SMTP_HOST=smtp.internal.example.com
SMTP_PORT=587
SMTP_USER=noreply@example.com
SMTP_PASS=${SMTP_PASSWORD}
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
NEWS_RSS_FEEDS=https://example.com/feed.xml,https://example.org/news.rss
WS_MAX_CONNECTIONS=10000
```

```bash
# .env.production (frontend)
VITE_API_URL=https://api.example.com
VITE_WS_URL=wss://api.example.com/ws
```

### Process Management (PM2)
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'quantix-api',
      script: 'npm run start',
      cwd: './packages/backend',
      instances: 2,
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production' },
      max_memory_restart: '512M',
    },
    {
      name: 'quantix-web',
      script: 'npm run preview',
      cwd: './packages/frontend',
      env: { NODE_ENV: 'production' },
    },
  ],
}
```

Start with: `pm2 start ecosystem.config.js`

---

## 7. Key Architectural Decisions

1. **Monolith over Microservices:** Single Express app, single Prisma client, shared in-memory state. Easier to debug, deploy, and iterate. Real-time features handled via worker threads and Redis pub/sub without splitting services.

2. **No Docker / No YAML:** Direct environment variables and OS-level process management (PM2). Reduces operational complexity, surface area for misconfiguration, and build-time dependencies.

3. **Prisma as Data Layer:** Single migration source, type-safe queries, built-in connection pooling. Avoids raw SQL sprawl while maintaining performance via `@@index` and composite keys.

4. **Redis Everywhere:** Caching (market data), pub/sub (WebSocket scaling), rate limiting, session store. One dependency unlocks multiple capabilities.

5. **Zod Contracts:** Shared validation schemas in `packages/shared` eliminate API drift between frontend and backend.

6. **WebSocket Gateway Pattern:** Single entry point for all real-time streams, backed by Redis for horizontal scaling. Clients subscribe to channels; workers publish to channels.

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| WebSocket connection limits per instance | Cluster mode (PM2), sticky sessions via nginx, Redis fan-out |
| News ingestion blocking event loop | Separate worker process (`workers/news.worker.ts`) |
| Signal computation CPU-heavy | Background worker with job queue, caching computed indicators |
| PostgreSQL connection exhaustion | Prisma connection pool config, PgBouncer if needed |
| Frontend bundle bloat | Code splitting per route, dynamic imports for charts, bundle analyzer in CI |
| Real-time data consistency | Redis cache with TTL, periodic DB reconciliation job |
