import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const PROJECTS = [
  {
    title: 'SpaCeylon',
    slug: 'spaceylon',
    category: 'Custom Theme',
    description: 'Premium ayurvedic luxury brand from Sri Lanka with an elegant Shopify storefront featuring rich product storytelling, multi-currency support, and a refined checkout experience.',
    tags: ['Shopify 2.0', 'Custom Theme', 'Luxury'],
    liveUrl: 'https://spaceylon.ae/',
    results: ['+280% Conversions', '1.4s Load Time', '35K+ Monthly Visitors'],
    sortOrder: 1,
  },
  {
    title: 'Brentwood General Store',
    slug: 'brentwood-general-store',
    category: 'Store Setup',
    description: 'Complete Shopify store for a charming general store offering curated home goods, pantry items, and gifts with a warm, community-focused brand experience.',
    tags: ['Store Setup', 'Home & Lifestyle', 'Curated'],
    liveUrl: 'https://www.brentwoodgeneralstore.com/',
    results: ['200+ Products', '4.9 Star Rating', '25K+ Customers'],
    sortOrder: 2,
  },
  {
    title: 'Derma Me',
    slug: 'derma-me',
    category: 'Custom Theme',
    description: 'Clean, modern Shopify theme for a professional skincare brand featuring product comparison tools, ingredient highlights, and a streamlined subscription model.',
    tags: ['Custom Theme', 'Beauty', 'Skincare'],
    liveUrl: 'https://dermame.com/',
    results: ['+190% Sales', '2.1s Load Time', '98% Satisfaction'],
    sortOrder: 3,
  },
  {
    title: 'UAE Store',
    slug: 'uae-store',
    category: 'Store Setup',
    description: 'Full Shopify store setup for a UAE-based e-commerce brand with RTL support, local payment gateways, and region-specific shipping configurations.',
    tags: ['Store Setup', 'UAE', 'Multi-currency'],
    liveUrl: 'https://uae-store-9402.myshopify.com/',
    results: ['Multi-currency', 'RTL Support', 'Local Payments'],
    sortOrder: 4,
  },
  {
    title: 'Goodfair',
    slug: 'goodfair',
    category: 'App Development',
    description: 'Sustainable thrift fashion brand with a unique mystery bundle concept. Custom app for bundle management, size-based inventory, and eco-impact tracking.',
    tags: ['Custom App', 'Sustainable', 'Fashion'],
    liveUrl: 'https://goodfair1.myshopify.com/',
    results: ['50K+ Bundles Sold', '3x Revenue Growth', 'Zero Waste Mission'],
    sortOrder: 5,
  },
  {
    title: 'Silk & Willow',
    slug: 'silk-and-willow',
    category: 'Custom Theme',
    description: 'Ethereal Shopify theme for a sustainable wedding textiles brand featuring plant-dyed ribbons and fabrics with artisanal photography and poetic storytelling.',
    tags: ['Custom Theme', 'Wedding', 'Sustainable'],
    liveUrl: 'https://silkandwillow.com/',
    results: ['+220% Conversions', '45K+ Monthly Visitors', '4.9 Star Rating'],
    sortOrder: 6,
  },
  {
    title: 'Fly By Jing',
    slug: 'fly-by-jing',
    category: 'SEO & CRO',
    description: 'Bold Shopify store for a Sichuan chili crisp brand with vibrant design, cultural storytelling, and optimized checkout driving strong conversions.',
    tags: ['SEO', 'CRO', 'Food & Beverage'],
    liveUrl: 'https://flybyjing.com/',
    results: ['+300% Organic Traffic', '+95% Conversion Rate', 'Page 1 Rankings'],
    sortOrder: 7,
  },
  {
    title: 'Herbivore Botanicals',
    slug: 'herbivore-botanicals',
    category: 'Custom Theme',
    description: 'Minimalist Shopify theme for an all-natural skincare brand with a muted pastel palette, spa-like aesthetics, and seamless product discovery experience.',
    tags: ['Custom Theme', 'Beauty', 'Natural'],
    liveUrl: 'https://herbivorebotanicals.com/',
    results: ['+175% Sales', '1.8s Load Time', '60K+ Customers'],
    sortOrder: 8,
  },
  {
    title: 'Fishwife',
    slug: 'fishwife',
    category: 'Store Setup',
    description: 'Vibrant and playful Shopify store for a premium tinned seafood brand with colorful packaging-inspired design and bold illustrations.',
    tags: ['Store Setup', 'Food & Beverage', 'Branding'],
    liveUrl: 'https://eatfishwife.com/',
    results: ['500+ Products', '$1.5M+ Revenue', '4.8 Star Rating'],
    sortOrder: 9,
  },
  {
    title: 'Tentree',
    slug: 'tentree',
    category: 'App Development',
    description: 'Sustainable apparel brand with custom tree-planting tracker integration. Every purchase plants 10 trees, with progress visible throughout the shopping experience.',
    tags: ['Custom App', 'Sustainable', 'Fashion'],
    liveUrl: 'https://tentree.com/',
    results: ['110M+ Trees Planted', '3x Retention', '4.7 Star Rating'],
    sortOrder: 10,
  },
  {
    title: 'Artisaire',
    slug: 'artisaire',
    category: 'Custom Theme',
    description: 'Refined luxury Shopify theme for a wax seal artisan brand with meticulous product photography and interactive customization tools.',
    tags: ['Custom Theme', 'Stationery', 'Luxury'],
    liveUrl: 'https://artisaire.com/',
    results: ['+250% Conversions', '30K+ Monthly Visitors', '99% Satisfaction'],
    sortOrder: 11,
  },
  {
    title: 'Venus ET Fleur',
    slug: 'venus-et-fleur',
    category: 'SEO & CRO',
    description: 'High-end luxury gifting brand specializing in eternity roses. Dark, moody design with jewelry-store aesthetics and optimized gifting checkout flow.',
    tags: ['SEO', 'CRO', 'Luxury Gifting'],
    liveUrl: 'https://venusetfleur.com/',
    results: ['+400% Organic Traffic', '+120% AOV', 'Featured by Shopify'],
    sortOrder: 12,
  },
  {
    title: 'Maguire Shoes',
    slug: 'maguire-shoes',
    category: 'Migration',
    description: 'Seamless platform migration for a Montreal boutique shoe brand. Editorial-quality lookbook design with European-inspired aesthetics.',
    tags: ['Migration', 'Fashion', 'Footwear'],
    liveUrl: 'https://maguireshoes.com/',
    results: ['Zero Downtime', '40% Speed Boost', '2x Mobile Sales'],
    sortOrder: 13,
  },
  {
    title: 'Flourist',
    slug: 'flourist',
    category: 'Store Setup',
    description: 'Elegant Shopify store for a traceable specialty grains brand. Boutique-level visual design for pantry staples with detailed provenance information.',
    tags: ['Store Setup', 'Food & Beverage', 'Organic'],
    liveUrl: 'https://flourist.com/',
    results: ['300+ Products', '25K+ Customers', '4.9 Star Rating'],
    sortOrder: 14,
  },
  {
    title: 'Bebemoss',
    slug: 'bebemoss',
    category: 'App Development',
    description: 'Handcrafted organic cotton toys brand with B Corp certification. Custom inventory and artisan management system supporting refugee employment.',
    tags: ['Custom App', 'Kids', 'Social Impact'],
    liveUrl: 'https://bebemoss.com/',
    results: ['B Corp Certified', '5K+ Toys Sold', '100% Organic'],
    sortOrder: 15,
  },
  {
    title: 'Hiut Denim Co.',
    slug: 'hiut-denim-co',
    category: 'Custom Theme',
    description: 'Clean, minimal Shopify theme for a Welsh denim brand built on the philosophy of "Do One Thing Well." Storytelling-focused design with craftsmanship at its core.',
    tags: ['Custom Theme', 'Fashion', 'Denim'],
    liveUrl: 'https://hiutdenim.co.uk/',
    results: ['+160% Sales', '20K+ Monthly Visitors', 'Award-Winning Design'],
    sortOrder: 16,
  },
];

const FAQS = [
  {
    question: 'How long does it take to build a Shopify store?',
    answer: 'A standard Shopify store setup typically takes 1-2 weeks. Custom theme development can take 4-8 weeks depending on complexity. We provide detailed timelines during the discovery phase of every project.',
    sortOrder: 1,
  },
  {
    question: 'Do you offer ongoing support after the store is launched?',
    answer: 'Yes! We offer flexible support packages that include maintenance, updates, performance monitoring, and strategic consulting. We are committed to your long-term success.',
    sortOrder: 2,
  },
  {
    question: 'Can you migrate my existing store to Shopify?',
    answer: 'Absolutely. We have extensive experience migrating stores from WooCommerce, Magento, BigCommerce, Wix, and other platforms. We ensure zero data loss, proper URL redirects, and SEO preservation.',
    sortOrder: 3,
  },
  {
    question: 'What makes your services different from other Shopify agencies?',
    answer: 'We combine deep technical expertise with a focus on business results. Every decision we make is driven by data and aimed at maximizing your ROI. Plus, we offer transparent pricing with no hidden fees.',
    sortOrder: 4,
  },
  {
    question: 'Do you build custom Shopify apps?',
    answer: 'Yes, we develop custom public and private Shopify apps tailored to your specific needs. From inventory management to customer engagement tools, we can build solutions that extend your store beyond out-of-the-box capabilities.',
    sortOrder: 5,
  },
  {
    question: 'What is your pricing structure?',
    answer: 'We offer transparent, project-based pricing. Each service has a starting price listed on our services page. For custom projects, we provide detailed quotes after a free discovery call where we understand your requirements.',
    sortOrder: 6,
  },
  {
    question: 'Will my Shopify store be mobile-friendly?',
    answer: 'Absolutely! All our stores are built mobile-first, meaning we design and develop for mobile devices first, then scale up to tablets and desktops. Over 70% of e-commerce traffic comes from mobile, so this is non-negotiable for us.',
    sortOrder: 7,
  },
  {
    question: 'Can you help with Shopify Plus for enterprise needs?',
    answer: 'Yes, we work with Shopify Plus for high-volume merchants who need advanced features like custom checkout, automation with Shopify Flow, wholesale channels, and multi-store management. We can help you evaluate if Plus is right for your business.',
    sortOrder: 8,
  },
  {
    question: 'Do you handle product photography and content creation?',
    answer: 'While our core focus is development and optimization, we partner with professional photographers and content creators. We can coordinate the entire creative process or work with your existing assets to ensure a cohesive brand experience.',
    sortOrder: 9,
  },
  {
    question: 'How do you handle SEO during a store migration?',
    answer: 'SEO preservation is a top priority during migration. We set up 301 redirects for all URLs, migrate meta titles and descriptions, preserve your sitemap structure, and monitor rankings post-launch. Our goal is zero organic traffic loss.',
    sortOrder: 10,
  },
  {
    question: 'Can you integrate third-party apps and services?',
    answer: 'Yes, we integrate all major third-party services including payment gateways (Stripe, PayPal, Klarna), email marketing (Klaviyo, Mailchimp), shipping (ShipStation, Shippo), CRM tools, and analytics platforms. If it has an API, we can connect it.',
    sortOrder: 11,
  },
  {
    question: 'What payment methods can my Shopify store accept?',
    answer: 'Shopify supports 100+ payment gateways worldwide. We can set up Shopify Payments (powered by Stripe), PayPal, Apple Pay, Google Pay, Shop Pay, buy-now-pay-later options like Klarna and Afterpay, and region-specific gateways.',
    sortOrder: 12,
  },
  {
    question: 'Do you offer a satisfaction guarantee?',
    answer: 'We stand behind our work. Each project includes a revision phase where we refine the deliverables based on your feedback. We also offer a 30-day post-launch support period to address any issues that arise after going live.',
    sortOrder: 13,
  },
  {
    question: 'Can I update the store content myself after launch?',
    answer: 'Absolutely! We build every store with content management in mind. Using Shopify 2.0 sections and metafields, you can easily update text, images, products, and page layouts without any coding knowledge. We also provide a training session after launch.',
    sortOrder: 14,
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Mitchell',
    role: 'CEO, LuxeBrand Co.',
    rating: 5,
    comment: 'Absolutely transformed our Shopify store! The custom theme they built is stunning and our conversion rate increased by 40% within the first month. Highly recommend their services.',
    sortOrder: 1,
  },
  {
    name: 'James Rodriguez',
    role: 'Founder, TechGear Store',
    rating: 5,
    comment: 'Professional, responsive, and incredibly talented. They migrated our entire WooCommerce store to Shopify without any downtime. The attention to detail was remarkable.',
    sortOrder: 2,
  },
  {
    name: 'Emily Chen',
    role: 'Marketing Director, FashionHub',
    rating: 5,
    comment: 'The SEO optimization service was a game-changer. Our organic traffic increased by 200% in just three months. Worth every penny invested.',
    sortOrder: 3,
  },
  {
    name: 'Michael Thompson',
    role: 'Operations Manager, FreshFoods',
    rating: 5,
    comment: 'Outstanding app development work. The custom features they built streamlined our operations and saved us hours of manual work every week.',
    sortOrder: 4,
  },
  {
    name: 'Lisa Park',
    role: 'Owner, BeautyEssentials',
    rating: 4,
    comment: 'Great communication throughout the project. They delivered our store setup ahead of schedule and the end result exceeded our expectations.',
    sortOrder: 5,
  },
  {
    name: 'David Wilson',
    role: 'Co-founder, SportsPro',
    rating: 5,
    comment: 'The CRO audit they performed uncovered opportunities we never knew existed. Our revenue has grown 60% since implementing their recommendations.',
    sortOrder: 6,
  },
];

async function main() {
  console.log('Seeding projects, FAQs, and testimonials...');

  // Upsert projects (skip if slug already exists)
  for (const project of PROJECTS) {
    const existing = await prisma.project.findUnique({ where: { slug: project.slug } });
    if (!existing) {
      await prisma.project.create({ data: project });
      console.log(`  Created project: ${project.title}`);
    } else {
      console.log(`  Skipped (exists): ${project.title}`);
    }
  }

  // Insert FAQs (skip if exact question already exists)
  for (const faq of FAQS) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } });
    if (!existing) {
      await prisma.faq.create({ data: faq });
      console.log(`  Created FAQ: ${faq.question.slice(0, 50)}...`);
    } else {
      console.log(`  Skipped (exists): ${faq.question.slice(0, 50)}...`);
    }
  }

  // Insert testimonials (skip if name already exists)
  for (const testimonial of TESTIMONIALS) {
    const existing = await prisma.testimonial.findFirst({ where: { name: testimonial.name } });
    if (!existing) {
      await prisma.testimonial.create({ data: testimonial });
      console.log(`  Created testimonial: ${testimonial.name}`);
    } else {
      console.log(`  Skipped (exists): ${testimonial.name}`);
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
