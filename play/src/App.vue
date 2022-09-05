<script setup lang="ts">
import {Foo, TGTree} from 'tegor-ui'
import { ref } from 'vue'
const data: any[] = []
const root = 60
const children = 200
const base = 100
for (let i = 0; i < root; i++) {
  data.push({
    id: `${i+1}`,
    name: `test-${i+1}`,
    children: []
  });
  for (let j = 0; j < children; j++) {
    data[i].children.push({
      id: `${i+1}-${j}`,
      name: `test-${i+1}-${j}`,
      children: []
    });
    for (let k = 0; k < base; k++) {
      data[i].children[j].children.push({
        id: `${i+1}-${j}-${k}`,
        name: `test-${i+1}-${j}-${k}`
      });
    }
  }
}

const raw = ref(data)

const loadMore = () => {
  console.log('--------load data ------------')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([{
        id: Date.now(),
        name: 'aaaaaaa',
        children: [],
        // isLeaf: true
      }])
    }, 600)
  })
}

const handleAction = (action: any, payload: any) => {
  console.log(action, payload)
}

const sayHello = (data: any) => {
  console.log('hello', data)
}
</script>

<template>
  <div>
    <!-- <Foo /> -->
    <TGTree :data="raw" @action="handleAction"/>
  </div>
</template>

<style scoped>

</style>
