export const CONVERSATION_TREE = {

  // ─────────────────────────────────────────────
  // ROOT
  // ─────────────────────────────────────────────
  root: {
    message: "Hi! I'm the ShopifyPro assistant. We specialize in Shopify development, SEO, and conversion optimization. What can I help you with today?",
    options: [
      { label: "Explore our services", next: "services" },
      { label: "View pricing", next: "pricing" },
      { label: "Our process & timeline", next: "process" },
      { label: "Technical questions", next: "technical" },
      { label: "Support & maintenance", next: "support_packages" },
      { label: "Marketing & growth tips", next: "marketing" },
      { label: "Compare platforms", next: "compare_platforms" },
      { label: "Shopify plans guide", next: "shopify_plans" },
      { label: "Getting started", next: "getting_started" },
      { label: "About us", next: "about_us" },
      { label: "Talk to a human", next: "contact" },
    ],
  },

  // ─────────────────────────────────────────────
  // SERVICES BRANCH — Hub
  // ─────────────────────────────────────────────
  services: {
    message: "We offer six core Shopify services. Each one is delivered by a specialist with hands-on Shopify experience. Which area interests you?",
    options: [
      { label: "Store Setup ($499)", next: "svc_setup" },
      { label: "Custom Theme Dev ($1,999)", next: "svc_theme" },
      { label: "SEO Optimization ($799)", next: "svc_seo" },
      { label: "App Development ($1,499)", next: "svc_app" },
      { label: "Store Migration ($999)", next: "svc_migration" },
      { label: "CRO ($1,299)", next: "svc_cro" },
    ],
  },

  // ─────────────────────────────────────────────
  // SERVICE 1 — Store Setup
  // ─────────────────────────────────────────────
  svc_setup: {
    message: "Our Store Setup package ($499) gets your Shopify store fully operational in 5–7 business days. It includes theme installation, up to 50 product uploads, payment gateway configuration, domain connection, and a basic SEO foundation.",
    options: [
      { label: "What exactly is included?", next: "setup_included" },
      { label: "How long will it take?", next: "setup_timeline" },
      { label: "Can I add products myself later?", next: "setup_cms" },
      { label: "Get started", next: "contact" },
    ],
  },

  setup_included: {
    message: "The $499 setup covers: theme selection and customization, up to 50 product uploads with variants, Shopify Payments or PayPal setup, domain/DNS configuration, Google Analytics 4 integration, and a mobile-responsiveness check across 5 device sizes.",
    options: [
      { label: "What if I need more than 50 products?", next: "setup_more_products" },
      { label: "Do you set up shipping rates?", next: "setup_shipping" },
      { label: "Back to Store Setup", next: "svc_setup" },
      { label: "Get a quote", next: "contact" },
    ],
  },

  setup_timeline: {
    message: "A standard store setup is completed in 5–7 business days from the moment we receive your assets (logo, product images, copy). Rush delivery in 48–72 hours is available for an additional fee.",
    options: [
      { label: "What assets do I need to provide?", next: "setup_assets" },
      { label: "What about ongoing support?", next: "support_packages" },
      { label: "Back to Store Setup", next: "svc_setup" },
    ],
  },

  setup_cms: {
    message: "Yes — Shopify's admin is one of the most intuitive content management systems available. After handoff we run a 30-minute walkthrough so you can confidently update products, prices, banners, and pages without touching a single line of code.",
    options: [
      { label: "Do you offer training?", next: "setup_training" },
      { label: "What about ongoing maintenance?", next: "support_packages" },
      { label: "Back to Store Setup", next: "svc_setup" },
    ],
  },

  setup_more_products: {
    message: "No problem. Beyond the first 50 products, we charge $2 per additional product upload with full variant and metadata entry. For catalogues of 500+ SKUs, we use bulk import via CSV to keep costs efficient.",
    options: [
      { label: "Do you handle product photography?", next: "product_photography" },
      { label: "Back to Store Setup", next: "svc_setup" },
      { label: "Get a custom quote", next: "contact" },
    ],
  },

  setup_shipping: {
    message: "Yes. We configure domestic and international shipping zones, flat-rate and weight-based rules, and carrier-calculated rates (UPS, FedEx, DHL, USPS). We also set up free shipping thresholds, which average a 23% increase in order value.",
    options: [
      { label: "Back to Store Setup", next: "svc_setup" },
      { label: "Get started", next: "contact" },
    ],
  },

  setup_assets: {
    message: "You'll need: your logo (SVG or high-res PNG), product images (minimum 2048×2048px), product descriptions, your domain login credentials, and any brand color/font guidelines. We handle everything else.",
    options: [
      { label: "I don't have a logo yet", next: "no_logo" },
      { label: "Back to Store Setup", next: "svc_setup" },
    ],
  },

  setup_training: {
    message: "Every project includes a complimentary 30-minute Loom video walkthrough plus a written admin guide. Extended live training sessions (60–90 min via Zoom) are available for $99 per session for teams.",
    options: [
      { label: "Back to Store Setup", next: "svc_setup" },
      { label: "Explore other services", next: "services" },
    ],
  },

  // ─────────────────────────────────────────────
  // SERVICE 2 — Custom Theme Development
  // ─────────────────────────────────────────────
  svc_theme: {
    message: "Our Custom Theme Development service ($1,999) delivers a pixel-perfect, brand-specific Shopify 2.0 theme built from scratch using Liquid, JavaScript, and CSS. Average store speed score: 92/100 on Google PageSpeed.",
    options: [
      { label: "What's included in the theme build?", next: "theme_included" },
      { label: "How long does it take?", next: "theme_timeline" },
      { label: "What is Shopify 2.0?", next: "shopify_2" },
      { label: "See our theme work", next: "theme_portfolio" },
    ],
  },

  theme_included: {
    message: "The theme build includes: custom UI/UX design in Figma, unlimited design revisions during the design phase, full Liquid development, section-based drag-and-drop customization, mega menu, custom collection filters, cart drawer, and 60 days of bug-fix support post-launch.",
    options: [
      { label: "Do you include animations?", next: "theme_animations" },
      { label: "Will it work on mobile?", next: "theme_mobile" },
      { label: "Back to Custom Theme", next: "svc_theme" },
      { label: "Get a quote", next: "contact" },
    ],
  },

  theme_timeline: {
    message: "Custom theme development runs 4–6 weeks: Week 1 is discovery and wireframing, Weeks 2–3 are design in Figma, Weeks 4–5 are Liquid development, and Week 6 is QA across 12+ device/browser combinations. Complex builds may extend to 8 weeks.",
    options: [
      { label: "Can it be done faster?", next: "theme_rush" },
      { label: "What's the design approval process?", next: "theme_approval" },
      { label: "Back to Custom Theme", next: "svc_theme" },
    ],
  },

  shopify_2: {
    message: "Shopify 2.0 (released 2021) introduced sections on every page, app blocks, metafields, and improved JSON templates. Stores built on 2.0 load up to 35% faster and give merchants far greater flexibility to customise layouts without a developer.",
    options: [
      { label: "Does my current theme use 2.0?", next: "check_theme_version" },
      { label: "Back to Custom Theme", next: "svc_theme" },
      { label: "Upgrade my existing theme", next: "contact" },
    ],
  },

  theme_portfolio: {
    message: "We've built themes for SpaCeylon (luxury ayurvedic brand, +280% conversions), Silk & Willow (sustainable wedding textiles, +220% conversions), and Herbivore Botanicals (natural skincare, 1.8s load time, 60K+ customers). Every theme is custom to the brand.",
    options: [
      { label: "What industries do you specialise in?", next: "theme_industries" },
      { label: "Back to Custom Theme", next: "svc_theme" },
      { label: "Start a project", next: "contact" },
    ],
  },

  theme_animations: {
    message: "Yes. We implement performance-safe animations using CSS transitions and the Intersection Observer API — no heavy libraries that tank your PageSpeed score. We include scroll-reveal effects, hover states, parallax sections, and loading transitions.",
    options: [
      { label: "Back to Custom Theme", next: "svc_theme" },
      { label: "Get a quote", next: "contact" },
    ],
  },

  theme_mobile: {
    message: "Absolutely. We use a mobile-first methodology — design and code for small screens first, then scale up. With 72% of Shopify traffic coming from mobile devices, responsive perfection across iOS and Android is non-negotiable on every build.",
    options: [
      { label: "Back to Custom Theme", next: "svc_theme" },
      { label: "Explore other services", next: "services" },
    ],
  },

  theme_rush: {
    message: "Rush delivery (2–3 week turnaround) is available with a 30% premium on the project total. This requires that all brand assets and design decisions be approved within 24 hours of each milestone to keep momentum.",
    options: [
      { label: "Back to Custom Theme", next: "svc_theme" },
      { label: "Request a rush quote", next: "contact" },
    ],
  },

  theme_approval: {
    message: "We share Figma prototypes for your review and approval before writing a single line of code. You get two rounds of revisions at the design stage and two rounds during development. We move to the next phase only once you've signed off.",
    options: [
      { label: "Back to Custom Theme", next: "svc_theme" },
      { label: "Get started", next: "contact" },
    ],
  },

  theme_industries: {
    message: "We've built custom themes across fashion, luxury goods, beauty, sustainable brands, food & beverage, home goods, and B2B wholesale. Industry knowledge matters — we know what conversion patterns work for each vertical.",
    options: [
      { label: "Back to Custom Theme", next: "svc_theme" },
      { label: "Start a project", next: "contact" },
    ],
  },

  // ─────────────────────────────────────────────
  // SERVICE 3 — SEO Optimization
  // ─────────────────────────────────────────────
  svc_seo: {
    message: "Our Shopify SEO Optimization package ($799) covers a full technical audit, on-page optimization, schema markup, and a 3-month traffic growth roadmap. Clients average a 180% increase in organic traffic within 90 days.",
    options: [
      { label: "What does the audit cover?", next: "seo_audit" },
      { label: "How long until I see results?", next: "seo_timeline" },
      { label: "Do you do ongoing SEO?", next: "seo_ongoing" },
      { label: "Will it help with Google rankings?", next: "seo_rankings" },
    ],
  },

  seo_audit: {
    message: "The SEO audit covers 120+ checkpoints: site speed, Core Web Vitals, crawlability, duplicate content, canonical tags, structured data, meta title/description quality, internal linking, image alt text, and mobile usability. You receive a prioritized fix report.",
    options: [
      { label: "What is Core Web Vitals?", next: "core_web_vitals" },
      { label: "Do you fix the issues too?", next: "seo_fixes" },
      { label: "Back to SEO", next: "svc_seo" },
      { label: "Get started", next: "contact" },
    ],
  },

  seo_timeline: {
    message: "SEO is a 3–6 month discipline. Technical fixes show impact in 4–8 weeks. Content and link-building results compound over 3–6 months. Our client Fly By Jing saw +300% organic traffic in 4 months; Emily Chen's store saw +200% in 3 months.",
    options: [
      { label: "What if I need faster results?", next: "seo_vs_ads" },
      { label: "Back to SEO", next: "svc_seo" },
    ],
  },

  seo_ongoing: {
    message: "Yes. Our monthly SEO retainer starts at $399/month and includes keyword rank tracking, 4 new optimized collection/blog pages, backlink outreach, and a monthly performance report with actionable recommendations.",
    options: [
      { label: "What tools do you use?", next: "seo_tools" },
      { label: "Back to SEO", next: "svc_seo" },
      { label: "Get a proposal", next: "contact" },
    ],
  },

  seo_rankings: {
    message: "We focus on commercial-intent keywords — the searches that lead to purchases. By optimizing collection pages, product schema, and breadcrumb markup, our clients consistently reach Page 1 for high-value queries in their niche within 60–90 days.",
    options: [
      { label: "Do you do local SEO?", next: "seo_local" },
      { label: "Back to SEO", next: "svc_seo" },
      { label: "Get started", next: "contact" },
    ],
  },

  core_web_vitals: {
    message: "Core Web Vitals are Google's three user-experience metrics: LCP (Largest Contentful Paint, ideally under 2.5s), INP (Interaction to Next Paint, under 200ms), and CLS (Cumulative Layout Shift, under 0.1). Passing all three is a confirmed Google ranking signal.",
    options: [
      { label: "Back to SEO Audit", next: "seo_audit" },
      { label: "Fix my Core Web Vitals", next: "contact" },
    ],
  },

  seo_fixes: {
    message: "Yes — the $799 package includes both the audit and full implementation of all identified fixes. This is not an audit-only service. We optimize meta tags, fix crawl errors, implement schema markup, and compress images automatically using Shopify's CDN.",
    options: [
      { label: "Back to SEO", next: "svc_seo" },
      { label: "Get started", next: "contact" },
    ],
  },

  seo_tools: {
    message: "We use Ahrefs for keyword research and backlink analysis, Google Search Console and GA4 for performance tracking, Screaming Frog for crawl audits, and Schema.org markup validators. All tools are industry-standard.",
    options: [
      { label: "Back to SEO", next: "svc_seo" },
      { label: "Explore other services", next: "services" },
    ],
  },

  seo_local: {
    message: "Yes. For brick-and-mortar or regional brands we configure Google Business Profile, local schema markup (LocalBusiness, GeoCoordinates), city-targeted landing pages, and citation building across 50+ directories.",
    options: [
      { label: "Back to SEO", next: "svc_seo" },
      { label: "Get a local SEO quote", next: "contact" },
    ],
  },

  seo_vs_ads: {
    message: "For immediate traffic, we recommend pairing SEO with Google Shopping Ads or Meta Ads. We can refer you to our paid media partners or consult on a blended strategy. SEO is the long-term moat; paid ads are the short-term accelerant.",
    options: [
      { label: "Back to SEO", next: "svc_seo" },
      { label: "Explore CRO to improve ad ROI", next: "svc_cro" },
    ],
  },

  // ─────────────────────────────────────────────
  // SERVICE 4 — App Development
  // ─────────────────────────────────────────────
  svc_app: {
    message: "Our App Development service ($1,499 starting) covers custom private Shopify apps, public app development for the App Store, and complex third-party API integrations. We build using Shopify's latest Remix-based app framework and GraphQL Admin API.",
    options: [
      { label: "What kind of apps can you build?", next: "app_types" },
      { label: "How long does app development take?", next: "app_timeline" },
      { label: "Private app vs. public app?", next: "app_private_vs_public" },
      { label: "Integrations I already need", next: "app_integrations" },
    ],
  },

  app_types: {
    message: "We build: subscription and loyalty apps, custom product configurators, inventory sync tools (Shopify ↔ ERP/WMS), wholesale B2B portals, bundle builders, quiz-based recommendation engines, and real-time shipping-rate calculators. If it has an API, we can connect it.",
    options: [
      { label: "Do you list apps on the Shopify App Store?", next: "app_store_listing" },
      { label: "How much will my custom app cost?", next: "app_pricing" },
      { label: "Back to App Dev", next: "svc_app" },
    ],
  },

  app_timeline: {
    message: "A private app with well-defined requirements typically takes 2–4 weeks. Complex multi-feature apps or public App Store submissions run 6–10 weeks, including Shopify's review process (which averages 5–7 business days). We provide sprint-based progress updates.",
    options: [
      { label: "What do you need from me to start?", next: "app_requirements" },
      { label: "Back to App Dev", next: "svc_app" },
      { label: "Get a scoping call", next: "contact" },
    ],
  },

  app_private_vs_public: {
    message: "A private app lives only in your store and is faster to build ($1,499+). A public app can be listed on the Shopify App Store for other merchants to install, requiring Shopify's review and OAuth authentication ($3,500+ depending on scope). Both are built on the same Remix/Node.js stack.",
    options: [
      { label: "I need a private app for my store", next: "contact" },
      { label: "I want to publish on the App Store", next: "app_store_listing" },
      { label: "Back to App Dev", next: "svc_app" },
    ],
  },

  app_integrations: {
    message: "We integrate Shopify with: Klaviyo, Mailchimp, HubSpot, Salesforce, ShipStation, Shippo, EasyPost, QuickBooks, Xero, NetSuite, Gorgias, Zendesk, Stripe, and 50+ other platforms via REST or GraphQL APIs. Ask us about your specific stack.",
    options: [
      { label: "Back to App Dev", next: "svc_app" },
      { label: "Get started", next: "contact" },
    ],
  },

  app_store_listing: {
    message: "We handle the full App Store submission: OAuth setup, billing API integration, Shopify CLI scaffold, embedded app UI with Polaris design system, and submission documentation. We've navigated Shopify's review process multiple times and know how to get approvals first time.",
    options: [
      { label: "Back to App Dev", next: "svc_app" },
      { label: "Discuss a public app project", next: "contact" },
    ],
  },

  app_pricing: {
    message: "Private apps start at $1,499 for single-feature tools. Multi-feature apps with dashboards and webhook systems typically range $3,000–$6,000. Public App Store builds with billing and OAuth start at $3,500. We provide fixed-price quotes after a free 30-minute scoping call.",
    options: [
      { label: "Book a scoping call", next: "contact" },
      { label: "Back to App Dev", next: "svc_app" },
    ],
  },

  app_requirements: {
    message: "To scope your app we need: a description of the problem you're solving, the platforms/APIs to connect, expected monthly active users, and any wireframes or references. A one-page brief is enough to get a fixed quote from us within 24 hours.",
    options: [
      { label: "Send a brief", next: "contact" },
      { label: "Back to App Dev", next: "svc_app" },
    ],
  },

  // ─────────────────────────────────────────────
  // SERVICE 5 — Store Migration
  // ─────────────────────────────────────────────
  svc_migration: {
    message: "Our Store Migration service ($999) moves your entire store — products, customers, orders, and SEO equity — from any platform to Shopify with zero data loss and zero downtime. We've migrated stores from WooCommerce, Magento, BigCommerce, Wix, and Squarespace.",
    options: [
      { label: "What data gets migrated?", next: "migration_data" },
      { label: "Will my SEO rankings be safe?", next: "migration_seo" },
      { label: "How long does migration take?", next: "migration_timeline" },
      { label: "Migrating from WooCommerce", next: "migration_woocommerce" },
    ],
  },

  migration_data: {
    message: "We migrate: all products (with variants, metafields, and images), customer accounts and order history, blog posts and pages, discount codes, and your existing URL structure. Gift card balances and subscription contracts require platform-specific handling discussed during discovery.",
    options: [
      { label: "What about product reviews?", next: "migration_reviews" },
      { label: "Back to Migration", next: "svc_migration" },
      { label: "Get started", next: "contact" },
    ],
  },

  migration_seo: {
    message: "SEO preservation is central to every migration. We implement 301 redirects for every URL, preserve meta titles and descriptions, maintain your sitemap structure, and monitor Google Search Console for 30 days post-launch. Our goal is zero organic traffic loss — and we've achieved it on every migration to date.",
    options: [
      { label: "What about my backlinks?", next: "migration_backlinks" },
      { label: "Back to Migration", next: "svc_migration" },
      { label: "Get a migration plan", next: "contact" },
    ],
  },

  migration_timeline: {
    message: "A typical migration takes 1–2 weeks. The timeline depends on catalogue size: up to 500 products takes 5–7 days; 500–5,000 products takes 10–14 days; 5,000+ products requires a custom timeline. We run a full staging migration before touching the live store.",
    options: [
      { label: "Will there be any downtime?", next: "migration_downtime" },
      { label: "Back to Migration", next: "svc_migration" },
    ],
  },

  migration_woocommerce: {
    message: "WooCommerce to Shopify is our most common migration. We use the Matrixify (Excelify) tool combined with custom scripts to handle WooCommerce's complex attribute and variation structure. Our Maguire Shoes migration achieved zero downtime and a 40% speed boost post-migration.",
    options: [
      { label: "What about WooCommerce plugins?", next: "migration_plugins" },
      { label: "Back to Migration", next: "svc_migration" },
      { label: "Start my migration", next: "contact" },
    ],
  },

  migration_reviews: {
    message: "Yes — we migrate product reviews from Judge.me, Yotpo, Trustpilot, and WooCommerce's native review system. Shopify's native reviews can also be set up as the destination. Review star ratings and verified buyer badges are preserved.",
    options: [
      { label: "Back to Migration", next: "svc_migration" },
      { label: "Get started", next: "contact" },
    ],
  },

  migration_backlinks: {
    message: "Your backlinks point to your domain, not individual URLs — so they are preserved automatically. The 301 redirects we configure ensure that any backlinks to old URL paths pass their full link equity to the new Shopify URLs.",
    options: [
      { label: "Back to Migration", next: "svc_migration" },
      { label: "Explore SEO optimization", next: "svc_seo" },
    ],
  },

  migration_downtime: {
    message: "Zero downtime is our standard. We complete the full migration on a staging Shopify store, then execute a DNS-level cutover during low-traffic hours (typically 2–4am in your timezone). The switch takes under 5 minutes from the customer's perspective.",
    options: [
      { label: "Back to Migration", next: "svc_migration" },
      { label: "Start planning my migration", next: "contact" },
    ],
  },

  migration_plugins: {
    message: "WooCommerce plugins don't transfer — they are WordPress-specific. However, we map each plugin's functionality to a Shopify equivalent (free or paid app) and document the alternatives during the discovery phase. In most cases, Shopify's native features replace 60–70% of common plugins.",
    options: [
      { label: "Back to Migration", next: "svc_migration" },
      { label: "Get started", next: "contact" },
    ],
  },

  // ─────────────────────────────────────────────
  // SERVICE 6 — CRO
  // ─────────────────────────────────────────────
  svc_cro: {
    message: "Our Conversion Rate Optimization service ($1,299) uses data and behavioral analysis to systematically increase the percentage of visitors who buy. The average Shopify store converts at 1.4%; our clients average 3.2% post-engagement.",
    options: [
      { label: "What does a CRO audit cover?", next: "cro_audit" },
      { label: "What is A/B testing?", next: "cro_ab_testing" },
      { label: "How do you fix checkout drop-off?", next: "cro_checkout" },
      { label: "How fast will I see ROI?", next: "cro_roi" },
    ],
  },

  cro_audit: {
    message: "Our CRO audit analyses your full funnel using GA4, Hotjar heatmaps, and session recordings. We identify friction points in product pages, cart, and checkout — then deliver a prioritized 30-point fix list ranked by estimated revenue impact.",
    options: [
      { label: "What gets fixed in the $1,299 package?", next: "cro_included" },
      { label: "Back to CRO", next: "svc_cro" },
      { label: "Book an audit", next: "contact" },
    ],
  },

  cro_ab_testing: {
    message: "A/B testing shows two versions of a page element to different visitor segments and measures which converts better. We use Google Optimize or Optimizely to run statistically significant tests (minimum 95% confidence). We test headlines, CTAs, product images, pricing layouts, and trust signals.",
    options: [
      { label: "How many tests are included?", next: "cro_tests_included" },
      { label: "Back to CRO", next: "svc_cro" },
    ],
  },

  cro_checkout: {
    message: "Checkout is where 70% of cart abandonment happens. We optimize it by enabling Shopify's one-page checkout, adding trust badges and security seals, streamlining form fields, implementing exit-intent popups, and adding buy-now-pay-later options like Klarna and Shop Pay Installments.",
    options: [
      { label: "Can you add Shop Pay?", next: "cro_shop_pay" },
      { label: "Back to CRO", next: "svc_cro" },
      { label: "Fix my checkout", next: "contact" },
    ],
  },

  cro_roi: {
    message: "ROI timelines vary by traffic volume, but clients typically recoup the $1,299 investment within 30–60 days. David Wilson's SportsPro store grew revenue 60% post-CRO. Venus et Fleur saw a +120% increase in average order value after our checkout optimization work.",
    options: [
      { label: "What if it doesn't work?", next: "cro_guarantee" },
      { label: "Back to CRO", next: "svc_cro" },
      { label: "Get started", next: "contact" },
    ],
  },

  cro_included: {
    message: "The $1,299 package includes: full funnel audit report, product page optimization (layout, imagery, social proof), cart page improvements, checkout UX fixes, speed optimizations to reduce bounce rate, and two rounds of revisions based on your feedback over 30 days.",
    options: [
      { label: "Back to CRO", next: "svc_cro" },
      { label: "Get started", next: "contact" },
    ],
  },

  cro_tests_included: {
    message: "The standard package includes setup and monitoring of up to 3 concurrent A/B tests over a 30-day period. We design the variants, configure the testing tool, monitor results, and implement the winning variant. Additional test cycles are available as a monthly retainer from $499/month.",
    options: [
      { label: "Back to CRO", next: "svc_cro" },
      { label: "Get a proposal", next: "contact" },
    ],
  },

  cro_shop_pay: {
    message: "Yes. Shop Pay is available on all Shopify stores and offers one-click checkout for returning buyers. We also implement Klarna, Afterpay, and Affirm for buy-now-pay-later — which typically increases average order value by 30–40% for high-ticket products.",
    options: [
      { label: "Back to CRO", next: "svc_cro" },
      { label: "Explore other services", next: "services" },
    ],
  },

  cro_guarantee: {
    message: "We stand behind our work. If measurable CRO improvements aren't documented within 60 days of implementation (using GA4 data), we will continue working at no additional cost until we achieve a positive result. This is our performance commitment.",
    options: [
      { label: "Back to CRO", next: "svc_cro" },
      { label: "Start a CRO project", next: "contact" },
    ],
  },

  // ─────────────────────────────────────────────
  // PRICING BRANCH
  // ─────────────────────────────────────────────
  pricing: {
    message: "Here is our transparent pricing with no hidden fees. All packages include a free 30-minute discovery call. Which package would you like to explore in detail?",
    options: [
      { label: "Store Setup — $499", next: "price_setup" },
      { label: "Custom Theme Dev — $1,999", next: "price_theme" },
      { label: "SEO Optimization — $799", next: "price_seo" },
      { label: "App Development — from $1,499", next: "price_app" },
      { label: "Store Migration — $999", next: "price_migration" },
      { label: "CRO — $1,299", next: "price_cro" },
    ],
  },

  price_setup: {
    message: "Store Setup is $499 flat — no hourly surprises. This covers the full build as described. Payment is split 50% upfront and 50% on delivery. We accept PayPal, Stripe (all major cards), and bank transfer.",
    options: [
      { label: "What is included for $499?", next: "setup_included" },
      { label: "Do you offer payment plans?", next: "payment_plans" },
      { label: "Compare all prices", next: "pricing" },
      { label: "Get started", next: "contact" },
    ],
  },

  price_theme: {
    message: "Custom Theme Development starts at $1,999 for a single-language standard build. Multi-language stores (Shopify Markets), custom animations, or headless architecture may add $300–$800 depending on scope. A fixed quote is provided after the discovery call.",
    options: [
      { label: "What is included at $1,999?", next: "theme_included" },
      { label: "Do you offer payment plans?", next: "payment_plans" },
      { label: "Compare all prices", next: "pricing" },
      { label: "Get a custom quote", next: "contact" },
    ],
  },

  price_seo: {
    message: "SEO Optimization is $799 for a one-time audit and full implementation. Ongoing monthly SEO management starts at $399/month on a rolling 3-month minimum contract. No lock-in after the initial term.",
    options: [
      { label: "What does the $799 include?", next: "seo_audit" },
      { label: "Monthly SEO retainer details", next: "seo_ongoing" },
      { label: "Compare all prices", next: "pricing" },
      { label: "Get started", next: "contact" },
    ],
  },

  price_app: {
    message: "App Development starts at $1,499 for a single-feature private app. Pricing scales with complexity: $1,499–$3,000 for private apps, $3,500–$8,000+ for public App Store builds. Fixed-price quotes provided within 24 hours of a scoping call.",
    options: [
      { label: "What kind of apps can you build?", next: "app_types" },
      { label: "Do you offer payment plans?", next: "payment_plans" },
      { label: "Compare all prices", next: "pricing" },
      { label: "Book a scoping call", next: "contact" },
    ],
  },

  price_migration: {
    message: "Store Migration is $999 for catalogues up to 500 products. Stores with 500–5,000 products are quoted at $1,499. Enterprise catalogues (5,000+ SKUs) are custom-scoped. The price includes full data migration, SEO redirects, and 30 days post-launch support.",
    options: [
      { label: "What's included in migration?", next: "migration_data" },
      { label: "Do you offer payment plans?", next: "payment_plans" },
      { label: "Compare all prices", next: "pricing" },
      { label: "Plan my migration", next: "contact" },
    ],
  },

  price_cro: {
    message: "CRO is $1,299 for a 30-day intensive engagement covering a full funnel audit, implementation of all fixes, up to 3 A/B tests, and a final performance report. Monthly retainers for ongoing testing start at $499/month.",
    options: [
      { label: "What is included in the audit?", next: "cro_audit" },
      { label: "Do you offer payment plans?", next: "payment_plans" },
      { label: "Compare all prices", next: "pricing" },
      { label: "Start CRO", next: "contact" },
    ],
  },

  payment_plans: {
    message: "All projects use a 50/50 payment split — 50% at kickoff and 50% on final delivery. For projects over $2,500, we offer a three-milestone structure: 40% at kickoff, 30% at design approval, and 30% on delivery. We accept all major cards via Stripe, PayPal, and bank transfer.",
    options: [
      { label: "Do you offer refunds?", next: "refund_policy" },
      { label: "Back to pricing", next: "pricing" },
      { label: "Get started", next: "contact" },
    ],
  },

  refund_policy: {
    message: "Each project includes defined revision rounds. If deliverables don't meet the agreed-upon brief after all revisions, we offer a pro-rated refund based on uncompleted milestones. After final delivery and sign-off, work is considered accepted. All terms are outlined in our project agreement.",
    options: [
      { label: "Back to pricing", next: "pricing" },
      { label: "Start a project", next: "contact" },
    ],
  },

  // ─────────────────────────────────────────────
  // SHARED / CROSS-BRANCH NODES
  // ─────────────────────────────────────────────
  support_packages: {
    message: "We offer three post-launch support tiers: Basic ($99/month) for bug fixes and content updates, Growth ($249/month) with performance monitoring and monthly feature additions, and Pro ($499/month) with a dedicated developer and 4-hour emergency SLA.",
    options: [
      { label: "Basic plan details ($99)", next: "support_basic" },
      { label: "Growth plan details ($249)", next: "support_growth" },
      { label: "Pro plan details ($499)", next: "support_pro" },
      { label: "Emergency support", next: "support_emergency" },
      { label: "Training options", next: "support_training" },
      { label: "Back to main menu", next: "root" },
    ],
  },

  support_basic: {
    message: "The Basic plan ($99/month) covers: Shopify app updates, minor text and image changes, bug fixes identified post-launch, and a monthly 15-minute check-in call. Response time is 1 business day.",
    options: [
      { label: "Tell me about the Growth plan", next: "support_packages" },
      { label: "Back to services", next: "services" },
      { label: "Sign up for support", next: "contact" },
    ],
  },

  product_photography: {
    message: "We partner with professional product photographers across North America, Europe, and the UAE. We can coordinate the shoot brief, reference images, and deliverable specs on your behalf as a project add-on, starting at $299 for coordination.",
    options: [
      { label: "Back to Store Setup", next: "svc_setup" },
      { label: "Explore other services", next: "services" },
    ],
  },

  no_logo: {
    message: "No problem. We partner with brand identity designers who specialise in e-commerce. A logo and basic brand kit (colours, fonts, guidelines) starts at $399 as a project add-on. We can coordinate this as part of your store setup timeline.",
    options: [
      { label: "Back to Store Setup", next: "svc_setup" },
      { label: "Bundle branding + setup", next: "contact" },
    ],
  },

  check_theme_version: {
    message: "To check if your theme uses Shopify 2.0, go to Online Store > Themes in your Shopify admin and look for 'Sections on every page' in the theme description. Alternatively, share your store URL with us and we'll audit it for free within 24 hours.",
    options: [
      { label: "Upgrade my theme to 2.0", next: "svc_theme" },
      { label: "Back to services", next: "services" },
      { label: "Request a free audit", next: "contact" },
    ],
  },

  shopify_plus: {
    message: "Shopify Plus is the enterprise tier, starting at $2,300/month from Shopify. It unlocks custom checkout scripts (Checkout Extensibility), Shopify Flow automation, multi-store management, B2B wholesale channels, and a dedicated Merchant Success Manager. We are experienced Plus partners.",
    options: [
      { label: "Do I need Shopify Plus?", next: "plus_eligibility" },
      { label: "Back to services", next: "services" },
      { label: "Discuss a Plus project", next: "contact" },
    ],
  },

  plus_eligibility: {
    message: "Shopify Plus makes sense when your store exceeds $1M in annual revenue or 10,000+ orders per month, needs custom checkout logic, requires multi-store management across regions, or wants B2B wholesale functionality. Below those thresholds, Shopify Advanced ($299/month) is usually sufficient.",
    options: [
      { label: "Back to Shopify Plus", next: "shopify_plus" },
      { label: "Explore services", next: "services" },
      { label: "Talk to us about your needs", next: "contact" },
    ],
  },

  // ─────────────────────────────────────────────
  // CONTACT NODE (referenced from many nodes in later parts)
  // ─────────────────────────────────────────────
  contact: {
    message: "Ready to move forward? Reach us directly — we typically respond within 2 business hours. Email: webdev.muhammad@gmail.com | WhatsApp/Phone: +92 320 9246199. Or use the contact form on our website for a free project consultation.",
    options: [
      { label: "Back to services", next: "services" },
      { label: "Back to pricing", next: "pricing" },
      { label: "Start over", next: "root" },
    ],
  },

  // ─────────────────────────────────────────────
  // TIMELINE NODE (referenced from root)
  // ─────────────────────────────────────────────
  timelines: {
    message: "Here are typical project timelines: Store Setup (5–7 days), Custom Theme (4–6 weeks), SEO Optimization (1 week for audit + fixes; 3–6 months for results), App Development (2–8 weeks), Store Migration (1–2 weeks), CRO (30-day engagement). Rush delivery is available on most services.",
    options: [
      { label: "Store Setup timeline", next: "setup_timeline" },
      { label: "Custom Theme timeline", next: "theme_timeline" },
      { label: "Migration timeline", next: "migration_timeline" },
      { label: "Back to main menu", next: "root" },
    ],
  },

  // ─────────────────────────────────────────────
  // PROCESS BRANCH
  // ─────────────────────────────────────────────
  process: {
    message: "We follow a proven 6-step process for every project. This ensures quality, transparency, and zero surprises. Which phase would you like to learn more about?",
    options: [
      { label: "1. Discovery & Strategy", next: "process_discovery" },
      { label: "2. Design & Wireframing", next: "process_design" },
      { label: "3. Development & Build", next: "process_development" },
      { label: "4. Testing & QA", next: "process_testing" },
      { label: "5. Launch & Deployment", next: "process_launch" },
      { label: "6. Post-launch Support", next: "process_postlaunch" },
    ],
  },

  process_discovery: {
    message: "Discovery is a 60-minute deep dive into your business goals, target audience, competitors, and brand identity. We analyze 3–5 competitor stores, identify market positioning opportunities, and produce a project brief that serves as the blueprint for everything we build.",
    options: [
      { label: "What do I need to prepare?", next: "discovery_prep" },
      { label: "How much does discovery cost?", next: "discovery_cost" },
      { label: "What happens after discovery?", next: "process_design" },
      { label: "Back to process", next: "process" },
    ],
  },

  discovery_prep: {
    message: "Before the discovery call, prepare: your brand guidelines (logo, colors, fonts), 3–5 competitor/inspiration store URLs, your product catalog details, your target audience description, and any specific features or integrations you need. A simple Google Doc is fine.",
    options: [
      { label: "I don't have brand guidelines", next: "no_logo" },
      { label: "Book a discovery call", next: "contact" },
      { label: "Back to process", next: "process" },
    ],
  },

  discovery_cost: {
    message: "The discovery call is completely free — no obligation. It typically lasts 30–60 minutes and results in a detailed project proposal with scope, timeline, and fixed pricing delivered within 24 hours. There's nothing to lose.",
    options: [
      { label: "Book a free call", next: "contact" },
      { label: "Back to process", next: "process" },
    ],
  },

  process_design: {
    message: "In the design phase, we create high-fidelity mockups in Figma for desktop, tablet, and mobile. You'll see exactly how your store will look before a single line of code is written. Includes homepage, collection page, product page, cart, and 2 revision rounds.",
    options: [
      { label: "Do I get to approve the design?", next: "design_approval" },
      { label: "Can I request changes?", next: "design_revisions" },
      { label: "How long does design take?", next: "design_timeline" },
      { label: "Back to process", next: "process" },
    ],
  },

  design_approval: {
    message: "Absolutely. We never move to development without your written sign-off on the Figma designs. You review each page, leave comments directly on the design, and we iterate until you're 100% satisfied. No surprises in the build phase.",
    options: [
      { label: "What tools do I need?", next: "design_tools" },
      { label: "Back to process", next: "process" },
    ],
  },

  design_revisions: {
    message: "Every project includes 2 rounds of design revisions at no extra cost. A revision round means you provide all feedback at once, and we implement all changes together. Additional revision rounds beyond the included 2 are $150 per round.",
    options: [
      { label: "Back to Design phase", next: "process_design" },
      { label: "Back to process", next: "process" },
    ],
  },

  design_timeline: {
    message: "The design phase typically takes 5–7 business days for a standard 5-page store. Complex stores with 10+ unique templates may need 10–14 days. This is the most collaborative phase — your feedback speed directly impacts the timeline.",
    options: [
      { label: "Next: Development phase", next: "process_development" },
      { label: "Back to process", next: "process" },
    ],
  },

  design_tools: {
    message: "We share a free Figma viewer link — no account required. You can click through the design, leave comments, and see responsive previews. For real-time collaboration, a free Figma account lets you co-edit and annotate directly on the designs.",
    options: [
      { label: "Back to Design phase", next: "process_design" },
      { label: "Back to process", next: "process" },
    ],
  },

  process_development: {
    message: "Our developers build using Shopify Liquid, vanilla JavaScript (no jQuery), and CSS custom properties for theming. We follow Shopify's coding standards, write section-based modular code, and optimize for sub-3-second load times on 3G connections.",
    options: [
      { label: "What tech stack do you use?", next: "dev_tech_stack" },
      { label: "Will I see progress during build?", next: "dev_updates" },
      { label: "Do you write clean code?", next: "dev_code_quality" },
      { label: "Back to process", next: "process" },
    ],
  },

  dev_tech_stack: {
    message: "Core stack: Shopify Liquid templating, vanilla JavaScript (ES6+), CSS3 with custom properties, Intersection Observer for animations, and Shopify's Section Rendering API. For apps: Node.js, Remix, Prisma, PostgreSQL, and Shopify's GraphQL Admin API.",
    options: [
      { label: "Do you use React?", next: "dev_react" },
      { label: "Back to Development", next: "process_development" },
    ],
  },

  dev_updates: {
    message: "Yes. We provide a staging/preview store URL where you can see progress in real-time. We send weekly written updates every Friday with screenshots, completed items, and the plan for the following week. You're never in the dark.",
    options: [
      { label: "Back to Development", next: "process_development" },
      { label: "Back to process", next: "process" },
    ],
  },

  dev_code_quality: {
    message: "100%. We follow Shopify's Theme Inspector recommendations, write semantic HTML, use BEM-style CSS naming, and keep JavaScript modular. Our themes consistently score 90+ on Lighthouse. We also include inline code comments for any custom logic.",
    options: [
      { label: "Back to Development", next: "process_development" },
      { label: "Back to process", next: "process" },
    ],
  },

  dev_react: {
    message: "For standard Shopify themes, we use Liquid + vanilla JS for maximum performance. For headless Shopify builds (Hydrogen), we use React with Remix and Shopify's Storefront API. For custom apps, we use React with Shopify Polaris. We pick the right tool for each project.",
    options: [
      { label: "Tell me about headless Shopify", next: "tech_headless" },
      { label: "Back to Development", next: "process_development" },
    ],
  },

  process_testing: {
    message: "Before launch, every store undergoes our 85-point QA checklist: cross-browser testing (Chrome, Safari, Firefox, Edge), device testing (iPhone, Android, iPad, Desktop), accessibility audit (WCAG 2.1 AA), payment flow testing, and performance benchmarking.",
    options: [
      { label: "What devices do you test on?", next: "testing_devices" },
      { label: "Do you test accessibility?", next: "testing_a11y" },
      { label: "How long does QA take?", next: "testing_timeline" },
      { label: "Back to process", next: "process" },
    ],
  },

  testing_devices: {
    message: "We test on 12+ device/browser combinations: iPhone 14/15 (Safari), Samsung Galaxy S23 (Chrome), iPad Pro (Safari), MacBook (Chrome/Safari/Firefox), Windows PC (Chrome/Edge/Firefox), and Pixel 7 (Chrome). We use BrowserStack for extended coverage.",
    options: [
      { label: "Back to Testing", next: "process_testing" },
      { label: "Back to process", next: "process" },
    ],
  },

  testing_a11y: {
    message: "Yes. We audit against WCAG 2.1 Level AA standards: proper heading hierarchy, alt text on all images, keyboard navigation support, color contrast ratios (4.5:1 minimum), focus indicators, and ARIA labels on interactive elements. Accessible stores also rank better on Google.",
    options: [
      { label: "Back to Testing", next: "process_testing" },
      { label: "Back to process", next: "process" },
    ],
  },

  testing_timeline: {
    message: "QA runs for 2–3 business days on a standard store. Complex builds with custom apps or multiple integrations may need 4–5 days. We log all issues in a shared tracker so you have full visibility into what was found and fixed.",
    options: [
      { label: "Next: Launch", next: "process_launch" },
      { label: "Back to process", next: "process" },
    ],
  },

  process_launch: {
    message: "Launch day is a coordinated event. We handle DNS cutover, SSL certificate activation, Google Analytics 4 verification, Search Console submission, payment gateway live-mode activation, and a final smoke test. We stay online during launch to resolve any issues in real-time.",
    options: [
      { label: "What about my domain?", next: "launch_domain" },
      { label: "Do you set up analytics?", next: "launch_analytics" },
      { label: "What if something breaks?", next: "launch_support" },
      { label: "Back to process", next: "process" },
    ],
  },

  launch_domain: {
    message: "We configure your custom domain with Shopify's DNS or your existing DNS provider (Cloudflare, GoDaddy, Namecheap, etc.). This includes A record and CNAME setup, SSL certificate provisioning (free via Shopify), and email forwarding if needed. The cutover takes under 5 minutes.",
    options: [
      { label: "I don't have a domain yet", next: "launch_buy_domain" },
      { label: "Back to Launch", next: "process_launch" },
    ],
  },

  launch_buy_domain: {
    message: "You can purchase a domain directly through Shopify ($14–$40/year for most TLDs) or use a third-party registrar like Namecheap or Google Domains. We recommend buying through Shopify for the simplest setup — automatic SSL configuration with zero DNS hassle.",
    options: [
      { label: "Back to Launch", next: "process_launch" },
      { label: "Back to process", next: "process" },
    ],
  },

  launch_analytics: {
    message: "We set up Google Analytics 4 with enhanced e-commerce tracking (product views, add-to-cart, checkout steps, purchases), Google Search Console, and Facebook/Meta Pixel if you run ads. We also configure Shopify's built-in analytics dashboard for day-to-day monitoring.",
    options: [
      { label: "Do you set up conversion tracking?", next: "launch_conversion_tracking" },
      { label: "Back to Launch", next: "process_launch" },
    ],
  },

  launch_conversion_tracking: {
    message: "Yes. We implement purchase conversion events for GA4, Meta Pixel, Google Ads (if applicable), and TikTok Pixel. This includes dynamic product data in the event payloads so you can measure ROAS (Return on Ad Spend) accurately from day one.",
    options: [
      { label: "Back to Launch", next: "process_launch" },
      { label: "Back to process", next: "process" },
    ],
  },

  launch_support: {
    message: "Every project includes 30 days of post-launch bug-fix support at no extra cost. If anything breaks or behaves unexpectedly after going live, we fix it within 24 hours. For ongoing support beyond 30 days, our retainer plans start at $99/month.",
    options: [
      { label: "View support plans", next: "support_packages" },
      { label: "Back to Launch", next: "process_launch" },
      { label: "Back to process", next: "process" },
    ],
  },

  process_postlaunch: {
    message: "After launch, we provide a detailed handover document, a 30-minute admin training video, and 30 days of complimentary support. We also schedule a 2-week post-launch review to analyze early performance data and recommend optimizations.",
    options: [
      { label: "What's in the handover document?", next: "postlaunch_handover" },
      { label: "Can I manage the store myself?", next: "postlaunch_selfmanage" },
      { label: "What if I need ongoing help?", next: "support_packages" },
      { label: "Back to process", next: "process" },
    ],
  },

  postlaunch_handover: {
    message: "The handover document includes: admin login credentials, a guide to updating products and collections, theme customization instructions, installed app documentation, DNS and email configuration notes, and emergency contact procedures. It's your store's operating manual.",
    options: [
      { label: "Back to Post-launch", next: "process_postlaunch" },
      { label: "Back to process", next: "process" },
    ],
  },

  postlaunch_selfmanage: {
    message: "Absolutely. Shopify's admin is designed for non-technical users. With Shopify 2.0 sections, you can rearrange entire page layouts via drag-and-drop. We build every store so you can confidently update products, prices, images, blog posts, and pages without developer help.",
    options: [
      { label: "Do you offer training sessions?", next: "setup_training" },
      { label: "Back to Post-launch", next: "process_postlaunch" },
      { label: "Back to process", next: "process" },
    ],
  },

  // ─────────────────────────────────────────────
  // TECHNICAL BRANCH
  // ─────────────────────────────────────────────
  technical: {
    message: "Have a technical question? We're deep in Shopify's stack every day. What would you like to know about?",
    options: [
      { label: "Shopify 2.0 features", next: "shopify_2" },
      { label: "Shopify Plus (enterprise)", next: "shopify_plus" },
      { label: "Page speed optimization", next: "tech_speed" },
      { label: "Multi-currency & language", next: "tech_international" },
      { label: "Payment gateways", next: "tech_payments" },
      { label: "Headless commerce", next: "tech_headless" },
      { label: "Shopify Liquid & customization", next: "tech_liquid" },
      { label: "Apps & ecosystem", next: "tech_apps_ecosystem" },
      { label: "Industry-specific stores", next: "industries" },
      { label: "B2B & wholesale", next: "tech_b2b" },
      { label: "Dropshipping & POD", next: "tech_dropshipping" },
      { label: "Security & compliance", next: "tech_security" },
      { label: "Analytics & reporting", next: "tech_analytics" },
    ],
  },

  tech_speed: {
    message: "Page speed is critical — every 100ms delay costs 1% in conversions. We optimize by: lazy-loading images below the fold, preloading critical CSS/fonts, minimizing third-party scripts, using Shopify's CDN with WebP images, and deferring non-essential JavaScript. Our builds consistently score 90+ on Lighthouse.",
    options: [
      { label: "What is a good speed score?", next: "tech_speed_score" },
      { label: "Does Shopify slow down with apps?", next: "tech_app_impact" },
      { label: "How do I test my store speed?", next: "tech_speed_test" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_speed_score: {
    message: "A Lighthouse Performance score of 90+ is excellent for Shopify. Most unoptimized stores score 30–50. Key targets: LCP under 2.5s, INP under 200ms, CLS under 0.1. Google uses these Core Web Vitals as a ranking factor since 2021.",
    options: [
      { label: "Can you improve my current score?", next: "contact" },
      { label: "Back to Speed", next: "tech_speed" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_app_impact: {
    message: "Yes — each Shopify app adds JavaScript and CSS to your storefront. The average store runs 15–20 apps but only needs 8–10. We audit your app stack, remove unused apps, and configure remaining ones to load asynchronously. This alone can improve load times by 30–40%.",
    options: [
      { label: "Can you audit my current apps?", next: "contact" },
      { label: "Back to Speed", next: "tech_speed" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_speed_test: {
    message: "Use Google PageSpeed Insights (pagespeed.web.dev) for Lighthouse scores and Core Web Vitals. GTmetrix gives waterfall charts showing exactly what slows your page. Shopify's built-in speed report (Online Store > Themes > Speed) gives a quick overview relative to other stores.",
    options: [
      { label: "Get a free speed audit", next: "contact" },
      { label: "Back to Speed", next: "tech_speed" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_international: {
    message: "Shopify Markets makes selling internationally straightforward. We configure multi-currency pricing (auto-converted or manual), language translations (via Shopify Translate & Adapt or third-party apps like Langify), regional domains or subfolders, and country-specific duties and taxes.",
    options: [
      { label: "How many languages can I add?", next: "tech_languages" },
      { label: "How does multi-currency work?", next: "tech_currency" },
      { label: "What about international shipping?", next: "tech_intl_shipping" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_languages: {
    message: "Shopify supports up to 20 published languages per store. Translation can be done manually through the admin, auto-translated using Shopify's AI, or managed via apps like Langify or Weglot. We set up hreflang tags for SEO so Google serves the right language to each visitor.",
    options: [
      { label: "Back to International", next: "tech_international" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_currency: {
    message: "With Shopify Markets, prices auto-convert based on the visitor's location using real-time exchange rates (with optional rounding rules). You can also set manual prices per market for full control. Checkout always displays the local currency, reducing cart abandonment by up to 33%.",
    options: [
      { label: "Back to International", next: "tech_international" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_intl_shipping: {
    message: "We configure international shipping zones, carrier-calculated rates (DHL, FedEx, UPS), duties and import tax estimates at checkout (via Shopify's built-in duty calculator), and shipping profiles for products with different origins or fulfillment centers.",
    options: [
      { label: "Back to International", next: "tech_international" },
      { label: "Get a quote", next: "contact" },
    ],
  },

  tech_payments: {
    message: "Shopify supports 100+ payment gateways worldwide. The most popular setup is Shopify Payments (powered by Stripe) with Shop Pay, Apple Pay, and Google Pay as express checkout options. We also integrate PayPal, Klarna, Afterpay, Affirm, and regional gateways.",
    options: [
      { label: "What is Shop Pay?", next: "tech_shop_pay" },
      { label: "Buy now, pay later options?", next: "tech_bnpl" },
      { label: "Crypto payments?", next: "tech_crypto" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_shop_pay: {
    message: "Shop Pay is Shopify's accelerated checkout — it remembers customer details for one-click purchasing. It has a 1.72x higher conversion rate than regular checkout (Shopify's own data). It's free to enable and works with Shopify Payments. We enable it on every build.",
    options: [
      { label: "Back to Payments", next: "tech_payments" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_bnpl: {
    message: "Buy Now Pay Later options include Shop Pay Installments (US), Klarna (EU/US/UK), Afterpay (AU/US/UK), and Affirm (US/CA). BNPL typically increases average order value by 30–50% for products over $100. We configure the right mix based on your target market.",
    options: [
      { label: "Back to Payments", next: "tech_payments" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_crypto: {
    message: "Shopify integrates with crypto payment processors like BitPay and Coinbase Commerce, supporting Bitcoin, Ethereum, and major stablecoins (USDC, USDT). It's a niche but growing payment method — particularly for tech-savvy audiences and international customers avoiding FX fees.",
    options: [
      { label: "Back to Payments", next: "tech_payments" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_headless: {
    message: "Headless Shopify decouples the frontend from Shopify's backend. We use Shopify Hydrogen (React + Remix) with the Storefront API. Benefits: unlimited design freedom, sub-second page loads, and custom checkout experiences. Best for brands with $1M+ revenue needing maximum performance.",
    options: [
      { label: "Is headless right for me?", next: "tech_headless_fit" },
      { label: "What is Hydrogen?", next: "tech_hydrogen" },
      { label: "Headless vs. standard Shopify?", next: "tech_headless_vs_standard" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_headless_fit: {
    message: "Headless is ideal if: your store needs a unique interactive experience (configurators, 3D, AR), you're doing $1M+ in annual revenue to justify the investment, you need multi-storefront from one backend, or page speed is critical for your paid ad ROI. For most stores under $500K/year, standard Shopify 2.0 themes are more cost-effective.",
    options: [
      { label: "How much does headless cost?", next: "tech_headless_cost" },
      { label: "Back to Headless", next: "tech_headless" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_hydrogen: {
    message: "Hydrogen is Shopify's official React-based framework for building custom storefronts. It runs on Remix, uses the Storefront API for data, and deploys to Shopify's Oxygen hosting (or Vercel/Netlify). It gives developers full control over every pixel while Shopify handles commerce logic.",
    options: [
      { label: "Back to Headless", next: "tech_headless" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_headless_vs_standard: {
    message: "Standard Shopify: faster to build (2–6 weeks), lower cost ($1,999–$5,000), easy for merchants to manage. Headless: longer build (8–16 weeks), higher cost ($8,000–$25,000+), maximum performance and flexibility. 90% of Shopify stores are best served by a well-built standard theme.",
    options: [
      { label: "I want a standard theme", next: "svc_theme" },
      { label: "I want to explore headless", next: "tech_headless_cost" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_headless_cost: {
    message: "Headless Shopify builds start at $8,000 for a simple storefront and can range to $25,000+ for complex multi-market setups with custom checkout. Ongoing hosting on Oxygen is included in your Shopify plan; Vercel hosting starts at $20/month. We scope every headless project individually.",
    options: [
      { label: "Get a headless quote", next: "contact" },
      { label: "Back to Headless", next: "tech_headless" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  // ─────────────────────────────────────────────
  // EXTENDED SUPPORT BRANCH
  // ─────────────────────────────────────────────
  support_growth: {
    message: "The Growth plan ($249/month) includes everything in Basic, plus: monthly performance report, one new feature or page per month, speed monitoring, uptime monitoring, and priority email support with 8-hour response SLA.",
    options: [
      { label: "Tell me about Pro support", next: "support_pro" },
      { label: "Compare all plans", next: "support_packages" },
      { label: "Sign up", next: "contact" },
    ],
  },

  support_pro: {
    message: "The Pro plan ($499/month) is our top-tier retainer: dedicated developer, 4-hour emergency response SLA, 10 hours of development per month, weekly check-in calls, A/B testing, and conversion monitoring. Ideal for stores doing $50K+/month in revenue.",
    options: [
      { label: "Compare all plans", next: "support_packages" },
      { label: "Sign up for Pro", next: "contact" },
      { label: "Back to main menu", next: "root" },
    ],
  },

  support_emergency: {
    message: "For Pro plan members, emergency support is available with a 4-hour response SLA, 7 days a week. For non-retainer clients, emergency fixes are billed at $150/hour with a 24-hour response commitment. Contact us via WhatsApp for fastest response.",
    options: [
      { label: "View support plans", next: "support_packages" },
      { label: "Contact us now", next: "contact" },
    ],
  },

  support_training: {
    message: "We offer three training options: a free 30-minute Loom walkthrough (included with every project), a 60-minute live Zoom session ($99), or a comprehensive 3-hour workshop for your team ($249) covering Shopify admin, theme customization, product management, and order processing.",
    options: [
      { label: "Book a training session", next: "contact" },
      { label: "Back to support", next: "support_packages" },
      { label: "Back to main menu", next: "root" },
    ],
  },

  // ─────────────────────────────────────────────
  // ABOUT / TRUST BRANCH
  // ─────────────────────────────────────────────
  about_us: {
    message: "ShopifyPro is a specialist Shopify development agency. We've completed 100+ projects across 15+ industries with a 98% client satisfaction rate. Our team focuses exclusively on Shopify — no WordPress, no Squarespace — just deep Shopify expertise.",
    options: [
      { label: "View our portfolio", next: "theme_portfolio" },
      { label: "Client testimonials", next: "about_testimonials" },
      { label: "Our guarantee", next: "about_guarantee" },
      { label: "Back to main menu", next: "root" },
    ],
  },

  about_testimonials: {
    message: "Our clients speak for themselves: Sarah Mitchell (LuxeBrand Co.) saw +40% conversion rate. James Rodriguez (TechGear Store) praised our zero-downtime migration. Emily Chen (FashionHub) achieved +200% organic traffic in 3 months. David Wilson (SportsPro) grew revenue by 60%.",
    options: [
      { label: "View all services", next: "services" },
      { label: "Get started", next: "contact" },
      { label: "Back to main menu", next: "root" },
    ],
  },

  about_guarantee: {
    message: "Every project includes: defined revision rounds, 30-day post-launch support, a performance guarantee on CRO engagements, and transparent milestone-based pricing. If deliverables don't meet the agreed brief after revisions, we offer a pro-rated refund.",
    options: [
      { label: "View refund policy", next: "refund_policy" },
      { label: "Start a project", next: "contact" },
      { label: "Back to main menu", next: "root" },
    ],
  },

  // ─────────────────────────────────────────────
  // COMMON QUESTIONS BRANCH
  // ─────────────────────────────────────────────
  common_questions: {
    message: "Here are questions we get asked most often. What would you like to know?",
    options: [
      { label: "Do I need Shopify Plus?", next: "plus_eligibility" },
      { label: "Can I update my store myself?", next: "postlaunch_selfmanage" },
      { label: "What payment methods can I accept?", next: "tech_payments" },
      { label: "Will my store be mobile-friendly?", next: "theme_mobile" },
    ],
  },

  // ─────────────────────────────────────────────
  // SHOPIFY LIQUID & CUSTOMIZATION
  // ─────────────────────────────────────────────
  tech_liquid: {
    message: "Shopify Liquid is Shopify's open-source template language. It bridges your store data (products, collections, cart) with HTML/CSS. Every Shopify theme is built with Liquid. We're fluent in Liquid objects, filters, tags, and the Section Rendering API.",
    options: [
      { label: "Can you customize my existing theme?", next: "tech_customize_existing" },
      { label: "Liquid vs. React?", next: "tech_liquid_vs_react" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_customize_existing: {
    message: "Absolutely. We customize existing themes daily — adding custom sections, modifying product page layouts, building mega menus, adding size guides, custom filtering, and more. We work with Dawn, Prestige, Impulse, Warehouse, and all popular themes.",
    options: [
      { label: "How much does customization cost?", next: "tech_customize_cost" },
      { label: "Back to Technical", next: "technical" },
      { label: "Get a quote", next: "contact" },
    ],
  },

  tech_customize_cost: {
    message: "Minor customizations (color changes, layout tweaks, adding a section) range $50–$200. Medium work (custom product page, mega menu, advanced filtering) runs $200–$800. Major overhauls that stop short of a full rebuild are $800–$1,500. We provide fixed-price quotes upfront.",
    options: [
      { label: "Request a customization quote", next: "contact" },
      { label: "Or build a custom theme", next: "svc_theme" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_liquid_vs_react: {
    message: "Liquid renders server-side and is fast out of the box — ideal for 95% of stores. React (via Hydrogen) renders client-side or SSR, offering richer interactivity but requiring more infrastructure. For most stores, Liquid is the right choice. React shines for headless builds.",
    options: [
      { label: "Tell me about headless", next: "tech_headless" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  // ─────────────────────────────────────────────
  // SHOPIFY APPS & ECOSYSTEM
  // ─────────────────────────────────────────────
  tech_apps_ecosystem: {
    message: "The Shopify App Store has 10,000+ apps. Choosing the right ones matters — too many apps slow your store, too few limit functionality. We recommend a lean stack of 8–12 essential apps based on your business model.",
    options: [
      { label: "Best apps for a new store?", next: "apps_new_store" },
      { label: "Best apps for email marketing?", next: "apps_email" },
      { label: "Best apps for reviews?", next: "apps_reviews" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  apps_new_store: {
    message: "Our recommended starter stack: Shopify Email (free, built-in), Judge.me (reviews, free tier), Klaviyo (email automation, free up to 250 contacts), PageFly or GemPages (landing pages), Tidio (live chat), and Google & YouTube channel (free, for Shopping ads).",
    options: [
      { label: "Can you set these up for me?", next: "contact" },
      { label: "Back to Apps", next: "tech_apps_ecosystem" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  apps_email: {
    message: "Top email marketing apps: Klaviyo (best for advanced automation, free up to 250 contacts), Omnisend (great all-in-one with SMS), Mailchimp (simple campaigns), and Shopify Email (free, basic). We recommend Klaviyo for stores serious about retention marketing.",
    options: [
      { label: "Can you set up Klaviyo?", next: "apps_klaviyo_setup" },
      { label: "Back to Apps", next: "tech_apps_ecosystem" },
    ],
  },

  apps_klaviyo_setup: {
    message: "Yes. We set up Klaviyo with: abandoned cart flows, welcome series, post-purchase sequences, browse abandonment, win-back campaigns, and review request emails. A properly configured Klaviyo setup generates 20–30% of total store revenue on autopilot.",
    options: [
      { label: "Get Klaviyo setup quote", next: "contact" },
      { label: "Back to Apps", next: "tech_apps_ecosystem" },
    ],
  },

  apps_reviews: {
    message: "Best review apps: Judge.me (best value, free tier available, photo/video reviews), Loox (visual reviews with photos), Yotpo (enterprise with UGC), and Stamped.io (reviews + loyalty combined). We install and configure the app, import existing reviews, and style widgets to match your theme.",
    options: [
      { label: "Back to Apps", next: "tech_apps_ecosystem" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  // ─────────────────────────────────────────────
  // INDUSTRY-SPECIFIC QUESTIONS
  // ─────────────────────────────────────────────
  industries: {
    message: "We've built stores across many industries. Each vertical has unique requirements. Which industry are you in?",
    options: [
      { label: "Fashion & Apparel", next: "ind_fashion" },
      { label: "Beauty & Skincare", next: "ind_beauty" },
      { label: "Food & Beverage", next: "ind_food" },
      { label: "Home & Lifestyle", next: "ind_home" },
    ],
  },

  ind_fashion: {
    message: "Fashion stores need: advanced product filtering (size, color, style), size guide modals, model fit selectors, wishlist functionality, Instagram shop integration, and lookbook pages. We've built for brands like Maguire Shoes, Hiut Denim, and Tentree.",
    options: [
      { label: "Do you handle size guides?", next: "ind_fashion_sizes" },
      { label: "Can you add a lookbook?", next: "ind_fashion_lookbook" },
      { label: "View pricing", next: "pricing" },
      { label: "Back to Industries", next: "industries" },
    ],
  },

  ind_fashion_sizes: {
    message: "Yes — we build custom size guide modals that display per-product measurement charts, body type recommendations, and unit conversion (cm/inches). We use Shopify metafields so you can update size guides per product directly from the admin without any code changes.",
    options: [
      { label: "Back to Fashion", next: "ind_fashion" },
      { label: "Get started", next: "contact" },
    ],
  },

  ind_fashion_lookbook: {
    message: "Lookbook pages showcase styled product combinations with 'shop the look' hotspots. We build interactive lookbooks where customers can click on items in the image to see product details and add to cart — turning editorial content into a direct sales channel.",
    options: [
      { label: "Back to Fashion", next: "ind_fashion" },
      { label: "Get started", next: "contact" },
    ],
  },

  ind_beauty: {
    message: "Beauty & skincare stores need: ingredient lists with expandable details, shade/variant swatches with image previews, subscription options for replenishment, quiz-based product recommenders, and before/after galleries. Our Herbivore Botanicals and Derma Me projects showcase this expertise.",
    options: [
      { label: "Can you build a product quiz?", next: "ind_beauty_quiz" },
      { label: "Subscription setup?", next: "ind_beauty_subscriptions" },
      { label: "Back to Industries", next: "industries" },
    ],
  },

  ind_beauty_quiz: {
    message: "Yes! Product recommendation quizzes are one of our specialties. We build multi-step quizzes that ask about skin type, concerns, lifestyle, and budget — then recommend a personalized product bundle. Average quiz conversion rate: 15–25%, far higher than standard product pages.",
    options: [
      { label: "Get a quiz built", next: "contact" },
      { label: "Back to Beauty", next: "ind_beauty" },
    ],
  },

  ind_beauty_subscriptions: {
    message: "We integrate subscription apps like Recharge, Bold Subscriptions, or Shopify's native subscriptions API. Customers can subscribe to auto-replenishment at a discount (typically 10–15% off), with flexible delivery schedules. Subscription revenue provides predictable monthly income.",
    options: [
      { label: "Back to Beauty", next: "ind_beauty" },
      { label: "Get started", next: "contact" },
    ],
  },

  ind_food: {
    message: "Food & beverage stores have unique needs: perishable product handling, cold-chain shipping integrations, subscription boxes, recipe pages linked to products, nutritional info displays, and regional shipping restrictions. We built Fly By Jing (+300% organic traffic) and Fishwife ($1.5M+ revenue).",
    options: [
      { label: "Can you handle perishable shipping?", next: "ind_food_shipping" },
      { label: "Subscription boxes?", next: "ind_food_subscriptions" },
      { label: "Back to Industries", next: "industries" },
    ],
  },

  ind_food_shipping: {
    message: "Yes. We integrate with cold-chain shipping carriers and set up rules to block shipments to hot-climate zones during summer. We configure date-picker delivery scheduling, local pickup/delivery options, and perishable-specific packaging notes in the checkout.",
    options: [
      { label: "Back to Food & Beverage", next: "ind_food" },
      { label: "Get started", next: "contact" },
    ],
  },

  ind_food_subscriptions: {
    message: "Subscription boxes are perfect for food brands. We set up curated and custom box options with Recharge or Loop Subscriptions, including: frequency options (weekly/biweekly/monthly), skip/pause controls, and personalization (dietary preferences, flavor profiles).",
    options: [
      { label: "Back to Food & Beverage", next: "ind_food" },
      { label: "Get started", next: "contact" },
    ],
  },

  ind_home: {
    message: "Home & lifestyle stores benefit from: room scene photography integration, dimension/spec tables, collection-based room styling, gift registry functionality, and curated bundle builders. Brentwood General Store (25K+ customers) is a great example of what we build in this space.",
    options: [
      { label: "Can you add a gift registry?", next: "ind_home_registry" },
      { label: "Bundle builder?", next: "ind_home_bundles" },
      { label: "Back to Industries", next: "industries" },
    ],
  },

  ind_home_registry: {
    message: "Yes — we integrate gift registry apps that let customers create wishlists others can purchase from. This is especially popular for wedding registries and housewarming lists. We configure it with email notifications, progress tracking, and custom thank-you messages.",
    options: [
      { label: "Back to Home & Lifestyle", next: "ind_home" },
      { label: "Get started", next: "contact" },
    ],
  },

  ind_home_bundles: {
    message: "Bundle builders let customers create custom product sets at a discounted price. We build step-by-step builders ('Pick 3 candles for $50') with real-time price calculations, product previews, and cart integration. Bundle AOV is typically 40–60% higher than individual product purchases.",
    options: [
      { label: "Back to Home & Lifestyle", next: "ind_home" },
      { label: "Get started", next: "contact" },
    ],
  },

  // ─────────────────────────────────────────────
  // B2B & WHOLESALE
  // ─────────────────────────────────────────────
  tech_b2b: {
    message: "We build B2B wholesale stores using Shopify's native wholesale channel (Plus) or apps like Wholesale Club and Bold Custom Pricing. Features include: tiered pricing, minimum order quantities, net payment terms, quick order forms, and customer-specific catalogs.",
    options: [
      { label: "Do I need Shopify Plus for B2B?", next: "b2b_plus_needed" },
      { label: "B2B pricing tiers?", next: "b2b_pricing_tiers" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  b2b_plus_needed: {
    message: "Not necessarily. Shopify Plus offers the best native B2B features (wholesale channel, custom pricing rules, net terms). However, for smaller wholesale operations, apps like Wholesale Club or Bold Custom Pricing on regular Shopify plans work well at a fraction of the cost.",
    options: [
      { label: "Back to B2B", next: "tech_b2b" },
      { label: "Explore Shopify Plus", next: "shopify_plus" },
    ],
  },

  b2b_pricing_tiers: {
    message: "We configure customer groups with tiered pricing: e.g., Retail (full price), Wholesale (30% off), VIP Wholesale (40% off). Each customer sees their specific prices after logging in. We also set up minimum order quantities and volume-based discounts.",
    options: [
      { label: "Back to B2B", next: "tech_b2b" },
      { label: "Get a B2B store quote", next: "contact" },
    ],
  },

  // ─────────────────────────────────────────────
  // DROPSHIPPING
  // ─────────────────────────────────────────────
  tech_dropshipping: {
    message: "We set up Shopify dropshipping stores with supplier integrations via DSers (AliExpress), Spocket (US/EU suppliers), Printful (print-on-demand), or CJDropshipping. We configure automated order routing, inventory sync, and branded tracking pages.",
    options: [
      { label: "Which dropshipping app is best?", next: "dropship_apps" },
      { label: "Print-on-demand setup?", next: "dropship_pod" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  dropship_apps: {
    message: "DSers is best for AliExpress sourcing (free tier available). Spocket is ideal for faster shipping with US/EU suppliers ($39/month). CJDropshipping offers competitive pricing with their own warehouses. For branded products, Printful or Printify are the go-to for print-on-demand.",
    options: [
      { label: "Back to Dropshipping", next: "tech_dropshipping" },
      { label: "Set up my dropshipping store", next: "contact" },
    ],
  },

  dropship_pod: {
    message: "Print-on-demand lets you sell custom-designed products (t-shirts, mugs, phone cases, canvas prints) with zero inventory. We integrate Printful, Printify, or Gooten — products are printed and shipped directly to your customer when an order comes in.",
    options: [
      { label: "Back to Dropshipping", next: "tech_dropshipping" },
      { label: "Start a POD store", next: "contact" },
    ],
  },

  // ─────────────────────────────────────────────
  // SECURITY & COMPLIANCE
  // ─────────────────────────────────────────────
  tech_security: {
    message: "Shopify is PCI DSS Level 1 compliant — the highest level of payment security certification. Every store gets free SSL, automatic security patches, and DDoS protection. We also configure GDPR cookie consent banners, privacy policies, and Terms of Service pages.",
    options: [
      { label: "GDPR compliance?", next: "tech_gdpr" },
      { label: "Is Shopify secure enough for my business?", next: "tech_security_level" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_gdpr: {
    message: "We configure GDPR-compliant cookie consent banners (using Shopify's native privacy settings or apps like Consentmo), privacy policy pages, data collection disclosures, and customer data request/deletion workflows. Essential for selling to EU customers.",
    options: [
      { label: "Back to Security", next: "tech_security" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  tech_security_level: {
    message: "Shopify handles security at the platform level — you don't manage servers, SSL certificates, or security patches. Shopify processes billions in payments annually and has never had a platform-level data breach. It's significantly more secure than self-hosted solutions like WooCommerce/Magento.",
    options: [
      { label: "Back to Security", next: "tech_security" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  // ─────────────────────────────────────────────
  // ANALYTICS & REPORTING
  // ─────────────────────────────────────────────
  tech_analytics: {
    message: "Data-driven decisions are key to e-commerce success. We set up comprehensive analytics: GA4 with enhanced e-commerce, Shopify's native reports, and custom dashboards. You'll know exactly where revenue comes from and where to optimize.",
    options: [
      { label: "What reports will I get?", next: "analytics_reports" },
      { label: "Do you set up GA4?", next: "launch_analytics" },
      { label: "Custom dashboards?", next: "analytics_dashboards" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  analytics_reports: {
    message: "Key reports we configure: Revenue by channel (organic, paid, email, direct), Conversion funnel (sessions → add to cart → checkout → purchase), Top products by revenue and units, Customer acquisition cost, Customer lifetime value, and Cart abandonment rate by device.",
    options: [
      { label: "Back to Analytics", next: "tech_analytics" },
      { label: "Set up my analytics", next: "contact" },
    ],
  },

  analytics_dashboards: {
    message: "For Growth and Pro support clients, we build custom Looker Studio (Google Data Studio) dashboards that pull live data from GA4, Shopify, and Klaviyo into one visual report. Accessible 24/7, auto-refreshed daily, and customized to your KPIs.",
    options: [
      { label: "View support plans", next: "support_packages" },
      { label: "Back to Analytics", next: "tech_analytics" },
    ],
  },

  // ─────────────────────────────────────────────
  // MARKETING & GROWTH
  // ─────────────────────────────────────────────
  marketing: {
    message: "Growing your Shopify store requires a multi-channel strategy. We can help with SEO, email marketing setup, social commerce, and conversion optimization. What area interests you?",
    options: [
      { label: "Email marketing setup", next: "apps_email" },
      { label: "Social media selling", next: "mktg_social" },
      { label: "Google Shopping setup", next: "mktg_google_shopping" },
      { label: "Loyalty & retention", next: "mktg_loyalty" },
      { label: "SEO optimization", next: "svc_seo" },
      { label: "Back to main menu", next: "root" },
    ],
  },

  mktg_social: {
    message: "We integrate Shopify with Facebook/Instagram Shop, TikTok Shop, and Pinterest Shopping. Your products sync automatically and customers can browse and buy directly from social media. Social commerce accounts for 18% of all e-commerce sales globally.",
    options: [
      { label: "Instagram Shopping setup", next: "mktg_instagram" },
      { label: "TikTok Shop setup", next: "mktg_tiktok" },
      { label: "Back to Marketing", next: "marketing" },
    ],
  },

  mktg_instagram: {
    message: "We set up Instagram Shopping with product tagging, shoppable posts and reels, and a built-in checkout flow. Requirements: a Facebook Business Page, an Instagram Business account, and an approved product catalog. Setup takes 2–3 business days.",
    options: [
      { label: "Back to Social selling", next: "mktg_social" },
      { label: "Get started", next: "contact" },
    ],
  },

  mktg_tiktok: {
    message: "TikTok Shop integration lets you sell products directly through TikTok videos and live streams. We set up the TikTok channel app, sync your catalog, and configure the pixel for conversion tracking. TikTok's algorithm can deliver massive organic reach for the right products.",
    options: [
      { label: "Back to Social selling", next: "mktg_social" },
      { label: "Set up TikTok Shop", next: "contact" },
    ],
  },

  mktg_google_shopping: {
    message: "We configure the Google & YouTube channel on Shopify for free product listings and paid Shopping ads. This includes: product feed optimization, Google Merchant Center setup, conversion tracking, and smart bidding strategy recommendations. Free listings alone drive 12–20% of traffic for optimized stores.",
    options: [
      { label: "Is it free to list on Google?", next: "mktg_google_free" },
      { label: "Back to Marketing", next: "marketing" },
      { label: "Set up Google Shopping", next: "contact" },
    ],
  },

  mktg_google_free: {
    message: "Yes! Google offers free product listings in the Shopping tab, Google Images, and YouTube. All you need is an approved Google Merchant Center account with a synced product feed. Paid Shopping ads (Google Ads) appear at the top of search results for additional visibility.",
    options: [
      { label: "Back to Google Shopping", next: "mktg_google_shopping" },
      { label: "Back to Marketing", next: "marketing" },
    ],
  },

  mktg_loyalty: {
    message: "Loyalty programs increase repeat purchases by 25–40%. We integrate apps like Smile.io, LoyaltyLion, or Yotpo Loyalty. Features include: points for purchases, referral rewards, VIP tiers, birthday discounts, and social engagement rewards.",
    options: [
      { label: "Which loyalty app is best?", next: "mktg_loyalty_apps" },
      { label: "Back to Marketing", next: "marketing" },
      { label: "Set up a loyalty program", next: "contact" },
    ],
  },

  mktg_loyalty_apps: {
    message: "Smile.io is best for most stores (free tier, easy setup). LoyaltyLion is ideal for brands wanting deep customization. Yotpo Loyalty combines reviews + loyalty in one platform. For stores doing $100K+/month, LoyaltyLion's advanced segmentation is worth the premium.",
    options: [
      { label: "Back to Loyalty", next: "mktg_loyalty" },
      { label: "Back to Marketing", next: "marketing" },
    ],
  },

  // ─────────────────────────────────────────────
  // SHOPIFY PLANS COMPARISON
  // ─────────────────────────────────────────────
  shopify_plans: {
    message: "Shopify offers 5 plans: Starter ($5/month), Basic ($39/month), Shopify ($105/month), Advanced ($399/month), and Plus ($2,300+/month). The right plan depends on your sales volume, team size, and feature needs.",
    options: [
      { label: "Which plan do I need?", next: "plans_recommendation" },
      { label: "Basic vs Shopify plan?", next: "plans_basic_vs_shopify" },
      { label: "When to upgrade to Advanced?", next: "plans_advanced" },
      { label: "Tell me about Plus", next: "shopify_plus" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  plans_recommendation: {
    message: "Starting out (under $10K/month): Basic at $39/month. Growing ($10K–$50K/month): Shopify at $105/month (lower transaction fees). Scaling ($50K–$500K/month): Advanced at $399/month (best rates + reports). Enterprise ($500K+/month): Plus at $2,300+/month (custom checkout, automation).",
    options: [
      { label: "I'm just starting out", next: "plans_starter" },
      { label: "I'm doing $50K+/month", next: "plans_advanced" },
      { label: "Back to Plans", next: "shopify_plans" },
    ],
  },

  plans_starter: {
    message: "For new stores, Shopify Basic ($39/month) is the sweet spot. It gives you a full online store, unlimited products, 2 staff accounts, and Shopify Payments with 2.9% + 30¢ per transaction. You can always upgrade as you grow — Shopify makes it seamless.",
    options: [
      { label: "Get my store set up on Basic", next: "contact" },
      { label: "Back to Plans", next: "shopify_plans" },
    ],
  },

  plans_basic_vs_shopify: {
    message: "Key differences: Basic ($39/month) has 2.9% card rates and 2 staff accounts. Shopify ($105/month) drops rates to 2.7%, adds 5 staff accounts, and includes professional reports. Upgrade when the lower transaction fees save more than the $66/month difference — typically at $10K/month in sales.",
    options: [
      { label: "Back to Plans", next: "shopify_plans" },
      { label: "Back to Technical", next: "technical" },
    ],
  },

  plans_advanced: {
    message: "Advanced ($399/month) is for stores doing $50K+/month. You get 2.5% card rates, 15 staff accounts, advanced reporting, third-party calculated shipping rates, and custom pricing by market. The lower transaction fees pay for the plan when processing $50K+/month.",
    options: [
      { label: "Should I consider Plus instead?", next: "plus_eligibility" },
      { label: "Back to Plans", next: "shopify_plans" },
    ],
  },

  // ─────────────────────────────────────────────
  // GETTING STARTED GUIDE
  // ─────────────────────────────────────────────
  getting_started: {
    message: "Ready to build your Shopify store? Here's a quick guide to get started with us. The whole process is straightforward and stress-free.",
    options: [
      { label: "Step 1: Book a free call", next: "start_step1" },
      { label: "Step 2: Discovery & proposal", next: "start_step2" },
      { label: "Step 3: Kickoff", next: "start_step3" },
      { label: "What do I need to prepare?", next: "discovery_prep" },
      { label: "Back to main menu", next: "root" },
    ],
  },

  start_step1: {
    message: "Book a free 30-minute discovery call via email (webdev.muhammad@gmail.com) or WhatsApp (+92 320 9246199). We'll discuss your business, goals, timeline, and budget. No pressure, no obligation — just an honest conversation about what you need.",
    options: [
      { label: "Next: Discovery & proposal", next: "start_step2" },
      { label: "Book now", next: "contact" },
    ],
  },

  start_step2: {
    message: "Within 24 hours of our call, you'll receive a detailed proposal with: project scope, deliverables checklist, timeline with milestones, fixed pricing, and payment schedule. You review it, ask questions, and sign off when ready.",
    options: [
      { label: "Next: Kickoff", next: "start_step3" },
      { label: "Back to Getting Started", next: "getting_started" },
    ],
  },

  start_step3: {
    message: "Once you approve the proposal and make the first payment (50%), we start immediately. You'll get access to a shared project tracker, a staging store URL, and weekly progress updates. From here, we follow our 6-step process until launch day.",
    options: [
      { label: "View our process", next: "process" },
      { label: "Let's go!", next: "contact" },
      { label: "Back to Getting Started", next: "getting_started" },
    ],
  },

  // ─────────────────────────────────────────────
  // COMPARISON QUESTIONS
  // ─────────────────────────────────────────────
  compare_platforms: {
    message: "Thinking about which platform to use? Here's how Shopify compares to the alternatives:",
    options: [
      { label: "Shopify vs WooCommerce", next: "cmp_woocommerce" },
      { label: "Shopify vs Wix", next: "cmp_wix" },
      { label: "Shopify vs BigCommerce", next: "cmp_bigcommerce" },
      { label: "Shopify vs Squarespace", next: "cmp_squarespace" },
      { label: "Back to main menu", next: "root" },
    ],
  },

  cmp_woocommerce: {
    message: "WooCommerce is a WordPress plugin — you manage hosting, security, and updates yourself. Shopify is a hosted platform — everything is handled for you. WooCommerce offers more flexibility but requires technical knowledge. Shopify offers better out-of-box e-commerce with 99.99% uptime.",
    options: [
      { label: "Migrate from WooCommerce", next: "migration_woocommerce" },
      { label: "Compare more platforms", next: "compare_platforms" },
    ],
  },

  cmp_wix: {
    message: "Wix is easier for simple sites but lacks Shopify's e-commerce depth: limited payment gateways, no true inventory management, weaker app ecosystem, and slower page speeds for product-heavy stores. Shopify is purpose-built for selling online.",
    options: [
      { label: "Migrate from Wix", next: "svc_migration" },
      { label: "Compare more platforms", next: "compare_platforms" },
    ],
  },

  cmp_bigcommerce: {
    message: "BigCommerce is Shopify's closest competitor with strong built-in features. However, Shopify wins on: theme ecosystem (1000+ vs 200+), app marketplace (10,000+ vs 1,000+), developer community size, and Shopify Payments integration. BigCommerce charges no transaction fees on any plan though.",
    options: [
      { label: "Migrate from BigCommerce", next: "svc_migration" },
      { label: "Compare more platforms", next: "compare_platforms" },
    ],
  },

  cmp_squarespace: {
    message: "Squarespace excels at beautiful portfolio sites but falls short for e-commerce: limited payment options (Stripe, PayPal, Square only), no true multi-currency, limited checkout customization, and a much smaller app ecosystem. Shopify is the clear winner for serious online selling.",
    options: [
      { label: "Migrate from Squarespace", next: "svc_migration" },
      { label: "Compare more platforms", next: "compare_platforms" },
    ],
  },

  // ─────────────────────────────────────────────
  // STORE MANAGEMENT TIPS
  // ─────────────────────────────────────────────
  tips_hub: {
    message: "Here are some helpful tips for running a successful Shopify store:",
    options: [
      { label: "Best practices for product pages", next: "tips_product_pages" },
      { label: "How to reduce cart abandonment", next: "tips_cart_abandonment" },
      { label: "How to increase average order value", next: "tips_aov" },
      { label: "Email marketing best practices", next: "tips_email" },
      { label: "Back to main menu", next: "root" },
    ],
  },

  tips_product_pages: {
    message: "High-converting product pages need: 5+ high-quality images (including lifestyle shots), a clear price with any savings highlighted, social proof (reviews/ratings), a scannable description with bullet points, trust badges below the CTA, and urgency elements (limited stock, shipping cutoff timers).",
    options: [
      { label: "How many images should I use?", next: "tips_images" },
      { label: "What about product videos?", next: "tips_videos" },
      { label: "Back to Tips", next: "tips_hub" },
    ],
  },

  tips_images: {
    message: "Use 5–8 images per product: 1 hero shot on white background, 2–3 lifestyle/context shots, 1 scale reference, 1 detail/texture close-up, and 1 packaging shot. Images should be 2048x2048px minimum. Use WebP format via Shopify's CDN for automatic compression.",
    options: [
      { label: "Back to Product Pages", next: "tips_product_pages" },
      { label: "Back to Tips", next: "tips_hub" },
    ],
  },

  tips_videos: {
    message: "Product videos increase conversions by 80% (Shopify data). Keep them under 60 seconds, show the product in use, and auto-play muted with captions. We embed videos directly in the product gallery or as a hero section. Shopify supports hosted video and YouTube/Vimeo embeds.",
    options: [
      { label: "Back to Product Pages", next: "tips_product_pages" },
      { label: "Back to Tips", next: "tips_hub" },
    ],
  },

  tips_cart_abandonment: {
    message: "70% of online carts are abandoned. Top fixes: offer free shipping over a threshold, enable express checkout (Shop Pay, Apple Pay), show security badges, add exit-intent popups with a discount, send abandoned cart email sequences (3-email flow recovers 5–10% of carts).",
    options: [
      { label: "Set up abandoned cart emails", next: "tips_abandoned_emails" },
      { label: "Back to Tips", next: "tips_hub" },
      { label: "Explore CRO service", next: "svc_cro" },
    ],
  },

  tips_abandoned_emails: {
    message: "Our recommended abandoned cart email flow: Email 1 at 1 hour (reminder with cart contents), Email 2 at 24 hours (social proof + urgency), Email 3 at 48 hours (small discount offer, e.g. 10% off). This 3-email sequence recovers 5–10% of abandoned carts on average.",
    options: [
      { label: "Set up with Klaviyo", next: "apps_klaviyo_setup" },
      { label: "Back to Cart Abandonment", next: "tips_cart_abandonment" },
    ],
  },

  tips_aov: {
    message: "Increase Average Order Value with: bundle offers ('Complete the look'), free shipping thresholds ($5 above current AOV), upsells on product pages ('Frequently bought together'), cart upsells ('Add X for $Y more'), and volume discounts ('Buy 3, save 15%').",
    options: [
      { label: "Can you implement these?", next: "contact" },
      { label: "Explore CRO service", next: "svc_cro" },
      { label: "Back to Tips", next: "tips_hub" },
    ],
  },

  tips_email: {
    message: "Email generates $36 for every $1 spent — the highest ROI of any marketing channel. Essential Shopify email flows: Welcome series (3 emails), Abandoned cart (3 emails), Post-purchase (2 emails), Win-back (2 emails), and a monthly newsletter. Automate with Klaviyo or Omnisend.",
    options: [
      { label: "Set up email flows", next: "apps_email" },
      { label: "Back to Tips", next: "tips_hub" },
    ],
  },

  // ─────────────────────────────────────────────
  // WORKING WITH US
  // ─────────────────────────────────────────────
  working_with_us: {
    message: "Working with ShopifyPro is designed to be transparent, collaborative, and stress-free. Here's what to expect:",
    options: [
      { label: "What is your communication style?", next: "ww_communication" },
      { label: "What timezone do you work in?", next: "ww_timezone" },
      { label: "Do you sign contracts?", next: "ww_contracts" },
      { label: "Can I see work in progress?", next: "dev_updates" },
      { label: "Back to main menu", next: "root" },
    ],
  },

  ww_communication: {
    message: "We communicate primarily via email and WhatsApp/Slack. You'll get: weekly Friday progress reports, staging store access to see work in real-time, responsive communication (under 4 hours during business hours), and milestone calls at each project phase.",
    options: [
      { label: "Back to Working with Us", next: "working_with_us" },
      { label: "Back to main menu", next: "root" },
    ],
  },

  ww_timezone: {
    message: "We're based in Pakistan (UTC+5) but work with clients globally — US, UK, EU, UAE, and Australia. For US/EU clients, we schedule calls in overlapping hours and our async communication (email/Slack) ensures no time is wasted. Many clients find the timezone difference advantageous — work happens while they sleep.",
    options: [
      { label: "Back to Working with Us", next: "working_with_us" },
      { label: "Talk to us", next: "contact" },
    ],
  },

  ww_contracts: {
    message: "Yes — every project starts with a clear project agreement that outlines: scope of work, deliverables, timeline, payment schedule, revision policy, and intellectual property transfer. This protects both sides and ensures complete transparency. No surprises, no ambiguity.",
    options: [
      { label: "View refund policy", next: "refund_policy" },
      { label: "Back to Working with Us", next: "working_with_us" },
      { label: "Get started", next: "contact" },
    ],
  },

  // ─────────────────────────────────────────────
  // FALLBACK NODE
  // ─────────────────────────────────────────────
  fallback: {
    message: "I don't have an exact answer for that, but our team would love to help! You can reach us directly at webdev.muhammad@gmail.com or WhatsApp +92 320 9246199. We typically respond within 2 hours.",
    options: [
      { label: "Browse our services", next: "services" },
      { label: "View pricing", next: "pricing" },
      { label: "Contact us", next: "contact" },
      { label: "Start over", next: "root" },
    ],
  },

};
