import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Repo is served as a project site at https://<user>.github.io/portfolio/,
  // so assets must be rooted at /portfolio/ — absolute /assets/... 404s and
  // renders a blank page on Pages.
  base: '/portfolio/',
  plugins: [react()],
})
