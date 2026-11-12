# BuildTrack — Construction Project Management

A beginner-friendly full-stack starter project:
- Frontend: React + Vite
- Backend: NestJS
- Database: MongoDB (Mongoose)
- API: REST + Axios

## Requirements
- Node.js 20+ (Node 22 LTS recommended)
- npm
- MongoDB running locally, or a MongoDB Atlas connection string

## 1. Start MongoDB
For local MongoDB, make sure the MongoDB service is running. The backend defaults to:
`mongodb://127.0.0.1:27017/buildtrack`

## 2. Start the backend
Open a terminal in `backend`:
```bash
npm install
npm run start:dev
```
Backend: http://localhost:3000
API health check: http://localhost:3000/api/health

## 3. Start the frontend
Open a second terminal in `frontend`:
```bash
npm install
npm run dev
```
Frontend: http://localhost:5173

## 4. Git practice
From the project root (the folder containing both `frontend` and `backend`):
```bash
git init
git add .
git commit -m "Initial BuildTrack application"
git branch -M main
git switch -c dev
```
After creating an empty GitHub repository, connect it and push:
```bash
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin dev
```
Create a feature branch from dev for each task:
```bash
git switch dev
git switch -c feature/add-project-status
```
Make the change, test it, then:
```bash
git add .
git commit -m "Added project status feature"
git push -u origin feature/add-project-status
```
Create a Pull Request on GitHub with base `dev` and compare `feature/add-project-status`.

## Notes
- Run Git commands from the project root, not separately in frontend/backend.
- Keep the frontend and backend servers running in separate VS Code terminals.
- Do not commit real secrets. This starter uses a local MongoDB URL in `backend/.env.example`; copy it to `.env` if you want to customise it.
