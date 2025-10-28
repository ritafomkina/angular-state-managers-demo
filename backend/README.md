# Backend API

A RESTful API backend built with Node.js, Express, TypeScript, and SQLite for managing users, projects, equipment, and vacations.

## Features

- ✅ RESTful API with Express
- ✅ TypeScript for type safety
- ✅ SQLite database with better-sqlite3
- ✅ CRUD operations for all entities
- ✅ Advanced filtering, sorting, and pagination
- ✅ Summary endpoints for analytics
- ✅ CORS enabled
- ✅ Pre-seeded with mock data

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Install dependencies:

```bash
npm install
```

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run watch
```

### Development Mode (simple)

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

The server will start on **http://localhost:8000**

## API Endpoints

**Base URL:** `http://localhost:8000/api`

All endpoints are prefixed with `/api` for easy integration with frontend applications.

### Users

#### GET /api/users

Get all users with optional filtering, sorting, and pagination.

**Query Parameters:**

- `filter` - Filter by status: `total`, `works`, `vacation`, `sick`, `dayOff`
- `sort` - Sort by field: `location`, `-location`, `firstName`, `-firstName`, `startDate`, `-startDate`
- `current` - Current page number (default: 1)
- `size` - Page size (default: 10)

**Examples:**

```
GET /api/users
GET /api/users?filter=works
GET /api/users?filter=works&sort=-firstName
GET /api/users?current=1&size=20
```

#### GET /api/users/summary

Get users summary with counts by status.

**Response:**

```json
{
  "total": 10,
  "works": 5,
  "vacation": 2,
  "sick": 1,
  "dayOff": 2
}
```

#### GET /api/users/:id

Get a specific user by ID.

#### POST /api/users

Create a new user.

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "contacts": {
    "email": "john.doe@example.com",
    "phone": "+1234567890"
  },
  "project": {
    "id": "1",
    "title": "Project Name"
  }
}
```

**Note:**

- `firstName` and `lastName` are required
- `status` defaults to `"works"` if not provided
- `project` field can be:
  - Omitted (defaults to `null`)
  - Set to `null` explicitly
  - A partial project object with `id` and/or `title`

**Response:** Returns the complete user object with auto-generated `id` and default `status: "works"`

#### PATCH /api/users/:id

Update a user.

**Request Body:** Any user fields to update

#### DELETE /api/users/:id

Delete a user. Returns 204 status code.

---

### Projects

#### GET /api/projects

Get all projects with optional filtering, sorting, and pagination.

**Query Parameters:**

- `filter` - Filter by status: `total`, `support`, `completed`, `inDevelopment`
- `sort` - Sort by field: `title`, `-title`, `location`, `-location`, `startDate`, `-startDate`
- `current` - Current page number (default: 1)
- `size` - Page size (default: 10)

**Examples:**

```
GET /api/projects
GET /api/projects?filter=support
GET /api/projects?filter=support&sort=-title
GET /api/projects?current=1&size=20
```

#### GET /api/projects/summary

Get projects summary with counts by status.

**Response:**

```json
{
  "total": 10,
  "inDevelopment": 4,
  "support": 2,
  "completed": 2
}
```

#### GET /api/projects/:id

Get a specific project by ID.

#### POST /api/projects

Create a new project.

**Request Body:**

```json
{
  "title": "New Project"
}
```

#### PATCH /api/projects/:id

Update a project.

**Request Body:** Any project fields to update

#### DELETE /api/projects/:id

Delete a project. Returns 204 status code.

---

### Equipment

#### GET /api/equipment

Get all equipment with optional filtering and pagination.

**Query Parameters:**

- `filter` - Filter by status: `total`, `available`, `occupied`
- `current` - Current page number (default: 1)
- `size` - Page size (default: 10)

**Examples:**

```
GET /api/equipment
GET /api/equipment?filter=available
GET /api/equipment?current=1&size=20
```

#### GET /api/equipment/summary

Get equipment summary with counts by status.

**Response:**

```json
{
  "total": 10,
  "occupied": 5,
  "available": 5
}
```

#### GET /api/equipment/:id

Get specific equipment by ID.

#### POST /api/equipment

Create new equipment.

**Request Body:**

```json
{
  "title": "MacBook Pro",
  "description": "Development laptop",
  "status": "available",
  "owner": "user-id",
  "receiptTimestamp": "2025-01-01T00:00:00Z"
}
```

#### PATCH /api/equipment/:id

Update equipment.

**Request Body:** Any equipment fields to update

#### DELETE /api/equipment/:id

Delete equipment. Returns 204 status code.

---

### Vacations

#### GET /api/vacations

Get all vacations with optional sorting and pagination.

**Query Parameters:**

- `sort` - Sort by field: `firstName`, `-firstName`, `type`, `-type`, `daysAvailable`, `-daysAvailable`, `daysRequested`, `-daysRequested`, `createdDate`, `-createdDate`, `startDate`, `-startDate`, `status`, `-status`
- `current` - Current page number (default: 1)
- `size` - Page size (default: 10)

**Examples:**

```
GET /api/vacations
GET /api/vacations?sort=firstName
GET /api/vacations?sort=-startDate
GET /api/vacations?current=1&size=20
```

#### GET /api/vacations/:id

Get a specific vacation by ID.

#### POST /api/vacations

Create a new vacation request.

**Request Body:**

```json
{
  "user": "user-id",
  "startDate": "2025-02-01",
  "endDate": "2025-02-05",
  "type": "vacation",
  "owner": "user-id",
  "receiptTimestamp": "2025-01-01T00:00:00Z"
}
```

#### PATCH /api/vacations/:id

Update a vacation.

**Request Body:** Any vacation fields to update

#### DELETE /api/vacations/:id

Delete a vacation. Returns 204 status code.

---

## Database

The application uses SQLite database with the following tables:

- `users` - User information and status
- `projects` - Project details and metadata
- `equipment` - Equipment inventory and assignments
- `vacations` - Vacation requests and approvals

The database is automatically initialized and seeded with mock data from the `/mocks` folder on startup.

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   └── index.ts         # App configuration
│   ├── database/            # Database layer
│   │   ├── database.ts      # Database initialization
│   │   ├── seed.ts          # Database seeding
│   │   └── index.ts         # Database exports
│   ├── models/              # Data models and interfaces (moved from root)
│   │   ├── enums/           # Enum definitions
│   │   ├── interfaces/      # TypeScript interfaces
│   │   └── index.ts
│   ├── mocks/               # Mock data for seeding (moved from root)
│   │   ├── users.mocks.ts
│   │   ├── projects.mocks.ts
│   │   ├── equipment.mocks.ts
│   │   ├── vacations.mocks.ts
│   │   └── index.ts
│   ├── routes/              # API routes
│   │   ├── users.routes.ts
│   │   ├── projects.routes.ts
│   │   ├── equipment.routes.ts
│   │   ├── vacations.routes.ts
│   │   └── index.ts         # Route exports
│   ├── services/            # Business logic layer
│   │   ├── users.service.ts
│   │   ├── projects.service.ts
│   │   ├── equipment.service.ts
│   │   ├── vacations.service.ts
│   │   └── index.ts         # Service exports
│   ├── types/               # TypeScript types and interfaces
│   │   └── index.ts
│   └── index.ts             # Application entry point
├── package.json
├── tsconfig.json            # TypeScript configuration with path aliases
├── .gitignore
├── README.md
└── QUICKSTART.md
```

### Path Aliases

The project uses TypeScript path aliases for cleaner imports:

- `@database/*` - Database layer
- `@models/*` - Data models
- `@mocks/*` - Mock data
- `@routes/*` - API routes
- `@services/*` - Business logic
- `@types/*` - Type definitions
- `@shared/models` - Shared model exports

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **better-sqlite3** - Fast SQLite driver
- **CORS** - Cross-origin resource sharing

## Development

The application supports hot-reload in development mode. Any changes to TypeScript files will automatically restart the server.

## License

ISC
