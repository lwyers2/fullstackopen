const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')


describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Luke Wyers',
        username: 'lukew',
        password: 'password'
      }
    })
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

  describe('login', () => {
    test('suceeds with correct credentials', async ({ page }) => {
     await loginWith(page, 'lukew', 'password')
     await expect(page.getByText('Luke Wyers logged-in')).toBeVisible() 
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'luke', 'gg')
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Luke Wyers logged-in')).not.toBeVisible() 

    })
  })
})
