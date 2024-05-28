# Vite SSR with React 18

This repo demo how to do SSR using React 18 `renderToPipeableStream` while still
be able to use Vite Hot Module Reload (HMR) during development. Do note that the
code here is more like work-around while Vite doesn't officially support React
stream rendering. **Use this in your project with caution**.

## Try it

This project use `pnpm`. Try `pnpm dev` and editing CSS, JS and see HMR in
action. Try `pnpm preview` and use `curl http://localhost:4173` to see SSR HTML.

## Which problems were fixed?

### `React refresh preamble was not loaded`

If you tried to follow the [SSR guide on Vite website][vite-ssr] and the
[ssr-react][] example and rewrite the code use `renderToPipeableStream`, you
might hit that error, which cause Vite HMR stop working:

It's because after SSR, the root node is considered as both `wasMounted` and
`isMounted` by `react-refresh` [runtime script][rr]. So, `react-refresh` doesn't
handle that root node. I rewrite [`vite-plugin-react` preamble][preamble] to
work around that. See [`./src/refresh-hack.js`](./src/refresh-hack.js).

### Production `bootstrapModules`

`renderToPipeableStream` want a bootstrap script to do client side hydration. We
can simply put `./src/main.tsx` in `bootstrapScriptModules` in dev mode since
Vite will transpile it on the fly for us. However, in production mode, we need
to use the correct path to the bundled JS. That was done in `server.ts` by
manually looks for the compiled `./dist/client/assets/main-*.js`.

### CSS is not loaded in SSR build

If you use CSS-in-JS libs, then your CSS is render via JS, and you won't see
this problem. However, if you import CSS file in the JS file, then the
production build won't load any CSS. It's because there are no HTML file for
Vite to inject them. The work around is to use `vite-plugin-css-injected-by-js`
to bundle CSS into JS file.

[vite-ssr]: https://vitejs.dev/guide/ssr.html
[ssr-react]: https://github.com/vitejs/vite-plugin-react/tree/main/playground/ssr-react
[rr]: https://github.com/facebook/react/blob/main/packages/react-refresh/src/ReactFreshRuntime.js#L553
[preamble]: https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/src/fast-refresh.ts#L30

## Implemented:
- Cursor-based pagination by id
- Infinite scroll
- JWT(cookies)

## Planning:
- Cursor should have been used as createdAt instead of id
- Sort posts with ascending order or descending
- Bidirectional infinite scrolling

## Incomplete:
- MDX
- refresh token and access token
- Invalidation and optimistic updates using useMutation
- File upload(graphql?? express??)
- First subscription(probably EventStream, not sure)
- Dockerize the app
- Query Key Factory

<!-- This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules. -->
<!---->
<!-- Currently, two official plugins are available: -->
<!---->
<!-- - [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh -->
<!-- - [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh -->
<!---->
<!-- ## Expanding the ESLint configuration -->
<!---->
<!-- If you are developing a production application, we recommend updating the configuration to enable type aware lint rules: -->
<!---->
<!-- - Configure the top-level `parserOptions` property like this: -->
<!---->
<!-- ```js -->
<!-- export default { -->
<!--   // other rules... -->
<!--   parserOptions: { -->
<!--     ecmaVersion: 'latest', -->
<!--     sourceType: 'module', -->
<!--     project: ['./tsconfig.json', './tsconfig.node.json'], -->
<!--     tsconfigRootDir: __dirname, -->
<!--   }, -->
<!-- } -->
<!-- ``` -->
<!---->
<!-- - Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked` -->
<!-- - Optionally add `plugin:@typescript-eslint/stylistic-type-checked` -->
<!-- - Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list -->
