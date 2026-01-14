'use client';

/**
 * Tavlo Restaurant ERP - Premium Landing Page
 * 
 * Professional landing page with engaging animations,
 * trust signals, detailed features, and premium aesthetics.
 * 
 * @component LandingPage
 * @route /
 */

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './landing.module.css';

// Animated Counter Hook
const useCountUp = (end: number, duration: number = 2000, startOnView: boolean = true) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasStarted(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return { count, ref };
};

// Icon Components
const QRIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="3" height="3" />
    <path d="M17 17h4v4M17 21h4M21 17v4" />
  </svg>
);

const DashboardIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const BrainIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 4.5a2.5 2.5 0 00-4.96-.46 2.5 2.5 0 00-1.98 3 2.5 2.5 0 00-.1 4.96 2.5 2.5 0 002.54 3 2.5 2.5 0 004.5 0 2.5 2.5 0 002.54-3 2.5 2.5 0 00-.1-4.96 2.5 2.5 0 00-1.98-3A2.5 2.5 0 0012 4.5" />
    <path d="M12 4.5V20M12 8l4 4m-8 0l4-4" />
  </svg>
);

const StockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 3v18h18" />
    <path d="M18 17V9l-4 4-3-3-4 4" />
  </svg>
);

const ChefIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 13.87A4 4 0 017.41 6a5.11 5.11 0 011.05-1.54 5 5 0 017.08 0A5.11 5.11 0 0116.59 6 4 4 0 0118 13.87V21H6v-7.13z" />
    <line x1="6" y1="17" x2="18" y2="17" />
  </svg>
);

const RocketIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9,12 11,14 15,10" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

// Theme Toggle Icons
const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Animated stats
  const stat1 = useCountUp(40, 2000);
  const stat2 = useCountUp(99, 2000);
  const stat3 = useCountUp(500, 2000);

  // Theme effect
  useEffect(() => {
    const savedTheme = localStorage.getItem('tavlo-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('tavlo-theme', newTheme);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <QRIcon />,
      title: "QR-Based Ordering",
      subtitle: "No App Downloads Required",
      description: "Customers scan, browse a premium menu interface, customize dishes with allergen preferences, and pay instantly — all from their phone.",
      benefits: ["Real-time menu updates", "Dietary customization", "Multiple payment options", "Table-specific ordering"]
    },
    {
      icon: <DashboardIcon />,
      title: "Synchronized Dashboards",
      subtitle: "Kitchen & Service Coordination",
      description: "Orders route instantly to the Chef Dashboard for prioritized prep and the Waiter Screen for perfectly timed serving.",
      benefits: ["Real-time order routing", "Priority queue management", "Course timing control", "Table status tracking"]
    },
    {
      icon: <ChefIcon />,
      title: "Admin ERP Suite",
      subtitle: "Complete Business Control",
      description: "A powerful central hub for inventory management, menu editing, staff scheduling, and comprehensive business analytics.",
      benefits: ["Inventory automation", "Staff management", "Financial reporting", "Multi-location support"]
    },
    {
      icon: <StockIcon />,
      title: "Smart Automation",
      subtitle: "AI-Powered Operations",
      description: "Predictive stock tracking that auto-disables out-of-stock items and alerts you before ingredients run out.",
      benefits: ["Auto stock alerts", "Waste reduction", "Supplier integration", "Demand forecasting"]
    }
  ];

  return (
    <div className={`${styles.landing} ${theme === 'light' ? styles.lightTheme : ''}`}>
      {/* Navigation */}
      <nav className={`${styles.nav} ${isScrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.navLogo}>
            <Image src="/images/tavlo-logo.png" alt="Tavlo" width={120} height={40} priority />
          </Link>
          <div className={styles.navLinks}>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#ai-edge">AI Edge</a>
            <a href="#testimonials">Testimonials</a>
          </div>
          <div className={styles.navActions}>
            <button
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <Link href="/signin" className={styles.navSignin}>Sign In</Link>
            <Link href="/signup" className={styles.navCta}>
              Start Free Trial
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow}></div>
        <div className={styles.heroGlowSecondary}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot}></span>
            <span>Trusted by 500+ Restaurants</span>
            <div className={styles.badgeRating}>
              {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
            </div>
          </div>

          <h1 className={styles.heroTitle}>
            The AI-Powered Brain for
            <span className={styles.heroHighlight}> Modern Dine-In Restaurants</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Replace traditional workflows with a unified digital infrastructure.
            Connect customers, kitchen staff, waiters, and owners in real-time.
          </p>

          <div className={styles.heroValueProps}>
            <div className={styles.valueProp}>
              <CheckIcon />
              <span>Zero Order Errors</span>
            </div>
            <div className={styles.valueProp}>
              <CheckIcon />
              <span>40% Labor Cost Reduction</span>
            </div>
            <div className={styles.valueProp}>
              <CheckIcon />
              <span>2x Faster Service</span>
            </div>
          </div>

          <div className={styles.heroCtas}>
            <Link href="/signup" className={styles.ctaPrimary}>
              Start Free 14-Day Trial
              <ArrowRightIcon />
            </Link>
            <button className={styles.ctaVideo}>
              <div className={styles.playButton}>
                <PlayIcon />
              </div>
              <span>Watch Demo</span>
            </button>
          </div>

          <div className={styles.heroTrust}>
            <p>Trusted by India's leading restaurants</p>
            <div className={styles.trustLogos}>
              <span className={styles.trustLogo}>Spice Route</span>
              <span className={styles.trustLogo}>The Grand Café</span>
              <span className={styles.trustLogo}>Masala House</span>
              <span className={styles.trustLogo}>Urban Bites</span>
            </div>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.mockupWrapper}>
            <div className={styles.mockupGlow}></div>
            <div className={styles.mockupFrame}>
              <div className={styles.mockupHeader}>
                <div className={styles.mockupDots}>
                  <span></span><span></span><span></span>
                </div>
                <span className={styles.mockupUrl}>tavlo.app/dashboard</span>
              </div>
              <Image
                src="/loginimage.svg"
                alt="Tavlo Dashboard Preview"
                width={550}
                height={380}
                className={styles.mockupImage}
                priority
              />
            </div>
            <div className={styles.floatingCard} style={{ top: '10%', right: '-10%' }}>
              <div className={styles.floatingCardIcon}>📊</div>
              <div className={styles.floatingCardContent}>
                <span className={styles.floatingCardValue}>+28%</span>
                <span className={styles.floatingCardLabel}>Revenue Growth</span>
              </div>
            </div>
            <div className={styles.floatingCard} style={{ bottom: '15%', left: '-8%' }}>
              <div className={styles.floatingCardIcon}>⚡</div>
              <div className={styles.floatingCardContent}>
                <span className={styles.floatingCardValue}>2.3s</span>
                <span className={styles.floatingCardLabel}>Avg Order Time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <div className={styles.statCard} ref={stat1.ref}>
            <div className={styles.statIcon}><UsersIcon /></div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{stat1.count}%</span>
              <span className={styles.statLabel}>Labor Cost Reduction</span>
              <span className={styles.statDescription}>Average savings across all customers</span>
            </div>
          </div>
          <div className={styles.statCard} ref={stat2.ref}>
            <div className={styles.statIcon}><ShieldIcon /></div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{stat2.count}%</span>
              <span className={styles.statLabel}>Order Accuracy</span>
              <span className={styles.statDescription}>Virtually eliminate order errors</span>
            </div>
          </div>
          <div className={styles.statCard} ref={stat3.ref}>
            <div className={styles.statIcon}><ClockIcon /></div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{stat3.count}+</span>
              <span className={styles.statLabel}>Restaurants Powered</span>
              <span className={styles.statDescription}>And growing every day</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className={styles.problemSection} id="problem">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>The Challenge</span>
            <h2 className={styles.sectionTitle}>Traditional Restaurants Are Bleeding Money</h2>
            <p className={styles.sectionSubtitle}>Manual processes create bottlenecks that cost you customers and profits</p>
          </div>
          <div className={styles.problemGrid}>
            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>❌</div>
              <h3>Order Errors</h3>
              <p>Manual order-taking leads to miscommunication, wrong dishes, and unhappy customers</p>
              <span className={styles.problemStat}>~15% of orders have errors</span>
            </div>
            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>⏱️</div>
              <h3>Slow Service</h3>
              <p>Human dependency creates bottlenecks during peak hours when you need speed most</p>
              <span className={styles.problemStat}>12+ min average wait time</span>
            </div>
            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>💸</div>
              <h3>High Labor Costs</h3>
              <p>Over-staffing to handle inefficient manual processes drains your margins</p>
              <span className={styles.problemStat}>35% of revenue on labor</span>
            </div>
            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>📋</div>
              <h3>Data Blindness</h3>
              <p>No insights into what's selling, what's wasted, or how to optimize</p>
              <span className={styles.problemStat}>₹50K+ monthly food waste</span>
            </div>
          </div>
          <div className={styles.solutionBanner}>
            <div className={styles.solutionContent}>
              <span className={styles.solutionLabel}>The Solution</span>
              <h3>Tavlo Digitizes Everything</h3>
              <p>From QR-based customer ordering to synchronized kitchen dashboards — creating a paperless, error-free environment that delights customers.</p>
            </div>
            <Link href="/signup" className={styles.solutionCta}>
              See How It Works
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection} id="features">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Product Features</span>
            <h2 className={styles.sectionTitle}>Everything You Need to Run a Modern Restaurant</h2>
            <p className={styles.sectionSubtitle}>A complete digital ecosystem designed for efficiency and growth</p>
          </div>

          <div className={styles.featuresLayout}>
            <div className={styles.featuresTabs}>
              {features.map((feature, index) => (
                <button
                  key={index}
                  className={`${styles.featureTab} ${activeFeature === index ? styles.featureTabActive : ''}`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className={styles.featureTabIcon}>{feature.icon}</div>
                  <div className={styles.featureTabContent}>
                    <h4>{feature.title}</h4>
                    <p>{feature.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className={styles.featureDetail}>
              <div className={styles.featureDetailHeader}>
                <div className={styles.featureDetailIcon}>{features[activeFeature].icon}</div>
                <div>
                  <h3>{features[activeFeature].title}</h3>
                  <span>{features[activeFeature].subtitle}</span>
                </div>
              </div>
              <p className={styles.featureDetailDescription}>{features[activeFeature].description}</p>
              <ul className={styles.featureDetailBenefits}>
                {features[activeFeature].benefits.map((benefit, i) => (
                  <li key={i}>
                    <CheckIcon />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className={styles.featureDetailCta}>
                Try {features[activeFeature].title}
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorksSection} id="how-it-works">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>How It Works</span>
            <h2 className={styles.sectionTitle}>Get Started in 3 Simple Steps</h2>
            <p className={styles.sectionSubtitle}>Go live in under 24 hours with our guided onboarding</p>
          </div>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>01</div>
              <div className={styles.stepContent}>
                <h3>Set Up Your Restaurant</h3>
                <p>Add your menu, tables, and staff in minutes with our intuitive setup wizard. Import from existing systems or start fresh.</p>
              </div>
            </div>
            <div className={styles.stepConnector}></div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>02</div>
              <div className={styles.stepContent}>
                <h3>Generate QR Codes</h3>
                <p>Get unique QR codes for each table. Print them or use our premium table tents. Customers scan and order instantly.</p>
              </div>
            </div>
            <div className={styles.stepConnector}></div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>03</div>
              <div className={styles.stepContent}>
                <h3>Go Live & Grow</h3>
                <p>Watch orders flow in real-time. Track analytics, optimize operations, and scale your business with AI-powered insights.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Edge Section */}
      <section className={styles.aiSection} id="ai-edge">
        <div className={styles.aiGlow}></div>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTagAi}>✨ The AI Advantage</span>
            <h2 className={styles.sectionTitleLight}>Powered by Proprietary AI</h2>
            <p className={styles.sectionSubtitleLight}>Our AI analyzes patterns to give you a competitive edge</p>
          </div>

          <div className={styles.aiGrid}>
            <div className={styles.aiCard}>
              <div className={styles.aiCardGlow}></div>
              <div className={styles.aiCardIcon}>💰</div>
              <h3>Smart Pricing</h3>
              <p>AI-driven recommendations for optimal menu pricing based on demand, competition, and profit margins.</p>
              <span className={styles.aiCardStat}>+18% avg margin improvement</span>
            </div>
            <div className={styles.aiCard}>
              <div className={styles.aiCardGlow}></div>
              <div className={styles.aiCardIcon}>📊</div>
              <h3>Stock Prediction</h3>
              <p>Predictive analytics minimize food waste and ensure you never run out of bestselling items.</p>
              <span className={styles.aiCardStat}>-32% food waste reduction</span>
            </div>
            <div className={styles.aiCard}>
              <div className={styles.aiCardGlow}></div>
              <div className={styles.aiCardIcon}>🎯</div>
              <h3>Personalization</h3>
              <p>Context-aware suggestions like "Most Ordered Tonight" increase average order value.</p>
              <span className={styles.aiCardStat}>+22% avg order value</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonialsSection} id="testimonials">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Testimonials</span>
            <h2 className={styles.sectionTitle}>Loved by Restaurant Owners</h2>
            <p className={styles.sectionSubtitle}>Join 500+ restaurants transforming their operations with Tavlo</p>
          </div>
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialRating}>
                {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
              </div>
              <p className={styles.testimonialText}>"Tavlo transformed how we operate. Order errors dropped to nearly zero, and our staff can now focus on hospitality instead of paperwork. Best decision we made."</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>RK</div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>Rajesh Kumar</span>
                  <span className={styles.authorRole}>Owner, Spice Garden Restaurant</span>
                  <span className={styles.authorLocation}>Mumbai, Maharashtra</span>
                </div>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialRating}>
                {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
              </div>
              <p className={styles.testimonialText}>"The AI-powered insights helped us optimize our menu pricing. We saw a 25% increase in profit margins within the first month! The ROI was immediate."</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>PS</div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>Priya Sharma</span>
                  <span className={styles.authorRole}>Manager, The Urban Café</span>
                  <span className={styles.authorLocation}>Bangalore, Karnataka</span>
                </div>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialRating}>
                {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
              </div>
              <p className={styles.testimonialText}>"Our customers love the QR ordering system. No more waiting for servers, and the kitchen gets orders instantly. We've expanded to 3 more locations!"</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>AM</div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>Amit Mehta</span>
                  <span className={styles.authorRole}>Founder, Mehta's Kitchen</span>
                  <span className={styles.authorLocation}>Delhi NCR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className={styles.visionSection} id="vision">
        <div className={styles.sectionContainer}>
          <div className={styles.visionContent}>
            <div className={styles.visionText}>
              <span className={styles.sectionTag}>Future Vision</span>
              <h2 className={styles.sectionTitle}>Revolutionizing Hospitality in India</h2>
              <p className={styles.visionDescription}>
                Tavlo is building the standard digital infrastructure for the next generation of
                restaurant chains. We're bringing voice-based AI ordering, predictive analytics,
                and cross-location intelligence to transform how the hospitality industry operates.
              </p>
              <div className={styles.visionFeatures}>
                <div className={styles.visionFeature}>
                  <div className={styles.visionFeatureIcon}><RocketIcon /></div>
                  <div>
                    <h4>Voice-Powered Ordering</h4>
                    <p>Order hands-free with conversational AI assistants</p>
                  </div>
                </div>
                <div className={styles.visionFeature}>
                  <div className={styles.visionFeatureIcon}><BrainIcon /></div>
                  <div>
                    <h4>Cross-Branch Intelligence</h4>
                    <p>Unified insights and optimization across all locations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow}></div>
        <div className={styles.sectionContainer}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Transform Your Restaurant?</h2>
            <p className={styles.ctaSubtitle}>Join 500+ restaurants already saving time and money with Tavlo</p>
            <div className={styles.ctaFeatures}>
              <span><CheckIcon /> Free 14-day trial</span>
              <span><CheckIcon /> No credit card required</span>
              <span><CheckIcon /> Setup in 24 hours</span>
            </div>
            <div className={styles.ctaButtons}>
              <Link href="/signup" className={styles.ctaPrimaryLarge}>
                Start Your Free Trial
                <ArrowRightIcon />
              </Link>
              <Link href="/signin" className={styles.ctaSecondaryLight}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerBrand}>
            <Image src="/images/tavlo-logo.png" alt="Tavlo" width={100} height={35} />
            <p>The AI-Powered Brain for Modern Dine-In Restaurants</p>
            <div className={styles.footerSocials}>
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="Instagram">📷</a>
            </div>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it Works</a>
              <a href="#ai-edge">AI Edge</a>
              <a href="#">Pricing</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Documentation</a>
              <a href="#">API</a>
              <a href="#">Status</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 Tavlo Technologies Pvt. Ltd. All rights reserved.</p>
          <p className={styles.footerMadeIn}>Made with ❤️ in India</p>
        </div>
      </footer>
    </div>
  );
}
