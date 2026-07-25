"""JupyterHub config: DockerSpawner-per-user, NativeAuthenticator, idle culling.

Architecture (docker-compose.yml):
  end user -> cloudflared tunnel -> jupyterhub (this container, port 8000)
                                        |
                              (via /var/run/docker.sock)
                                        |
                        dynamically spawns one container per user,
                        each running the `whisperlab-jupyter-user` image
                        (built from ../jupyter/Dockerfile), capped at
                        DOCKERSPAWNER_MEM_LIMIT / DOCKERSPAWNER_CPU_LIMIT.
"""

import os

c = get_config()  # noqa: F821 -- injected by jupyterhub at runtime

# -- Spawner: one Docker container per logged-in user -----------------------
c.JupyterHub.spawner_class = "dockerspawner.DockerSpawner"

# Image spawned per user. Build it from jupyter/Dockerfile and tag it to
# match (see docker-compose.yml's `jupyterhub-user-image` build step).
c.DockerSpawner.image = os.environ.get(
    "DOCKERSPAWNER_IMAGE", "whisperlab-jupyter-user:latest"
)

# Shared Docker network so the Hub container can reach spawned user containers
# by name, and user containers can reach the Hub's API.
c.DockerSpawner.network_name = os.environ.get("DOCKERSPAWNER_NETWORK", "lab-network")
c.DockerSpawner.use_internal_ip = True

# -- Resource limits per user (the whole point of DockerSpawner here) -------
# Per the user's sizing: ~100MB Hub + ~150MB FastAPI + up to 1GB/user notebook
# container, on a 2-4GB host. Override via env if the host has more headroom.
c.DockerSpawner.mem_limit = os.environ.get("DOCKERSPAWNER_MEM_LIMIT", "1G")
c.DockerSpawner.cpu_limit = float(os.environ.get("DOCKERSPAWNER_CPU_LIMIT", "1.0"))

# -- Persistence: one named volume per user, mounted at their home dir ------
notebook_dir = "/home/jovyan/jupyter"
c.DockerSpawner.notebook_dir = notebook_dir
c.DockerSpawner.volumes = {"jupyterhub-user-{username}": notebook_dir}

# -- Authentication -----------------------------------------------------
# NativeAuthenticator: self-contained signup/login, no host system users
# required (unlike PAMAuthenticator, which doesn't fit a container model).
# First-created account should be promoted to admin via the admin UI, or
# list known admins here:
c.JupyterHub.authenticator_class = "nativeauthenticator.NativeAuthenticator"
# Without this, JupyterHub's default authorization gate rejects everyone even
# after a successful NativeAuthenticator login/admin-approval -- authorization
# is a separate layer on top of authentication.
c.Authenticator.allow_all = True
c.Authenticator.admin_users = set(
    filter(None, os.environ.get("JUPYTERHUB_ADMIN_USERS", "").split(","))
)
# Require an admin to approve new signups before they can log in.
c.NativeAuthenticator.open_signup = os.environ.get(
    "JUPYTERHUB_OPEN_SIGNUP", "false"
).lower() == "true"

# -- Idle culling: free RAM from inactive user containers -------------------
# Reap containers idle > 30 min; the named volume above keeps their notebooks.
c.JupyterHub.services = [
    {
        "name": "idle-culler",
        "admin": True,
        "command": [
            "python3",
            "-m",
            "jupyterhub_idle_culler",
            "--timeout=1800",
        ],
    }
]

# -- Networking ---------------------------------------------------------
c.JupyterHub.ip = "0.0.0.0"
c.JupyterHub.port = 8000
c.JupyterHub.hub_ip = os.environ.get("JUPYTERHUB_HUB_IP", "jupyterhub")

# Behind cloudflared (reverse proxy), so trust forwarded headers.
c.JupyterHub.trust_user_provided_tokens = False
