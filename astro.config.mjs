// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://gregoir30.github.io',
  base: '/OpenTech_Flow',
  vite: {
    plugins: [tailwindcss()]
  }
});