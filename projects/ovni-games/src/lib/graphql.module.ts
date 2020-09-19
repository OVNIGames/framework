import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink, HttpLinkHandler } from 'apollo-angular/http';
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
    link: link ? link.concat(client as any) : client,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  imports: [HttpClientModule],
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
