from __future__ import annotations

import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine

import whisperlab.db as db_module
from whisperlab.config import get_settings
from whisperlab.db import Base


@pytest_asyncio.fixture(autouse=True)
async def _clean_database():
    """Reset schema and the cached engine/session-factory singletons before each
    test. TestClient(create_app()) runs its own event loop per test, but
    whisperlab.db caches an engine/session-factory at module scope (see
    get_engine()) -- reusing one across event loops raises
    'attached to a different loop'. Build a short-lived engine just for the
    schema reset, dispose it, and clear the cached globals so the app's own
    lifespan creates a fresh, correctly-loop-bound engine for each test."""
    settings = get_settings()
    reset_engine = create_async_engine(settings.database_url)
    async with reset_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    await reset_engine.dispose()

    db_module._engine = None
    db_module._session_factory = None

    yield

    if db_module._engine is not None:
        await db_module._engine.dispose()
    db_module._engine = None
    db_module._session_factory = None
