# Quick Start Guide

## Setup and Run

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the application:**

   ```bash
   npm run watch
   ```

3. **The server will start at:** `http://localhost:8000`

## Test the API

Once the server is running, you can test the endpoints:

### Test Users API

```bash
# Get all users
curl http://localhost:8000/api/users

# Get users with filtering
curl http://localhost:8000/api/users?filter=works

# Get users with sorting
curl http://localhost:8000/api/users?sort=-firstName

# Get users summary
curl http://localhost:8000/api/users/summary

# Create a new user (status defaults to 'works')
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","contacts":{"email":"john@example.com"}}'
```

### Test Projects API

```bash
# Get all projects
curl http://localhost:8000/api/projects

# Get projects with filtering
curl http://localhost:8000/api/projects?filter=inDevelopment

# Get projects summary
curl http://localhost:8000/api/projects/summary
```

### Test Equipment API

```bash
# Get all equipment
curl http://localhost:8000/api/equipment

# Get equipment with filtering
curl http://localhost:8000/api/equipment?filter=available

# Get equipment summary
curl http://localhost:8000/api/equipment/summary
```

### Test Vacations API

```bash
# Get all vacations
curl http://localhost:8000/api/vacations

# Get vacations with sorting
curl http://localhost:8000/api/vacations?sort=-startDate
```

## What's Included

✅ All API endpoints as specified in `prompt.md`
✅ Filtering, sorting, and pagination support
✅ CRUD operations for all entities
✅ Summary endpoints for analytics
✅ Database pre-populated with mock data
✅ TypeScript for type safety
✅ CORS enabled for frontend integration

## Troubleshooting

If you encounter any errors:

1. Make sure you're using Node.js v16 or higher:

   ```bash
   node --version
   ```

2. Delete `node_modules` and reinstall:

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. If the database gets corrupted, just delete `database.db` and restart - it will be recreated automatically.

## Next Steps

- Open your browser to `http://localhost:8000` to see the API info
- Use tools like Postman or Thunder Client to test the endpoints
- Check `README.md` for detailed API documentation
