import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink, HttpLinkHandler } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpHeaders } from '@angular/common/http';
import { ApolloLink } from 'apollo-link';

export interface GraphqlApolloConfig {
  link: HttpLinkHandler,
  cache: InMemoryCache,
}

export function createApollo(httpLink: HttpLink, link: ApolloLink, headers: HttpHeaders, graphqlUri: string = '/graphql', withCredentials: boolean = true): GraphqlApolloConfig {
  return {
    link: link.concat(httpLink.create({
      headers,
      uri: graphqlUri,
      withCredentials,
    })),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {
}
