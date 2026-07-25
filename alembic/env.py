from __future__ import annotations

import asyncio
import os
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Context
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

from whisperlab.db import Base
from whisperlab.models.experiment import Experiment
from whisperlab.models.trace import Trace
from whisperlab.models.attack import Attack
from whisperlab.models.target import Target
from whisperlab.models.report import Report

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def do_run_migrations(connection: Context) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    async with connectable.connect() as connection:
        do_run_migrations(connection)
    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    context.configure(url=config.get_main_option("sqlalchemy.url"))
else:
    run_migrations_online()
