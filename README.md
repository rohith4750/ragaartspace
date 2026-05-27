# Raaga Artspace 🎨✨

A modern spiritual art e-commerce platform built with Next.js, TypeScript, PostgreSQL, Prisma, Tailwind CSS, Zustand, and TanStack Query.

Raaga Artspace allows customers to explore mindful artworks, place orders online, and experience soulful digital art in a peaceful modern UI.

---

## 🌿 Project Vision

Raaga Artspace is designed as a calm digital sanctuary where users can:
- Explore spiritual artworks
- View handmade canvas paintings
- Order custom art
- Make online payments (simulated Razorpay)
- Track orders

Admins can:
- Upload artworks (locally stored image files)
- Manage customer orders
- Track revenue and metrics
- Control inventory levels
- View real-time analytics

---

## 🖼 Artwork Example

The platform supports artworks like:
- **Shiva Canvas Art** (Minimalist representation of Lord Shiva)
- **Sacred Mandala** (Symmetrical pattern drawings)
- **Lotus Harmony Zen Painting** (Watercolor lotus landscape)
- **Mindful Meditation Line Art** (Meditation abstract figure)

Customers can browse artworks visually and place orders directly from the website.

---

## 🚀 Tech Stack

- **Frontend**: Next.js (App Router, Server Components & Client Leaf Nodes), TypeScript, Tailwind CSS v4, Lucide Icons, Framer Motion (drawer physics)
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL (via Prisma ORM)
- **State Management**: Zustand (cart persistence)
- **Server State Sync**: TanStack Query (caching catalog & stats)
- **Authentication**: NextAuth.js (secured Credentials Provider with hashed passwords via bcrypt)

---

## 🌟 Main Features

### 👩🎨 Admin Features
- ✅ **Upload Artwork Images**: File input with loading indicators and upload image previews.
- ✅ **Manage Artworks**: Full catalog listing with prices, categories, dimensions, and delete/update buttons.
- ✅ **Orders Dashboard**: Control panel displaying customer contact information, billing totals, and active delivery pipelines.
- ✅ **Revenue Analytics**: Live counters for total sales, active listings, customer count, and low-stock indicators.
- ✅ **Order/Payment Status Tracking**: Edit order tracking milestones (Pending -> Processing -> Shipped -> Delivered) and payment confirmation.

### 🛍 Customer Features
- ✅ **Explore Art Gallery**: Calm modern storefront showing catalog items.
- ✅ **Search & Filters**: Live search input and filter chips (All, Spiritual, Mandala, Zen, Minimalist).
- ✅ **View Artwork Details**: Detailed server-side rendered pages for maximum SEO benefit.
- ✅ **Add to Cart**: Integrated sliding cart drawer managing variable quantities and stock limits.
- ✅ **Place Orders & Simulate Razorpay Payments**: Secure mock checkout gateway collecting address/phone details.
- ✅ **Order Tracking Page**: Graphical shipment timeline reflecting real-time admin dashboard changes.
- ✅ **Mobile Responsive UI**: Styled layouts with fluid beige/cream colors and Outifit typography.

---

## 🗂 Project Architecture

```
Customer Opens Website
          ↓
Next.js Frontend (Vercel)
          ↓
Artwork Images (Cloudinary)
          ↓
Orders Stored (Neon PostgreSQL)
          ↓
Payments (Razorpay)
```

---

## 📂 Folder Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analytics/          # Admin stats compiler
│   │   ├── artworks/           # GET/POST catalog routes
│   │   │   └── [id]/           # PUT/DELETE artwork routes
│   │   ├── auth/               # NextAuth routing setup
│   │   ├── orders/             # GET/POST orders
│   │   │   └── [id]/           # PUT tracking status
│   │   └── upload/             # Local multipart image uploader
│   │
│   ├── artworks/
│   │   └── [id]/               # Server-rendered detail page
│   ├── checkout/               # Secure shipping checkout form
│   ├── dashboard/              # Protected admin control center
│   │   ├── artworks/           # Catalog management
│   │   ├── login/              # Admin auth screen
│   │   └── orders/             # Shipment tracking controls
│   │
│   ├── page.tsx                # Client storefront gallery
│   ├── layout.tsx              # Font configs, providers & root template
│   └── globals.css             # Tailwind v4 variables & custom animations
│
├── components/
│   ├── gallery/
│   │   ├── ArtCard.tsx         # Catalog card
│   │   └── CartDrawer.tsx      # Slide-out basket panel
│   ├── layouts/
│   │   ├── Footer.tsx          # Mindful footer
│   │   └── Navbar.tsx          # Shared navbar header
│   └── providers/
│       ├── AuthProvider.tsx    # NextAuth container
│       └── QueryProvider.tsx   # React Query container
│
├── lib/
│   └── prisma.ts               # Singleton database connector
├── store/
│   └── useCart.ts              # Zustand cart state store
├── types/
│   └── index.ts                # TypeScript declarations
└── middleware.ts               # Protected route guard
```

---

## 🗄 PostgreSQL Database Schema

Mapped inside `prisma/schema.prisma`:

### User Table
Represents admin users allowed to manipulate inventories.
```sql
CREATE TABLE User (
  id String PRIMARY KEY,
  name String,
  email String UNIQUE,
  password String, -- Bcrypt hash
  role String DEFAULT 'ADMIN',
  createdAt DateTime DEFAULT NOW()
);
```

### Artwork Table
Represents individual spiritual works available in the store.
```sql
CREATE TABLE Artwork (
  id String PRIMARY KEY,
  title String,
  description String,
  price Double,
  category String,
  imageUrl String,
  stock Int,
  dimensions String,
  createdAt DateTime DEFAULT NOW()
);
```

### Order Table
Represents checkout records placed by customers.
```sql
CREATE TABLE Order (
  id String PRIMARY KEY,
  customerName String,
  email String,
  phone String,
  address String,
  quantity Int,
  amount Double,
  paymentStatus String,
  orderStatus String,
  createdAt DateTime DEFAULT NOW(),
  artworkId String REFERENCES Artwork(id)
);
```

---

## 🛠 Installation

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/raaga-artspace.git
cd raaga-artspace
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:newpassword@localhost:5432/ragaartspace?schema=public"
NEXTAUTH_SECRET="y0ur_n3xtauth_s3cr3t_v3ry_secr3t_k3y"
NEXTAUTH_URL="https://ragaart.space" # (Use http://localhost:3000 for local development)
RAZORPAY_KEY_ID="rzp_test_mock_raaga_key"
RAZORPAY_SECRET="rzp_test_mock_raaga_secret"
```

### 3. Sync Database & Seed Artworks
Run migrations and seed default catalog with administrator credentials (`admin@raagaartspace.com` / `admin123`):
```bash
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌿 Raaga Artspace
*Art that calms the mind and soothes the soul 🌀🌿🤍*

## 📜 License
MIT License
