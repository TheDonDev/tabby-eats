"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChefHat,
  Clock3,
  Heart,
  MapPin,
  Menu,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Utensils,
  X,
  MessageCircle,
  Star,
} from "lucide-react";

const categories = [
  "All Meals",
  "Kenyan Classics",
  "Coastal Flavours",
  "Choma Corner",
  "Healthy Kitchen",
  "Breakfast",
];

const meals = [
  {
    id: 1,
    name: "Beef Stew & Ugali",
    description: "Slow-cooked beef, ugali and fresh sukuma wiki.",
    price: 450,
    category: "Kenyan Classics",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
    tag: "Customer favourite",
  },
  {
    id: 2,
    name: "Chicken Pilau",
    description: "Fragrant Swahili rice with tender chicken.",
    price: 550,
    category: "Coastal Flavours",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800",
    tag: "Chef's special",
  },
  {
    id: 3,
    name: "Nyama Choma Platter",
    description: "Grilled meat served with kachumbari and sides.",
    price: 900,
    category: "Choma Corner",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    tag: "Popular",
  },
  {
    id: 4,
    name: "Healthy Chicken Bowl",
    description: "Grilled chicken, fresh vegetables and rice.",
    price: 650,
    category: "Healthy Kitchen",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    tag: "Fresh & healthy",
  },
  {
    id: 5,
    name: "Homemade Chapati",
    description: "Soft, freshly prepared Kenyan chapati.",
    price: 100,
    category: "Kenyan Classics",
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800",
    tag: "Made fresh",
  },
  {
    id: 6,
    name: "Breakfast Special",
    description: "Eggs, mandazi and a warm cup of Kenyan tea.",
    price: 300,
    category: "Breakfast",
    image:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800",
    tag: "Morning favourite",
  },
];

const services = [
  {
    title: "Home-Cooked Meals",
    description:
      "Enjoy authentic Kenyan meals, freshly prepared by Chef Tabby and delivered to your doorstep.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=900",
    icon: Utensils,
    action: "Explore menu",
    href: "#menu",
  },
  {
    title: "Private Chef",
    description:
      "Make your special occasions memorable with a personal chef experience in your home.",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=900",
    icon: ChefHat,
    action: "Book Chef Tabby",
    href: "#book-chef",
  },
  {
    title: "Ready-to-Cook Kits",
    description:
      "Fresh ingredients, measured portions and easy recipes. Your next delicious meal starts here.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=900",
    icon: Package,
    action: "Explore meal kits",
    href: "#meal-kits",
  },
];

type Meal = (typeof meals)[number];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All Meals");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleMeals = useMemo(
    () =>
      activeCategory === "All Meals"
        ? meals
        : meals.filter((meal) => meal.category === activeCategory),
    [activeCategory]
  );

  const cartItems = meals.filter((meal) => cart[meal.id] > 0);

  const cartCount = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, meal) => total + meal.price * cart[meal.id],
    0
  );

  function addToCart(meal: Meal) {
    setCart((current) => ({
      ...current,
      [meal.id]: (current[meal.id] || 0) + 1,
    }));
  }

  function updateQuantity(id: number, change: number) {
    setCart((current) => {
      const next = { ...current };
      const quantity = (next[id] || 0) + change;

      if (quantity <= 0) {
        delete next[id];
      } else {
        next[id] = quantity;
      }

      return next;
    });
  }

  return (
    <main>
      <div className="announcement">
        <span>Freshly made with love ❤️</span>
        <span>Serving Nairobi, Kenya</span>
      </div>

      <header className="navbar">
        <a href="#" className="brand">
          <span className="brand-icon">
            <ChefHat size={25} />
          </span>
          <span>
            TABBY <strong>EATS</strong>
            <small>HOME TASTE, DELIVERED WITH LOVE</small>
          </span>
        </a>

        <nav className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#menu" onClick={() => setMobileMenuOpen(false)}>Our Menu</a>
          <a href="#meal-kits" onClick={() => setMobileMenuOpen(false)}>Meal Kits</a>
          <a href="#book-chef" onClick={() => setMobileMenuOpen(false)}>Private Chef</a>
        </nav>

        <div className="nav-actions">
          <button
            className="cart-button"
            onClick={() => setCartOpen(true)}
            aria-label="Open shopping cart"
          >
            <ShoppingBag size={19} />
            <span>My Cart</span>
            <b>{cartCount}</b>
          </button>

          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-content">
          <span className="eyebrow">
            <Heart size={15} fill="currentColor" />
            MADE WITH LOVE IN NAIROBI
          </span>

          <h1>
            Home taste.
            <br />
            <span>Delivered</span>
            <br />
            with love.
          </h1>

          <p>
            From comforting Kenyan classics to unforgettable private dining
            experiences, there&apos;s something special cooking at Tabby Eats.
          </p>

          <div className="hero-actions">
            <a href="#menu" className="primary-button">
              Explore our menu <ArrowRight size={18} />
            </a>
            <a href="#book-chef" className="secondary-button">
              <ChefHat size={18} /> Book a private chef
            </a>
          </div>

          <div className="hero-trust">
            <span><Star size={15} fill="currentColor" /> Made fresh daily</span>
            <span><Heart size={15} /> Homemade goodness</span>
          </div>
        </div>

        <div className="hero-image">
          <Image
            src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1200"
            alt="A delicious freshly prepared meal"
            width={1200}
            height={800}
            priority
          />
          <div className="floating-card">
            <span className="floating-icon">🍲</span>
            <div>
              <strong>Cooked by Tabby</strong>
              <small>Fresh. Homemade. Delicious.</small>
            </div>
          </div>
        </div>
      </section>

      <section className="services section" id="services">
        <div className="section-heading">
          <span className="eyebrow">MORE THAN JUST FOOD</span>
          <h2>Good food, <span>your way.</span></h2>
          <p>Three special ways to experience the taste of home.</p>
        </div>

        <div className="service-grid">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article className="service-card" key={service.title}>
                <div className="service-image">
                  <Image src={service.image} alt={service.title} width={900} height={600} />
                  <span className="service-icon"><Icon size={22} /></span>
                </div>
                <div className="service-body">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a href={service.href}>
                    {service.action} <ArrowRight size={16} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="menu-section section" id="menu">
        <div className="section-heading menu-heading">
          <span className="eyebrow">STRAIGHT FROM TABBY&apos;S KITCHEN</span>
          <h2>Our delicious <span>menu.</span></h2>
          <p>Real Kenyan flavours, lovingly prepared and served fresh.</p>
        </div>

        <div className="category-list">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`category-button ${
                activeCategory === category ? "active" : ""
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="meal-grid">
          {visibleMeals.map((meal) => (
            <article className="meal-card" key={meal.id}>
              <div className="meal-image">
                <Image src={meal.image} alt={meal.name} width={800} height={600} />
                <span className="meal-tag">{meal.tag}</span>
                <button
                  className="favourite-button"
                  aria-label={`Favourite ${meal.name}`}
                >
                  <Heart size={18} />
                </button>
              </div>

              <div className="meal-body">
                <span className="meal-category">{meal.category}</span>
                <h3>{meal.name}</h3>
                <p>{meal.description}</p>

                <div className="meal-footer">
                  <strong>KSh {meal.price.toLocaleString("en-KE")}</strong>
                  <button
                    className="add-button"
                    onClick={() => addToCart(meal)}
                    aria-label={`Add ${meal.name} to cart`}
                  >
                    <Plus size={19} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="menu-footer">
          <p>More delicious meals are coming from Tabby&apos;s kitchen!</p>
        </div>
      </section>

      <section className="experience-section section" id="book-chef">
        <div>
          <span className="eyebrow">A SPECIAL EXPERIENCE</span>
          <h2>Let Tabby bring the restaurant <span>to you.</span></h2>
          <p>
            Celebrating something special? Enjoy a personalised dining
            experience with Chef Tabby, prepared right in your home.
          </p>
          <a href="https://wa.me/254700000000" className="primary-button">
            <CalendarDays size={18} /> Enquire about a booking
          </a>
        </div>
        <div className="experience-image">
          <Image
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1000"
            alt="A beautifully prepared home dining experience"
            width={1000}
            height={667}
          />
        </div>
      </section>

      <section className="kits-section section" id="meal-kits">
        <div className="kits-content">
          <span className="eyebrow">COOK SOMETHING DELICIOUS</span>
          <h2>Tabby&apos;s meal kits.</h2>
          <p>
            Everything measured and ready. Fresh ingredients, easy recipes
            and a delicious homemade meal in about 30 minutes.
          </p>
          <a href="https://wa.me/254700000000" className="secondary-button">
            Ask about meal kits <ArrowRight size={17} />
          </a>
        </div>
        <div className="kits-icon">
          <Package size={100} strokeWidth={1.2} />
          <span>🥕 🍅 🌶️</span>
        </div>
      </section>

      <section className="delivery-section">
        <div><MapPin size={25} /><strong>Made fresh in Nairobi</strong></div>
        <div><Clock3 size={25} /><strong>Prepared with care</strong></div>
        <div><ShoppingCart size={25} /><strong>Easy ordering</strong></div>
      </section>

      <footer className="footer">
        <a href="#" className="brand footer-brand">
          <span className="brand-icon"><ChefHat size={25} /></span>
          <span>TABBY <strong>EATS</strong><small>HOME TASTE, DELIVERED WITH LOVE</small></span>
        </a>
        <p>Good food. Warm hearts. A taste of home.</p>
        <small>© {new Date().getFullYear()} Tabby Eats. All rights reserved.</small>
      </footer>

      <a
        href="https://wa.me/254700000000"
        className="whatsapp-button"
        aria-label="Chat with Tabby Eats on WhatsApp"
      >
        <MessageCircle size={23} />
      </a>

      <nav className="mobile-bottom-nav">
        <a href="#home"><ChefHat size={19} /><span>Home</span></a>
        <a href="#menu"><Utensils size={19} /><span>Menu</span></a>
        <a href="#meal-kits"><Package size={19} /><span>Kits</span></a>
        <button onClick={() => setCartOpen(true)}>
          <ShoppingBag size={19} />
          <span>Cart ({cartCount})</span>
        </button>
      </nav>

      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="cart-header">
              <div>
                <span className="eyebrow">YOUR ORDER</span>
                <h2>Shopping cart</h2>
              </div>
              <button onClick={() => setCartOpen(false)} aria-label="Close cart">
                <X />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <ShoppingBag size={48} />
                <h3>Your cart is empty</h3>
                <p>Discover something delicious from Tabby&apos;s kitchen.</p>
                <button
                  className="primary-button"
                  onClick={() => setCartOpen(false)}
                >
                  Explore menu
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((meal) => (
                    <div className="cart-item" key={meal.id}>
                      <Image src={meal.image} alt={meal.name} width={85} height={85} />
                      <div className="cart-item-info">
                        <strong>{meal.name}</strong>
                        <span>KSh {meal.price.toLocaleString("en-KE")}</span>
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(meal.id, -1)}>
                            <Minus size={14} />
                          </button>
                          <span>{cart[meal.id]}</span>
                          <button onClick={() => updateQuantity(meal.id, 1)}>
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>KSh {cartTotal.toLocaleString("en-KE")}</strong>
                  </div>
                  <small>Delivery fees calculated at checkout.</small>
                  <button
                    className="primary-button checkout-button"
                    onClick={() => alert("Checkout will be connected in our next development milestone.")}
                  >
                    Continue to checkout <ArrowRight size={17} />
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
