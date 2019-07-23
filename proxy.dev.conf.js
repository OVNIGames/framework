const PROXY_CONFIG = {};
[
  {
    context: [
      '/graphql/*',
      '/oauth/*',
      '/images/*',
    ],
    target: 'http://ovnigames-dev.selfbuild.fr',
    secure: true,
    logLevel: 'debug',
    changeOrigin: true,
  },
  {
    context: [
      '/socket.io/*',
    ],
    target: 'http://ovnigames-dev.selfbuild.fr',
    ws: true,
    secure: true,
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
