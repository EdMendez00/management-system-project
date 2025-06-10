<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="border-b-4 border-[#F7BC20]">
      <q-toolbar class="h-23 bg-white text-black">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <div class="text-3xl ml-5 font-bold">Sistema de Gestión Empresarial</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-[#0250DC]">
      <q-list>
        <q-item-label
          header
          class="flex h-24 border-b-3 border-[#F7BC20] mb-20 justify-center items-center"
        >
          <q-img
            class="max-w-[200px] max-h-[60px] object-contain"
            src="../assets/[CITYPNG.COM]Walmart Horizontal White Logo Image PNG - 3000x3000 1.png"
          />
        </q-item-label>

        <EssentialLink
          class="text-white font-bold text-lg"
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Inicio',
    icon: 'home',
    link: '/',
  },
  {
    title: 'Empleados',
    icon: 'people',
    link: '/empleados',
  },
  {
    title: 'Prestaciones',
    icon: 'calculate',
    link: '/prestaciones',
  },
  {
    title: 'Ausencias',
    icon: 'calendar_today',
    link: '/ausencias',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
