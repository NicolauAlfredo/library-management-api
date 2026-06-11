# Getting Started

This guide explains how to set up and run the Library Management API locally.

## Prerequisites

Before starting, make sure you have installed:

* Node.js
* npm
* Docker
* Docker Compose
* Git

## Clone the Repository

```bash
git clone https://github.com/NicolauAlfredo/library-management-api.git
```

Navigate to the project folder:

```bash
cd library-management-api
```

## Install Dependencies

Install all project dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
# SERVER CONFIGURATION 

# Application running port
PORT=8000

# MYSQL DATABASE CONFIGURATION 

# Database host
# DB_HOST=localhost
DB_HOST=localhost

# Default MySQL port
DB_PORT=3307

# MySQL username
DB_USER=root

# MySQL password
DB_PASSWORD=root

# Database name
DB_NAME=library_management_api
 
# JWT secret key used to sign authentication tokens
JWT_SECRET=your_super_secret_key

# Date expires
JWT_EXPIRES_IN=1d
```

## Start the Database

Start the MySQL container using Docker:

```bash
docker compose up -d
```

Verify that the container is running:

```bash
docker ps
```

## Run the API

Start the development server:

```bash
npm run dev
```

If everything is configured correctly, you should see:

```txt
Database connected successfully
Server is running on port 8000
```

## Access the API

Base URL:

```txt
http://localhost:8000
```

Health check:

```http
GET /
```

Expected response:

```json
{
  "success": true,
  "message": "Library Management API is running"
}
```

## Stop the Database

To stop all containers:

```bash
docker compose down
```

## Project Structure

```txt
src/
├── config/
├── controllers/
├── database
├── middlewares/
├── models/
├── repositories/
├── routes/
├── services/
├── types/
└── utils/
```
