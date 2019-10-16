import { IQuery } from './query.interface';

export interface IPagination<T> extends Partial<IQuery<T[]>> {
  total?: number;
  per_page?: number;
  last_page?: number;
  current_page?: number;
  has_more_pages?: boolean;
  from?: number;
  to?: number;
}
