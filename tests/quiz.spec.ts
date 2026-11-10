import { test, expect, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { access, questions } from '../src/features/quiz/content'

async function capture(page: Page, name: string) {
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('main > section')).toHaveCSS('opacity', '1')
  if (await page.locator('.reveal-content').count()) {
    await expect(page.locator('.reveal-content > div').last()).toHaveCSS('opacity', '1')
    await expect(page.getByRole('button', { name: 'DEINE GESCHENKTICKETS' })).toBeEnabled()
  }
  if (await page.locator('.completion-screen').count()) await expect(page.getByRole('button', { name: 'GEWINN FREISCHALTEN' })).toBeEnabled()
  await page.screenshot({ path: `.impeccable/review/${name}.png`, fullPage: true, animations: 'disabled' })
}
async function login(page: Page) {
  await page.getByLabel('E-Mail-Adresse').fill(access.email)
  await page.getByLabel('Passwort', { exact: true }).fill(access.password)
  await page.getByRole('button', { name: 'IDENTITÄT BESTÄTIGEN' }).click()
  await expect(page.getByRole('heading', { name: /DU WURDEST/ })).toBeVisible({ timeout: 8000 })
  await page.getByRole('button', { name: 'RÄTSEL STARTEN' }).click()
}

test('complete private journey, retries, recovery, reveal and real PNG download', async ({ page }, info) => {
  test.setTimeout(45000)
  const errors: string[] = []
  const failedAssets: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('response', (response) => { if (response.status() >= 400 && response.url().includes('/images/')) failedAssets.push(response.url()) })
  const mediaRequests: string[] = []
  page.on('request', (request) => { if (request.url().includes('/media/')) mediaRequests.push(request.url()) })
  await page.goto('./')
  await capture(page, info.project.name)
  await expect(page.locator('body')).not.toContainText('HAPPY BIRTHDAY')
  await expect(page.locator('iframe')).toHaveCount(0)
  await page.getByRole('button', { name: 'IDENTITÄT BESTÄTIGEN' }).click()
  await expect(page.getByRole('alert').first()).toContainText('gültige E-Mail')
  await login(page)
  expect(await page.evaluate(() => JSON.stringify(sessionStorage))).not.toContain(access.email)
  expect(await page.evaluate(() => JSON.stringify(sessionStorage))).not.toContain(access.password)
  for (const [index, question] of questions.entries()) {
    await expect(page.getByRole('heading', { name: question.question, exact: true })).toBeVisible()
    const image = page.locator('.question-image img')
    await expect(image).toBeVisible()
    await expect.poll(() => image.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
    if (index === 0) {
      await capture(page, `${info.project.name}-question`)
      await page.getByRole('button', { name: 'A: Breakpoint', exact: true }).click()
      await expect(page.getByRole('status')).toContainText('Versuch es noch einmal')
      await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
      await expect(page.getByRole('button', { name: 'NÄCHSTE FRAGE' })).toHaveCount(0)
      await capture(page, `${info.project.name}-wrong`)
      await page.reload()
      await expect(page.getByRole('status')).toContainText('Versuch es noch einmal')
    }
    await page.getByRole('button', { name: `${String.fromCharCode(65 + question.correctAnswer)}: ${question.answers[question.correctAnswer]}`, exact: true }).click()
    await expect(page.getByRole('status')).toContainText('Genau richtig')
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(index + 1))
    if (index === 9) {
      await expect(page.getByRole('button', { name: 'A: Berlin bei Nacht', exact: true })).toHaveAttribute('aria-disabled', 'true')
      await expect(page.locator('body')).not.toContainText('2 KONZERTTICKETS')
    } else {
      await page.getByRole('button', { name: 'NÄCHSTE FRAGE' }).click()
    }
    if (index === 4) {
      await expect(page.getByRole('heading')).toContainText('50 %')
      await capture(page, `${info.project.name}-halfway`)
      await page.reload()
      await expect(page.getByRole('heading')).toContainText('50 %')
      await page.getByRole('button', { name: 'FORTSETZEN' }).click()
    }
  }
  await expect(page.getByRole('heading')).toContainText('BERLIN')
  await expect(page.getByText('LETZTER SCHLÜSSEL AKZEPTIERT')).toBeVisible()
  await expect(page.getByRole('button', { name: 'GEWINN FREISCHALTEN' })).toBeEnabled()
  await expect(page.locator('body')).not.toContainText('2 KONZERTTICKETS')
  await expect(page.locator('iframe')).toHaveCount(0)
  await capture(page, `${info.project.name}-complete`)
  // Trailer, soundtrack and poster must not load before the unlock: nothing may hint at the gift.
  expect(mediaRequests).toEqual([])
  await page.getByRole('button', { name: 'GEWINN FREISCHALTEN' }).click()
  await expect(page.getByRole('heading')).toContainText('ENTSCHLÜSSELT')
  // Chrome plays the trailer (skip it); test Chromium has no H.264 and must fall through to the reveal on its own.
  const skip = page.getByRole('button', { name: 'Trailer überspringen' })
  const birthday = page.getByRole('heading', { name: /HAPPY BIRTHDAY/ })
  await expect(skip.or(birthday).first()).toBeVisible({ timeout: 12000 })
  if (await skip.isVisible()) await skip.click()
  await expect(birthday).toBeVisible({ timeout: 6000 })
  expect(mediaRequests.some((url) => url.endsWith('berlin-lebt-3-trailer.mp4'))).toBe(true)
  await capture(page, `${info.project.name}-reveal`)
  await page.getByRole('button', { name: 'DEINE GESCHENKTICKETS' }).click()
  await expect(page.getByRole('article')).toHaveCount(2)
  await capture(page, `${info.project.name}-tickets`)
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'GESCHENKTICKET SPEICHERN' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('project-x-gillian-ticket.png')
  const path = await download.path()
  expect(path).not.toBeNull()
  const png = await readFile(path!)
  expect([...png.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10])
  expect(png.readUInt32BE(16)).toBe(1080)
  expect(png.readUInt32BE(20)).toBeGreaterThan(900)
  await download.saveAs(`.impeccable/review/${info.project.name}-ticket-export.png`)
  await expect(page.getByRole('status')).toContainText('Geschenkticket ist bereit')
  await page.reload()
  await expect(page.getByRole('article')).toHaveCount(2)
  await expect(page.locator('iframe')).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByRole('button', { name: 'Neu beginnen' }).click()
  await expect(page.getByLabel('E-Mail-Adresse')).toHaveValue('')
  expect(errors).toEqual([])
  expect(failedAssets).toEqual([])
})

test('keyboard, reduced motion, blocked storage, and narrow layouts', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('Storage blocked') } })
  })
  await page.goto('./')
  await page.getByLabel('E-Mail-Adresse').fill(access.email)
  await page.getByLabel('Passwort', { exact: true }).fill('falsch')
  await page.getByLabel('Passwort', { exact: true }).press('Enter')
  await expect(page.getByRole('alert')).toContainText('nicht korrekt')
  await expect(page.getByLabel('Passwort', { exact: true })).toBeFocused()
  await page.getByLabel('Passwort', { exact: true }).fill(access.password)
  await page.getByLabel('Passwort', { exact: true }).press('Enter')
  await expect(page.getByRole('heading', { name: /DU WURDEST/ })).toBeVisible()
  await page.getByRole('button', { name: 'RÄTSEL STARTEN' }).press('Enter')
  await expect(page.getByRole('heading', { name: questions[0]!.question })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'A: Breakpoint' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toContainText('Versuch es noch einmal')
  await page.getByRole('button', { name: 'C: Einstand' }).press('Enter')
  await expect(page.getByRole('status')).toContainText('Genau richtig')
  await page.getByLabel('So funktioniert PROJECT X').click()
  await expect(page.getByText('Dein Zugang zu PROJECT X.')).toBeVisible()
  for (const width of [320, 375, 390, 430, 768, 1280]) {
    await page.setViewportSize({ width, height: 844 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await page.reload()
  await expect(page.getByRole('heading', { name: 'PROJECT X' })).toBeVisible()
})

test('corrupt progress resets safely and interrupted decryption requires a click', async ({ page }) => {
  await page.goto('./')
  await page.evaluate(() => sessionStorage.setItem('project-x:progress:v1', 'invalid-json'))
  await page.reload()
  await expect(page.getByLabel('E-Mail-Adresse')).toBeVisible()
  await page.evaluate(() => sessionStorage.setItem('project-x:progress:v1', JSON.stringify({ screen: 'decrypt', index: 9, selected: null })))
  await page.reload()
  await expect(page.getByRole('button', { name: 'GEWINN FREISCHALTEN' })).toBeVisible()
  await expect(page.locator('iframe')).toHaveCount(0)
})


// Exercise the longest question, each story layout and the fixed export at every phone width.
test('all phone widths, final-key timing, image fallback and export failure', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  for (const width of [320, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 844 })
    for (const [screen, index] of [['login', 0], ['intro', 0], ['question', 9], ['halfway', 5], ['complete', 9], ['reveal', 9], ['tickets', 9]] as const) {
      await page.evaluate(({ screen, index }) => sessionStorage.setItem('project-x:progress:v1', JSON.stringify({ screen, index, selected: null })), { screen, index })
      await page.reload()
      await expect(page.locator('main > section')).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${screen} at ${width}`).toBe(true)
      if (width === 320) await capture(page, `${info.project.name}-${screen}-320`)
      if (screen === 'tickets') {
        expect(await page.locator('.ticket-export-surface').evaluate((node) => node.getBoundingClientRect().width)).toBe(540)
        if (width === 320) {
          const ready = page.waitForEvent('download')
          await page.getByRole('button', { name: 'GESCHENKTICKET SPEICHERN' }).click()
          const download = await ready
          const png = await readFile((await download.path())!)
          expect(png.readUInt32BE(16)).toBe(1080)
          await download.saveAs(`.impeccable/review/${info.project.name}-ticket-export-320.png`)
        }
      }
    }
  }
  await page.setViewportSize({ width: 320, height: 700 })
  // A real failed browser export must give recovery feedback, not a false success.
  await page.evaluate(() => { HTMLCanvasElement.prototype.toBlob = () => { throw new Error('Canvas unavailable') } })
  await page.getByRole('button', { name: 'GESCHENKTICKET SPEICHERN' }).click()
  await expect(page.getByRole('alert')).toContainText('Bitte versuche es noch einmal')
  await expect(page.getByRole('button', { name: 'GESCHENKTICKET SPEICHERN' })).toBeEnabled()
  await page.route('**/images/questions/**', (route) => route.abort())
  await page.evaluate(() => sessionStorage.setItem('project-x:progress:v1', JSON.stringify({ screen: 'question', index: 9, selected: null })))
  await page.reload()
  await page.getByRole('button', { name: 'C: Berlin lebt', exact: true }).press('Enter')
  await expect(page.getByRole('heading', { name: /BERLIN/ })).toBeFocused()
  await expect(page.getByRole('button', { name: 'GEWINN FREISCHALTEN' })).toBeEnabled()
  await expect(page.locator('body')).not.toContainText('KONZERTTICKETS')
})
