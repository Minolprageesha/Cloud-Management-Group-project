# Cloud Management Group Project

This project is a MERN-style parcel notification and invoice management application for the cloud management assignment. It includes a React frontend for internal operations and a Node.js/Express backend connected to MongoDB.

## Features

- Create new customer invoice orders
- Update parcel or invoice delivery status
- Search and review existing records
- Docker support through `compose.yml`

## Project Structure

- `frontend/` React and Vite employee dashboard
- `backend/` Express API and MongoDB models
- `compose.yml` Docker Compose setup for local container runs

## Local Setup

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Environment Notes

The backend uses MongoDB through `MONGO_URI`. If no environment variable is provided, it falls back to a local MongoDB connection.

Default local backend URL:

```text
http://localhost:5000
```

The frontend expects the API through `VITE_API_BASE` and defaults to `http://localhost:5000`.

## Docker

To run the project with Docker Compose:

```bash
docker compose -f compose.yml up --build
```

## Assignment Context

This application demonstrates a simple cloud-ready workflow for parcel, invoice, and delivery-status management. It can be extended with deployment, containerization, monitoring, and authentication features depending on the assignment scope.
