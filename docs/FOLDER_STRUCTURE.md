# Project Folder Structure & Architectural Guidelines

This document serves as the primary context for AI assistants (like Cursor) to understand the project's architecture, folder structure, and coding conventions. Please adhere strictly to these guidelines when generating or refactoring code.

## 📂 Directory Tree

```text
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
│   ├── lib/                # SERVER-ONLY: 3rd-party wrappers and infrastructure
│   │   ├── db/             # Database connection and schema definitions (SQLite)
│   │   └── vector/         # Vector database client and RAG operations (Chroma DB)
│   ├── services/           # Core business logic
│   └── shared/             # ISOMORPHIC: Modules safe for BOTH Client and Server
│       ├── components/     # Reusable, modular UI components (React)
│       ├── config/         # Configuration files (e.g., env.ts)
│       ├── utils/          # Pure helper functions (formatting, calculation, etc.)
│       └── validation/     # Zod schemas for runtime validation and DTOs
├── AI_JOURNAL.md           # Tracking journal for AI usage sessions
├── DECISIONS.md            # Log of key architectural decisions
├── README.md               # Main project setup and overview
├── docker-compose.yml      # Multi-container orchestration (Next.js + Chroma DB)
├── package.json            # Dependencies and scripts
```

## 🏗️ Architectural Rules & Conventions for AI

When writing or modifying code for this project, the AI must follow these core principles:

### 1. Separation of Concerns (No God Files):

- Files in `src/app/` (Pages and API Routes) must act ONLY as controllers. They should handle HTTP requests/responses, routing, and basic validation.
- All heavy lifting, data processing, and business logic MUST be extracted and placed into appropriate functions within `src/services/`.

### 2. The shared/ vs lib/ Distinction (Strict Boundary):

- Use `src/shared/` for code that is safe to be executed on both Client and Server (e.g., UI components, Zod validation schemas, pure utility functions).
- Use `src/lib/` exclusively for Server-Only infrastructure, such as wrapping third-party services, database connections (SQLite), and Vector DB clients (Chroma DB). Never import from `lib/` into a Client Component.

### 3. Fail-Fast Environment Validation:

- Any new environment variable (`process.env.XXX`) must be added to the Zod schema in `src/shared/config/env.ts`.
- The application relies on this file to validate configurations at boot time to prevent silent failures.

### 4. Code Quality & Consistency:

- Ensure all code conforms to strict TypeScript typing. Do not use any unless absolutely necessary and explicitly commented (prefer unknown and type narrowing).
- The project utilizes Prettier and ESLint, enforced via Husky pre-commit hooks. Generated code must be clean, properly formatted, and use the @shared/\* absolute import alias consistently.

### 5. AI SDK Integration:

- For chat features and streaming responses, prioritize using the ai (Vercel AI SDK) package.
- Token usage metrics must be extracted from the SDK's response metadata (onFinish callback) and passed to the relevant repository for database logging.
