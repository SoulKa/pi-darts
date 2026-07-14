<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { LauncherSettings } from '../../../shared/types'

defineEmits<{ close: [] }>()

const settings = ref<LauncherSettings>({ autoUpdateOnLaunch: true, boardServerUrl: '' })
const saved = ref(false)

onMounted(async () => {
  settings.value = await window.launcher.getSettings()
})

async function save(): Promise<void> {
  settings.value = await window.launcher.setSettings({
    autoUpdateOnLaunch: settings.value.autoUpdateOnLaunch,
    boardServerUrl: settings.value.boardServerUrl.trim(),
  })
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}
</script>

<template>
  <div class="scrim" @click.self="$emit('close')">
    <section class="panel">
      <header class="head">
        <h2>Settings</h2>
        <button @click="$emit('close')">Close</button>
      </header>

      <div class="body">
        <label class="field">
          <span class="label">Server host (for the board app)</span>
          <input
            v-model="settings.boardServerUrl"
            type="text"
            placeholder="e.g. 192.168.1.20:3000"
          />
        </label>

        <label class="toggle">
          <input v-model="settings.autoUpdateOnLaunch" type="checkbox" />
          <span>Auto-update apps on launch</span>
        </label>

        <div class="actions">
          <button class="primary" @click="save">Save</button>
          <span v-if="saved" class="saved">Saved ✓</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.panel {
  width: min(520px, 92vw);
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.head h2 {
  margin: 0;
  font-size: 20px;
}

.body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  color: var(--muted);
  font-size: 14px;
}

input[type='text'] {
  font: inherit;
  color: var(--text);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  min-height: 44px;
  padding: 0 14px;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle input {
  width: 22px;
  height: 22px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.saved {
  color: var(--accent);
}
</style>
