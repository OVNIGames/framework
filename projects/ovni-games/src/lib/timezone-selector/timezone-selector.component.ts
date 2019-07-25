import { Component, EventEmitter, Input, Output } from '@angular/core';
import { findMyTimezone, findTimezone } from './find-timezone';
import { ITimezone } from './timezone.interface';
import { timezones } from './timezones';

/**
 * <og-timezone-selector> is a selector to pick a timezone.
 */
@Component({
  selector: 'og-timezone-selector',
  templateUrl: './timezone-selector.component.html',
})
export class TimezoneSelectorComponent {
  private _value?: ITimezone;
  public timezones: ITimezone[] = timezones;
  @Input() public label?: string;
  @Input() public guessIfNull?: boolean;
  @Input() public get value(): ITimezone | undefined {
    return this._value;
  }
  public set value(timezone: ITimezone | undefined) {
    if (!timezone && this.guessIfNull) {
      timezone = findMyTimezone();
    }

    this._value = timezone;
  }
  @Output() public valueChange: EventEmitter<ITimezone> = new EventEmitter<ITimezone>();

  public update(value: ITimezone): void {
    if (this.value !== value) {
      this.value = value;
      this.valueChange.emit(value);
    }
  }
}
