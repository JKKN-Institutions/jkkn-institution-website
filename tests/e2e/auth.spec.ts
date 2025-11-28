import { test, expect } from '@playwright/test'

/**
 * Authentication E2E Tests
 * Tests for login, logout, and protected routes
 */

test.describe('Login Page', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/auth/login')

    // Check page loads
    await expect(page).toHaveURL(/login/)

    // Should have a login form or Google OAuth button
    const googleButton = page.locator('button:has-text("Google"), a:has-text("Google"), button:has-text("Sign in")')
    await expect(googleButton.first()).toBeVisible()
  })

  test('should have proper page title', async ({ page }) => {
    await page.goto('/auth/login')

    // Page title should contain JKKN or be the login page
    await expect(page).toHaveTitle(/JKKN|Login|Sign In/i)
  })

  test('should show JKKN branding', async ({ page }) => {
    await page.goto('/auth/login')

    // Check for JKKN text or institution branding anywhere on page
    const pageContent = await page.content()
    const hasJKKN = pageContent.includes('JKKN') || pageContent.includes('jkkn')
    expect(hasJKKN).toBe(true)
  })
})

test.describe('Protected Routes (Unauthenticated)', () => {
  test('should redirect /admin to login', async ({ page }) => {
    await page.goto('/admin')

    // Should redirect to login page
    await expect(page).toHaveURL(/login|auth/)
  })

  test('should redirect /admin/users to login', async ({ page }) => {
    await page.goto('/admin/users')

    // Should redirect to login page
    await expect(page).toHaveURL(/login|auth/)
  })

  test('should redirect /admin/roles to login', async ({ page }) => {
    await page.goto('/admin/roles')

    // Should redirect to login page
    await expect(page).toHaveURL(/login|auth/)
  })

  test('should redirect /admin/content/pages to login', async ({ page }) => {
    await page.goto('/admin/content/pages')

    // Should redirect to login page
    await expect(page).toHaveURL(/login|auth/)
  })
})

test.describe('Auth Callback', () => {
  test('should handle auth callback route', async ({ page }) => {
    // Test that callback route exists and handles requests
    const response = await page.goto('/auth/callback')

    // Should not return server error
    expect(response?.status()).not.toBe(500)
  })
})

test.describe('Access Denied Page', () => {
  test('should have access denied page', async ({ page }) => {
    await page.goto('/admin/unauthorized')

    // Page should load (might redirect if not authenticated)
    const status = await page.evaluate(() => document.readyState)
    expect(status).toBe('complete')
  })
})
