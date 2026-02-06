module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        //'react-native-worklets/plugin',
        [
          'module-resolver',
          {
            root: ['./src'],
            alias: {
              '@assets': './src/assets',
              '@components': './src/components',
              '@contexts': './src/contexts',
              '@database': './src/database',
              '@hooks': './src/hooks',
              '@routes': './src/routes',
              '@screens': './src/screens',
              '@services': './src/services',
              '@theme': './src/theme',
              '@utils': './src/utils',
            },
          },
        ],
        ['babel-plugin-inline-import', { extensions: ['.sql'] }],
        'react-native-reanimated/plugin',
      ],
    };
  };