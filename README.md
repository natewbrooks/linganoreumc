# Project Setup

This project uses a multi-container docker application with the following services:

- **MySQL Server:** SQL database service on port `3306`.
- **Express Server:** Runs the backend API using Node.js with nodemon for live reloading on port `5000`.
- **Admin Panel:** A private-facing administrative interface using Vite and React on port `5173`.
- **Frontend:** The public-facing application using Vite and React on port `5174`.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) must be installed.
- [Docker Compose](https://docs.docker.com/compose/install/) is used for running the services together.

---

## Running it

- Open Docker App
- `docker-compose build` - Builds all containers
- `docker-compose up` - Starts the services
- `docker-compose down` - Stops the services
