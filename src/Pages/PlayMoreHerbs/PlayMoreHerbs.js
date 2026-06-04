import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Battery,
  Brain,
  Check,
  CheckCircle2,
  Dumbbell,
  Flame,
  HeartPulse,
  Leaf,
  LockKeyhole,
  PackageCheck,
  Play,
  ShieldCheck,
  ShoppingCart,
  Star,
  TrendingUp,
  Truck,
  User,
  X,
  Zap,
} from "lucide-react";
import axiosInstance from "../../components/AxiosInstance";
import "./PlayMoreHerbs.css";

const PRODUCT_ID = "69dc879900eb47d08aca547a";
const PRODUCT_IMAGE = "/sex.png";

const problems = [
  ["Low Energy", "Feel tired all day with no energy", Zap],
  ["Stress & Anxiety", "Daily stress impacting life", Brain],
  ["Low Stamina", "Low endurance & performance", Dumbbell],
  ["Fatigue", "Constant fatigue & weakness", Battery],
  ["Low Confidence", "Affecting your self confidence", User],
  ["Poor Performance", "Not satisfied with your performance", TrendingUp],
];

const solutionPoints = [
  ["Boosts Testosterone", Flame],
  ["Enhances Libido & Desire", HeartPulse],
  ["Reduce Stress & Fatigue", Battery],
  ["Supports Muscle Strength", Dumbbell],
  ["Reduces Stress & Fatigue", Brain],
  ["Improves Overall Performance", TrendingUp],
];

const benefits = [
  ["Boosts Stamina & Energy", Activity],
  ["Enhances Libido & Desire", HeartPulse],
  ["Supports Muscle Strength", Dumbbell],
  ["Improves Sexual Health", Leaf],
  ["Reduces Stress & Fatigue", Brain],
  ["Increases Overall Performance", TrendingUp],
];

const ingredients = [
  ["Safed Musli", "100 mg", "root"],
  ["Kali Musli", "50 mg", "seeds"],
  ["Ashwagandha", "200 mg", "root"],
  ["Shilajit", "100 mg", "resin"],
  ["Gokshura", "200 mg", "leaf"],
  ["Shatavari", "200 mg", "sticks"],
  ["Others Herbs", "150 mg", "leaf"],
];

const reviews = [
  ["Rohit Sharma", "After using Stame Life Capsules, my energy and stamina improved significantly. Highly recommended!"],
  ["Amit Verma", "I feel more active, confident and my performance has improved naturally."],
  ["Sandeep Yadav", "100% natural and no side effects. This is the best supplement I've ever used!"],
];

const compareRows = [
  "100% Natural Ingredients",
  "Boosts Testosterone",
  "Enhances Stamina & Strength",
  "Improves Performance",
  "No Side Effects",
  "Ayurvedic & Safe",
];

const parseQuantityVariants = (raw) => {
  try {
    let value = raw;
    if (Array.isArray(value) && value.length === 1 && typeof value[0] === "string") {
      value = JSON.parse(value[0]);
    }
    if (Array.isArray(value) && Array.isArray(value[0])) value = value.flat();
    if (!Array.isArray(value)) return [];

    return value.map((variant, index) => ({
      _key: variant?._id || `landing-variant-${index}`,
      ...variant,
      mrp: toNumber(variant?.mrp),
      discount: toNumber(variant?.discount),
      gst: toNumber(variant?.gst),
      retail_price: toNumber(variant?.retail_price),
      final_price: toNumber(variant?.final_price),
      in_stock:
        typeof variant?.in_stock === "string"
          ? variant.in_stock.toLowerCase() === "yes"
          : variant?.in_stock !== false,
    }));
  } catch {
    return [];
  }
};

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

function ProductImage({ className = "" }) {
  return (
    <div className={`pmh-product ${className}`}>
      <span className="pmh-product-glow" />
      <span className="pmh-product-shadow" />
      <img src={PRODUCT_IMAGE} alt="Dr. BSK's UK Stame Life Capsules" />
    </div>
  );
}

function Stars() {
  return (
    <span className="pmh-stars">
      {[0, 1, 2, 3, 4].map((item) => (
        <Star key={item} size={17} fill="currentColor" />
      ))}
    </span>
  );
}

export default function PlayMoreHerbs() {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    let active = true;
    axiosInstance
      .get(`/user/product/${PRODUCT_ID}`)
      .then(({ data }) => {
        if (active) setProduct(data);
      })
      .catch((error) => console.error("Failed to load Stame Life product:", error));

    return () => {
      active = false;
    };
  }, []);

  const variants = parseQuantityVariants(product?.quantity);
  const quantityLabel = variants[0]?.label || "60 CAP";
  const discount = variants[0]?.discount || product?.discount || "30";
  const expiry = product?.expires_on || "3 Years";
  const category = [product?.category, product?.sub_category].filter(Boolean).join(" / ") || "Human Ayurvedic / Ayurvedic Capsule";

  const startRazorpayCheckout = () => {
    if (!product) {
      navigate(`/ProductPage/${PRODUCT_ID}`);
      return;
    }

    const selectedVariant = variants.find((variant) => variant.in_stock) || variants[0] || null;
    const price = toNumber(
      selectedVariant?.final_price ??
        product.consumer_price ??
        product.final_price ??
        selectedVariant?.retail_price ??
        product.retail_price
    );
    const productId = product._id || product.id || PRODUCT_ID;

    const checkoutProduct = {
      ...product,
      _id: productId,
      quantity: variants,
      selectedVariant,
      selectedVariantIndex: Math.max(0, variants.indexOf(selectedVariant)),
      price,
      purchaseQuantity: 1,
      unitPrice: price,
      totalPrice: price,
      mrp: selectedVariant?.mrp ?? product.mrp,
      discount: selectedVariant?.discount ?? product.discount,
      gst: selectedVariant?.gst ?? product.gst,
      inStock: selectedVariant?.in_stock ?? product.stock ?? true,
    };

    navigate("/checkout", {
      state: {
        product: checkoutProduct,
        quantity: 1,
        paymentMethod: "online",
        autoOpenPayment: true,
        source: "play-more-herbs",
      },
    });
  };

  return (
    <main className="pmh-page">
      <section className="pmh-hero">
        <div className="pmh-hero-pattern" />
        <div className="pmh-hero-inner">
          <div className="pmh-hero-copy">
            <p className="pmh-brand">Dr. BSK's UK</p>
            <h1>
              STAME LIFE
              <span>CAPSULES</span>
            </h1>
            <h2>
              TESTOSTERONE BOOSTER
              <br />
              INCREASE LIBIDO &bull; DESIRE &bull; STAMINA
            </h2>

            <div className="pmh-check-list">
              {["Boosts Stamina & Strength", "Enhances Libido & Desire", "Improves Energy & Vitality", "Supports Overall Performance"].map((text) => (
                <span key={text}>
                  <CheckCircle2 size={20} fill="currentColor" />
                  {text}
                </span>
              ))}
            </div>

            <div className="pmh-trust-box">
              <span><Leaf size={31} /><b>100%<small>NATURAL</small></b></span>
              <span><Leaf size={31} /><b>AYURVEDIC<small>FORMULA</small></b></span>
              <span><ShieldCheck size={31} /><b>DAILY USE<small>SUPPLEMENT</small></b></span>
            </div>

            <div className="pmh-actions">
              <button type="button" onClick={startRazorpayCheckout} className="pmh-brown-btn">
                BUY NOW <ShoppingCart size={25} />
              </button>
              <button type="button" className="pmh-outline-btn">SEE RESULTS</button>
            </div>

            <div className="pmh-secure-row">
              <span><LockKeyhole size={16} /> Secure Payment</span>
              <span><ShieldCheck size={16} /> GMP Certified</span>
              <span><Truck size={16} /> Fast Delivery</span>
            </div>
          </div>

          <ProductImage className="pmh-product-hero" />

          <div className="pmh-side-benefits">
            {[
              ["BOOSTS", "TESTOSTERONE", ShieldCheck],
              ["ENHANCES", "STAMINA", HeartPulse],
              ["IMPROVES", "PERFORMANCE", Dumbbell],
              ["REDUCES", "FATIGUE & STRESS", Battery],
            ].map(([top, bottom, Icon]) => (
              <article key={top}>
                <Icon size={34} />
                <b>{top}</b>
                <span>{bottom}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pmh-panel pmh-problems">
        <p className="pmh-eyebrow">STRUGGLING WITH?</p>
        <h2>Common Problems Men Face Today</h2>
        <div className="pmh-card-grid pmh-card-grid-six">
          {problems.map(([title, desc, Icon]) => (
            <article className="pmh-problem-card" key={title}>
              <span><Icon size={35} fill="currentColor" /></span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pmh-panel pmh-solution">
        <div className="pmh-solution-product">
          <div className="pmh-seal">
            <b>100%</b>
            <span>AYURVEDIC<br />& SAFE</span>
          </div>
          <ProductImage className="pmh-product-small" />
        </div>
        <div className="pmh-solution-copy">
          <p className="pmh-eyebrow">THE NATURAL SOLUTION</p>
          <h2>Dr. BSK's UK Stame Life Capsules<br />For Strength, Stamina & Vitality</h2>
          <p>A powerful Ayurvedic formula that helps boost testosterone levels naturally and supports male wellness.</p>
          <div className="pmh-mini-grid">
            {solutionPoints.map(([text, Icon]) => (
              <span key={text}>
                <Icon size={42} />
                {text}
              </span>
            ))}
          </div>
          <button type="button" onClick={startRazorpayCheckout} className="pmh-brown-btn pmh-order-btn">
            ORDER NOW <ShoppingCart size={21} />
          </button>
        </div>
      </section>

      <section className="pmh-panel pmh-center">
        <p className="pmh-eyebrow">KEY BENEFITS</p>
        <h2>Unlock Your True Potential</h2>
        <div className="pmh-card-grid pmh-card-grid-six">
          {benefits.map(([text, Icon]) => (
            <article className="pmh-benefit-card" key={text}>
              <Icon size={40} />
              <b>{text}</b>
            </article>
          ))}
        </div>
      </section>

      <section className="pmh-panel pmh-center">
        <p className="pmh-eyebrow">POWERFUL AYURVEDIC INGREDIENTS</p>
        <h2>Each Capsule Contains 1gm of Natural Power</h2>
        <div className="pmh-ingredient-grid">
          {ingredients.map(([name, qty, art]) => (
            <article className="pmh-ingredient-card" key={name}>
              <span className={`pmh-ingredient-art pmh-art-${art}`} />
              <h3>{name}</h3>
              <p>{qty}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pmh-panel pmh-center">
        <p className="pmh-eyebrow">REAL PEOPLE. REAL RESULTS</p>
        <h2>Loved by Thousands of Happy Customers</h2>
        <div className="pmh-review-grid">
          {reviews.map(([name, quote]) => (
            <article className="pmh-review-card" key={name}>
              <div className="pmh-review-photo">
                <button type="button" aria-label={`Play ${name} review`}>
                  <Play size={23} fill="currentColor" />
                </button>
              </div>
              <div>
                <p>"{quote}"</p>
                <b>{name}</b>
                <Stars />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pmh-panel pmh-proof">
        <div className="pmh-why-card">
          <h3>WHY CHOOSE<br />STAME LIFE CAPSULES?</h3>
          {["100% Natural Ayurvedic Formula", "No Harmful Chemicals", "Boosts Testosterone Naturally", "Improves Strength & Stamina", "Safe, Effective & Trusted"].map((item) => (
            <p key={item}><CheckCircle2 size={16} fill="currentColor" />{item}</p>
          ))}
        </div>

        <div className="pmh-table-wrap">
          <table>
            <thead>
              <tr>
                <th>FEATURES</th>
                <th>STAME LIFE</th>
                <th>OTHERS</th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row}>
                  <td>{row}</td>
                  <td><Check size={22} /></td>
                  <td><X size={20} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="pmh-discount">
          <span>LIMITED TIME OFFER</span>
          <h3>UPTO</h3>
          <strong>{discount}%</strong>
          <em>OFF</em>
          <button type="button" onClick={startRazorpayCheckout}>ORDER NOW</button>
          <p>HURRY! OFFER ENDING SOON</p>
          <div className="pmh-timer">
            <b>02</b><b>18</b><b>45</b>
            <small>HRS</small><small>MINS</small><small>SECS</small>
          </div>
        </aside>
      </section>

      <section className="pmh-use-safe">
        {[
          ["HOW TO USE", "Take 1-2 capsules twice a day or as directed by the Physician.", PackageCheck],
          ["SAFE & NATURAL", "Made with 100% Ayurvedic ingredients. No side effects when taken as directed.", Leaf],
        ].map(([title, desc, Icon]) => (
          <article key={title}>
            <span><Icon size={42} /></span>
            <h3>{title}</h3>
            <p>{desc}</p>
          </article>
        ))}
      </section>

      <section className="pmh-bottom-bar">
        <div>
          <strong>FEEL THE POWER. LIVE YOUR BEST LIFE.</strong>
          <span>100% Natural &nbsp; GMP Certified &nbsp; Secure Payment &nbsp; Fast Delivery</span>
        </div>
        <button type="button" onClick={startRazorpayCheckout}>
          ORDER NOW <ShoppingCart size={22} />
          <small>Your Health is Our Priority</small>
        </button>
        <div className="pmh-capsule-count">
          <b>60</b>
          <span>CAPSULES</span>
        </div>
      </section>

      <section className="pmh-meta-row">
        <span><Leaf size={18} />{category}</span>
        <span><ShieldCheck size={18} />GMP Certified Quality Assured</span>
        <span><LockKeyhole size={18} />Secure Payment SSL Safe & Secure</span>
        <span><PackageCheck size={18} />{quantityLabel} | {expiry}</span>
      </section>
    </main>
  );
}
