# Developer Prompt – Studio Pilot (AI Video Generation App)

## Executive Summary  
Build **Studio Pilot**, a web-based AI video generation platform that allows users to create unlimited videos from text prompts. The app targets content creators and marketers who need bulk video production. Monetisation will use a freemium model: basic features are free, with premium subscription unlocking unlimited generation and high-end features (e.g. API usage, 4K upscaling). Core requirements include seamless prompt input, background processing of AI tasks (video, voice, captions), and a polished UI reflecting the provided screenshots. Payment will be handled via Stripe (using test API keys), integrating subscription plans【8†L7-L10】. The agent prompt below details all functional, UI/UX, technical, DevOps, and testing requirements, sprint deliverables, and explicit acceptance tests. Assumptions (see below) clarify unspecified items such as target users and monetisation.

## Assumptions  
- **Platform:** A responsive web application (desktop-first), with potential mobile view.  
- **Target Users:** Content creators and marketers seeking automated video production.  
- **Monetisation:** Subscription-based licensing (recurring payments via Stripe); we assume no ads or one-time purchase by default.  
- **Third-party Services:** Integration with AI APIs (e.g. ElevenLabs for TTS, RunwayML for models, OpenAI/GPT, etc.), Firebase Cloud Messaging, Google Analytics.  
- **Screenshots & Assets:** The provided PDF contains UI mockups (dashboard, prompt input, settings, license screen) used to infer design.  
- **Data Privacy:** Users’ data stored in the EU (GDPR/CCPA compliance required).  

## Project Overview  
The **purpose** of Studio Pilot is to automate AI-powered video creation. Users enter text prompts or scripts, and the system generates videos (including voiceover, captions, background music) using multiple AI services. It should offer project management (save/download videos), voice customization, and batch processing (bulk upscaling/generation). Key features derived from the materials include: automatic video download, AI voice (ElevenLabs) integration, auto-captioning, script-to-video pipeline, bulk upscaling and image generation, and automated session management (auto-relogin, cookie clearing).  

**Target users** are marketing professionals and hobbyist video creators wanting on-demand AI video generation. **Monetisation**: we assume a **subscription model** (monthly/annual plans) with Stripe Billing (which provides APIs to *“create and manage subscriptions, invoices, and recurring payments”*【8†L7-L10】). A free trial or freemium tier may exist, gating advanced features.  

## Functional Requirements  
- **User Authentication:** Users can register, login, logout. Passwords are hashed (e.g. bcrypt), sessions managed via secure cookies or JWT.  
- **Dashboard & Projects:** After login, user sees a dashboard of **Projects** (video generation jobs). They can create a new project or view past ones. (Ref: Screenshot shows "Recent Projects").  
- **Video Generation Workflow:** As a user, I can:  
  - **Create Project:** Enter a *text prompt* (and optional settings) to generate a video. Input validation: prompt non-empty, length limits (e.g. ≤1000 chars).  
  - **Choose Voice/Settings:** Select voice model (ElevenLabs premium voices) and other options (style, speed). (UI: “AI Voice Generator” screen).  
  - **Start Generation:** Initiating a request triggers backend calls to AI services (e.g. OpenAI/GPT for script, RunwayML for video frames, ElevenLabs for audio). While processing, show a progress indicator.  
  - **Download Video:** Once ready, the app auto-downloads or provides a link to the video file.  
  - **Bulk Tasks:** Perform batch actions like 4K upscaling for multiple videos, and bulk image generation (per feature list).  
- **Subscriptions & Payments:**  
  - **Subscription Plans:** Users must subscribe or enter a license key to unlock premium features (unlimited generation, high-res output).  
  - **Stripe Integration:** Use Stripe Checkout API. On payment, create subscription and store customer ID. Handle webhooks for payment success/failure. (Backend endpoints for `/create-checkout-session`, `/webhook`).  
  - **License Verification:** On login or at app start, verify active subscription (see license screen). If expired or invalid, restrict access and prompt renewal.  
- **Auto-Relogin & Session:** Implement auto re-login and session refresh for long-running jobs (as per “Auto Re-Login” feature). Ensure cookie management and auto logout/in as needed.  
- **Error Cases & Edge Conditions:**  
  - Invalid input (empty prompt) should display inline validation errors.  
  - If AI service fails or times out, show an error and allow retry.  
  - If Stripe payment fails, handle declined card gracefully.  
  - If user exceeds free-tier limits, show upgrade prompt.  
  - Protect against duplicate requests (disable buttons while waiting).  
- **Data Validation:** All inputs validated server-side (e.g. REST schema validation). Enforce authentication on protected endpoints.  
- **Analytics & Events:** Track key events: user signup/login, project creation, video generation success/failure, payment completed. Use Google Analytics (or privacy-first alternative) to measure usage【17†L125-L128】. For example, log an event on each video generated and when payment is successful.  

```mermaid
flowchart TB
    A[User] --> B{Authenticated?}
    B -- No --> C[Login/Register Page]
    B -- Yes --> D[Dashboard (Project List)]
    D --> E[New Video Project]
    E --> F[Enter Prompt & Settings]
    F --> G[Initiate Generation (API Call)]
    G --> H[Video Generation in Progress]
    H --> I{Subscription Active?}
    I -- No --> J[Payment Page (Stripe Checkout)]
    I -- Yes --> K[Process with AI Services]
    J --> K
    K --> L[Video Generated]
    L --> M[Display/Download Video]
    M --> N[Option: New Project or Logout]
```

## UI/UX Specifications  
Map UI components from the screenshots to design:  
- **Dashboard (Projects List):** A page showing existing video projects. Each item shows status (Pending, Completed, Failed) and actions (view, download). (Screenshot “Recent Projects”.)  
- **Prompt Input Screen:** A form with a large text area (“Paste Prompts”) for user input, and buttons to submit. (Screenshot suggests a text box for prompts.)  
- **Voice/Settings Page:** Options to select AI voice (ElevenLabs) with presets (e.g. “Home studio scene”, “Clone Reels Dubbing”). Include sliders or dropdowns for pitch/speed.  
- **Progress Screen:** Indicate generation progress (spinner or progress bar).  
- **Settings/Config:** A page to enter API keys for Gemini or other services (as shown). Possibly an admin/settings panel.  
- **License Screen:** A modal or page asking for license key or subscription if not active (as in final screenshot).  
- **Responsive Breakpoints:** Design should adapt from mobile (<600px) to tablet (600–900px) to desktop (>900px). For example, collapse sidebars into menus on small screens, stack content vertically on mobile.  
- **Accessibility (WCAG 2.1 AA):** Follow W3C guidelines for contrast, text alternatives, and focus order【13†L45-L53】. All form fields have labels, buttons have ARIA labels if needed, and color usage meets contrast ratios. Keyboard navigation should be fully supported.  
- **Animations & Micro-interactions:** Add subtle transitions (e.g. fading in generated video, animating button presses). Show a spinner or skeleton UI during loading. Buttons change style on hover/active. Audio playback controls should be clear (e.g. play/pause).  
- **Asset List:** Use SVG icons (e.g. Font Awesome or Material Icons) for UI elements (play, pause, download, settings). Use a modern sans-serif font (e.g. Inter or Roboto) for readability. Background images (if any) in high-resolution JPEG/PNG with <2 MB file size. Export graphical assets at 1x and 2x (retina). Provide sizes (e.g. 1920x1080 for hero images, 64x64 or 128x128 for icons).  

## Technical Architecture  
Recommend a **JavaScript-centric stack** for agility: a React-based frontend with a Node.js backend. For example, **Next.js** for the frontend (fast SSR/SSG) and **Node.js/Express** or NestJS for the API. **PostgreSQL** or **MongoDB** for the database. Authentication via JWT/OAuth and payment via **Stripe**【8†L7-L10】. Third-party integrations include ElevenLabs (TTS), generative AI APIs (OpenAI or Stable Diffusion), Firebase Cloud Messaging for push notifications (FCM is *“a cross-platform messaging solution”*【15†L713-L722】), and Google Analytics for tracking【17†L125-L128】. Host on AWS (EC2/ECS) or Vercel/DigitalOcean, using Docker containers and CI/CD pipelines (GitHub Actions).  

**API Contracts & Data Models:** Design RESTful endpoints. Example:  
- `POST /api/auth/register` – user registration.  
- `POST /api/auth/login` – login returns JWT.  
- `GET /api/projects` – list user’s projects.  
- `POST /api/projects` – create new project (body: prompt, settings).  
- `GET /api/projects/{id}` – project details (status, result URL).  
- `POST /api/stripe/checkout` – create Stripe checkout session.  
- `POST /api/stripe/webhook` – handle Stripe event callbacks.  
Data models:  
- **User:** id, email, hashedPassword, subscriptionStatus, createdAt.  
- **Project:** id, userId, promptText, status (Pending/Complete/Failed), videoUrl, createdAt, updatedAt.  
- **Subscription/Payment:** id, userId, stripeCustomerId, stripeSubscriptionId, status, startDate, endDate.  

**Third-Party Integrations:**  
- **Stripe** for payments (use official Node library【8†L7-L10】).  
- **ElevenLabs API** for text-to-speech (store API key in secrets).  
- **AI Services:** Connect to text/image/video generation APIs (Stable Diffusion, RunwayML). Abstract these behind service interfaces.  
- **Push Notifications:** Use FCM to send generation complete notifications (Firebase’s *“reliable”* messaging)【15†L713-L722】.  
- **Analytics:** Google Analytics 4 (GA4) or privacy-friendly Matomo for event tracking (millions of sites use GA【17†L125-L128】).  

**Scalability & Security:** The backend should be stateless to allow horizontal scaling (via AWS ECS or Kubernetes). Use load balancers and a CDN (AWS CloudFront) for static assets. Secure all endpoints with HTTPS and input sanitisation (prevent injection). Follow OWASP guidelines. Use rate-limiting on sensitive endpoints. Store secrets (API keys, DB credentials) in environment variables or a secrets manager. Backup the database daily (e.g. automated PostgreSQL dump to S3, retention ≥30 days).  

```mermaid
flowchart LR
    subgraph Client
      A[Web Frontend (React/Next.js)]
    end
    A -->|HTTP API| B[Backend Server (Node.js/Express)]
    B --> C[(Database: PostgreSQL)]
    B -->|Stripe API| D[(Stripe)]
    B -->|AI Service API| E[(AI Providers)]
    B -->|Notifications| F[(Firebase Cloud Messaging)]
    A -->|Google Analytics| G[(Analytics)]
```

## Tech Stack Options Comparison  

| Stack Option              | Pros                                                                                                                                   | Cons                                                                                                                                                 | Cost & Maintenance                                                             |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| **MERN (React + Node + MongoDB)**    | Unified JS stack; large ecosystem; easy REST/API calls【21†L375-L382】. Fast I/O (Node) for real-time tasks【24†L149-L154】.            | Requires separate DB server; Node’s single-threaded model may need clustering under heavy load. Requires manual scaling.                               | Low startup cost; hosting (AWS EC2) charges per instance. Ongoing: moderate (self-manage servers, backups). |
| **Next.js + Firebase**    | Serverless-friendly; built-in hosting (Vercel/Firebase) and real-time DB; Firebase Authentication + FCM integration; minimal backend code. | Vendor lock-in (Firebase). No relational DB (Firestore is NoSQL). Can become expensive at high usage (pay-as-you-go).                                   | Minimal ops overhead. Free tier exists, but costs grow with users (Firestore reads, writes).              |
| **React + Django + PostgreSQL** | Batteries-included framework (admin, auth, ORM) enables rapid development【24†L177-L185】. Strong security features (CSRF, SQLi protection)【24†L197-L202】.    | Learning curve for Python/Django. Requires separate frontend integration (CORS/REST). Hosting similar to Node.                                        | Similar to MERN. Usually slightly higher dev time, but Django’s stability can reduce maintenance effort.  |

## Non-Functional Requirements  
- **Performance:** API response <500ms for simple queries. Video generation is asynchronous, but UI should poll status <5s. App should handle ≥100 concurrent users (scale via load balancer).  
- **Uptime/SLA:** Aim for 99.9% uptime. Self-monitoring with alerts (e.g. Pingdom/Healthchecks).  
- **Logging & Monitoring:** Implement structured logging (Winston/ELK or CloudWatch). Use error tracking (Sentry). Record key metrics (CPU/memory) and set up alerts on anomalies.  
- **Backup & Recovery:** Daily database backups to off-site storage. A recovery checklist should exist to restore data within 24 hours.  
- **Security Compliance:** Data encryption in transit (HTTPS) and at rest. Comply with GDPR/CCPA: allow user data deletion, store minimal personal data. Use Stripe’s PCI-compliant flow【8†L7-L10】.  
- **Testing Strategy:**  
  - **Unit Tests:** For all business logic and API endpoints (e.g. Jest for Node or pytest for Python).  
  - **Integration Tests:** Verify end-to-end flows (e.g. login → create project → generate video).  
  - **E2E Tests:** Use Cypress or Playwright on the UI (login flow, payment checkout).  
  - Aim for ≥80% test coverage.  
  - **Security Testing:** Static code analysis (ESLint/Prettier rules), vulnerability scanning of dependencies.  
- **Performance Testing:** Simulate load (e.g. 1000 video requests) to ensure system scales.  
- **Deployment Readiness:**  All tests must pass in CI before merge. Code linted/formatted (ESLint + Prettier).  

## Deliverables & Milestones  
Organise work in 2-week sprints:  
- **Sprint 1:** Project setup (repo, Docker), user auth, basic frontend routing. Acceptance: users can register/login, and see a blank dashboard.  
- **Sprint 2:** Project management and prompt input UI. Implement project CRUD (create, view, list). Acceptance: user can create a project with a prompt, and see it listed.  
- **Sprint 3:** AI integration core. Hook up video generation service. Acceptance: after submitting a prompt, backend calls AI APIs (mocked) and user eventually receives a video link.  
- **Sprint 4:** Voice, captions, background music features. Acceptance: user can select a voice and get audio, captions are generated alongside video.  
- **Sprint 5:** Payment integration. Set up Stripe checkout and subscription logic. Acceptance: user can subscribe via Stripe; after payment, `subscriptionStatus` updates and premium features unlock.  
- **Sprint 6:** UI polish & QA. Add loading animations, responsive CSS, accessibility fixes. Acceptance: all pages meet WCAG 2.1 AA; app works on desktop and mobile.  

**Definition of Done:** For each story, “Done” means code merged with passing tests, no critical bugs, and documentation updated. Pull Requests require code review (1–2 reviewers) and lint tests passing. Code must follow standards (ESLint for JS, flake8 for Python, etc.).  

## Testing & QA  
- **Test Cases:** Document scenarios: e.g. “User logs in with valid/invalid credentials”, “Generate video from sample prompt ‘A mountain landscape’ returns a playable video file.” Include negative cases (empty prompt, unsubscribed user trying to generate).  
- **Test Data:** Provide sample prompts (simple and complex) and corresponding expected outcomes (e.g. video file length >0, audio track present). Use placeholder API keys for external services.  
- **Automated Coverage:** Ensure backend and frontend tests cover major flows (≥80%). For UI, include tests for each component (forms, buttons).  
- **Manual QA Checklist:** Verify on Chrome, Firefox, Safari, and mobile screens. Check form validations, network failure recovery, correct saving of projects, and Stripe flows (using Stripe test card 4242...). Validate that alt text is present on images, and that all buttons are reachable via keyboard.  

## DevOps & Deployment  
- **Containers:** Use Docker for consistency. Provide Dockerfiles for frontend and backend, and a `docker-compose.yml` for local dev.  
- **Kubernetes:** For production, recommend Kubernetes on AWS EKS or similar, with Helm charts or Terraform scripts.  
- **Environment Management:** Store environment variables (API keys, DB URI) outside code. Use `.env` files for local (example templates in repo) and secret managers (AWS Secrets Manager) for prod.  
- **CI/CD Pipeline:** Configure GitHub Actions (or GitLab CI) to run tests/lint on PRs. On merge to main, run deployment to staging automatically. Upon tagging a release, deploy to production.  
- **Staging vs Production:** Use separate environments with identical setup. Migrate DB schema automatically (e.g. Sequelize/TypeORM migrations or Django migrations) on deploy.  
- **Rollback Plan:** Maintain previous container images/tags. On failure of new release, automatically roll back to last stable version. Health checks (HTTP 200) before marking a rollout successful.  

## Handover & Documentation  
- **README:** Provide a template with sections: Project overview, setup instructions (`npm install`, DB init), running tests, and troubleshooting.  
- **API Docs:** Use OpenAPI/Swagger to document all endpoints. Include example requests/responses and authentication requirements. Host docs at `/docs`.  
- **Runbook:** Create guides for devops tasks (e.g. how to restart services, check logs, restore backups). Include a troubleshooting section (common errors and fixes).  
- **Onboarding Notes:** Summarise architecture (diagram), key tech choices, and a list of team roles/contacts. Include a “Getting Started” section for new developers.  

## Tech Stack Options Comparison  
To aid decision-making, evaluate a few stack choices (see table below). Each stack must support subscriptions, AI integrations, and scale as the user base grows. Focus on official/enterprise-backed technologies where possible.

```mermaid
flowchart LR
    subgraph Architecture
      A[React Frontend (JSX Components)]
      B[Node.js Backend (Express/Nest)]
      C[(Database: PostgreSQL / MongoDB)]
      D[(Stripe Billing)]
      E[(AI Services APIs)]
      F[(Firebase Cloud Messaging)]
      A --> B
      B --> C
      B --> D
      B --> E
      A --> F
    end
```

## Prompt for Coding Agent

**Context:** Build _Studio Pilot_, an AI-powered video generation web app. The app uses provided product details (see PDF) and UI screenshots to implement features. The user flow is: authenticate → create/generate video → download. Subscriptions unlock premium features. The development environment is JavaScript/Node. Key assets: product spec, UI mockups (from provided PDF).  

**Tasks:**  
1. **Authentication Module:** Implement `/register` and `/login` API endpoints with JWT. Frontend: create signup/login forms.  
2. **Dashboard & Projects:** Create frontend pages for listing and creating projects. Backend: `GET /api/projects`, `POST /api/projects`. Store prompt and status in DB.  
3. **Video Generation:** Integrate a mock AI service initially (e.g. stub function). Implement `/api/projects/{id}/generate` that updates project status to “Processing” then “Completed” with a dummy video URL.  
4. **Voice & Captions:** Add option to select an AI voice. Backend: simulate calling ElevenLabs API. Generate dummy captions text. Save audio/caption data in the project.  
5. **Stripe Payments:** Use Stripe test keys (see env placeholders below). Add `/api/stripe/checkout` and webhook handler. On successful payment, mark user as subscribed. Frontend: create a “Subscribe” button that opens Stripe Checkout.  
6. **Responsive UI:** Apply CSS for responsive design (mobile, tablet, desktop). Ensure form elements have labels and meet WCAG 2.1 AA (contrast, focus, alt-text)【13†L45-L53】.  
7. **Assets & Styling:** Use SVG icons and Google Fonts. Optimize images for web. Implement micro-interactions (button hover, loading spinners).  
8. **Analytics & Notifications:** Integrate Google Analytics (or Matomo) to track events (project created, video completed). Use Firebase Cloud Messaging to simulate push notifications when a video is ready.  

**Priorities:**  
- **High:** User auth, project creation, video generation logic, Stripe checkout.  
- **Medium:** Voice selection, captions, analytics, accessibility improvements.  
- **Low:** CSS animations, extra models (Nanobanana), documentation comments.  

**Constraints:**  
- Use **Node.js (v18+)** for backend and **React** (with Next.js or CRA) for frontend.  
- All secrets (Stripe keys, API keys) must be loaded from environment variables. Do *not* hardcode.  
- The app must run in Docker. Provide Dockerfiles.  
- Follow ES2018+ standards. Use ESLint and Prettier for JS code style.  
- Host on Linux (AWS/Linux containers). Ensure code is case-sensitive safe.  

**Expected File Structure:**  
```
/studio-pilot
├── backend/                      # Express/Nest server
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── app.js
│   ├── .env.example
│   └── Dockerfile
├── frontend/                     # React app (or Next.js)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   ├── public/
│   └── Dockerfile
├── docker-compose.yml            # For local dev
└── README.md
```

**Commands to Run (local):**  
```bash
# Backend
cd backend
npm install
npm run dev     # starts server on localhost:3001
# Frontend
cd frontend
npm install
npm run dev     # starts app on localhost:3000
# (Alternatively use docker-compose up for combined setup)
```

**Environment Variables (sample):**  
```
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
ELEVENLABS_API_KEY=elevenlabs_api_key_here
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
JWT_SECRET=some_secret_key
```

**Acceptance Tests:**  
- *User Authentication:* When using valid credentials, `/login` returns a JWT. Invalid credentials return 401. (Test with Postman or integration test).  
- *Create Project:* Given a logged-in user, POST `/api/projects` with `{ prompt: "test" }` should return 201 and a project object. GET `/api/projects` should list it.  
- *Generate Video:* Trigger video generation for a project. The project’s status should change to “Completed” and `videoUrl` should be a valid URL (can be a dummy for now).  
- *Subscription Enforcement:* A non-subscribed user trying to access a premium endpoint (like bulk upscaling) should receive a 402 Payment Required (or redirect to Stripe checkout). After calling `/api/stripe/checkout` and simulating a successful payment event, the user’s `subscriptionStatus` should be active and premium features unlocked.  
- *Responsive Layout:* Resize the browser width; verify the navigation menu collapses on small screens and the layout remains usable on mobile (through browser dev tools).  
- *Accessibility:* All images have `alt` attributes. Color contrast between text and background is ≥4.5:1. All interactive elements are reachable via keyboard (tab navigation). (Can use aXe or Lighthouse audit).  

Ensure all tests pass before marking tasks done. Use placeholder API responses where needed (e.g. mock AI outputs). Include comments/instructions in code where manual steps (like obtaining real API keys) would go.