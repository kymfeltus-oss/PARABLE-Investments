/** Escape text for iCalendar DESCRIPTION / SUMMARY (RFC 5545). */
export function escapeIcsText(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\n');
}

/** Format as UTC `YYYYMMDDTHHmmssZ` for VEVENT and Google `dates` param. */
export function formatIcsUtc(d: Date): string {
  return d.toISOString().replace(/\.\d{3}Z$/, 'Z').replace(/[-:]/g, '');
}

export type MeetingCalendarBlock = {
  /** DTSTART */
  start: Date;
  /** DTEND */
  end: Date;
  /** Plain .ics file body (CRLF). */
  ics: string;
  /** One-click Google Calendar template URL. */
  googleCalendarUrl: string;
};

/**
 * Placeholder timed reminder — real slot comes from the user's booking provider.
 * Offset/duration are tunable via env on the server.
 */
export function buildMeetingConfirmationCalendar(opts: {
  uidSuffix: string;
  summary: string;
  descriptionLines: string[];
  locationUrl: string;
  /** Hours from "now" until reminder start (server time). */
  reminderOffsetHours: number;
  /** Event length in minutes. */
  durationMinutes: number;
}): MeetingCalendarBlock {
  const start = new Date();
  start.setTime(start.getTime() + opts.reminderOffsetHours * 60 * 60 * 1000);
  start.setUTCMinutes(0, 0, 0);
  const end = new Date(start.getTime() + opts.durationMinutes * 60 * 1000);

  const uid = `parable-meeting-${opts.uidSuffix.replace(/[^a-zA-Z0-9_-]/g, '')}@parable`;
  const dtStamp = formatIcsUtc(new Date());
  const dtStart = formatIcsUtc(start);
  const dtEnd = formatIcsUtc(end);
  const desc = escapeIcsText(opts.descriptionLines.join('\n'));
  const summ = escapeIcsText(opts.summary);
  const loc = escapeIcsText(opts.locationUrl);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Parable//Meeting Confirmation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summ}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${loc}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  const ics = lines.join('\r\n') + '\r\n';

  const details = opts.descriptionLines.join('\n');
  const googleCalendarUrl =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(opts.summary)}` +
    `&dates=${formatIcsUtc(start)}/${formatIcsUtc(end)}` +
    `&details=${encodeURIComponent(details)}` +
    `&location=${encodeURIComponent(opts.locationUrl)}`;

  return { start, end, ics, googleCalendarUrl };
}
