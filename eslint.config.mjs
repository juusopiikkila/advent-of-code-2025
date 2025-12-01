import base from '@juuso.piikkila/eslint-config-typescript/configurations/base/index.mjs';
import typescript from '@juuso.piikkila/eslint-config-typescript/configurations/typescript/index.mjs';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    ...base,
    ...typescript,
    {
        rules: {
            'no-console': 'off',
            'canonical/filename-match-exported': 'off',
            'unicorn/no-array-reduce': 'off',
            'no-implicit-coercion': 'off',
        },
    },
    {
        files: ['template/*.ts'],
        rules: {
            'no-unused-vars': 'off',
            'canonical/filename-match-exported': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },
]);
