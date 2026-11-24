"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

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
  Search,
  ShoppingBag,
  ShoppingCart,
  Utensils,
  X,
  MessageCircle,
  Star,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Meal = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tag?: string;
};

const FALLBACK_MEAL_IMAGE =
  "https://images.unsplash.com/photo-1547592180-85f173990554?w=800";

const CART_STORAGE_KEY = "tabby-eats-cart";

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

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All Meals");

  const [meals, setMeals] = useState<Meal[]>([]);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);

  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [cart, setCart] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (
          parsedCart &&
          typeof parsedCart === "object" &&
          !Array.isArray(parsedCart)
        ) {
          return parsedCart as Record<string, number>;
        }
      }
    } catch (error) {
      console.error("Could not restore shopping cart:", error);
    }

    return {};
  });

  const [favourites, setFavourites] = useState<string[]>([]);

  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadMenu() {
      try {
        setMenuLoading(true);
        setMenuError("");

        const supabase = createClient();

        const [categoriesResult, mealsResult] = await Promise.all([
          supabase
            .from("categories")
            .select("id, name")
            .eq("is_active", true)
            .order("name"),

          supabase
            .from("meals")
            .select(
              "id, name, description, price, image_url, category_id, is_available, is_featured, created_at"
            )
            .eq("is_available", true)
            .order("created_at", { ascending: false }),
        ]);

        if (categoriesResult.error) {
          throw categoriesResult.error;
        }

        if (mealsResult.error) {
          throw mealsResult.error;
        }

        if (cancelled) return;

        const categoriesData = categoriesResult.data ?? [];

        const categoryMap = new Map(
          categoriesData.map((category) => [
            category.id,
            category.name,
          ])
        );

        const loadedMeals: Meal[] = (mealsResult.data ?? []).map(
          (meal) => ({
            id: meal.id,
            name: meal.name,
            description: meal.description ?? "Freshly prepared by Chef Tabby.",
            price: Number(meal.price),
            category:
              categoryMap.get(meal.category_id ?? "") ?? "Other",
            image: meal.image_url || FALLBACK_MEAL_IMAGE,
            tag: meal.is_featured ? "Chef's special" : undefined,
          })
        );

        setCategoryNames(
          categoriesData.map((category) => category.name)
        );

        setMeals(loadedMeals);
      } catch (error) {
        console.error("Unable to load Tabby Eats menu:", error);

        if (!cancelled) {
          setMenuError(
            error instanceof Error
              ? error.message
              : "Unable to load the menu. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setMenuLoading(false);
        }
      }
    }

    loadMenu();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );
  }, [cart]);

  const categories = ["All Meals", ...categoryNames];

  const visibleMeals = useMemo(() => {
    return meals.filter((meal) => {
      const matchesCategory =
        activeCategory === "All Meals" ||
        meal.category === activeCategory;

      const search = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !search ||
        meal.name.toLowerCase().includes(search) ||
        meal.description.toLowerCase().includes(search) ||
        meal.category.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [meals, activeCategory, searchQuery]);

  const cartItems = meals.filter(
    (meal) => (cart[meal.id] ?? 0) > 0
  );

  const cartCount = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, meal) =>
      total + meal.price * (cart[meal.id] ?? 0),
    0
  );

  function addToCart(meal: Meal) {
    setCart((current) => ({
      ...current,
      [meal.id]: (current[meal.id] || 0) + 1,
    }));

    setCartOpen(true);
  }

  function updateQuantity(id: string, change: number) {
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

  function toggleFavourite(id: string) {
    setFavourites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
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
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={900}
                    height={600}
                    loading="lazy"
                  />
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

        <div className="menu-tools">
          <div className="menu-search">
            <Search size={19} />

            <input
              type="search"
              placeholder="Search meals, ingredients or categories..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search meals"
            />
          </div>
        </div>

        <div className="category-list">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`category-button ${
                activeCategory === category ? "active" : ""
              }`}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        {menuLoading ? (
          <div className="menu-status">
            <div className="loading-spinner" />
            <p>Preparing Tabby&apos;s delicious menu...</p>
          </div>
        ) : menuError ? (
          <div className="menu-status menu-error">
            <h3>We couldn&apos;t load the menu</h3>
            <p>{menuError}</p>
            <button
              className="primary-button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : visibleMeals.length === 0 ? (
          <div className="menu-status">
            <h3>No meals found</h3>
            <p>
              Try another search or select a different category.
            </p>
            <button
              className="secondary-button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All Meals");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="meal-grid">
            {visibleMeals.map((meal) => (
              <article className="meal-card" key={meal.id}>
                <div className="meal-image">
                  <Image
                    src={meal.image}
                    alt={meal.name}
                    width={800}
                    height={600}
                    unoptimized
                  />

                  {meal.tag && (
                    <span className="meal-tag">{meal.tag}</span>
                  )}

                  <button
                    className="favourite-button"
                    onClick={() => toggleFavourite(meal.id)}
                    aria-label={`Favourite ${meal.name}`}
                    aria-pressed={favourites.includes(meal.id)}
                  >
                    <Heart
                      size={18}
                      fill={
                        favourites.includes(meal.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>

                <div className="meal-body">
                  <span className="meal-category">
                    {meal.category}
                  </span>

                  <h3>{meal.name}</h3>

                  <p>{meal.description}</p>

                  <div className="meal-footer">
                    <strong>
                      KSh {meal.price.toLocaleString("en-KE")}
                    </strong>

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
        )}

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
            loading="lazy"
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
                      <Image
                        src={meal.image}
                        alt={meal.name}
                        width={85}
                        height={85}
                        unoptimized
                      />
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
