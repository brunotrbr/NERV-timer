import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('renders the local clock and date without remote resources', async ({ page }) => {
  await expect(page.locator('#clockHour')).toHaveText(/^\d{2}$/);
  await expect(page.locator('#clockMinute')).toHaveText(/^\d{2}$/);
  await expect(page.locator('#clockSecond')).toHaveText(/^\d{2}$/);
  await expect(page.locator('#date')).toHaveText(/^[A-Z][a-z]+ \d{2}, \d{4}$/);

  const resources = await page.evaluate(() => performance.getEntriesByType('resource').map((entry) => entry.name));
  expect(resources.every((url) => new URL(url).hostname === '127.0.0.1')).toBe(true);
});

test('starts, pauses, and resets the stopwatch', async ({ page }) => {
  await page.locator('#start-cron').click();
  await expect(page.locator('#start-cron')).toHaveText('PAUSE');
  await page.waitForTimeout(1100);
  await page.locator('#start-cron').click();
  await expect(page.locator('#start-cron')).toHaveText('START');
  await page.locator('#reset').click();
  await expect(page.locator('#clockHour')).toHaveText('00');
  await expect(page.locator('#clockMinute')).toHaveText('00');
  await expect(page.locator('#clockSecond')).toHaveText('00');
});

test('validates countdown input and can complete', async ({ page }) => {
  let promptSeen = false;
  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'prompt') {
      promptSeen = true;
      await dialog.accept('0');
    } else {
      await dialog.accept();
    }
  });
  await page.locator('#start-count').click();
  expect(promptSeen).toBe(true);
  await expect(page.locator('#start-count')).toHaveClass(/active/);

  await page.evaluate(() => {
    nervCron.reset();
    nervCron.start(0.001, 'countdown');
  });
  await expect.poll(() => page.evaluate(() => nervCron.active)).toBe(false);
});

test('activates racing mode, reset, and audio toggle', async ({ page }) => {
  await page.locator('#beast').click();
  await expect(page.locator('#beast')).toHaveClass(/active/);
  await expect(page.locator('#beast')).toHaveClass(/glitch/);
  await page.locator('#reset').click();
  await expect(page.locator('#beast')).not.toHaveClass(/glitch/);

  await page.locator('.audio_control').click();
  await expect(page.locator('.audio_control img')).toHaveAttribute('src', 'images/audio-off.svg');
  await page.locator('.audio_control').click();
  await expect(page.locator('.audio_control img')).toHaveAttribute('src', 'images/audio-on.svg');
});

for (const viewport of [
  { width: 800, height: 480 },
  { width: 1080, height: 648 },
  { width: 1400, height: 800 }
]) {
  test(`preserves the 5:3 interface at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await expect(page.locator('#clockHour')).not.toHaveText('88');
    const box = await page.locator('#framing').boundingBox();
    expect(box).not.toBeNull();
    expect(box.width / box.height).toBeCloseTo(5 / 3, 2);
    expect(box.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(box.height).toBeLessThanOrEqual(viewport.height + 1);
    await mkdir('test-results/visual', { recursive: true });
    const screenshot = await page.screenshot({
      path: `test-results/visual/layout-${viewport.width}x${viewport.height}.png`
    });
    await test.info().attach(`layout-${viewport.width}x${viewport.height}`, {
      body: screenshot,
      contentType: 'image/png'
    });
  });
}
