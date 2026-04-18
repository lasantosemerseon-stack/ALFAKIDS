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
