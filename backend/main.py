from fastapi import FastAPI
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os
import base64

# Load environment variables
load_dotenv()

# ---------- ENV ----------
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# ---------- GROQ CLIENT ----------
client = Groq(api_key=GROQ_API_KEY)

# ---------- FASTAPI ----------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- MODELS ----------
class ChatRequest(BaseModel):
    message: str

class ImageRequest(BaseModel):
    image: str  # Base64 string

# ---------- CHAT ENDPOINT ----------
@app.post("/chat")
def chat(req: ChatRequest):
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a helpful AI chatbot."},
            {"role": "user", "content": req.message}
        ]
    )

    reply = response.choices[0].message.content
    return {"reply": reply}

# ---------- IMAGE ENDPOINT ----------
@app.post("/image")
def image(req: ImageRequest):
    try:
        base64.b64decode(req.image.split(",")[1])
        return {"reply": "✅ Image received successfully!"}
    except Exception:
        return {"reply": "⚠️ Failed to process image"}
