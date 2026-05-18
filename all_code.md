# Alfakids - Diversão e Aprendizado — Código Completo do Projeto

Gerado em: Mon May 18 20:07:48 UTC 2026

---

## Sumário

- `/app/backend/.env`
- `/app/backend/requirements.txt`
- `/app/backend/server.py`
- `/app/backend/tests/test_alfakids_api.py`
- `/app/frontend/.env`
- `/app/frontend/README.md`
- `/app/frontend/app.json`
- `/app/frontend/app/(tabs)/_layout.tsx`
- `/app/frontend/app/(tabs)/alfabetizacao.tsx`
- `/app/frontend/app/(tabs)/desenho.tsx`
- `/app/frontend/app/(tabs)/ingles.tsx`
- `/app/frontend/app/(tabs)/musica.tsx`
- `/app/frontend/app/(tabs)/recursos.tsx`
- `/app/frontend/app/(tabs)/videoaulas.tsx`
- `/app/frontend/app/(tabs)/videos100.tsx`
- `/app/frontend/app/+html.tsx`
- `/app/frontend/app/_layout.tsx`
- `/app/frontend/app/index.tsx`
- `/app/frontend/app/login.tsx`
- `/app/frontend/app/plans.tsx`
- `/app/frontend/app/song/[id].tsx`
- `/app/frontend/eslint.config.js`
- `/app/frontend/expo-env.d.ts`
- `/app/frontend/metro.config.js`
- `/app/frontend/package.json`
- `/app/frontend/scripts/reset-project.js`
- `/app/frontend/src/contexts/AuthContext.tsx`
- `/app/frontend/src/contexts/ThemeContext.tsx`
- `/app/frontend/tsconfig.json`

---

## `/app/backend/.env`

```bash
MONGO_URL="mongodb://localhost:27017"
DB_NAME="alfakids_db"
JWT_SECRET="a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2"
PREMIUM_PASSWORD="alfakids321"
ALFA_PASSWORD="alfakids321"
EMERGENT_LLM_KEY="sk-emergent-53fAeAcA0A339780dB"

```

## `/app/backend/requirements.txt`

```text
aiohappyeyeballs==2.6.1
aiohttp==3.13.5
aiosignal==1.4.0
annotated-doc==0.0.4
annotated-types==0.7.0
anyio==4.13.0
attrs==26.1.0
bcrypt==4.1.3
black==26.3.1
boto3==1.42.86
botocore==1.42.86
certifi==2026.2.25
cffi==2.0.0
charset-normalizer==3.4.7
click==8.3.2
cryptography==46.0.7
distro==1.9.0
dnspython==2.8.0
ecdsa==0.19.2
email-validator==2.3.0
emergentintegrations==0.1.0
fastapi==0.110.1
fastuuid==0.14.0
filelock==3.25.2
flake8==7.3.0
frozenlist==1.8.0
fsspec==2026.3.0
google-ai-generativelanguage==0.6.15
google-api-core==2.30.2
google-api-python-client==2.194.0
google-auth==2.49.1
google-auth-httplib2==0.3.1
google-genai==1.71.0
google-generativeai==0.8.6
googleapis-common-protos==1.74.0
grpcio==1.80.0
grpcio-status==1.71.2
h11==0.16.0
hf-xet==1.4.3
httpcore==1.0.9
httplib2==0.31.2
httpx==0.28.1
huggingface_hub==1.9.2
idna==3.11
importlib_metadata==9.0.0
iniconfig==2.3.0
isort==8.0.1
Jinja2==3.1.6
jiter==0.13.0
jmespath==1.1.0
jq==1.11.0
jsonschema==4.26.0
jsonschema-specifications==2025.9.1
librt==0.8.1
litellm==1.80.0
markdown-it-py==4.0.0
MarkupSafe==3.0.3
mccabe==0.7.0
mdurl==0.1.2
motor==3.3.1
multidict==6.7.1
mypy==1.20.0
mypy_extensions==1.1.0
numpy==2.4.4
oauthlib==3.3.1
openai==1.99.9
packaging==26.0
pandas==3.0.2
passlib==1.7.4
pathspec==1.0.4
pillow==12.2.0
platformdirs==4.9.6
pluggy==1.6.0
propcache==0.4.1
proto-plus==1.27.2
protobuf==5.29.6
pyasn1==0.6.3
pyasn1_modules==0.4.2
pycodestyle==2.14.0
pycparser==3.0
pydantic==2.12.5
pydantic_core==2.41.5
pyflakes==3.4.0
Pygments==2.20.0
PyJWT==2.12.1
pymongo==4.5.0
pyparsing==3.3.2
pytest==9.0.3
python-dateutil==2.9.0.post0
python-dotenv==1.2.2
python-jose==3.5.0
python-multipart==0.0.24
pytokens==0.4.1
PyYAML==6.0.3
referencing==0.37.0
regex==2026.4.4
requests==2.33.1
requests-oauthlib==2.0.0
rich==14.3.3
rpds-py==0.30.0
rsa==4.9.1
s3transfer==0.16.0
s5cmd==0.2.0
shellingham==1.5.4
six==1.17.0
sniffio==1.3.1
starlette==0.37.2
stripe==15.0.1
tenacity==9.1.4
tiktoken==0.12.0
tokenizers==0.22.2
tqdm==4.67.3
typer==0.24.1
typing-inspection==0.4.2
typing_extensions==4.15.0
tzdata==2026.1
uritemplate==4.2.0
urllib3==2.6.3
uvicorn==0.25.0
watchfiles==1.1.1
websockets==16.0
yarl==1.23.0
zipp==3.23.0

```

## `/app/backend/server.py`

```python
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

    # Seed resources
    res_count = await db.resources.count_documents({})
    if res_count == 0:
        logger.info("Seeding resources...")
        resources = [
            {"id": "r1", "title": "+100 Atividades de Alfabetização", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/5ngk3ehi_%2B100%20ATIVIDADES%20DE%20ALFBETIZA%C3%87%C3%83O.pdf", "category": "pedagogico", "order": 1},
            {"id": "r2", "title": "Livro da Leitura - Sílabas Simples", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/jz4x10tl_LIVRO-DA-LEITURA-SILABAS-SIMPLES-A.B.pdf.pdf", "category": "pedagogico", "order": 2},
            {"id": "r3", "title": "Régua da Leitura", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/2vmtan7e_R%C3%89GUA%20DA%20LEITURA%20.pdf.pdf", "category": "pedagogico", "order": 3},
            {"id": "r4", "title": "Tabela de Palavras em Inglês", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/vmkmf1oc_TABELA%20DE%20PALAVRAS%20EM%20INGLES.pdf", "category": "pedagogico", "order": 4},
            {"id": "r5", "title": "Entendendo o Autismo", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/07h8h20w_Entendendo%20o%20Autismo.pdf", "category": "autismo", "order": 5},
            {"id": "r6", "title": "Atividades de Estimulação Cognitiva", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/d7rndwf2_Atividades%20de%20Estimula%C3%A7%C3%A3o%20Cognitiva.pdf", "category": "autismo", "order": 6},
            {"id": "r7", "title": "Desenvolvendo o Potencial", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/9p05v358_Desenvolvendo%20o%20Potencial.pdf", "category": "autismo", "order": 7},
            {"id": "r8", "title": "Cardápios Saudáveis", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/r4nnw9ov__Card%C3%A1pios.pdf", "category": "lancheira", "order": 8},
            {"id": "r9", "title": "Bebidas Saudáveis", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/stv92noh_Bebidas--Saud%C3%A1veis----%281%29%20%281%29.pdf", "category": "lancheira", "order": 9},
            {"id": "r10", "title": "Lancheira Saudável", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/sm1lreep_lancheira_saud%C3%A1vel%20%281%29.pdf", "category": "lancheira", "order": 10},
            {"id": "r11", "title": "Lista de Compras", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/ulnlj4ny_Lista--De--Compras%20%281%29.pdf", "category": "lancheira", "order": 11},
            {"id": "r12", "title": "Planejamento Semanal", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/fvyvq6yq_Planejamento--Semanal--1%20%281%29.pdf", "category": "lancheira", "order": 12},
            {"id": "r13", "title": "Receitas para Alérgicos", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/9sz8w8ws_Receitas--Al%C3%A9rgicos%20%281%29.pdf", "category": "lancheira", "order": 13},
            {"id": "r14", "title": "Receitas para Criança +1 Ano", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/hucbv6v1_RECEITAS--PARA--CRIAN%C3%87A--%2B1--ANOS--%281%29%20%281%29.pdf", "category": "lancheira", "order": 14},
            {"id": "r15", "title": "Receitas Doces Saudáveis", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/ikewvc0p_EBook--Rceitas-----Doces--Saud%C3%A1veis%20%282%29.pdf", "category": "bonus", "order": 15},
            {"id": "r16", "title": "Alimentação Saudável", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/1ccksi3a_Alimenta%C3%A7%C3%A3o--Saud%C3%A1vel--Parte--1--%281%29%20%281%29.pdf", "category": "bonus", "order": 16},
            {"id": "r17", "title": "Guia Supermercado", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/d33yr4r5_E-book--Lancheira-----Guia--Supermercado%20%281%29.pdf", "category": "bonus", "order": 17},
            {"id": "r18", "title": "Guia sobre Açúcar", "pdf_url": "https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/kgzj5cn1_E-book--Lancheira-----A%C3%A7%C3%BAcar%20%281%29.pdf", "category": "bonus", "order": 18},
        ]
        await db.resources.insert_many(resources)
        logger.info(f"Seeded {len(resources)} resources")

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

```

## `/app/backend/tests/test_alfakids_api.py`

```python
"""
Backend API Tests for alfakids Educational App
Tests: Health, Auth, Songs, Content (Alphabetization, English, Resources)
"""
import pytest
import requests
import os
from pathlib import Path

# Read BASE_URL from frontend .env file
def get_base_url():
    env_file = Path('/app/frontend/.env')
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                if line.startswith('EXPO_PUBLIC_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    return 'https://pedagogy-music-hub.preview.emergentagent.com'

BASE_URL = get_base_url()

@pytest.fixture
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session

class TestHealth:
    """Health check endpoint"""
    
    def test_api_health(self, api_client):
        """Test API root endpoint returns ok status"""
        response = api_client.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "alfakids" in data["message"]

class TestAuth:
    """Authentication endpoints"""
    
    def test_login_premium_success(self, api_client):
        """Test login with correct premium password"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "test@example.com",
            "name": "Test Child",
            "password": "diversãoeaprendizado321",
            "mode": "premium"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["name"] == "Test Child"
        assert data["email"] == "test@example.com"
        assert data["mode"] == "premium"
    
    def test_login_alfa_success(self, api_client):
        """Test login with correct alfa password"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "alfa@example.com",
            "name": "Alfa Child",
            "password": "alfakids321",
            "mode": "alfa"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["mode"] == "alfa"
    
    def test_login_wrong_password(self, api_client):
        """Test login with incorrect password returns 401"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "test@example.com",
            "name": "Test Child",
            "password": "wrongpassword",
            "mode": "premium"
        })
        assert response.status_code == 401
        data = response.json()
        assert "incorreta" in data["detail"].lower()
    
    def test_auth_me_with_valid_token(self, api_client):
        """Test /auth/me with valid token returns user data"""
        # First login to get token
        login_response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "me@example.com",
            "name": "Me Test",
            "password": "diversãoeaprendizado321",
            "mode": "premium"
        })
        assert login_response.status_code == 200
        token = login_response.json()["token"]
        
        # Then call /auth/me
        me_response = api_client.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {token}"
        })
        assert me_response.status_code == 200
        data = me_response.json()
        assert data["name"] == "Me Test"
        assert data["email"] == "me@example.com"
        assert data["mode"] == "premium"
    
    def test_auth_me_without_token(self, api_client):
        """Test /auth/me without token returns 401"""
        response = api_client.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401

class TestSongs:
    """Songs endpoints"""
    
    def test_get_infantil_songs(self, api_client):
        """Test fetching infantil category songs"""
        response = api_client.get(f"{BASE_URL}/api/songs?category=infantil")
        assert response.status_code == 200
        songs = response.json()
        assert isinstance(songs, list)
        assert len(songs) > 0
        # Verify structure
        first_song = songs[0]
        assert "id" in first_song
        assert "title" in first_song
        assert "youtube_id" in first_song
        assert "category" in first_song
        assert first_song["category"] == "infantil"
        assert "is_free" in first_song
        assert "instruments" in first_song
    
    def test_get_gospel_songs(self, api_client):
        """Test fetching gospel category songs"""
        response = api_client.get(f"{BASE_URL}/api/songs?category=gospel")
        assert response.status_code == 200
        songs = response.json()
        assert isinstance(songs, list)
        assert len(songs) > 0
        first_song = songs[0]
        assert first_song["category"] == "gospel"
    
    def test_free_songs_exist(self, api_client):
        """Test that free songs exist in both categories"""
        # Check infantil free songs
        infantil_response = api_client.get(f"{BASE_URL}/api/songs?category=infantil")
        infantil_songs = infantil_response.json()
        infantil_free = [s for s in infantil_songs if s["is_free"]]
        assert len(infantil_free) >= 2  # O SAPO and AQUARELA
        free_titles = [s["title"] for s in infantil_free]
        assert any("SAPO" in t for t in free_titles)
        assert any("AQUARELA" in t for t in free_titles)
        
        # Check gospel free songs
        gospel_response = api_client.get(f"{BASE_URL}/api/songs?category=gospel")
        gospel_songs = gospel_response.json()
        gospel_free = [s for s in gospel_songs if s["is_free"]]
        assert len(gospel_free) >= 1  # ALELUIA
        assert any("ALELUIA" in s["title"] for s in gospel_free)
    
    def test_get_song_by_id(self, api_client):
        """Test fetching a specific song by ID"""
        # First get a song ID
        songs_response = api_client.get(f"{BASE_URL}/api/songs?category=infantil")
        songs = songs_response.json()
        song_id = songs[0]["id"]
        
        # Then fetch by ID
        response = api_client.get(f"{BASE_URL}/api/songs/{song_id}")
        assert response.status_code == 200
        song = response.json()
        assert song["id"] == song_id
        assert "youtube_url" in song
        assert "instruments" in song
        assert isinstance(song["instruments"], list)
    
    def test_get_nonexistent_song(self, api_client):
        """Test fetching non-existent song returns 404"""
        response = api_client.get(f"{BASE_URL}/api/songs/nonexistent_id_12345")
        assert response.status_code == 404

class TestContent:
    """Content endpoints (alphabetization, english, resources)"""
    
    def test_get_alphabetization_days(self, api_client):
        """Test fetching alphabetization days"""
        response = api_client.get(f"{BASE_URL}/api/content/alphabetization")
        assert response.status_code == 200
        days = response.json()
        assert isinstance(days, list)
        assert len(days) >= 24  # Should have at least 24 days
        # Verify structure
        first_day = days[0]
        assert "day" in first_day
        assert "title" in first_day
        assert "pdf_url" in first_day
        assert "letters" in first_day
        # Verify ordering
        assert days[0]["day"] == 1
        assert days[-1]["day"] >= 24
    
    def test_get_english_words(self, api_client):
        """Test fetching English words"""
        response = api_client.get(f"{BASE_URL}/api/content/english")
        assert response.status_code == 200
        words = response.json()
        assert isinstance(words, list)
        assert len(words) >= 30  # Should have 30 words
        # Verify structure
        first_word = words[0]
        assert "word_en" in first_word
        assert "word_pt" in first_word
        assert "category" in first_word
        assert "emoji" in first_word
        assert "order" in first_word
    
    def test_get_resources(self, api_client):
        """Test fetching pedagogical resources"""
        response = api_client.get(f"{BASE_URL}/api/content/resources")
        assert response.status_code == 200
        resources = response.json()
        assert isinstance(resources, list)
        assert len(resources) >= 18  # Should have 18 resources
        # Verify structure
        first_resource = resources[0]
        assert "id" in first_resource
        assert "title" in first_resource
        assert "pdf_url" in first_resource
        assert "category" in first_resource
        # Verify categories exist
        categories = set(r["category"] for r in resources)
        assert "pedagogico" in categories
        assert "autismo" in categories
        assert "lancheira" in categories
        assert "bonus" in categories

class TestDataPersistence:
    """Test that data is properly persisted in MongoDB"""
    
    def test_user_persistence_after_login(self, api_client):
        """Test that user is created/updated in DB after login"""
        # Login with unique email
        email = "persistence_test@example.com"
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": email,
            "name": "Persistence Test",
            "password": "diversãoeaprendizado321",
            "mode": "premium"
        })
        assert response.status_code == 200
        token = response.json()["token"]
        
        # Verify token works
        me_response = api_client.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {token}"
        })
        assert me_response.status_code == 200
        assert me_response.json()["email"] == email

```

## `/app/frontend/.env`

```bash
EXPO_TUNNEL_SUBDOMAIN=pedagogy-music-hub
EXPO_PACKAGER_HOSTNAME=https://pedagogy-music-hub.preview.emergentagent.com
EXPO_PUBLIC_BACKEND_URL=https://pedagogy-music-hub.preview.emergentagent.com
EXPO_USE_FAST_RESOLVER="1"
METRO_CACHE_ROOT=/app/frontend/.metro-cache
EXPO_PACKAGER_PROXY_URL=https://pedagogy-music-hub.preview.emergentagent.com

```

## `/app/frontend/README.md`

```markdown
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

```

## `/app/frontend/app.json`

```json
{
  "expo": {
    "name": "alfakids",
    "slug": "alfakids",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "alfakids",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "NSMicrophoneUsageDescription": "Gravar áudio para atividades musicais"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#0D0D0D"
      },
      "edgeToEdgeEnabled": true,
      "permissions": [
        "RECORD_AUDIO"
      ]
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png",
      "name": "alfakids - Diversão e Aprendizado",
      "shortName": "alfakids",
      "description": "App educativo infantil premium com músicas, alfabetização e inglês",
      "themeColor": "#0D0D0D",
      "backgroundColor": "#0D0D0D"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#0D0D0D"
        }
      ],
      "expo-web-browser"
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}

```

## `/app/frontend/app/(tabs)/_layout.tsx`

```typescript
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';
import { TouchableOpacity, View, StyleSheet, Image, Text, Modal, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const LOGO_SEM_FUNDO = 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/cz5cen1e_logo%20fundo.png';

export default function TabLayout() {
  const { colors, toggle, mode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { label: 'Videoaulas do Panda', icon: 'play-circle', route: '/(tabs)/videoaulas' },
    { label: 'Alfabetização 30 Dias', icon: 'book', route: '/(tabs)/alfabetizacao' },
    { label: '+100 Vídeos', icon: 'videocam', route: '/(tabs)/videos100' },
    { label: 'Aprender Inglês', icon: 'language', route: '/(tabs)/ingles' },
    { label: 'Desenho', icon: 'color-palette', route: '/(tabs)/desenho' },
    { label: 'Recursos', icon: 'folder-open', route: '/(tabs)/recursos' },
    { label: 'Ver Planos', icon: 'diamond', route: '/plans' },
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0, height: 64 },
          headerTitle: () => (
            <View style={styles.headerCenter}>
              <Image source={{ uri: LOGO_SEM_FUNDO }} style={styles.headerLogo} resizeMode="contain" />
            </View>
          ),
          headerTitleAlign: 'center' as const,
          headerLeft: () => (
            <TouchableOpacity testID="menu-btn" style={styles.menuBtn} onPress={() => setMenuOpen(true)}>
              <View style={styles.menuLines}>
                <View style={[styles.menuLine, { backgroundColor: colors.primary }]} />
                <View style={[styles.menuLine, styles.menuLineShort, { backgroundColor: colors.primary }]} />
                <View style={[styles.menuLine, { backgroundColor: colors.primary }]} />
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity testID="dark-mode-toggle" onPress={toggle} style={styles.themeBtn}>
              <View style={[styles.themeCircle, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                <Ionicons name={mode === 'dark' ? 'sunny' : 'moon'} size={18} color={colors.primary} />
              </View>
            </TouchableOpacity>
          ),
          tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.primary + '15', borderTopWidth: 1, height: 68, paddingBottom: 8, paddingTop: 4 },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: { fontSize: 9, fontWeight: '700' },
        }}
      >
        <Tabs.Screen name="videoaulas" options={{ title: 'Panda', tabBarIcon: ({ color, size }) => <Ionicons name="play-circle" size={size} color={color} /> }} />
        <Tabs.Screen name="alfabetizacao" options={{ title: '30 Dias', tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} /> }} />
        <Tabs.Screen name="videos100" options={{ title: 'Vídeos', tabBarIcon: ({ color, size }) => <Ionicons name="videocam" size={size} color={color} /> }} />
        <Tabs.Screen name="ingles" options={{ title: 'English', tabBarIcon: ({ color, size }) => <Ionicons name="language" size={size} color={color} /> }} />
        <Tabs.Screen name="desenho" options={{ title: 'Desenho', tabBarIcon: ({ color, size }) => <Ionicons name="color-palette" size={size} color={color} /> }} />
        <Tabs.Screen name="recursos" options={{ title: 'Recursos', tabBarIcon: ({ color, size }) => <Ionicons name="folder-open" size={size} color={color} /> }} />
        <Tabs.Screen name="musica" options={{ href: null }} />
      </Tabs>

      <Modal visible={menuOpen} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setMenuOpen(false)}>
          <View style={[styles.menuPanel, { backgroundColor: colors.bg, borderColor: colors.primary + '25' }]}>
            <View style={styles.menuHeader}>
              <Image source={{ uri: LOGO_SEM_FUNDO }} style={styles.menuLogo} resizeMode="contain" />
              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={[styles.menuDivider, { backgroundColor: colors.primary + '20' }]} />
            {menuItems.map((item, i) => (
              <TouchableOpacity key={i} testID={`menu-item-${i}`} style={styles.menuItem}
                onPress={() => { setMenuOpen(false); router.push(item.route as any); }}>
                <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuBtn: { marginLeft: 16, padding: 8 },
  menuLines: { gap: 5 },
  menuLine: { width: 22, height: 2.5, borderRadius: 2 },
  menuLineShort: { width: 16 },
  themeBtn: { marginRight: 16, padding: 4 },
  themeCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerLogo: { width: 160, height: 50 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  menuPanel: { width: 280, height: '100%', borderRightWidth: 1, padding: 20, paddingTop: 50 },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  menuLogo: { width: 100, height: 36 },
  menuDivider: { height: 1, marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  menuItemText: { fontSize: 16, fontWeight: '600' },
});

```

## `/app/frontend/app/(tabs)/alfabetizacao.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const PLAYLIST_URL = 'https://www.youtube.com/watch?v=WyA6GscP4DA&list=PLBU8yn5kXnNXF7Q5TrPGQqnfGQyQzNDdj&pp=gAQB';

export default function AlfabetizacaoTab() {
  const { colors } = useTheme();
  const { accessMode } = useAuth();
  const router = useRouter();
  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/content/alphabetization`)
      .then(r => r.json()).then(setDays).catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const isLocked = accessMode === 'free';

  const handleDayPress = (day: any) => {
    if (isLocked) {
      router.push('/plans');
    } else {
      Linking.openURL(day.pdf_url);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: colors.accent + '20' }]}>
            <Ionicons name="book" size={32} color={colors.accent} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Método Guiado para Acelerar a{'\n'}Alfabetização em até 30 Dias
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Método fônico comprovado por Harvard - ensine o SOM das letras
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <TouchableOpacity
            testID="playlist-btn"
            style={[styles.playlistCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            onPress={() => Linking.openURL(PLAYLIST_URL)}
          >
            <Ionicons name="videocam" size={24} color={colors.secondary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.playlistTitle, { color: colors.text }]}>Playlist +100 Vídeos Auxiliares</Text>
              <Text style={[styles.playlistNote, { color: colors.textSecondary }]}>
                Vídeos públicos do YouTube como apoio complementar
              </Text>
            </View>
            <Ionicons name="open-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        </Animated.View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 30 }} />
        ) : (
          <View style={styles.daysContainer}>
            {days.map((day, idx) => (
              <Animated.View key={day.day} entering={FadeInDown.delay(100 + idx * 40).duration(400)}>
                <TouchableOpacity
                  testID={`day-${day.day}-btn`}
                  style={[styles.dayCard, {
                    backgroundColor: isLocked ? colors.locked : colors.card,
                    borderColor: isLocked ? 'transparent' : colors.cardBorder,
                  }]}
                  onPress={() => handleDayPress(day)}
                >
                  <View style={[styles.dayBadge, { backgroundColor: isLocked ? colors.textSecondary : colors.accent }]}>
                    <Text style={styles.dayBadgeText}>{day.day}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.dayTitle, { color: isLocked ? colors.textSecondary : colors.text }]}>
                      Dia {day.day}
                    </Text>
                    <Text style={[styles.daySubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                      {day.title}
                    </Text>
                  </View>
                  <Ionicons
                    name={isLocked ? 'lock-closed' : 'document-text'}
                    size={18}
                    color={isLocked ? colors.textSecondary : colors.primary}
                  />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16 },
  header: { alignItems: 'center', marginBottom: 24, paddingHorizontal: 8 },
  headerIcon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center', lineHeight: 24, marginBottom: 8 },
  subtitle: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  playlistCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 20 },
  playlistTitle: { fontSize: 14, fontWeight: '600' },
  playlistNote: { fontSize: 11, marginTop: 2 },
  daysContainer: { gap: 8 },
  dayCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, gap: 12 },
  dayBadge: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  dayBadgeText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  dayTitle: { fontSize: 14, fontWeight: '600' },
  daySubtitle: { fontSize: 12, marginTop: 2 },
});

```

## `/app/frontend/app/(tabs)/desenho.tsx`

```typescript
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const COLORIFY_COVER = 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/9sxcm57d_COLRIFY%20APP.png';
const COLORIFY_URL = 'https://colorifypro.lovable.app/';

export default function DesenhoTab() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.titleSection}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Desenho</Text>
          <View style={styles.titleUnderline}>
            <View style={[styles.underlinePart, { backgroundColor: colors.primary }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.accent }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.secondary }]} />
          </View>
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
            Transforme suas fotos em desenhos e imprima para pintar em família
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <TouchableOpacity
            testID="colorify-cover-btn"
            style={styles.coverCard}
            onPress={() => Linking.openURL(COLORIFY_URL)}
            activeOpacity={0.85}
          >
            <Image source={{ uri: COLORIFY_COVER }} style={styles.coverImage} resizeMode="cover" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <TouchableOpacity
            testID="colorify-btn"
            style={[styles.openBtn, { backgroundColor: colors.primary }]}
            onPress={() => Linking.openURL(COLORIFY_URL)}
            activeOpacity={0.8}
          >
            <Ionicons name="color-palette" size={22} color="#fff" />
            <Text style={styles.openBtnText}>ABRIR APP DE DESENHO</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16 },
  titleSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  titleUnderline: { flexDirection: 'row', gap: 4, marginTop: 6 },
  underlinePart: { width: 24, height: 3, borderRadius: 2 },
  sectionSub: { fontSize: 13, marginTop: 8, lineHeight: 18 },
  coverCard: { borderRadius: 18, overflow: 'hidden', marginBottom: 20 },
  coverImage: { width: '100%', aspectRatio: 16 / 9 },
  openBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 18 },
  openBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
});

```

## `/app/frontend/app/(tabs)/ingles.tsx`

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

function speakEnglish(word: string) {
  if (Platform.OS !== 'web') return;
  try {
    const synth = (window as any).speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = 'en-US';
    utter.rate = 0.7;
    utter.volume = 1;
    synth.speak(utter);
  } catch (e) { /* ignore */ }
}

interface WordData { word_en: string; word_pt: string; emoji: string; category: string; order: number; }

export default function InglesTab() {
  const { colors } = useTheme();
  const [words, setWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/api/content/english`)
      .then(r => r.json()).then(setWords).catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const current = words[currentIdx];

  const next = () => setCurrentIdx(prev => (prev + 1) % words.length);
  const prev = () => setCurrentIdx(prev => prev === 0 ? words.length - 1 : prev - 1);

  const handleSpeak = useCallback(() => {
    if (current) speakEnglish(current.word_en);
  }, [current]);

  if (loading) return (
    <View style={[styles.container, { backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.titleSection}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Aprender em Inglês</Text>
          <View style={styles.titleUnderline}>
            <View style={[styles.underlinePart, { backgroundColor: colors.primary }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.accent }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.secondary }]} />
          </View>
        </Animated.View>

        <View style={styles.progressRow}>
          <Text style={[styles.progress, { color: colors.textSecondary }]}>{currentIdx + 1} / {words.length}</Text>
          <Text style={[styles.categoryLabel, { color: colors.primary }]}>{current?.category?.toUpperCase()}</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={[styles.flashcard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {/* Emoji/Image */}
          <Text style={styles.emoji}>{current?.emoji}</Text>

          {/* Portuguese word below */}
          <Text style={[styles.wordPt, { color: colors.text }]}>{current?.word_pt}</Text>

          {/* Audio button - pronounces in English */}
          <TouchableOpacity testID="speak-btn" style={[styles.audioBtn, { backgroundColor: colors.primary }]} onPress={handleSpeak} activeOpacity={0.8}>
            <Ionicons name="volume-high" size={24} color="#fff" />
            <Text style={styles.audioBtnText}>Ouvir em Inglês</Text>
          </TouchableOpacity>

          <Text style={[styles.englishHint, { color: colors.textSecondary }]}>
            "{current?.word_en}"
          </Text>
        </Animated.View>

        <View style={styles.navRow}>
          <TouchableOpacity testID="prev-word-btn" style={[styles.navBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderWidth: 1 }]} onPress={prev}>
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
            <Text style={[styles.navText, { color: colors.text }]}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="next-word-btn" style={[styles.navBtn, { backgroundColor: colors.primary }]} onPress={next}>
            <Text style={[styles.navText, { color: '#fff' }]}>Próxima</Text>
            <Ionicons name="chevron-forward" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, alignItems: 'center' },
  titleSection: { alignSelf: 'flex-start', marginBottom: 16, width: '100%' },
  sectionTitle: { fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  titleUnderline: { flexDirection: 'row', gap: 4, marginTop: 6 },
  underlinePart: { width: 24, height: 3, borderRadius: 2 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 16 },
  progress: { fontSize: 14, fontWeight: '600' },
  categoryLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  flashcard: { width: '100%', borderRadius: 24, padding: 32, alignItems: 'center', borderWidth: 1, minHeight: 300, justifyContent: 'center' },
  emoji: { fontSize: 72, marginBottom: 16 },
  wordPt: { fontSize: 32, fontWeight: '900', marginBottom: 24, textAlign: 'center' },
  audioBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 28, paddingVertical: 16, borderRadius: 18 },
  audioBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  englishHint: { fontSize: 14, marginTop: 16, fontStyle: 'italic' },
  navRow: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
  navBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 14 },
  navText: { fontSize: 15, fontWeight: '700' },
});

```

## `/app/frontend/app/(tabs)/musica.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Song {
  id: string; title: string; youtube_id: string; category: string;
  is_free: boolean; instruments: string[]; order: number;
}

export default function MusicaTab() {
  const { colors } = useTheme();
  const { user, accessMode } = useAuth();
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<'infantil' | 'gospel'>('infantil');

  useEffect(() => { fetchSongs(); }, [category]);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/songs?category=${category}`);
      const data = await res.json();
      // Sort: FREE songs first
      const sorted = [...data].sort((a: Song, b: Song) => {
        if (a.is_free && !b.is_free) return -1;
        if (!a.is_free && b.is_free) return 1;
        return a.order - b.order;
      });
      setSongs(sorted);
    } catch (e) { console.log('Fetch error:', e); }
    setLoading(false);
  };

  const canAccess = (song: Song) => song.is_free || accessMode === 'premium';

  const handleSongPress = (song: Song) => {
    if (canAccess(song)) { router.push(`/song/${song.id}`); }
    else { router.push('/plans'); }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Gradient Title */}
      <Animated.View entering={FadeInDown.duration(500)} style={styles.titleSection}>
        {user && (
          <Text style={[styles.welcomeText, { color: colors.primary }]}>
            Olá, {user.name}! 🎵
          </Text>
        )}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Interativo Musical
        </Text>
        <View style={styles.titleUnderline}>
          <View style={[styles.underlinePart, { backgroundColor: colors.primary }]} />
          <View style={[styles.underlinePart, { backgroundColor: colors.accent }]} />
          <View style={[styles.underlinePart, { backgroundColor: colors.secondary }]} />
        </View>
      </Animated.View>

      <View style={styles.categoryRow}>
        {(['infantil', 'gospel'] as const).map(cat => (
          <TouchableOpacity
            testID={`category-${cat}-btn`}
            key={cat}
            style={[styles.categoryBtn, {
              backgroundColor: category === cat ? colors.primary : 'transparent',
              borderColor: category === cat ? colors.primary : colors.cardBorder,
            }]}
            onPress={() => setCategory(cat)}
          >
            <Ionicons
              name={cat === 'infantil' ? 'happy' : 'heart'}
              size={16}
              color={category === cat ? '#fff' : colors.textSecondary}
            />
            <Text style={[styles.categoryText, { color: category === cat ? '#fff' : colors.textSecondary }]}>
              {cat === 'infantil' ? 'Escola Infantil' : 'Gospel'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.songsGrid} showsVerticalScrollIndicator={false}>
          {songs.map((song, idx) => {
            const unlocked = canAccess(song);
            return (
              <Animated.View key={song.id} entering={FadeInDown.delay(idx * 25).duration(350)}>
                <TouchableOpacity
                  testID={`song-card-${song.id}`}
                  style={[styles.songCard, {
                    backgroundColor: unlocked ? colors.card : colors.locked,
                    borderColor: song.is_free ? colors.primary : unlocked ? colors.cardBorder : 'transparent',
                    borderWidth: song.is_free ? 2 : 1,
                  }]}
                  onPress={() => handleSongPress(song)}
                  activeOpacity={0.7}
                >
                  <View style={styles.songTop}>
                    <View style={[styles.songIcon, { backgroundColor: unlocked ? colors.primary + '20' : colors.locked }]}>
                      <Ionicons
                        name={unlocked ? 'musical-notes' : 'lock-closed'}
                        size={26}
                        color={unlocked ? colors.primary : colors.textSecondary}
                      />
                    </View>
                    {song.is_free && (
                      <View style={[styles.freeBadge, { backgroundColor: colors.accent }]}>
                        <Text style={styles.freeBadgeText}>FREE</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.songTitle, { color: unlocked ? colors.text : colors.textSecondary }]} numberOfLines={2}>
                    {song.title}
                  </Text>
                  {unlocked && (
                    <View style={styles.instrumentsRow}>
                      <Text style={[styles.instCount, { color: colors.primary }]}>{song.instruments.length} instrumentos</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  titleSection: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  welcomeText: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  sectionTitle: { fontSize: 22, fontWeight: '800', letterSpacing: 1 },
  titleUnderline: { flexDirection: 'row', gap: 4, marginTop: 6 },
  underlinePart: { width: 24, height: 3, borderRadius: 2 },
  categoryRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  categoryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, borderWidth: 1 },
  categoryText: { fontSize: 13, fontWeight: '600' },
  songsGrid: { paddingHorizontal: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  songCard: { width: 170, borderRadius: 18, padding: 16, marginBottom: 4 },
  songTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  songIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  freeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  freeBadgeText: { color: '#0D0D0D', fontSize: 10, fontWeight: '900' },
  songTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8, lineHeight: 19 },
  instrumentsRow: { flexDirection: 'row', alignItems: 'center' },
  instCount: { fontSize: 11, fontWeight: '600' },
});

```

## `/app/frontend/app/(tabs)/recursos.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const COLORIFY_URL = 'https://colorifypro.lovable.app/';
const COLORIFY_IMG = 'https://images.unsplash.com/photo-1620398722262-969d8f2bc875?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGNvbG9yaW5nJTIwZHJhd2luZyUyMGhhbGYlMjBjb2xvcmVkfGVufDB8fHx8MTc3NjU2NDQ4N3ww&ixlib=rb-4.1.0&q=85';

const CATEGORY_INFO: Record<string, { label: string; icon: string; color: string }> = {
  pedagogico: { label: 'Recursos Pedagógicos', icon: 'school', color: '#2563EB' },
  autismo: { label: 'Autismo e Inclusão', icon: 'heart', color: '#9D4CDD' },
  lancheira: { label: 'Lancheira Kids', icon: 'restaurant', color: '#22C55E' },
  bonus: { label: 'Bônus Exclusivos', icon: 'star', color: '#D97016' },
};

export default function RecursosTab() {
  const { colors } = useTheme();
  const { accessMode } = useAuth();
  const router = useRouter();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/content/resources`)
      .then(r => r.json()).then(setResources).catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const isLocked = accessMode === 'free';

  const handleResourcePress = (r: any) => {
    if (isLocked) { router.push('/plans'); return; }
    Linking.openURL(r.pdf_url);
  };

  const grouped = resources.reduce((acc: Record<string, any[]>, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Gradient Title */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.titleSection}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Recursos Pedagógicos</Text>
          <View style={styles.titleUnderline}>
            <View style={[styles.underlinePart, { backgroundColor: colors.primary }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.accent }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.secondary }]} />
          </View>
        </Animated.View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 30 }} />
        ) : (
          Object.entries(grouped).map(([cat, items], catIdx) => {
            const info = CATEGORY_INFO[cat] || { label: cat, icon: 'document', color: colors.primary };
            return (
              <Animated.View key={cat} entering={FadeInDown.delay(200 + catIdx * 100).duration(500)}>
                <View style={styles.categoryHeader}>
                  <View style={[styles.catIcon, { backgroundColor: info.color + '20' }]}>
                    <Ionicons name={info.icon as any} size={20} color={info.color} />
                  </View>
                  <Text style={[styles.catTitle, { color: colors.text }]}>{info.label}</Text>
                  {cat === 'bonus' && (
                    <View style={[styles.bonusBadge, { backgroundColor: info.color }]}>
                      <Text style={styles.bonusBadgeText}>BÔNUS</Text>
                    </View>
                  )}
                </View>
                {(items as any[]).map((r: any) => (
                  <TouchableOpacity
                    testID={`resource-${r.id}`}
                    key={r.id}
                    style={[styles.resourceCard, {
                      backgroundColor: isLocked ? colors.locked : colors.card,
                      borderColor: isLocked ? 'transparent' : colors.cardBorder,
                    }]}
                    onPress={() => handleResourcePress(r)}
                  >
                    <Ionicons
                      name={isLocked ? 'lock-closed' : 'document-text'}
                      size={20}
                      color={isLocked ? colors.textSecondary : info.color}
                    />
                    <Text style={[styles.resourceTitle, { color: isLocked ? colors.textSecondary : colors.text }]} numberOfLines={1}>
                      {r.title}
                    </Text>
                    <Ionicons name="download-outline" size={18} color={isLocked ? colors.textSecondary : colors.primary} />
                  </TouchableOpacity>
                ))}
              </Animated.View>
            );
          })
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16 },
  colorifyCard: { borderRadius: 18, borderWidth: 2, marginBottom: 24, overflow: 'hidden', position: 'relative', height: 180 },
  colorifyImage: { width: '100%', height: '100%', position: 'absolute' },
  colorifyOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', padding: 16, justifyContent: 'center', alignItems: 'center', gap: 8 },
  colorifyTitle: { fontSize: 14, fontWeight: '700', lineHeight: 20, color: '#fff', textAlign: 'center' },
  colorifySubtitle: { fontSize: 13, fontWeight: '800', color: '#01CFC9' },
  titleSection: { marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '800', letterSpacing: 1 },
  titleUnderline: { flexDirection: 'row', gap: 4, marginTop: 6 },
  underlinePart: { width: 24, height: 3, borderRadius: 2 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10, marginTop: 16 },
  catIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  catTitle: { fontSize: 16, fontWeight: '700', flex: 1 },
  bonusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  bonusBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  resourceCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  resourceTitle: { flex: 1, fontSize: 13, fontWeight: '500' },
});

```

## `/app/frontend/app/(tabs)/videoaulas.tsx`

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform, Image } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const COVERS = {
  musicas: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/u96rfqaz_MUSICAS%20DA%20VOGAIS%2C.png',
  vogais: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/9xwu2jxr_CAPA%20VOGAIS%20COM%20O%20PANDA.png',
  consoantes: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/jw72p0l8_CONSOANTES%20COM%20O%20PANDA.png',
  silabas: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/z6yg1dl7_S%C3%8DLABAS%20COM%20O%20PANDA.png',
};

const SECTIONS = [
  {
    id: 'musicas',
    title: 'Músicas das Vogais',
    cover: COVERS.musicas,
    videos: [
      { id: 'ma', title: 'Letra A - Música', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/7cmv8fdh_LETRA%20A%20MUSICA.MOV' },
      { id: 'me', title: 'Letra E - Música', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/imnynb42_LETRA%20E%20MUSICA.MOV' },
      { id: 'mi', title: 'Letra I - Música', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/mutiojys_LETRA%20I%20MUSICA.MOV' },
      { id: 'mo', title: 'Letra O - Música', url: '' },
      { id: 'mu', title: 'Letra U - Música', url: '' },
    ],
  },
  {
    id: 'vogais',
    title: 'Vogais com o Panda',
    cover: COVERS.vogais,
    videos: [
      { id: 'va', title: 'Vogal A', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/1jhlnpjn_VOGAL%20A.MOV' },
      { id: 've', title: 'Vogal E', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/gpy48mfn_VOGAL%20E.MOV' },
      { id: 'vi', title: 'Vogal I', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/kpzprhbu_VOGAL%20I.MOV' },
      { id: 'vo', title: 'Vogal O', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/zra9811o_VOGAL%20O.MOV' },
      { id: 'vu', title: 'Vogal U', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/7tjvbc4q_VOGAL%20U.MOV' },
    ],
  },
  {
    id: 'consoantes',
    title: 'Consoantes com o Panda',
    cover: COVERS.consoantes,
    videos: [
      { id: 'cb', title: 'Consoante B', url: '' },
      { id: 'cc', title: 'Consoante C', url: '' },
      { id: 'cd', title: 'Consoante D', url: '' },
    ],
  },
  {
    id: 'silabas',
    title: 'Sílabas com o Panda',
    cover: COVERS.silabas,
    videos: [
      { id: 'sba', title: 'Sílabas BA BE BI', url: '' },
      { id: 'sca', title: 'Sílabas CA CE CI', url: '' },
    ],
  },
];

export default function VideoaulasTab() {
  const { colors } = useTheme();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<{ url: string; title: string } | null>(null);

  const currentSection = SECTIONS.find(s => s.id === openSection);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.titleSection}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Videoaulas do Panda</Text>
          <View style={styles.titleUnderline}>
            <View style={[styles.underlinePart, { backgroundColor: colors.primary }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.accent }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.secondary }]} />
          </View>
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>Método AlfaSonoro</Text>
        </Animated.View>

        {openSection && currentSection ? (
          <>
            <TouchableOpacity style={styles.backBtn} onPress={() => setOpenSection(null)}>
              <Ionicons name="chevron-back" size={22} color={colors.primary} />
              <Text style={[styles.backText, { color: colors.primary }]}>Voltar</Text>
            </TouchableOpacity>
            <Text style={[styles.openTitle, { color: colors.text }]}>{currentSection.title}</Text>
            {currentSection.videos.map((video, idx) => (
              <Animated.View key={video.id} entering={FadeInDown.delay(idx * 60).duration(350)}>
                <TouchableOpacity
                  testID={`video-${video.id}`}
                  style={[styles.videoItem, { backgroundColor: video.url ? colors.card : colors.locked, borderColor: video.url ? colors.cardBorder : 'transparent' }]}
                  onPress={() => video.url ? setPlayingVideo({ url: video.url, title: video.title }) : null}
                  activeOpacity={video.url ? 0.7 : 1}
                >
                  <View style={[styles.videoThumb, { backgroundColor: video.url ? colors.primary + '20' : colors.textSecondary + '20' }]}>
                    <Ionicons name={video.url ? 'play-circle' : 'lock-closed'} size={28} color={video.url ? colors.primary : colors.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.videoTitle, { color: video.url ? colors.text : colors.textSecondary }]}>{video.title}</Text>
                    {!video.url && <Text style={[styles.soonLabel, { color: colors.textSecondary }]}>Em breve</Text>}
                  </View>
                  {video.url && <Ionicons name="chevron-forward" size={20} color={colors.primary} />}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </>
        ) : (
          SECTIONS.map((section, sIdx) => (
            <Animated.View key={section.id} entering={FadeInDown.delay(sIdx * 100).duration(400)}>
              <TouchableOpacity
                testID={`section-${section.id}`}
                style={styles.coverCard}
                onPress={() => setOpenSection(section.id)}
                activeOpacity={0.85}
              >
                <Image source={{ uri: section.cover }} style={styles.coverImage} resizeMode="cover" />
                <View style={styles.coverOverlay}>
                  <Text style={styles.coverCount}>{section.videos.filter(v => v.url).length}/{section.videos.length} vídeos</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal visible={!!playingVideo} animationType="slide" supportedOrientations={['portrait', 'landscape']}>
        <View style={styles.videoModal}>
          <TouchableOpacity testID="close-video-btn" style={styles.closeVideoBtn} onPress={() => setPlayingVideo(null)}>
            <Ionicons name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.videoModalTitle}>{playingVideo?.title}</Text>
          {playingVideo && Platform.OS === 'web' ? (
            <video src={playingVideo.url} controls autoPlay style={{ width: '100%', height: '80%', backgroundColor: '#000', borderRadius: 12 } as any} />
          ) : (
            <View style={styles.placeholder}><Ionicons name="play-circle" size={64} color="#01CFC9" /></View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16 },
  titleSection: { marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  titleUnderline: { flexDirection: 'row', gap: 4, marginTop: 6 },
  underlinePart: { width: 24, height: 3, borderRadius: 2 },
  sectionSub: { fontSize: 13, marginTop: 6 },
  coverCard: { borderRadius: 18, overflow: 'hidden', marginBottom: 14, position: 'relative' },
  coverImage: { width: '100%', aspectRatio: 1 },
  coverOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)' },
  coverCount: { color: '#fff', fontSize: 12, fontWeight: '700', textAlign: 'right' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  backText: { fontSize: 14, fontWeight: '600' },
  openTitle: { fontSize: 20, fontWeight: '900', marginBottom: 16 },
  videoItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  videoThumb: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  videoTitle: { fontSize: 15, fontWeight: '700' },
  soonLabel: { fontSize: 11, marginTop: 2 },
  videoModal: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 16 },
  closeVideoBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  videoModalTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  placeholder: { alignItems: 'center', justifyContent: 'center', flex: 1 },
});

```

## `/app/frontend/app/(tabs)/videos100.tsx`

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Platform } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PLAYLIST_ID = 'PLBU8yn5kXnNXF7Q5TrPGQqnfGQyQzNDdj';
const BANNER_IMG = 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/0wsekceb_AVISO%20IMPORTANTE%21.png';

export default function Videos100Tab() {
  const { colors } = useTheme();
  const [showPlaylist, setShowPlaylist] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.titleSection}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>+100 Vídeos de Alfabetização</Text>
          <View style={styles.titleUnderline}>
            <View style={[styles.underlinePart, { backgroundColor: colors.primary }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.accent }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.secondary }]} />
          </View>
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
            Conteúdo complementar de apoio à alfabetização
          </Text>
        </Animated.View>

        {/* Banner de Aviso */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Image source={{ uri: BANNER_IMG }} style={styles.bannerImg} resizeMode="contain" />
        </Animated.View>

        {/* Playlist Embed Button */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <TouchableOpacity
            testID="open-playlist-btn"
            style={[styles.playlistBtn, { backgroundColor: colors.primary }]}
            onPress={() => setShowPlaylist(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="play-circle" size={28} color="#fff" />
            <View style={{ flex: 1 }}>
              <Text style={styles.playlistBtnTitle}>ASSISTIR PLAYLIST COMPLETA</Text>
              <Text style={styles.playlistBtnSub}>+100 vídeos em tela cheia dentro do app</Text>
            </View>
            <Ionicons name="expand" size={22} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Ionicons name="information-circle" size={22} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Estes são materiais públicos do YouTube utilizados como apoio complementar. Todos os créditos pertencem aos seus respectivos criadores e canais originais.
            </Text>
          </View>
        </Animated.View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Fullscreen Playlist Modal */}
      <Modal visible={showPlaylist} animationType="slide" supportedOrientations={['portrait', 'landscape']}>
        <View style={styles.playlistModal}>
          <TouchableOpacity testID="close-playlist-btn" style={styles.closeBtn} onPress={() => setShowPlaylist(false)}>
            <Ionicons name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>
          {Platform.OS === 'web' ? (
            <iframe
              src={`https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}&autoplay=1`}
              style={{ width: '100%', height: '90%', border: 'none', borderRadius: 12 } as any}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="videocam" size={64} color="#01CFC9" />
              <Text style={{ color: '#fff', marginTop: 12, fontSize: 16 }}>Playlist do YouTube</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16 },
  titleSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  titleUnderline: { flexDirection: 'row', gap: 4, marginTop: 6 },
  underlinePart: { width: 24, height: 3, borderRadius: 2 },
  sectionSub: { fontSize: 13, marginTop: 8 },
  bannerImg: { width: '100%', height: 280, borderRadius: 16, marginBottom: 20 },
  playlistBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, borderRadius: 18, marginBottom: 16 },
  playlistBtnTitle: { color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 1 },
  playlistBtnSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 16, borderRadius: 14, borderWidth: 1 },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18 },
  playlistModal: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 16 },
  closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  placeholder: { alignItems: 'center', justifyContent: 'center', flex: 1 },
});

```

## `/app/frontend/app/+html.tsx`

```typescript
// @ts-nocheck
import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/*
          Disable body scrolling on web to make ScrollView components work correctly.
          If you want to enable scrolling, remove `ScrollViewStyleReset` and
          set `overflow: auto` on the body style below.
        */}
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body > div:first-child { position: fixed !important; top: 0; left: 0; right: 0; bottom: 0; }
              [role="tablist"] [role="tab"] * { overflow: visible !important; }
              [role="heading"], [role="heading"] * { overflow: visible !important; }
            `,
          }}
        />
      </head>
      <body
        style={{
          margin: 0,
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </body>
    </html>
  );
}

```

## `/app/frontend/app/_layout.tsx`

```typescript
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { AuthProvider } from '../src/contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform } from 'react-native';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <View style={styles.rootContainer}>
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="plans" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="song/[id]" options={{ presentation: 'modal' }} />
          </Stack>
        </View>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    maxWidth: Platform.OS === 'web' ? 480 : undefined,
    width: '100%',
    alignSelf: 'center',
  },
});

```

## `/app/frontend/app/index.tsx`

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const LOGO_SEM_FUNDO = 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/cz5cen1e_logo%20fundo.png';

export default function Index() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Animated.View entering={FadeInUp.duration(700)} style={styles.heroSection}>
        <Image source={{ uri: LOGO_SEM_FUNDO }} style={styles.logo} resizeMode="contain" />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(700)} style={styles.titleSection}>
        <Text style={[styles.title, { color: colors.primary }]}>DIVERSÃO E</Text>
        <Text style={[styles.title, { color: colors.secondary }]}>APRENDIZADO</Text>
        <View style={styles.lineRow}>
          <View style={[styles.line, { backgroundColor: colors.primary }]} />
          <View style={[styles.line, { backgroundColor: colors.accent }]} />
          <View style={[styles.line, { backgroundColor: colors.secondary }]} />
        </View>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          Música, Alfabetização e Inglês para seus filhos
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(600).duration(700)} style={styles.buttonsContainer}>
        <TouchableOpacity
          testID="login-btn"
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/login')}
          activeOpacity={0.8}
        >
          <Ionicons name="log-in" size={20} color="#fff" />
          <Text style={styles.primaryBtnText}>ENTRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="view-plans-btn"
          style={[styles.outlineBtn, { borderColor: colors.secondary }]}
          onPress={() => router.push('/plans')}
          activeOpacity={0.7}
        >
          <Ionicons name="diamond" size={18} color={colors.secondary} />
          <Text style={[styles.outlineBtnText, { color: colors.secondary }]}>VER PLANOS</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={[styles.footer, { color: colors.textSecondary }]}>© 2026 alfakids - Diversão e Aprendizado</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  heroSection: { alignItems: 'center', marginBottom: 16 },
  logo: { width: 220, height: 100 },
  titleSection: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 24, fontWeight: '900', letterSpacing: 4, textAlign: 'center' },
  lineRow: { flexDirection: 'row', gap: 4, marginVertical: 12 },
  line: { width: 40, height: 2.5, borderRadius: 2 },
  tagline: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  buttonsContainer: { width: '100%', maxWidth: 320, gap: 14 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 16 },
  primaryBtnText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 2 },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 16, borderWidth: 1.5 },
  outlineBtnText: { fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  footer: { position: 'absolute', bottom: 20, fontSize: 11 },
});

```

## `/app/frontend/app/login.tsx`

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAuth } from '../src/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const LOGO_SEM_FUNDO = 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/cz5cen1e_logo%20fundo.png';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInstall, setShowInstall] = useState(false);

  const handleLogin = async () => {
    if (!email || !name || !password) { setError('Preencha todos os campos'); return; }
    setLoading(true);
    setError('');
    const success = await login(email, name, password, 'premium');
    setLoading(false);
    if (success) { router.replace('/(tabs)/videoaulas'); }
    else { setError('Senha incorreta. Verifique e tente novamente.'); }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity testID="login-back-btn" onPress={() => router.back()} style={styles.backRow}>
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
            <Text style={[styles.backText, { color: colors.primary }]}>Voltar</Text>
          </TouchableOpacity>

          <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
            <Image source={{ uri: LOGO_SEM_FUNDO }} style={styles.logo} resizeMode="contain" />
            <View style={[styles.animatedLine, { backgroundColor: colors.primary, opacity: 0.4 }]} />
            <Text style={[styles.titleText, { color: colors.primary }]}>ACESSO COMPLETO</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Entre com seu email e senha de acesso
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.primary + '25' }]}>
              <View style={styles.inputGroup}>
                <View style={[styles.inputWrapper, { borderColor: colors.primary + '30', backgroundColor: colors.bgSecondary }]}>
                  <Ionicons name="mail-outline" size={18} color={colors.primary} style={styles.inputIcon} />
                  <TextInput testID="login-email-input" style={[styles.input, { color: colors.text }]} placeholder="Seu email" placeholderTextColor={colors.textSecondary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={[styles.inputWrapper, { borderColor: colors.primary + '30', backgroundColor: colors.bgSecondary }]}>
                  <Ionicons name="person-outline" size={18} color={colors.primary} style={styles.inputIcon} />
                  <TextInput testID="login-name-input" style={[styles.input, { color: colors.text }]} placeholder="Nome da criança" placeholderTextColor={colors.textSecondary} value={name} onChangeText={setName} />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={[styles.inputWrapper, { borderColor: colors.primary + '30', backgroundColor: colors.bgSecondary }]}>
                  <Ionicons name="lock-closed-outline" size={18} color={colors.primary} style={styles.inputIcon} />
                  <TextInput testID="login-password-input" style={[styles.input, { color: colors.text }]} placeholder="Senha de acesso" placeholderTextColor={colors.textSecondary} value={password} onChangeText={setPassword} secureTextEntry />
                </View>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity testID="login-submit-btn" style={[styles.loginBtn, { backgroundColor: colors.primary }]} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
                <Text style={styles.loginBtnText}>{loading ? 'ENTRANDO...' : 'CONTINUAR'}</Text>
              </TouchableOpacity>

              <TouchableOpacity testID="install-app-btn" style={[styles.installBtn, { borderColor: colors.secondary }]} onPress={() => setShowInstall(true)} activeOpacity={0.7}>
                <Ionicons name="download-outline" size={18} color={colors.secondary} />
                <Text style={[styles.installBtnText, { color: colors.secondary }]}>INSTALAR APLICATIVO</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.lineCenter}>
            <View style={[styles.animatedLine, { backgroundColor: colors.primary, opacity: 0.3 }]} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showInstall} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.primary + '30' }]}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowInstall(false)}>
              <Ionicons name="close-circle" size={28} color={colors.primary} />
            </TouchableOpacity>
            <Ionicons name="phone-portrait-outline" size={40} color={colors.primary} style={{ alignSelf: 'center', marginBottom: 16 }} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>INSTALAR O APP</Text>
            {['Toque no ícone de Compartilhar (quadrado com seta para cima).', 'Role e selecione "Adicionar à Tela de Início".', 'Toque em "Adicionar" no canto superior direito.'].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}><Text style={styles.stepNumText}>{i + 1}</Text></View>
                <Text style={[styles.modalStep, { color: colors.textSecondary }]}>{step}</Text>
              </View>
            ))}
            <TouchableOpacity style={[styles.modalOkBtn, { backgroundColor: colors.primary }]} onPress={() => setShowInstall(false)}>
              <Text style={styles.modalOkText}>ENTENDI!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 20, justifyContent: 'center' },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: '600' },
  header: { alignItems: 'center', marginBottom: 28 },
  logo: { width: 200, height: 90, marginBottom: 16 },
  animatedLine: { width: 180, height: 1.5, borderRadius: 1, marginBottom: 12 },
  titleText: { fontSize: 22, fontWeight: '900', letterSpacing: 3 },
  subtitle: { fontSize: 13, marginTop: 8 },
  card: { borderRadius: 20, padding: 24, borderWidth: 1 },
  inputGroup: { marginBottom: 14 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 54, borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },
  error: { color: '#FF4444', fontSize: 13, textAlign: 'center', marginBottom: 8, fontWeight: '600' },
  loginBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  loginBtnText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 2 },
  installBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, paddingVertical: 16, borderRadius: 16, borderWidth: 1.5 },
  installBtnText: { fontSize: 15, fontWeight: '800', letterSpacing: 1 },
  lineCenter: { alignItems: 'center', marginTop: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { borderRadius: 24, padding: 28, width: '100%', maxWidth: 360, position: 'relative', borderWidth: 1 },
  modalClose: { position: 'absolute', top: 16, right: 16, zIndex: 10 },
  modalTitle: { fontSize: 20, fontWeight: '900', marginBottom: 20, textAlign: 'center', letterSpacing: 2 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  modalStep: { flex: 1, fontSize: 14, lineHeight: 20 },
  modalOkBtn: { paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  modalOkText: { color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 1 },
});

```

## `/app/frontend/app/plans.tsx`

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const CHECKOUT_LIFETIME = 'https://pay.cakto.com.br/aw2hie4_853925';
const CHECKOUT_MONTHLY = 'https://pay.cakto.com.br/dboxghv';
const NEW_LOGO = 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/j41hwonf_Design%20sem%20nome%20%285%29.png';

export default function PlansScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity testID="plans-back-btn" onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>Voltar</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
          <Image source={{ uri: NEW_LOGO }} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.headerTitle, { color: colors.primary }]}>PLANOS</Text>
          <View style={styles.shimmerLineContainer}>
            <View style={[styles.shimmerLine, { backgroundColor: colors.primary }]} />
          </View>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Desbloqueie todo o conteúdo premium
          </Text>
        </Animated.View>

        {/* Urgency */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View style={[styles.urgencyBanner, { backgroundColor: '#FF444415', borderColor: '#FF444440' }]}>
            <Ionicons name="flame" size={18} color="#FF4444" />
            <Text style={styles.urgencyText}>Oferta válida somente hoje! Amanhã volta para o valor original.</Text>
          </View>
        </Animated.View>

        {/* LIFETIME PLAN - Premium with glow */}
        <Animated.View entering={FadeInDown.delay(400).duration(700)}>
            <View style={[styles.planCard, styles.planFeatured, { borderColor: colors.primary + '50' }]}>
              {/* Badge */}
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Ionicons name="star" size={14} color="#fff" />
                <Text style={styles.badgeText}> MAIS POPULAR</Text>
              </View>

              <Text style={[styles.planName, { color: '#FFFFFF' }]}>ACESSO VITALÍCIO</Text>

              <View style={styles.priceRow}>
                <Text style={[styles.currency, { color: colors.primary }]}>R$</Text>
                <Text style={[styles.price, { color: colors.primary }]}>37</Text>
                <Text style={[styles.priceCents, { color: colors.primary }]}>,00</Text>
              </View>

              <View style={[styles.paymentTag, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}>
                <Text style={[styles.paymentTagText, { color: colors.primary }]}>PAGAMENTO ÚNICO</Text>
              </View>

              <Text style={[styles.planDesc, { color: 'rgba(255,255,255,0.6)' }]}>
                Acesso completo para sempre. Todas as músicas, instrumentos, conteúdos e atualizações futuras.
              </Text>

              <View style={styles.features}>
                {['85+ Músicas Infantis e Gospel', 'Instrumentos Interativos', 'Conteúdos de Alfabetização', 'Aprender Inglês', 'Recursos Pedagógicos', 'App de Colorir', 'Lancheira Kids + Bônus', 'Modo Noturno', 'Atualizações Futuras'].map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                    <Text style={[styles.featureText, { color: 'rgba(255,255,255,0.6)' }]}>{f}</Text>
                  </View>
                ))}
              </View>

              {/* Button */}
              <TouchableOpacity testID="plan-lifetime-btn" style={[styles.planBtn, { backgroundColor: colors.primary }]} onPress={() => Linking.openURL(CHECKOUT_LIFETIME)} activeOpacity={0.8}>
                <Ionicons name="diamond" size={20} color="#fff" />
                <Text style={styles.planBtnText}>QUERO ACESSO VITALÍCIO</Text>
              </TouchableOpacity>

              <Text style={[styles.guarantee, { color: 'rgba(255,255,255,0.3)' }]}>Acesso imediato após o pagamento</Text>
            </View>
        </Animated.View>

        {/* MONTHLY PLAN */}
        <Animated.View entering={FadeInDown.delay(600).duration(700)}>
          <View style={[styles.planCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.planName, { color: colors.text }]}>ACESSO MENSAL</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.currency, { color: colors.secondary }]}>R$</Text>
              <Text style={[styles.price, { color: colors.secondary }]}>27</Text>
              <Text style={[styles.priceCents, { color: colors.secondary }]}>,00</Text>
            </View>
            <Text style={[styles.planDetail, { color: colors.textSecondary }]}>por mês</Text>
            <TouchableOpacity testID="plan-monthly-btn" style={[styles.planBtn, { backgroundColor: colors.secondary }]} onPress={() => Linking.openURL(CHECKOUT_MONTHLY)} activeOpacity={0.8}>
              <Text style={styles.planBtnText}>ASSINAR MENSAL</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(800).duration(500)} style={styles.shimmerLineContainer}>
          <View style={[styles.shimmerLine, { backgroundColor: colors.primary }]} />
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: '600' },
  header: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 140, height: 50, marginBottom: 12 },
  headerTitle: { fontSize: 30, fontWeight: '900', letterSpacing: 6 },
  shimmerLineContainer: { alignItems: 'center', marginVertical: 10 },
  shimmerLine: { width: 200, height: 1.5, borderRadius: 1 },
  headerSubtitle: { fontSize: 14, marginTop: 4, textAlign: 'center' },
  urgencyBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 24 },
  urgencyText: { flex: 1, color: '#FF6B6B', fontSize: 13, fontWeight: '700' },
  planGlowWrapper: { position: 'relative', marginBottom: 20 },
  planGlowTop: { position: 'absolute', top: -15, left: '15%', width: '70%', height: 30, borderRadius: 15, opacity: 0.12 },
  planGlowRight: { position: 'absolute', top: '30%', right: -10, width: 20, height: '40%', borderRadius: 10, opacity: 0.1 },
  planGlowBottom: { position: 'absolute', bottom: -10, left: '20%', width: '60%', height: 20, borderRadius: 10, opacity: 0.1 },
  planCard: { borderRadius: 24, padding: 28, borderWidth: 2, marginBottom: 20, position: 'relative', overflow: 'hidden' },
  planFeatured: { backgroundColor: 'rgba(13, 13, 20, 0.95)' },
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24, marginBottom: 16 },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  planName: { fontSize: 22, fontWeight: '900', marginBottom: 8, letterSpacing: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  currency: { fontSize: 22, fontWeight: '700', marginTop: 12 },
  price: { fontSize: 68, fontWeight: '900', lineHeight: 74 },
  priceCents: { fontSize: 22, fontWeight: '700', marginTop: 12 },
  paymentTag: { alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, marginBottom: 16, borderWidth: 1 },
  paymentTagText: { fontSize: 13, fontWeight: '900', letterSpacing: 2 },
  planDetail: { fontSize: 14, fontWeight: '500', marginBottom: 16 },
  planDesc: { fontSize: 13, lineHeight: 20, marginBottom: 20 },
  features: { marginBottom: 24, gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { fontSize: 13, fontWeight: '500' },
  btnGlowWrapper: { position: 'relative' },
  btnGlow: { position: 'absolute', top: -8, left: '10%', width: '80%', height: 60, borderRadius: 30 },
  planBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 18, position: 'relative', zIndex: 1 },
  planBtnText: { color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 1 },
  guarantee: { textAlign: 'center', fontSize: 11, marginTop: 14 },
});

```

## `/app/frontend/app/song/[id].tsx`

```typescript
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const INSTRUMENT_META: Record<string, { label: string; icon: string; color: string; freq: number; wave: OscillatorType }> = {
  piano: { label: 'Piano', icon: 'musical-note', color: '#01CFC9', freq: 523.25, wave: 'sine' },
  violao: { label: 'Violão', icon: 'musical-notes', color: '#0984E3', freq: 329.63, wave: 'triangle' },
  flauta: { label: 'Flauta', icon: 'mic', color: '#22C55E', freq: 698.46, wave: 'sine' },
  bateria: { label: 'Bateria', icon: 'disc', color: '#FFD700', freq: 150, wave: 'square' },
  baixo: { label: 'Baixo', icon: 'radio', color: '#7C3AED', freq: 130.81, wave: 'sawtooth' },
  pandeiro: { label: 'Pandeiro', icon: 'ellipse', color: '#F59E0B', freq: 800, wave: 'triangle' },
  violino: { label: 'Violino', icon: 'pulse', color: '#EC4899', freq: 440, wave: 'sawtooth' },
};

// Web Audio synthesizer - CONTINUOUS looping sounds
const audioContextRef: { current: any } = { current: null };
const activeOscillators: Map<string, { osc: any; gain: any }> = new Map();

function getAudioContext() {
  if (Platform.OS !== 'web') return null;
  try {
    if (!audioContextRef.current) {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      audioContextRef.current = new AudioCtx();
    }
    return audioContextRef.current;
  } catch (e) { return null; }
}

function startInstrumentSound(inst: string, freq: number, waveType: OscillatorType) {
  const ctx = getAudioContext();
  if (!ctx) return;
  stopInstrumentSound(inst);
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = waveType;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    activeOscillators.set(inst, { osc, gain });
  } catch (e) { /* ignore */ }
}

function stopInstrumentSound(inst: string) {
  const entry = activeOscillators.get(inst);
  if (entry) {
    try {
      entry.gain.gain.exponentialRampToValueAtTime(0.001, getAudioContext()!.currentTime + 0.1);
      setTimeout(() => { try { entry.osc.stop(); } catch(e) {} }, 150);
    } catch (e) { /* ignore */ }
    activeOscillators.delete(inst);
  }
}

function stopAllSounds() {
  activeOscillators.forEach((_, inst) => stopInstrumentSound(inst));
}

export default function SongPlayer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [song, setSong] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeInstruments, setActiveInstruments] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showFireworks, setShowFireworks] = useState(false);
  const [score, setScore] = useState(0);
  const timerRef = useRef<any>(null);
  const scoreRef = useRef(0);

  useEffect(() => {
    if (id) {
      fetch(`${API_URL}/api/songs/${id}`)
        .then(r => r.json()).then(data => {
          setSong(data);
          setActiveInstruments(new Set(data.instruments || []));
        }).catch(console.log)
        .finally(() => setLoading(false));
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); stopAllSounds(); };
  }, [id]);

  useEffect(() => {
    if (isPlaying && activeInstruments.size > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            endSong();
            return 0;
          }
          scoreRef.current += activeInstruments.size * 0.2;
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, activeInstruments.size]);

  const endSong = () => {
    setIsPlaying(false);
    stopAllSounds();
    const finalScore = Math.min(10, Math.round(scoreRef.current * 10) / 10);
    setScore(finalScore);
    setShowFireworks(true);
  };

  const toggleInstrument = useCallback((inst: string) => {
    const meta = INSTRUMENT_META[inst];
    setActiveInstruments(prev => {
      const next = new Set(prev);
      if (next.has(inst)) {
        next.delete(inst);
        stopInstrumentSound(inst);
      } else {
        next.add(inst);
        if (meta) startInstrumentSound(inst, meta.freq, meta.wave);
      }
      if (next.size === 0) { setIsPlaying(false); stopAllSounds(); }
      return next;
    });
  }, []);

  const tapInstrument = useCallback((inst: string) => {
    // Already playing continuously, just visual feedback
  }, []);

  const startPlaying = () => {
    if (activeInstruments.size > 0) {
      setIsPlaying(true);
      setTimeLeft(60);
      scoreRef.current = 0;
    }
  };

  const resetSong = () => {
    setShowFireworks(false);
    setScore(0);
    setTimeLeft(60);
    scoreRef.current = 0;
    if (song) setActiveInstruments(new Set(song.instruments));
  };

  if (loading || !song) return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />
    </SafeAreaView>
  );

  if (showFireworks) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <ScrollView contentContainerStyle={styles.fireworksContainer}>
          <Animated.View entering={ZoomIn.duration(600)} style={styles.fireworksContent}>
            <Text style={styles.fireworksEmoji}>🎆🎉🎊🎆🎉</Text>
            <Animated.View entering={FadeInUp.delay(300).duration(500)}>
              <Text style={[styles.congratsText, { color: colors.primary }]}>PARABÉNS!</Text>
              <Text style={[styles.congratsName, { color: colors.accent }]}>
                {user?.name || 'Campeão'}!
              </Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(600).duration(500)} style={[styles.scoreCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Sua nota é</Text>
              <Text style={[styles.scoreValue, { color: colors.primary }]}>{score.toFixed(1)}</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Ionicons key={i} name={i <= Math.round(score / 2) ? 'star' : 'star-outline'} size={32} color={colors.accent} />
                ))}
              </View>
              <Text style={[styles.scoreMessage, { color: colors.textSecondary }]}>
                Vamos para a próxima música!
              </Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(900).duration(500)} style={styles.fireworksBtns}>
              <TouchableOpacity testID="play-again-btn" style={[styles.fwBtn, { backgroundColor: colors.primary }]} onPress={resetSong}>
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={[styles.fwBtnText, { color: '#fff' }]}>Tocar Novamente</Text>
              </TouchableOpacity>
              <TouchableOpacity testID="next-song-btn" style={[styles.fwBtn, { backgroundColor: colors.secondary }]} onPress={() => router.back()}>
                <Ionicons name="musical-notes" size={20} color="#fff" />
                <Text style={[styles.fwBtnText, { color: '#fff' }]}>Mais Músicas</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity testID="back-btn" onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>{song.title}</Text>
        <View style={[styles.timerBadge, { backgroundColor: timeLeft <= 10 ? '#FF444420' : colors.primary + '20' }]}>
          <Ionicons name="time" size={14} color={timeLeft <= 10 ? '#FF4444' : colors.primary} />
          <Text style={[styles.timerText, { color: timeLeft <= 10 ? '#FF4444' : colors.primary }]}>{timeLeft}s</Text>
        </View>
      </View>

      {/* YouTube Video */}
      <View style={styles.videoContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            src={`https://www.youtube.com/embed/${song.youtube_id}?autoplay=0&controls=1&modestbranding=1&rel=0&end=60`}
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: 14 } as any}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <View style={styles.videoPlaceholder}>
            <Ionicons name="play-circle" size={48} color={colors.primary} />
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.instrumentsSection}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          Toque nos instrumentos! Cada um produz um som diferente 🎵
        </Text>
        <View style={styles.instrumentsGrid}>
          {song.instruments.map((inst: string, idx: number) => {
            const meta = INSTRUMENT_META[inst] || { label: inst, icon: 'musical-note', color: colors.primary, freq: 440, wave: 'sine' as OscillatorType };
            const isActive = activeInstruments.has(inst);
            return (
              <Animated.View key={inst} entering={FadeInDown.delay(idx * 60).duration(350)}>
                <TouchableOpacity
                  testID={`instrument-${inst}`}
                  style={[styles.instrumentBtn, {
                    backgroundColor: isActive ? meta.color + '18' : colors.locked,
                    borderColor: isActive ? meta.color : 'transparent',
                    borderWidth: isActive ? 2 : 1,
                  }]}
                  onPress={() => toggleInstrument(inst)}
                  activeOpacity={0.6}
                >
                  <View style={[styles.instrumentIcon, { backgroundColor: isActive ? meta.color : colors.textSecondary + '40' }]}>
                    <Ionicons name={isActive ? 'volume-high' : 'volume-mute'} size={24} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.instrumentLabel, { color: isActive ? colors.text : colors.textSecondary }]}>
                      {meta.label}
                    </Text>
                    <Text style={[styles.instrumentHint, { color: isActive ? meta.color : colors.textSecondary }]}>
                      {isActive ? 'Tocando... Toque para parar' : 'Toque para ativar'}
                    </Text>
                  </View>
                  <View style={[styles.statusDot, { backgroundColor: isActive ? meta.color : colors.textSecondary + '40' }]} />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {!isPlaying ? (
          <TouchableOpacity
            testID="start-playing-btn"
            style={[styles.playButton, { backgroundColor: activeInstruments.size > 0 ? colors.primary : colors.locked }]}
            onPress={startPlaying}
            disabled={activeInstruments.size === 0}
          >
            <Ionicons name="play" size={24} color="#fff" />
            <Text style={[styles.playButtonText, { color: '#fff' }]}>
              {activeInstruments.size > 0 ? 'INICIAR MÚSICA' : 'Ative um instrumento'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            testID="stop-playing-btn"
            style={[styles.playButton, { backgroundColor: '#FF4444' }]}
            onPress={endSong}
          >
            <Ionicons name="stop" size={24} color="#fff" />
            <Text style={[styles.playButtonText, { color: '#fff' }]}>PARAR</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  backBtn: { padding: 4 },
  songTitle: { flex: 1, fontSize: 16, fontWeight: '700' },
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  timerText: { fontSize: 14, fontWeight: '700' },
  videoContainer: { height: 200, marginHorizontal: 16, borderRadius: 14, overflow: 'hidden', backgroundColor: '#000' },
  videoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  instrumentsSection: { padding: 16 },
  sectionLabel: { fontSize: 13, fontWeight: '500', textAlign: 'center', marginBottom: 14 },
  instrumentsGrid: { gap: 10 },
  instrumentBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, gap: 14 },
  instrumentIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  instrumentLabel: { fontSize: 16, fontWeight: '700' },
  instrumentHint: { fontSize: 11, marginTop: 2 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  playButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 20, paddingVertical: 18, borderRadius: 18 },
  playButtonText: { fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  fireworksContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  fireworksContent: { alignItems: 'center', width: '100%', maxWidth: 360 },
  fireworksEmoji: { fontSize: 48, marginBottom: 16 },
  congratsText: { fontSize: 38, fontWeight: '900', textAlign: 'center', letterSpacing: 4 },
  congratsName: { fontSize: 30, fontWeight: '700', textAlign: 'center', marginTop: 8, marginBottom: 24 },
  scoreCard: { borderRadius: 24, padding: 28, alignItems: 'center', width: '100%', marginBottom: 24, borderWidth: 1 },
  scoreLabel: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  scoreValue: { fontSize: 56, fontWeight: '900' },
  starsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  scoreMessage: { fontSize: 14, marginTop: 12 },
  fireworksBtns: { gap: 12, width: '100%' },
  fwBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 16 },
  fwBtnText: { fontSize: 15, fontWeight: '700' },
});

```

## `/app/frontend/eslint.config.js`

```javascript
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);

```

## `/app/frontend/expo-env.d.ts`

```typescript
/// <reference types="expo/types" />

// NOTE: This file should not be edited and should be in your git ignore
```

## `/app/frontend/metro.config.js`

```javascript
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const path = require('path');
const { FileStore } = require('metro-cache');

const config = getDefaultConfig(__dirname);

// Use a stable on-disk store (shared across web/android)
const root = process.env.METRO_CACHE_ROOT || path.join(__dirname, '.metro-cache');
config.cacheStores = [
  new FileStore({ root: path.join(root, 'cache') }),
];


// // Exclude unnecessary directories from file watching
// config.watchFolders = [__dirname];
// config.resolver.blacklistRE = /(.*)\/(__tests__|android|ios|build|dist|.git|node_modules\/.*\/android|node_modules\/.*\/ios|node_modules\/.*\/windows|node_modules\/.*\/macos)(\/.*)?$/;

// // Alternative: use a more aggressive exclusion pattern
// config.resolver.blacklistRE = /node_modules\/.*\/(android|ios|windows|macos|__tests__|\.git|.*\.android\.js|.*\.ios\.js)$/;

// Reduce the number of workers to decrease resource usage
config.maxWorkers = 2;

module.exports = config;

```

## `/app/frontend/package.json`

```json
{
  "name": "frontend",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "dependencies": {
    "@babel/runtime": "^7.20.6",
    "@expo-google-fonts/montserrat": "^0.4.2",
    "@expo/metro-runtime": "^6.1.2",
    "@expo/ngrok": "^4.1.3",
    "@expo/vector-icons": "^15.0.3",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-navigation/bottom-tabs": "^7.3.10",
    "@react-navigation/elements": "^2.3.8",
    "@react-navigation/native": "^7.1.6",
    "@react-navigation/native-stack": "^7.3.10",
    "expo": "~54.0.34",
    "expo-av": "^16.0.8",
    "expo-blur": "~15.0.8",
    "expo-constants": "~18.0.13",
    "expo-font": "~14.0.11",
    "expo-haptics": "~15.0.8",
    "expo-image": "~3.0.11",
    "expo-linking": "~8.0.12",
    "expo-router": "~6.0.22",
    "expo-splash-screen": "~31.0.13",
    "expo-status-bar": "~3.0.9",
    "expo-symbols": "~1.0.8",
    "expo-system-ui": "~6.0.9",
    "expo-web-browser": "~15.0.11",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-dotenv": "^3.4.11",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-web": "^0.21.0",
    "react-native-webview": "13.15.0",
    "react-native-worklets": "0.5.1"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~19.1.0",
    "eslint": "^9.25.0",
    "eslint-config-expo": "~10.0.0",
    "typescript": "~5.9.3"
  },
  "private": true,
  "packageManager": "yarn@1.22.22+sha512.a6b2f7906b721bba3d67d4aff083df04dad64c399707841b7acf00f6b133b7ac24255f2652fa22ae3534329dc6180534e98d17432037ff6fd140556e2bb3137e"
}

```

## `/app/frontend/scripts/reset-project.js`

```javascript
#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /app, /components, /hooks, /scripts, and /constants directories to /app-example based on user input and creates a new /app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["app", "components", "hooks", "constants", "scripts"];
const exampleDir = "app-example";
const newAppDir = "app";
const exampleDirPath = path.join(root, exampleDir);

const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      // Create the app-example directory
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Move old directories to new app-example directory or delete them
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} deleted.`);
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Create new /app directory
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 New /app directory created.");

    // Create index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 app/index.tsx created.");

    // Create _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 app/_layout.tsx created.");

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit app/index.tsx to edit the main screen.${
        userInput === "y"
          ? `\n3. Delete the /${exampleDir} directory when you're done referencing it.`
          : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

rl.question(
  "Do you want to move existing files to /app-example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);

```

## `/app/frontend/src/contexts/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface AuthContextType {
  user: { name: string; email: string; mode: string } | null;
  accessMode: 'free' | 'premium' | 'alfa';
  isLoading: boolean;
  login: (email: string, name: string, password: string, mode: string) => Promise<boolean>;
  logout: () => void;
  setAccessMode: (mode: 'free' | 'premium' | 'alfa') => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, accessMode: 'free', isLoading: true,
  login: async () => false, logout: () => {},
  setAccessMode: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [accessMode, setAccessModeState] = useState<'free' | 'premium' | 'alfa'>('free');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const mode = await AsyncStorage.getItem('accessMode');
      if (mode) setAccessModeState(mode as any);
      if (token) {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setAccessModeState(data.mode);
        } else {
          await AsyncStorage.removeItem('token');
        }
      }
    } catch (e) {
      console.log('Auth check failed:', e);
    }
    setIsLoading(false);
  };

  const login = async (email: string, name: string, password: string, mode: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, mode }),
      });
      if (res.ok) {
        const data = await res.json();
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('accessMode', data.mode);
        setUser({ name: data.name, email: data.email, mode: data.mode });
        setAccessModeState(data.mode);
        return true;
      }
      return false;
    } catch (e) {
      console.log('Login error:', e);
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'accessMode']);
    setUser(null);
    setAccessModeState('free');
  };

  const setAccessMode = (mode: 'free' | 'premium' | 'alfa') => {
    setAccessModeState(mode);
    AsyncStorage.setItem('accessMode', mode);
  };

  return (
    <AuthContext.Provider value={{ user, accessMode, isLoading, login, logout, setAccessMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

```

## `/app/frontend/src/contexts/ThemeContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  mode: ThemeMode;
  toggle: () => void;
  colors: typeof darkColors;
}

const darkColors = {
  bg: '#0D0D14',
  bgSecondary: '#161622',
  card: 'rgba(22, 22, 34, 0.9)',
  cardBorder: 'rgba(1, 207, 201, 0.2)',
  primary: '#01CFC9',
  secondary: '#0984E3',
  accent: '#FFD700',
  accentPurple: '#7C3AED',
  text: '#FFFFFF',
  textSecondary: '#8E8EA0',
  textGold: '#FFD700',
  surface: 'rgba(22, 22, 34, 0.8)',
  locked: 'rgba(255,255,255,0.08)',
  gradientStart: '#01CFC9',
  gradientEnd: '#0984E3',
};

const lightColors = {
  bg: '#F5F6FA',
  bgSecondary: '#EEEEF5',
  card: 'rgba(255, 255, 255, 0.95)',
  cardBorder: 'rgba(9, 132, 227, 0.2)',
  primary: '#01CFC9',
  secondary: '#0984E3',
  accent: '#FFD700',
  accentPurple: '#7C3AED',
  text: '#1A1A2E',
  textSecondary: '#555570',
  textGold: '#D4A800',
  surface: 'rgba(255, 255, 255, 0.9)',
  locked: 'rgba(0,0,0,0.06)',
  gradientStart: '#01CFC9',
  gradientEnd: '#0984E3',
};

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggle: () => {},
  colors: darkColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    AsyncStorage.getItem('theme').then(saved => {
      if (saved === 'light' || saved === 'dark') setMode(saved);
    });
  }, []);

  const toggle = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    AsyncStorage.setItem('theme', next);
  };

  const colors = mode === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, toggle, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

```

## `/app/frontend/tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}

```

