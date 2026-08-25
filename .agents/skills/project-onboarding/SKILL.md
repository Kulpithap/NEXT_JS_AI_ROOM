---
name: project-onboarding
description: Use this skill when a developer asks how to setup, run, or understand this Next.js project. User for on boading question such as "โปรเจกต์นี้ตั้งค่าอย่างไร","เริ่มยังไง", "ใช้ stack อะไร" from someone new to the codebase.
compatibility: Node.js 22+, npm, Git, MariaDB
license: MIT,
metadata:
  author: Room Innovation
  version: "1.0.0"
---

# Project Onboarding Skill

ช่วย daveloper ใหม่  เข้าใจ  project  ตั้งเเต่ clone  ไปจนถึงรัน  local  ได้

# Setup Step

```
cp .env.example .env
npx prisma generate
npm run lint
npm run dev
```

# Output format

- ภาพรวมสั้นๆ
- ตารางขั้นตอนการ setup
- คำสั่งที่ต้องรัน
- ข้อควรระวัง

# Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS + shadcn/u
- Prisma ORM + MariaDB
- better-auth สำหรับ authentication
- Zustand สำหรับ state management ฝั่ง client

# Gotchas

- หลัง npm install ควรรัน npx prisma generate