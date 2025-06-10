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
      <q-card style="min-width: 600px; max-width: 890px">
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
          <q-btn
            label="Descargar PDF"
            icon="download"
            color="primary"
            @click="descargarPDF"
            :loading="generandoPDF"
            :disable="generandoPDF"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import html2pdf from 'html2pdf.js'
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
const generandoPDF = ref(false)

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
  if (!selectedBoleta.value) return

  try {
    // Obtener el elemento del componente de boleta
    const boletaElement =
      boletaComponentRef.value?.$el || document.querySelector('.boleta-container')

    if (!boletaElement) {
      alert('No se pudo encontrar el elemento de la boleta')
      return
    }

    // Crear una nueva ventana para impresión
    const printWindow = window.open('', '_blank', 'width=800,height=600')

    if (!printWindow) {
      alert(
        'No se pudo abrir la ventana de impresión. Verifique que no esté bloqueada por el navegador.',
      )
      return
    }

    const empleadoNombre = selectedBoleta.value.nombreEmpleado || 'Empleado'

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Boleta de Pago - ${empleadoNombre}</title>
          <meta charset="UTF-8">
          <style>
            body {
              margin: 0;
              font-family: Arial, sans-serif;
              background: white;
            }
            * {
              box-sizing: border-box;
            }
            .boleta-container {
              max-width: none !important;
              box-shadow: none !important;
              width: 100% !important;
              margin: 0 !important;
              border: 1px solid #ddd;
            }
            .total-section {
              background: #f0f0f0 !important;
              color: #333 !important;
              border: 2px solid #1976d2 !important;
            }
            .total-amount {
              background: white !important;
              border: 1px solid #1976d2 !important;
              color: #1976d2 !important;
            }
            .company-header {
              border-bottom: 2px solid #1976d2 !important;
            }
            .section-title {
              border-left: 3px solid #1976d2 !important;
            }
            .payment-section {
              background: #f9f9f9 !important;
            }
            .payment-category {
              border: 1px solid #ddd !important;
            }
            @media print {
              body {
                margin: 0;
                padding: 10px;
              }
              .boleta-container {
                border: 1px solid #ddd;
                page-break-inside: avoid;
              }
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

    // Esperar a que se cargue el contenido antes de imprimir
    setTimeout(() => {
      printWindow.print()
      // Cerrar la ventana después de imprimir (opcional)
      setTimeout(() => {
        printWindow.close()
      }, 100)
    }, 500)
  } catch (error) {
    console.error('Error al imprimir:', error)
    alert(`Error al imprimir la boleta: ${error.message}`)
  }
}

// Función para descargar PDF
async function descargarPDF() {
  if (!selectedBoleta.value || generandoPDF.value) return

  generandoPDF.value = true

  try {
    // Obtener el elemento del componente de boleta
    const boletaElement =
      boletaComponentRef.value?.$el || document.querySelector('.boleta-container')

    if (!boletaElement) {
      throw new Error('No se pudo encontrar el elemento de la boleta')
    }

    // Crear una copia del elemento para modificar estilos sin afectar la vista
    const clonedElement = boletaElement.cloneNode(true)

    // Aplicar estilos específicos para PDF
    clonedElement.style.cssText = `
      background: white !important;
      box-shadow: none !important;
      border: 1px solid #ddd !important;
      font-family: Arial, sans-serif !important;
      width: 208mm !important;
      max-width: none !important;
      margin: 0 !important;
    `

    // Configuración para html2pdf
    const options = {
      margin: [1, 1, 1, 1], // top, left, bottom, right (en mm)
      filename: `boleta_pago_${selectedBoleta.value.nombreEmpleado.replace(/\s+/g, '_')}_${selectedBoleta.value.fechaPago}.pdf`,
      image: {
        type: 'jpeg',
        quality: 0.98,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: '.page-break-avoid',
      },
    }

    // Crear y agregar el elemento temporal al DOM
    const tempContainer = document.createElement('div')
    tempContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 210mm;
      background: white;
    `
    tempContainer.appendChild(clonedElement)
    document.body.appendChild(tempContainer)

    // Generar el PDF
    await html2pdf().set(options).from(clonedElement).save()

    // Limpiar
    document.body.removeChild(tempContainer)

    console.log('PDF generado exitosamente para:', selectedBoleta.value.nombreEmpleado)
  } catch (error) {
    console.error('Error al generar PDF:', error)
    alert(`Error al generar el PDF: ${error.message}`)
  } finally {
    generandoPDF.value = false
  }
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
