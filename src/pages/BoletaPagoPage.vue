<template>
  <q-page class="q-pa-md">
    <!-- Título principal -->
    <div class="q-mb-lg">
      <h3 class="text-h4 text-weight-bold q-my-md">Boletas de Pago</h3>
      <p class="text-h6 text-grey-7 q-mb-xl">
        Administración de los pagos de boletas por prestaciones laborales a los empleados
      </p>
    </div>

    <!-- Tabla de boletas de pago -->
    <q-card>
      <q-card-section>
        <q-table
          :rows="boletas"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          class="q-mb-md"
        >
          <!-- Estado de Pago Column -->
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-btn
                :color="props.row.estado === 'Pendiente' ? 'yellow-8' : 'green'"
                :text-color="props.row.estado === 'Pendiente' ? 'black' : 'white'"
                :label="props.row.estado"
                size="sm"
                rounded
                @click="toggleEstadoPago(props.row)"
                class="q-px-md"
              />
            </q-td>
          </template>

          <!-- Comprobante Column -->
          <template v-slot:body-cell-comprobante="props">
            <q-td :props="props">
              <q-btn
                icon="receipt"
                color="primary"
                round
                size="sm"
                @click="verComprobante(props.row)"
              >
                <q-tooltip>Ver comprobante</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Dialog para mostrar comprobante -->
    <q-dialog v-model="dialogComprobante">
      <q-card style="min-width: 600px; max-width: 900px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Comprobante de Pago</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <!-- Componente de boleta de pago -->
          <BoletaPagoComponent
            v-if="selectedBoleta"
            :boleta="selectedBoleta"
            ref="boletaComponentRef"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            label="Imprimir"
            icon="print"
            color="grey-8"
            @click="imprimirComprobante"
            class="q-mr-sm"
          />
          <q-btn label="Descargar PDF" icon="download" color="primary" @click="descargarPDF" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import BoletaPagoComponent from '../components/BoletaPagoComponent.vue'

// Datos de la tabla
const boletas = ref([
  {
    id: 1,
    nombreEmpleado: 'Juan Pérez González',
    cargo: 'Desarrollador Senior',
    fechaPago: '2025-06-15',
    estado: 'Pendiente',
    salarioBase: 1200000,
    bonificaciones: 150000,
    deducciones: 200000,
    totalPagar: 1150000,
  },
  {
    id: 2,
    nombreEmpleado: 'María García López',
    cargo: 'Analista de Sistemas',
    fechaPago: '2025-06-15',
    estado: 'Pagado',
    salarioBase: 1000000,
    bonificaciones: 100000,
    deducciones: 150000,
    totalPagar: 950000,
  },
  {
    id: 3,
    nombreEmpleado: 'Carlos Rodríguez Silva',
    cargo: 'Gerente de Proyecto',
    fechaPago: '2025-06-15',
    estado: 'Pendiente',
    salarioBase: 1500000,
    bonificaciones: 200000,
    deducciones: 250000,
    totalPagar: 1450000,
  },
  {
    id: 4,
    nombreEmpleado: 'Ana Martínez Ruiz',
    cargo: 'Diseñadora UX/UI',
    fechaPago: '2025-06-15',
    estado: 'Pagado',
    salarioBase: 900000,
    bonificaciones: 80000,
    deducciones: 120000,
    totalPagar: 860000,
  },
  {
    id: 5,
    nombreEmpleado: 'Luis Fernando Castro',
    cargo: 'Administrador de Base de Datos',
    fechaPago: '2025-06-15',
    estado: 'Pendiente',
    salarioBase: 1100000,
    bonificaciones: 120000,
    deducciones: 180000,
    totalPagar: 1040000,
  },
])

// Configuración de columnas
const columns = [
  {
    name: 'nombreEmpleado',
    required: true,
    label: 'Nombre del Empleado',
    align: 'left',
    field: 'nombreEmpleado',
    sortable: true,
  },
  {
    name: 'cargo',
    label: 'Cargo',
    align: 'left',
    field: 'cargo',
    sortable: true,
  },
  {
    name: 'fechaPago',
    label: 'Fecha de Pago',
    align: 'center',
    field: 'fechaPago',
    sortable: true,
    format: (val) => new Date(val).toLocaleDateString(),
  },
  {
    name: 'estado',
    label: 'Estado de Pago',
    align: 'center',
    field: 'estado',
  },
  {
    name: 'comprobante',
    label: 'Comprobante',
    align: 'center',
  },
]

// Configuración de paginación
const pagination = ref({
  sortBy: 'fechaPago',
  descending: true,
  page: 1,
  rowsPerPage: 10,
})

// Control del dialog
const dialogComprobante = ref(false)
const selectedBoleta = ref(null)
const boletaComponentRef = ref(null)

// Función para cambiar estado de pago
function toggleEstadoPago(boleta) {
  if (boleta.estado === 'Pendiente') {
    boleta.estado = 'Pagado'
  } else {
    boleta.estado = 'Pendiente'
  }
}

// Función para ver comprobante
function verComprobante(boleta) {
  selectedBoleta.value = boleta
  dialogComprobante.value = true
}

// Función para imprimir
function imprimirComprobante() {
  // Crear una nueva ventana para impresión
  const printWindow = window.open('', '_blank')
  const boletaElement = boletaComponentRef.value?.$el || document.querySelector('.boleta-container')

  if (boletaElement) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Boleta de Pago - ${selectedBoleta.value.nombreEmpleado}</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            * { box-sizing: border-box; }
            .boleta-container { max-width: none !important; box-shadow: none !important; }
            @media print {
              body { margin: 0; }
              .boleta-container { border: 1px solid #ddd; }
            }
          </style>
        </head>
        <body>
          ${boletaElement.outerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()

    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }
}

// Función para descargar PDF
function descargarPDF() {
  console.log('Descargando PDF para:', selectedBoleta.value.nombreEmpleado)

  const filename = `boleta_pago_${selectedBoleta.value.nombreEmpleado.replace(/\s+/g, '_')}_${selectedBoleta.value.fechaPago}.pdf`

  // En una implementación real, aquí usarías una librería como jsPDF o html2pdf
  // Para este ejemplo, mostramos una notificación
  alert(`Funcionalidad de PDF en desarrollo.\nSe descargaría: ${filename}`)
}
</script>

<style scoped>
/* Estilos específicos para la página de administración */
.q-table th {
  font-weight: 600;
}

.q-table .q-btn {
  margin: 2px;
}
</style>
