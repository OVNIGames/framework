import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { findTimezone } from './find-timezone';
import { ITimezone } from './timezone.interface';
import { timezones } from './timezones';

/**
 * <og-timezone-selector> is a selector to pick a timezone.
 */
@Component({
  selector: 'og-timezone-selector',
  templateUrl: './timezone-selector.component.html',
})
export class TimezoneSelectorComponent implements AfterViewInit {
  private _value?: ITimezone;
  public timezones: ITimezone[] = timezones;
  @Input() public guessIfNull?: boolean;
  @Input() public get value(): ITimezone | string | number | undefined {
    return this._value;
  }
  public set value(timezone: ITimezone | string | number | undefined) {
    if (typeof timezone === 'string' || typeof timezone === 'number') {
      timezone = findTimezone(timezone);
    }

    this._value = timezone;
  }
  @Output() public valueChange: EventEmitter<ITimezone> = new EventEmitter<ITimezone>();

  public ngAfterViewInit(): void {
    if (this.guessIfNull && !this.value) {
      this.guess();
    }
  }

  public update(abbr: string): void {
    this.updateValue(this.timezones.filter(timezone => timezone.abbr === abbr)[0]);
  }

  public updateValue(value: ITimezone): void {
    if (this.value !== value) {
      this.value = value;
      this.valueChange.emit(value);
    }
  }

  protected getTimezone(): string | null {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
    } catch (e) {
      return null;
    }
  }

  public guess(): void {
    const timezone = findTimezone(this.getTimezone() || (new Date()).getTimezoneOffset() / -60);

    if (timezone) {
      this.updateValue(timezone);

      return;
    }
  }
}
