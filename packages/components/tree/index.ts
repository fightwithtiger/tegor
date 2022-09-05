import Tree from './components/Tree.vue'
import { App } from 'vue'
// import { SFCWithInstall } from '@tegor-ui/share'

Tree.install = (app: App): void => {
  app.component(Tree.name, Tree)
}

const _Tree = Tree as any

export default _Tree
export const TGTree = _Tree

export * from './type'