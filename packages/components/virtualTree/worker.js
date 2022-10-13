self.onmessage = function (e) {
  const res = e.data
  const { type, data } = res
  console.log('wwwwwwwwwwww')
  if(type === 'del') {
    const { parentId, rootId, leafs, depth } = data
    const list = deleteLeafs(parentId, rootId, leafs, depth)
    self.postMessage({
      type: type,
      data: list
    })
  }
}

function deleteLeafs (parentId, rootId, leafs, depth) {
  markDelte(parentId, rootId, leafs, depth)
  return leafs.filter(i => !i.isDelete)
}

function markDelte(parentId, rootId, leafs, depth) {
  const children = leafs.filter(i => {
    let flag = i.parentId === parentId && i.rootId === rootId && i.depth === depth + 1
    return flag
  })
  for(let leaf of children) {
    const idx = leafs.findIndex(i => {
      return i.parentId === leaf.parentId && i.rootId === leaf.rootId && i.depth === leaf.depth
    })
    if(idx === -1) {
      continue
    }
    if(leaf.isDelete) {
      continue
    }
    leaf.isDelete = true
    markDelte(leaf.id, rootId, leafs, depth + 1)
  }
}