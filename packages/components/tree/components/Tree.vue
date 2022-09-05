<template>
  <div>
    <Leaf :uid="uid" v-for="item of data" :key="item.id" :data="item" :NodeComp="NodeComp" v-bind="$attrs" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted, watchEffect } from 'vue'
import Leaf from './Leaf.vue';
import { guid, useTreeStore, removeTreeStore } from '../composable'
import { LeafNode } from '../type'
import Node from './Node.vue'

type TreeProps = {
  data: LeafNode[]
  loadMore?: (() => any) | null
  NodeComp?: any
}

const props = withDefaults(defineProps<TreeProps>(), {
  data: () => ([]),
  loadMore: null,
  NodeComp: Node
})

const emits = defineEmits(['action'])

const uid = ref(guid())

const { currentAction, currentNode, setLoadMoreFn } = useTreeStore(uid.value)

setLoadMoreFn(props.loadMore)

onUnmounted(() => {
  removeTreeStore(uid.value)
})

watchEffect(() => {
  emits('action', currentAction.value, currentNode.value)
})


</script>

<style scoped>
</style>
