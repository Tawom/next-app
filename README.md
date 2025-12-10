# TravelHub - Tour Booking Application

A modern, full-stack tour booking application built with Next.js 15, TypeScript, MongoDB, and NextAuth.js.

## 🚀 Features

### Core Functionality

- **User Authentication** - Secure sign up/sign in with NextAuth.js and bcrypt
- **Tour Browsing** - Explore tours with beautiful cards and detailed pages
- **Advanced Search & Filters** - Search by text, filter by difficulty/price/duration, sort by various criteria
- **Booking System** - Select dates, choose guest count, instant price calculation
- **Booking Management** - View booking history and confirmation details
- **Responsive Design** - Mobile-first approach, works on all devices

### Technical Features

- **Server & Client Components** - Optimized rendering strategy
- **Database Integration** - MongoDB Atlas with Mongoose ODM
- **Image Optimization** - Next.js Image with lazy loading and priority hints
- **SEO Optimized** - Dynamic metadata, sitemap, robots.txt
- **Error Handling** - Custom error boundaries and 404 pages
- **Loading States** - Skeleton loaders for better UX
- **Debounced Search** - Performance optimization for search input
- **TypeScript** - Full type safety throughout the application

## 📦 Tech Stack

- **Framework:** Next.js 15.1.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Authentication:** NextAuth.js v5
- **Password Hashing:** bcryptjs
- **Image Hosting:** Unsplash (tours), DiceBear (avatars)

## 🏗️ Project Structure

```
next-app/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── bookings/      # Booking CRUD operations
│   │   └── tours/         # Tour filtering and search
│   ├── auth/              # Sign in/up pages
│   ├── bookings/          # Booking pages
│   │   ├── [id]/         # Booking confirmation
│   │   └── page.tsx      # My bookings list
│   ├── tours/[id]/        # Dynamic tour detail pages
│   ├── error.tsx          # Global error handler
│   ├── loading.tsx        # Global loading state
│   ├── not-found.tsx      # Custom 404 page
│   ├── robots.ts          # SEO robots.txt
│   └── sitemap.ts         # Dynamic sitemap
├── components/
│   ├── BookingForm.tsx    # Tour booking form
│   ├── Button.tsx         # Reusable button
│   ├── Card.tsx           # Card wrapper
│   ├── DatePicker.tsx     # Date selection
│   ├── ErrorBoundary.tsx  # Error boundary component
│   ├── Header.tsx         # Navigation bar
│   ├── SessionProvider.tsx # NextAuth wrapper
│   ├── TourCard.tsx       # Tour display card
│   ├── TourCardSkeleton.tsx # Loading skeleton
│   └── TourFilters.tsx    # Filter sidebar
├── hooks/
│   └── useDebounce.ts     # Debounce hook
├── lib/
│   ├── mockData.ts        # Sample data
│   └── mongodb.ts         # Database connection
├── models/
│   ├── Booking.ts         # Booking schema
│   ├── Tour.ts            # Tour schema
│   └── User.ts            # User schema
├── scripts/
│   └── seed.mjs           # Database seeder
└── types/
    └── index.ts           # TypeScript interfaces
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd next-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create `.env.local` in the root directory:

   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   ```

4. **Seed the database**

   ```bash
   npm run seed
   ```

5. **Run development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### For Users

1. **Browse Tours**

   - Visit homepage to see all available tours
   - Use search bar to find specific destinations
   - Apply filters (difficulty, price, duration)
   - Sort results by rating, price, or name

2. **Create Account**

   - Click "Sign Up" in header
   - Enter name, email, and password
   - Automatic sign in after registration

3. **Book a Tour**

   - Click any tour card to view details
   - Select departure date from available dates
   - Choose number of guests
   - Review price calculation
   - Click "Book Now" (must be signed in)
   - View confirmation page

4. **Manage Bookings**
   - Click "My Bookings" in header
   - View all past and upcoming bookings
   - Check booking status and details

### For Developers

#### Database Models

**User Model**

```typescript
{
  name: string
  email: string (unique, indexed)
  password: string (bcrypt hashed)
  createdAt: Date
}
```

**Tour Model**

```typescript
{
  name: string
  location: string
  duration: number (days)
  maxGroupSize: number
  difficulty: 'easy' | 'moderate' | 'difficult'
  price: number
  rating: number
  numReviews: number
  description: string
  highlights: string[]
  imageUrl: string
  startDates: Date[]
  createdAt: Date
  updatedAt: Date
}
```

**Booking Model**

```typescript
{
  tour: ObjectId (ref: Tour)
  user: string (email)
  startDate: Date
  numberOfPeople: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled'
  paymentStatus: 'unpaid' | 'paid' | 'refunded'
  createdAt: Date
  updatedAt: Date
}
```

#### API Routes

- `POST /api/auth/signup` - User registration
- `POST /api/auth/[...nextauth]` - Authentication (NextAuth)
- `GET /api/tours` - Get filtered tours
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings

#### Key Concepts

**Server vs Client Components**

- Server: Tour details, static content (better SEO, faster)
- Client: Interactive features, forms, state management

**Database Connection Pooling**

- Connection cached globally to prevent multiple connections
- Automatic reconnection on failure

**Image Optimization**

- Priority loading for above-fold images (LCP)
- Lazy loading for below-fold images
- Automatic WebP conversion by Next.js

**Search Debouncing**

- 500ms delay after typing stops
- Reduces API calls by ~80%
- Better performance and UX

## 🔒 Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT session tokens (30-day expiry)
- ✅ Server-side authentication validation
- ✅ Protected API routes and pages
- ✅ Input validation on client and server
- ✅ MongoDB injection prevention (Mongoose)
- ✅ HTTPS ready (production)

## 🎨 UI/UX Features

- ✅ Responsive design (mobile-first)
- ✅ Loading skeletons (no layout shift)
- ✅ Error boundaries (graceful failures)
- ✅ Custom 404 page
- ✅ Toast notifications (errors/success)
- ✅ Accessible forms (ARIA labels)
- ✅ Smooth animations and transitions

## 📊 Performance Optimizations

- ✅ Image optimization with next/image
- ✅ Static page generation where possible
- ✅ Database query optimization (indexes)
- ✅ Lean queries (plain objects vs Mongoose docs)
- ✅ Search debouncing
- ✅ Component code splitting
- ✅ Font optimization (Geist)

## 🧪 Testing

To test the application:

1. **Authentication Flow**

   - Sign up → Sign in → Sign out → Sign in again
   - Try duplicate email (should show error)
   - Check session persistence (refresh page)

2. **Search & Filter**

   - Type in search box (debounced)
   - Change difficulty filter
   - Adjust price/duration sliders
   - Sort by different options
   - Reset all filters

3. **Booking Flow**
   - Browse tours → Click tour → Select date
   - Adjust guest count → Book → Confirm
   - Check "My Bookings" page

## 📝 Environment Variables

```env
# Required
MONGODB_URI=          # MongoDB connection string
NEXTAUTH_URL=         # Your domain (http://localhost:3000 for dev)
NEXTAUTH_SECRET=      # Random secret (openssl rand -base64 32)

# Optional
NODE_ENV=             # development | production
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

- **Railway:** Supports Next.js with zero config
- **Netlify:** Use Next.js plugin
- **AWS/Google Cloud:** Docker container with node:18-alpine

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

This is a learning project built step-by-step with detailed explanations. Feel free to:

- Add new features
- Improve existing code
- Report bugs
- Suggest enhancements

## 📄 License

MIT License - feel free to use this project for learning or personal projects.

## 🙏 Credits

- **Tours Data:** Sample data for demonstration
- **Images:** Unsplash (tours), DiceBear (avatars)
- **Icons:** Unicode emoji (zero dependencies!)
- **Fonts:** Geist Sans & Geist Mono (Vercel)

## 📞 Support

For questions or issues:

- Check the code comments (extensively documented)
- Review the implementation guides in `/docs`
- Open an issue on GitHub

---

Built with ❤️ using Next.js 15, TypeScript, and MongoDB
