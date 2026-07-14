<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { CatalogEntry, InstalledApp, UpdateProgress } from '../../shared/types'
import StorePanel from './components/StorePanel.vue'
import SettingsScreen from './components/SettingsScreen.vue'

// This same renderer is loaded twice: as the launcher home, and (role=overlay) as the tiny
// always-on-top Home button floating over a running app.
const isOverlay = new URLSearchParams(window.location.search).get('role') === 'overlay'
if (isOverlay) {
  document.documentElement.style.background = 'transparent'
  document.body.style.background = 'transparent'
}

const installed = ref<InstalledApp[]>([])
const catalog = ref<CatalogEntry[]>([])
// Settings is its own full-screen "app" screen (like launching an app); Store stays a modal.
const view = ref<'home' | 'settings'>('home')
const overlay = ref<'none' | 'store'>('none')
const progress = ref<Record<string, UpdateProgress>>({})
const toasts = ref<{ id: number; text: string }[]>([])

let toastSeq = 0
const disposers: Array<() => void> = []

function nameOf(id: string): string {
  return catalog.value.find((c) => c.id === id)?.name ?? id
}

function toast(text: string): void {
  const id = ++toastSeq
  toasts.value.push({ id, text })
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, 4000)
}

async function refresh(): Promise<void> {
  installed.value = await window.launcher.listInstalled()
  catalog.value = await window.launcher.checkForUpdates()
}

async function launch(id: string, query?: string): Promise<void> {
  await window.launcher.launchApp(id, query)
}

async function goHome(): Promise<void> {
  await window.launcher.goHome()
}

async function install(id: string): Promise<void> {
  try {
    await window.launcher.installOrUpdate(id)
    toast(`${nameOf(id)} updated`)
  } catch (err) {
    toast(`Update failed: ${err instanceof Error ? err.message : String(err)}`)
  } finally {
    await refresh()
  }
}

onMounted(async () => {
  if (isOverlay) return
  disposers.push(
    window.launcher.onProgress((p) => {
      progress.value = { ...progress.value, [p.id]: p }
      if (p.phase === 'done' || p.phase === 'error') void refresh()
    })
  )
  disposers.push(
    window.launcher.onAutoUpdated((ids) => {
      toast(`Updated ${ids.map(nameOf).join(', ')}`)
      void refresh()
    })
  )
  await refresh()
})

onUnmounted(() => disposers.forEach((d) => d()))
</script>

<template>
  <!-- Overlay role: a small Home notch tab hanging from the top edge, filling its overlay view. -->
  <button v-if="isOverlay" class="home-notch" title="Home" @click="goHome">⌂</button>

  <!-- Full-screen Settings "app" — covers the home, like a launched app. -->
  <SettingsScreen v-else-if="view === 'settings'" @home="view = 'home'" />

  <!-- Launcher home screen -->
  <div v-else class="home">
    <header class="home-header">
      <div class="brand">🎯 pi-darts</div>
      <div class="tools">
        <button @click="refresh">Refresh</button>
        <button @click="overlay = 'store'">Store</button>
      </div>
    </header>

    <main class="grid">
      <button
        v-for="app in installed"
        :key="app.id"
        class="tile"
        @click="launch(app.id, app.query)"
      >
        <img class="tile-icon" :src="`piapp://${app.id}/${app.icon}`" alt="" />
        <span class="tile-name">{{ app.name ?? nameOf(app.id) }}</span>
      </button>

      <!-- Built-in Settings tile: no piapp icon, so a gear glyph stands in. Always last. -->
      <button class="tile" @click="view = 'settings'">
        <span class="tile-icon tile-icon--glyph">⚙️</span>
        <span class="tile-name">Settings</span>
      </button>

      <p v-if="!installed.length" class="empty">No apps installed yet — open the Store.</p>
    </main>

    <StorePanel
      v-if="overlay === 'store'"
      :catalog="catalog"
      :progress="progress"
      @install="install"
      @refresh="refresh"
      @close="overlay = 'none'"
    />

    <div class="toasts">
      <div v-for="t in toasts" :key="t.id" class="toast">{{ t.text }}</div>
    </div>
  </div>
</template>

<style scoped>
.home-notch {
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 0;
  /* tab hanging from the top edge: only the bottom corners are rounded */
  border-radius: 0 0 16px 16px;
  font-size: 18px;
  line-height: 1;
  color: #062c33;
  background: var(--accent);
  border: none;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
  opacity: 0.85;
}

.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.tools {
  display: flex;
  gap: 10px;
}

.grid {
  flex: 1;
  display: grid;
  /* Springboard-style: icon-sized cells, evenly spaced, more per row. */
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  grid-auto-rows: min-content;
  gap: 28px 12px;
  justify-items: center;
  align-content: start;
  overflow-y: auto;
}

.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0;
  /* No card chrome — the icon itself is the affordance, iPhone-style. */
  background: none;
  border: none;
}

.tile-icon {
  width: 104px;
  height: 104px;
  border-radius: 24px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.45);
}

/* Built-in tiles have no image asset: render a glyph on the same rounded-square canvas. */
.tile-icon--glyph {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52px;
  line-height: 1;
  background: var(--panel-2);
}

.tile-name {
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  color: var(--text);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty {
  color: var(--muted);
}

.toasts {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}

.toast {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}
</style>
