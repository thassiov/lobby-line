import type { Config } from 'jest';

const jestConfig: Config = {
  clearMocks: true,
  resetMocks: true,
  resetModules: true,
  cache: false,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.json',
      },
    ],
  },
};

export default jestConfig;
