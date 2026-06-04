import React from "react";
import {
  Battery,
  Check,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  Leaf,
  ShieldCheck,
  Star,
  Users,
  Zap,
  Brain,
  User,
  Crown,
  HeartPulse,
  MessageCircle,
  Play,
  X,
  PackageCheck,
  LockKeyhole,
  Truck,
} from "lucide-react";
import "./PlayMoreHerbs.css";

const problemCards = [
  ["Low Energy", "Feel tired all day with no energy", Zap],
  ["Stress & Anxiety", "Daily stress impacting life", Brain],
  ["Low Stamina", "Low endurance & performance", Dumbbell],
  ["Fatigue", "Constant fatigue & weakness", Battery],
  ["Low Confidence", "Affecting your self confidence", User],
  ["Poor Performance", "Not satisfied with your performance", Crown],
];

const benefits = [
  ["Boost Energy & Stamina", Zap],
  ["Improve Strength & Endurance", Dumbbell],
  ["Natural & Safe Ingredients", Leaf],
  ["Support Stress & Mood", ShieldCheck],
  ["Hormonal Balance", HeartPulse],
  ["Better Performance & Vitality", Crown],
];

const ingredients = [
  ["Ashwagandha", "Reduces stress & boosts strength", "root"],
  ["Shilajit", "Increases stamina & energy levels", "resin"],
  ["Safed Musli", "Enhances vitality & improves performance", "seeds"],
  ["Kaunch Beej", "Supports healthy hormone levels", "beans"],
  ["Gokshura", "Improves stamina & endurance", "leaf"],
  ["Shatavari", "Supports overall wellness & vitality", "sticks"],
];

const reviews = [
  ["Rohit Sharma", "After using PlayMoreHerbs, my energy and stamina improved significantly. Highly recommended!"],
  ["Amit Verma", "I feel more active, confident and my performance has improved naturally."],
  ["Sandeep Yadav", "100% natural and no side effects. This is the best herbal supplement I have ever used!"],
];

const compareRows = [
  "100% Natural Ingredients",
  "No Side Effects",
  "Boosts Energy & Stamina",
  "Improves Performance",
  "Long-Term Results",
  "Made in GMP Certified Facility",
];

function HerbBottle({ compact = false }) {
  return (
    <div className={`pmh-bottle-scene ${compact ? "pmh-bottle-scene--compact" : ""}`} aria-label="Play More Herbs bottle">
      <div className="pmh-glow-ring"></div>
      <div className="pmh-herb pmh-herb-left"></div>
      <div className="pmh-herb pmh-herb-right"></div>
      <div className="pmh-roots"></div>
      <div className="pmh-bottle">
        <div className="pmh-cap"></div>
        <div className="pmh-neck"></div>
        <div className="pmh-label">
          <Leaf size={42} />
          <strong>PLAY<br />MORE HERBS</strong>
          <span>HERBAL SUPPLEMENT</span>
          <small>FOR STAMINA, ENERGY & WELLNESS</small>
          <div className="pmh-label-herbs">
            <i></i><b></b><i></i>
          </div>
        </div>
        <div className="pmh-bottle-foot">
          <span>100% NATURAL</span>
          <span>60 CAPSULES</span>
          <span>ENHANCE CONFIDENCE</span>
        </div>
      </div>
    </div>
  );
}

function Stars() {
  return (
    <span className="pmh-stars" aria-label="5 star rating">
      {[0, 1, 2, 3, 4].map((item) => (
        <Star key={item} size={22} fill="currentColor" />
      ))}
    </span>
  );
}

export default function PlayMoreHerbs() {
  return (
    <main className="pmh-page">
      <section className="pmh-hero">
        <div className="pmh-hero-bg"></div>
        <div className="pmh-hero-inner">
          <div className="pmh-copy">
            <div className="pmh-kicker"><Leaf size={24} fill="currentColor" /> Premium Ayurvedic Formula</div>
            <h1>BE YOUR <span>BEST VERSION</span></h1>
            <h2>Boost Stamina, Energy & Performance Naturally</h2>
            <p>
              PlayMoreHerbs is a powerful blend of 100% natural Ayurvedic herbs that helps you unlock strength, stamina & confidence.
            </p>
            <div className="pmh-check-grid">
              {["Increase Stamina & Strength", "Reduce Stress & Fatigue", "Boost Energy & Vitality", "Support Hormonal Balance", "Enhance Performance", "100% Natural & Safe"].map((text) => (
                <div key={text}><CheckCircle2 size={20} fill="currentColor" /> {text}</div>
              ))}
            </div>
            <div className="pmh-actions">
              <button className="pmh-primary">BUY NOW <small>Limited Time Offer</small><ChevronRight size={38} /></button>
              <button className="pmh-secondary">SEE RESULTS <small>Real People, Real Stories</small></button>
            </div>
            <div className="pmh-social">
              <div className="pmh-avatars"><span></span><span></span><span></span><span></span></div>
              <strong>50,000+<small>Happy Customers</small></strong>
              <div className="pmh-rating"><Stars /><b>4.8/5</b><small>(2,500+ Reviews)</small></div>
            </div>
          </div>

          <div className="pmh-product-wrap">
            <HerbBottle />
          </div>

          <div className="pmh-badges">
            <div><strong>100%</strong><span>NATURAL</span></div>
            <div><Leaf size={34} /><strong>GMP</strong><span>CERTIFIED</span></div>
            <div><ShieldCheck size={34} /><strong>NO SIDE</strong><span>EFFECTS</span></div>
          </div>
        </div>
      </section>

      <section className="pmh-statbar">
        <div><Star size={38} /><strong>4.8/5</strong><span>Google Reviews</span></div>
        <div><Users size={38} /><strong>50K+</strong><span>Happy Customers</span></div>
        <div><Leaf size={38} /><strong>100%</strong><span>Natural Ingredients</span></div>
        <div><ShieldCheck size={38} /><strong>GMP</strong><span>Certified Facility</span></div>
      </section>

      <section className="pmh-section pmh-problems">
        <div className="pmh-eyebrow">STRUGGLING WITH?</div>
        <h2>Common Problems Men Face Today</h2>
        <div className="pmh-problem-grid">
          {problemCards.map(([title, desc, Icon]) => (
            <article key={title} className="pmh-problem-card">
              <div><Icon size={34} fill="currentColor" /></div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pmh-solution">
        <div className="pmh-solution-art"><HerbBottle compact /></div>
        <div className="pmh-solution-copy">
          <div className="pmh-eyebrow">THE NATURAL SOLUTION</div>
          <h2>PlayMoreHerbs - For Strength, Stamina & Vitality</h2>
          <p>A powerful blend of 100% natural Ayurvedic herbs that work together to enhance your overall wellness.</p>
          <div className="pmh-mini-grid">
            {benefits.slice(0, 6).map(([text, Icon]) => (
              <div key={text}><Icon size={28} /> <span>{text}</span></div>
            ))}
          </div>
          <button className="pmh-wide-btn">BUY NOW - LIMITED TIME OFFER <ChevronRight size={28} /></button>
          <div className="pmh-coupon">LIMITED TIME OFFER - GET EXTRA 10% OFF TODAY! <b>USE CODE: POWER10</b></div>
        </div>
      </section>

      <section className="pmh-section">
        <div className="pmh-eyebrow">KEY BENEFITS</div>
        <h2>Unlock Your True Potential</h2>
        <div className="pmh-benefit-grid">
          {benefits.map(([text, Icon]) => (
            <article key={text}><Icon size={42} /><span>{text}</span></article>
          ))}
        </div>
      </section>

      <section className="pmh-section">
        <div className="pmh-eyebrow">POWERFUL INGREDIENTS</div>
        <h2>Made with 100% Natural Ayurvedic Herbs</h2>
        <div className="pmh-ingredient-grid">
          {ingredients.map(([name, desc, type]) => (
            <article className="pmh-ingredient" key={name}>
              <div className={`pmh-ingredient-art pmh-${type}`}></div>
              <h3>{name}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pmh-section">
        <div className="pmh-eyebrow">REAL PEOPLE. REAL RESULTS</div>
        <h2>Loved by Thousands of Happy Customers</h2>
        <div className="pmh-review-grid">
          {reviews.map(([name, quote], index) => (
            <article className="pmh-review" key={name}>
              <div className="pmh-person"><span>{name[0]}</span><button aria-label="play video"><Play size={28} fill="currentColor" /></button></div>
              <div><p>"{quote}"</p><strong>{name}</strong><Stars /></div>
            </article>
          ))}
        </div>
      </section>

      <section className="pmh-proof">
        <div className="pmh-choice">
          <div className="pmh-medal">BEST<br />CHOICE</div>
          <HerbBottle compact />
        </div>
        <div className="pmh-table-wrap">
          <div className="pmh-eyebrow">WHY CHOOSE PLAYMOREHERBS?</div>
          <h2>We're Better Than Others</h2>
          <table>
            <thead><tr><th>FEATURES</th><th>PLAYMOREHERBS</th><th>OTHERS</th></tr></thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row}><td>{row}</td><td><Check size={24} /></td><td><X size={22} /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="pmh-discount">
          <span>LIMITED TIME OFFER</span>
          <h3>MEGA DISCOUNT</h3>
          <p>UPTO</p>
          <strong>30%</strong>
          <em>OFF</em>
          <button>HURRY! OFFER ENDING SOON</button>
          <div className="pmh-timer"><b>02</b><b>18</b><b>45</b><small>HRS</small><small>MINS</small><small>SECS</small></div>
        </aside>
      </section>

      <section className="pmh-section pmh-faqs">
        <div className="pmh-eyebrow">FAQS</div>
        <h2>Frequently Asked Questions</h2>
        <div className="pmh-faq-grid">
          {["Is PlayMoreHerbs safe to use?", "How long does it take to see results?", "Are there any side effects?", "How should I take PlayMoreHerbs?", "Is it suitable for all age groups?", "What makes it different from others?"].map((faq) => (
            <button key={faq}>{faq}<span>+</span></button>
          ))}
        </div>
      </section>

      <section className="pmh-bottom-cta">
        <div><Truck size={34} /><strong>FREE SHIPPING</strong><span>On All Prepaid Orders</span></div>
        <button>BUY NOW - GET BEST DEAL <small>100% Safe Checkout | Cash on Delivery Available</small></button>
        <div><MessageCircle size={34} /><strong>ORDER ON WHATSAPP</strong><span>Get Instant Support</span></div>
      </section>

      <section className="pmh-trust-row">
        <span><Leaf size={18} />100% Natural Ayurvedic Formula</span>
        <span><ShieldCheck size={18} />GMP Certified Quality Assured</span>
        <span><LockKeyhole size={18} />Secure Payment SSL Safe & Secure</span>
        <span><PackageCheck size={18} />Cash on Delivery Available</span>
      </section>
    </main>
  );
}
