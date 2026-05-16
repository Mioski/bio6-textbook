<template>
  <div class="bio6-app">
    <router-view />
  </div>
</template>

<script setup>
import { provide, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ContentService from '../../services/bio6/ContentService.js'
import NavigationService from '../../services/bio6/NavigationService.js'
import ProgressService from '../../services/bio6/ProgressService.js'
import ChainService from '../../services/bio6/ChainService.js'

const router = useRouter()
NavigationService.setRouter(router)

provide('ContentService', ContentService)
provide('NavigationService', NavigationService)
provide('ProgressService', ProgressService)
provide('ChainService', ChainService)
</script>

<style scoped>
.bio6-app {
  min-height: 100vh;
  background: var(--bg);
}
</style>
