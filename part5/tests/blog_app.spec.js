const { test, expect, describe, beforeEach } = require('@playwright/test')


describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locatorUsername = await page.getByText('username')
    const locatorPassword = await page.getByText('password')
    const locatorLogin = await page.getByRole('button', {name: 'login'})
    await expect(locatorUsername).toBeVisible()
    await expect(locatorPassword).toBeVisible()
    await expect(locatorLogin).toBeVisible()
  })
})
