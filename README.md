# Analytics Dashboard

![Python](https://img.shields.io/badge/python-3.9-blue?logo=python)
![Flask](https://img.shields.io/badge/flask-2.3.3-orange?logo=flask)
![Docker](https://img.shields.io/badge/docker-20.10-blue?logo=docker)
![Vite](https://img.shields.io/badge/vite-5.0-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-18-61DAFB?logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/tailwind-3-38B2AC?logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/supabase-DB-3ECF8E?logo=supabase&logoColor=white)

---

## 📌 Overview

**Analytics Dashboard** is a lightweight analytics platform designed to **track, process, and visualize user events in real time**.  
It combines a **Flask + Supabase backend** for ingestion and persistence with a **React + Tailwind frontend** for visualization.  

This repository is presented as an **open-source demo**, following **cloud-native and DevOps best practices**.

---

## 📁 Project Structure

analytics-dashboard/
│
├── client/        # Frontend (React + Vite)
├── server/        # Backend (Flask + Supabase)
├── shared/        # Shared types & utilities
├── public/        # Static assets
├── .env.example   # Env vars template
└── README.md      # Project documentation

## 🏗️ Architecture

```

┌─────────────┐       ┌─────────────┐       ┌─────────────────┐
│   Client    │──XHR──▶   Backend   │──SQL──▶  Supabase       │       
│ React + Vite│       │ Flask API   │       │ Postgres + Auth │
└─────────────┘       └─────────────┘       └─────────────────┘
        │
        │ Charts
             ▼
   Tailwind + Recharts
  
```

- **Frontend**: React 18 + Vite + TailwindCSS  
- **Backend**: Flask API (Python 3.9)  
- **Database/Storage**: Supabase (Postgres, Auth, Edge Functions)  
- **Infrastructure**: Docker + Netlify (frontend) + Cloud Run (backend)  

---

## ⚡ Tech Stack

- 🔹 **React 18 + Vite** for modern frontend  
- 🔹 **TailwindCSS** for UI consistency  
- 🔹 **Recharts** for data visualization  
- 🔹 **Flask 2.3** for REST API backend  
- 🔹 **Supabase** as database + authentication  
- 🔹 **Docker** for packaging and deployment  

---

## 🚀 Local Setup

### 1. Clone repository
```bash
git clone git@github.com:R0s3mrcx/analytics-dashboard.git
cd analytics-dashboard
```

### 2. Configure environment variables
Copy `.env.example` and set your values:
```bash
cp .env.example .env
```

### 3. Backend (Flask)
```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run
```

### 4. Frontend (React + Vite)
```bash
cd client
pnpm install
pnpm dev
```
Access the app at: 👉 http://localhost:5173

### 5. Docker (alternative)
```bash
docker build -t analytics-dashboard .
docker run -p 3000:3000 analytics-dashboard
```

---

## ☁️ Deployment

- **Frontend**: Netlify (preconfigured with `netlify.toml`)  
- **Backend**: Google Cloud Run (Dockerfile included)  
- **DB**: Supabase (cloud-hosted)  

---

## 📊 Observability

- **Flask API** →  structured JSON logging  
- **Frontend** → event tracking stored in Supabase  
- **Docker**  → centralized logs via docker logs  

---

## 🤝 Contribution

1. Fork this repository  
2. Create a feature branch feature/your-feature  
3. Open a Pull Request with a clear description  

---

## 📄 License

MIT © 2025 - Built with ❤️ by [R0s3mrcx](https://github.com/R0s3mrcx)
