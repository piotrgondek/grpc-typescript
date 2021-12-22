module.exports = function (config, env) {
  config = {
    ...config,
    resolve: {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        net: require.resolve("net-browserify"),
        http2: false,
        util: require.resolve("util"),
        dns: require.resolve("dns"),
        tls: require.resolve("browserify-fl"),
        stream: require.resolve("stream-browserify"),
        os: require.resolve("os-browserify/browser"),
        fs: require.resolve("browserify-fs"),
        zlib: require.resolve("browserify-zlib"),
        http: require.resolve("stream-http"),
        path: require.resolve("path-browserify"),
        buffer: require.resolve("buffer"),
        assert: require.resolve("assert"),
      },
    },
  };
  return config;
};
