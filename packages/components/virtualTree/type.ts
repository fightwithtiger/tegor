import { Ref } from "vue"

export interface NodeItem {
  id: number
  name: string
  children: NodeItem[]
  isLeaf?: boolean
  depth?: number
  parentId?: number
  isDelete?: boolean
  isActive?: boolean
  index?: number | string
}

export type VirtualTreeAction = 'expand' | 'select' | 'none' | 'pick_up'

export interface VirtualTreeStore {
  currentAction: Ref<VirtualTreeAction>
  currentNode: Ref<NodeItem | null>
  loadMore: (() => any) | null
  setLoadMoreFn: (fn: (() => any) | null) => void
}
