<template>
  <div>{{msg}}</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const msg = ref('hello foo')
</script>

<style scoped>
</style>