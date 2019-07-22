import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkHandler, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

export interface IGraphqlApolloConfig {
  link: HttpLinkHandler;
  cache: InMemoryCache;
}

export function createApollo(httpLink: HttpLink, graphqlUri: string = '/graphql', withCredentials: boolean = true): IGraphqlApolloConfig {
  return {
    link: httpLink.create({
      uri: graphqlUri,
      withCredentials,
    }),
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
