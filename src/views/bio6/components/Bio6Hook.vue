<template>
  <div class="hook-block">
    <div class="hook-text">{{ text }}</div>
  </div>
</template>

<script setup>
defineProps({ text: String })
</script>

<style scoped>
.hook-block {
  background: linear-gradient(135deg, #1a1f2e 0%, #161b22 100%);
  border-left: 3px solid var(--accent-gold);
  border-radius: 0 var(--radius) var(--radius) 0;
  padding: 16px 20px;
  margin-bottom: 20px;
}

.hook-text {
  font-size: 16px;
  line-height: 1.6;
  color: var(--text);
  font-style: italic;
}
</style>
