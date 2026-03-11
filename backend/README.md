# Backend Setup Guide for Frontend

## 1. Install Required Software

Docker + Docker Compose

### Docker Version Note

The backend was tested with the following versions:

```
Docker version 28.5.1
Docker Compose version v2.40.3
```

**Do not need the exact same version**, but it is recommended to use:

- Docker **>= 24**
- Docker Compose **v2**

Check if Docker is installed successfully:

```bash
docker --version
docker compose version
```

---

## 2. Prepare Environment Variables

Before running Docker, request the **`.env` file** from the backend team and place it inside the `/backend` folder.

Structure:

```
project-root
│
├─ backend
│  ├─ app
│  ├─ .env
│  ├─ Dockerfile
│  └─ ...
└─ 
```

The `.env` file should contain the following variables:

```
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
DATABASE_URL=
```

Make sure the `.env` file is placed correctly in `/backend` **before running Docker**.

---

## 3. Run Docker

Inside the project directory run:

```bash
docker compose up --build
```

Docker will automatically:

- Create the database container
- Create the backend container
- Connect backend with the database
- Start the API server

---

## 4. Verify Backend is Running

Open your browser:

```
http://localhost:8000/docs
```

This is the Swagger UI used to test the API.

---

## 5. Stop the Server

In the terminal press:

```
Ctrl + C
```

Or run:

```bash
docker compose down
```

---

## 6. Run Backend Again

If it was already built before:

```bash
docker compose up
```