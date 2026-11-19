/* De hele app doorlopen zoals een student: startscherm, oefenen (goed en fout), een korte proeftoets
   met rekenmachine en dubbele Enter, de uitslag, voortgang, uitleg en de stopdialoog. */
import { expect, test, type Page } from '@playwright/test';
import type { AppState } from '../../src/app/state';

interface Haak {
  S: AppState;
}
declare global {
  interface Window {
    __rwt?: Haak;
  }
}

/** wat de test over de huidige opgave moet weten */
async function opgave(page: Page) {
  return page.evaluate(() => {
    const u = window.__rwt?.S.ui;
    if (!u) throw new Error('geen opgave in beeld');
    const q = u.q;
    return {
      type: q.type,
      ans: q.type === 'multi' ? null : q.ans,
      velden: q.type === 'multi' ? q.fields.map((f) => f.ans) : [],
      aantal: q.type === 'mc' ? q.opts.length : 0,
      calc: q.calc,
    };
  });
}

async function beantwoord(page: Page, goed: boolean) {
  const q = await opgave(page);
  if (q.type === 'mc' && typeof q.ans === 'number') {
    await page.locator(`main [data-act="pick"][data-i="${goed ? q.ans : (q.ans + 1) % q.aantal}"]`).click();
  } else if (q.type === 'order' && Array.isArray(q.ans)) {
    for (const i of goed ? q.ans : [...q.ans].reverse()) await page.locator(`main [data-act="ordadd"][data-i="${i}"]`).click();
  } else {
    for (const [i, a] of q.velden.entries()) {
      const v = goed ? a : a + 1;
      await page.locator(`#ans${i}`).fill(String(+v.toFixed(6)).replace('.', ','));
    }
  }
  return q;
}

const fase = (page: Page) => page.evaluate(() => `${window.__rwt?.S.view}:${window.__rwt?.S.s?.phase ?? ''}`);

test.beforeEach(async ({ page }) => {
  const fouten: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') fouten.push(m.text());
  });
  page.on('pageerror', (e) => fouten.push(e.message));
  (page as Page & { fouten?: string[] }).fouten = fouten;
  await page.goto('?e2e');
});

test.afterEach(({ page }) => {
  expect((page as Page & { fouten?: string[] }).fouten ?? []).toEqual([]);
});

test('startscherm en voorbeeldsom', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Oefen de rekentoets voor de pabo');
  // alleen de hoofdmodus heeft een gevulde knop
  await expect(page.locator('.modes .btn.pri')).toHaveCount(1);
  await page.locator('.demo-d summary').click();
  await page.locator('#demo0').fill('1');
  await page.getByRole('button', { name: 'Controleer' }).click();
  await expect(page.locator('.demo .fb')).toBeVisible();
  await expect(page.locator('.demo-d')).toHaveAttribute('open', '');
});

test('oefenen: goed antwoord klapt de uitwerking in, fout antwoord klapt hem uit', async ({ page }) => {
  await page.locator('.tabs [data-v="oefenen"]').click();
  await page.getByRole('button', { name: 'Start met oefenen' }).click();
  await beantwoord(page, true);
  await page.locator('#submit').click();
  await expect(page.locator('.fb.ok')).toBeVisible();
  await expect(page.locator('.fb details.uitw')).not.toHaveAttribute('open', '');
  await page.locator('#submit').click();
  await beantwoord(page, false);
  await page.locator('#submit').click();
  await expect(page.locator('.fb.no')).toBeVisible();
  await expect(page.locator('.fb details.uitw')).toHaveAttribute('open', '');
});

test('korte proeftoets van begin tot uitslag', async ({ page }) => {
  test.setTimeout(90_000);
  await page.locator('[data-act="start"][data-mode="short"]').click();
  await expect(page.getByRole('heading', { name: 'Hoofdrekenen' })).toBeVisible();
  await page.locator('[data-act="begin"]').click();

  let enterGetest = false;
  let rekenmachineGetest = false;
  for (let n = 0; n < 40; n++) {
    const f = await fase(page);
    if (f.startsWith('result')) break;
    if (f.endsWith('introN')) {
      await page.locator('[data-act="begin"]').click();
      continue;
    }
    const q = await beantwoord(page, n % 3 !== 0);
    if (!enterGetest && q.type === 'multi') {
      // dubbele Enter: de eerste zet alleen de focus op de knop
      const voor = await page.evaluate(() => window.__rwt?.S.s?.idx);
      await page.locator('#ans0').press('Enter');
      await expect(page.locator('#submit')).toBeFocused();
      await expect(page.locator('.actbar .kbd')).toBeVisible();
      expect(await page.evaluate(() => window.__rwt?.S.s?.idx)).toBe(voor);
      await page.keyboard.press('Enter');
      await expect.poll(() => page.evaluate(() => window.__rwt?.S.s?.idx ?? -1)).toBe((voor ?? 0) + 1);
      enterGetest = true;
      continue;
    }
    if (!rekenmachineGetest && q.calc) {
      await page.locator('[data-act="calc"]').first().click();
      for (const k of ['1', '2', '×', '3', '=']) await page.locator(`.calc [data-k="${k}"]`).click();
      await expect(page.locator('.calc-r')).toHaveText('36');
      await page.locator('.calc [data-act="calc"]').click();
      rekenmachineGetest = true;
    }
    // een muisklik gaat meteen door, zonder hint
    await page.locator('#submit').click();
  }
  expect(enterGetest).toBe(true);
  await expect(page.getByRole('heading', { name: 'Je oefenscore' })).toBeVisible();
  await expect(page.locator('.score-n')).toContainText('/ 100');
  await expect(page.locator('details.rev')).toHaveCount(20);

  await page.locator('.tabs [data-v="voortgang"]').click();
  await expect(page.locator('.tbl.hist tbody tr')).toHaveCount(1);
  await page.locator('.tabs [data-v="uitleg"]').click();
  await expect(page.getByRole('heading', { name: 'Over de toets' })).toBeVisible();
});

test('stoppen tijdens een toets vraagt eerst om bevestiging', async ({ page }) => {
  await page.locator('[data-act="start"][data-mode="full"]').click();
  await page.locator('[data-act="begin"]').click();
  await page.locator('.runbar [data-act="stop"]').click();
  const dialoog = page.getByRole('alertdialog');
  await expect(dialoog).toBeVisible();
  await expect(page.locator('#dlg-no')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialoog).toBeHidden();
  await page.locator('.runbar [data-act="stop"]').click();
  await page.locator('[data-act="dlgyes"]').click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('verborgen tijd blijft verborgen na herladen', async ({ page }) => {
  await page.locator('[data-act="start"][data-mode="short"]').click();
  await page.locator('[data-act="begin"]').click();
  await expect(page.locator('#timer')).toBeVisible();
  await page.locator('[data-act="timerhide"]').click();
  await expect(page.locator('#timer')).toBeHidden();
  await page.reload();
  await page.locator('[data-act="resume"]').click();
  await expect(page.locator('#timer')).toBeHidden();
});
