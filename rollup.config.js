import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

// can't use nodeResolve for now -- https://github.com/TooTallNate/node-bindings/issues/54
// import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: './src/index.ts',
    output: {
      dir: 'dist',
      format: 'cjs',
    },
    plugins: [json(), typescript({ module: 'esnext' }), commonjs(), terser()],
  },
];
