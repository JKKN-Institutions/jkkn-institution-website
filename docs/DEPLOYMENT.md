# JKKN Institution Website - Deployment Guide

This guide covers the deployment process for the JKKN Institution Website.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase project configured
- Vercel account (recommended) or other hosting platform

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required: Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Required: Site URL
NEXT_PUBLIC_SITE_URL=https://jkkn.ac.in
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

## Testing

The project uses Playwright for E2E testing.

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests for specific browser
npm run test:chromium

# Run mobile tests
npm run test:mobile

# View test report
npm run test:report
```

### Test Coverage

| Category | Tests | Status |
|----------|-------|--------|
| Public Pages | 10 | Passing |
| Authentication | 8 | Passing |
| Accessibility | 15 | Passing |
| **Total** | **33** | **All Passing** |

## Deployment to Vercel (Recommended)

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Connect your repository in Vercel Dashboard
3. Configure environment variables in Vercel
4. Deploy automatically on push to main branch

### Environment Variables in Vercel

Add these environment variables in Vercel Dashboard:

| Variable | Environment |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | Production only |

## Deployment to Other Platforms

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### Manual Deployment

```bash
# Build the application
npm run build

# The build output is in .next folder
# Deploy the following to your server:
# - .next/
# - public/
# - package.json
# - node_modules/ (or run npm install on server)

# Start the server
npm start
```

## Post-Deployment Checklist

- [ ] Verify environment variables are set correctly
- [ ] Test authentication flow (Google OAuth)
- [ ] Check all admin routes require authentication
- [ ] Verify public pages load correctly
- [ ] Test CMS page rendering
- [ ] Check SEO meta tags are present
- [ ] Verify mobile responsiveness
- [ ] Test FAB (Floating Action Button) functionality
- [ ] Run Lighthouse audit
- [ ] Set up monitoring (Sentry, Vercel Analytics)

## Performance Optimization

The application is optimized for performance:

- Server-side rendering (SSR) for dynamic pages
- Static generation for public pages where possible
- Image optimization with next/image
- Code splitting and lazy loading
- Edge caching with Vercel

### Lighthouse Targets

| Metric | Target | Current |
|--------|--------|---------|
| Performance | > 90 | TBD |
| Accessibility | > 90 | TBD |
| Best Practices | > 90 | TBD |
| SEO | > 90 | TBD |

## Security Headers

The `vercel.json` file configures security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## Monitoring & Logging

### Recommended Services

1. **Error Tracking**: Sentry
2. **Analytics**: Vercel Analytics / Google Analytics
3. **Uptime Monitoring**: Vercel / Better Uptime
4. **Log Management**: Vercel Logs / Datadog

## Troubleshooting

### Common Issues

1. **Build fails with TypeScript errors**
   ```bash
   # Check for type errors
   npx tsc --noEmit
   ```

2. **Supabase connection issues**
   - Verify environment variables are correct
   - Check Supabase project status
   - Verify RLS policies allow access

3. **Authentication not working**
   - Check Google OAuth credentials
   - Verify callback URL is correct
   - Check approved_emails table for whitelisted domains

4. **Pages not rendering**
   - Check CMS page status (must be 'published')
   - Verify page visibility is 'public'
   - Check console for errors

## Support

For issues and support:
- GitHub Issues: https://github.com/your-repo/issues
- Email: support@jkkn.ac.in
