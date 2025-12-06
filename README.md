# Rate Limit Management System

A robust rate limiting system built with NestJS that manages API request quotas based on user subscription tiers. This system enforces hourly and daily rate limits for different subscription levels (FREE, STANDARD, PREMIUM) to ensure fair usage and prevent API abuse.

## Features

- **Subscription-based Rate Limiting**: Different rate limits for FREE, STANDARD, and PREMIUM tiers
- **Hourly and Daily Quotas**: Tracks requests per hour and per day
- **PostgreSQL Database**: Uses Prisma ORM for reliable data persistence
- **Docker Support**: Fully containerized with Docker Compose for easy deployment
- **RESTful API**: Clean API endpoints for user and news management
- **Automatic Counter Reset**: Automatically resets counters when time expire

## Subscription Tiers & Rate Limits

| Tier     | Hourly Limit   | Daily Limit      |
| -------- | -------------- | ---------------- |
| FREE     | 100 requests   | 1,000 requests   |
| STANDARD | 500 requests   | 10,000 requests  |
| PREMIUM  | 2,000 requests | 100,000 requests |

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **Yarn** package manager
- **Docker** and **Docker Compose** (for Docker setup)
- **PostgreSQL** (if running locally without Docker)

## Installation & Setup

### Option 1: Using Docker (Recommended)

This is the easiest way to get started. Docker will handle all dependencies including the database.

#### Step 1: Clone the repository

```bash
git clone <repository-url>
cd rate_limit_management_system
```

#### Step 2: Configure environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your desired configuration:

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=rate_limit_db
DB_PORT=5432

# Application Configuration
APP_PORT=3000
NODE_ENV=development
PORT=3000

# Database URL (used by Prisma)
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/rate_limit_db?connection_limit=20&pool_timeout=10&connect_timeout=5
```

#### Step 3: Build and start containers

```bash
# Build and start all services (database + application)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

#### Step 4: Run database migrations

```bash
# Run migrations inside the app container
docker-compose exec app yarn prisma:migrate

# Or if you prefer to run it manually
docker-compose exec app npx prisma migrate dev
```

#### Step 5: Verify the setup

The application should now be running at `http://localhost:3000`

Check the health of services:

```bash
# Check if containers are running
docker-compose ps

# Check application logs
docker-compose logs app

# Check database logs
docker-compose logs postgres
```

### Option 2: Local Development Setup

If you prefer to run the application locally without Docker:

#### Step 1: Install dependencies

```bash
yarn install
```

#### Step 2: Set up PostgreSQL database

Make sure PostgreSQL is running on your machine. Create a database:

```bash
createdb rate_limit_db
```

Or using PostgreSQL CLI:

```sql
CREATE DATABASE rate_limit_db;
```

#### Step 3: Configure environment variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rate_limit_db?connection_limit=20&pool_timeout=10&connect_timeout=5
PORT=3000
NODE_ENV=development
```

#### Step 4: Generate Prisma Client

```bash
yarn prisma:generate
```

#### Step 5: Run database migrations

```bash
yarn prisma:migrate
```

#### Step 6: Start the application

```bash
# Development mode (with hot reload)
yarn start:dev

# Production mode
yarn build
yarn start:prod
```

## API Endpoints

The API is available at `http://localhost:3000/api/v1`

### User Management

#### Create User

```http
POST /api/v1/users
Content-Type: application/json

{
  "email": "user@example.com",
  "subscriptionTier": "FREE" | "STANDARD" | "PREMIUM"
}
```

#### Get User Quota

```http
GET /api/v1/users/:id
```

### News Endpoint (Rate Limited)

#### Get Latest News

```http
GET /api/v1/news
Headers:
  x-user-id: <user-id>
```

**Note**: This endpoint is protected by rate limiting. You must include the `x-user-id` header with a valid user ID.
After exceeding the limit, you'll receive a `429 Too Many Requests` response.

## Development

### Available Scripts

```bash
# Development
yarn start:dev          # Start in watch mode
yarn start:debug        # Start in debug mode

# Production
yarn build              # Build the application
yarn start:prod         # Start in production mode

# Database
yarn prisma:generate    # Generate Prisma Client
yarn prisma:migrate     # Run migrations
yarn prisma:studio      # Open Prisma Studio (database GUI)

# Testing
yarn test               # Run unit tests
yarn test:e2e           # Run end-to-end tests
yarn test:cov           # Run tests with coverage

# Code Quality
yarn lint               # Run ESLint
yarn format             # Format code with Prettier
```

### Project Structure

```
rate_limit_management_system/
├── src/
│   ├── common/              # Shared constants and utilities
│   ├── modules/
│   │   ├── config/          # Configuration module
│   │   ├── news/            # News module (rate-limited)
│   │   ├── prisma/          # Prisma service
│   │   ├── rate-limit/      # Rate limiting logic
│   │   └── user/            # User management
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry point
├── prisma/
│   └── schema.prisma        # Database schema
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile              # Docker image definition
└── package.json            # Dependencies and scripts
```

## License

This project is private and unlicensed.
