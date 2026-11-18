import type { SiteContent } from "@portfolio/shared";

/**
 * ✏️  Edit this file with your real details.
 * Everything on the site (and all SEO metadata) is derived from it.
 * Later this can be swapped for a fetch from the backend API.
 */
export const content: SiteContent = {
  profile: {
    name: "Florenz De Jesus",
    avatar: "/profile.jpg",
    role: "Backend Software Engineer",
    roles: ["Backend Software Engineer", "Full-Stack Developer", "Problem Solver"],
    tagline:
      "Software engineer building fast, reliable, and well-crafted products for the web.",
    about: [
      "Hi, I'm Florenz! I'm a **backend software engineer at Manulife Philippines**, where I help products and services talk to each other across **microservices**.",
      "I've loved building software since college. At the University of Makati, I spent most of my free time learning **full-stack development** and taking on **freelance projects**. I graduated **Magna Cum Laude** and was recognized as the **Most Promising Application Developer**.",
      "These days I work in whatever way gets the job done well, whether that's writing code from scratch or **vibe coding with AI tools**.",
    ],
    location: "Philippines",
    timeZone: "Asia/Manila",
    email: "dejesusflorenz8@gmail.com",
    availableForWork: true,
    stats: [
      { label: "Years of experience", value: 3, suffix: "+" },
      // The two below are filled in from the content at the bottom of this file
    ],
    socials: [
      { label: "GitHub", url: "https://github.com/iamflorenz08", handle: "@iamflorenz08" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/florenz-de-jesus/", handle: "in/florenz-de-jesus" },
    ],
  },
  experience: [
    {
      company: "Manulife Philippines",
      companyUrl: "https://www.manulife.com.ph",
      role: "Backend Software Engineer",
      start: "2025-09",
      summary: "Building the backend integrations that connect Manulife's products and services.",
      highlights: [
        "Leading the backend work for a health insurance product project.",
        "Shipped transactional Net Promoter Score (tNPS) to production, supporting Manulife's digitalization efforts.",
        "Unified health checks across microservices into a shared setup, replacing per-service declarations.",
        "Migrated data from one database to another.",
        "Investigated and fixed production bugs across integrated services.",
      ],
    },
    {
      company: "Jeremiah 2911 Corporation",
      role: "Mid-Level Web Developer",
      start: "2024-11",
      end: "2025-06",
      highlights: [
        "Built a ticketing system that lets the company track tasks per individual, group, and department.",
        "Digitalized the manpower request form and its approval workflow.",
        "Built the backend authentication.",
        "Set up a CI/CD pipeline using GitHub Actions.",
      ],
    },
    {
      company: "My Dream Visa LLC",
      role: "Software Engineer",
      start: "2024-02",
      end: "2024-10",
      highlights: [
        "Streamlined the marriage green card application process.",
        "Improved navigation across the application forms.",
        "Refined the template questions.",
        "Mapped applicant answers to the matching fields on the immigration forms.",
        "Added an in-app PDF viewer.",
        "Integrated a third-party support chat.",
      ],
    },
  ],
  projects: [
    {
      slug: "boxpos-backoffice",
      title: "Box POS PH Backoffice",
      description:
        "Web back office for Box POS PH, a point-of-sale system for retail stores — owners track sales and profit, manage the catalog, inventory and purchasing, and set up tax for the offline-first Android tills that sync to it.",
      stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "shadcn/ui", "Recharts", "React Router", "SWR", "Better Auth", "Fastify", "PostgreSQL", "Drizzle ORM"],
      image: "/projects/boxpos-backoffice/dashboard.webp",
      gallery: [
        { src: "/projects/boxpos-backoffice/dashboard.webp", alt: "Dashboard with net sales chart, profit breakdown, top products and category mix" },
        { src: "/projects/boxpos-backoffice/receipts.webp", alt: "Receipts list grouped by day with status filters for completed, refunded and voided sales" },
        { src: "/projects/boxpos-backoffice/products.webp", alt: "Product catalog with price, average cost, margin and stock levels" },
        { src: "/projects/boxpos-backoffice/new-product.webp", alt: "New product form with pricing, SKU and barcode, variants and a live till preview" },
        { src: "/projects/boxpos-backoffice/inventory.webp", alt: "Inventory with stock value at cost, on-hand quantities and stock adjustments" },
        { src: "/projects/boxpos-backoffice/purchase-orders.webp", alt: "Purchase orders with open value, incoming and overdue summaries and receiving progress" },
        { src: "/projects/boxpos-backoffice/tax.webp", alt: "Tax settings with VAT-inclusive or add-at-checkout pricing and a live price preview" },
      ],
      highlights: [
        "Sales dashboard with gross and net sales, profit after cost of goods and cash over/short, top products and category mix",
        "Receipts across every register, filterable by register, cashier and status, including partial refunds and voids",
        "Product catalog with simple items, variants and bundles, margins, CSV import/export and barcode scanning",
        "Inventory tracking with stock value at cost, restock alerts, adjustments, transfers and counts",
        "Purchasing flow from purchase orders through receiving, supplier returns and supplier invoices",
        "VAT setup for tax-inclusive or tax-added pricing, picked up by every till on its next sync",
        "Promotions and price lists, cashier shift cash management and period close",
        "Multi-store with role-based access for employees and cashiers",
      ],
      featured: true,
      year: 2026,
    },
    {
      slug: "boxpos-mobile",
      title: "Box POS PH Mobile",
      description:
        "Offline-first Android till for Box POS PH — cashiers switch in with a PIN, ring up sales, take cash, run their shift and handle refunds, with everything stored on the device and synced to the back office when there's a connection.",
      stack: ["React Native", "Expo", "TypeScript", "Expo Router", "NativeWind", "Reanimated", "Expo SQLite", "Better Auth", "Kotlin"],
      image: "/projects/boxpos-mobile/cart.webp",
      gallery: [
        { src: "/projects/boxpos-mobile/cart.webp", alt: "Register with product grid, stock status and the current order with discounts, hold and charge" },
        { src: "/projects/boxpos-mobile/pin.webp", alt: "PIN pad for a cashier to switch in on the register" },
        { src: "/projects/boxpos-mobile/register.webp", alt: "Register home with item search, barcode scanner and sync status" },
        { src: "/projects/boxpos-mobile/quantity.webp", alt: "Quantity picker when adding a product to the cart" },
        { src: "/projects/boxpos-mobile/checkout.webp", alt: "Cash checkout with quick tender amounts, keypad and change due" },
        { src: "/projects/boxpos-mobile/shift.webp", alt: "Shift screen with expected cash in drawer, cash in/out and shift reports" },
        { src: "/projects/boxpos-mobile/receipts.webp", alt: "Receipts rung up on this till, searchable by receipt number" },
        { src: "/projects/boxpos-mobile/refund.webp", alt: "Refund sheet for picking items to return with a reason, working offline" },
      ],
      highlights: [
        "Offline-first: catalog, sales, receipts and shifts live in SQLite, with an outbox that syncs to the back office when back online",
        "Cashier switching with a 6-digit PIN that also works offline",
        "Product grid and category browsing with search, camera barcode scanning and live stock status",
        "Cart with item and order discounts, held orders, and cash checkout with quick tender and change due",
        "Shift management with opening float, cash in/out, expected drawer amount and count-and-close",
        "Receipt history with partial refunds and voids, both available offline",
        "Bluetooth receipt printing and cash drawer kick through a custom native module",
        "Signed APK releases via GitHub Actions with in-app update prompts and forced minimum versions",
      ],
      featured: true,
      year: 2026,
    },
    {
      slug: "lucky-savers",
      title: "Lucky Savers",
      description:
        "Live B2B grocery storefront for businesses in Metro Manila — product catalogue with filters and search, cart, checkout and order tracking, plus an admin dashboard for orders, users and content.",
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "HeroUI", "Fastify", "MongoDB", "Better Auth"],
      url: "https://theluckysavers.com",
      image: "/projects/lucky-savers/storefront.webp",
      gallery: [
        { src: "/projects/lucky-savers/storefront.webp", alt: "Storefront with promo banner, category filters and product grid" },
        { src: "/projects/lucky-savers/login.webp", alt: "Login page with email/password and Google sign-in" },
        { src: "/projects/lucky-savers/orders.webp", alt: "Order tracking with pending, confirmed, delivery and completed tabs" },
        { src: "/projects/lucky-savers/settings.webp", alt: "Account settings with profile, password and linked accounts" },
      ],
      highlights: [
        "Product catalogue with category filters, stock toggle, search and price sorting",
        "Cart, checkout and order tracking across pending, confirmed, delivery and completed stages",
        "Email/password and Google sign-in with protected routes and role-based admin access",
        "Admin dashboard for managing orders, users and storefront content",
        "Philippine address picker (province, city, barangay) for delivery details",
        "Favorites and in-app notifications",
      ],
      featured: true,
      year: 2024,
    },
    {
      slug: "lucky-savers-backoffice",
      title: "Lucky Savers Backoffice",
      description:
        "Internal order-management dashboard for the Lucky Savers storefront — staff track sales and orders, work through assigned fulfilment tasks, and manage delivery coverage and storefront banners.",
      stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "HeroUI", "Recharts", "React Router", "SWR", "Better Auth", "Fastify", "MongoDB", "AWS S3"],
      image: "/projects/lucky-savers-backoffice/dashboard.webp",
      gallery: [
        { src: "/projects/lucky-savers-backoffice/dashboard.webp", alt: "Dashboard with sales KPIs, hourly sales and orders charts, and recent orders" },
        { src: "/projects/lucky-savers-backoffice/orders.webp", alt: "Orders list with search and status tabs for pending, confirmed, logistic, completed and cancelled" },
        { src: "/projects/lucky-savers-backoffice/order-details.webp", alt: "Order details with customer info, progress tracker and editable line items" },
        { src: "/projects/lucky-savers-backoffice/order-activity.webp", alt: "Order activity tab showing the audit log of staff actions" },
        { src: "/projects/lucky-savers-backoffice/coverage.webp", alt: "Delivery coverage editor toggling provinces, cities and barangays" },
        { src: "/projects/lucky-savers-backoffice/banners.webp", alt: "Banner manager with drag-to-reorder slides uploaded to S3" },
      ],
      highlights: [
        "Sales dashboard with actual vs projected gross sales and hourly, daily, monthly and yearly charts",
        "Order pipeline from pending to confirmed, out for delivery and completed, with search and status tabs",
        "Staff task queue for assigned pick-up and delivery orders with dispatch and complete actions",
        "Real-time staff notifications streamed over Server-Sent Events",
        "Role-based staff management on Better Auth organizations",
        "Editable order items with live stock levels, plus an audit log of every staff action",
        "Delivery coverage control down to the barangay level",
        "Drag-to-reorder banner slider management with uploads to S3",
      ],
      featured: true,
      year: 2024,
    },
  ],
  skills: [
    { category: "Languages", items: ["TypeScript", "JavaScript", "Java", "SQL"] },
    { category: "Frontend", items: ["React", "Next.js", "React Native", "Vue", "Nuxt"] },
    { category: "Backend", items: ["Node.js", "Express", "Fastify", "NestJS", "Spring Boot"] },
    { category: "Databases", items: ["PostgreSQL", "MySQL", "MariaDB", "MongoDB", "Firestore", "Redis"] },
    { category: "Cloud", items: ["AWS", "EC2", "Lightsail", "S3", "CloudFront", "Azure", "Azure Service Bus"] },
    { category: "DevOps", items: ["Docker", "Kubernetes", "Linux", "Git", "GitHub Actions", "Jenkins", "Nginx", "CI/CD"] },
    { category: "AI Tools", items: ["ChatGPT", "Claude", "DeepSeek"] },
  ],
};

// Derived from the content above, so they stay accurate as you edit it.
content.profile.stats?.push(
  { label: "Companies worked with", value: content.experience.length },
  {
    label: "Technologies in my toolkit",
    value: content.skills.reduce((n, group) => n + group.items.length, 0),
    suffix: "+",
  },
);
