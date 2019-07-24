import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITimezone } from './timezone.interface';
import { timezones } from './timezones';

/**
 * <og-timezone-selector> is a selector to pick a timezone.
 */
@Component({
  selector: 'og-timezone-selector',
  templateUrl: './timezone-selector.component.html',
})
export class TimezoneSelectorComponent implements OnInit {
  public timezones: ITimezone[] = timezones;
  @Input() public guessIfNull?: boolean;
  @Input() public value?: ITimezone;
  @Output() public valueChange: EventEmitter<ITimezone> = new EventEmitter<ITimezone>();

  public ngOnInit(): void {
    if (this.guessIfNull && !this.value) {
      this.guess();
    }
  }

  public update(value: ITimezone): void {
    this.value = value;
    this.valueChange.emit(value);
  }

  protected getTimezone(): string | null {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
    } catch (e) {
      return null;
    }
  }

  public guess(): void {
    const timezone = this.getTimezone();

    if (timezone) {
      this.update(this.timezones.filter(data => data.utc.indexOf(timezone))[0] || undefined);
    }
  }
}
