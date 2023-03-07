import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import EsLint from 'vite-plugin-linter'
import dts from 'vite-plugin-dts'
import tsConfigPaths from 'vite-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'

import * as packageJson from './package.json'

const { EsLinter, linterPlugin } = EsLint

// https://vitejs.dev/config/
export default defineConfig((configEnv) => ({
  plugins: [
    visualizer(),
    react(),
    tsConfigPaths(),
    linterPlugin({
      include: ['./src}/**/*.{ts,tsx}'],
      linters: [new EsLinter({ configEnv })],
    }),
    dts({
      include: ['src/components/'],
    }),
  ],
  build: {
    minify: false,
    sourcemap: false,
    lib: {
      entry: resolve('src', 'components/index.ts'),
      name: 'ReactOptimizedList',
      formats: ['es', 'umd'],
      fileName: (format) => `react-optimized-list.${format}.js`,
    },
    rollupOptions: {
      // external: [...Object.keys(packageJson.peerDependencies)],
      output: {
        globals: { react: 'react' },
      },
    },
  },
}))
