import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/out-tsc',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            // ── type: which layer may use which ──
            // an app composes: it may use any lib
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:data-access',
                'type:util',
              ],
            },
            // e2e tests the app from outside; it imports no lib
            { sourceTag: 'type:e2e', onlyDependOnLibsWithTags: [] },
            // a feature orchestrates UI, data and utils, never another feature
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: ['type:ui', 'type:data-access', 'type:util'],
            },
            // UI does not know HTTP exists: data comes in through inputs
            { sourceTag: 'type:ui', onlyDependOnLibsWithTags: ['type:util'] },
            { sourceTag: 'type:data-access', onlyDependOnLibsWithTags: ['type:util'] },
            // util is the base and depends on nothing (stops "shared" from becoming a dump)
            { sourceTag: 'type:util', onlyDependOnLibsWithTags: [] },

            // ── scope: a domain only uses itself and shared ──
            // the shell has no business screen: it only uses shared code
            { sourceTag: 'scope:shell', onlyDependOnLibsWithTags: ['scope:shared'] },
            {
              sourceTag: 'scope:operations',
              onlyDependOnLibsWithTags: ['scope:operations', 'scope:shared'],
            },
            {
              sourceTag: 'scope:analytics',
              onlyDependOnLibsWithTags: ['scope:analytics', 'scope:shared'],
            },
            { sourceTag: 'scope:shared', onlyDependOnLibsWithTags: ['scope:shared'] },

            // ── framework: Angular and React never import each other ──
            {
              sourceTag: 'framework:angular',
              onlyDependOnLibsWithTags: ['framework:angular', 'framework:none'],
            },
            {
              sourceTag: 'framework:react',
              onlyDependOnLibsWithTags: ['framework:react', 'framework:none'],
            },
            { sourceTag: 'framework:none', onlyDependOnLibsWithTags: ['framework:none'] },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
