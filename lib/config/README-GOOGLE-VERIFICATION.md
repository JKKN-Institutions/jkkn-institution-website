# Google Search Console Verification Setup

This guide explains how the multi-institution Google Search Console verification system works and how to add verification files for other institutions.

## How It Works

Each institution needs its own Google Search Console verification file. The system uses:

1. **Configuration** - `google-verification.config.ts` stores verification files
2. **Dynamic Route** - `app/[googleVerification]/route.ts` serves the correct file
3. **Institution-specific** - Each site gets its own verification file based on `NEXT_PUBLIC_INSTITUTION_ID`

## Current Status

| Institution | Verification File | Status |
|-------------|-------------------|--------|
| **Main** | `googlee5e5c9d47bc383e1.html` | ✅ **Configured** |
| **Engineering** | `googlee5e5c9d47bc383e1.html` | ✅ **Configured** |
| Dental | Not set | ⏳ Pending |
| Pharmacy | Not set | ⏳ Pending |
| Arts & Science | Not set | ⏳ Pending |
| Nursing | Not set | ⏳ Pending |

## Main & Engineering College Verification

**File:** `googlee5e5c9d47bc383e1.html`
**URLs:**
- Main: `https://jkkn.ac.in/googlee5e5c9d47bc383e1.html`
- Engineering: `https://engg.jkkn.ac.in/googlee5e5c9d47bc383e1.html`

**Content:** `google-site-verification: googlee5e5c9d47bc383e1.html`

**Note:** Both Main and Engineering institutions use the same verification file as they are added to the same Google Search Console account. This is a standard practice when managing multiple domains under one Search Console property.

## How to Add Verification for Other Institutions

### Step 1: Get Verification File from Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (e.g., `https://dental.jkkn.ac.in`)
3. Choose "HTML file" verification method
4. Download the verification file (e.g., `google123abc456.html`)
5. Note the filename and open it to see the content

### Step 2: Add to Configuration

Edit `lib/config/google-verification.config.ts`:

```typescript
const VERIFICATION_CONFIG: GoogleVerificationConfig = {
  engineering: {
    filename: 'googlee5e5c9d47bc383e1.html',
    content: 'google-site-verification: googlee5e5c9d47bc383e1.html',
  },
  dental: {
    filename: 'google123abc456.html', // ← Your file from Google
    content: 'google-site-verification: google123abc456.html', // ← Content
  },
  // ... other institutions
}
```

### Step 3: Update Route Handler (Optional)

If you want the file to be statically generated, update `app/[googleVerification]/route.ts`:

```typescript
export async function generateStaticParams() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const verificationFiles: string[] = []

  if (institutionId === 'engineering') {
    verificationFiles.push('googlee5e5c9d47bc383e1.html')
  }

  // Add your institution
  if (institutionId === 'dental') {
    verificationFiles.push('google123abc456.html') // ← Your filename
  }

  return verificationFiles.map((filename) => ({
    googleVerification: filename,
  }))
}
```

### Step 4: Test Locally

```bash
# Switch to the institution
npm run dev:dental

# Visit the verification URL
# http://localhost:3000/google123abc456.html
```

You should see:
```
google-site-verification: google123abc456.html
```

### Step 5: Deploy and Verify

1. Push changes to GitHub
2. Vercel auto-deploys to the institution site
3. Visit `https://dental.jkkn.ac.in/google123abc456.html`
4. Go back to Google Search Console
5. Click "Verify" button

✅ Your property will be verified!

## Example: Complete Setup for Dental College

### 1. Google Search Console Download

File: `google9876xyz5432.html`
Content: `google-site-verification: google9876xyz5432.html`

### 2. Update Configuration

```typescript
// lib/config/google-verification.config.ts

const VERIFICATION_CONFIG: GoogleVerificationConfig = {
  engineering: {
    filename: 'googlee5e5c9d47bc383e1.html',
    content: 'google-site-verification: googlee5e5c9d47bc383e1.html',
  },
  dental: {
    filename: 'google9876xyz5432.html',
    content: 'google-site-verification: google9876xyz5432.html',
  },
  // ... rest
}
```

### 3. Update Route Handler

```typescript
// app/[googleVerification]/route.ts

export async function generateStaticParams() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const verificationFiles: string[] = []

  if (institutionId === 'engineering') {
    verificationFiles.push('googlee5e5c9d47bc383e1.html')
  }

  if (institutionId === 'dental') {
    verificationFiles.push('google9876xyz5432.html')
  }

  return verificationFiles.map((filename) => ({
    googleVerification: filename,
  }))
}
```

### 4. Test and Deploy

```bash
npm run dev:dental
# Visit http://localhost:3000/google9876xyz5432.html
# Should show: google-site-verification: google9876xyz5432.html

# Push to GitHub → Auto-deploys to Vercel
# Verify at https://dental.jkkn.ac.in/google9876xyz5432.html
```

## Architecture

### How the Route Works

```
User requests: https://engg.jkkn.ac.in/googlee5e5c9d47bc383e1.html
                                      ↓
            Next.js dynamic route: /[googleVerification]/route.ts
                                      ↓
            Checks: NEXT_PUBLIC_INSTITUTION_ID = "engineering"
                                      ↓
            Looks up: getVerificationByFilename()
                                      ↓
            Returns: "google-site-verification: googlee5e5c9d47bc383e1.html"
```

### Why Dynamic Route Instead of Public Folder?

Using `public/googlee5e5c9d47bc383e1.html` would:
- ❌ Serve the **same file** to all institutions
- ❌ Engineering verification file would appear on Dental site
- ❌ Google would reject verification (wrong domain)

Using dynamic route:
- ✅ Each institution gets **its own** verification file
- ✅ Engineering gets engineering file, Dental gets dental file
- ✅ Automatically handled via environment variables
- ✅ Centralized configuration

## Troubleshooting

### Problem: Verification fails in Google Search Console

**Cause:** Wrong file served or file not accessible

**Solution:**
1. Check the URL in browser: `https://[domain]/[verification-file].html`
2. Verify it shows: `google-site-verification: [filename].html`
3. Check Vercel environment variable: `NEXT_PUBLIC_INSTITUTION_ID`
4. Redeploy if needed

### Problem: 404 on verification file

**Cause:** File not configured or wrong institution ID

**Solution:**
1. Check `google-verification.config.ts` has the institution entry
2. Verify filename matches exactly (case-sensitive)
3. Check `generateStaticParams()` includes the institution
4. Rebuild and redeploy

### Problem: Wrong verification file served

**Cause:** Environment variable mismatch

**Solution:**
1. Go to Vercel project settings
2. Check `NEXT_PUBLIC_INSTITUTION_ID` matches institution
3. Example: Dental site should have `NEXT_PUBLIC_INSTITUTION_ID=dental`
4. Redeploy after fixing

## Alternative Verification Methods

If HTML file verification doesn't work, Google offers alternatives:

1. **Meta Tag** - Add `<meta>` tag to homepage (easier for multi-tenant)
2. **Google Analytics** - Use existing GA4 property
3. **Google Tag Manager** - Use existing GTM container
4. **Domain Provider** - Add DNS TXT record (recommended for production)

### Recommended: DNS TXT Record

For production, consider DNS TXT record verification:

**Advantages:**
- ✅ Works for all subdomains
- ✅ No code changes needed
- ✅ Permanent verification
- ✅ Survives site rebuilds

**Steps:**
1. Go to Google Search Console
2. Choose "Domain" property (not "URL prefix")
3. Add TXT record to DNS: `jkkn.ac.in`
4. All subdomains verified: `engg.jkkn.ac.in`, `dental.jkkn.ac.in`, etc.

## Related Documentation

- [Multi-Institution Architecture](../../docs/MULTI-INSTITUTION-ARCHITECTURE.md)
- [robots.txt Configuration](./README-ROBOTS.md)
- [SEO Strategy](../../docs/MULTI-TENANT-SEO.md)
