const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
     zlib: require.resolve("browserify-zlib"),
     querystring: require.resolve("querystring-es3"),
     path: require.resolve("path-browserify"),
     crypto: require.resolve("crypto-browserify"),
     fs : false,
     stream: require.resolve("stream-browserify"),
     http: require.resolve("stream-http"),
     assert: require.resolve("assert/"),
     util: require.resolve("util/"),
     url: require.resolve("url/"),
     net : false
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
    //   Buffer: ["buffer", "Buffer"],
    }),
  ]);
//   config.ignoreWarnings = [/Failed to parse source map/];
//   config.module.rules.push({
//     test: /\.(js|mjs|jsx)$/,
//     enforce: "pre",
//     loader: require.resolve("source-map-loader"),
//     resolve: {
//       fullySpecified: false,
//     },
//   });
  return config;
};