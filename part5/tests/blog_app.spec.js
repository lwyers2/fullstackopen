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

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
    await loginWith(page, 'lukew', 'password')  
    })

    test('a new blog can be created', async ({page}) => {
      await createBlog(page, 'title', 'author', 'http://localhost:5173/')
      await expect(page.getByText(`title author`)).toBeVisible()
      const notificationDiv = await page.locator('.notification')
      await expect(notificationDiv).toContainText(`a new blog title by author added`)
      await expect(notificationDiv).toHaveCSS('border-style', 'solid')
      await expect(notificationDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
    })
  })
})
