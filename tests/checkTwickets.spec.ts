import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

test('Check Twickets for ticket availability', async ({ page }) => {
  await page.goto('https://www.twickets.live/en/event/1828748649929117696', {
    waitUntil: 'networkidle'
  });

  // Look for ticket listing cards (they usually have a "listing-card" class)
  const listings = await page.$$('.listing-card');
  console.log(`Found ${listings.length} ticket(s).`);

  // If any tickets are found, send SMS
  if (listings.length > 0) {
    const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

    await client.messages.create({
      body: `🎟️ Tickets just popped up on Twickets!`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: process.env.MY_PHONE_NUMBER!
    });

    console.log('✅ SMS sent!');
  }

  // Keep Playwright test runner happy (you can remove this if not needed)
  expect(listings.length).toBeGreaterThanOrEqual(0);
});
