from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from dotenv import load_dotenv
import os

load_dotenv()  # 환경 변수 로드

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

app = FastAPI()

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # React 애플리케이션이 실행되는 주소
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

class UserMessage(BaseModel):
    message: str


@app.post("/chat/")
    
async def chat_with_gpt(user_message: UserMessage):
    try:
        print(OPENAI_API_KEY)
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}"
            },
            json={
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": user_message.message}]
            }
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error: {e}")
    raise HTTPException(status_code=500, detail=str(e))

