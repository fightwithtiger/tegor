<template>
  <component :is="NodeComp" v-bind="$attrs" :data="data" v-model:showSubTree="showSubTree" :loading="loading" @selectNode="select"></component>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { NodeItem } from '../type';
import Node from './Node.vue'
import { useVirtualTreeStore, ACTIONS } from '../composable'

type Props = {
  data: NodeItem | null
  uid: string
  NodeComp?: any
}

const props = withDefaults(defineProps<Props>(), {
  data: null,
  uid: '',
  NodeComp: Node
})

const { currentNode, currentAction, loadMore } = useVirtualTreeStore(props.uid)


const showSubTree = ref(props.data?.isActive || false)

watch(() => props.data, (val) => {
  showSubTree.value = val?.isActive || false
}, {
  immediate: true
})


const loading = ref(false)

watch(showSubTree, async (val) => {
  let isActive = false
  let children = props.data?.children || []
  if(val) {
    if(loadMore && children.length === 0) {
      if(loading.value) {
        return
      }
      loading.value = true
      children = await loadMore(props.data)
      loading.value = false
    }
    isActive = true
    currentAction.value = ACTIONS.EXPAND
  }else {
    isActive = false
    currentAction.value = ACTIONS.PICK_UP
  }
  props.data!.isActive = isActive
  props.data!.children = children
  currentNode.value = props.data!
})

const select = (node: NodeItem | null) => {
  currentAction.value = ACTIONS.SELECT
  currentNode.value = node!
}


</script>

<style scoped>
</style>