# PatentOS

Enterprise patent management app built with React on the frontend and FastAPI on the backend.

## Local development

```bash
npm install
npm run dev
```

## API

- `GET /api/health`
- `GET /api/patents`
- `GET /api/patents/{patent_id}`

## Deploy to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the repo into Vercel.
3. Keep the default build command as `npm run build`.
4. Deploy.

The Vercel config serves the React app as a static build and exposes the FastAPI routes under `/api`.
