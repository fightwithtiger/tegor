<template>
  <div v-if="data" class="leaf">
    <div v-for="_ of data.depth" class="indent item"></div>
    <div class="item" @click.stop="handleSpread">{{ guideSymbol }}</div>
    &nbsp;&nbsp;
    <div class="item" @click.stop="handleSelect(data)">{{ data.name }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { NodeItem } from '../type';

type Props = {
  data: NodeItem | null
  showSubTree: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: null,
  showSubTree: false,
  loading: false
})

const emits = defineEmits(['update:showSubTree', 'selectNode'])

const guideSymbol = computed(() => {
  if (props.loading) {
    return '🔘'
  }

  return props.showSubTree ? '👆' : '👇'
})

const handleSpread = () => {
  if (!props.data?.hasSub || props.loading) {
    return
  }
  emits('update:showSubTree', !props.showSubTree)
}

const handleSelect = (data: NodeItem | null) => {
  emits('selectNode', data)
}
</script>

<style scoped>
.leaf {
  padding: 6px 10px;
  cursor: pointer;
  text-align: left;
  display: flex;

}
.item{
  flex-shrink: 0;
}

.indent {
  display: inline-block;
  width: 12px;
  height: 100%;
}
</style>