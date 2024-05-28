import { defineConfig, loadEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import codegen from 'vite-plugin-graphql-codegen';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  process.env = { ...process.env, ...env };

  const devConfig: UserConfig = {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    plugins: [
      react(),
      cssInjectedByJsPlugin({
        relativeCSSInjection: true,
      }),
      codegen({ matchOnSchemas: true, debug: true, throwOnBuild: false }),
    ],

    build: {
      minify: true,
      cssCodeSplit: true,
      rollupOptions: {
        input: './src/main.tsx',
        output: {
          manualChunks: undefined,
        },
      },
    },
  };

  if (command === 'build') {
    return {
      ...devConfig,
      ssr: {
        // Add your external dependencies here for the SSR build, otherwise,
        // the bundled won't have enough libraries to render noExternal:
        // [/@\w+\/*/],
      },
    };
  }

  return devConfig;
});
