# 🧠 Bible API — RAG Backend

Node.js/Express/TypeScript REST API that powers BibleAI using Retrieval-Augmented Generation (RAG).

## Architecture

```
User Question
     │
     ▼
Intent Classification (regex + LLM)
     │
     ▼
Semantic Search (pgvector cosine similarity)
     │
     ▼
Keyword Fallback (PostgreSQL full-text)
     │
     ▼
Cross-Reference Expansion
     │
     ▼
LLM Answer Generation (GPT-4o / Claude 3.5 Sonnet)
     │
     ▼
SSE Streaming Response with Citations
```

## Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/api/chat` | Streaming Bible chat (SSE) |
| `GET` | `/api/versions` | List all Bible versions |
| `GET` | `/api/search` | Semantic + keyword search |
| `GET` | `/api/verse/:version/:book/:chapter/:verse` | Direct verse lookup |
| `GET` | `/api/compare` | Side-by-side version comparison |
| `GET` | `/api/topics` | List all topics |
| `GET` | `/api/topics/:name/verses` | Verses by topic |
| `GET` | `/api/daily` | Verse of the day |
| `GET` | `/api/bookmarks` | User bookmarks (auth required) |
| `POST` | `/api/bookmarks` | Save bookmark (auth required) |
| `DELETE` | `/api/bookmarks/:verseId` | Remove bookmark (auth required) |

## Chat Request Example

```bash
curl -N -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What does the Bible say about love?",
    "versions": ["KJV"],
    "format": "devotional"
  }'
```

Response is SSE stream:
```
event: token
data: {"token":"Love"}

event: token
data: {"token":" is..."}

event: citations
data: {"citations":[{"reference":"1 Corinthians 13:4","text":"Charity suffereth long...","version":"KJV"}]}

event: done
data: {"sessionId":"uuid","messageId":"uuid"}
```

## Development

```bash
cp .env.example .env
npm install
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | required |
| `OPENAI_API_KEY` | OpenAI API key | required |
| `ANTHROPIC_API_KEY` | Anthropic API key | optional |
| `LLM_PROVIDER` | `openai` or `anthropic` | `openai` |
| `OPENAI_MODEL` | OpenAI model name | `gpt-4o` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | Shared JWT secret (same as auth service) | required |
| `PORT` | Server port | `5000` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

## Build & Run

```bash
npm run build
npm start
```
