#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json

import chipwhisperer as cw


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Detect NewAE devices and optionally open a real scope connection."
    )
    parser.add_argument(
        "--connect",
        action="store_true",
        help="Open and close a scope connection after listing devices.",
    )
    args = parser.parse_args()

    devices = cw.list_devices()
    print(json.dumps(devices, indent=2, default=str))
    if not devices:
        print("No NewAE USB device detected.")
        return 2
    if not args.connect:
        return 0

    scope = cw.scope()
    try:
        print(f"Connected: {scope.get_name()} · serial {scope.sn}")
        print(f"Firmware: {scope.fw_version_str}")
    finally:
        scope.dis()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
