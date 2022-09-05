
import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2';
import vuePlugin from "rollup-plugin-vue"
import RollupPluginPostcss from 'rollup-plugin-postcss'
import Autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
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
      RollupPluginPostcss({
        extract: 'css/index.css',
        plugins: [
          Autoprefixer,
          cssnano(),
        ] 
      }),
      babel({
        exclude: 'node_modules/**',
        extensions,
      }),
      commonjs({ extensions }),
      // serve({
      //   contentBase: '',  //服务器启动的文件夹，默认是项目根目录，需要在该文件下创建index.html
      //   port: 8020   //端口号，默认10001
      // }),    
      // livereload('dist')
    ],
    external: ['vue']
  }
]

export default config
