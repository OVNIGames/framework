import { ITimezone } from './timezone.interface';
import { timezones } from './timezones';

export function guessTimezoneName() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch (e) {
    return null;
  }
}

export function findTimezone(timezone: string | number | null | undefined): ITimezone | undefined {
  if (typeof timezone === 'undefined' || timezone === null) {
    return undefined;
  }

  if (typeof timezone === 'string') {
    return timezones.filter(data => data.utc.indexOf(timezone) !== -1)[0] || undefined;
  }

  return timezones.filter(data => data.offset === timezone)[0] || undefined;
}

export function findMyTimezone(): ITimezone | undefined {
  return findTimezone(guessTimezoneName() || (new Date()).getTimezoneOffset() / -60);
}

export function getTimezoneName(timezone: ITimezone | undefined): string | undefined {
  return timezone && timezone.utc[0];
}
