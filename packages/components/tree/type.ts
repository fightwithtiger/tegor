import { Ref } from "vue"

export interface LeafNode {
  id: number
  name: string
  children: LeafNode[]
  isLeaf?: boolean
}

export type TreeAction = 'expand' | 'select' | 'none'

export interface TreeStore {
  currentAction: Ref<TreeAction>
  currentNode: Ref<LeafNode | null>
  loadMore: (() => any) | null
  setLoadMoreFn: (fn: (() => any) | null) => void
}
