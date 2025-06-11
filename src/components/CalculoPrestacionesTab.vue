<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Cálculo de Prestaciones</div>
      <p>Seleccione un empleado y el tipo de prestación para realizar el cálculo</p>
    </q-card-section>

    <q-card-section>
      <div class="text-subtitle1 q-mb-sm">Empleado</div>
      <q-select
        outlined
        v-model="selectedEmployee"
        :options="employeeOptions"
        label="Seleccionar empleado"
        emit-value
        map-options
        @update:model-value="fetchEmployeeDetails"
        class="q-mb-md"
      />

      <div v-if="selectedEmployeeDetails" class="row q-col-gutter-md q-mb-md">
        <div class="col-xs-12 col-sm-4">
          <q-input
            outlined
            v-model="calculationData.horasExtrasDiurnas"
            label="Horas extras diurnas (hrs/mes)"
            type="number"
          />
        </div>
        <div class="col-xs-12 col-sm-4">
          <q-input
            outlined
            v-model="calculationData.horasExtrasNocturnas"
            label="Horas extras nocturnas (hrs/mes)"
            type="number"
          />
        </div>
        <div class="col-xs-12 col-sm-4">
          <q-input
            outlined
            v-model="calculationData.horasNocturnas"
            label="Horas nocturnas (hrs/mes)"
            type="number"
          />
        </div>
        <div class="col-xs-12 col-sm-4">
          <q-input
            outlined
            v-model="calculationData.subsidioAlimentacion"
            label="Subsidio por alimentación"
            type="number"
          />
        </div>
        <div class="col-xs-12 col-sm-4">
          <q-input
            outlined
            v-model="calculationData.diasVacaciones"
            label="Días de vacaciones"
            type="number"
          />
        </div>
        <div class="col-xs-12 col-sm-4">
          <q-input
            outlined
            v-model="calculationData.diasAguinaldo"
            label="Días de aguinaldo"
            type="number"
          />
        </div>
      </div>

      <q-btn
        color="primary"
        label="Calcular Prestacion"
        @click="calculatePrestacion"
        :disable="!selectedEmployee"
      />
    </q-card-section>

    <q-card-section v-if="selectedEmployeeDetails">
      <div class="text-h6 q-mb-md">Información del Empleado</div>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-4">
          <strong>Nombre:</strong> {{ selectedEmployeeDetails.nombre }}
        </div>
        <div class="col-xs-12 col-sm-4">
          <strong>Salario Base:</strong> ${{ selectedEmployeeDetails.salarioBase }}
        </div>
        <div class="col-xs-12 col-sm-4">
          <strong>Fecha de Ingreso:</strong> {{ selectedEmployeeDetails.fechaIngreso }}
        </div>
        <div class="col-xs-12 col-sm-4">
          <strong>Departamento:</strong> {{ selectedEmployeeDetails.departamento }}
        </div>
        <div class="col-xs-12 col-sm-4">
          <strong>Puesto:</strong> {{ selectedEmployeeDetails.puesto }}
        </div>
      </div>
    </q-card-section>

    <q-dialog v-model="showBoletaDialog">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <BoletaPagoComponent v-if="calculatedBoletaData" :boletaData="calculatedBoletaData" />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn color="grey" label="Cerrar" @click="showBoletaDialog = false" />
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
import { ref, onMounted } from 'vue'
import html2pdf from 'html2pdf.js'
import BoletaPagoComponent from 'src/components/BoletaPagoComponent.vue'

// Datos de ejemplo para empleados (reemplazar con datos reales de tu API)
const allEmployees = ref([
  {
    label: 'Juan Perez M.',
    value: '1',
    nombre: 'Juan Pérez',
    salarioBase: 1500,
    fechaIngreso: '01/05/2020',
    departamento: 'IT',
    puesto: 'Desarrollador',
  },
  {
    label: 'Maria Lopez S.',
    value: '2',
    nombre: 'Maria López',
    salarioBase: 1200,
    fechaIngreso: '15/03/2021',
    departamento: 'HR',
    puesto: 'Asistente',
  },
])

const employeeOptions = ref([]) // Opciones formateadas para q-select

const selectedEmployee = ref(null)
const selectedEmployeeDetails = ref(null) // Detalles del empleado seleccionado

const calculationData = ref({
  horasExtrasDiurnas: 0,
  horasExtrasNocturnas: 0,
  horasNocturnas: 0,
  subsidioAlimentacion: 0,
  diasVacaciones: 0,
  diasAguinaldo: 0,
})

const showBoletaDialog = ref(false)
const calculatedBoletaData = ref(null)
const generandoPDF = ref(false)

onMounted(() => {
  // En un caso real, aquí harías una llamada a tu API para obtener los empleados
  employeeOptions.value = allEmployees.value.map((emp) => ({
    label: emp.label,
    value: emp.value,
  }))
})

const fetchEmployeeDetails = () => {
  if (selectedEmployee.value) {
    selectedEmployeeDetails.value = allEmployees.value.find(
      (emp) => emp.value === selectedEmployee.value,
    )
    // Reiniciar los campos de cálculo al cambiar de empleado
    calculationData.value = {
      horasExtrasDiurnas: 0,
      horasExtrasNocturnas: 0,
      horasNocturnas: 0,
      subsidioAlimentacion: 0,
      diasVacaciones: 0,
      diasAguinaldo: 0,
    }
  } else {
    selectedEmployeeDetails.value = null
  }
}

const calculatePrestacion = () => {
  if (!selectedEmployee.value) {
    console.error('No se ha seleccionado ningún empleado.')
    return
  }

  const baseSalary = selectedEmployeeDetails.value.salarioBase
  const horasExtrasDiurnasMonto =
    calculationData.value.horasExtrasDiurnas * 1.5 * (baseSalary / 30 / 8) // Ejemplo simple
  const horasExtrasNocturnasMonto =
    calculationData.value.horasExtrasNocturnas * 2.0 * (baseSalary / 30 / 8) // Ejemplo
  const horasNocturnasMonto = calculationData.value.horasNocturnas * 0.25 * (baseSalary / 30 / 8) // Recargo nocturno

  const subsidioAlimentacionMonto = calculationData.value.subsidioAlimentacion
  const diasVacacionesMonto = (baseSalary / 30) * calculationData.value.diasVacaciones
  const diasAguinaldoMonto = (baseSalary / 30) * calculationData.value.diasAguinaldo

  // Deducciones
  const isssEmpleadoMonto = baseSalary * 0.03
  const afpEmpleadoMonto = baseSalary * 0.0725
  const isrMonto = baseSalary * 0.1 // Ejemplo simple de ISR

  // Aportes Patronales
  const isssPatronalMonto = baseSalary * 0.075
  const afpPatronalMonto = baseSalary * 0.0875

  const totalIngresos =
    baseSalary +
    horasExtrasDiurnasMonto +
    horasExtrasNocturnasMonto +
    horasNocturnasMonto +
    subsidioAlimentacionMonto +
    diasVacacionesMonto +
    diasAguinaldoMonto
  const totalDeducciones = isssEmpleadoMonto + afpEmpleadoMonto + isrMonto
  const totalAportesPatronales = isssPatronalMonto + afpPatronalMonto
  const montoADepositarAlEmpleado = totalIngresos - totalDeducciones
  const montoADepositarEnPlanillaUnica = totalAportesPatronales // Puede variar según la lógica real

  calculatedBoletaData.value = {
    calculoNo: Math.floor(Math.random() * 100) + 1, // Número aleatorio
    fecha: new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    periodo: 'Mayo de 2025', // O calcula el período real
    salarioBaseMostrado: baseSalary,
    informacionEmpleado: {
      nombre: selectedEmployeeDetails.value.nombre,
      id: selectedEmployee.value,
      puesto: selectedEmployeeDetails.value.puesto,
      salarioBase: selectedEmployeeDetails.value.salarioBase,
      departamento: selectedEmployeeDetails.value.departamento,
    },
    conceptos: [
      { concepto: 'Salario Base', cantidad: '-', monto: baseSalary },
      {
        concepto: 'Horas Extras Diurnas',
        cantidad: calculationData.value.horasExtrasDiurnas,
        monto: horasExtrasDiurnasMonto,
      },
      {
        concepto: 'Horas Extras Nocturnas',
        cantidad: calculationData.value.horasExtrasNocturnas,
        monto: horasExtrasNocturnasMonto,
      },
      {
        concepto: 'Horas Nocturnas (Recargo)',
        cantidad: calculationData.value.horasNocturnas,
        monto: horasNocturnasMonto,
      },
      { concepto: 'Subsidio por Alimentación', cantidad: '-', monto: subsidioAlimentacionMonto },
      {
        concepto: 'Vacaciones',
        cantidad: calculationData.value.diasVacaciones,
        monto: diasVacacionesMonto,
      },
      {
        concepto: 'Aguinaldo',
        cantidad: calculationData.value.diasAguinaldo,
        monto: diasAguinaldoMonto,
      },
    ].filter((item) => item.monto > 0), // Filtra conceptos con monto 0

    deducciones: [
      { concepto: 'ISSS Empleado', porcentaje: '3.0%', monto: isssEmpleadoMonto },
      { concepto: 'AFP Empleado', porcentaje: '7.25%', monto: afpEmpleadoMonto },
      { concepto: 'ISR', porcentaje: '-', monto: isrMonto },
    ].filter((item) => item.monto > 0),

    aportesPatronales: [
      { concepto: 'ISSS Patronal', porcentaje: '7.5%', monto: isssPatronalMonto },
      { concepto: 'AFP Patronal', porcentaje: '8.75%', monto: afpPatronalMonto },
    ].filter((item) => item.monto > 0),

    totalIngresos: totalIngresos,
    totalDeducciones: totalDeducciones,
    totalAportesPatronales: totalAportesPatronales,
    montoADepositarAlEmpleado: montoADepositarAlEmpleado,
    montoADepositarEnPlanillaUnica: montoADepositarEnPlanillaUnica,
  }

  showBoletaDialog.value = true
}

// Función para imprimir
function imprimirBoleta() {
  if (!calculatedBoletaData.value) return

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

    const empleadoNombre = calculatedBoletaData.value.informacionEmpleado?.nombre || 'Empleado'

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Boleta de Pago - ${empleadoNombre}</title>
          <meta charset="UTF-8">
          <style>
            body {
              margin: 0;
              padding: 20px;
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
  if (!calculatedBoletaData.value || generandoPDF.value) return

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
    const empleadoNombre = calculatedBoletaData.value.informacionEmpleado?.nombre || 'Empleado'
    const options = {
      margin: [10, 10, 10, 10],
      filename: `boleta_pago_${empleadoNombre.replace(/\s+/g, '_')}_${calculatedBoletaData.value.fecha}.pdf`,
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

<style scoped>
/* Estilos específicos si los necesitas */
</style>
