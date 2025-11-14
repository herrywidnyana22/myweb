# 🧠 Herry Widnyana — AI-Powered Portfolio (Next.js + Gemini + Google Sheets)

> 🚀 **Personal Portfolio & Chat Assistant**, built with **Next.js 15**, **Google Gemini 2.5 Flash**, and **Google Sheets** as dynamic CMS.  
> Visitors can chat directly with “Herry” — a conversational AI that dynamically reads real portfolio data.

---

## ✨ Overview

This project is a **Next.js full-stack portfolio** enhanced with an **AI Chat System** powered by Gemini.  
All portfolio data (projects, education, experience, etc.) are stored in **Google Sheets**, fetched via custom APIs, and then interpreted by the AI — giving **real-time, context-aware answers** about your profile.

### 💬 Example Interaction

> **User:** “Apa proyek terbaru kamu?”  
> **AI (Herry):**  
> Hai! Proyek terbaru saya adalah **AI Portfolio Chat**, dibangun dengan **Next.js**, **Gemini 2.5 Flash**, dan **Google Sheets**.  
> Kamu bisa lihat detailnya di bagian project!

---

## 🧩 Core Features

| Feature                              | Description                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------- |
| 🧠 **Gemini 2.5 Flash Integration**  | Smart, context-aware responses with JSON-structured output                      |
| 📊 **Google Sheets as Headless CMS** | Dynamic data source for profile, projects, and experience                       |
| 💬 **Chat System with Memory**       | Remembers chat history using localStorage                                       |
| 🎨 **Responsive UI**                 | Fully adaptive for mobile, MacBook, and large screens                           |
| 🧊 **Dynamic Dock Widgets**          | macOS-style dock to open widgets (Chat, Projects, Contact, etc.)                |
| 💡 **Highlight AI Responses**        | Important data points (name, role, contact) are automatically color-highlighted |
| 🔒 **Secure Prompt Rules**           | Strict prompt formatting, safe JSON-only output                                 |
| 🧰 **Clean Tailwind v4 Setup**       | Custom CSS variables with design tokens and color palettes                      |

---

## 🧠 Tech Stack

| Layer                     | Technology                                         |
| ------------------------- | -------------------------------------------------- |
| **Frontend**              | Next.js 15 (App Router), React 19, TypeScript      |
| **Styling**               | Tailwind CSS v4 + custom theme (`:root` variables) |
| **AI Engine**             | Google Gemini 2.5 Flash (`@google/genai`)          |
| **Data Source**           | Google Sheets API (via custom `fetchData`)    |
| **UI Components**         | Framer Motion, Swiper, Shadcn/UI                   |
| **Hosting (recommended)** | Vercel or Cloudflare Pages                         |

---

🧡 Author
Gede Herry Widnyana
💼 Fullstack Developer • Denpasar, Bali
