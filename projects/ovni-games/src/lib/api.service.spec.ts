import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApolloModule } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { ApolloClient } from 'apollo-client';
import { FetchResult } from 'apollo-link';
import { Observable } from 'rxjs';
import { ApiService, IApiParametersInput } from './api.service';

describe('ApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ApolloModule, HttpLinkModule, HttpClientModule],
  }));

  it('should be created', () => {
    const service: ApiService = TestBed.inject(ApiService);
    expect(service).toBeTruthy();
  });

  it('should upload using useMultipart', () => {
    const service: ApiService = TestBed.inject(ApiService);
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

      return null as unknown as Observable<FetchResult<T, Record<string, object>, Record<string, object>>>;
    };
    service.upload<unknown>('xx');

    expect((args.context as Record<string, boolean>).useMultipart).toBe(true);
  });

  it('should handle pagination', () => {
    const service: ApiService = TestBed.inject(ApiService);
    expect(service.paginate instanceof Function).toBe(true);
  });

  it('should get apollo service', () => {
    const service: ApiService = TestBed.inject(ApiService);
    expect(service.getApollo() instanceof ApolloClient).toBe(true);
  });
});
