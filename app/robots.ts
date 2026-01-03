/**
 * Robots.txt Generator
 * Dynamic robots.txt using Next.js MetadataRoute API
 * Strategy: ALLOW ALL AI BOTS (Maximum Visibility)
 * Updated: January 2026
 */

import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jkkn.ac.in'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // =================================================================
      // DEFAULT RULES (ALL BOTS)
      // =================================================================
      {
        userAgent: '*',
        allow: [
          '/',
          '/wp-content/uploads/',
          '/assets/',
          '/images/',
          '/css/',
          '/js/',
          '/media/',
          '/downloads/',
          '/documents/',
        ],
        disallow: [
          // WordPress Blocks
          '/wp-admin/',
          '/wp-includes/',
          '/wp-content/plugins/',
          '/wp-content/cache/',
          '/wp-json/',
          '/xmlrpc.php',
          '/readme.html',
          '/license.txt',
          // Next.js Build Artifacts
          '/_next/static/chunks/',
          '/_next/static/css/',
          '/_next/static/media/',
          '/_next/static/webpack/',
          '/_next/data/',
          '/_next/image',
          // Admin & Private Areas
          '/cgi-bin/',
          '/private/',
          '/admin/',
          '/login/',
          '/dashboard/',
          '/backend/',
          // Search & Query Parameters
          '/search/',
          '/*?s=',
          '/*?p=',
          '/*?q=',
          '/*?search=',
          '/*?replytocom',
          '/*?utm_*',
          '/*?fbclid=',
          '/*?gclid=',
          '/*?ref=',
          // Development & Staging
          '/test/',
          '/staging/',
          '/dev/',
          '/temp/',
          '/backup/',
          '/.env',
          '/.git/',
          '/node_modules/',
        ],
      },

      // =================================================================
      // GOOGLE SEARCH
      // =================================================================
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/_next/static/chunks/', '/_next/static/css/', '/_next/static/media/', '/_next/data/'],
      },
      { userAgent: 'Googlebot-Image', allow: '/' },
      { userAgent: 'Googlebot-News', allow: '/' },
      { userAgent: 'Googlebot-Video', allow: '/' },
      { userAgent: 'Googlebot-Mobile', allow: '/' },
      { userAgent: 'Mediapartners-Google', allow: '/' },
      { userAgent: 'AdsBot-Google', allow: '/' },
      { userAgent: 'AdsBot-Google-Mobile', allow: '/' },

      // =================================================================
      // BING / MICROSOFT SEARCH
      // =================================================================
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/_next/static/chunks/', '/_next/static/css/', '/_next/static/media/'],
      },
      { userAgent: 'BingPreview', allow: '/' },
      { userAgent: 'MSNBot', allow: '/' },

      // =================================================================
      // OTHER SEARCH ENGINES
      // =================================================================
      { userAgent: 'Slurp', allow: '/' },
      { userAgent: 'DuckDuckBot', allow: '/' },
      { userAgent: 'Baiduspider', allow: '/' },
      { userAgent: 'YandexBot', allow: '/' },
      { userAgent: 'Sogou', allow: '/' },
      { userAgent: 'Exabot', allow: '/' },

      // =================================================================
      // OPENAI (ChatGPT, GPT-4, GPT-5)
      // =================================================================
      { userAgent: 'GPTBot', allow: '/', disallow: '/_next/static/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },

      // =================================================================
      // ANTHROPIC (Claude AI)
      // =================================================================
      { userAgent: 'ClaudeBot', allow: '/', disallow: '/_next/static/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'Claude-SearchBot', allow: '/' },

      // =================================================================
      // GOOGLE AI (Gemini, Bard)
      // =================================================================
      { userAgent: 'Google-Extended', allow: '/', disallow: '/_next/static/' },
      { userAgent: 'GoogleOther', allow: '/' },
      { userAgent: 'Google-CloudVertexBot', allow: '/' },
      { userAgent: 'NotebookLM', allow: '/' },
      { userAgent: 'Gemini-AI', allow: '/' },
      { userAgent: 'Bard-AI', allow: '/' },

      // =================================================================
      // PERPLEXITY AI
      // =================================================================
      { userAgent: 'PerplexityBot', allow: '/', disallow: '/_next/static/' },
      { userAgent: 'Perplexity-User', allow: '/' },

      // =================================================================
      // META AI (Facebook, Instagram)
      // =================================================================
      { userAgent: 'Meta-ExternalAgent', allow: '/' },
      { userAgent: 'meta-externalagent', allow: '/' },
      { userAgent: 'Meta-ExternalFetcher', allow: '/' },
      { userAgent: 'FacebookBot', allow: '/' },
      { userAgent: 'facebookexternalhit', allow: '/' },

      // =================================================================
      // AMAZON AI (Alexa, Bedrock)
      // =================================================================
      { userAgent: 'Amazonbot', allow: '/' },
      { userAgent: 'bedrockbot', allow: '/' },

      // =================================================================
      // APPLE AI (Siri, Apple Intelligence)
      // =================================================================
      { userAgent: 'Applebot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },

      // =================================================================
      // MICROSOFT AI (Copilot)
      // =================================================================
      { userAgent: 'bingbot', allow: '/' },

      // =================================================================
      // OTHER AI SEARCH ENGINES
      // =================================================================
      { userAgent: 'YouBot', allow: '/' },
      { userAgent: 'PhindBot', allow: '/' },
      { userAgent: 'AndiBot', allow: '/' },
      { userAgent: 'Andibot', allow: '/' },
      { userAgent: 'DuckAssistBot', allow: '/' },
      { userAgent: 'Timpibot', allow: '/' },
      { userAgent: 'Brave-AI', allow: '/' },
      { userAgent: 'iaskspider', allow: '/' },

      // =================================================================
      // AI TRAINING BOTS
      // =================================================================
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
      { userAgent: 'Cohere-Ai', allow: '/' },
      { userAgent: 'cohere-training-data-crawler', allow: '/' },
      { userAgent: 'MistralAI-User', allow: '/' },
      { userAgent: 'Bytespider', allow: '/' },
      { userAgent: 'Diffbot', allow: '/' },
      { userAgent: 'webzio', allow: '/' },
      { userAgent: 'Omgili', allow: '/' },
      { userAgent: 'Omgilibot', allow: '/' },
      { userAgent: 'Brightbot', allow: '/' },
      { userAgent: 'ImagesiftBot', allow: '/' },
      { userAgent: 'FirecrawlAgent', allow: '/' },
      { userAgent: 'Character-AI', allow: '/' },
      { userAgent: 'Devin', allow: '/' },
      { userAgent: 'AI2Bot', allow: '/' },
      { userAgent: 'Ai2Bot-Dolma', allow: '/' },
      { userAgent: 'PanguBot', allow: '/' },
      { userAgent: 'ICC-Crawler', allow: '/' },
      { userAgent: 'VelenPublicWebCrawler', allow: '/' },
      { userAgent: 'img2dataset', allow: '/' },

      // =================================================================
      // SOCIAL MEDIA CRAWLERS
      // =================================================================
      { userAgent: 'LinkedInBot', allow: '/' },
      { userAgent: 'Twitterbot', allow: '/' },
      { userAgent: 'WhatsApp', allow: '/' },
      { userAgent: 'TelegramBot', allow: '/' },
      { userAgent: 'Slackbot', allow: '/' },
      { userAgent: 'Slackbot-LinkExpanding', allow: '/' },
      { userAgent: 'Discordbot', allow: '/' },
      { userAgent: 'Pinterest', allow: '/' },
      { userAgent: 'Pinterestbot', allow: '/' },
      { userAgent: 'Snapchat', allow: '/' },

      // =================================================================
      // ACADEMIC & ARCHIVE CRAWLERS
      // =================================================================
      { userAgent: 'ia_archiver', allow: '/' },
      { userAgent: 'archive.org_bot', allow: '/' },
      { userAgent: 'CiteSeerXBot', allow: '/' },

      // =================================================================
      // SEO TOOLS (RATE LIMITED)
      // =================================================================
      { userAgent: 'SemrushBot', crawlDelay: 5 },
      { userAgent: 'AhrefsBot', crawlDelay: 5 },
      { userAgent: 'MJ12bot', crawlDelay: 5 },
      { userAgent: 'dotbot', crawlDelay: 5 },
      { userAgent: 'rogerbot', crawlDelay: 5 },
      { userAgent: 'BLEXBot', crawlDelay: 5 },
      { userAgent: 'DataForSeoBot', crawlDelay: 5 },
      { userAgent: 'SEOkicks', crawlDelay: 5 },
      { userAgent: 'serpstatbot', crawlDelay: 5 },

      // =================================================================
      // BLOCKED BOTS (MALICIOUS/SCRAPERS)
      // =================================================================
      { userAgent: 'PetalBot', disallow: '/' },
      { userAgent: 'SiteSnagger', disallow: '/' },
      { userAgent: 'WebCopier', disallow: '/' },
      { userAgent: 'HTTrack', disallow: '/' },
      { userAgent: 'Wget', disallow: '/' },
      { userAgent: 'EmailCollector', disallow: '/' },
      { userAgent: 'EmailSiphon', disallow: '/' },
      { userAgent: 'EmailWolf', disallow: '/' },
      { userAgent: 'ExtractorPro', disallow: '/' },
      { userAgent: 'CherryPicker', disallow: '/' },
      { userAgent: 'WebBandit', disallow: '/' },
      { userAgent: 'WebReaper', disallow: '/' },
      { userAgent: 'MSIECrawler', disallow: '/' },
      { userAgent: 'WebStripper', disallow: '/' },
      { userAgent: 'Teleport', disallow: '/' },
      { userAgent: 'TeleportPro', disallow: '/' },
      { userAgent: 'WebZIP', disallow: '/' },
      { userAgent: 'Offline Explorer', disallow: '/' },
      { userAgent: 'Zeus', disallow: '/' },
      { userAgent: 'Sucker', disallow: '/' },
      { userAgent: 'Harvest', disallow: '/' },
      { userAgent: 'Magnet', disallow: '/' },
      { userAgent: 'Vampire', disallow: '/' },
      { userAgent: 'NICErsPRO', disallow: '/' },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/sitemap_index.xml`,
      `${SITE_URL}/page-sitemap.xml`,
      `${SITE_URL}/post-sitemap.xml`,
    ],
    host: SITE_URL,
  }
}
