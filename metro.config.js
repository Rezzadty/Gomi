const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Override source extensions to treat JSX files as TypeScript
config.resolver = {
  ...config.resolver,
  sourceExts: [...(config.resolver?.sourceExts || []), 'jsx'].filter((ext, index, self) => self.indexOf(ext) === index),
};

// Force all files through TypeScript transformer
config.transformer = {
  ...config.transformer,
  babelTransformerPath: path.resolve(__dirname, 'custom-transformer.js'),
};

module.exports = config;
