# 🕊️ BibleAI Chat — Frontend

ChatGPT-style Bible chat application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Streaming chat** — Real-time AI responses with SSE (like ChatGPT)
- **Multi-version support** — KJV, ASV, WEB and more via API.Bible
- **Scripture cards** — Every answer cites exact book:chapter:verse with copyable cards
- **Response formats** — Simple, Devotional, Academic, Deep Study
- **Conversation history** — Sessions saved to localStorage
- **Dark/Light mode** — Reverent navy/gold/cream design
- **Topic chips** — Quick-start suggested Bible questions
- **Mobile responsive** — Full PWA-ready layout

## Development

```bash
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Bible API public URL (browser-side) |
| `BIBLE_API_URL` | Bible API server-side URL (for SSR proxy) |

## Build

```bash
npm run build
npm start
```
