import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [react()],
  markdown: {
    shikiConfig: {
      theme: 'github-light-high-contrast',
    },
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['.netlify.app']
    }
  }
});
