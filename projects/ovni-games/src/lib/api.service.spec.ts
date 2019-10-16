import { TestBed } from '@angular/core/testing';
import { FetchResult } from 'apollo-link';
import { Observable } from 'rxjs';

import { ApiService, IApiParametersInput } from './api.service';

describe('ApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });

  it('should upload using useMultipart', () => {
    const service: ApiService = TestBed.get(ApiService);
    let args: {
      name: string,
      parameters?: IApiParametersInput,
      returnedFields?: string | string[] | null,
      variables?: Record<string, unknown>,
      context?: unknown,
    } = {
      name: '',
    };
    service.mutate = <T>(
      name: string,
      parameters?: IApiParametersInput,
      returnedFields?: string | string[] | null,
      variables?: Record<string, unknown>,
      context?: unknown,
    ) => {
      args = {
        name,
        parameters,
        returnedFields,
        variables,
        context,
      };

      return null as unknown as Observable<FetchResult<unknown, Record<string, object>, Record<string, object>>>;
    };
    service.upload<unknown>('xx');

    expect((args.context as Record<string, boolean>).useMultipart).toBe(true);
  });

  it('should handle pagination', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service.paginate instanceof Function).toBe(true);
  });
});
