"""Desktop GUI application for teaching IC hardware-security concepts.

This package hosts a PySide6 application that walks a learner through
PUF (Physical Unclonable Function) enrollment/reproduction, PUF quality
metrics, and Hardware Root of Trust boot-chain verification -- all
built on top of the same ``whisperlab.services`` layer the FastAPI
backend uses, so it can talk to real ChipWhisperer hardware when it is
attached and falls back to a clearly labelled simulated mode otherwise.
"""
