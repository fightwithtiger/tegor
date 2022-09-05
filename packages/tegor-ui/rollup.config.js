
import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2';
import vuePlugin from "rollup-plugin-vue"
import RollupPluginPostcss from 'rollup-plugin-postcss'
import Autoprefixer from 'autoprefixer'
import pkg from './package.json'

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
        file: resolve('./', pkg.module),
        format: 'es',
        name: 'tegor-ui',
      },
      {
        file: resolve('./', pkg.main),
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
        css: false,
        compileTemplate: true
      }),
      RollupPluginPostcss({ extract: true, plugins: [Autoprefixer] }),
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
