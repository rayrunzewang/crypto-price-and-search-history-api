import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      libs: path.resolve(__dirname, '../../layers/sharedLibs/nodejs/node_modules/libs'),
    },
  },
})
