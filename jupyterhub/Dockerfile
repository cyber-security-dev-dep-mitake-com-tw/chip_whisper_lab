FROM jupyterhub/jupyterhub:5

RUN pip install --no-cache-dir \
    dockerspawner==13.* \
    jupyterhub-nativeauthenticator==1.* \
    jupyterhub-idle-culler==1.*

WORKDIR /srv/jupyterhub

COPY jupyterhub_config.py .

EXPOSE 8000

CMD ["jupyterhub", "-f", "/srv/jupyterhub/jupyterhub_config.py"]
