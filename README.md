# Eduiqsovereigneditioneduiq-sovereign/
├── .env.local.example
├── package.json
├── next.config.js
├── middleware.ts
├── app/
│   ├── layout.tsx
│   ├── page.tsx                          ← Login / magic link
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts                  ← Supabase SSR callback
│   ├── dashboard/
│   │   ├── layout.tsx                    ← Role-based shell
│   │   ├── page.tsx                      ← Role router
│   │   ├── educator/
│   │   │   └── page.tsx                  ← Educator dashboard
│   │   ├── parent/
│   │   │   └── page.tsx                  ← Parent/guardian portal
│   │   └── admin/
│   │       └── page.tsx                  ← Tribal admin command center
│   └── api/
│       ├── auth/
│       │   └── send-magic-link/
│       │       └── route.ts
│       ├── students/
│       │   └── route.ts                  ← GET/POST students
│       ├── observations/
│       │   └── route.ts                  ← Log behavioral/academic/attendance
│       ├── alerts/
│       │   └── route.ts                  ← Trigger SMS + in-app alerts
│       └── ai-insight/
│           └── route.ts                  ← Sovereign Prompt Shield + Anthropic
├── components/
│   ├── EarlyWarningScore.tsx
│   ├── StudentCard.tsx
│   ├── AlertBadge.tsx
│   ├── RoleNav.tsx
│   ├── ObservationForm.tsx
│   └── SovereignPromptShield.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── twilio.ts
│   └── resend.ts
└── supabase/
    └── migrations/
        └── 001_eduiq_sovereign.sql
