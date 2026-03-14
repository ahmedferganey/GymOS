# GymOS AI

A production-oriented, project-driven template to learn **Full-Stack AI Engineering** by building one app from end to end.

## Stack
- Frontend: Next.js, React, Tailwind CSS
- Backend: FastAPI, SQLAlchemy, Alembic
- Database: PostgreSQL
- Cache: Redis
- Queue: RabbitMQ
- AI: LLM APIs, RAG, vector search
- Infra: Docker, Kubernetes, AWS
- Monitoring: Prometheus, Grafana

## Included
- Repo structure ready for GitHub
- Dev container and local Docker setup
- Backend skeleton
- Frontend dashboard skeleton
- Database schema starter
- AI module skeleton
- 120 daily issue drafts
- GitHub issue forms
- GitHub Actions CI starter
- Project board CSV for import

## Quick start
```bash
cp .env.example .env
docker compose up --build
```

Backend: `http://localhost:8000/docs`  
Frontend: `http://localhost:3000`

## Recommended GitHub setup
1. Create a new repository from this folder.
2. Push the contents.
3. Import `docs/project-board/github_project_items.csv` into a GitHub Project.
4. Use `scripts/create_github_issues.sh` with GitHub CLI if you want to create the 120 issues automatically.
5. Start moving tasks across Backlog → This Week → In Progress → Review → Done.

## Project phases
1. Backend foundations
2. FastAPI core
3. Database design
4. System design
5. Redis + RabbitMQ
6. Docker + AWS
7. LLM coach
8. RAG assistant
9. Frontend dashboard
10. Monitoring + production hardening
