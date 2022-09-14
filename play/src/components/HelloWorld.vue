<template>
  <div>
    <button @click="flag = !flag">change</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'

const current = ref(0)

const flag = ref(false)

const logFlag = () => {
  console.log('flag', flag.value)
}
watchEffect(() => {
  logFlag()
  console.log('current', current.value)
})

</script>

<style scoped>
</style>