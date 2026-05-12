# 🏺 HAMPISTAYS — MASTER TECHNICAL & DESIGN REPORT
## Platform State: Production-Ready (Phase 6 Finalized)
## Date: May 12, 2026

---

## 1. 🏰 FULL PROJECT OVERVIEW
**HampiStays** is a high-fidelity, luxury-focused hospitality marketplace dedicated exclusively to the UNESCO World Heritage site of Hampi, Karnataka.

### 🏨 Business Model & Vision
*   **Platform Identity**: A "Digital Boutique Concierge" bridging premium hospitality with deep heritage storytelling.
*   **Target Audience**: High-net-worth travelers, heritage enthusiasts, and international explorers seeking curated, high-end experiences.
*   **Unique Selling Proposition (USP)**:
    *   **Cinematic Immersion**: A design language that prioritizes visual storytelling over raw data.
    *   **Heritage Integration**: Deep mapping of resorts to Hampi’s historical geography.
    *   **Unified Dual-Role Ecosystem**: Seamless transitions between Traveler, Owner, and Expert personas.

### 💰 Monetization Strategy
*   **Commission Model**: A performance-based fee structure (7% standard / 10% peak season) applied to confirmed bookings.
*   **Service Tiers**: Future integration for featured listings and "Expert Verified" certifications.

---

## 2. 🛠️ COMPLETE TECHNOLOGY STACK ANALYSIS
HampiStays utilizes a modern, decoupled **MERN-variant** architecture optimized for speed, security, and high visual fidelity.

### 🎨 Frontend Technologies
*   **React 18**: Utilizing functional components, Hooks, and the Context API for state management.
*   **Vite**: Primary build tool and dev server, providing lightning-fast HMR and optimized production bundles.
*   **Tailwind CSS v4**: Implementing a "Design Token" approach via the new `@theme` configuration.
*   **Framer Motion**: Powering all cinematic page transitions, reveal animations, and floating UI effects.
*   **Lucide React**: Providing a sharp, minimalist icon set.
*   **React Router v6**: Handling complex role-based routing and protected navigation.

### ⚙️ Backend Technologies
*   **Node.js & Express.js**: The core API engine handling business logic and external integrations.
*   **Prisma ORM**: Providing a type-safe interface to the PostgreSQL database.
*   **JWT (JSON Web Tokens)**: Managing stateless, secure user sessions.
*   **bcryptjs**: Implementing 12-round salt hashing for all password storage.

### 🗄️ Database
*   **PostgreSQL**: Relational database chosen for its robustness in handling complex booking transactions.
*   **Prisma Migrations**: Ensuring schema versioning is handled through code (Infrastructure as Code).

### 🔌 Third-Party Integrations
*   **Razorpay**: Primary financial gateway for INR transactions.
*   **Cloudinary**: Image hosting, dynamic resizing, and CDN-based delivery.
*   **Google OAuth**: Social authentication for frictionless user onboarding.

---

## 3. 🖥️ FULL FRONTEND ANALYSIS
The frontend is built on a **Modular Atomic Architecture**, ensuring that UI components are reusable and logic is decoupled from styling.

### 📂 Folder Structure
*   `src/components/layout`: Global elements like `Navbar`, `Footer`, and `MobileDock`.
*   `src/components/ui`: Atomic-level reusable components (Buttons, Inputs, Modals).
*   `src/pages/owner`: Complex business logic pages for property management.
*   `src/pages/public`: High-fidelity discovery and storytelling pages.

### 🛣️ Route Hierarchy
*   **Public**: Landing, Resorts, Discovery Map, Our Story.
*   **Traveler**: Profile, Wishlist, Booking History, Checkout.
*   **Owner**: Dashboard, Resort Setup (Wizard), Inventory Management.
*   **Admin**: Platform Stats, Resort Verification, User Moderation.

---

## 4. 🎨 UI/UX & DESIGN SYSTEM DOCUMENTATION
HampiStays uses the **"Sandstone Luxury"** design system, defined by fluid typography and high-contrast cinematic colors.

### 🎨 Design Tokens
*   **Primary Navy**: `#0B1736` (The base for cinematic immersion).
*   **Luxury Gold**: `#C8A96B` (Used for premium accents and CTAs).
*   **Sandstone**: `#F6F1E8` (A warm, heritage-inspired surface color).
*   **Typography**: 
    *   **Serif**: `Cormorant Garamond` (Heritage, History, Elegance).
    *   **Sans**: `Inter` / `Manrope` (Precision, Readability, Modernity).

### ✨ Interaction Patterns
*   **Reveal Animations**: Section-by-section fade and slide reveals using Framer Motion.
*   **Glassmorphism**: 70% opacity with `backdrop-blur-xl` used on navigation and overlay elements.
*   **Fluid Typography**: CSS `clamp()` functions used to ensure headlines scale perfectly across all devices.

---

## 5. 🛡️ COMPLETE BACKEND ANALYSIS
The backend is a **Secure RESTful API** designed with strict validation and role-based protection.

### 🏗️ Architecture
*   **Controller Layer**: Separates business logic (e.g., `bookingController.js`) from route definitions.
*   **Middleware Pipeline**: Every request passes through authentication and authorization filters.
*   **Security Headers**: `Helmet.js` configuration to prevent common web vulnerabilities.

### 🔑 Critical Flows
*   **Payment Verification**: Uses HMAC-SHA256 signature verification to ensure payment integrity.
*   **Booking Integrity**: Backend recalculates all prices based on database state before initiating payment orders.
*   **Role-Based Access**: Uses a `Role` enum in Prisma to gate specific API endpoints.

---

## 6. 🗄️ DATABASE & PRISMA DOCUMENTATION
The database schema is designed for high relational integrity.

### 📊 Model Summary
*   **`User`**: Linked to `Booking`, `Review`, `ResortOwner`, and `GuideProfile`.
*   **`Resort`**: The central entity, containing room types, meal packages, and amenities.
*   **`Booking`**: Junction table for Users and Resorts, tracking status from `PENDING` to `COMPLETED`.
*   **`StaffMember`**: Allows multi-user management of a single resort.

---

## 7. 🏩 OWNER & ADMIN DASHBOARDS
### 🏩 Owner Dashboard
*   **Resort Setup**: A 7-step progressive wizard with image compression and document upload simulation.
*   **Inventory Control**: Dynamic room blocking and seasonal price overrides.

### 👮‍♂️ Admin Dashboard
*   **Platform Health**: Real-time stats for revenue, user growth, and resort counts.
*   **Verification Engine**: A dedicated UI for approving or rejecting new resort listings.

---

## 8. 🚀 INFRASTRUCTURE & PERFORMANCE
*   **Deployment**: Optimized for Railway (Server/DB) and Vercel (Frontend).
*   **Performance**:
    *   **GPU Acceleration**: Uses CSS `transform: translateZ(0)` for buttery smooth scrolling.
    *   **Lazy Loading**: Components are split to reduce initial bundle weight.
    *   **Image Handling**: Cloudinary CDN used for adaptive image serving based on device screen size.

---

## 9. 🛡️ SECURITY AUDIT
*   **Password Security**: bcrypt with 12 salt rounds.
*   **Session Security**: JWT tokens with 7-day expiry and stateless verification.
*   **Cross-Origin**: Strict CORS origin whitelisting for production domains.
*   **Data Integrity**: Atomic Prisma transactions used for all multi-table updates (e.g., creating a user + owner profile).

---

## 10. 📝 FINAL EVALUATION
**HampiStays** is a production-grade hospitality platform. Its strongest asset is the **unmatched visual fidelity** and the **robustness of the booking/payment engine**. The platform is fully prepared for a commercial launch in the Hampi region.
