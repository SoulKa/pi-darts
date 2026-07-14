<script setup lang="ts">
import { computed } from 'vue'
import type { CatalogEntry, UpdateProgress } from '../../../shared/types'

const props = defineProps<{
  catalog: CatalogEntry[]
  progress: Record<string, UpdateProgress>
}>()
defineEmits<{ install: [id: string]; refresh: []; close: [] }>()

function busy(id: string): boolean {
  const p = props.progress[id]
  return !!p && p.phase !== 'done' && p.phase !== 'error'
}

function status(entry: CatalogEntry): string {
  const p = props.progress[entry.id]
  if (p && busy(entry.id)) {
    if (p.phase === 'download' && p.total) {
      return `Downloading ${Math.round((100 * (p.received ?? 0)) / p.total)}%`
    }
    return `${p.phase}…`
  }
  if (entry.updateAvailable) return `v${entry.installedVersion} → v${entry.availableVersion}`
  if (entry.installed) return `Installed v${entry.installedVersion}`
  if (entry.availableVersion) return `Available v${entry.availableVersion}`
  return 'Unavailable'
}

const actionLabel = (entry: CatalogEntry): string =>
  entry.updateAvailable ? 'Update' : entry.installed ? 'Installed' : 'Install'

const canAct = (entry: CatalogEntry): boolean =>
  !busy(entry.id) && (entry.updateAvailable || (!entry.installed && !!entry.availableVersion))

const sorted = computed(() => [...props.catalog].sort((a, b) => a.name.localeCompare(b.name)))
</script>

<template>
  <div class="scrim" @click.self="$emit('close')">
    <section class="panel">
      <header class="head">
        <h2>App Store</h2>
        <div class="head-tools">
          <button @click="$emit('refresh')">Check for updates</button>
          <button @click="$emit('close')">Close</button>
        </div>
      </header>

      <ul class="list">
        <li v-for="entry in sorted" :key="entry.id" class="row">
          <div class="info">
            <div class="name">{{ entry.name }}</div>
            <div class="desc">{{ entry.description }}</div>
            <div class="status">{{ status(entry) }}</div>
          </div>
          <button
            class="primary"
            :disabled="!canAct(entry)"
            @click="$emit('install', entry.id)"
          >
            {{ actionLabel(entry) }}
          </button>
        </li>
        <li v-if="!sorted.length" class="empty">No apps found in the latest release.</li>
      </ul>
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
  width: min(680px, 92vw);
  max-height: 86vh;
  display: flex;
  flex-direction: column;
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

.head-tools {
  display: flex;
  gap: 10px;
}

.list {
  list-style: none;
  margin: 0;
  padding: 8px;
  overflow-y: auto;
}

.row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 12px;
  border-bottom: 1px solid var(--border);
}

.row:last-child {
  border-bottom: none;
}

.info {
  flex: 1;
}

.name {
  font-size: 17px;
  font-weight: 600;
}

.desc {
  color: var(--muted);
  font-size: 14px;
}

.status {
  color: var(--accent);
  font-size: 13px;
  margin-top: 4px;
}

.empty {
  color: var(--muted);
  padding: 16px;
}
</style>
