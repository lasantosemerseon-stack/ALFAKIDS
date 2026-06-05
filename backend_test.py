"""
Backend tests for Alfakids API.
Focus: validate the NEW grouped /api/content/resources structure
(6 bonus groups containing multiple PDFs each, totaling 19 PDFs)
plus regression on previously working endpoints.

Base URL: from /app/frontend/.env -> EXPO_PUBLIC_BACKEND_URL
All routes are prefixed with /api.
"""
import os
import sys
import json
import requests

# ---------------------------------------------------------------------------
# Resolve base URL from frontend/.env (EXPO_PUBLIC_BACKEND_URL)
# ---------------------------------------------------------------------------
ENV_FILE = "/app/frontend/.env"
BASE_URL = None
with open(ENV_FILE, "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if line.startswith("EXPO_PUBLIC_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip().strip('"').strip("'")
            break

if not BASE_URL:
    print("FATAL: EXPO_PUBLIC_BACKEND_URL not found in /app/frontend/.env")
    sys.exit(2)

API = f"{BASE_URL.rstrip('/')}/api"
print(f"Testing against: {API}\n")

PASS, FAIL = 0, 0
FAILURES = []


def check(name, cond, detail=""):
    global PASS, FAIL
    if cond:
        PASS += 1
        print(f"  PASS  {name}")
    else:
        FAIL += 1
        FAILURES.append((name, detail))
        print(f"  FAIL  {name}  -> {detail}")


def section(title):
    print(f"\n=== {title} ===")


# ---------------------------------------------------------------------------
# 1. Health
# ---------------------------------------------------------------------------
section("GET /api/  (health)")
r = requests.get(f"{API}/", timeout=30)
check("status 200", r.status_code == 200, f"got {r.status_code}")
try:
    body = r.json()
except Exception as e:
    body = {}
    check("json body", False, str(e))
check("status field == ok", body.get("status") == "ok", json.dumps(body))


# ---------------------------------------------------------------------------
# 2. Auth - login premium
# ---------------------------------------------------------------------------
section("POST /api/auth/login (premium / correct password)")
payload = {
    "email": "ana.silva@alfakids.com",
    "name": "Ana Silva",
    "password": "alfakids321",
    "mode": "premium",
}
r = requests.post(f"{API}/auth/login", json=payload, timeout=30)
check("status 200", r.status_code == 200, f"got {r.status_code} body={r.text[:200]}")
login_body = {}
try:
    login_body = r.json()
except Exception:
    pass
token = login_body.get("token", "")
check("token present", bool(token), "missing token")
check("token has 3 JWT segments", token.count(".") == 2, token)
check("mode echoed as premium", login_body.get("mode") == "premium", json.dumps(login_body))

section("POST /api/auth/login (wrong password)")
r = requests.post(
    f"{API}/auth/login",
    json={**payload, "password": "wrong"},
    timeout=30,
)
check("status 401", r.status_code == 401, f"got {r.status_code}")


# ---------------------------------------------------------------------------
# 3. Auth - /me
# ---------------------------------------------------------------------------
section("GET /api/auth/me")
r = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {token}"}, timeout=30)
check("with valid bearer -> 200", r.status_code == 200, f"got {r.status_code} body={r.text[:200]}")
me_body = {}
try:
    me_body = r.json()
except Exception:
    pass
check("me.email matches", me_body.get("email") == payload["email"], json.dumps(me_body))
check("me.name matches", me_body.get("name") == payload["name"], json.dumps(me_body))
check("me.mode == premium", me_body.get("mode") == "premium", json.dumps(me_body))

r = requests.get(f"{API}/auth/me", timeout=30)
check("no token -> 401", r.status_code == 401, f"got {r.status_code}")

r = requests.get(f"{API}/auth/me", headers={"Authorization": "Bearer not-a-real-token"}, timeout=30)
check("invalid token -> 401", r.status_code == 401, f"got {r.status_code}")


# ---------------------------------------------------------------------------
# 4. Songs
# ---------------------------------------------------------------------------
section("GET /api/songs?category=infantil")
r = requests.get(f"{API}/songs", params={"category": "infantil"}, timeout=30)
check("status 200", r.status_code == 200, f"got {r.status_code}")
infantil = r.json() if r.status_code == 200 else []
check("count == 52", len(infantil) == 52, f"got {len(infantil)}")
check(
    "all have category=infantil",
    all(s.get("category") == "infantil" for s in infantil),
    "mixed categories",
)

section("GET /api/songs?category=gospel")
r = requests.get(f"{API}/songs", params={"category": "gospel"}, timeout=30)
check("status 200", r.status_code == 200, f"got {r.status_code}")
gospel = r.json() if r.status_code == 200 else []
check("count == 33", len(gospel) == 33, f"got {len(gospel)}")
check(
    "all have category=gospel",
    all(s.get("category") == "gospel" for s in gospel),
    "mixed categories",
)

section("GET /api/songs/{id}")
if infantil:
    sample_id = infantil[0]["id"]
    r = requests.get(f"{API}/songs/{sample_id}", timeout=30)
    check("valid id -> 200", r.status_code == 200, f"got {r.status_code}")
    detail = r.json() if r.status_code == 200 else {}
    check(
        "detail.id matches",
        detail.get("id") == sample_id,
        json.dumps(detail)[:200],
    )

r = requests.get(f"{API}/songs/this-id-does-not-exist", timeout=30)
check("invalid id -> 404", r.status_code == 404, f"got {r.status_code}")


# ---------------------------------------------------------------------------
# 5. Alphabetization
# ---------------------------------------------------------------------------
section("GET /api/content/alphabetization")
r = requests.get(f"{API}/content/alphabetization", timeout=30)
check("status 200", r.status_code == 200, f"got {r.status_code}")
alfa = r.json() if r.status_code == 200 else []
check("count == 24", len(alfa) == 24, f"got {len(alfa)}")
days = [d.get("day") for d in alfa]
check("days strictly ascending", days == sorted(days), f"{days}")


# ---------------------------------------------------------------------------
# 6. English
# ---------------------------------------------------------------------------
section("GET /api/content/english")
r = requests.get(f"{API}/content/english", timeout=30)
check("status 200", r.status_code == 200, f"got {r.status_code}")
eng = r.json() if r.status_code == 200 else []
check("count == 30", len(eng) == 30, f"got {len(eng)}")
orders = [w.get("order") for w in eng]
check("english.order strictly ascending", orders == sorted(orders), f"{orders}")


# ---------------------------------------------------------------------------
# 7. RESOURCES - NEW GROUPED STRUCTURE (CRITICAL)
# ---------------------------------------------------------------------------
section("GET /api/content/resources  (NEW GROUPED STRUCTURE)")
r = requests.get(f"{API}/content/resources", timeout=30)
check("status 200", r.status_code == 200, f"got {r.status_code}")
resources = r.json() if r.status_code == 200 else []

check("returns exactly 6 documents (groups)", len(resources) == 6, f"got {len(resources)}")

# field structure
required_fields = {"id", "bonus_number", "bonus_title", "items", "order", "category"}
for idx, doc in enumerate(resources):
    missing = required_fields - set(doc.keys())
    check(f"doc[{idx}] has required fields {sorted(required_fields)}", not missing, f"missing={missing}")
    check(f"doc[{idx}].category == 'bonus'", doc.get("category") == "bonus", f"got {doc.get('category')}")
    check(f"doc[{idx}].bonus_number is int", isinstance(doc.get("bonus_number"), int),
          f"got {type(doc.get('bonus_number'))}")
    check(f"doc[{idx}].bonus_title is non-empty string",
          isinstance(doc.get("bonus_title"), str) and len(doc.get("bonus_title", "")) > 0,
          f"got {doc.get('bonus_title')!r}")
    check(f"doc[{idx}].items is list", isinstance(doc.get("items"), list),
          f"got {type(doc.get('items'))}")
    items = doc.get("items") or []
    for j, it in enumerate(items):
        check(f"doc[{idx}].items[{j}].title non-empty",
              isinstance(it.get("title"), str) and len(it.get("title", "")) > 0,
              f"got {it.get('title')!r}")
        check(f"doc[{idx}].items[{j}].pdf_url non-empty",
              isinstance(it.get("pdf_url"), str) and len(it.get("pdf_url", "")) > 0,
              f"got {it.get('pdf_url')!r}")

# ordering by bonus_number 1..6
bonus_numbers = [d.get("bonus_number") for d in resources]
check("bonus_number ascending [1..6]", bonus_numbers == [1, 2, 3, 4, 5, 6], f"got {bonus_numbers}")

# group-by-group validation
by_num = {d.get("bonus_number"): d for d in resources}

# BÔNUS 1
g = by_num.get(1, {})
check("BÔNUS 1 title == 'Caderno da Leitura'",
      g.get("bonus_title") == "Caderno da Leitura", f"got {g.get('bonus_title')!r}")
check("BÔNUS 1 has 1 item", len(g.get("items") or []) == 1, f"got {len(g.get('items') or [])}")
if g.get("items"):
    check("BÔNUS 1 item title == 'Caderno da Leitura'",
          g["items"][0].get("title") == "Caderno da Leitura", f"got {g['items'][0].get('title')!r}")

# BÔNUS 2
g = by_num.get(2, {})
check("BÔNUS 2 title == 'Lancheira'",
      g.get("bonus_title") == "Lancheira", f"got {g.get('bonus_title')!r}")
check("BÔNUS 2 has 11 items", len(g.get("items") or []) == 11, f"got {len(g.get('items') or [])}")

# BÔNUS 3
g = by_num.get(3, {})
check("BÔNUS 3 title == 'Entendendo o Autismo'",
      g.get("bonus_title") == "Entendendo o Autismo", f"got {g.get('bonus_title')!r}")
items3 = g.get("items") or []
check("BÔNUS 3 has 3 items", len(items3) == 3, f"got {len(items3)}")
titles3 = [it.get("title") for it in items3]
expected3 = ["Entendendo o Autismo", "Atividades de Estimulação Cognitiva", "Desenvolvendo o Potencial"]
check(f"BÔNUS 3 item titles == {expected3}", titles3 == expected3, f"got {titles3}")

# BÔNUS 4
g = by_num.get(4, {})
check("BÔNUS 4 title == 'Atividades Pedagógicas'",
      g.get("bonus_title") == "Atividades Pedagógicas", f"got {g.get('bonus_title')!r}")
items4 = g.get("items") or []
check("BÔNUS 4 has 1 item", len(items4) == 1, f"got {len(items4)}")
if items4:
    check("BÔNUS 4 item title == '+100 Atividades de Alfabetização'",
          items4[0].get("title") == "+100 Atividades de Alfabetização",
          f"got {items4[0].get('title')!r}")

# BÔNUS 5
g = by_num.get(5, {})
check("BÔNUS 5 title == 'Método Novo de Leitura'",
      g.get("bonus_title") == "Método Novo de Leitura", f"got {g.get('bonus_title')!r}")
items5 = g.get("items") or []
check("BÔNUS 5 has 2 items", len(items5) == 2, f"got {len(items5)}")
titles5 = [it.get("title") for it in items5]
expected5 = ["Livro da Leitura - Sílabas Simples", "Régua da Leitura"]
check(f"BÔNUS 5 item titles == {expected5}", titles5 == expected5, f"got {titles5}")

# BÔNUS 6
g = by_num.get(6, {})
check("BÔNUS 6 title == 'Palavras em Inglês'",
      g.get("bonus_title") == "Palavras em Inglês", f"got {g.get('bonus_title')!r}")
items6 = g.get("items") or []
check("BÔNUS 6 has 1 item", len(items6) == 1, f"got {len(items6)}")
if items6:
    check("BÔNUS 6 item title == 'Tabela de Palavras em Inglês'",
          items6[0].get("title") == "Tabela de Palavras em Inglês",
          f"got {items6[0].get('title')!r}")

# total PDFs across all groups
total_pdfs = sum(len(d.get("items") or []) for d in resources)
check("total PDFs across all groups == 19", total_pdfs == 19, f"got {total_pdfs}")


# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
print(f"PASSED: {PASS}")
print(f"FAILED: {FAIL}")
if FAILURES:
    print("\nFailures detail:")
    for name, det in FAILURES:
        print(f"  - {name}: {det}")
print("=" * 60)
sys.exit(0 if FAIL == 0 else 1)
