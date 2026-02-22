import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', SALT_ROUNDS);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shopifypro.com' },
    update: {},
    create: {
      email: 'admin@shopifypro.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });
  console.log('Admin created:', admin.email);

  // Create test user
  const userPassword = await bcrypt.hash('User@123', SALT_ROUNDS);
  const user = await prisma.user.upsert({
    where: { email: 'user@shopifypro.com' },
    update: {},
    create: {
      email: 'user@shopifypro.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
    },
  });
  console.log('User created:', user.email);

  // Create services
  const services = [
    {
      title: 'Shopify Store Setup',
      slug: 'shopify-store-setup',
      description: 'Complete Shopify store setup from scratch. We handle everything from theme selection to product upload, payment gateway integration, and domain configuration.',
      shortDesc: 'Full store setup with theme, products, and payment integration.',
      price: 499,
      features: ['Theme installation & customization', 'Product upload (up to 50)', 'Payment gateway setup', 'Domain configuration', 'Basic SEO setup'],
      isFeatured: true,
      sortOrder: 1,
    },
    {
      title: 'Custom Theme Development',
      slug: 'custom-theme-development',
      description: 'Bespoke Shopify theme built from scratch using Shopify 2.0 architecture. Fully responsive, optimized for speed, and tailored to your brand.',
      shortDesc: 'Unique, high-performance custom Shopify theme.',
      price: 1999,
      features: ['Custom design from scratch', 'Shopify 2.0 architecture', 'Mobile-first responsive', 'Speed optimized', 'Section-based customization'],
      isFeatured: true,
      sortOrder: 2,
    },
    {
      title: 'Shopify SEO Optimization',
      slug: 'shopify-seo-optimization',
      description: 'Comprehensive SEO audit and optimization for your Shopify store. Improve rankings, drive organic traffic, and increase conversions.',
      shortDesc: 'Boost rankings and organic traffic with expert SEO.',
      price: 799,
      features: ['Full SEO audit', 'Meta tags optimization', 'Schema markup', 'Speed optimization', 'Monthly reporting'],
      isFeatured: true,
      sortOrder: 3,
    },
    {
      title: 'App Integration & Development',
      slug: 'app-integration-development',
      description: 'Custom Shopify app development and third-party app integrations to extend your store functionality.',
      shortDesc: 'Custom apps and integrations for your store.',
      price: 1499,
      features: ['Custom app development', 'Third-party integrations', 'API development', 'Webhook setup', 'Testing & deployment'],
      isFeatured: false,
      sortOrder: 4,
    },
    {
      title: 'Store Migration',
      slug: 'store-migration',
      description: 'Seamless migration from WooCommerce, Magento, BigCommerce, or any platform to Shopify with zero data loss.',
      shortDesc: 'Migrate to Shopify from any platform seamlessly.',
      price: 999,
      features: ['Data migration', 'URL redirects', 'SEO preservation', 'Design recreation', 'Post-migration support'],
      isFeatured: false,
      sortOrder: 5,
    },
    {
      title: 'Conversion Rate Optimization',
      slug: 'conversion-rate-optimization',
      description: 'Data-driven CRO strategies to maximize your store revenue. A/B testing, UX improvements, and checkout optimization.',
      shortDesc: 'Maximize revenue with data-driven optimization.',
      price: 1299,
      features: ['Conversion audit', 'A/B testing setup', 'Checkout optimization', 'UX improvements', 'Analytics setup'],
      isFeatured: false,
      sortOrder: 6,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }
  console.log(`${services.length} services created`);

  // Create blog posts
  const posts = [
    {
      title: '10 Tips to Optimize Your Shopify Store Speed',
      slug: '10-tips-optimize-shopify-store-speed',
      content: '<h2>Why Speed Matters</h2><p>Store speed directly impacts conversion rates. Studies show that a 1-second delay in page load time can reduce conversions by 7%.</p><h2>1. Optimize Images</h2><p>Use WebP format and compress images before uploading. Shopify automatically serves responsive images but starting with optimized files makes a big difference.</p><h2>2. Minimize Apps</h2><p>Each app adds JavaScript and CSS to your store. Audit your apps regularly and remove any that are not actively contributing to revenue.</p>',
      excerpt: 'Learn proven strategies to make your Shopify store lightning fast and improve conversion rates.',
      metaTitle: '10 Tips to Optimize Your Shopify Store Speed | ShopifyPro',
      metaDesc: 'Learn proven strategies to make your Shopify store lightning fast and improve conversion rates.',
      tags: ['Performance', 'Shopify', 'Optimization'],
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'Shopify 2.0: Everything You Need to Know',
      slug: 'shopify-2-everything-you-need-to-know',
      content: '<h2>What is Shopify 2.0?</h2><p>Shopify 2.0 represents a major upgrade to the Shopify platform, introducing Online Store 2.0 themes with sections on every page, app blocks, and metafields.</p><h2>Key Features</h2><p>The biggest change is sections everywhere. Previously, only the homepage supported sections. Now every page can be customized through the theme editor.</p>',
      excerpt: 'A comprehensive guide to Shopify 2.0 features and how to leverage them for your store.',
      metaTitle: 'Shopify 2.0 Guide | ShopifyPro',
      metaDesc: 'A comprehensive guide to Shopify 2.0 features and how to leverage them.',
      tags: ['Shopify 2.0', 'Guide', 'Development'],
      isPublished: true,
      publishedAt: new Date(),
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log(`${posts.length} blog posts created`);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
