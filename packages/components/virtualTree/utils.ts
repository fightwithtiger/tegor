import { NodeItem } from "./type"

export function markDelte(parentId: number | string, rootId: number | string, leafs: NodeItem[], depth: number) {
  const children = leafs.filter(i => {
    let flag = i.parentId === parentId && i.rootId === rootId && i.depth === depth + 1
    return flag
  })
  for(let leaf of children) {
    // const idx = leafs.findIndex(i => {
    //   return i.parentId === leaf.parentId && i.rootId === leaf.rootId && i.depth === leaf.depth
    // })
    // if(idx === -1) {
    //   continue
    // }
    if(leaf.isDelete) {
      continue
    }
    leaf.isDelete = true
    markDelte(leaf.id, rootId, leafs, depth + 1)
  }
}

export function flatten(leafs: NodeItem[], depth: number = 0, parentId: number | string | null, node: NodeItem | null) {
  const list: NodeItem[] = []
  for(let i=0; i<leafs.length; i++) {
    const leaf = leafs[i]
    leaf.rootId = depth === 0 ? leaf.id : node?.rootId
    leaf.parentId = parentId
    let arr: NodeItem[] = []
    if(leaf.children && leaf.children.length > 0) {
      leaf.isActive = true
      arr = flatten(leaf.children, depth + 1, leaf.id, leaf)
    }

    leaf.depth = depth
    leaf.isDelete = false

    list.push(leaf, ...arr)

  }

  return list
}

export function deepClone(obj: any) {
  if(typeof obj !== 'object') {
    return
  }

  const tar: any = Array.isArray(obj) ? [] : {}
  for(let key in obj) {
    const value = obj[key]
    if(typeof value === 'object') {
      tar[key] = deepClone(value)
    }else{
      tar[key] = value
    }
  }

  return tar
}