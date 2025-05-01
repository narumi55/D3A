const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('cjs');

defaultConfig.resolver.extraNodeModules = {
  '@components': `${__dirname}/components`,
  '@screens': `${__dirname}/screens`,
  '@utils': `${__dirname}/utils`,
};

module.exports = defaultConfig;
