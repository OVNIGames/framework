import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkHandler, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpHeaders } from '@angular/common/http';
import { ApolloLink } from 'apollo-link';

export interface IGraphqlApolloConfig {
  link: HttpLinkHandler | ApolloLink;
  cache: InMemoryCache;
}

export function createApollo(httpLink: HttpLink, graphqlUri: string = '/graphql', withCredentials: boolean = true, link?: ApolloLink, headers: HttpHeaders = new HttpHeaders()): IGraphqlApolloConfig {
  const client = httpLink.create({
    headers,
    uri: graphqlUri,
    withCredentials,
  });

  return {
    link: link ? link.concat(client) : client,
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
