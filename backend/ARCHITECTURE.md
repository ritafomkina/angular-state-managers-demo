# Project Architecture

## Overview

This project follows a clean, layered architecture with clear separation of concerns and modern best practices.

## Structure Improvements

### Before

```
backend/
├── src/
├── models/  (at root)
└── mocks/   (at root)
```

### After

```
backend/
└── src/
    ├── config/
    ├── database/
    ├── models/    (moved into src)
    ├── mocks/     (moved into src)
    ├── routes/
    ├── services/
    └── types/
```

## Benefits

### 1. **Better Organization**

- All source code is now under `src/` directory
- Clear separation between different layers of the application
- Easy to navigate and understand the codebase

### 2. **TypeScript Path Aliases**

Cleaner imports using path aliases instead of relative paths:

**Before:**

```typescript
import db from "../database/database";
import usersService from "../services/users.service";
```

**After:**

```typescript
import db from "@database/database";
import usersService from "@services/users.service";
```

### 3. **Barrel Exports**

Simplified imports with index files:

**Before:**

```typescript
import usersRoutes from "./routes/users.routes";
import projectsRoutes from "./routes/projects.routes";
import equipmentRoutes from "./routes/equipment.routes";
import vacationsRoutes from "./routes/vacations.routes";
```

**After:**

```typescript
import {
  usersRoutes,
  projectsRoutes,
  equipmentRoutes,
  vacationsRoutes,
} from "@routes/index";
```

### 4. **Configuration Management**

Centralized configuration in `src/config/`:

- Environment-aware settings
- Easy to modify and extend
- Type-safe configuration

### 5. **Scalability**

The structure makes it easy to:

- Add new features
- Refactor existing code
- Implement middleware
- Add testing
- Integrate with CI/CD

## Layer Responsibilities

### Config Layer (`src/config/`)

- Application configuration
- Environment variables
- Constants

### Database Layer (`src/database/`)

- Database initialization
- Connection management
- Data seeding

### Models Layer (`src/models/`)

- Data structure definitions
- Enums
- Interfaces
- Type definitions

### Services Layer (`src/services/`)

- Business logic
- Data manipulation
- CRUD operations
- Data validation

### Routes Layer (`src/routes/`)

- HTTP endpoints
- Request handling
- Response formatting
- Input validation

### Types Layer (`src/types/`)

- Application-specific TypeScript types
- Database row types
- API response types

## Import Guidelines

### Use Path Aliases

✅ **Good:**

```typescript
import { User } from "@types/index";
import db from "@database/database";
import { usersService } from "@services/index";
```

❌ **Avoid:**

```typescript
import { User } from "../../types/index";
import db from "../database/database";
```

### Use Barrel Exports

✅ **Good:**

```typescript
import { usersService, projectsService } from "@services/index";
```

❌ **Avoid:**

```typescript
import usersService from "@services/users.service";
import projectsService from "@services/projects.service";
```

## Adding New Features

### 1. Add a New Entity (e.g., "Tasks")

1. **Create the model** in `src/models/interfaces/task/`:

   ```typescript
   export interface Task extends BaseEntity {
     title: string;
     description: string;
     status: TaskStatusEnum;
   }
   ```

2. **Create the service** in `src/services/`:

   ```typescript
   // tasks.service.ts
   export class TasksService {
     // CRUD operations
   }
   ```

3. **Create the routes** in `src/routes/`:

   ```typescript
   // tasks.routes.ts
   const router = Router();
   router.get("/", getAll);
   router.post("/", create);
   // etc.
   ```

4. **Export from index files**:

   - Add to `src/services/index.ts`
   - Add to `src/routes/index.ts`

5. **Register in main app** (`src/index.ts`):
   ```typescript
   import { tasksRoutes } from "@routes/index";
   app.use("/tasks", tasksRoutes);
   ```

## Testing Strategy

### Unit Tests

- Test services in isolation
- Mock database calls
- Test business logic

### Integration Tests

- Test routes with services
- Use test database
- Test full request/response cycle

### E2E Tests

- Test complete user flows
- Test API endpoints
- Verify data persistence

## Future Improvements

- [ ] Add middleware layer for authentication
- [ ] Add validation layer with Zod or Joi
- [ ] Add logging with Winston or Pino
- [ ] Add error handling middleware
- [ ] Add request/response DTOs
- [ ] Add API documentation with Swagger
- [ ] Add caching layer
- [ ] Add background job processing
- [ ] Add WebSocket support
- [ ] Add GraphQL API

## Conclusion

This architecture provides:

- ✅ Clear separation of concerns
- ✅ Easy to test and maintain
- ✅ Scalable and extensible
- ✅ Type-safe with TypeScript
- ✅ Modern best practices
- ✅ Clean and readable code
