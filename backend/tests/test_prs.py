import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_prs_requires_repo_param():
    resp = client.get("/prs")
    assert resp.status_code == 422  # missing required query param


def test_reviews_trigger_schema():
    resp = client.post("/reviews/trigger", json={})
    assert resp.status_code == 422  # missing required fields


def test_analytics_velocity_requires_repo():
    resp = client.get("/analytics/velocity")
    assert resp.status_code == 422


def test_repos_connect():
    resp = client.post("/repos/connect", json={"owner": "test", "repo": "repo"})
    assert resp.status_code == 200
    assert resp.json()["full_name"] == "test/repo"
