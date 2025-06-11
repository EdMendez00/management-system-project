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
            <q-btn
              icon="edit"
              flat
              round
              dense
              color="primary"
              @click="editConfiguration(props.row)"
              title="Editar Configuración"
            />
            <q-btn
              icon="delete"
              flat
              round
              dense
              color="negative"
              @click="deleteConfiguration(props.row)"
              title="Eliminar Configuración"
            />
          </q-td>
        </template>
        </q-table>
    </q-card-section>

    <q-dialog v-model="showEditConfigDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Editar Configuración</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input outlined v-model="editingConfig.nombre" label="Nombre" disable class="q-mb-sm" />
          <q-select
            outlined
            v-model="editingConfig.tipo"
            :options="['Ingreso', 'Deducción', 'Aporte Patronal']"
            label="Tipo"
            class="q-mb-sm"
          />
          <q-input outlined v-model="editingConfig.valor" label="Valor" type="number" step="0.01" class="q-mb-sm" />
          <q-input outlined v-model="editingConfig.unidad" label="Unidad" class="q-mb-sm" />
          <q-checkbox v-model="editingConfig.estado" label="Activo" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="showEditConfigDialog = false" />
          <q-btn flat label="Guardar" color="primary" @click="saveConfiguration" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const columns = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left', sortable: true },
  { name: 'Valor', label: 'Valor', field: 'valor', align: 'right', sortable: true }, // Columna para el slot
  { name: 'Estado', label: 'Estado', field: 'estado', align: 'center', sortable: true }, // Columna para el slot
  { name: 'Acciones', label: 'Acciones', field: 'acciones', align: 'center' },
];

const configurations = ref([
  { nombre: 'Salario Base', tipo: 'Ingreso', valor: 1, unidad: 'Salario', estado: true }, // Salario base generalmente no tiene un valor fijo, es un multiplicador
  { nombre: 'Bono Productividad', tipo: 'Ingreso', valor: 50, unidad: '$', estado: true },
  { nombre: 'Horas Extras Diurnas', tipo: 'Ingreso', valor: 1.5, unidad: 'Recargo', estado: true },
  { nombre: 'Horas Extras Nocturnas', tipo: 'Ingreso', valor: 2, unidad: 'Recargo', estado: true },
  { nombre: 'Horas Nocturnas', tipo: 'Ingreso', valor: 0.25, unidad: 'Recargo', estado: true },
  { nombre: 'Subsidio por Alimentación', tipo: 'Ingreso', valor: 30, unidad: '$', estado: true },
  { nombre: 'Vacaciones', tipo: 'Ingreso', valor: 1, unidad: 'Salario', estado: true },
  { nombre: 'Aguinaldo', tipo: 'Ingreso', valor: 1, unidad: 'Salario', estado: true },
  { nombre: 'ISSS Empleado', tipo: 'Deducción', valor: 3, unidad: '%', estado: true },
  { nombre: 'AFP Empleado', tipo: 'Deducción', valor: 7.25, unidad: '%', estado: true },
  { nombre: 'ISR', tipo: 'Deducción', valor: 10, unidad: '%', estado: true },
  { nombre: 'ISSS Patronal', tipo: 'Aporte Patronal', valor: 7.5, unidad: '%', estado: true },
  { nombre: 'AFP Patronal', tipo: 'Aporte Patronal', valor: 8.75, unidad: '%', estado: true },
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
  // Aquí deberías añadir una confirmación de eliminación antes de borrar realmente
  if (confirm(`¿Estás seguro de que quieres eliminar la configuración "${config.nombre}"?`)) {
    const index = configurations.value.findIndex(c => c.nombre === config.nombre);
    if (index !== -1) {
      configurations.value.splice(index, 1);
      // Aquí deberías enviar la eliminación a tu backend
      console.log('Configuración eliminada:', config);
    }
  }
};
</script>