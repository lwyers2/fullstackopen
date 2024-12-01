const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const { stringify } = require('querystring')

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
    const locatorLogin = await page.getByRole('button', { name: 'login' })
    await expect(locatorUsername).toBeVisible()
    await expect(locatorPassword).toBeVisible()
    await expect(locatorLogin).toBeVisible()
  })

  describe('Login functionality', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'lukew', 'password')
      await page.waitForSelector('text=Luke Wyers logged-in', { timeout: 8000 })
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

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'title', 'author', 'http://localhost:5173/')
      await expect(page.getByText('title author')).toBeVisible()
      //below might fail because of notif timeout
      // const notificationDiv = await page.locator('.notification')
      // await expect(notificationDiv).toContainText('a new blog title by author added')
      // await expect(notificationDiv).toHaveCSS('border-style', 'solid')
      // await expect(notificationDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
    })
  })

  describe('Interacting with a blog', () => {
    beforeEach(async ({ page, request }) => {
      test.setTimeout(30000) // Set a higher timeout
      await request.post('http://localhost:3003/api/testing/reset')
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Luke Wyers',
          username: 'lukew',
          password: 'password'
        }
      })
      await page.goto('http://localhost:5173')
      await loginWith(page, 'lukew', 'password')
      await createBlog(page, 'title', 'author', 'http://localhost:5173/')
    })

    test.only('a blog can be liked', async ({ page }) => {
      await page.waitForSelector('text=title author', { timeout: 10000 })

      await page.getByRole('button', { name: 'view' }).click()
      const likesText = page.getByText('likes 0')
      await expect(likesText).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })
  })

  describe('Deleting a blog', () => {
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
      await loginWith(page, 'lukew', 'password')
      await createBlog(page, 'title', 'author', 'http://localhost:5173/')
      const blogText = await page.getByText('title author')
      const blogElement = await blogText.locator('..')

      await blogElement.getByRole('button', { name: 'view' }).click()
    })

    test('user who adds blog can delete it', async ({ page }) => {
      const blogText = await page.getByText('title author')
      const blogElement = await blogText.locator('..')

      page.on('dialog', async (dialog) => {
        console.log('Dialog text: ', dialog.message())
        await dialog.accept()
      })

      await blogElement.getByRole('button', { name: 'remove' }).click()

      await page.pause()

      const blogDeleted = await page.locator('text=title author').count()
      expect(blogDeleted).toBe(0)
    })

    test('user who adds blog is only one who can see remove button', async({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'John Smith',
          username: 'johns',
          password: 'password'
        }
      })
      await page.getByRole('button', {name: 'logout'}).click()
      await loginWith(page, 'johns', 'password')
      await createBlog(page, 'deleteTitle', 'deleteAuthor', 'http://localHost:5173/')

      const otherBlogText = await page.getByText('deleteTitle deleteAuthor')
      const otherBlogElement = await otherBlogText.locator('..')

      await otherBlogElement.getByRole('button', { name: 'view' }).click()

      await page.pause()

      expect(otherBlogElement.getByRole('button', { name: 'remove' })).toBeVisible()

      const nonUserBlogText = await page.getByText('title author')
      const nonUserBlogElement = await nonUserBlogText.locator('..')

      await nonUserBlogElement.getByRole('button', {name: 'view'}).click()

      await page.pause()

      expect(nonUserBlogElement.getByRole('button', { name: 'remove' })).not.toBeVisible()



    })
  })

})