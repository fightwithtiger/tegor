import { NodeItem } from "./type"

export function markDelte(parentId: number, leafs: NodeItem[]) {
  const children = leafs.filter(i => i.parentId === parentId)
  children.forEach((leaf: NodeItem, idx: number) => {
    leaf.isDelete = true
    markDelte(leaf.id, leafs)
  })
}