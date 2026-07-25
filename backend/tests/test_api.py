from __future__ import annotations

from fastapi.testclient import TestClient

from whisperlab.config import get_settings
from whisperlab.main import create_app


def client() -> TestClient:
    get_settings.cache_clear()
    return TestClient(create_app())


def test_health_is_public() -> None:
    with client() as test_client:
        response = test_client.get("/api/v1/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["version"] == "0.1.0"


def test_list_experiments_empty() -> None:
    with client() as test_client:
        response = test_client.get("/api/v1/experiments")
    assert response.status_code == 200
    body = response.json()
    assert body["items"] == []
    assert body["total"] == 0


def test_create_and_list_experiment() -> None:
    with client() as test_client:
        create_response = test_client.post(
            "/api/v1/experiments",
            json={"name": "Test Experiment", "description": "smoke test", "tags": ["ci"]},
        )
        assert create_response.status_code == 201
        created = create_response.json()
        assert created["name"] == "Test Experiment"
        assert created["tags"] == ["ci"]

        list_response = test_client.get("/api/v1/experiments")
    assert list_response.status_code == 200
    body = list_response.json()
    assert body["total"] == 1
    assert body["items"][0]["id"] == created["id"]


def test_openapi_schema_is_served() -> None:
    with client() as test_client:
        response = test_client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    assert schema["info"]["title"] == "WhisperLab API"
