<template>
  <div class="text">{{msg}}</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const msg = ref('hello, foo')
</script>

<style scoped>
.text{
  color: blue;
  font-weight: bold;
}
</style>