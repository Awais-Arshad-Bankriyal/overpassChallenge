NestJS Overpass API Integration with Redis Caching and SQLite
This project demonstrates a NestJS application that integrates with the Overpass API to fetch nearby landmarks based on provided coordinates. It utilizes Redis for caching and SQLite for persistent data storage.​

Features
Protected webhook endpoint to receive coordinates.​
Integration with the Overpass API to retrieve nearby landmarks.​
Storage of landmarks in a SQLite database.​
Stack Overflow
Caching mechanisms implemented using Redis.​
Endpoints to retrieve cached or stored landmark data.​
Bitbucket
Prerequisites
Node.js (version 14.x or higher)​
npm (version 6.x or higher)​
Redis server​
docs.nestjs.com
+6
github.com
+6
Restack
+6
SQLite​
Installation
Clone the repository:

bash
Copy
Edit
git clone <repository_url>
Navigate to the project directory:

bash
Copy
Edit
cd <project_directory>
Install dependencies:

bash
Copy
Edit
npm install
Set up environment variables:

Create a .env file in the root directory.​

Define necessary environment variables:​

env
Copy
Edit
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
DATABASE_URL=sqlite:./database.sqlite
AUTH_SECRET=your_secret_key
Database Migration
If your project uses TypeORM or another ORM that supports migrations, run the following command to apply migrations:​

bash
Copy
Edit
npm run typeorm migration:run
​Adjust the command based on your project's configuration.​

Running the Application
To start the application, use the following commands:

Development mode with hot-reloading:

bash
Copy
Edit
npm run start:dev
Production mode:

bash
Copy
Edit
npm run start:prod
API Endpoints
POST /webhook
Description: Receives coordinates and processes them.​

Headers:

Authorization: Bearer <your_secret_key>​
Body:

json
Copy
Edit
{
  "lat": 48.8584,
  "lng": 2.2945
}
Response:

201 Created on success.​
GitLab Taskgrids
+6
github.com
+6
Restack
+6
400 Bad Request for validation errors.​
401 Unauthorized for missing or invalid authorization.​
GET /landmarks
Description: Retrieves landmarks based on provided coordinates.​
Query Parameters:
lat: Latitude of the location.​
lng: Longitude of the location.​
Response:
200 OK with landmark data.​
Restack
+2
Toimc Git
+2
github.com
+2
400 Bad Request for validation errors.​
Error Handling
The application gracefully handles errors, including:​

Invalid input data.​
Overpass API errors.​
Database errors.​
Testing
To run tests, use the following command:

bash
Copy
Edit
npm run test
You can also test endpoints using curl or a REST client:​

POST /webhook:

bash
Copy
Edit
curl -X POST -H "Content-Type: application/json" \
-H "Authorization: Bearer your_secret_key" \
-d '{"lat":48.8584,"lng":2.2945}' \
http://localhost:3000/webhook
GET /landmarks:

bash
Copy
Edit
curl "http://localhost:3000/landmarks?lat=48.8584&lng=2.2945"
Linting and Formatting
The project uses the following tools for code quality:​

ESLint: For linting.​
Prettier: For code formatting.​
To run linting and formatting checks, use:

bash
Copy
Edit
npm run lint
npm run format
Project Structure
The project's directory structure is organized as follows:​
Restack
+1
Restack
+1

arduino
Copy
Edit
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
│   │   └── landmark.entity.ts
│   ├── interfaces/
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
This structure promotes modularity and maintainability, adhering to best practices in NestJS development.