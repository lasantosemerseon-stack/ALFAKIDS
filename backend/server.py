from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import bcrypt
import jwt
import base64
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"
PREMIUM_PASSWORD = os.environ.get('PREMIUM_PASSWORD', 'alfakids321')
ALFA_PASSWORD = os.environ.get('ALFA_PASSWORD', 'alfakids321')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Models ---
class LoginRequest(BaseModel):
    email: str
    name: str
    password: str
    mode: str = "premium"  # "premium" or "alfa"

class TTSRequest(BaseModel):
    name: str
    score: float

# --- Auth Helpers ---
def create_token(email: str, name: str, mode: str) -> str:
    payload = {
        "email": email, "name": name, "mode": mode,
        "exp": datetime.now(timezone.utc) + timedelta(days=30)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

# --- Auth Routes ---
@api_router.post("/auth/login")
async def login(req: LoginRequest):
    expected = PREMIUM_PASSWORD if req.mode == "premium" else ALFA_PASSWORD
    if req.password != expected:
        raise HTTPException(status_code=401, detail="Senha incorreta")
    token = create_token(req.email, req.name, req.mode)
    await db.users.update_one(
        {"email": req.email.lower(), "mode": req.mode},
        {"$set": {"email": req.email.lower(), "name": req.name, "mode": req.mode, "last_login": datetime.now(timezone.utc)}},
        upsert=True
    )
    return {"token": token, "name": req.name, "email": req.email, "mode": req.mode}

@api_router.get("/auth/me")
async def get_me(request: Request):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = decode_token(auth[7:])
        return {"name": payload["name"], "email": payload["email"], "mode": payload["mode"]}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# --- Songs Routes ---
@api_router.get("/songs")
async def get_songs(category: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    songs = await db.songs.find(query, {"_id": 0}).sort("order", 1).to_list(200)
    return songs

@api_router.get("/songs/{song_id}")
async def get_song(song_id: str):
    song = await db.songs.find_one({"id": song_id}, {"_id": 0})
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return song

# --- Content Routes ---
@api_router.get("/content/alphabetization")
async def get_alphabetization():
    days = await db.alphabetization.find({}, {"_id": 0}).sort("day", 1).to_list(30)
    return days

@api_router.get("/content/english")
async def get_english():
    words = await db.english_words.find({}, {"_id": 0}).sort("order", 1).to_list(200)
    return words

@api_router.get("/content/resources")
async def get_resources():
    resources = await db.resources.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return resources

# --- TTS Route ---
@api_router.post("/tts/congratulations")
async def tts_congratulations(req: TTSRequest):
    try:
        from emergentintegrations.llm.openai import OpenAITextToSpeech
        tts = OpenAITextToSpeech(api_key=os.getenv("EMERGENT_LLM_KEY"))
        text = f"Parabéns {req.name}! Sua nota é {req.score}! Vamos para a próxima música!"
        audio_base64 = await tts.generate_speech_base64(
            text=text, model="tts-1", voice="nova", speed=1.0, response_format="mp3"
        )
        return {"audio_base64": audio_base64}
    except Exception as e:
        logger.error(f"TTS error: {e}")
        return {"audio_base64": None, "error": str(e)}

# --- Health ---
@api_router.get("/")
async def root():
    return {"message": "alfakids API", "status": "ok"}

# --- Seed Data ---
async def seed_data():
    # Seed songs
    count = await db.songs.count_documents({})
    if count == 0:
        logger.info("Seeding songs...")
        infantil_songs = [
            ("A CASA", "0JkSpPZJDkE", False),
            ("O SAPO NÃO LAVA O PÉ", "59GM_xjPhco", True),
            ("PINTINHO AMARELINHO", "28iW_O5qWfU", False),
            ("BORBOLETINHA", "jc-vTAaK7Rs", False),
            ("A GALINHA DO VIZINHO", "AJCVHKEohAg", False),
            ("ESCRAVOS DE JÓ", "-fVH_PooFJI", False),
            ("A DONA ARANHA", "PT3azbKHJZU", False),
            ("AQUARELA", "CVMqypAUrWo", True),
            ("EU ENTREI NA RODA", "zliELbZjBrI", False),
            ("EU FUI NO TORORÓ", "8Dwr0wgrt0E", False),
            ("MARCHA SOLDADO", "hTnnxoMrdtc", False),
            ("MARINHEIRO SÓ", "qyjt8MwTog4", False),
            ("NOITE DE SÃO JOÃO", "ibJxuayCz0Y", False),
            ("O MEU GALINHO", "NAL4isDM4D0", False),
            ("LECRIN DOURADO", "qzEcHMqqcuE", False),
            ("CIRANDA CIRANDINHA", "l7VsurR48Ew", False),
            ("A BARATINHA", "78xEaW5GJ0g", False),
            ("FORMIGUINHA", "whopJ1e1g9A", False),
            ("MÚSICAS DAS VOGAIS", "jqy_y7n5KRE", False),
            ("JACARÉ", "3r4cadv1Cmw", False),
            ("SEU LOBATO", "_g34ENRtLqA", False),
            ("PEIXE VIVO", "Fn9adh4HWUU", False),
            ("UPA CAVALINHO", "QpsXyVOjSGM", False),
            ("CÃO AMIGO", "ZrxjmULA9Ug", False),
            ("SAPO CURURU", "orxxp-3gBiE", False),
            ("ABC", "TUj1YBE5PeY", False),
            ("PIMPOM", "FrfRL0rrE1E", False),
            ("PAI FRANCISCO", "FrfRL0rrE1E", False),
            ("PALAVRA CANTADA - LAVAR AS MÃOS", "_vmxj-adiPo", False),
            ("A CANOA VIROU", "gsSY0i_-Ypw", False),
            ("O CRAVO E A ROSA", "zt93UvnesEc", False),
            ("LEÃOZINHO", "kfinwr3A9fg", False),
            ("PALAVRA CANTADA - POMAR", "H9fXoZmMHK8", False),
            ("CIRANDA DOS BICHOS", "qev8JeYAcjY", False),
            ("THU THUE INFANTIL", "Ka8zpRFsGhQ", False),
            ("CABEÇA OMBRO JOELHO E PÉ", "gE8Qd7uhGcI", False),
            ("PATATI PATATA", "fLFacU8tKT0", False),
            ("COMER COMER", "kUH15yq6Eto", False),
            ("PIUÍ ABACAXI", "jvX9eozwbtU", False),
            ("MUNDO BITA", "cjONzZPJONc", False),
            ("FAZENDINHA", "9WFYuIu7BKA", False),
            ("VIAJAR PELO SAFARI", "iY91JoMWQoM", False),
            ("FUNDO DO MAR", "KyS3VZs5ERc", False),
            ("AQUARELA - MUNDO BITA", "5TVsXxsFJps", False),
            ("DE ESTIMAÇÃO", "0GIgk4yuHOQ", False),
            ("DINOSSAUROS", "2ZB6dQ-Fjho", False),
            ("COMO É VERDE NA FLORESTA", "hgFfC4cCnec", False),
            ("VOA VOA PASSARINHO", "j7A9ANT2aVQ", False),
            ("INSETOS", "Oa5BaUBXpho", False),
            ("FESTA NA LAGOA", "cGs1QA2bLdw", False),
            ("PARABÉNS DO BITA", "iDhHIhgclR4", False),
            ("COMO É GRANDE O MEU AMOR", "Y0L4S1SZVA0", False),
        ]
        gospel_songs = [
            ("ALELUIA", "N7Ca-ActgTg", True),
            ("GOSPEL KIDS CRISTÃO", "V_dC2prLAGI", False),
            ("REI DAVI", "iDhHIhgclR4", False),
            ("ESTÁTUA DE SAL", "sILaooXVM0c", False),
            ("VEM COM JOSUÉ", "HLBrF_ApqF4", False),
            ("ARCA DE NOÉ", "I5F9W-UHyDM", False),
            ("MIRIÃ DANÇOU", "kXws12qbRsQ", False),
            ("DEUS É TÃO BOM", "80NHdIPpj-8", False),
            ("TOC TOC TOC", "fBNLbKPFWC4", False),
            ("HOMENZINHO TORTO", "yMmGslDQOg4", False),
            ("NO EGITO ESCRAVO FUI", "heGAvvlPC-Y", False),
            ("ASSIM VOU LOUVAR", "AHqqzUkjRjw", False),
            ("DEUS GRANDÃO", "x-XSLiyVWOY", False),
            ("CELEBRAREI", "Tdwy3BZe61s", False),
            ("PEDRO TIAGO JOÃO", "0PanAuOBpDU", False),
            ("REI DAVI EM LIBRAS", "H72Hfg07T4M", False),
            ("DEUS É BOM PRA MIM", "L_7FKggChzI", False),
            ("SE JESUS É TEU AMIGO", "5I-C2EUOtx0", False),
            ("DAVI E GOLIAS", "OxLrQwc_zDI", False),
            ("SAMUEL", "zi_02T0wRik", False),
            ("JESUS AMA CADA UM", "lhmgnCdi7BM", False),
            ("DEUS ESTÁ AQUI", "YyMQS-iX4Q8", False),
            ("CAMINHANDO VOU PARA CANAÃ", "h4oyGAcUcCw", False),
            ("EU TENHO UM DEUS", "ydOLfImogFg", False),
            ("JESUS É MARAVILHOSO", "xILW7r_IKAs", False),
            ("O AMOR DO MEU JESUS", "epzpdYT-1qE", False),
            ("DANIEL NA COVA DOS LEÕES", "84q78F3SNVQ", False),
            ("MEU BOM PASTOR", "ESxlZiPb-Gk", False),
            ("PISA NA MURALHA", "-rVHEJSXEr8", False),
            ("SOLTA O CABO DA NAU", "3kpOvbj7L7c", False),
            ("O NOSSO GENERAL É CRISTO", "KlwdUZ0tb6s", False),
            ("JACÓ SEGUROU O ANJO", "-wsoNAm7F4A", False),
            ("O TELEFONE DO CÉU", "bERSxSBpc54", False),
        ]
        instruments_options = [
            ["piano", "violao", "flauta", "bateria", "baixo"],
            ["piano", "violao", "pandeiro", "flauta", "baixo"],
            ["piano", "bateria", "violino", "flauta", "baixo"],
            ["violao", "bateria", "pandeiro", "flauta", "piano"],
        ]
        songs_to_insert = []
        for i, (title, yt_id, is_free) in enumerate(infantil_songs):
            songs_to_insert.append({
                "id": f"inf_{i+1}",
                "title": title,
                "youtube_id": yt_id,
                "youtube_url": f"https://www.youtube.com/watch?v={yt_id}",
                "category": "infantil",
                "is_free": is_free,
                "instruments": instruments_options[i % len(instruments_options)],
                "order": i + 1
            })
        for i, (title, yt_id, is_free) in enumerate(gospel_songs):
            songs_to_insert.append({
                "id": f"gos_{i+1}",
                "title": title,
                "youtube_id": yt_id,
                "youtube_url": f"https://www.youtube.com/watch?v={yt_id}",
                "category": "gospel",
                "is_free": is_free,
                "instruments": instruments_options[i % len(instruments_options)],
                "order": i + 1
            })
        await db.songs.insert_many(songs_to_insert)
        logger.info(f"Seeded {len(songs_to_insert)} songs")

    # Seed alphabetization days
    alfa_count = await db.alphabetization.count_documents({})
    if alfa_count == 0:
        logger.info("Seeding alphabetization...")
        alfa_days = [
            {"day": 1, "title": "Letras A e I", "letters": ["A", "I"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/gtdzty44_DIA%2001%20ALFAB.pdf"},
            {"day": 2, "title": "Letras O e U", "letters": ["O", "U"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/hoslzncv_DIA%202%20ALFB.pdf"},
            {"day": 3, "title": "Letra E e Revisão", "letters": ["E"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/p05vhly3_DIA%203%20ALFB.pdf"},
            {"day": 4, "title": "Consoantes M e S", "letters": ["M", "S"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/kgsfd7y1_DIA%204%20ALFB.pdf"},
            {"day": 5, "title": "Consoantes F e N", "letters": ["F", "N"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/d1w48lps_DIA%205%20ALFB.pdf"},
            {"day": 6, "title": "Consoantes V e L", "letters": ["V", "L"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/keygbix3_DIA%206%20ALFB.pdf"},
            {"day": 7, "title": "Revisão Semana 1", "letters": [], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/9cloiftx_DIA%207%20ALFB.pdf"},
            {"day": 8, "title": "Consoantes B e P", "letters": ["B", "P"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/58d95uax_DIA%208%20ALFB.pdf"},
            {"day": 9, "title": "Consoantes T e D", "letters": ["T", "D"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/lwcdn2zd_DIA%209%20ALFB.pdf"},
            {"day": 10, "title": "Consoantes C e G", "letters": ["C", "G"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/emvxl8u2_DIA%2010%20ALFB.pdf"},
            {"day": 11, "title": "Consoantes R e J", "letters": ["R", "J"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/xqj6wq2y_DIA%2011%20ALFB.pdf"},
            {"day": 12, "title": "Consoantes H e Q", "letters": ["H", "Q"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/j4kdr89w_DIA%2012%20ALFB.pdf"},
            {"day": 13, "title": "Consoantes X e Z", "letters": ["X", "Z"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/irslqw6l_DIA%2013%20ALFB.pdf"},
            {"day": 14, "title": "Revisão Semana 2", "letters": [], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/2u8vjtuh_DIA%2014%20ALFB.pdf"},
            {"day": 15, "title": "Sílabas com M", "letters": ["MA", "ME", "MI", "MO", "MU"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/9omdqq91_DIA%2015%20ALFB.pdf"},
            {"day": 16, "title": "Sílabas com S", "letters": ["SA", "SE", "SI", "SO", "SU"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/58esjx6d_DIA%2016%20ALFB.pdf"},
            {"day": 17, "title": "Sílabas com F e N", "letters": ["FA", "NA"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/ewt11am6_DIA%2017%20ALFB.pdf"},
            {"day": 18, "title": "Sílabas com B e P", "letters": ["BA", "PA"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/956x2if6_DIA%2018%20ALFB.pdf"},
            {"day": 19, "title": "Sílabas com T e D", "letters": ["TA", "DA"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/cjlf8fde_DIA%2019%20ALFB.pdf"},
            {"day": 20, "title": "Sílabas com L e V", "letters": ["LA", "VA"], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/odn0l94z_DIA%2020%20ALFB.pdf"},
            {"day": 21, "title": "Dias 21 a 26 - Palavras", "letters": [], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/58uyglll_DIA%2021%20A%2026%20ALFB.pdf"},
            {"day": 27, "title": "Frases Curtas", "letters": [], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/s42f19s7_DIA%2027%20ALFB.pdf"},
            {"day": 28, "title": "Dias 28 e 29 - Textos", "letters": [], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/3vc8hcqb_DIA%2028%20E%2029%20ALFB.pdf"},
            {"day": 30, "title": "Avaliação Final", "letters": [], "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/ed3ihpmk_DIA%2030%20ALFB.pdf"},
        ]
        await db.alphabetization.insert_many(alfa_days)
        logger.info(f"Seeded {len(alfa_days)} alphabetization days")

    # Seed English words
    eng_count = await db.english_words.count_documents({})
    if eng_count == 0:
        logger.info("Seeding English words...")
        words = [
            {"word_en": "Dog", "word_pt": "Cachorro", "category": "animals", "emoji": "🐕", "order": 1},
            {"word_en": "Cat", "word_pt": "Gato", "category": "animals", "emoji": "🐱", "order": 2},
            {"word_en": "Bird", "word_pt": "Pássaro", "category": "animals", "emoji": "🐦", "order": 3},
            {"word_en": "Fish", "word_pt": "Peixe", "category": "animals", "emoji": "🐟", "order": 4},
            {"word_en": "House", "word_pt": "Casa", "category": "places", "emoji": "🏠", "order": 5},
            {"word_en": "School", "word_pt": "Escola", "category": "places", "emoji": "🏫", "order": 6},
            {"word_en": "Apple", "word_pt": "Maçã", "category": "food", "emoji": "🍎", "order": 7},
            {"word_en": "Water", "word_pt": "Água", "category": "food", "emoji": "💧", "order": 8},
            {"word_en": "Bread", "word_pt": "Pão", "category": "food", "emoji": "🍞", "order": 9},
            {"word_en": "Sun", "word_pt": "Sol", "category": "nature", "emoji": "☀️", "order": 10},
            {"word_en": "Moon", "word_pt": "Lua", "category": "nature", "emoji": "🌙", "order": 11},
            {"word_en": "Star", "word_pt": "Estrela", "category": "nature", "emoji": "⭐", "order": 12},
            {"word_en": "Tree", "word_pt": "Árvore", "category": "nature", "emoji": "🌳", "order": 13},
            {"word_en": "Flower", "word_pt": "Flor", "category": "nature", "emoji": "🌸", "order": 14},
            {"word_en": "Mother", "word_pt": "Mãe", "category": "family", "emoji": "👩", "order": 15},
            {"word_en": "Father", "word_pt": "Pai", "category": "family", "emoji": "👨", "order": 16},
            {"word_en": "Baby", "word_pt": "Bebê", "category": "family", "emoji": "👶", "order": 17},
            {"word_en": "Book", "word_pt": "Livro", "category": "school", "emoji": "📖", "order": 18},
            {"word_en": "Ball", "word_pt": "Bola", "category": "toys", "emoji": "⚽", "order": 19},
            {"word_en": "Car", "word_pt": "Carro", "category": "vehicles", "emoji": "🚗", "order": 20},
            {"word_en": "Red", "word_pt": "Vermelho", "category": "colors", "emoji": "🔴", "order": 21},
            {"word_en": "Blue", "word_pt": "Azul", "category": "colors", "emoji": "🔵", "order": 22},
            {"word_en": "Green", "word_pt": "Verde", "category": "colors", "emoji": "🟢", "order": 23},
            {"word_en": "Yellow", "word_pt": "Amarelo", "category": "colors", "emoji": "🟡", "order": 24},
            {"word_en": "One", "word_pt": "Um", "category": "numbers", "emoji": "1️⃣", "order": 25},
            {"word_en": "Two", "word_pt": "Dois", "category": "numbers", "emoji": "2️⃣", "order": 26},
            {"word_en": "Three", "word_pt": "Três", "category": "numbers", "emoji": "3️⃣", "order": 27},
            {"word_en": "Hello", "word_pt": "Olá", "category": "greetings", "emoji": "👋", "order": 28},
            {"word_en": "Goodbye", "word_pt": "Tchau", "category": "greetings", "emoji": "👋", "order": 29},
            {"word_en": "Thank you", "word_pt": "Obrigado", "category": "greetings", "emoji": "🙏", "order": 30},
        ]
        await db.english_words.insert_many(words)
        logger.info(f"Seeded {len(words)} English words")

    # Seed resources (force re-seed every startup to keep order/titles fresh)
    await db.resources.delete_many({})
    logger.info("Seeding resources (forced refresh)...")
    bonus_groups = [
        {
            "id": "bonus_1",
            "bonus_number": 1,
            "bonus_title": "Caderno da Leitura",
            "items": [
                {"title": "Caderno da Leitura", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/jit1p9mh_CADERNO-DE-LEITURA%20ENTREGAVEL.pdf"},
            ],
            "order": 1,
            "category": "bonus"
        },
        {
            "id": "bonus_2",
            "bonus_number": 2,
            "bonus_title": "Lancheira",
            "items": [
                {"title": "Lancheira Saudável", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/sm1lreep_lancheira_saud%C3%A1vel%20%281%29.pdf"},
                {"title": "Cardápios Saudáveis", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/r4nnw9ov__Card%C3%A1pios.pdf"},
                {"title": "Bebidas Saudáveis", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/stv92noh_Bebidas--Saud%C3%A1veis----%281%29%20%281%29.pdf"},
                {"title": "Receitas para Criança +1 Ano", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/hucbv6v1_RECEITAS--PARA--CRIAN%C3%87A--%2B1--ANOS--%281%29%20%281%29.pdf"},
                {"title": "Receitas para Alérgicos", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/9sz8w8ws_Receitas--Al%C3%A9rgicos%20%281%29.pdf"},
                {"title": "Planejamento Semanal", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/fvyvq6yq_Planejamento--Semanal--1%20%281%29.pdf"},
                {"title": "Lista de Compras", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/ulnlj4ny_Lista--De--Compras%20%281%29.pdf"},
                {"title": "Receitas Doces Saudáveis", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/ikewvc0p_EBook--Rceitas-----Doces--Saud%C3%A1veis%20%282%29.pdf"},
                {"title": "Alimentação Saudável", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/1ccksi3a_Alimenta%C3%A7%C3%A3o--Saud%C3%A1vel--Parte--1--%281%29%20%281%29.pdf"},
                {"title": "Guia Supermercado", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/d33yr4r5_E-book--Lancheira-----Guia--Supermercado%20%281%29.pdf"},
                {"title": "Guia sobre Açúcar", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/kgzj5cn1_E-book--Lancheira-----A%C3%A7%C3%BAcar%20%281%29.pdf"},
            ],
            "order": 2,
            "category": "bonus"
        },
        {
            "id": "bonus_3",
            "bonus_number": 3,
            "bonus_title": "Entendendo o Autismo",
            "items": [
                {"title": "Entendendo o Autismo", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/07h8h20w_Entendendo%20o%20Autismo.pdf"},
                {"title": "Atividades de Estimulação Cognitiva", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/d7rndwf2_Atividades%20de%20Estimula%C3%A7%C3%A3o%20Cognitiva.pdf"},
                {"title": "Desenvolvendo o Potencial", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/9p05v358_Desenvolvendo%20o%20Potencial.pdf"},
            ],
            "order": 3,
            "category": "bonus"
        },
        {
            "id": "bonus_4",
            "bonus_number": 4,
            "bonus_title": "Atividades Pedagógicas",
            "items": [
                {"title": "+100 Atividades de Alfabetização", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/5ngk3ehi_%2B100%20ATIVIDADES%20DE%20ALFBETIZA%C3%87%C3%83O.pdf"},
            ],
            "order": 4,
            "category": "bonus"
        },
        {
            "id": "bonus_5",
            "bonus_number": 5,
            "bonus_title": "Método Novo de Leitura",
            "items": [
                {"title": "Livro da Leitura - Sílabas Simples", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/jz4x10tl_LIVRO-DA-LEITURA-SILABAS-SIMPLES-A.B.pdf.pdf"},
                {"title": "Régua da Leitura", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/2vmtan7e_R%C3%89GUA%20DA%20LEITURA%20.pdf.pdf"},
            ],
            "order": 5,
            "category": "bonus"
        },
        {
            "id": "bonus_6",
            "bonus_number": 6,
            "bonus_title": "Palavras em Inglês",
            "items": [
                {"title": "Tabela de Palavras em Inglês", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/vmkmf1oc_TABELA%20DE%20PALAVRAS%20EM%20INGLES.pdf"},
            ],
            "order": 6,
            "category": "bonus"
        },
    ]
    await db.resources.insert_many(bonus_groups)
    total_pdfs = sum(len(g["items"]) for g in bonus_groups)
    logger.info(f"Seeded {len(bonus_groups)} bonus groups with {total_pdfs} PDFs total")

    # Create indexes
    await db.songs.create_index("id", unique=True)
    await db.songs.create_index("category")
    await db.users.create_index([("email", 1), ("mode", 1)])

@app.on_event("startup")
async def startup():
    await seed_data()
    logger.info("alfakids API started successfully!")

@app.on_event("shutdown")
async def shutdown():
    client.close()

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
