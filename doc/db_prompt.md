You are setting up MongoDB database connection using Mongoose in a Next.js (App Router) project with TypeScript.

---

# 🧠 GOAL

Create a clean, production-ready MongoDB connection system that:

- Connects to MongoDB using Mongoose
- Prevents multiple connections in development (hot reload safe)
- Uses environment variables
- Is reusable across API routes
- Supports Next.js App Router (server-side only)

---

# ⚙️ REQUIREMENTS

## 1. Environment Variables

Use:
MONGODB_URI=your_mongodb_connection_string

---

## 2. Create DB Connection File

Create:
/lib/dbConnect.ts

Features:
- Singleton pattern (avoid multiple connections)
- Reuse existing connection if already connected
- Handle connection errors properly
- Log connection status in development

---

## 3. Mongoose Setup Rules

- Use mongoose
- Do NOT reconnect on every request
- Ensure global caching for Next.js hot reload

---

## 4. Example Structure

dbConnect.ts should:
- Import mongoose
- Create global cached connection variable
- Connect using mongoose.connect()
- Return cached connection

---

## 5. Usage Pattern

Every API route should use:

import dbConnect from "@/lib/dbConnect";

await dbConnect();

before accessing models.

---

## 6. Models Folder

Create:
/models

Prepare structure for:
- Category
- ProblemType
- Problem
- Comment
- Review

(Only define folder structure, not full schemas yet)

---

## 7. IMPORTANT RULES

- No frontend code here
- No business logic
- Only database connection layer
- Must be safe for serverless Next.js environment
- Must avoid duplicate connections in development

---

# 🎯 OUTPUT EXPECTATION

Generate:
1. /lib/dbConnect.ts (fully working)
2. /models folder structure setup
3. Example usage in API route

Keep code clean, scalable, and production ready.