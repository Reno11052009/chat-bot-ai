# 🤖 AI ChatBot

A modern, full-stack AI chat application built with **Next.js 16**, **Vercel AI SDK v7**, and **Better Auth**. Switch seamlessly between multiple AI providers — Google Gemini, OpenAI GPT, and OpenRouter — in a single beautiful interface.

---

## ✨ Features

- 🧠 **Multi-model support** — Google Gemini 3.x, OpenAI GPT-4o/4.1, Meta Llama 4 via OpenRouter
- 🔄 **Live model switching** — Change AI model mid-conversation from the header dropdown
- 💬 **Persistent chat history** — Conversations saved to PostgreSQL and listed in the sidebar
- 📎 **File & image attachments** — Upload and send images or documents alongside messages
- 📝 **Export to Markdown** — Download any conversation as a `.md` file
- 🌗 **Dark / Light / System theme** — Powered by `next-themes`
- 🔐 **Authentication** — Email/password login via Better Auth
- 👤 **Profile page** — User info, chat stats, and sign-out
- ⚙️ **Settings page** — Theme selection and default model preference
- 📊 **Admin dashboard** — Platform-wide stats (users, conversations, messages)
- 🚀 **Streaming responses** — Real-time token streaming with AI SDK v7

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| AI SDK | [Vercel AI SDK v7](https://sdk.vercel.ai) |
| Auth | [Better Auth](https://better-auth.com) |
| Database | PostgreSQL via [Prisma 7](https://prisma.io) |
| Styling | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com) |
| UI Icons | [Lucide React](https://lucide.dev) |
| AI Providers | Google Gemini · OpenAI · OpenRouter |

---

## 🤖 Supported Models

### Google (via `@ai-sdk/google`)
- `gemini-3.5-flash` — Fastest, default model
- `gemini-3.1-pro` — Advanced reasoning & coding
- `gemini-3.1-flash-lite` — Lightweight, low-latency

### OpenAI (via `@ai-sdk/openai`)
- `gpt-4o` — Flagship model
- `gpt-4o-mini` — Fast & cost-effective
- `gpt-4.1` — Latest GPT generation

### OpenRouter (via `@openrouter/ai-sdk-provider`)
- `meta-llama/llama-4-maverick` — Free tier available

---

## 🚀 Getting Started

### 1. Clone & install dependencies

```bash
git clone <your-repo-url>
cd chat_bot_ai
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/chat_bot_ai"

# AI API Keys
OPENAI_API_KEY="sk-..."
GOOGLE_GENERATIVE_AI_API_KEY="AI..."
OPENROUTER_API_KEY="sk-or-v1-..."

# Better Auth
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
```

**Get your API keys:**
- Google Gemini → [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- OpenAI → [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- OpenRouter → [openrouter.ai/keys](https://openrouter.ai/keys)

### 3. Set up the database

```bash
npx prisma migrate dev
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & Register pages
│   ├── api/
│   │   ├── chat/        # AI streaming endpoint
│   │   └── upload/      # File upload endpoint
│   ├── chat/            # Chat page (new & existing conversations)
│   ├── dashboard/       # Admin dashboard
│   ├── profile/         # User profile page
│   └── settings/        # App settings (theme, default model)
├── components/
│   ├── chat/
│   │   ├── chat-interface.tsx   # Main chat UI
│   │   ├── chat-message.tsx     # Message bubble
│   │   └── model-selector.tsx   # Model picker dropdown
│   ├── layout/
│   │   └── sidebar.tsx          # Conversation sidebar
│   ├── profile/
│   │   └── profile-client.tsx
│   └── settings/
│       └── settings-client.tsx
├── actions/
│   └── chat.ts          # Server actions (CRUD conversations)
└── lib/
    ├── auth.ts           # Better Auth config
    ├── auth-client.ts    # Client-side auth helpers
    └── prisma.ts         # Prisma client
```

---

## 🗄 Database Schema

Key models:

- **User** — Auth & profile data
- **Conversation** — Chat sessions with title, folder, archive/favorite flags
- **Message** — Individual messages with role, model, token count
- **Attachment** — Uploaded files linked to messages
- **Billing** — Per-user token quota tracking

---

## 📜 Scripts

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npx prisma studio  # Open Prisma DB browser
```

---

## 🚢 Deployment

Deploy to [Vercel](https://vercel.com) with one click:

1. Push to GitHub
2. Import project on Vercel
3. Add all environment variables in the Vercel dashboard
4. Deploy — Vercel auto-detects Next.js

> Make sure to provision a PostgreSQL database (e.g., [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/storage/postgres)) and run `prisma migrate deploy` before launching.
