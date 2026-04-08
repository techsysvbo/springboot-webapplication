# 📖 Bible Data — Ingestion & Embedding Pipeline

Scripts for seeding Bible verse data and generating vector embeddings for semantic search.

## Setup

```bash
cp .env.example .env
npm install
```

## Step 1 — Database Migration

Run this once to create all tables (including pgvector extension):

```bash
npm run generate   # generate Prisma client
npm run migrate    # apply migrations to DB
```

> **Requires pgvector** — use the `pgvector/pgvector:pg15` Docker image or install the extension manually.

## Step 2 — Seed Bible Data

Seeds all 66 Bible books, KJV/ASV/WEB version metadata, 200+ key verses, and topic assignments:

```bash
npm run seed
```

## Step 3 — Generate Embeddings

Generates OpenAI vector embeddings for all verses (required for semantic search):

```bash
npm run embed
```

Dry-run (no API calls, just counts):
```bash
npm run embed:dry-run
```

> **Cost estimate**: ~31,000 KJV verses × $0.00002/1K tokens ≈ **~$0.02** for full KJV embedding.

## Schema Overview

| Table | Purpose |
|---|---|
| `bible_versions` | Version metadata (KJV, ASV, WEB, NIV...) |
| `bible_books` | 66 books with OT/NT, chapter counts |
| `bible_verses` | All verse text by version |
| `bible_embeddings` | pgvector(1536) embeddings per verse |
| `verse_references` | Cross-references between verses |
| `bible_topics` | Topic categories (Salvation, Love, etc.) |
| `verse_topics` | Many-to-many verse↔topic |
| `chat_sessions` | User conversation sessions |
| `chat_messages` | Individual chat messages |
| `user_bookmarks` | User-saved verses |

## Adding More Bible Versions

For public domain versions (30+ available), use the [scrollmapper/bible_databases](https://github.com/scrollmapper/bible_databases) SQLite files.

For modern versions (NIV, ESV, NASB, etc.), integrate [API.Bible](https://api.bible) — free tier, 2,400+ versions:

```bash
API_BIBLE_KEY=your-key npm run seed -- --version=NIV
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL with pgvector |
| `OPENAI_API_KEY` | For generating embeddings |
| `API_BIBLE_KEY` | For importing API.Bible versions |
