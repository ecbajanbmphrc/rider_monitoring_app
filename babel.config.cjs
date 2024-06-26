// module.exports = function(api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'],
//     plugins: [react-native-reanimated/plugin],
//   };
// };
// module.exports = {
//   presets: ['babel-preset-expo'],
//   plugins: ['react-native-reanimated/plugin'],
// };

// export default function() {
//   return {
//     presets: ["@babel/preset-typescript"]
//   };
// }

// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
//   env: {
//      production: {
//         plugins: [
//           'react-native-paper/babel'
//         ],
//      },
//   },
//   plugins: [
//        'react-native-reanimated/plugin',
//   ],
// };

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ]
  ],
  plugins: [
    [
    'react-native-reanimated/plugin'
    ],
    [
      'module:react-native-dotenv',
      {
        // envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        // blocklist: null,
        // allowlist: null,
        // blacklist: null, // DEPRECATED
        // whitelist: null, // DEPRECATED
        // safe: false,
        // allowUndefined: true,
        // verbose: false,
      },
    ],
  ]
};

// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'],
//   };
// };

// module.exports = {
//   presets: [
//     [
//       '@babel/preset-env',
//       {
//         targets: {
//           node: 'current'
//         }
//       }
//     ]
//   ]
// };
