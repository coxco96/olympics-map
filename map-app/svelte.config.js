// import adapter from '@sveltejs/adapter-vercel';

// /** @type {import('@sveltejs/adapter-vercel').Config} */
// const config = {
// 	kit: {
// 		adapter: adapter(),
// 	}
// };

// export default config;


import adapter from '@sveltejs/adapter-vercel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: {
			// Vite config here
			plugins: [
				// You can add other Vite plugins if needed
			],
			resolve: {
				// Use @rollup/plugin-node-resolve for module resolution
				plugins: [resolve()],
			},
			commonjs: {
				// Use @rollup/plugin-commonjs to handle CommonJS modules
				plugins: [commonjs()],
			}
		}
	}
};

export default config;