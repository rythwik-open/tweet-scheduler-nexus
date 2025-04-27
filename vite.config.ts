import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { Buffer } from 'buffer'; // Add Buffer import

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log('Vite mode:', mode); // Debug log to confirm mode
  return {
    server: {
      host: "0.0.0.0", // Use 0.0.0.0 for broader compatibility
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        buffer: 'buffer', // Add buffer alias
      },
    },
    define: {
      'global.Buffer': 'Buffer', // Define Buffer globally
    },
  };
});