# Project Folder Structure & Architectural Guidelines

This document serves as the primary context for AI assistants (like Cursor) to understand the project's architecture, folder structure, and coding conventions. Please adhere strictly to these guidelines when generating or refactoring code.

## 📂 Directory Tree

```
project-root/
├── .husky/                 # Git hooks (pre-commit for ESLint/Prettier enforcement)
├── docs/                   # Additional project documentation
│   └── FOLDER_STRUCTURE.md # This file (AI context guide)
├── public/                 # Static assets (images, icons)
├── src/                    # Main application source code
│   ├── app/                # Next.js App Router (Pages, API Routes / Controllers)
│   │   ├── api/            # API endpoints (e.g., /api/chat, /api/upload)
│   │   ├── chat/           # Chat interface page
│   │   ├── upload/         # File upload interface page
│   │   ├── login/          # Authentication page
│   │   ├── globals.css     # Global stylesheet
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable, modular UI components (React)
│   ├── config/             # Configuration files
│   │   └── env.ts          # Zod schema for fail-fast environment variable validation
│   ├── lib/                # 3rd-party library wrappers and external connections
│   │   ├── db/             # Database connection and schema definitions (SQLite)
│   │   └── vector/         # Vector database client and RAG operations (Chroma DB)
│   ├── services/           # Core business logic
│   └── utils/              # Pure helper functions (formatting, calculation, etc.)
├── AI_JOURNAL.md           # Tracking journal for AI usage sessions
├── DECISIONS.md            # Log of key architectural decisions
├── README.md               # Main project setup and overview
├── docker-compose.yml      # Multi-container orchestration (Next.js + Chroma DB)
├── package.json            # Dependencies and scripts
```

## 🏗️ Architectural Rules & Conventions for AI

When writing or modifying code for this project, the AI must follow these core principles:

### 1. Separation of Concerns (No God Files):

- Files in src/app/ (Pages and API Routes) must act ONLY as controllers. They should handle HTTP requests/responses, routing, and basic validation.
- All heavy lifting, data processing, and business logic MUST be extracted and placed into appropriate functions within `src/services/`.

### 2. The `lib/` vs `utils/` Distinction:

- Use `src/lib/` exclusively for wrapping third-party services, database connections (SQLite), and Vector DB clients (Chroma DB).
- Use `src/utils/` exclusively for pure, side-effect-free helper functions (e.g., date parsing, string manipulation).

### 3. Fail-Fast Environment Validation:

- Any new environment variable (`process.env.XXX`) must be added to the Zod schema in `src/config/env.ts`.
- The application relies on this file to validate configurations at boot time to prevent silent failures.

### 4. Code Quality & Consistency:

- Ensure all code conforms to strict TypeScript typing. Do not use any unless absolutely necessary and explicitly commented.
- The project utilizes Prettier and ESLint, enforced via Husky pre-commit hooks. Generated code must be clean, properly formatted, and use relative/absolute imports consistently as per the existing project config.

### 5. AI SDK Integration:

- For chat features and streaming responses, prioritize using the ai (Vercel AI SDK) package.
- Token usage metrics must be extracted from the SDK's response metadata and passed to the relevant service for database logging.
