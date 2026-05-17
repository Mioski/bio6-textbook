<template>
  <div v-if="src" class="illustration-wrap">
    <img :src="src" :alt="alt" class="illustration-img" loading="lazy"/>
    <p v-if="caption" class="illustration-caption">{{ caption }}</p>
  </div>
</template>

<script setup>
defineProps({
  src:     { type: String, required: true },
  alt:     { type: String, default: '' },
  caption: { type: String, default: '' }
})
</script>

<style scoped>
.illustration-wrap {
  margin: 16px 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.illustration-img {
  width: 100%;
  height: auto;
  display: block;
}

.illustration-caption {
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  padding: 8px 12px;
  border-top: 1px solid var(--border);
}
</style>
