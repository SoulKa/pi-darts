<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="app">
    <header class="topbar">
      <span class="brand">🎯 Pi-Darts Console</span>
      <nav class="row">
        <RouterLink to="/admin">Admin</RouterLink>
      </nav>
    </header>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background: var(--panel);
  border-bottom: 1px solid var(--border);
}

.brand {
  font-weight: 700;
  letter-spacing: 0.02em;
}

.content {
  flex: 1;
  padding: 1.25rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}
</style>
