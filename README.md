# 🤖 AI Chatbot Application

An AI-powered chatbot application built using **FastAPI** and the **Groq API**, with a **React (Vite)** frontend.  
The chatbot provides real-time conversational responses through REST APIs and is designed with a clean, modular architecture.

---

## 📌 Features

- AI-powered text-based chatbot
- RESTful API using FastAPI
- Integration with Groq LLM (LLaMA model)
- Frontend built using React (Vite)
- CORS-enabled backend for frontend communication
- Simple and scalable project structure

---

## 🛠️ Tech Stack

### Backend
- Python
- FastAPI
- Uvicorn
- Groq API
- python-dotenv

### Frontend
- React
- Vite
- HTML, CSS, JavaScript

---

## 📂 Project Structure
ai-chatbot/
│
├── backend/
│ ├── main.py
│ ├── requirements.txt
│ └── .env (not committed)
│
├── forntend/
│ └── herego-frontend/
│ ├── src/
│ ├── package.json
│ └── vite.config.js
│
└── .gitignore

---

## ⚙️ Backend Setup

### 1. Create virtual environment
```bash
python -m venv venv
venv\Scripts\activate

2. Install dependencies
pip install -r requirements.txt

3. Environment variables

Create a .env file inside backend/:

GROQ_API_KEY=your_groq_api_key_here

4. Run backend server
uvicorn main:app --reload


Backend will run at:

http://127.0.0.1:8000


Swagger API Docs:

http://127.0.0.1:8000/docs

🌐 Frontend Setup
cd forntend/herego-frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173

🔗 API Endpoints
POST /chat

Request:

{
  "message": "Hello"
}


Response:

{
  "reply": "Hello! How can I help you?"
}

POST /image

Accepts Base64 encoded image data and validates it.

🚀 Deployment

Backend: Render (Python Web Service)

Frontend: Vercel / Render Static Site

Environment variables are configured securely on the deployment platform

👩‍💻 Author

Nandini Ganta
GitHub: https://github.com/gantaNandini

📄 License

This project is for educational and learning 
