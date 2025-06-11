<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-xl">
      <h4 class="text-h4 text-weight-bold">Cálculo de Prestaciones Laborales</h4>
      <div class="row q-gutter-sm">
        <q-btn
          color="secondary"
          icon="refresh"
          label="Actualizar Datos"
          @click="refreshAllTabs"
          outline
        />
        <q-btn
          color="primary"
          icon="add"
          label="Agregar Prestación"
          @click="showAddPrestacionDialog = true"
        />
      </div>
    </div>

    <div class="w-180 q-mb-lg bg-[#eeeeee] q-pa-sm rounded-xl">
      <q-btn-toggle
        v-model="tab"
        spread
        rounded
        unelevated
        toggle-color="primary"
        color="grey-3"
        text-color="grey-8"
        :options="[
          { label: 'Calcular prestaciones', value: 'calcular' },
          { label: 'Historial de Cálculos', value: 'historial' },
          { label: 'Configuración', value: 'configuracion' },
        ]"
        style="width: 100%"
        no-caps
      />
    </div>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="calcular">
        <CalculoPrestacionesTab ref="historialTab" />
      </q-tab-panel>

      <q-tab-panel name="historial">
        <HistorialCalculosTab ref="historialComponent" />
      </q-tab-panel>

      <q-tab-panel name="configuracion">
        <ConfiguracionPrestacionesTab />
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="showAddPrestacionDialog">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Agregar Nueva Prestación</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            outlined
            v-model="newPrestacion.nombre"
            label="Nombre de la Prestación"
            class="q-mb-sm"
          />
          <q-select
            outlined
            v-model="newPrestacion.tipo"
            :options="['Ingreso', 'Deducción', 'Aporte Patronal']"
            label="Tipo"
            class="q-mb-sm"
          />
          <q-input
            outlined
            v-model="newPrestacion.valor"
            label="Valor"
            type="number"
            step="0.01"
            class="q-mb-sm"
          />
          <q-input outlined v-model="newPrestacion.unidad" label="Unidad" class="q-mb-sm" />
          <q-checkbox v-model="newPrestacion.activo" label="Activo" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Agregar" color="primary" @click="addPrestacion" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import CalculoPrestacionesTab from 'src/components/CalculoPrestacionesTab.vue'
import HistorialCalculosTab from 'src/components/HistorialCalculosTab.vue'
import ConfiguracionPrestacionesTab from 'src/components/ConfiguracionPrestacionesTab.vue'

const tab = ref('calcular')
const historialComponent = ref(null)

const refreshAllTabs = () => {
  // Forzar recarga del historial si el componente está disponible
  if (historialComponent.value && historialComponent.value.reloadHistory) {
    historialComponent.value.reloadHistory()
  }

  // Mostrar notificación de actualización
  console.log('Datos actualizados')
}

const showAddPrestacionDialog = ref(false)
const newPrestacion = ref({
  nombre: '',
  tipo: '',
  valor: null,
  unidad: '',
  activo: true,
})

// Cargar prestaciones desde localStorage
const loadPrestaciones = () => {
  const saved = localStorage.getItem('prestaciones')
  return saved ? JSON.parse(saved) : []
}

// Guardar prestaciones en localStorage
const savePrestaciones = (prestaciones) => {
  localStorage.setItem('prestaciones', JSON.stringify(prestaciones))
}

const addPrestacion = () => {
  const prestaciones = loadPrestaciones()
  prestaciones.push({ ...newPrestacion.value, id: Date.now() })
  savePrestaciones(prestaciones)

  showAddPrestacionDialog.value = false
  newPrestacion.value = {
    nombre: '',
    tipo: '',
    valor: null,
    unidad: '',
    activo: true,
  }
}
</script>
