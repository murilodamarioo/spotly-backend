// vite.config.mjs (Ajuste)
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { copy } from 'vite-plugin-copy'

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    copy({
      targets: [
        {
          src: 'src/infra/mail/templates',
          dest: '.'
        },
      ],
      hook: 'writeBundle',
    }),
  ],
  test: {
    globals: true
  }
})