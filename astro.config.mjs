// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  
  // ¡¡ESTA LÍNEA ES LA QUE FALTABA!!
  output: "server", 
  
  adapter: netlify()
});