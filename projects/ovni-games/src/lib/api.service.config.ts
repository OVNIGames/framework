export interface ApiServiceConfig {
  production: boolean;
  socket_uri: string;
  socket_secure: boolean;
  graphql_uri: string;
  with_credentials?: boolean;
}
