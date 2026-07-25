FROM jupyter/scipy-notebook:latest

USER root
RUN apt-get update && apt-get install -y libusb-1.0-0-dev && rm -rf /var/lib/apt/lists/*

USER ${NB_UID}
RUN pip install --no-cache-dir chipwhisperer jupyterlab
RUN mkdir -p /home/jovyan/jupyter

WORKDIR /home/jovyan/jupyter
EXPOSE 8888

ENV JUPYTER_TOKEN=""

CMD jupyter lab --ip=0.0.0.0 --port=8888 --no-browser --allow-root --NotebookApp.token="${JUPYTER_TOKEN}"
