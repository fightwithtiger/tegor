<template>
  <div ref="contentRef" @scroll="handleScroll" :class="['leaf-list', 'fix-height']"
    :style="{ 'height': leafsHeight ? `${leafsHeight}px`: 'auto' }">
    <div ref="leafRef" class="list">
      <Leaf :data-index="item.index" :currentNode="currentNode" :eventBus="eventBus" v-for="(item, index) of visibleData" :key="item.parentId ? `${index}-${item.id}-${item.parentId}-${Date.now()}` : `${index}-${item.id}-${Date.now()}`" v-bind="$attrs" :uid="uid" :data="item" :NodeComp="NodeComp" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onUnmounted, onMounted, toRaw } from 'vue'
import { NodeItem } from '../type'
import { flatten, markDelte } from '../utils'
import Leaf from './Leaf.vue'
import Node from './Node.vue'
import { useVirtualTreeStore, removeVirtualTreeStore, guid, ACTIONS } from '../composable'
import { deepClone } from '../utils'
import { createEventBus } from '../event'

type Props = {
  data: NodeItem[]
  loadMore?: (() => any) | null
  NodeComp?: any
  height?: number
  count?: number
  auto?: boolean
}

const eventBus = createEventBus()

const props = withDefaults(defineProps<Props>(), {
  data: () => ([]),
  loadMore: null,
  NodeComp: Node,
  height: 0,
  count: 10,
  auto: false,
})

const emits = defineEmits(['action'])

const leafRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()

const list = ref<NodeItem[]>([...props.data])
const startIndex = ref(0)

const leafsHeight = ref(0)

const visibleData = computed(() => {
  if(props.height === 0) {
    return list.value.slice()
  }
  const endIndex = startIndex.value + props.count
  return list.value.slice(startIndex.value, endIndex)
})

const uid = ref(guid())
const { currentAction, currentNode, setLoadMoreFn } = useVirtualTreeStore(uid.value)

setLoadMoreFn(props.loadMore)

watch(() => props.height, (val) => {
  if (val !== 0) {
    leafsHeight.value = val
  }
}, {
  immediate: true
})

let worker: any = null
onMounted(() => {
  worker = new Worker(new URL('../worker.js', import.meta.url), { type: 'module' })
})

onUnmounted(() => {
  worker && worker.terminate()
  removeVirtualTreeStore(uid.value)
})

watch(() => props.data, (val) => {
  if(props.auto) {
    val = flatten(val, 0, null, null).map((i, index) => ({
      ...i,
      index,
    }))
  }else {
    val = val.map((i, index) => ({
      ...i,
      depth: 0,
      index,
      rootId: i.id,
    }))
  }
  
  list.value = val
  startIndex.value = 0
}, {
  immediate: true
})

watch([currentAction, currentNode], ([action, node]) => {
  if(action === ACTIONS.NONE) {
    return
  }
  switch (action) {
    case ACTIONS.EXPAND:
      expandLeafs(currentNode.value as NodeItem)
      break
    case ACTIONS.PICK_UP:
      pickUp(currentNode.value as NodeItem)
      break
    default:
      break
  }
  emits('action', action, node)
})

const judgeReachBottom = () => {
  try{
    const scrollTop = contentRef.value?.scrollTop || 0
    const listHeight = contentRef.value?.children[0].getBoundingClientRect().height || 0
    const contentHeight = contentRef.value?.getBoundingClientRect().height || 0

    if(listHeight < contentHeight) {
      return false
    }

    return scrollTop + contentHeight >= listHeight ? true : false
  }catch(e) {
    console.log(e)
    return true
  }
}

const deleteLeafs = (parentId: number | string, rootId: number | string, leafs: NodeItem[], depth: number): NodeItem[] => {
  markDelte(parentId, rootId, leafs, depth)
  return leafs.filter(i => !i.isDelete)
}

const addTag = (nodes: NodeItem[], node: NodeItem) => {
  const depth = node.depth
  nodes.forEach(i => {
    i.depth = depth! + 1
    i.parentId = node.id
    i.rootId = node.rootId
    i.isDelete = false
    i.isActive = false
  })
  return nodes
}

const expandLeafs = (node: NodeItem) => {
  const idx = list.value.findIndex(i => (i.id === node.id && i.rootId === node.rootId && i.parentId === node.parentId && i.depth === node.depth ))

  if(idx === -1) {
    return
  }

  const leafs = addTag(node.children || [], node)
  const arr = [...list.value.slice(0, idx), node, ...leafs, ...list.value.slice(idx + 1)]
  
  arr.forEach((i, index) => {
    i.index = index
  })
  list.value = arr

  if(judgeReachBottom()) {
    const leaf = leafRef.value!.children[0]
    const leafHeight = leaf.getBoundingClientRect().height
    const scrollTop = contentRef.value?.scrollTop || 0
    contentRef.value?.scrollTo(0, scrollTop - leafHeight)
    // contentRef.value?.scrollTo(0, scrollTop + leafHeight)
  }
}

const arrayToRaw = (arr: any[]) => {
  const r = toRaw(arr)
  for(let i=0; i<r.length; i++) {
    r[i] = toRaw(r[i])
    if(r[i].children) {
      r[i].children = arrayToRaw(r[i].children)
    }
  }

  return r
}


const pickUp = (node: NodeItem) => {
  const leafs = arrayToRaw(list.value)
  worker.postMessage({
    type: 'del',
    data: {
      parentId : node.id,
      rootId: node.rootId!,
      leafs,
      depth: node.depth!
    }
  })

  worker.onmessage = function (e: any) {
    const res = e.data
    const { type, data } = res
    if(type !== 'del') {
      return
    }

    // list.value = deleteLeafs(node.id, node.rootId!, list.value, node.depth!).map((i, index) => ({...i, index}))
    list.value = data.map((i: any, index: number) => ({...i, index}))
    if(list.value.length - startIndex.value - 1 < props.count) {
      startIndex.value = list.value.length - props.count - 1 < 0 ? 0 : list.value.length - props.count - 1
    }
    eventBus.$emit(`pick_up_${currentNode.value!.index}`, null)

    if(judgeReachBottom()) {
      const leaf = leafRef.value!.children[0]
      const leafHeight = leaf.getBoundingClientRect().height
      const scrollTop = contentRef.value?.scrollTop || 0
      contentRef.value?.scrollTo(0, scrollTop - leafHeight)
      contentRef.value?.scrollTo(0, scrollTop + leafHeight)
    }
  }

}

const updateVisibleData = (scrollTop: number, direction: string) => {
  if (leafRef.value?.children && leafRef.value.children.length > 0) {
    const leaf = leafRef.value.children[0]
    const leafHeight = leaf.getBoundingClientRect().height
    const leafIndex = leaf.getAttribute('data-index') || 0

    if (direction === 'down') {
      if (scrollTop > leafHeight * 2) {
        if (list.value.length - startIndex.value > props.count) {
          startIndex.value = +leafIndex + 1
          contentRef.value?.scrollTo(0, scrollTop - leafHeight)
        }
      }
    } else {
      if (scrollTop <= leafHeight && scrollTop >= 0) {
        if ((startIndex.value > 0 && scrollTop !== 0) || startIndex.value === 1) {
          startIndex.value = +leafIndex - 1
        }else if(startIndex.value > 1 && scrollTop === 0) {
          startIndex.value = +leafIndex - 1
          contentRef.value?.scrollTo(0, leafHeight)
        }
      }
    }
  }
}

const oldScrollTop = ref(0)
const direction = ref('')
const handleScroll = (e: any) => {
  if(props.height === 0) {
    return
  }
  const scrollTop = e.target.scrollTop || 0
  if(scrollTop - oldScrollTop.value > 0) {
    direction.value = 'down'
  }else if(scrollTop - oldScrollTop.value < 0) {
    direction.value = 'up'
  }
  oldScrollTop.value = scrollTop

  updateVisibleData(scrollTop, direction.value)
}


</script>

<style scoped>
.fix-height {
  overflow-y: auto;
}

</style>