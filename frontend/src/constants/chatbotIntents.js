// ─────────────────────────────────────────────────────────────
// Intent-based matching engine for the ShopifyPro chatbot.
// Each intent has: patterns (regex or keyword arrays), a
// response type ('node' to navigate the tree, 'direct' for
// inline replies), and optional follow-up options.
// ─────────────────────────────────────────────────────────────

export const INTENTS = [

  // ═══════════════════════════════════════════════
  // GREETINGS & SMALL TALK
  // ═══════════════════════════════════════════════
  {
    id: 'greeting_morning',
    patterns: [
      /^good\s*morning/i,
    ],
    type: 'direct',
    message: "Good morning! Rise and shine — it's a great day to grow your Shopify business!\n\nI'm your ShopifyPro assistant, here to help with anything from store setup to scaling your sales. Whether you need a quick answer or a full consultation, I've got you covered.\n\nWhat can I help you with today?",
    options: [
      { label: "Explore our services", next: "services" },
      { label: "View pricing & packages", next: "pricing" },
      { label: "I need help with my store", next: "technical" },
      { label: "Get a free consultation", next: "contact" },
    ],
  },

  {
    id: 'greeting_afternoon',
    patterns: [
      /^good\s*afternoon/i,
    ],
    type: 'direct',
    message: "Good afternoon! Hope your day is going well.\n\nI'm the ShopifyPro assistant — ready to help you with anything Shopify-related. From building a new store to optimizing conversions, I'm here for you.\n\nWhat would you like to explore?",
    options: [
      { label: "Explore our services", next: "services" },
      { label: "View pricing & packages", next: "pricing" },
      { label: "I need help with my store", next: "technical" },
      { label: "Get a free consultation", next: "contact" },
    ],
  },

  {
    id: 'greeting_evening',
    patterns: [
      /^good\s*evening/i,
    ],
    type: 'direct',
    message: "Good evening! Thanks for stopping by ShopifyPro.\n\nEven at this hour, I'm fully available to answer your Shopify questions, walk you through our services, or help plan your next project. No question is too small!\n\nHow can I assist you tonight?",
    options: [
      { label: "Explore our services", next: "services" },
      { label: "View pricing & packages", next: "pricing" },
      { label: "I need help with my store", next: "technical" },
      { label: "Get a free consultation", next: "contact" },
    ],
  },

  {
    id: 'greeting_night',
    patterns: [
      /^good\s*night/i,
    ],
    type: 'direct',
    message: "Good night! Before you go, just know that I'm available 24/7 — so feel free to come back anytime.\n\nIf you have a quick question right now, I'm happy to help. Otherwise, you can reach our team anytime at webdev.muhammad@gmail.com or WhatsApp +92 320 9246199.\n\nSweet dreams and happy selling!",
    options: [
      { label: "Actually, I have a question", next: "root" },
      { label: "Contact us tomorrow", next: "contact" },
    ],
  },

  {
    id: 'greeting',
    patterns: [
      /^(hi|hey|hello|hola|yo|sup|hii+|helo|heyy+|assalam|salam|aoa|hy)$/i,
      /^(good\s*day)$/i,
      /^(what'?s?\s*up|howdy|greetings|namaste)$/i,
      /^(hi+|hey+|hello+|helo+)\s+(there|chatbot|bot|assistant|shopifypro|buddy|friend|mate|bro|dear|sir|madam|team)/i,
      /^(dear|respected)\s+(sir|madam|team|shopifypro)/i,
      /^(assalam\s*o?\s*alaikum|wa\s*alaikum|aoa)/i,
    ],
    type: 'direct',
    message: "Hey there! Welcome to ShopifyPro — great to have you here!\n\nI'm your Shopify expert assistant, ready to help you with everything from launching a brand-new store to scaling an existing one. Whether you have a quick question or need a full project consultation, I've got you covered.\n\nWhat would you like to explore?",
    options: [
      { label: "Explore our services", next: "services" },
      { label: "View pricing & packages", next: "pricing" },
      { label: "I need help with my store", next: "technical" },
      { label: "Get a free consultation", next: "contact" },
      { label: "See our work & portfolio", next: "about_us" },
    ],
  },

  {
    id: 'how_are_you',
    patterns: [
      /how\s*are\s*you/i,
      /how\s*r\s*u/i,
      /how\s*do\s*you\s*do/i,
      /how'?s?\s*it\s*going/i,
    ],
    type: 'direct',
    message: "I'm doing fantastic, thanks for asking! Always energized and ready to help with your Shopify questions. What's on your mind today?",
    options: [
      { label: "Tell me about your services", next: "services" },
      { label: "I have a technical question", next: "technical" },
      { label: "Just browsing around", next: "root" },
    ],
  },

  {
    id: 'thanks',
    patterns: [
      /^(thanks|thank\s*you|thx|ty|tysm|appreciate|cheers|shukriya|jazak)/i,
      /thanks\s*(a\s*lot|so\s*much|buddy|mate|bro)/i,
    ],
    type: 'direct',
    message: "You're very welcome! Glad I could help. If anything else comes to mind, don't hesitate to ask — I'm here 24/7.\n\nIs there anything else you'd like to know?",
    options: [
      { label: "Yes, I have more questions", next: "root" },
      { label: "No, that's all for now", next: "goodbye" },
    ],
  },

  {
    id: 'goodbye',
    patterns: [
      /^(bye|goodbye|see\s*ya|later|cya|take\s*care|good\s*night|ttyl|peace|ok\s*bye)/i,
    ],
    type: 'direct',
    message: "Thanks for chatting with ShopifyPro! It was great talking to you.\n\nWhenever you're ready to start your project or have more questions, we're just a message away. You can reach us anytime at webdev.muhammad@gmail.com or WhatsApp +92 320 9246199.\n\nHave an amazing day!",
    options: [
      { label: "Actually, one more question", next: "root" },
      { label: "Contact us", next: "contact" },
    ],
  },

  {
    id: 'who_are_you',
    patterns: [
      /who\s*are\s*you/i,
      /what\s*are\s*you/i,
      /are\s*you\s*(a\s*)?(bot|robot|ai|human|real)/i,
      /is\s*this\s*(a\s*)?(bot|robot|ai|automated)/i,
    ],
    type: 'direct',
    message: "I'm the ShopifyPro assistant — a smart chatbot built with deep knowledge about Shopify development, SEO, conversion optimization, and everything e-commerce.\n\nI can answer most questions instantly, guide you through our services, and help you figure out exactly what your store needs. For complex project discussions, I can connect you directly with our team!\n\nHow can I help you?",
    options: [
      { label: "Talk to a human", next: "contact" },
      { label: "What services do you offer?", next: "services" },
      { label: "Tell me about your team", next: "about_us" },
      { label: "Show me pricing", next: "pricing" },
    ],
  },

  // ═══════════════════════════════════════════════
  // HELP & GENERAL REQUESTS
  // ═══════════════════════════════════════════════
  {
    id: 'need_help',
    patterns: [
      /^(help|i\s*need\s*help|help\s*me|can\s*you\s*help)/i,
      /need\s*(some\s*)?help/i,
      /assist(ance)?/i,
      /i('?m|\s*am)\s*(stuck|confused|lost|unsure)/i,
      /what\s*can\s*you\s*(do|help\s*with)/i,
      /how\s*can\s*you\s*help/i,
    ],
    type: 'direct',
    message: "Absolutely, I'd love to help! Here's what I can assist you with:\n\n• Build a new Shopify store from scratch ($499)\n• Custom theme design & development ($1,999)\n• SEO optimization & traffic growth ($799)\n• Custom Shopify app development ($1,499+)\n• Store migration from any platform ($999)\n• Conversion rate optimization ($1,299)\n• Technical Shopify questions & guidance\n• Pricing, timelines & payment info\n\nJust pick an area below or type your question — I'm here to guide you!",
    options: [
      { label: "Build a new store", next: "svc_setup" },
      { label: "Custom theme", next: "svc_theme" },
      { label: "SEO help", next: "svc_seo" },
      { label: "Technical question", next: "technical" },
      { label: "View all services", next: "services" },
      { label: "Talk to a human", next: "contact" },
    ],
  },

  {
    id: 'get_started',
    patterns: [
      /get\s*started/i,
      /how\s*(do\s*i|to|can\s*i)\s*(start|begin|get\s*going)/i,
      /where\s*(do\s*i|to|should\s*i)\s*start/i,
      /i\s*want\s*to\s*(start|begin|build|create|launch|open)/i,
      /new\s*store/i,
      /start\s*(a|my)\s*store/i,
    ],
    type: 'node',
    node: 'getting_started',
  },

  // ═══════════════════════════════════════════════
  // CONTACT & COMMUNICATION
  // ═══════════════════════════════════════════════
  {
    id: 'contact_info',
    patterns: [
      /contact\s*(info|details|information|us|you|number|them)?/i,
      /how\s*(can|do)\s*i\s*(contact|reach|call|email|message)/i,
      /give\s*(me\s*)?(your\s*)?(contact|email|phone|number|whatsapp)/i,
      /your\s*(email|phone|number|whatsapp|address)/i,
      /email\s*(address|id)?/i,
      /phone\s*(number)?/i,
      /whatsapp\s*(number)?/i,
      /call\s*(you|us|them)/i,
      /talk\s*to\s*(a\s*)?(human|person|someone|real|agent|team|developer)/i,
      /speak\s*(to|with)\s*(a\s*)?(human|person|someone|real)/i,
      /can\s*i\s*(talk|speak|chat)\s*(to|with)/i,
      /connect\s*(me\s*)?(with|to)/i,
    ],
    type: 'node',
    node: 'contact',
  },

  // ═══════════════════════════════════════════════
  // PRICING & COST
  // ═══════════════════════════════════════════════
  {
    id: 'pricing',
    patterns: [
      /pric(e|es|ing)/i,
      /how\s*much\s*(does|do|is|will|would|for)/i,
      /cost(s)?(\s*of)?/i,
      /budget/i,
      /afford/i,
      /cheap(er|est)?/i,
      /expensive/i,
      /rate(s)?/i,
      /fee(s)?/i,
      /quote/i,
      /estimate/i,
      /what\s*(do|will)\s*(you|it)\s*charge/i,
      /charges?/i,
      /payment\s*plan/i,
    ],
    type: 'node',
    node: 'pricing',
  },

  // ═══════════════════════════════════════════════
  // SERVICES (GENERAL)
  // ═══════════════════════════════════════════════
  {
    id: 'services',
    patterns: [
      /^services?$/i,
      /what\s*(services?|do\s*you)\s*(do|offer|provide)/i,
      /your\s*services?/i,
      /list\s*(of\s*)?services?/i,
      /show\s*(me\s*)?services?/i,
      /what\s*can\s*you\s*(build|do|make|create)/i,
    ],
    type: 'node',
    node: 'services',
  },

  // ═══════════════════════════════════════════════
  // STORE SETUP
  // ═══════════════════════════════════════════════
  {
    id: 'store_setup',
    patterns: [
      /store\s*setup/i,
      /set\s*up\s*(a|my|the)?\s*store/i,
      /build\s*(a|my|me\s*a)?\s*(new\s*)?store/i,
      /create\s*(a|my|me\s*a)?\s*store/i,
      /launch\s*(a|my)?\s*store/i,
      /new\s*shopify\s*store/i,
      /setup\s*shopify/i,
      /shopify\s*setup/i,
    ],
    type: 'node',
    node: 'svc_setup',
  },

  // ═══════════════════════════════════════════════
  // CUSTOM THEME
  // ═══════════════════════════════════════════════
  {
    id: 'custom_theme',
    patterns: [
      /custom\s*theme/i,
      /theme\s*(dev|develop|design|build|creat)/i,
      /shopify\s*theme/i,
      /redesign/i,
      /new\s*design/i,
      /design\s*(a|my)?\s*(store|website|shop)/i,
      /custom\s*design/i,
      /ui\s*\/?\s*ux/i,
      /figma/i,
      /look\s*and\s*feel/i,
      /brand(ed|ing)?\s*(theme|design|store)/i,
    ],
    type: 'node',
    node: 'svc_theme',
  },

  // ═══════════════════════════════════════════════
  // SEO
  // ═══════════════════════════════════════════════
  {
    id: 'seo',
    patterns: [
      /\bseo\b/i,
      /search\s*engine/i,
      /organic\s*traffic/i,
      /google\s*rank/i,
      /rank(ing)?\s*(on|in|for)\s*google/i,
      /(increase|improve|boost|grow|get\s*more)\s*traffic/i,
      /keyword/i,
      /meta\s*(title|tag|description)/i,
      /backlink/i,
      /sitemap/i,
      /core\s*web\s*vital/i,
    ],
    type: 'node',
    node: 'svc_seo',
  },

  // ═══════════════════════════════════════════════
  // APP DEVELOPMENT
  // ═══════════════════════════════════════════════
  {
    id: 'app_dev',
    patterns: [
      /app\s*(dev|develop|build|creat)/i,
      /custom\s*app/i,
      /shopify\s*app/i,
      /build\s*(an|a|me\s*an?)?\s*app/i,
      /private\s*app/i,
      /public\s*app/i,
      /app\s*store\s*(listing|submission)/i,
      /api\s*integrat/i,
      /third[- ]?party\s*integrat/i,
      /webhook/i,
    ],
    type: 'node',
    node: 'svc_app',
  },

  // ═══════════════════════════════════════════════
  // MIGRATION
  // ═══════════════════════════════════════════════
  {
    id: 'migration',
    patterns: [
      /migrat(e|ion|ing)/i,
      /move\s*(my|from|to)\s*(store|shopify|woo|magento|wix|squarespace|bigcommerce)/i,
      /switch\s*(to|from)\s*(shopify|woo|magento)/i,
      /transfer\s*(my|from|to)/i,
      /woocommerce\s*to\s*shopify/i,
      /magento\s*to\s*shopify/i,
      /wix\s*to\s*shopify/i,
      /squarespace\s*to\s*shopify/i,
      /platform\s*(switch|change|move)/i,
    ],
    type: 'node',
    node: 'svc_migration',
  },

  // ═══════════════════════════════════════════════
  // CRO (CONVERSION RATE)
  // ═══════════════════════════════════════════════
  {
    id: 'cro',
    patterns: [
      /\bcro\b/i,
      /conversion\s*rate/i,
      /increase\s*(my\s*)?conversion/i,
      /more\s*sales/i,
      /not\s*(enough\s*)?sales/i,
      /no\s*sales/i,
      /low\s*conversion/i,
      /a\s*\/?\s*b\s*test/i,
      /split\s*test/i,
      /cart\s*abandon/i,
      /checkout\s*(drop|abandon|optimi)/i,
      /people\s*(aren'?t|are\s*not|don'?t)\s*(buying|converting)/i,
      /improve\s*(my\s*)?(sales|conversion|revenue)/i,
      /boost\s*(my\s*)?(sales|conversion|revenue)/i,
    ],
    type: 'node',
    node: 'svc_cro',
  },

  // ═══════════════════════════════════════════════
  // SPEED / PERFORMANCE
  // ═══════════════════════════════════════════════
  {
    id: 'speed',
    patterns: [
      /speed/i,
      /slow\s*(store|site|website|page|loading)/i,
      /(page|site|store)\s*(is\s*)?slow/i,
      /load\s*time/i,
      /performance/i,
      /lighthouse/i,
      /pagespeed/i,
      /page\s*speed/i,
      /optimize\s*(my\s*)?(site|store|speed|performance)/i,
      /too\s*slow/i,
      /takes\s*too\s*long/i,
    ],
    type: 'node',
    node: 'tech_speed',
  },

  // ═══════════════════════════════════════════════
  // SHOPIFY PLANS
  // ═══════════════════════════════════════════════
  {
    id: 'shopify_plans',
    patterns: [
      /shopify\s*plan/i,
      /which\s*plan/i,
      /basic\s*(vs|or|versus)\s*shopify/i,
      /shopify\s*(basic|advanced|plus|starter)/i,
      /what\s*plan\s*(do\s*i|should\s*i)/i,
      /upgrade\s*(my\s*)?(plan|shopify)/i,
    ],
    type: 'node',
    node: 'shopify_plans',
  },

  // ═══════════════════════════════════════════════
  // SHOPIFY PLUS
  // ═══════════════════════════════════════════════
  {
    id: 'shopify_plus',
    patterns: [
      /shopify\s*plus/i,
      /enterprise\s*(shopify|plan|store)/i,
      /do\s*i\s*need\s*(shopify\s*)?plus/i,
    ],
    type: 'node',
    node: 'shopify_plus',
  },

  // ═══════════════════════════════════════════════
  // SUPPORT & MAINTENANCE
  // ═══════════════════════════════════════════════
  {
    id: 'support',
    patterns: [
      /support/i,
      /maintenance/i,
      /ongoing\s*(help|support|maintenance)/i,
      /after\s*launch/i,
      /post[- ]?launch/i,
      /retainer/i,
      /monthly\s*(plan|support|maintenance)/i,
      /emergency/i,
      /bug\s*fix/i,
      /something\s*(is\s*)?(broken|wrong|not\s*working)/i,
      /my\s*store\s*(is\s*)?(broken|down|not\s*working)/i,
    ],
    type: 'node',
    node: 'support_packages',
  },

  // ═══════════════════════════════════════════════
  // PROCESS & TIMELINE
  // ═══════════════════════════════════════════════
  {
    id: 'process',
    patterns: [
      /process/i,
      /how\s*(do\s*you|does\s*(it|this))\s*work/i,
      /your\s*(work|development)\s*process/i,
      /workflow/i,
      /step\s*by\s*step/i,
      /what\s*(are\s*the|is\s*your)\s*steps?/i,
    ],
    type: 'node',
    node: 'process',
  },

  {
    id: 'timeline',
    patterns: [
      /timeline/i,
      /how\s*long\s*(does|will|would)\s*(it|this|the\s*project)/i,
      /turnaround/i,
      /delivery\s*time/i,
      /when\s*(will|can)\s*(it|my\s*store)\s*be\s*(ready|done|finished|live)/i,
      /deadline/i,
      /rush/i,
      /urgent/i,
      /fast(er)?\s*delivery/i,
      /how\s*(quickly|fast|soon)/i,
    ],
    type: 'node',
    node: 'timelines',
  },

  // ═══════════════════════════════════════════════
  // ABOUT / TRUST
  // ═══════════════════════════════════════════════
  {
    id: 'about',
    patterns: [
      /about\s*(you|your\s*company|your\s*team|shopifypro|us)/i,
      /who\s*(is|are)\s*(behind|your\s*team|shopifypro)/i,
      /tell\s*me\s*about\s*(you|your)/i,
      /your\s*(experience|expertise|background|portfolio)/i,
      /case\s*stud/i,
      /portfolio/i,
      /previous\s*(work|project|client)/i,
      /testimonial/i,
      /review/i,
      /client\s*(feedback|review|testimonial)/i,
    ],
    type: 'node',
    node: 'about_us',
  },

  // ═══════════════════════════════════════════════
  // TECHNICAL TOPICS
  // ═══════════════════════════════════════════════
  {
    id: 'headless',
    patterns: [
      /headless/i,
      /hydrogen/i,
      /storefront\s*api/i,
      /remix/i,
      /decoupled/i,
    ],
    type: 'node',
    node: 'tech_headless',
  },

  {
    id: 'liquid',
    patterns: [
      /liquid/i,
      /shopify\s*code/i,
      /theme\s*code/i,
      /customiz(e|ation|ing)\s*(my\s*)?(theme|store|existing)/i,
      /modify\s*(my\s*)?(theme|store)/i,
      /edit\s*(my\s*)?(theme|code)/i,
      /change\s*(my\s*)?(theme|design|layout)/i,
    ],
    type: 'node',
    node: 'tech_liquid',
  },

  {
    id: 'payments',
    patterns: [
      /payment\s*(gateway|method|option|processor)/i,
      /stripe/i,
      /paypal/i,
      /shop\s*pay/i,
      /apple\s*pay/i,
      /google\s*pay/i,
      /klarna/i,
      /afterpay/i,
      /buy\s*now\s*pay\s*later/i,
      /bnpl/i,
      /accept\s*(payments?|cards?|credit)/i,
      /crypto\s*payment/i,
    ],
    type: 'node',
    node: 'tech_payments',
  },

  {
    id: 'international',
    patterns: [
      /multi[- ]?(currency|language|lingual)/i,
      /international/i,
      /sell\s*(internationally|globally|worldwide|overseas)/i,
      /translat/i,
      /different\s*(language|countr)/i,
      /shopify\s*markets/i,
    ],
    type: 'node',
    node: 'tech_international',
  },

  {
    id: 'security',
    patterns: [
      /security/i,
      /ssl/i,
      /pci/i,
      /gdpr/i,
      /privacy/i,
      /compliance/i,
      /data\s*protect/i,
      /cookie\s*consent/i,
      /is\s*shopify\s*secure/i,
      /hack/i,
    ],
    type: 'node',
    node: 'tech_security',
  },

  {
    id: 'analytics',
    patterns: [
      /analytics/i,
      /tracking/i,
      /google\s*analytics/i,
      /ga4/i,
      /report(s|ing)?/i,
      /dashboard/i,
      /conversion\s*track/i,
      /pixel/i,
      /facebook\s*pixel/i,
      /meta\s*pixel/i,
    ],
    type: 'node',
    node: 'tech_analytics',
  },

  // ═══════════════════════════════════════════════
  // MARKETING & GROWTH
  // ═══════════════════════════════════════════════
  {
    id: 'marketing',
    patterns: [
      /marketing/i,
      /grow(th|ing)?\s*(my\s*)?(store|business|brand|sales)/i,
      /promot(e|ion|ing)/i,
      /advertis(e|ing)/i,
      /social\s*media/i,
      /instagram/i,
      /tiktok/i,
      /facebook/i,
      /google\s*shopping/i,
      /google\s*ads/i,
    ],
    type: 'node',
    node: 'marketing',
  },

  {
    id: 'email_marketing',
    patterns: [
      /email\s*(market|campaign|flow|automat|newsletter)/i,
      /klaviyo/i,
      /mailchimp/i,
      /omnisend/i,
      /abandoned\s*cart\s*email/i,
      /welcome\s*(series|email|flow)/i,
    ],
    type: 'node',
    node: 'apps_email',
  },

  {
    id: 'loyalty',
    patterns: [
      /loyalty/i,
      /reward(s)?\s*(program)?/i,
      /referral/i,
      /points?\s*(program|system)/i,
      /smile\.?io/i,
      /repeat\s*customer/i,
      /retention/i,
    ],
    type: 'node',
    node: 'mktg_loyalty',
  },

  // ═══════════════════════════════════════════════
  // APPS & ECOSYSTEM
  // ═══════════════════════════════════════════════
  {
    id: 'apps',
    patterns: [
      /recommend\s*(an?\s*)?app/i,
      /best\s*app/i,
      /which\s*app/i,
      /app\s*recommend/i,
      /shopify\s*app\s*store/i,
      /too\s*many\s*apps/i,
      /app\s*audit/i,
    ],
    type: 'node',
    node: 'tech_apps_ecosystem',
  },

  // ═══════════════════════════════════════════════
  // INDUSTRIES
  // ═══════════════════════════════════════════════
  {
    id: 'fashion',
    patterns: [
      /fashion/i,
      /apparel/i,
      /clothing/i,
      /size\s*guide/i,
      /lookbook/i,
    ],
    type: 'node',
    node: 'ind_fashion',
  },

  {
    id: 'beauty',
    patterns: [
      /beauty/i,
      /skincare/i,
      /cosmetic/i,
      /product\s*quiz/i,
    ],
    type: 'node',
    node: 'ind_beauty',
  },

  {
    id: 'food',
    patterns: [
      /food/i,
      /beverage/i,
      /perishable/i,
      /recipe/i,
      /subscription\s*box/i,
    ],
    type: 'node',
    node: 'ind_food',
  },

  // ═══════════════════════════════════════════════
  // PLATFORM COMPARISON
  // ═══════════════════════════════════════════════
  {
    id: 'compare',
    patterns: [
      /shopify\s*(vs|versus|or|compared?\s*to)\s*(woo|wix|squarespace|bigcommerce|magento|wordpress)/i,
      /(woo|wix|squarespace|bigcommerce|magento|wordpress)\s*(vs|versus|or|compared?\s*to)\s*shopify/i,
      /compare\s*(platform|shopify)/i,
      /which\s*platform/i,
      /best\s*(e[- ]?commerce\s*)?platform/i,
      /why\s*shopify/i,
      /should\s*i\s*(use|choose)\s*shopify/i,
    ],
    type: 'node',
    node: 'compare_platforms',
  },

  // ═══════════════════════════════════════════════
  // B2B & WHOLESALE
  // ═══════════════════════════════════════════════
  {
    id: 'b2b',
    patterns: [
      /b2b/i,
      /wholesale/i,
      /bulk\s*(order|pricing|discount)/i,
      /trade\s*(account|pricing)/i,
      /tiered\s*pricing/i,
    ],
    type: 'node',
    node: 'tech_b2b',
  },

  // ═══════════════════════════════════════════════
  // DROPSHIPPING
  // ═══════════════════════════════════════════════
  {
    id: 'dropshipping',
    patterns: [
      /dropship/i,
      /print\s*on\s*demand/i,
      /pod\s*(store|business)/i,
      /dsers/i,
      /spocket/i,
      /printful/i,
      /printify/i,
      /aliexpress/i,
    ],
    type: 'node',
    node: 'tech_dropshipping',
  },

  // ═══════════════════════════════════════════════
  // TIPS & BEST PRACTICES
  // ═══════════════════════════════════════════════
  {
    id: 'tips',
    patterns: [
      /tips?/i,
      /best\s*practice/i,
      /advice/i,
      /suggest(ion)?/i,
      /recommend(ation)?/i,
      /how\s*(to|do\s*i)\s*(improve|increase|reduce|grow)/i,
      /product\s*page\s*(tip|best|optimi)/i,
    ],
    type: 'node',
    node: 'tips_hub',
  },

  {
    id: 'cart_abandonment',
    patterns: [
      /cart\s*abandon/i,
      /abandoned\s*cart/i,
      /people\s*(leave|leaving|abandon|not\s*completing)/i,
      /drop\s*off/i,
      /reduce\s*(cart\s*)?abandon/i,
    ],
    type: 'node',
    node: 'tips_cart_abandonment',
  },

  {
    id: 'aov',
    patterns: [
      /average\s*order\s*value/i,
      /\baov\b/i,
      /increase\s*(order|aov|average)/i,
      /upsell/i,
      /cross[- ]?sell/i,
      /bundle/i,
    ],
    type: 'node',
    node: 'tips_aov',
  },

  // ═══════════════════════════════════════════════
  // PAYMENT & REFUND POLICY
  // ═══════════════════════════════════════════════
  {
    id: 'payment_method',
    patterns: [
      /how\s*(do|can)\s*(i|we)\s*pay/i,
      /payment\s*(method|option|split|term)/i,
      /do\s*you\s*accept/i,
      /pay\s*(with|via|by|using)/i,
      /installment/i,
      /50\s*\/?\s*50/i,
      /milestone\s*payment/i,
    ],
    type: 'node',
    node: 'payment_plans',
  },

  {
    id: 'refund',
    patterns: [
      /refund/i,
      /money\s*back/i,
      /guarantee/i,
      /cancel(lation)?/i,
      /what\s*if\s*(i('?m|\s*am)\s*not\s*(happy|satisfied)|it\s*doesn'?t\s*work)/i,
    ],
    type: 'node',
    node: 'refund_policy',
  },

  // ═══════════════════════════════════════════════
  // DOMAIN & LAUNCH
  // ═══════════════════════════════════════════════
  {
    id: 'domain',
    patterns: [
      /domain/i,
      /dns/i,
      /url/i,
      /website\s*(name|address)/i,
      /\.com/i,
      /register\s*(a\s*)?domain/i,
      /buy\s*(a\s*)?domain/i,
    ],
    type: 'node',
    node: 'launch_domain',
  },

  // ═══════════════════════════════════════════════
  // TRAINING
  // ═══════════════════════════════════════════════
  {
    id: 'training',
    patterns: [
      /training/i,
      /teach\s*(me|us)/i,
      /learn\s*(shopify|how\s*to)/i,
      /tutorial/i,
      /walkthrough/i,
      /how\s*(to|do\s*i)\s*(manage|update|use)\s*(my\s*)?(store|shopify|admin)/i,
      /can\s*i\s*(manage|update|run)\s*(the\s*)?(store|it)\s*myself/i,
    ],
    type: 'node',
    node: 'support_training',
  },

  // ═══════════════════════════════════════════════
  // WORKING WITH US
  // ═══════════════════════════════════════════════
  {
    id: 'working_with_us',
    patterns: [
      /timezone/i,
      /time\s*zone/i,
      /where\s*are\s*you\s*(based|located)/i,
      /location/i,
      /communication/i,
      /contract/i,
      /agreement/i,
      /nda/i,
    ],
    type: 'node',
    node: 'working_with_us',
  },

  // ═══════════════════════════════════════════════
  // MOBILE & RESPONSIVE
  // ═══════════════════════════════════════════════
  {
    id: 'mobile',
    patterns: [
      /mobile/i,
      /responsive/i,
      /phone\s*(friendly|responsive|version)/i,
      /work\s*on\s*(mobile|phone|tablet|iphone|android)/i,
      /mobile[- ]?first/i,
    ],
    type: 'node',
    node: 'theme_mobile',
  },

  // ═══════════════════════════════════════════════
  // SHOPIFY 2.0
  // ═══════════════════════════════════════════════
  {
    id: 'shopify_2',
    patterns: [
      /shopify\s*2\.?0/i,
      /online\s*store\s*2\.?0/i,
      /section(s)?\s*(on\s*)?every\s*page/i,
      /json\s*template/i,
      /metafield/i,
    ],
    type: 'node',
    node: 'shopify_2',
  },

  // ═══════════════════════════════════════════════
  // PRODUCT IMAGES / PHOTOGRAPHY
  // ═══════════════════════════════════════════════
  {
    id: 'product_images',
    patterns: [
      /product\s*(photo|image|picture|video)/i,
      /photography/i,
      /photo\s*shoot/i,
      /image\s*(size|quality|format)/i,
      /how\s*many\s*images?/i,
    ],
    type: 'node',
    node: 'tips_product_pages',
  },

  // ═══════════════════════════════════════════════
  // SUBSCRIPTION
  // ═══════════════════════════════════════════════
  {
    id: 'subscription',
    patterns: [
      /subscription/i,
      /recurring\s*(payment|order|billing)/i,
      /recharge/i,
      /auto[- ]?replenish/i,
    ],
    type: 'node',
    node: 'ind_beauty_subscriptions',
  },
];

// ─────────────────────────────────────────────────────────────
// Gibberish / spam detection
// ─────────────────────────────────────────────────────────────
const GIBBERISH_PATTERNS = [
  /^(.)\1{4,}$/i,                    // aaaaa, bbbbb
  /^[^aeiou\s]{6,}$/i,               // no vowels, 6+ chars
  /^[a-z]{1,2}$/i,                    // single or two random letters
  /^[\W\d_]+$/,                       // only symbols/numbers
  /(.{1,3})\1{3,}/i,                  // repeating pattern like abcabcabc
];

export function isGibberish(text) {
  const cleaned = text.trim();
  if (cleaned.length === 0) return true;
  if (cleaned.length > 200) return false; // long text is probably legit
  return GIBBERISH_PATTERNS.some((p) => p.test(cleaned));
}

export const GIBBERISH_RESPONSE = {
  message: "I didn't quite catch that. Could you rephrase your question? You can ask about our services, pricing, technical topics, or anything Shopify-related. Or just pick an option below!",
  options: [
    { label: "View all services", next: "services" },
    { label: "View pricing", next: "pricing" },
    { label: "Technical questions", next: "technical" },
    { label: "Talk to a human", next: "contact" },
    { label: "Start over", next: "root" },
  ],
};

// ─────────────────────────────────────────────────────────────
// Tree-based keyword fallback search (improved)
// ─────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  'i', 'me', 'my', 'we', 'our', 'you', 'your', 'the', 'a', 'an',
  'is', 'are', 'was', 'were', 'be', 'been', 'am', 'do', 'does',
  'did', 'have', 'has', 'had', 'will', 'would', 'could', 'should',
  'can', 'may', 'might', 'shall', 'to', 'of', 'in', 'for', 'on',
  'with', 'at', 'by', 'from', 'it', 'its', 'this', 'that', 'and',
  'or', 'but', 'not', 'no', 'so', 'if', 'then', 'than', 'too',
  'very', 'just', 'about', 'up', 'out', 'what', 'which', 'when',
  'where', 'how', 'all', 'each', 'some', 'any', 'more', 'also',
  'want', 'need', 'like', 'know', 'tell', 'show', 'give', 'get',
  'please', 'plz', 'pls', 'hey', 'hi', 'hello',
]);

export function buildSearchIndex(tree) {
  const index = [];
  for (const [key, node] of Object.entries(tree)) {
    if (key === 'fallback') continue;
    const text = node.message.toLowerCase();
    const optLabels = (node.options || []).map((o) => o.label.toLowerCase()).join(' ');
    // Weight: key name is important too
    const keyWords = key.replace(/_/g, ' ');
    index.push({ key, text: `${keyWords} ${keyWords} ${text} ${optLabels}`, node });
  }
  return index;
}

export function searchTree(query, searchIndex) {
  const words = query.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));

  if (words.length === 0) return null;

  let bestKey = null;
  let bestScore = 0;

  for (const entry of searchIndex) {
    let score = 0;
    for (const word of words) {
      // Exact word match gets higher score
      if (entry.text.includes(word)) {
        score += word.length >= 5 ? 3 : 2; // longer words are more specific
      }
      // Partial match for longer words (e.g. "migrat" matches "migration")
      if (word.length >= 4) {
        const stem = word.slice(0, -1);
        if (entry.text.includes(stem)) score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestKey = entry.key;
    }
  }

  // Require a minimum confidence
  return bestScore >= 2 ? bestKey : null;
}

// ─────────────────────────────────────────────────────────────
// Main matching function — tries intents first, then tree search
// ─────────────────────────────────────────────────────────────
export function matchUserInput(query, searchIndex) {
  const cleaned = query.trim();

  // 1. Check for gibberish
  if (isGibberish(cleaned)) {
    return { type: 'direct', ...GIBBERISH_RESPONSE };
  }

  // 2. Try intent matching (regex patterns)
  for (const intent of INTENTS) {
    for (const pattern of intent.patterns) {
      if (pattern.test(cleaned)) {
        if (intent.type === 'node') {
          return { type: 'node', node: intent.node };
        }
        return {
          type: 'direct',
          message: intent.message,
          options: intent.options,
        };
      }
    }
  }

  // 3. Fallback to keyword search in tree
  const treeMatch = searchTree(cleaned, searchIndex);
  if (treeMatch) {
    return { type: 'node', node: treeMatch };
  }

  // 4. No match at all
  return null;
}
