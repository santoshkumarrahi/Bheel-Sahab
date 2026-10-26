# Santosh Kumar Bheel - Animated Full-Stack Portfolio & Creative Studio

A modern, fully animated, full-stack personal portfolio and client operations platform built for **Santosh Kumar Bheel** (Graphic Designer | Frontend Developer | Backend Developer).

## Features

- **Personal Brand & Editorial Design**: Refined dark canvas (`#090b10`), clean typographic hierarchy (`Outfit`, `Plus Jakarta Sans`, `JetBrains Mono`), 3-zone Top Bar Contract, zero-pill metadata discipline, and authentic portrait presentation (`/public/assets/aistudio/Santosh_Profile_Image_814470b2.png`).
- **Interactive Hero Section**: Animated dynamic role cycle (Graphic Designer, Frontend Developer, Backend Developer, UI/UX Specialist, Full-Stack Engineer), direct booking CTAs, social channels, and full-width 4-column KPI strip.
- **About Me Section**: Biography, design philosophy, dev approach, current availability badge, and resume download.
- **Specialized Services**: Graphic Design, Frontend Development, Backend Architecture, and Full-Stack Turnkey Solutions with feature breakdowns, starting prices, and turnaround.
- **Portfolio & Case Studies Showcase**:
  - Filter by discipline (Graphic Design, Branding, Social Media, Frontend, Backend, Full-Stack).
  - Autoplaying featured project carousel with touch gestures, play/pause, and pagination.
  - Interactive Before & After redesign comparison slider with drag handle.
  - In-depth Project Detail modal with high-res multi-image gallery, challenge, solution, and measurable business metrics.
- **Skills & Technologies**: Categorized technical proficiency bars (Design, Frontend, Backend, Tools) with experience levels.
- **Work Process**: 6-phase visual methodology from Discovery to Final Delivery.
- **Experience & Education**: Timeline of career engagements and academic credentials.
- **Client Testimonials**: Star-rated reviews with interactive carousel controls.
- **Online Meeting & Video Conferencing**:
  - 15-min Discovery, 30-min Scoping, and 60-min Architecture Consultations.
  - Real-time double-booking prevention based on date and time slots.
  - Google Meet, WhatsApp direct chat with prefilled message, and custom video meeting URL.
  - Instant confirmation card with direct link and appointment details.
- **Client Contact & Proposal Inquiries**: Validated form with budget, deadline, service type, and rate-limiting spam protection.
- **Secure Administrator Dashboard (`/admin` or `#admin`)**:
  - Secure JWT authentication and bcrypt password hashing.
  - Overview metrics (Total projects, inquiries, bookings, unread counts).
  - Full CRUD for Homepage content, Projects, Services, Skills, and Site Settings.
  - Inquiry inbox: update status (`new`, `read`, `replied`, `archived`) and delete.
  - Meeting schedule manager: update status, launch room link, cancel.
  - Central Media Library: upload assets (images/videos/PDFs), preview, copy URL, and delete.
  - Site Settings: edit bio, headline, subtext, working hours, and update admin password.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`), Lucide React.
- **Backend**: Node.js, Express 4, Multer (file storage), JWT (`jsonwebtoken`), `bcryptjs`.
- **Database**: Persistent relational schema with atomic disk writes in `/data/database.json`.
- **Build & Dev**: Vite 8, `tsx`.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run in Development**:
   ```bash
   npm run dev
   ```
   The Express server boots on `http://localhost:3000` and mounts Vite middlewares in dev mode.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Start Production Server**:
   ```bash
   npm start
   ```

## Initial Admin Credentials

- **URL**: Navigate to `#admin` or click **Admin** in the header or footer.
- **Username / Email**: `admin` or `rahisantoshkumar843@gmail.com`
- **Default Password**: `admin12345` (Prompted to change in Site Settings on first login).
