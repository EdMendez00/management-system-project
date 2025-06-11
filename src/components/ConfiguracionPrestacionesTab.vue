<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Configuración de Prestaciones y Deducciones</div>
      <p>
        Administre las prestaciones y deducciones del sistema. Puede modificar los valores y agregar
        nuevas prestaciones.
      </p>
    </q-card-section>

    <q-card-section>
      <div class="row justify-between items-center q-mb-md">
        <div class="text-subtitle1">Configuraciones Activas</div>
        <div class="q-gutter-sm">
          <q-btn
            color="secondary"
            icon="refresh"
            label="Restablecer Por Defecto"
            @click="resetToDefault"
            outline
          />
          <q-btn
            color="primary"
            icon="add"
            label="Nueva Configuración"
            @click="addNewConfiguration"
          />
        </div>
      </div>
      <q-table :rows="configurations" :columns="columns" row-key="nombre" flat bordered>
        <template v-slot:body-cell-Valor="props">
          <q-td :props="props"> {{ props.row.valor }} {{ props.row.unidad }} </q-td>
        </template>
        <template v-slot:body-cell-Estado="props">
          <q-td :props="props">
            <q-checkbox v-model="props.row.estado" disable />
          </q-td>
        </template>
        <template v-slot:body-cell-Acciones="props">
          <q-td :props="props">
            <q-btn
              icon="add"
              flat
              round
              dense
              color="positive"
              @click="addNewConfiguration"
              title="Agregar Nueva Configuración"
            />
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
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">
            {{ isNewConfig ? 'Nueva Configuración' : 'Editar Configuración' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            outlined
            v-model="editingConfig.nombre"
            label="Nombre"
            :disable="!isNewConfig"
            class="q-mb-sm"
            :rules="[(val) => (val && val.length > 0) || 'El nombre es requerido']"
          />
          <q-select
            outlined
            v-model="editingConfig.tipo"
            :options="['Ingreso', 'Deducción', 'Aporte Patronal']"
            label="Tipo"
            class="q-mb-sm"
            :rules="[(val) => val || 'El tipo es requerido']"
          />
          <q-input
            outlined
            v-model.number="editingConfig.valor"
            label="Valor"
            type="number"
            step="0.01"
            class="q-mb-sm"
            :rules="[(val) => (val !== null && val >= 0) || 'El valor debe ser mayor o igual a 0']"
          />
          <q-input
            outlined
            v-model="editingConfig.unidad"
            label="Unidad (%, $, Salario, etc.)"
            class="q-mb-sm"
            :rules="[(val) => (val && val.length > 0) || 'La unidad es requerida']"
          />
          <q-checkbox v-model="editingConfig.estado" label="Activo" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="cancelEdit" />
          <q-btn flat label="Guardar" color="primary" @click="saveConfiguration" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const columns = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left', sortable: true },
  { name: 'Valor', label: 'Valor', field: 'valor', align: 'right', sortable: true }, // Columna para el slot
  { name: 'Estado', label: 'Estado', field: 'estado', align: 'center', sortable: true }, // Columna para el slot
  { name: 'Acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

// Configuraciones por defecto
const defaultConfigurations = [
  { nombre: 'Salario Base', tipo: 'Ingreso', valor: 1, unidad: 'Salario', estado: true },
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
]

const configurations = ref([])
const showEditConfigDialog = ref(false)
const editingConfig = ref(null)
const isNewConfig = ref(false)

// Cargar configuraciones desde localStorage
const loadConfigurations = () => {
  console.log('Intentando cargar configuraciones de localStorage...')
  const saved = localStorage.getItem('configuraciones')
  console.log('Datos guardados en localStorage:', saved)

  if (saved) {
    const parsed = JSON.parse(saved)
    console.log('Configuraciones parseadas desde localStorage:', parsed)
    return parsed
  } else {
    console.log('No hay configuraciones en localStorage, usando por defecto')
    console.log('Configuraciones por defecto:', defaultConfigurations)
    // Si no hay configuraciones guardadas, guardar las por defecto
    saveConfigurations(defaultConfigurations)
    return defaultConfigurations
  }
}

// Guardar configuraciones en localStorage
const saveConfigurations = (configs) => {
  localStorage.setItem('configuraciones', JSON.stringify(configs))
}

onMounted(() => {
  console.log('ConfiguracionPrestacionesTab: onMounted ejecutándose')
  configurations.value = loadConfigurations()
  console.log('Configuraciones cargadas:', configurations.value)
})

const editConfiguration = (config) => {
  editingConfig.value = { ...config }
  isNewConfig.value = false
  showEditConfigDialog.value = true
}

const addNewConfiguration = () => {
  editingConfig.value = {
    nombre: '',
    tipo: '',
    valor: 0,
    unidad: '',
    estado: true,
  }
  isNewConfig.value = true
  showEditConfigDialog.value = true
}

const cancelEdit = () => {
  showEditConfigDialog.value = false
  editingConfig.value = null
  isNewConfig.value = false
}

const saveConfiguration = () => {
  if (editingConfig.value) {
    // Validaciones básicas
    if (!editingConfig.value.nombre || !editingConfig.value.tipo || !editingConfig.value.unidad) {
      alert('Todos los campos son requeridos')
      return
    }

    if (isNewConfig.value) {
      // Verificar que no exista ya una configuración con el mismo nombre
      const exists = configurations.value.find((c) => c.nombre === editingConfig.value.nombre)
      if (exists) {
        alert('Ya existe una configuración con ese nombre')
        return
      }
      configurations.value.push({ ...editingConfig.value })
    } else {
      const index = configurations.value.findIndex((c) => c.nombre === editingConfig.value.nombre)
      if (index !== -1) {
        configurations.value[index] = { ...editingConfig.value }
      }
    }

    saveConfigurations(configurations.value)
    showEditConfigDialog.value = false
    editingConfig.value = null
    isNewConfig.value = false
  }
}

const deleteConfiguration = (config) => {
  if (confirm(`¿Estás seguro de que quieres eliminar la configuración "${config.nombre}"?`)) {
    const index = configurations.value.findIndex((c) => c.nombre === config.nombre)
    if (index !== -1) {
      configurations.value.splice(index, 1)
      saveConfigurations(configurations.value)
    }
  }
}

const resetToDefault = () => {
  if (
    confirm(
      '¿Estás seguro de que quieres restablecer todas las configuraciones por defecto? Esto eliminará todas las configuraciones personalizadas.',
    )
  ) {
    console.log('Restableciendo configuraciones por defecto')
    localStorage.removeItem('configuraciones')
    configurations.value = [...defaultConfigurations]
    saveConfigurations(configurations.value)
    console.log('Configuraciones restablecidas:', configurations.value)
  }
}
</script>
