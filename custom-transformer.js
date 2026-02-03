const upstreamTransformer = require('@expo/metro-config/babel-transformer');

module.exports.transform = function ({ src, filename, ...rest }) {
  // Force TypeScript mode for all JSX files
  if (filename.endsWith('.jsx')) {
    return upstreamTransformer.transform({
      src,
      filename: filename.replace(/\.jsx$/, '.tsx'),
      ...rest,
    });
  }

  return upstreamTransformer.transform({ src, filename, ...rest });
};
