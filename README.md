# Calorie Tracker

A simple calorie tracking application with a Node.js backend, PostgreSQL database, and React frontend. This project is containerized using Docker for backend and database, with a separate local frontend setup.

---

## **Prerequisites**

- [Docker](https://www.docker.com/get-started) installed on your machine  
- [Docker Compose](https://docs.docker.com/compose/install/) installed  
- [Node.js](https://nodejs.org/)  

> Backend and database run in Docker, frontend runs locally via Vite.

---

## **Setup**

1. **Clone the repository**
```bash
git clone https://github.com/Konstantin-Lozanovski/Calorie-Tracker
cd Calorie-Tracker
```

2. **Copy example environment files**
```bash
# Root folder (for Docker / Postgres)
cp .env.example .env

# Backend folder (for Node.js backend)
cp backend/.env.example backend/.env
```

> The `.env` files contain safe placeholder credentials. You **do not need to change anything** to test the application.

---

## **Running the backend and database**

Use Docker Compose to build and start the backend and database containers:

```bash
docker compose -f docker-compose.build.yml up --build
```

- This will:
  1. Build the backend container from your local code.  
  2. Start the PostgreSQL container with the credentials from the root `.env`.  
  3. Run the backend, connecting automatically to the database.

- The backend API will be available at:  
```
http://localhost:4000
```

---

## **Running the frontend**

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

- The frontend will be available at the URL shown in the terminal, typically:
```
http://localhost:5173
```
- The frontend automatically communicates with the backend at `http://localhost:4000`.

---

## **Stopping the application**

To stop the backend and database containers:
```bash
docker compose -f docker-compose.build.yml down
```

> To remove the database volume (fresh start next time), add `-v`:
```bash
docker compose -f docker-compose.build.yml down -v
```

---

## **Notes**

- The backend reads its environment variables from `backend/.env`.  
- The database reads credentials from the root `.env`.  
- Default credentials (safe placeholders) are:
  - DB User: `dev_user`  
  - DB Password: `dev_password`  
  - DB Name: `Calorie-Tracker`  
- Docker ensures the database is created automatically on first run. No manual setup is needed.  
- Frontend requires Node.js and runs locally via Vite.

---

## **Testing the API**
  
- Backend API is available at `http://localhost:4000`.  
- Frontend will automatically interact with the backend and can be tested at the URL shown by Vite (usually `http://localhost:5173`).

---

