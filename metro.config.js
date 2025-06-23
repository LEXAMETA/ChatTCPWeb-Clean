const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  return {
    ...config,
    transformer: {
      ...config.transformer,
      assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    },
    resolver: {
      ...config.resolver,
      sourceExts: ['js', 'jsx', 'ts', 'tsx', 'cjs'],
      assetExts: ['png', 'jpg', 'jpeg', 'ttf', 'woff', 'woff2', 'otf', 'svg'],
    },
  };
})();
