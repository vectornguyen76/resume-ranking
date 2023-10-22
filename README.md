# Set up develop Backend
- docker compose -f docker-compose-dev.yml build frontend_service
- docker compose -f docker-compose-dev.yml up -d

Backend
- unzip data_faq.zip
- flask reset-db
- flask init-qdrant-db
- flask run

http://localhost:3000/dashboard/private-chat

