<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h3 class="text-h4 text-weight-bold q-my-md">Gestión de Empleados</h3>
      </div>
      <q-btn
        push
        icon="add"
        label="Registrar Nuevo Empleado"
        color="primary"
        @click="dialogRegistrar = true"
        no-caps
      />
    </div>

    <q-card>
      <q-card-section>
        <q-table
          :rows="empleados"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          class="q-mb-md"
        >
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn flat round icon="edit" color="primary" @click="editarEmpleado(props.row)" />
              <q-btn
                flat
                round
                icon="delete"
                color="negative"
                @click="eliminarEmpleado(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="dialogRegistrar" persistent>
      <q-card style="min-width: 600px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ editando ? 'Editar Empleado' : 'Registrar Nuevo Empleado' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="cerrarDialog" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="agregarOActualizarEmpleado" class="q-gutter-md">
            <q-input
              filled
              v-model="formulario.nombre"
              label="Nombre completo *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Por favor, ingrese el nombre']"
            />
            <q-input
              filled
              v-model="formulario.correo"
              label="Correo electrónico *"
              type="email"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Por favor, ingrese el correo',
                (val) => /.+@.+\..+/.test(val) || 'Correo electrónico inválido',
              ]"
            />
            <q-input
              filled
              v-model="formulario.departamento"
              label="Departamento *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Por favor, ingrese el departamento']"
            />
            <q-input
              filled
              v-model="formulario.puesto"
              label="Puesto de trabajo *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Por favor, ingrese el puesto']"
            />
            <q-input
              filled
              v-model="formulario.telefono"
              label="Número de teléfono *"
              mask="(###) ####-####"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Por favor, ingrese el teléfono']"
            />
            <q-input
              filled
              v-model.number="formulario.salario"
              label="Salario base *"
              type="number"
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Por favor, ingrese el salario',
                (val) => val > 0 || 'El salario debe ser un número positivo',
              ]"
            />

            <div class="flex justify-end q-mt-md">
              <q-btn flat label="Cancelar" @click="cerrarDialog" />
              <q-btn label="Guardar" type="submit" color="primary" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogConfirmacionEliminar" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm">¿Estás seguro de que quieres eliminar a este empleado?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="primary"
            @click="dialogConfirmacionEliminar = false"
          />
          <q-btn flat label="Eliminar" color="negative" @click="confirmarEliminar" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogConfirmacion" persistent>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <q-avatar icon="check_circle" color="green" text-color="white" />
          <span class="q-ml-sm">¡Empleado guardado exitosamente!</span>
          <q-space />
          <q-btn icon="close" flat round dense @click="dialogConfirmacion = false" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Visibilidad de diálogos
const dialogRegistrar = ref(false)
const dialogConfirmacion = ref(false)
const dialogConfirmacionEliminar = ref(false)

// Estado para editar o registrar
const editando = ref(false)
const empleadoEditandoId = ref(null)

// Datos del formulario para nuevo/editar empleado
const formulario = ref({
  id: null,
  nombre: '',
  correo: '',
  departamento: '',
  puesto: '',
  telefono: '',
  salario: null,
})

// Datos de empleados (ahora se cargarán desde localStorage)
const empleados = ref([])

// Definición de las columnas para la q-table
const columns = [
  {
    name: 'nombre',
    required: true,
    label: 'Nombre completo',
    align: 'left',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'correo',
    label: 'Correo electrónico',
    align: 'left',
    field: 'correo',
    sortable: true,
  },
  {
    name: 'departamento',
    label: 'Departamento',
    align: 'left',
    field: 'departamento',
    sortable: true,
  },
  {
    name: 'puesto',
    label: 'Puesto',
    align: 'left',
    field: 'puesto',
    sortable: true,
  },
  {
    name: 'telefono',
    label: 'Teléfono',
    align: 'left',
    field: 'telefono',
    sortable: false,
  },
  {
    name: 'salario',
    label: 'Salario',
    align: 'right',
    field: 'salario',
    sortable: true,
    format: (val) => {
      // Asegurarnos que val es un número
      const num = Number(val)
      return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`
    },
  },
  {
    name: 'acciones',
    label: 'Acciones',
    align: 'center',
    field: 'acciones',
    sortable: false,
  },
]

// Paginación
const pagination = ref({
  rowsPerPage: 10,
})

// Cargar empleados desde localStorage al iniciar
onMounted(() => {
  cargarEmpleados()
})

// Función para cargar empleados desde localStorage
function cargarEmpleados() {
  const empleadosGuardados = localStorage.getItem('empleados')
  if (empleadosGuardados) {
    empleados.value = JSON.parse(empleadosGuardados)
  } else {
    // Datos iniciales si no hay nada en localStorage
    empleados.value = [
      {
        id: 1,
        nombre: 'Juan Pérez',
        correo: 'juan.perez@example.com',
        departamento: 'Ventas',
        puesto: 'Gerente de Ventas',
        telefono: '(503) 7777-1111',
        salario: 1500.0,
      },
      {
        id: 2,
        nombre: 'María García',
        correo: 'maria.garcia@example.com',
        departamento: 'Marketing',
        puesto: 'Especialista en Marketing',
        telefono: '(503) 6666-2222',
        salario: 1200.0,
      },
      {
        id: 3,
        nombre: 'Carlos López',
        correo: 'carlos.lopez@example.com',
        departamento: 'Desarrollo',
        puesto: 'Desarrollador Senior',
        telefono: '(503) 8888-3333',
        salario: 2000.0,
      },
    ]
    guardarEmpleados()
  }
}

// Función para guardar empleados en localStorage
function guardarEmpleados() {
  localStorage.setItem('empleados', JSON.stringify(empleados.value))
}

// Función para cerrar el diálogo y reiniciar el formulario
function cerrarDialog() {
  dialogRegistrar.value = false
  editando.value = false
  empleadoEditandoId.value = null
  // Reiniciar formulario
  formulario.value = {
    id: null,
    nombre: '',
    correo: '',
    departamento: '',
    puesto: '',
    telefono: '',
    salario: null,
  }
}

// Función para agregar o actualizar un empleado
function agregarOActualizarEmpleado() {
  try {
    // Convertir salario a número
    const datos = {
      ...formulario.value,
      salario: Number(formulario.value.salario),
    }

    if (editando.value) {
      const index = empleados.value.findIndex((e) => e.id === empleadoEditandoId.value)
      if (index > -1) {
        empleados.value[index] = datos
      }
    } else {
      // Generar un ID único simple
      const nuevoId = Math.max(...empleados.value.map((e) => e.id), 0) + 1
      empleados.value.unshift({ ...datos, id: nuevoId })
    }

    // Guardar en localStorage
    guardarEmpleados()

    // Mostrar confirmación
    dialogConfirmacion.value = true

    // Cerrar el diálogo de formulario
    cerrarDialog()

    // Ocultar la confirmación después de 2.5 segundos
    setTimeout(() => {
      dialogConfirmacion.value = false
    }, 2500)
  } catch (error) {
    console.error('Error al guardar empleado:', error)
  }
}

// Función para editar un empleado
function editarEmpleado(empleado) {
  editando.value = true
  empleadoEditandoId.value = empleado.id
  formulario.value = { ...empleado }
  dialogRegistrar.value = true
}

// Variables para eliminación
const empleadoAEliminarId = ref(null)

// Función para abrir el diálogo de confirmación de eliminación
function eliminarEmpleado(id) {
  empleadoAEliminarId.value = id
  dialogConfirmacionEliminar.value = true
}

// Función para confirmar la eliminación
function confirmarEliminar() {
  empleados.value = empleados.value.filter((e) => e.id !== empleadoAEliminarId.value)

  // Guardar en localStorage después de eliminar
  guardarEmpleados()

  dialogConfirmacionEliminar.value = false
  empleadoAEliminarId.value = null
}
</script>

<style lang="scss" scoped>
/* Estilos específicos para esta página */
.stat-card {
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
}

.w-180 {
  width: 180px; /* Ejemplo de utilidad de ancho, ajusta según necesidad */
}
</style>
