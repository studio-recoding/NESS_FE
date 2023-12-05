from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from starlette.websockets import WebSocketState  # WebSocketState 임포트 추가
from pydantic import BaseModel
from openai import AsyncOpenAI
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

class UserMessage(BaseModel):
    message: str

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY 환경 변수가 설정되어 있지 않습니다.")

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    client = AsyncOpenAI(api_key=OPENAI_API_KEY)
    try:
        while True:
            data = await websocket.receive_text()
            stream = await client.chat.completions.create(
                model="gpt-3.5-turbo",  # 모델 지정
                messages=[{"role": "user", "content": data}],
                stream=True  # 스트리밍 활성화
            )
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    await websocket.send_text(chunk.choices[0].delta.content)
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"Error: {e}")