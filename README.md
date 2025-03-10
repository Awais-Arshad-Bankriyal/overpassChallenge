# NestJS Overpass API Integration Challenge

This project is a NestJS application demonstrating integration with the Overpass API, utilizing SQLite for persistent storage, and Redis for caching. It provides a protected webhook for submitting geographic coordinates, queries nearby tourist attractions, stores results in a database, caches results, and provides an endpoint for data retrieval.

## Features

- **Protected Webhook Endpoint:** Securely receives geographic coordinates.
- **Overpass API Integration:** Retrieves nearby tourist attractions.
- **SQLite Database:** Stores landmark data persistently.
- **Redis Caching:** Implements efficient caching.
- **Validation and Error Handling:** Robust input validation and error management.
- **Comprehensive Testing:** Unit and integration tests.

## Technology Stack

- **NestJS:** Modular backend framework.
- **SQLite:** Lightweight database.
- **Redis:** Efficient caching.
- **Axios:** HTTP requests.
- **TypeORM:** Database ORM.
- **Class-validator & Class-transformer:** Validation and data transformation.

## Project Structure

```
src/
├── app.module.ts
├── main.ts
├── common/
├── config/
│   └── configuration.ts
├── database/
│   ├── migrations/
│   └── database.module.ts
├── landmarks/
│   ├── dto/
│   ├── entities/
│   ├── landmarks.controller.ts
│   ├── landmarks.module.ts
│   ├── landmarks.service.ts
│   └── landmarks.repository.ts
├── overpass/
│   ├── overpass.module.ts
│   ├── overpass.service.ts
│   └── interfaces/
└── cache/
    ├── cache.module.ts
    └── cache.service.ts
```

## Installation & Setup

### Prerequisites

- Node.js v20+
- Redis
- SQLite3

### Clone the Repository

```bash
git clone <repository-url>
cd <dir>
```

### Install Dependencies

```bash
npm install
```

### Environment Setup

Create `.env` file:

```env
AUTH_SECRET=<your-secret>
DATABASE_DATABASE=landmarks.db
OVERPASS_URL=https://overpass-api.de/api/interpreter
CACHE_TTL=3600
REDIS_URL=redis://localhost:6379
PORT=3000
```



## Running the Application

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

## Testing the Application

### Run Tests

```bash
npm test
```




## Testing Endpoints

### Using CURL

Webhook endpoint:

```bash
curl -X POST http://localhost:3099/webhook \
-H 'Authorization:<your-secret>' \
-H 'Content-Type: application/json' \
-d '{"lat":48.858844,"lng":2.294351}'
```

Retrieve Landmarks:

```bash
curl "http://localhost:3000/landmarks?lat=48.858844&lng=2.294351"
```

### Using Postman

- **Webhook (POST):**
  - URL: `http://localhost:3000/webhook`
  - Method: POST
  - Headers:
    - `Authorization`: `<your-secret>`
    - `Content-Type`: `application/json`
  - Body:
    ```json
    {"lat":48.858844,"lng":2.294351}
    ```

- **Retrieve Landmarks (GET):**
  - URL: `http://localhost:3000/landmarks?lat=48.858844&lng=2.294351`
  - Method: GET

Ensure caching is working by observing faster responses after the initial request.

## License

This project is open-source under the MIT License.

