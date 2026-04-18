function escapeIcsText(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

function formatUtc(dt: Date): string {
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  const h = String(dt.getUTCHours()).padStart(2, '0');
  const min = String(dt.getUTCMinutes()).padStart(2, '0');
  const s = String(dt.getUTCSeconds()).padStart(2, '0');
  return `${y}${m}${d}T${h}${min}${s}Z`;
}

export type IcsEventInput = {
  title: string;
  description: string;
  locationUrl: string;
  startUtc: Date;
  endUtc: Date;
  uid?: string;
};

/** Minimal VEVENT for Google/Apple/Outlook import. */
export function buildIcsCalendar(event: IcsEventInput): string {
  const uid = event.uid ?? `${Date.now()}-${Math.random().toString(36).slice(2)}@parable`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Parable//Investor Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatUtc(new Date())}`,
    `DTSTART:${formatUtc(event.startUtc)}`,
    `DTEND:${formatUtc(event.endUtc)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(event.locationUrl)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
}
