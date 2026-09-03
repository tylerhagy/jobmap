#!/usr/bin/env node
/*
 * browser-test.mjs — drives the real app in Chromium against the fixture.
 * Playwright is optional; test.mjs is the gate that must always run.
 */
import { readFileSync } from 'fs';
import { spawn } from 'child_process';
let chromium;
try { ({ chromium } = await import('/Users/thagy/Projects/protoserve/node_modules/playwright/index.mjs')); }
catch { console.log('playwright not available — skipping browser test'); process.exit(0); }
const PORT = 8153;
const FILE = readFileSync(new URL('./fixtures/real-jobs.migrated.md', import.meta.url), 'utf8');
const server = spawn('python3', ['serve.py', String(PORT)], { cwd: '/Users/thagy/Projects/jobmap', stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 900));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 950 } });
const errs = [];
page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
await page.addInitScript((text) => {
  const store = { 'Jobs to be Done.md': text };
  const fh = (name) => ({ kind: 'file', name,
    getFile: async () => ({ text: async () => store[name] }),
    queryPermission: async () => 'granted', requestPermission: async () => 'granted',
    createWritable: async () => ({ write: async (t) => { store[name] = t; window.__written = t; }, close: async () => {} }) });
  window.showDirectoryPicker = async () => ({ kind: 'directory', name: 'Jobs (jobmap)',
    queryPermission: async () => 'granted', requestPermission: async () => 'granted',
    entries: async function* () { for (const n of Object.keys(store)) yield [n, fh(n)]; } });
  window.__store = store;
}, FILE);
await page.goto(`http://localhost:${PORT}/index.html`);
await page.waitForSelector('#stage');
await page.click('#pick');
await page.waitForSelector('.job-row', { timeout: 8000 });

let pass = 0, fail = 0;
const ok = (n, c, d) => { if (c) pass++; else { fail++; console.log(`  FAIL ${n}${d ? '  — ' + d : ''}`); } };

ok('the rail lists categories', await page.locator('#rail .g-item').count() >= 10);
ok('and offers a new one', await page.locator('.rail-add').first().isVisible());
const railFirst = await page.locator("#rail .g-item .n").first().textContent();
ok('the list shows only the selected category',
   (await page.locator('.job-row').count()) < 51 && (await page.locator('.job-row').count()) > 0,
   `${await page.locator('.job-row').count()} rows`);
ok('the heading is the category', (await page.locator('.g-title').first().textContent()) === railFirst);

// switch category
await page.locator('#rail .g-item').nth(2).click();
await page.waitForTimeout(200);
ok('clicking a category switches the list',
   (await page.locator('.g-title').first().textContent()) !== railFirst);

// tabs
ok('three tabs: Jobs, Roles, Source', (await page.locator('.tabs button').count()) === 3);
ok('Source is in the bar', await page.locator('.tabs button:has-text("Source")').isVisible());
ok('and not inline on the job list', !(await page.locator('.quiet:has-text("Show the markdown")').count()));
ok('no job map tab', !(await page.locator('.tabs button:has-text("Job map")').count()));

// job card
await page.locator('.job-row').first().click();
await page.waitForTimeout(200);
ok('three statement parts always', (await page.locator('.stmt .part').count()) === 3);
ok('no stage field', !(await page.locator('[data-k="stage"]').count()));
ok('no parent field', !(await page.locator('[data-k="parent"]').count()));
ok('a role picker', await page.locator('[data-k="who"]').isVisible());
ok('a category picker', await page.locator('[data-k="cat"]').isVisible());
ok('a depends-on control', await page.locator('.depadd').isVisible());
ok('sign-off is a checkbox', await page.locator('.signrow input[type=checkbox]').isVisible());

// how often is structured
ok('how often is a picker, not a text box', await page.locator('[data-k="freq-kind"]').isVisible());
await page.selectOption('[data-k="freq-kind"]', 'every'); await page.waitForTimeout(200);
await page.fill('.freq .num', '2'); await page.dispatchEvent('.freq .num', 'change'); await page.waitForTimeout(200);
ok('every N weeks writes a sentence', (await page.textContent('.freq-out')).includes('every 2 weeks'),
   await page.textContent('.freq-out'));
await page.selectOption('[data-k="freq-kind"]', 'nth'); await page.waitForTimeout(200);
ok('a weekday-of-month shape appears', (await page.locator('.freq select').count()) >= 3);
await page.selectOption('[data-k="freq-kind"]', 'days'); await page.waitForTimeout(200);
ok('set days give a day grid', (await page.locator('.daybox .day').count()) === 31);
await page.locator('.daybox .day').nth(4).click(); await page.waitForTimeout(200);
ok('picking days writes them', (await page.textContent('.freq-out')).includes('of the month'),
   await page.textContent('.freq-out'));
await page.selectOption('[data-k="freq-kind"]', 'irregular'); await page.waitForTimeout(200);
ok('irregular is free text', await page.locator('.freq .grow').isVisible());
ok('notes, not "how well we know it"', (await page.textContent('.card')).includes('Notes'));
ok('no required/optional sermons', !(await page.locator('.titlehint').count()));

// roles round trip
await page.selectOption('[data-k="who"]', { index: 0 }).catch(() => {});
await page.evaluate(() => {
  const s = document.querySelector('[data-k="who"]');
  const o = document.createElement('option'); o.value = 'Payments'; s.appendChild(o);
  s.value = 'Payments'; s.dispatchEvent(new Event('change'));
});
await page.waitForTimeout(250);
await page.locator('.tabs button:has-text("Roles")').click();
await page.waitForTimeout(250);
ok('the role shows up in the Roles view', (await page.textContent('#stage')).includes('Payments'));
ok('and unroled jobs are called out', (await page.textContent('#stage')).includes('Nobody named'));

// capture
await page.locator('#bar button:has-text("Capture")').click();
await page.waitForTimeout(200);
await page.fill('#capText', 'When a file lands late, I need a heads up, so that the run is not held up');
await page.press('#capText', 'Enter');
await page.waitForTimeout(300);
ok('capture adds a job', (await page.textContent('#capCount')).includes('1 captured'));

// save round-trips
await page.keyboard.press('Escape');
await page.waitForTimeout(150);
await page.keyboard.press('Meta+s');
await page.waitForTimeout(600);
const written = await page.evaluate(() => window.__written || null);
ok('save wrote the file', !!written);
ok('written file has the new columns', written && written.includes('| Who | Depends on | Frequency | Duration | Sign-off |'));
ok('no page errors', errs.length === 0, errs.join(' | '));
console.log(`${pass} passed, ${fail} failed`);
await browser.close(); server.kill();
process.exit(fail ? 1 : 0);
