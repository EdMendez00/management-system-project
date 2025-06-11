<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Configuración de Prestaciones y Deducciones</div>
      <p>Administre las prestaciones y deducciones del sistema. Puede modificar los valores y agregar nuevas prestaciones.</p>
    </q-card-section>

    <q-card-section>
      <q-table
        :rows="configurations"
        :columns="columns"
        row-key="nombre"
        flat
        bordered
      >
        <template v-slot:body-cell-Valor="props">
          <q-td :props="props">
            {{ props.row.valor }} {{ props.row.unidad }}
          </q-td>
        </template>
        <template v-slot:body-cell-Estado="props">
          <q-td :props="props">
            <q-checkbox v-model="props.row.estado" disable />
          </q-td>
        </template>
        <template v-slot:body-cell-Acciones="props">
          <q-td :props="props">
            <q-btn icon="edit" flat round dense @click="editConfiguration(props.row)" />
            <q-btn icon="delete" flat round dense color="negative" @click="deleteConfiguration(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card-section>

    <q-dialog v-model="showEditConfigDialog">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Editar Configuración</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input outlined v-model="editingConfig.nombre" label="Nombre" disable class="q-mb-sm" />
          <q-select outlined v-model="editingConfig.tipo" :options="['Ingreso', 'Deducción', 'Aporte Patronal']" label="Tipo" class="q-mb-sm" />
          <q-input outlined v-model="editingConfig.valor" label="Valor" type="number" class="q-mb-sm" />
          <q-input outlined v-model="editingConfig.unidad" label="Unidad" class="q-mb-sm" />
          <q-checkbox v-model="editingConfig.estado" label="Activo" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="saveConfiguration" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const columns = [
  { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre' },
  { name: 'tipo', label: 'Tipo', align: 'left', field: 'tipo' },
  { name: 'Valor', label: 'Valor', align: 'left', field: row => `${row.valor} ${row.unidad}` }, // Columna combinada
  { name: 'unidad', label: 'Unidad', align: 'left', field: 'unidad', hidden: true }, // Oculta la unidad si ya se muestra en 'Valor'
  { name: 'estado', label: 'Estado', align: 'center', field: 'estado' },
  { name: 'acciones', label: 'Acciones', align: 'center', field: 'acciones' },
];

const configurations = ref([
  { nombre: 'Horas extras diurnas', tipo: 'Ingreso', valor: 1.5, unidad: 'x', estado: true },
  { nombre: 'Horas extras nocturnas', tipo: 'Ingreso', valor: 1.75, unidad: 'x', estado: true },
  { nombre: 'Horas nocturnas', tipo: 'Ingreso', valor: 1.25, unidad: 'x', estado: true },
  { nombre: 'Subsidio por alimentación', tipo: 'Ingreso', valor: 100, unidad: '$', estado: true },
  { nombre: 'Vacaciones', tipo: 'Ingreso', valor: 15, unidad: 'días', estado: true },
  { nombre: 'Aguinaldo', tipo: 'Ingreso', valor: 30, unidad: 'días', estado: true },
  { nombre: 'ISSS Patronal', tipo: 'Aporte Patronal', valor: 7.5, unidad: '%', estado: true },
  { nombre: 'ISSS Empleado', tipo: 'Deducción', valor: 3, unidad: '%', estado: true },
  { nombre: 'AFP Patronal', tipo: 'Aporte Patronal', valor: 8.75, unidad: '%', estado: true },
  { nombre: 'AFP Empleado', tipo: 'Deducción', valor: 7.25, unidad: '%', estado: true },
  { nombre: 'ISR', tipo: 'Deducción', valor: 10, unidad: '%', estado: true },
]);

const showEditConfigDialog = ref(false);
const editingConfig = ref(null); // Para almacenar la configuración que se está editando

onMounted(() => {
  // En un caso real, aquí cargarías las configuraciones desde tu API
});

const editConfiguration = (config) => {
  editingConfig.value = { ...config }; // Crea una copia para evitar mutar el original directamente
  showEditConfigDialog.value = true;
};

const saveConfiguration = () => {
  if (editingConfig.value) {
    const index = configurations.value.findIndex(c => c.nombre === editingConfig.value.nombre);
    if (index !== -1) {
      configurations.value[index] = { ...editingConfig.value }; // Actualiza el elemento original
      // Aquí deberías enviar la actualización a tu backend
      console.log('Configuración guardada:', editingConfig.value);
    }
    showEditConfigDialog.value = false;
    editingConfig.value = null;
  }
};

const deleteConfiguration = (config) => {
  // Aquí deberías añadir una confirmación de eliminación
  const index = configurations.value.findIndex(c => c.nombre === config.nombre);
  if (index !== -1) {
    configurations.value.splice(index, 1);
    // Aquí deberías enviar la eliminación a tu backend
    console.log('Configuración eliminada:', config);
  }
};
</script>

<style scoped>
/* Estilos específicos si los necesitas */
</style>