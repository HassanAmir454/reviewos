import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_review_not_found():
    resp = client.get("/reviews/nonexistent-id")
    assert resp.status_code == 404
