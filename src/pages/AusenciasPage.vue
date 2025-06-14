<template>
  <q-page class="q-pa-md">
    <!-- Título principal -->
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h3 class="text-h4 text-weight-bold q-my-md">Control de Ausencias e Incapacidades</h3>
      </div>
      <q-btn
        push
        icon="add"
        label="Registrar Ausencia"
        color="primary"
        @click="dialogRegistrar = true"
        no-caps
      />
    </div>

    <!-- Button Group para navegación -->
    <div class="w-180 q-mb-lg bg-[#eeeeee] q-pa-sm rounded-xl">
      <q-btn-toggle
        v-model="seccionActiva"
        spread
        rounded
        unelevated
        toggle-color="primary"
        color="grey-3"
        text-color="grey-8"
        :options="[
          { label: 'Ausencias Actuales', value: 'actuales' },
          { label: 'Historial de Ausencias', value: 'historial' },
        ]"
        style="width: 100%"
        no-caps
      />
    </div>

    <!-- Container principal -->
    <q-card>
      <q-card-section>
        <!-- Sección Ausencias Actuales -->
        <div v-if="seccionActiva === 'actuales'">
          <div class="q-mb-md">
            <h5 class="text-h5 text-weight-bold q-my-sm">Ausencias Actuales</h5>
            <p class="text-subtitle1 text-grey-6">
              Ausencias e incapacidades vigentes o pendientes de aprobacion
            </p>
          </div>

          <q-table
            :rows="ausenciasActuales"
            :columns="columnasActuales"
            row-key="id"
            :pagination="paginationActuales"
            class="q-mb-md"
          >
            <!-- Estado Column -->
            <template v-slot:body-cell-estado="props">
              <q-td :props="props">
                <q-chip color="orange" text-color="white" icon="schedule" size="sm">
                  {{ props.row.estado }}
                </q-chip>
              </q-td>
            </template>

            <!-- Acciones Column -->
            <template v-slot:body-cell-acciones="props">
              <q-td :props="props">
                <q-btn
                  icon="check"
                  color="positive"
                  round
                  size="sm"
                  @click="aprobarAusencia(props.row)"
                  class="q-mr-sm"
                >
                  <q-tooltip>Aprobar</q-tooltip>
                </q-btn>
                <q-btn
                  icon="close"
                  color="negative"
                  round
                  size="sm"
                  @click="rechazarAusencia(props.row)"
                >
                  <q-tooltip>Rechazar</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <!-- Mensaje cuando no hay datos -->
            <template v-slot:no-data>
              <div class="full-width row flex-center text-grey-6 q-gutter-sm">
                <q-icon size="2em" name="inbox" />
                <span>No hay ausencias pendientes</span>
              </div>
            </template>
          </q-table>
        </div>

        <!-- Sección Historial de Ausencias -->
        <div v-if="seccionActiva === 'historial'">
          <div class="q-mb-md">
            <h5 class="text-h5 text-weight-bold q-my-sm">Historial de Ausencias</h5>
            <p class="text-subtitle1 text-grey-6">
              Registro historico de todas las Ausencias e incapacidades
            </p>
          </div>

          <q-table
            :rows="historialAusencias"
            :columns="columnasHistorial"
            row-key="id"
            :pagination="paginationHistorial"
            class="q-mb-md"
          >
            <!-- Estado Column -->
            <template v-slot:body-cell-estado="props">
              <q-td :props="props">
                <q-chip
                  :color="props.row.estado === 'Aprobado' ? 'positive' : 'negative'"
                  text-color="white"
                  :icon="props.row.estado === 'Aprobado' ? 'check_circle' : 'cancel'"
                  size="sm"
                >
                  {{ props.row.estado }}
                </q-chip>
              </q-td>
            </template>

            <!-- Mensaje cuando no hay datos -->
            <template v-slot:no-data>
              <div class="full-width row flex-center text-grey-6 q-gutter-sm">
                <q-icon size="2em" name="history" />
                <span>No hay historial de ausencias</span>
              </div>
            </template>
          </q-table>
        </div>
      </q-card-section>
    </q-card>

    <!-- Dialog para registrar nueva ausencia -->
    <q-dialog v-model="dialogRegistrar" persistent>
      <q-card style="min-width: 500px; max-width: 600px; border-radius: 10px">
        <q-card-section>
          <div class="text-h6 text-weight-bold">Registrar Nueva Ausencia</div>
          <p class="text-subtitle2 text-grey-6">
            Complete los datos para registrar una nueva ausencia o incapacidad
          </p>

          <!-- Formulario -->
          <div class="mt-10">
            <!-- Seleccionar Empleado -->
            <div class="text-lg font-light mb-2">Empleado</div>
            <q-select
              v-model="formulario.empleado"
              :options="empleadosOptions"
              option-label="nombre"
              option-value="id"
              label="Seleccionar Empleado"
              outlined
              :rules="[(val) => !!val || 'Debe seleccionar un empleado']"
            />

            <!-- Tipo de Ausencia -->
            <div class="text-lg font-light mt-5 mb-2">Tipo de Ausencia</div>
            <q-select
              v-model="formulario.tipo"
              :options="tiposAusencia"
              label="Tipo de Ausencia"
              outlined
              :rules="[(val) => !!val || 'Debe seleccionar un tipo de ausencia']"
            />

            <!-- Fechas -->
            <div class="row mt-5 flex justify-between">
              <div class="col w-50">
                <div class="text-lg font-light mb-2">Fecha de Inicio</div>
                <q-input
                  v-model="formulario.fechaInicio"
                  type="date"
                  label="Fecha de Inicio"
                  outlined
                  :rules="[(val) => !!val || 'Fecha requerida']"
                  class="w-50"
                />
              </div>
              <div class="col">
                <div class="text-lg font-light mb-2">Fecha de Fin</div>
                <q-input
                  v-model="formulario.fechaFin"
                  type="date"
                  label="Fecha de Fin"
                  outlined
                  :rules="[(val) => !!val || 'Fecha requerida']"
                  class="w-50"
                />
              </div>
            </div>

            <!-- Motivo -->
            <div class="text-lg font-light mt-5 mb-2">Motivo</div>
            <q-input
              v-model="formulario.motivo"
              type="textarea"
              label="Motivo de la Ausencia"
              outlined
              rows="3"
              :rules="[(val) => !!val || 'Debe especificar el motivo']"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn label="Cancelar" color="grey-6" flat @click="cerrarDialog" class="q-mr-sm" />
          <q-btn
            label="Agregar"
            color="primary"
            @click="agregarAusencia"
            :disable="!formularioValido"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Mensaje de confirmación -->
    <q-dialog v-model="dialogConfirmacion">
      <q-card class="text-center q-pa-lg" style="width: 340px; height: 180px; border-radius: 10px">
        <q-icon name="check_circle_outline" color="positive" size="90px" class="q-mb-sm" />
        <div class="text-h6 text-positive text-weight-bold q-mb-xs">Registro Agregado</div>
        <div class="text-subtitle1 text-grey-6">Se registro la ausencia correctamente</div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Estado de la aplicación
const seccionActiva = ref('actuales')
const dialogRegistrar = ref(false)
const dialogConfirmacion = ref(false)

// Datos del formulario
const formulario = ref({
  empleado: null,
  tipo: '',
  fechaInicio: '',
  fechaFin: '',
  motivo: '',
})

// Opciones para los selects
const empleadosOptions = ref([])

// Función para cargar empleados desde localStorage
const cargarEmpleados = () => {
  const empleadosGuardados = localStorage.getItem('empleados')
  if (empleadosGuardados) {
    const empleados = JSON.parse(empleadosGuardados)
    empleadosOptions.value = empleados.map((emp) => ({
      id: emp.id,
      nombre: emp.nombre,
    }))
    console.log('Empleados cargados desde localStorage:', empleadosOptions.value)
  } else {
    console.log('No hay empleados en localStorage')
    empleadosOptions.value = []
  }
}

// Cargar empleados al montar el componente
onMounted(() => {
  cargarEmpleados()
  cargarAusencias()
})

// Función para cargar ausencias desde localStorage
const cargarAusencias = () => {
  const ausenciasGuardadas = localStorage.getItem('ausencias')
  if (ausenciasGuardadas) {
    const todasAusencias = JSON.parse(ausenciasGuardadas)

    // Separar ausencias actuales (pendientes) del historial
    ausenciasActuales.value = todasAusencias.filter((a) => a.estado === 'Pendiente')
    historialAusencias.value = todasAusencias.filter((a) => a.estado !== 'Pendiente')

    console.log('Ausencias cargadas desde localStorage:', {
      actuales: ausenciasActuales.value.length,
      historial: historialAusencias.value.length,
    })
  } else {
    console.log('No hay ausencias en localStorage')
    ausenciasActuales.value = []
    historialAusencias.value = []
  }
}

// Función para guardar ausencias en localStorage
const guardarAusencias = () => {
  const todasAusencias = [...ausenciasActuales.value, ...historialAusencias.value]
  localStorage.setItem('ausencias', JSON.stringify(todasAusencias))
}

const tiposAusencia = ref([
  'Permiso Personal',
  'Cita Médica',
  'Incapacidad Médica',
  'Vacaciones',
  'Licencia de Maternidad',
  'Licencia de Paternidad',
  'Duelo',
  'Otros',
])

// Ausencias actuales (pendientes) - inicializadas vacías
const ausenciasActuales = ref([])

// Historial de ausencias - inicializado vacío
const historialAusencias = ref([])

// Configuración de columnas para ausencias actuales
const columnasActuales = [
  {
    name: 'empleado',
    required: true,
    label: 'Empleado',
    align: 'left',
    field: 'empleado',
    sortable: true,
  },
  {
    name: 'tipo',
    label: 'Tipo',
    align: 'left',
    field: 'tipo',
    sortable: true,
  },
  {
    name: 'fechaInicio',
    label: 'Fecha Inicio',
    align: 'center',
    field: 'fechaInicio',
    sortable: true,
    format: (val) => new Date(val).toLocaleDateString(),
  },
  {
    name: 'fechaFin',
    label: 'Fecha Fin',
    align: 'center',
    field: 'fechaFin',
    sortable: true,
    format: (val) => new Date(val).toLocaleDateString(),
  },
  {
    name: 'estado',
    label: 'Estado',
    align: 'center',
    field: 'estado',
  },
  {
    name: 'motivo',
    label: 'Motivo',
    align: 'left',
    field: 'motivo',
  },
  {
    name: 'acciones',
    label: 'Acciones',
    align: 'center',
  },
]

// Configuración de columnas para historial
const columnasHistorial = [
  {
    name: 'empleado',
    required: true,
    label: 'Empleado',
    align: 'left',
    field: 'empleado',
    sortable: true,
  },
  {
    name: 'tipo',
    label: 'Tipo',
    align: 'left',
    field: 'tipo',
    sortable: true,
  },
  {
    name: 'fechaInicio',
    label: 'Fecha Inicio',
    align: 'center',
    field: 'fechaInicio',
    sortable: true,
    format: (val) => new Date(val).toLocaleDateString(),
  },
  {
    name: 'fechaFin',
    label: 'Fecha Fin',
    align: 'center',
    field: 'fechaFin',
    sortable: true,
    format: (val) => new Date(val).toLocaleDateString(),
  },
  {
    name: 'estado',
    label: 'Estado',
    align: 'center',
    field: 'estado',
  },
  {
    name: 'motivo',
    label: 'Motivo',
    align: 'left',
    field: 'motivo',
  },
]

// Configuración de paginación
const paginationActuales = ref({
  sortBy: 'fechaInicio',
  descending: true,
  page: 1,
  rowsPerPage: 10,
})

const paginationHistorial = ref({
  sortBy: 'fechaInicio',
  descending: true,
  page: 1,
  rowsPerPage: 10,
})

// Computed para validar formulario
const formularioValido = computed(() => {
  return (
    formulario.value.empleado &&
    formulario.value.tipo &&
    formulario.value.fechaInicio &&
    formulario.value.fechaFin &&
    formulario.value.motivo
  )
})

// Funciones
function aprobarAusencia(ausencia) {
  // Cambiar estado y mover a historial
  ausencia.estado = 'Aprobado'
  historialAusencias.value.unshift({ ...ausencia })

  // Remover de ausencias actuales
  const index = ausenciasActuales.value.findIndex((a) => a.id === ausencia.id)
  if (index > -1) {
    ausenciasActuales.value.splice(index, 1)
  }

  // Guardar cambios en localStorage
  guardarAusencias()
}

function rechazarAusencia(ausencia) {
  // Cambiar estado y mover a historial
  ausencia.estado = 'Rechazado'
  historialAusencias.value.unshift({ ...ausencia })

  // Remover de ausencias actuales
  const index = ausenciasActuales.value.findIndex((a) => a.id === ausencia.id)
  if (index > -1) {
    ausenciasActuales.value.splice(index, 1)
  }

  // Guardar cambios en localStorage
  guardarAusencias()
}

function agregarAusencia() {
  if (!formularioValido.value) return

  // Crear nueva ausencia
  const nuevaAusencia = {
    id: Date.now(), // ID único temporal
    empleado: formulario.value.empleado.nombre,
    tipo: formulario.value.tipo,
    fechaInicio: formulario.value.fechaInicio,
    fechaFin: formulario.value.fechaFin,
    estado: 'Pendiente',
    motivo: formulario.value.motivo,
  }

  // Agregar a ausencias actuales
  ausenciasActuales.value.unshift(nuevaAusencia)

  // Guardar en localStorage
  guardarAusencias()

  // Cerrar dialog y mostrar confirmación
  cerrarDialog()
  dialogConfirmacion.value = true

  // Cerrar automáticamente después de 2.5 segundos
  setTimeout(() => {
    dialogConfirmacion.value = false
  }, 2500)
}

function cerrarDialog() {
  dialogRegistrar.value = false
  // Limpiar formulario
  formulario.value = {
    empleado: null,
    tipo: '',
    fechaInicio: '',
    fechaFin: '',
    motivo: '',
  }
}
</script>

<style scoped>
.q-table th {
  font-weight: 600;
}

.q-table .q-btn {
  margin: 2px;
}

.q-btn-toggle {
  border-radius: 12px;
}
</style>
