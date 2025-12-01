import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        watch: false,
        root: './',
        coverage: {
            reporter: [
                'json-summary',
                'text',
            ],
            reportOnFailure: true,
        },
    },
});
