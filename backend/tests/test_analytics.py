import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_analytics_heatmap_requires_repo():
    resp = client.get("/analytics/heatmap")
    assert resp.status_code == 422

def test_analytics_team_requires_repo():
    resp = client.get("/analytics/team")
    assert resp.status_code == 422
