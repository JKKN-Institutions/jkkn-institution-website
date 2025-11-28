import { test, expect } from '@playwright/test'

/**
 * Public Frontend E2E Tests
 * Tests for public-facing pages and CMS-rendered content
 */

test.describe('Public Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Check page loads without error
    await expect(page).toHaveTitle(/JKKN/)

    // Check that the main content area exists
    const main = page.locator('main, article, [role="main"]').first()
    await expect(main).toBeVisible()
  })

  test('should display navigation header', async ({ page }) => {
    await page.goto('/')

    // Check header exists
    const header = page.locator('header').first()
    await expect(header).toBeVisible()
  })

  test('should display footer', async ({ page }) => {
    await page.goto('/')

    // Check footer exists
    const footer = page.locator('footer').first()
    await expect(footer).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Page should still load
    await expect(page).toHaveTitle(/JKKN/)
  })
})

test.describe('Public Page SEO', () => {
  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/')

    // Check meta description exists
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveCount(1)

    // Check OG tags
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveCount(1)
  })

  test('should have viewport meta tag for mobile', async ({ page }) => {
    await page.goto('/')

    const viewport = page.locator('meta[name="viewport"]')
    await expect(viewport).toHaveCount(1)
  })
})

test.describe('Public Navigation', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/')

    // Look for login link/button
    const loginLink = page.locator('a[href*="login"], button:has-text("Login"), a:has-text("Sign In")').first()

    if (await loginLink.isVisible()) {
      await loginLink.click()
      await expect(page).toHaveURL(/login/)
    }
  })
})

test.describe('404 Page', () => {
  test('should handle non-existent pages gracefully', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-12345')

    // Dynamic catch-all routes may return 200 with a "not found" message
    // or 404 depending on configuration
    const status = response?.status()
    expect([200, 404]).toContain(status)

    // If 200, page should indicate content is not found
    if (status === 200) {
      const pageContent = await page.content()
      const hasNotFoundIndicator =
        pageContent.includes('not found') ||
        pageContent.includes('Not Found') ||
        pageContent.includes('404') ||
        pageContent.includes('no content')
      expect(hasNotFoundIndicator).toBe(true)
    }
  })
})

test.describe('Performance', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000)
  })
})
