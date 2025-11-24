import { createDefaultPreset } from "ts-jest";

/** @type {import("jest").Config} **/
const tsJestTransformCfg = createDefaultPreset().transform;

export default {
  testEnvironment: "node",

  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  transform: {
    ...tsJestTransformCfg,
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          allowImportingTsExtensions: true,
          noEmit: true,
        },
      },
    ],
  },

  // Strip .ts extensions so Jest can resolve them
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.ts$': '$1',
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
