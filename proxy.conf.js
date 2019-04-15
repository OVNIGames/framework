const PROXY_CONFIG = {};
[
  {
    context: [
      '/graphql/*',
      '/oauth/*',
      '/images/*',
    ],
    target: 'http://localhost:3000',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
  },
  {
    context: [
      '/doc/*',
    ],
    target: 'http://localhost:1139',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
  },
  {
    context: [
      '/socket.io/*',
    ],
    target: 'http://localhost:3042',
    ws: true,
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
  },
].forEach(group => {
  group.context.forEach(proxy => {
    const copy = Object.assign({}, group);
    delete copy.context;
    PROXY_CONFIG[proxy] = copy;
  });
});

module.exports = PROXY_CONFIG;
