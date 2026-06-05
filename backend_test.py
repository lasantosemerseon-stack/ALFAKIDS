"""
Backend test suite for Alfakids API.
Focus: validate updated /api/content/resources endpoint with 19 bonus items,
plus regression checks on auth, songs, alphabetization, english endpoints.
"""
import os
import sys
import json
import requests

BASE_URL = "https://pedagogy-music-hub.preview.emergentagent.com/api"
PASSWORD = "alfakids321"

results = []

def record(name, ok, detail=""):
    status = "PASS" if ok else "FAIL"
    print(f"[{status}] {name}{(' -- ' + detail) if detail else ''}")
    results.append({"name": name, "ok": ok, "detail": detail})
    return ok


def test_health():
    r = requests.get(f"{BASE_URL}/", timeout=15)
    record("GET /api/ - status code 200", r.status_code == 200, f"code={r.status_code}")
    try:
        data = r.json()
        record("GET /api/ - returns status ok", data.get("status") == "ok", f"body={data}")
    except Exception as e:
        record("GET /api/ - JSON body", False, str(e))


def test_login_and_me():
    payload = {"email": "maria.silva@alfakids.com", "name": "Maria Silva", "password": PASSWORD, "mode": "premium"}
    r = requests.post(f"{BASE_URL}/auth/login", json=payload, timeout=15)
    ok = record("POST /api/auth/login (premium) - 200", r.status_code == 200, f"code={r.status_code}, body={r.text[:200]}")
    token = None
    if ok:
        data = r.json()
        token = data.get("token")
        record("POST /api/auth/login - returns JWT token", bool(token) and isinstance(token, str) and token.count(".") == 2, f"token_present={bool(token)}")
        record("POST /api/auth/login - returns mode=premium", data.get("mode") == "premium", f"mode={data.get('mode')}")

    # Wrong password
    bad = requests.post(f"{BASE_URL}/auth/login", json={**payload, "password": "wrongpass"}, timeout=15)
    record("POST /api/auth/login - wrong password returns 401", bad.status_code == 401, f"code={bad.status_code}")

    # /auth/me without token
    r2 = requests.get(f"{BASE_URL}/auth/me", timeout=15)
    record("GET /api/auth/me without token - 401", r2.status_code == 401, f"code={r2.status_code}")

    # /auth/me with token
    if token:
        r3 = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {token}"}, timeout=15)
        ok3 = record("GET /api/auth/me with valid token - 200", r3.status_code == 200, f"code={r3.status_code}")
        if ok3:
            d = r3.json()
            record("GET /api/auth/me - returns email/name/mode",
                   all(k in d for k in ("email", "name", "mode")) and d["mode"] == "premium",
                   f"body={d}")

    # /auth/me invalid token
    r4 = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": "Bearer invalid.token.value"}, timeout=15)
    record("GET /api/auth/me invalid token - 401", r4.status_code == 401, f"code={r4.status_code}")


def test_songs():
    r = requests.get(f"{BASE_URL}/songs", params={"category": "infantil"}, timeout=15)
    ok = record("GET /api/songs?category=infantil - 200", r.status_code == 200, f"code={r.status_code}")
    if ok:
        data = r.json()
        record("GET /api/songs?category=infantil - non-empty list", isinstance(data, list) and len(data) > 0, f"count={len(data) if isinstance(data, list) else 'N/A'}")
        record("GET /api/songs?category=infantil - all infantil",
               all(s.get("category") == "infantil" for s in data),
               f"first={data[0] if data else None}")

    r2 = requests.get(f"{BASE_URL}/songs", params={"category": "gospel"}, timeout=15)
    ok2 = record("GET /api/songs?category=gospel - 200", r2.status_code == 200, f"code={r2.status_code}")
    if ok2:
        data2 = r2.json()
        record("GET /api/songs?category=gospel - non-empty list", isinstance(data2, list) and len(data2) > 0, f"count={len(data2) if isinstance(data2, list) else 'N/A'}")
        record("GET /api/songs?category=gospel - all gospel",
               all(s.get("category") == "gospel" for s in data2),
               "")
        # Test detail endpoint
        if data2:
            sid = data2[0]["id"]
            r3 = requests.get(f"{BASE_URL}/songs/{sid}", timeout=15)
            ok3 = record(f"GET /api/songs/{sid} - 200", r3.status_code == 200, f"code={r3.status_code}")
            if ok3:
                d = r3.json()
                record("GET /api/songs/{id} - returns same song", d.get("id") == sid, f"got_id={d.get('id')}")

    # Invalid id
    rbad = requests.get(f"{BASE_URL}/songs/does_not_exist_xxx", timeout=15)
    record("GET /api/songs/{invalid} - 404", rbad.status_code == 404, f"code={rbad.status_code}")


def test_alphabetization():
    r = requests.get(f"{BASE_URL}/content/alphabetization", timeout=15)
    ok = record("GET /api/content/alphabetization - 200", r.status_code == 200, f"code={r.status_code}")
    if ok:
        data = r.json()
        record("GET /api/content/alphabetization - returns 24 items",
               isinstance(data, list) and len(data) == 24,
               f"count={len(data) if isinstance(data, list) else 'N/A'}")
        # sorted by day asc
        if isinstance(data, list) and data:
            days = [x.get("day") for x in data]
            record("GET /api/content/alphabetization - sorted ascending by day",
                   days == sorted(days), f"days={days}")
            record("GET /api/content/alphabetization - all items have pdf_url",
                   all(isinstance(x.get("pdf_url"), str) and x["pdf_url"] for x in data), "")


def test_english():
    r = requests.get(f"{BASE_URL}/content/english", timeout=15)
    ok = record("GET /api/content/english - 200", r.status_code == 200, f"code={r.status_code}")
    if ok:
        data = r.json()
        record("GET /api/content/english - returns 30 items",
               isinstance(data, list) and len(data) == 30,
               f"count={len(data) if isinstance(data, list) else 'N/A'}")
        if isinstance(data, list) and data:
            orders = [x.get("order") for x in data]
            record("GET /api/content/english - sorted ascending by order",
                   orders == sorted(orders), f"first_orders={orders[:5]}")


def test_resources():
    r = requests.get(f"{BASE_URL}/content/resources", timeout=15)
    ok = record("GET /api/content/resources - 200", r.status_code == 200, f"code={r.status_code}")
    if not ok:
        return None
    data = r.json()
    record("GET /api/content/resources - is list", isinstance(data, list), f"type={type(data).__name__}")
    if not isinstance(data, list):
        return data

    # Exact count
    record("GET /api/content/resources - returns exactly 19 items",
           len(data) == 19, f"count={len(data)}")

    # All category == bonus
    categories = {x.get("category") for x in data}
    record("All items have category='bonus'",
           categories == {"bonus"}, f"found_categories={categories}")

    # No old categories
    forbidden = {"pedagogico", "autismo", "lancheira"}
    record("No legacy categories (pedagogico/autismo/lancheira)",
           categories.isdisjoint(forbidden), f"intersect={categories & forbidden}")

    # bonus_number 1..19 integer
    bonus_nums = []
    all_int = True
    for x in data:
        bn = x.get("bonus_number")
        if not isinstance(bn, int):
            all_int = False
        bonus_nums.append(bn)
    record("All items have integer bonus_number", all_int, f"sample={bonus_nums[:5]}")
    record("bonus_number values are exactly 1..19",
           sorted(bonus_nums) == list(range(1, 20)),
           f"sorted_bonus_numbers={sorted(bonus_nums)}")

    # Sorted ascending by bonus_number (since endpoint sorts by order)
    record("Items are returned sorted ascending by bonus_number",
           bonus_nums == list(range(1, 20)),
           f"order_received={bonus_nums}")

    # Item 1: Caderno da Leitura
    item1 = next((x for x in data if x.get("bonus_number") == 1), None)
    record("bonus_number=1 has title='Caderno da Leitura'",
           item1 is not None and item1.get("title") == "Caderno da Leitura",
           f"item1={item1}")
    if item1:
        record("bonus_number=1 pdf_url contains 'CADERNO-DE-LEITURA'",
               "CADERNO-DE-LEITURA" in (item1.get("pdf_url") or ""),
               f"pdf_url={item1.get('pdf_url')}")

    # Item 2: Lancheira
    item2 = next((x for x in data if x.get("bonus_number") == 2), None)
    record("bonus_number=2 has title='Lancheira'",
           item2 is not None and item2.get("title") == "Lancheira",
           f"item2={item2}")

    # All pdf_url valid non-empty strings
    record("All items have non-empty pdf_url string",
           all(isinstance(x.get("pdf_url"), str) and x["pdf_url"].strip() for x in data),
           "")

    return data


def test_idempotent_reseed():
    # Get count, restart backend, get count again
    r1 = requests.get(f"{BASE_URL}/content/resources", timeout=15)
    count1 = len(r1.json()) if r1.status_code == 200 else -1

    print("\n--- Restarting backend to validate idempotent re-seed ---")
    rc = os.system("sudo supervisorctl restart backend > /tmp/restart.log 2>&1")
    if rc != 0:
        record("Backend restart succeeded", False, f"rc={rc}")
        return
    # Wait for backend to come up
    import time
    up = False
    for _ in range(30):
        time.sleep(1)
        try:
            h = requests.get(f"{BASE_URL}/", timeout=5)
            if h.status_code == 200:
                up = True
                break
        except Exception:
            pass
    record("Backend came up after restart", up)
    if not up:
        return

    r2 = requests.get(f"{BASE_URL}/content/resources", timeout=15)
    count2 = len(r2.json()) if r2.status_code == 200 else -1
    record("Idempotent re-seed: still 19 resources after restart (no duplicates)",
           count2 == 19, f"before={count1}, after={count2}")


def main():
    print(f"Testing backend at: {BASE_URL}\n")
    print("=== Health ===")
    test_health()
    print("\n=== Auth ===")
    test_login_and_me()
    print("\n=== Songs ===")
    test_songs()
    print("\n=== Alphabetization ===")
    test_alphabetization()
    print("\n=== English ===")
    test_english()
    print("\n=== Resources (CRITICAL) ===")
    test_resources()
    print("\n=== Idempotent re-seed ===")
    test_idempotent_reseed()

    print("\n\n========== SUMMARY ==========")
    passed = sum(1 for r in results if r["ok"])
    failed = [r for r in results if not r["ok"]]
    print(f"Passed: {passed}/{len(results)}")
    if failed:
        print(f"\nFailed ({len(failed)}):")
        for f in failed:
            print(f"  - {f['name']}: {f['detail']}")
    sys.exit(0 if not failed else 1)


if __name__ == "__main__":
    main()
