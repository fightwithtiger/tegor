import { Ref } from "vue"

export interface NodeItem {
  id: number | string
  name: string
  children: NodeItem[]
  depth?: number
  parentId?: number | string | null
  rootId?: number | string
  isDelete?: boolean
  isActive?: boolean
  index?: number | string
  hasSub?: boolean
}

export type VirtualTreeAction = 'expand' | 'select' | 'none' | 'pick_up'

export interface VirtualTreeStore {
  currentAction: Ref<VirtualTreeAction>
  currentNode: Ref<NodeItem | null>
  loadMore: ((val?: any) => any) | null
  setLoadMoreFn: (fn: (() => any) | null) => void
}
