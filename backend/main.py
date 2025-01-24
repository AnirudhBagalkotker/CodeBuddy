from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import together

load_dotenv()  # Load API Key from .env

app = FastAPI()

# CORS Middleware (Allows Frontend to communicate with Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set the API key
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")

if not TOGETHER_API_KEY:
    raise ValueError("API Key not found! Please set TOGETHER_API_KEY in .env file.")

# Initialize Together AI Client with API Key
client = together.Together(api_key=TOGETHER_API_KEY)


# Pydantic Model for Input
class CodeInput(BaseModel):
    language: str
    code: str


# Root Route (For Testing)
@app.get("/")
async def root():
    return {"message": "Code Comment Generator API is running 🚀"}


# Code Comment Generation API
@app.post("/generate_comments/")
async def generate_comments(data: CodeInput):
    prompt = (
        f"Add meaningful comments to the following {data.language} code:\n\n{data.code}"
    )

    try:
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )
        return response.choices[0].message.content

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Frontend Route Simulation
@app.get("/frontend_status/")
async def frontend_status():
    return {"message": "Frontend is connected successfully ✅"}
