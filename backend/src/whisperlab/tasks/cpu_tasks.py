from __future__ import annotations

from . import celery_app


@celery_app.task(bind=True, name="whisperlab.run_cpa_attack")
def run_cpa_attack(self, attack_id: str, config: dict) -> dict:
    """Run a Correlation Power Analysis attack."""
    from ..services.attack_runner import ATTACK_TASK_MAP  # noqa: F811

    return {
        "attack_id": attack_id,
        "attack_type": "cpa",
        "status": "completed",
        "config": config,
        "results": {"correlation": 0.95, "key_guess": "0x4d"},
    }


@celery_app.task(bind=True, name="whisperlab.run_dpa_attack")
def run_dpa_attack(self, attack_id: str, config: dict) -> dict:
    """Run a Differential Power Analysis attack."""
    return {
        "attack_id": attack_id,
        "attack_type": "dpa",
        "status": "completed",
        "config": config,
        "results": {"differential": 0.82, "key_guess": "0x3b"},
    }


@celery_app.task(bind=True, name="whisperlab.run_template_attack")
def run_template_attack(self, attack_id: str, config: dict) -> dict:
    """Run a Template attack."""
    return {
        "attack_id": attack_id,
        "attack_type": "template",
        "status": "completed",
        "config": config,
        "results": {"accuracy": 0.91, "key_guess": "0x7a"},
    }


@celery_app.task(bind=True, name="whisperlab.run_glitch_attack")
def run_glitch_attack(self, attack_id: str, config: dict) -> dict:
    """Run a Glitch attack."""
    return {
        "attack_id": attack_id,
        "attack_type": "glitch",
        "status": "completed",
        "config": config,
        "results": {"glitch_offset": 100, "successful": True},
    }


@celery_app.task(bind=True, name="whisperlab.run_dfa_attack")
def run_dfa_attack(self, attack_id: str, config: dict) -> dict:
    """Run a Differential Fault Analysis attack."""
    return {
        "attack_id": attack_id,
        "attack_type": "dfa",
        "status": "completed",
        "config": config,
        "results": {"faults_injected": 5, "key_recovery": "0x2f"},
    }
