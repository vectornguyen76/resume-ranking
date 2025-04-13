# Use a base image for building the dependencies
FROM python:3.10-slim AS builder

WORKDIR /app

# Update the package lists and install dependencies in a single RUN command
RUN apt-get update && \
    apt-get install -y curl gcc python3-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# Upgrade pip and install certifi
RUN pip install --upgrade pip certifi

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

# Use a minimal base image for the final stage
FROM python:3.10-slim

WORKDIR /app

# Copy the installed dependencies from the builder stage
COPY --from=builder /usr/local/lib/python3.10 /usr/local/lib/python3.10
COPY --from=builder /usr/local/bin /usr/local/bin

# Set Python environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONIOENCODING=utf-8

COPY . /app

# Chmod to entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Run entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
