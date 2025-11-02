# Build the services
docker compose build

# Run the worker
docker compose up worker

# Run the server (temporal client)
docker compose up app
