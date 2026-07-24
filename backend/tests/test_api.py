from __future__ import annotations

from fastapi.testclient import TestClient

from whisperlab.config import get_settings
from whisperlab.main import create_app


def client() -> TestClient:
    get_settings.cache_clear()
    settings = get_settings()
    settings.token = "test-token"
    settings.simulation = True
    settings.enable_execution = False
    return TestClient(create_app())


def test_health_is_public() -> None:
    with client() as test_client:
        response = test_client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["simulation"] is True


def test_mutation_requires_local_token() -> None:
    with client() as test_client:
        response = test_client.post("/api/v1/captures/preview", json={})
    assert response.status_code == 401


def test_simulated_capture_with_token() -> None:
    with client() as test_client:
        response = test_client.post(
            "/api/v1/captures/preview",
            headers={"X-WhisperLab-Token": "test-token"},
            json={"samples": 1000, "traces": 1},
        )
    assert response.status_code == 200
    payload = response.json()
    assert payload["simulated"] is True
    assert payload["samples"] == 1000
    assert len(payload["trace"]) == 1000


def test_execution_is_opt_in() -> None:
    with client() as test_client:
        response = test_client.post(
            "/api/v1/execution/jobs",
            headers={"X-WhisperLab-Token": "test-token"},
            json={
                "kind": "python",
                "source": "print('hello')",
                "acknowledged_risk": True,
            },
        )
    assert response.status_code == 403
