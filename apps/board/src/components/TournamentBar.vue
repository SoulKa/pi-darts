<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTournamentClient } from '../game/tournamentClient'

const client = useTournamentClient()
const open = ref(false)
const host = ref('')
const step = ref<'host' | 'tournament' | 'floor'>('host')
const { connected, tournaments, floors, errorMsg } = client
const hostLabel = computed(() => host.value || 'Host IP')

function key(value: string) {
  if (value === 'back') host.value = host.value.slice(0, -1)
  else if (value === 'clear') host.value = ''
  else host.value += value
}
function connect() {
  client.connect(host.value)
  step.value = 'tournament'
}
async function chooseTournament(id: string) {
  await client.selectTournament(id)
  step.value = 'floor'
}
function chooseFloor(id: string) {
  client.selectFloor(id)
  open.value = false
}
</script>

<template>
  <button class="join" @click="open = true">Tournament connection</button>
  <div v-if="open" class="wizard">
    <section class="card">
      <header>
        <button
          v-if="step !== 'host'"
          class="back"
          @click="step = step === 'floor' ? 'tournament' : 'host'"
        >
          Back
        </button>
        <h1>🎯 Join tournament</h1>
      </header>
      <template v-if="step === 'host'">
        <p>Enter the tournament server IP</p>
        <output>{{ hostLabel }}</output>
        <div class="pad">
          <button
            v-for="n in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0']"
            :key="n"
            @click="key(n)"
          >
            {{ n }}</button
          ><button @click="key('back')">⌫</button><button @click="key('clear')">Clear</button>
        </div>
        <button class="primary" :disabled="!host" @click="connect">Connect</button>
      </template>
      <template v-else-if="step === 'tournament'">
        <p v-if="!connected">Connecting…</p>
        <p v-else>Select tournament</p>
        <button v-for="t in tournaments" :key="t.id" class="choice" @click="chooseTournament(t.id)">
          {{ t.name }}
        </button>
      </template>
      <template v-else>
        <p>Select this board's floor</p>
        <button
          v-for="floor in floors"
          :key="floor.id"
          class="choice"
          @click="chooseFloor(floor.id)"
        >
          {{ floor.name }}
        </button>
      </template>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      <button class="cancel" @click="open = false">Cancel</button>
    </section>
  </div>
</template>

<style scoped>
.join,
.primary,
.choice,
.cancel,
.back,
.pad button {
  min-height: 64px;
  border: 0;
  border-radius: 16px;
  font: 800 24px inherit;
  cursor: pointer;
}
.join {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 10;
  padding: 16px 22px;
  background: #334155;
  color: #e2e8f0;
}
.wizard {
  position: absolute;
  inset: 0;
  z-index: 30;
  display: flex;
  padding: 32px;
  background: #060a14;
}
.card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;
  border-radius: 24px;
  background: linear-gradient(160deg, #172033, #0e1524);
  color: #e2e8f0;
}
.card header {
  display: flex;
  align-items: center;
  gap: 18px;
}
.card h1 {
  font-size: 38px;
}
.card p {
  font-size: 22px;
  color: #94a3b8;
}
.card output {
  padding: 18px;
  border-radius: 14px;
  background: #020617;
  font-size: 32px;
  text-align: center;
}
.pad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.pad button,
.choice {
  background: #334155;
  color: #f1f5f9;
}
.primary {
  background: linear-gradient(180deg, #22d3ee, #0891b2);
  color: #04283b;
}
.choice {
  min-height: 76px;
  text-align: left;
  padding: 20px;
}
.cancel,
.back {
  background: transparent;
  color: #94a3b8;
}
.error {
  color: #f87171 !important;
}
</style>
