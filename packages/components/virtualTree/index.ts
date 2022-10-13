export * from './type'
export * from './event'

import VirtualTree from './components/VirtualTree.vue'
import { App } from 'vue'
import { SFCWithInstall } from '@tegor/share'

VirtualTree.install = (app: App): void => {
  app.component(VirtualTree.name || 'TGVirtualTree', VirtualTree)
}

const _VirtualTree = VirtualTree as SFCWithInstall<typeof VirtualTree>

export default _VirtualTree
export const TGVirtualTree = _VirtualTree

export * from './type'
export * from './event'