import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildInvestorMeetingConfirmationHtml } from '../src/lib/meeting-confirmation-mail-html';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'email-templates', 'investor-meeting-confirmation.preview.html');

const html = buildInvestorMeetingConfirmationHtml({
  name: 'Alex Rivera',
  meetUrl: 'https://www.parableinvestments.com/meet?join=scheduled&room=demo-room-suffix',
  roomLabel: 'investor-demo-room-suffix',
  suffixOnly: 'demo-room-suffix',
  regId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  schedulingUrl: 'https://cal.com/parable/demo',
  meetingHostKey: 'DEMO-HOST-KEY',
  ndaVersion: '2024-01 (preview)',
  googleCalendarUrl:
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Parable%20preview',
  icsFilename: 'investor-demo-room-suffix-parable-meeting.ics',
  reminderOffsetHours: 24,
});

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(
  outPath,
  `<!-- PREVIEW ONLY: fake data. Regenerate: npm run email:preview -->\n` +
    `<!-- Production: buildInvestorMeetingConfirmationHtml() in src/lib/meeting-confirmation-mail-html.ts -->\n` +
    html,
  'utf8',
);
console.log('Wrote', outPath);
