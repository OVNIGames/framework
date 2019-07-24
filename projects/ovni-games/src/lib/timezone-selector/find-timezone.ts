import { ITimezone } from './timezone.interface';
import { timezones } from './timezones';

export function findTimezone(timezone: string | number): ITimezone | undefined {
  if (typeof timezone === 'string') {
    return timezones.filter(data => data.utc.indexOf(timezone))[0] || undefined;
  }

  return timezones.filter(data => data.offset === timezone)[0] || undefined;
}
