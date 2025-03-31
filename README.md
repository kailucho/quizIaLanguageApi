# Quiz English AI

## Description
Quiz English AI is an application designed to generate English quiz questions using artificial intelligence. This project is built with Node.js and MongoDB, leveraging the OpenAI API to create dynamic content.

## Project Purpose
This project was developed as part of my professional portfolio to showcase my skills in building scalable backend applications and AI-based solutions. Through this project, I aim to highlight my expertise in designing modular architectures, integrating external APIs, and managing databases.

## Features
- Generation of English quiz questions.
- User authentication.
- RESTful API with well-defined endpoints.
- Modular and scalable architecture.

## Technologies Used
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI:** OpenAI API
- **Testing:** Jest
- **Containers:** Docker

## Installation
1. Clone this repository:
   ```bash
   git clone <REPOSITORY_URL>
   ```
2. Navigate to the project directory:
   ```bash
   cd quiz-english-ia/backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage
1. Configure environment variables in a `.env` file.
2. Start the application:
   ```bash
   npm start
   ```
3. Access the API at `http://localhost:3000`.

## Main Endpoints
- `POST /auth/login`: Log in and obtain a token.
- `GET /questions`: Retrieve a list of generated questions.
- `POST /questions`: Generate new questions.

## Testing
Run tests with the following command:
```bash
npm test
```

## Deployment
1. Build the Docker image:
   ```bash
   docker build -t quiz-english-ai .
   ```
2. Start the containers using Docker Compose:
   ```bash
   docker-compose up
   ```

## Architecture
The project follows a modular layered architecture:
- **Domain:** Contains entities and repository interfaces.
- **Application:** Implements use cases.
- **Infrastructure:** Contains concrete implementations of repositories, controllers, and external services.

### Architecture Diagram
```plaintext
[Client] --> [Routes] --> [Controllers] --> [Use Cases] --> [Repositories] --> [Database]
```

## Scalability
The project is designed to handle high traffic volumes through:
- **Redis Cache:** Reduces database load by storing frequent responses.
- **Clustering:** Utilizes Node.js `cluster` module to leverage multiple CPU cores.

### Clustering Configuration
```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  require('./server');
}
```

## Screenshots
_Add screenshots here to showcase the application's functionality._

## Usage Examples
### Authentication
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```
Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## API Documentation
The API is documented using Swagger. You can access the interactive documentation at the following URL after starting the application:
```
http://localhost:3000/api-docs
```

## Logging
The project uses Winston for logging. Logs are stored in the following files:
- `logs/error.log`: Contains error logs.
- `logs/combined.log`: Contains all logs, including info and errors.

Additionally, HTTP request logs are automatically recorded with details such as method, URL, and timestamp.
