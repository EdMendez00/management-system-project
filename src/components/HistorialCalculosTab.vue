<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Historial de Prestaciones</div>
      <p>Registro de todas las prestaciones calculadas</p>
    </q-card-section>

    <q-card-section>
      <q-table :rows="prestacionesHistory" :columns="columns" row-key="id" flat bordered>
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-btn
              :color="props.row.estado === 'Pendiente' ? 'yellow-8' : 'green'"
              :text-color="props.row.estado === 'Pendiente' ? 'black' : 'white'"
              :label="props.row.estado"
              size="sm"
              rounded
              @click="toggleEstado(props.row)"
              class="q-px-md"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-Acciones="props">
          <q-td :props="props">
            <q-btn
              icon="description"
              flat
              round
              dense
              color="primary"
              @click="viewComprobante(props.row)"
              title="Ver Comprobante"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>

    <q-dialog v-model="dialogBoletaPreview">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <BoletaPagoComponent v-if="selectedBoleta" :boletaData="selectedBoleta" />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn color="grey" label="Cerrar" @click="dialogBoletaPreview = false" />
          <q-btn color="blue" label="Imprimir" icon="print" @click="imprimirBoleta" />
          <q-btn
            color="primary"
            label="Descargar PDF"
            icon="download"
            @click="descargarPDF"
            :loading="generandoPDF"
            :disable="generandoPDF"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import html2pdf from 'html2pdf.js'
import BoletaPagoComponent from 'src/components/BoletaPagoComponent.vue'

const prestacionesHistory = ref([
  // Datos de ejemplo para el historial
  {
    id: 1,
    empleado: 'Juan Pérez',
    tipo: 'Salario y Bonos',
    fecha: '01/06/2025',
    monto: '1164.0',
    estado: 'Pagado',
    boletaDetails: {
      calculoNo: 1,
      fecha: '01/06/2025',
      periodo: 'Junio de 2025',
      salarioBaseMostrado: 1200,
      informacionEmpleado: {
        nombre: 'Juan Pérez',
        id: '1',
        puesto: 'Desarrollador',
        salarioBase: 1200,
        departamento: 'IT',
      },
      conceptos: [
        { concepto: 'Salario Base', cantidad: '-', monto: 1200 },
        { concepto: 'Bono Productividad', cantidad: '-', monto: 100 },
      ],
      deducciones: [
        { concepto: 'ISSS Empleado', porcentaje: '3.0%', monto: 36 },
        { concepto: 'AFP Empleado', porcentaje: '7.25%', monto: 87 },
      ],
      aportesPatronales: [
        { concepto: 'ISSS Patronal', porcentaje: '7.5%', monto: 90 },
        { concepto: 'AFP Patronal', porcentaje: '8.75%', monto: 105 },
      ],
      totalIngresos: 1300,
      totalDeducciones: 123,
      totalAportesPatronales: 195,
      montoADepositarAlEmpleado: 1177,
      montoADepositarEnPlanillaUnica: 318,
    },
  },
  {
    id: 2,
    empleado: 'Maria Lopez',
    tipo: 'Aguinaldo',
    fecha: '05/04/2025',
    monto: '1000.0',
    estado: 'Pagado',
    boletaDetails: {
      calculoNo: 2,
      fecha: '05/04/2025',
      periodo: 'Abril de 2025',
      salarioBaseMostrado: 1000,
      informacionEmpleado: {
        nombre: 'Maria López',
        id: '2',
        puesto: 'Asistente',
        salarioBase: 1000,
        departamento: 'HR',
      },
      conceptos: [{ concepto: 'Salario Base', cantidad: '-', monto: 1000 }],
      deducciones: [{ concepto: 'ISSS Empleado', porcentaje: '3.0%', monto: 30 }],
      aportesPatronales: [{ concepto: 'ISSS Patronal', porcentaje: '7.5%', monto: 75 }],
      totalIngresos: 1000,
      totalDeducciones: 30,
      totalAportesPatronales: 75,
      montoADepositarAlEmpleado: 970,
      montoADepositarEnPlanillaUnica: 75,
    },
  },
  {
    id: 3,
    empleado: 'Carlos Ramirez',
    tipo: 'Vacaciones',
    fecha: '10/05/2025',
    monto: '500.0',
    estado: 'Pendiente',
    boletaDetails: {
      calculoNo: 3,
      fecha: '10/05/2025',
      periodo: 'Mayo de 2025',
      salarioBaseMostrado: 1500,
      informacionEmpleado: {
        nombre: 'Carlos Ramirez',
        id: '3',
        puesto: 'Gerente',
        salarioBase: 1500,
        departamento: 'Ventas',
      },
      conceptos: [{ concepto: 'Salario Base', cantidad: '-', monto: 1500 }],
      deducciones: [{ concepto: 'ISSS Empleado', porcentaje: '3.0%', monto: 45 }],
      aportesPatronales: [{ concepto: 'ISSS Patronal', porcentaje: '7.5%', monto: 112.5 }],
      totalIngresos: 1500,
      totalDeducciones: 45,
      totalAportesPatronales: 112.5,
      montoADepositarAlEmpleado: 1455,
      montoADepositarEnPlanillaUnica: 112.5,
    },
  },
])

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'empleado', label: 'Empleado', field: 'empleado', align: 'left', sortable: true },
  { name: 'tipo', label: 'Tipo de Prestación', field: 'tipo', align: 'left', sortable: true },
  { name: 'fecha', label: 'Fecha de Cálculo', field: 'fecha', align: 'left', sortable: true },
  {
    name: 'monto',
    label: 'Monto Total ($)',
    field: 'monto',
    align: 'right',
    format: (val) => `${parseFloat(val).toFixed(2)}`,
    sortable: true,
  },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center', sortable: true },
  { name: 'Acciones', label: 'Acciones', field: 'Acciones', align: 'center' },
]

const dialogBoletaPreview = ref(false)
const selectedBoleta = ref(null)
const generandoPDF = ref(false)

const viewComprobante = (prestacion) => {
  // Include the current estado from the table row in the boleta details
  selectedBoleta.value = {
    ...prestacion.boletaDetails,
    estado: prestacion.estado, // Pass the current estado from the table
  }
  dialogBoletaPreview.value = true
}

// Función para cambiar estado
function toggleEstado(prestacion) {
  if (prestacion.estado === 'Pendiente') {
    prestacion.estado = 'Pagado'
  } else {
    prestacion.estado = 'Pendiente'
  }
}

// Función para imprimir
function imprimirBoleta() {
  if (!selectedBoleta.value) return

  try {
    // Obtener el elemento del componente de boleta
    const boletaElement = document.querySelector('.boleta-container')

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

    const empleadoNombre = selectedBoleta.value.informacionEmpleado?.nombre || 'Empleado'

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Boleta de Pago - ${empleadoNombre}</title>
          <meta charset="UTF-8">
          <style>
            body {
              margin: 0;
              padding: 10px;
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
            @media print {
              body {
                margin: 0;
                padding: 10px;
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

    setTimeout(() => {
      printWindow.print()
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
    const boletaElement = document.querySelector('.boleta-container')

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
      width: 210mm !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 20px !important;
    `

    // Configuración para html2pdf
    const empleadoNombre = selectedBoleta.value.informacionEmpleado?.nombre || 'Empleado'
    const options = {
      margin: [1, 1, 1, 1],
      filename: `boleta_pago_${empleadoNombre.replace(/\s+/g, '_')}_${selectedBoleta.value.fecha}.pdf`,
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

    console.log('PDF generado exitosamente para:', empleadoNombre)
  } catch (error) {
    console.error('Error al generar PDF:', error)
    alert(`Error al generar el PDF: ${error.message}`)
  } finally {
    generandoPDF.value = false
  }
}
</script>
