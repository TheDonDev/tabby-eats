# Tabby Eats 🍲

### Home Taste, Delivered With Love.

**Tabby Eats** is a food ordering and private chef booking platform designed to bring the warmth of homemade Kenyan meals and personalised culinary experiences closer to customers in Nairobi, Kenya.

The platform aims to connect customers with delicious home-cooked meals prepared by Chef Tabby, convenient ready-to-cook meal kits, and professional private chef services for special occasions.

Built with modern web technologies, Tabby Eats is being developed as a scalable, responsive digital platform with plans to support web, mobile, and desktop experiences.

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [Core Services](#-core-services)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Application Architecture](#-application-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Supabase Database](#-supabase-database)
- [Running the Application](#-running-the-application)
- [Testing and Quality Assurance](#-testing-and-quality-assurance)
- [Development Roadmap](#-development-roadmap)
- [Security Considerations](#-security-considerations)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌍 About the Project

Tabby Eats is a Kenyan food business platform focused on convenient food ordering, home-cooked meals, and personalised chef experiences.

The idea is to provide customers with more than just food delivery. Customers will be able to order freshly prepared meals, purchase meal kits containing measured ingredients and recipes, and book a private chef for events and intimate dining experiences.

The platform is being developed with a responsive-first approach, making it accessible through desktop computers, tablets, and mobile devices.

**Brand identity**

- **Name:** Tabby Eats
- **Tagline:** Home Taste, Delivered With Love.
- **Business Location:** Nairobi, Kenya
- **Business Model:** Food ordering, meal kits, and private chef bookings
- **Primary Market:** Customers in Nairobi and surrounding areas

## 🎯 The Problem

Many customers want convenient access to homemade meals without the time and effort required to plan, shop for ingredients, and prepare food.

Similarly, people organising private dinners, family gatherings, and celebrations may struggle to find convenient private chef services.

There is also an opportunity to make home cooking easier through ready-to-cook meal kits containing prepared ingredients and simple recipes.

## 💡 Our Solution

Tabby Eats brings these services together through one digital platform.

Customers will be able to:

1. Browse available meals and food categories.
2. Add meals to their shopping cart.
3. Place food orders for delivery.
4. Purchase ready-to-cook meal kits.
5. Book private chefs for special occasions.
6. Manage their accounts and view their orders.
7. Track order progress.
8. Make payments through supported payment methods, including M-Pesa.

The platform is designed around convenience, quality, and the experience of enjoying homemade food.

## 🍽️ Core Services

### 1. Home-Cooked Meals

Freshly prepared Kenyan meals made with care by Chef Tabby.

Planned menu categories include:

- Kenyan classics
- Coastal flavours
- Nyama choma and grilled meals
- Healthy meals
- Breakfast options
- Snacks and quick bites

### 2. Private Chef Services

Customers will be able to book Chef Tabby for personalised cooking experiences.

Potential bookings include:

- Romantic date nights
- Private dinners
- Family gatherings
- Birthday celebrations
- Small parties and events
- Special occasions

### 3. Ready-to-Cook Meal Kits

Convenient cooking kits designed to make preparing meals at home easier.

Each kit is intended to include:

- Measured ingredients
- Preparation instructions
- Step-by-step recipes
- Cooking guidance

---

## ✨ Key Features

The application is being developed in stages.

### Customer Experience

- Responsive homepage and business landing page.
- Food menu and category browsing.
- Meal details and pricing.
- Shopping cart functionality.
- Customer account management.
- Food ordering and checkout.
- Private chef booking.
- Ready-to-cook meal kit ordering.
- Order history and tracking.

### Business Management

Planned administrative functionality includes:

- Dashboard and business overview.
- Meal and category management.
- Menu availability management.
- Order management.
- Customer management.
- Private chef booking management.
- Delivery zone configuration.
- Payment monitoring.
- Inventory management.

### Payments and Delivery

Planned integrations include:

- M-Pesa Daraja API.
- STK Push payment initiation.
- Payment confirmation and verification.
- Cash on delivery.
- Nairobi delivery zone management.
- Order status updates.

---

## 🛠️ Technology Stack

Tabby Eats uses a modern web development stack.

| Technology | Purpose |
|---|---|
| Next.js | React framework and application routing |
| React | User interface development |
| TypeScript | Type-safe application development |
| Tailwind CSS | Responsive styling and design |
| Supabase | Backend infrastructure |
| PostgreSQL | Relational database |
| Supabase Auth | Planned customer authentication |
| Supabase Storage | Planned image and media storage |
| M-Pesa Daraja API | Planned mobile payment integration |
| Git and GitHub | Version control and collaboration |
| Node.js and npm | JavaScript runtime and package management |

### Why These Technologies?

**Next.js and React**

Provide a modern foundation for building a responsive, component-based application.

**TypeScript**

Improves code reliability and maintainability through static typing.

**Tailwind CSS**

Makes it easier to build consistent, responsive interfaces.

**Supabase and PostgreSQL**

Provide a scalable backend foundation for storing customer profiles, meals, orders, bookings, payments, and other business information.

---

## 🏗️ Application Architecture

The planned architecture separates the frontend, backend services, database, and payment integrations.

```text
                 TABBY EATS
                     |
          Next.js Web Application
                     |
             React + TypeScript
                     |
             Supabase Services
                     |
        +------------+-------------+
        |            |             |
     Database      Auth         Storage
        |            |             |
     PostgreSQL  Customers      Food Images
        |
  +-----+-------+----------+
  |     |       |          |
Meals Orders Bookings  Payments
                          |
                    M-Pesa Daraja
```

The architecture is intended to support additional clients, including a Progressive Web App and mobile applications, using the same backend services.

---

## 📁 Project Structure

The repository is organised to keep the application modular and maintainable.

```text
tabby-eats/
│
├── apps/
│   └── web/
│       ├── public/
│       │
│       ├── src/
│       │   ├── app/
│       │   │   ├── database-test/
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   └── globals.css
│       │   │
│       │   └── lib/
│       │       └── supabase/
│       │           └── client.ts
│       │
│       ├── .env.local
│       ├── package.json
│       ├── tsconfig.json
│       └── next.config.ts
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── .gitignore
└── README.md
```

*Note: The structure will expand as authentication, checkout, administration, and other modules are implemented.*

---

## 🚀 Getting Started

Follow these instructions to run Tabby Eats locally.

### Prerequisites

Make sure you have installed:

- Node.js (LTS recommended)
- npm
- Git
- Visual Studio Code or another code editor
- A Supabase account

### 1. Clone the Repository

```bash
git clone https://github.com/TheDonDev/tabby-eats.git
```

Navigate into the project:

```bash
cd tabby-eats
```

### 2. Navigate to the Web Application

```bash
cd apps/web
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file inside `apps/web`:

```bash
touch .env.local
```

Open it:

```bash
code .env.local
```

Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Replace the placeholders with your actual Supabase project URL and publishable key.

**Important:** Never commit your `.env.local` file or expose your Supabase service-role secret in browser-accessible environment variables.

### 5. Configure Supabase

Create a Supabase project and execute the database migration located at:

```text
supabase/migrations/001_initial_schema.sql
```

Run the SQL in the Supabase Dashboard SQL Editor.

Insert the required seed data for food categories, meals, and delivery zones.

### 6. Start the Development Server

```bash
npm run dev
```

Open your browser:

```text
http://localhost:3000
```

The application should now be accessible locally.

---

## 🔐 Environment Variables

The web application currently uses the following environment variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |

Additional environment variables will be introduced as integrations are implemented, including M-Pesa configuration and server-side credentials.

Never expose private API credentials in frontend code.

---

## 🗄️ Supabase Database

Tabby Eats uses PostgreSQL through Supabase.

The initial database design includes the following tables:

| Table | Purpose |
|---|---|
| `profiles` | Customer and staff profile information |
| `categories` | Food menu categories |
| `meals` | Individual food items |
| `meal_kits` | Ready-to-cook meal kits |
| `delivery_zones` | Delivery locations and fees |
| `orders` | Customer orders |
| `order_items` | Items associated with each order |
| `chef_bookings` | Private chef reservations |
| `payments` | Payment records |
| `inventory` | Stock and ingredient management |

### Database Security

Row Level Security (RLS) is enabled on the database tables.

The database is designed to restrict access to customer-specific information and prevent unauthorised modifications to sensitive business records.

---

## 🧪 Running the Application

From the web application directory:

### Start Development Server

```bash
npm run dev
```

### Run ESLint

```bash
npm run lint
```

### Create Production Build

```bash
npm run build
```

### Run Production Server

```bash
npm run start
```

### Test Supabase Connectivity

Visit:

```text
http://localhost:3000/database-test
```

This page checks whether the application can communicate with the Supabase database and retrieve the number of available food categories and meals.

A successful connection confirms that the application can reach the database. Non-zero counts depend on whether seed records have been inserted and are accessible under the configured database policies.

---

## 🗺️ Development Roadmap

Tabby Eats is being developed incrementally.

- [x] Create the Next.js application.
- [x] Configure TypeScript and Tailwind CSS.
- [x] Establish initial branding and application styling.
- [x] Implement initial homepage.
- [x] Implement initial shopping cart functionality.
- [x] Create the initial Supabase database schema.
- [x] Configure the Supabase client.
- [x] Verify connectivity between Next.js and Supabase.
- [ ] Insert and verify seed data.
- [ ] Connect the food menu to live database records.
- [ ] Implement customer registration and login.
- [ ] Implement customer profile management.
- [ ] Implement secure checkout.
- [ ] Persist customer orders in the database.
- [ ] Implement private chef bookings.
- [ ] Implement ready-to-cook meal kit ordering.
- [ ] Build the administrative dashboard.
- [ ] Implement M-Pesa STK Push.
- [ ] Implement payment verification and callbacks.
- [ ] Implement order tracking and notifications.
- [ ] Deploy the production web application.
- [ ] Develop the Progressive Web App.
- [ ] Develop Android and iOS applications.
- [ ] Explore a desktop application.

---

## 🔒 Security Considerations

Security is an important part of the Tabby Eats development process.

The application is designed around the following principles:

1. Use Supabase Row Level Security to control access to database records.
2. Keep service-role keys and private API credentials on the server.
3. Validate order items, quantities, delivery fees, and prices on the server before creating orders.
4. Verify M-Pesa payment callbacks before marking orders as paid.
5. Enforce role-based permissions for administrative operations.
6. Avoid trusting payment status or order totals supplied directly by the browser.
7. Protect customer information and booking records.

---

## 🔮 Future Improvements

As the platform grows, additional capabilities may include:

- Real-time order notifications.
- Customer reviews and ratings.
- Promotional codes and discounts.
- Meal recommendations.
- Loyalty and rewards programme.
- Automated WhatsApp notifications.
- Delivery partner management.
- Advanced sales and revenue analytics.
- Mobile applications using React Native and Expo.
- Desktop application support.

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature-name
```

3. Implement your changes.
4. Run the available quality checks.

```bash
npm run lint
npm run build
```

5. Commit your changes.

```bash
git commit -m "feat: describe your changes"
```

6. Push your branch and open a Pull Request.

---

## 📄 License

This project is currently under development.

A formal open-source or commercial licence should be added before public redistribution. All rights are reserved by the project owner unless a licence is explicitly published.

---

## 📬 Contact

**Project:** Tabby Eats

**Tagline:** Home Taste, Delivered With Love.

**Developer:** TheDonDev

**GitHub:** https://github.com/TheDonDev

**Portfolio:** https://thedondev.github.io./

---

### ❤️ Built with a passion for great food and technology.

**Tabby Eats — Home Taste, Delivered With Love.**
