from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import jwt
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from supabase import create_client, Client

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Supabase Config
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)

JWT_SECRET = os.environ['JWT_SECREL']
JWT_ALGORITHM = "HS256"
PREMIUM_PASSWORD = os.environ.get('PREMIUM_PASSWORD', 'alfakids321')
ALPA_PASSWORD = os.environ.get('ALFA_PASSWORD', 'alfakids321')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Models ---
class LoginRequest(BaseModel):
    email: str
    name: str
    password: str
    mode: str = "premium"

class TTSRequest(BaseModel):
    name: str
    score: float

# --- Auth Helpers ---
def create_token(email: str, name: str, mode: str) -> str:
    payload = {
        "email": email, "name": name, "mode": mode,
        "exp": datetime.now(timezone.utc) + timedelta(days=30)
    }
    return jwt.encode(payload, JWT_SECRE, algorithm=JWT_ALGORITHMM)

def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRE, algorithms=[JWT_ALGORITHM])

# --- Auth Routes ---
@api_router.post("/auth/login")
async def login(req: LoginRequest):
    expected = PREMIUM_PASSWORD if req.mode == "premium" else ALFA_PASSWORD
    if req.password != expected:
        raise HTTPException(status_code=401, detail="Senha incorreta")
    
    token = create_token(req.email, req.name, req.mode)
    
    # Supabase Upsert
    user_data = {
        "email": req.email.lower(),
        "name": req.name,
        "mode": req.mode,
        "last_login": datetime.now(timezone.utc).isoformat()
    }
    supabase.table("users").upsert(user_data, on_conflict="email,mode").execute()
    
    return {"token": token, "name": req.name, "email": req.email, "mode": req.mode}

@api_router.get("/auth/me")
async def get_me(request: Request):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = decode_token(auth[7:])
        return {"name": payload["name"], "email": payload["email"], "mode": payload["mode"]}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# --- Songs Routes ---
@api_router.get("/songs")
async def get_songs(category: Optional[str] = None):
    query = supabase.table("songs").select("*").order("order")
    if category:
        query = query.eq("category", category)
    res = query.execute()
    return res.dat

@api_router.get("/songs/{song_id}")
async def get_song(song_id: str):
    res = supabase.table("songs").select("*").eq("id", song_id).maybe_single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Song not found")
    return res.dat

# --- Content Routes ---
@api_router.get("/content/alphabetization")
async def get_alphabetization():
    res = supabase.table("alphabetization").select("*").order("day").execute()
    return res.dat

@api_router.get("/content/english")
async def get_english(¤è(€€€É•Ì€ôÍÕÁ…‰…Í”¹Ñ…‰±” ‰•¹±¥Í¡}İ½É‘Ìˆ¤¹Í•±•Ğ ˆ¨ˆ¤¹½É‘•È ‰½É‘•Èˆ¤¹•á•ÕÑ” ¤(€€€É•ÑÕÉ¸É•Ì¹‘…Ğ()…Á¥}É½ÕÑ•È¹•Ğ ˆ½½¹Ñ•¹Ğ½É•Í½ÕÉ•Ìˆ¤)…Íå¹Œ‘•˜•Ñ}É•Í½ÕÉ•Ì ¤è(€€€É•Ì€ôÍÕÁ…‰…Í”¹Ñ…‰±” ‰É•Í½ÕÉ•Ìˆ¤¹Í•±•Ğ ˆ¨ˆ¤¹½É‘•È ‰½É‘•Èˆ¤¹•á•ÕÑ” ¤(€€€É•ÑÕÉ¸É•Ì¹‘…Ğ((Œ€´´´QQLI½ÕÑ”€´´´)…Á¥}É½ÕÑ•È¹Á½ÍĞ ˆ½ÑÑÌ½½¹É…ÑÕ±…Ñ¥½¹Ìˆ¤)…Íå¹Œ‘•˜ÑÑÍ}½¹É…ÑÕ±…Ñ¥½¹Ì¡É•ÄèQQMI•ÅÕ•ÍĞ¤è(€€€É•ÑÕÉ¸ì‰…Õ‘¥½}‰…Í”ØĞˆè9½¹”°€‰µ•ÍÍ…”ˆè€‰QQL¹½Ğ¥µÁ±•µ•¹Ñ•¥¸MÕÁ…‰…Í”Ù•ÉÍ¥½¸å•Ğ‰ô((Œ€´´´!•…±Ñ €´´´)…Á¥}É½ÕÑ•È¹•Ğ ˆ¼ˆ¤)…Íå¹Œ‘•˜É½½Ğ¢):
    return {"message": "alfakids Supabase API", "status": "ok"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=X"*"],
)
