# node-backend

A collection of beginner to intermediate Node.js projects, including backend APIs, full-stack applications, and cloud deployment experiments.

## Projects

### 1. Beginner Projects
- Simple Node.js and Express.js projects to get started with server-side JavaScript.
- Examples include CRUD APIs, routing, and middleware usage.

### 2. TODO Application
- End-to-end application using:
  - **Node.js & Express.js** for the backend
  - **PostgreSQL & Prisma** for database management
  - **Docker** for containerized development and deployment
- Implements user authentication, API routes, and database interactions.

### 3. AWS URL Shortener
- **Description:** A cloud-deployed URL shortener which takes any url and converts it into 3 friendly words.
- **Features:**
  - Shorten long URLs with a friendly short path
  - Redirect users from short URLs to the original URLs
  - Fully deployed on AWS using EC2, RDS, and an Application Load Balancer
  - Logs and monitoring handled via PM2
- **Tech Stack:** Node.js, Express.js, PostgreSQL, Ngnix, PM2, AWS EC2, RDS, ALB