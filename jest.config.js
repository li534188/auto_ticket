// module.exports = {
//   preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
//   transform: {
//     '^.+\\.vue$': 'vue-jest',
//     '^.+\\.js$': 'babel-jest',
//     '^.+\\.ts?$': 'ts-jest'
//   },
//   globals: {
//     'ts-jest': {
//       tsConfig: 'tsconfig.jest.json'
//     }
//   },
//   testEnvironment: 'jsdom',
//   moduleNameMapper: {
//     '^@/(.*)$': '<rootDir>/src/$1'
//   },
//   snapshotSerializers: ['jest-serializer-vue'],
//   testMatch: [
//     '<rootDir>/tests/unit/**/*.spec.(js|jsx|ts|tsx)'
//   ],
//   transformIgnorePatterns: ['<rootDir>/node_modules/']
// };
// module.exports = {
//   preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
//   transform: {
//     '^.+\\.vue$': 'vue-jest'
//   }
// };

module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  globals: {},
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es)'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/Template/NewTemplate.vue', 'src/**/Employee/*.vue', '!src/**/Employee/index.vue', '!src/components/*.vue',
    '!src/**/Employee/EmployeeContentTab.vue',
    'src/**/User.vue'
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  coverageReporters: [
    'json-summary',
    'text',
    'lcov'
  ]
};