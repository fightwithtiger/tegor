
import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2';
import vuePlugin from "rollup-plugin-vue"

const extensions = ['.ts', '.js', '.vue']

const overrides = {
  compilerOptions: { declaration: true }, // 是否创建 typescript 声明文件
  exclude: [ // 排除项
    'node_modules',
  ]
}

const resolve = (...args) => path.resolve(...args)

const config = [
  {
    input: resolve('./index.ts'),
    output: [
      {
        file: './dist/index.mjs',
        format: 'es',
        name: 'tegor-ui',
      },
      {
        file: './dist/index.cjs',
        format: 'cjs',
        name: 'tegor-ui',
      },
    ],
    plugins: [
      
      nodeResolve({
        extensions,
      }),
      typescript({
        tsconfigOverride: overrides
      }),
      vuePlugin({
        css: true,
        compileTemplate: true
      }),
      babel({
        exclude: 'node_modules/**',
        extensions,
      }),
      commonjs({ extensions }),
    ],
    external: ['vue']
  }
]

export default config