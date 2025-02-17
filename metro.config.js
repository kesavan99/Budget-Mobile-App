const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
    transformer: {
        babelTransformerPath: require.resolve('react-native-sass-transformer'),
    },
    resolver: {
        sourceExts: [...defaultConfig.resolver.sourceExts, 'scss', 'sass'],
    },
};

module.exports = mergeConfig(defaultConfig, config);
