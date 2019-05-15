import typescript from 'rollup-plugin-typescript';
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: './src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
    },
    external: ['vue'],
    plugins: [
      typescript(),
      terser(),
    ]
  },
  {
    input: './src/vueInstall.js',
    output: {
      file: 'dist/vue.js',
      format: 'cjs',
    },
    external: ['vue'],
    plugins: [
      typescript(),
      // terser(),
    ]
  }
]
