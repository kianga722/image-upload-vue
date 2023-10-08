<script setup lang="ts">
  import { store } from '../store/store'
  import { APP_TITLE } from '../utils/CONSTANTS'
</script>

<template>
  <header>
    <h1>{{APP_TITLE}}</h1>

      <button 
        @click="store.handleModalOpen"
      >Upload</button>
  </header>
</template>

<style scoped>
header {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
}

button {
    padding: 5px 10px;
    
    border: 1px solid #000;
    border-radius: 4px;
    cursor: pointer;
}
</style>