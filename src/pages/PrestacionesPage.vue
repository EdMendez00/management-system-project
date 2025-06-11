<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <h4 class="text-h4">Cálculo de Prestaciones Laborales</h4>
      <q-btn color="primary" icon="add" label="Agregar Prestación" @click="showAddPrestacionDialog = true" />
    </div>

    <q-tabs
      v-model="tab"
      align="justify"
      narrow-indicator
      class="q-mb-md"
    >
      <q-tab name="calcular" label="Calcular prestaciones" />
      <q-tab name="historial" label="Historial de Cálculos" />
      <q-tab name="configuracion" label="Configuración" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="calcular">
        <CalculoPrestacionesTab />
      </q-tab-panel>

      <q-tab-panel name="historial">
        <HistorialCalculosTab />
      </q-tab-panel>

      <q-tab-panel name="configuracion">
        <ConfiguracionPrestacionesTab />
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="showAddPrestacionDialog">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Agregar Nueva Prestación</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>Complete los datos para agregar una nueva prestación o deducción.</p>
          <q-input outlined v-model="newPrestacion.nombre" label="Nombre" class="q-mb-sm" />
          <q-select outlined v-model="newPrestacion.tipo" :options="['Ingreso', 'Deducción', 'Aporte Patronal']" label="Tipo" class="q-mb-sm" />
          <q-input outlined v-model="newPrestacion.valor" label="Valor" type="number" class="q-mb-sm" />
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
import { ref } from 'vue';
import CalculoPrestacionesTab from 'src/components/CalculoPrestacionesTab.vue';
import HistorialCalculosTab from 'src/components/HistorialCalculosTab.vue';
import ConfiguracionPrestacionesTab from 'src/components/ConfiguracionPrestacionesTab.vue';

const tab = ref('calcular'); // Pestaña inicial

const showAddPrestacionDialog = ref(false);
const newPrestacion = ref({
  nombre: '',
  tipo: '',
  valor: null,
  unidad: '',
  activo: true,
});

// Lógica para agregar una nueva prestación (simulada por ahora)
const addPrestacion = () => {
  console.log('Nueva Prestación a agregar:', newPrestacion.value);
  // Aquí deberías enviar estos datos a tu backend o store
  showAddPrestacionDialog.value = false;
  // Resetear el formulario
  newPrestacion.value = {
    nombre: '',
    tipo: '',
    valor: null,
    unidad: '',
    activo: true,
  };
};
</script>

<style scoped>
/* Estilos específicos si los necesitas */
</style>