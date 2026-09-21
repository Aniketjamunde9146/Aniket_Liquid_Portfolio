# Aniket_Liquid_Portfolio

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00D1B2?style=for-the-badge&logo=netlify&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## Description

**Aniket_Liquid_Portfolio** is a modern, high-performance personal portfolio application built with [Next.js](https://nextjs.org/), TypeScript, and Tailwind CSS. It delivers a fluid, animation-rich user experience powered by GSAP and Framer Motion, with secure backend integration via Supabase and email communication through EmailJS. The project also incorporates AI-driven capabilities using the Groq SDK for intelligent interactions.

Designed for developers and creatives who want a polished, production-ready portfolio, this repository provides a complete foundation for building a standout online presence with smooth transitions, responsive design, and full-stack functionality.

---

## Features

- 🚀 **Next.js + TypeScript** — Type-safe, optimized React framework with server-side rendering and static generation
- 🎨 **Tailwind CSS** — Utility-first styling for rapid, responsive UI development
- ✨ **Framer Motion** — Smooth, declarative animations for engaging UI transitions
- 🌊 **GSAP** — Professional-grade scroll animations and timeline-based effects
- 🔐 **Supabase Integration** — Authentication, database, and storage backend with SSR support
- 📧 **EmailJS** — Client-side email sending without a backend server
- 🤖 **Groq SDK** — AI-powered interactions for intelligent portfolio features
- 📱 **Fully Responsive** — Mobile-first design across all screen sizes
- ⚡ **Optimized Performance** — Minimal bundle size with efficient dependency management
- 🛠️ **Code Quality** — ESLint + TypeScript strict mode for maintainable code

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.17 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Aniketjamunde9146/Aniket_Liquid_Portfolio.git
   cd Aniket_Liquid_Portfolio
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory and add the following:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   EMAILJS_SERVICE_ID=your_emailjs_service_id
   EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Usage

### Development

Start the local development server with hot reloading:

```bash
npm run dev
```

### Build for Production

Create an optimized production build:

```bash
npm run build
```

### Start Production Server

Run the production build locally:

```bash
npm run start
```

### Linting

Run ESLint to check for
