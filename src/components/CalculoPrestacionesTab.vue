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
        icon="calculate"
      />
    </q-card-section>

    <q-card-section v-if="selectedEmployeeDetails">
      <div class="text-h6 q-mb-md">Información del Empleado</div>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-4">
          <strong>Nombre:</strong> {{ selectedEmployeeDetails.nombre }}
        </div>
        <div class="col-xs-12 col-sm-4">
          <strong>Salario Base:</strong> ${{ selectedEmployeeDetails.salario }}
        </div>
        <div class="col-xs-12 col-sm-4">
          <strong>Fecha de Ingreso:</strong>
          {{ selectedEmployeeDetails.fechaIngreso || 'No especificada' }}
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
import { Notify } from 'quasar'
import html2pdf from 'html2pdf.js'
import BoletaPagoComponent from 'src/components/BoletaPagoComponent.vue'

// Cargar empleados desde localStorage
const loadEmployees = () => {
  const saved = localStorage.getItem('empleados')
  return saved ? JSON.parse(saved) : []
}

// Cargar configuraciones desde localStorage
const loadConfigurations = () => {
  const saved = localStorage.getItem('configuraciones')
  return saved ? JSON.parse(saved) : []
}

const allEmployees = ref([])
const employeeOptions = ref([])
const configurations = ref([])
const selectedEmployee = ref(null)
const selectedEmployeeDetails = ref(null)

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
  allEmployees.value = loadEmployees()
  configurations.value = loadConfigurations()
  employeeOptions.value = allEmployees.value.map((emp) => ({
    label: emp.nombre,
    value: emp.id,
  }))
})

const fetchEmployeeDetails = () => {
  if (selectedEmployee.value) {
    selectedEmployeeDetails.value = allEmployees.value.find(
      (emp) => emp.id == selectedEmployee.value,
    )
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
    Notify.create({
      message: 'Por favor seleccione un empleado',
      color: 'negative',
      icon: 'warning',
    })
    return
  }

  try {
    // Función helper para obtener configuración por nombre
    const getConfig = (nombre) => {
      return configurations.value.find((config) => config.nombre === nombre && config.estado)
    }

    const baseSalary = selectedEmployeeDetails.value.salario
    const valorHorario = baseSalary / 30 / 8 // Valor por hora basado en 30 días y 8 horas diarias

    // Obtener configuraciones dinámicas
    const configHorasExtrasDiurnas = getConfig('Horas Extras Diurnas')
    const configHorasExtrasNocturnas = getConfig('Horas Extras Nocturnas')
    const configHorasNocturnas = getConfig('Horas Nocturnas')
    const configSubsidioAlimentacion = getConfig('Subsidio por Alimentación')
    const configVacaciones = getConfig('Vacaciones')
    const configAguinaldo = getConfig('Aguinaldo')

    // Configuraciones de deducciones
    const configISSS = getConfig('ISSS Empleado')
    const configAFP = getConfig('AFP Empleado')
    const configISR = getConfig('ISR')

    // Configuraciones de aportes patronales
    const configISSSPatronal = getConfig('ISSS Patronal')
    const configAFPPatronal = getConfig('AFP Patronal')

    // Cálculos de ingresos usando configuraciones dinámicas
    let horasExtrasDiurnasMonto = 0
    if (configHorasExtrasDiurnas && calculationData.value.horasExtrasDiurnas > 0) {
      horasExtrasDiurnasMonto =
        calculationData.value.horasExtrasDiurnas * configHorasExtrasDiurnas.valor * valorHorario
    }

    let horasExtrasNocturnasMonto = 0
    if (configHorasExtrasNocturnas && calculationData.value.horasExtrasNocturnas > 0) {
      horasExtrasNocturnasMonto =
        calculationData.value.horasExtrasNocturnas * configHorasExtrasNocturnas.valor * valorHorario
    }

    let horasNocturnasMonto = 0
    if (configHorasNocturnas && calculationData.value.horasNocturnas > 0) {
      horasNocturnasMonto =
        calculationData.value.horasNocturnas * configHorasNocturnas.valor * valorHorario
    }

    let subsidioAlimentacionMonto = 0
    if (configSubsidioAlimentacion && calculationData.value.subsidioAlimentacion > 0) {
      if (configSubsidioAlimentacion.unidad === '$') {
        subsidioAlimentacionMonto = calculationData.value.subsidioAlimentacion
      } else {
        subsidioAlimentacionMonto = configSubsidioAlimentacion.valor
      }
    }

    let diasVacacionesMonto = 0
    if (configVacaciones && calculationData.value.diasVacaciones > 0) {
      diasVacacionesMonto =
        (baseSalary / 30) * calculationData.value.diasVacaciones * configVacaciones.valor
    }

    let diasAguinaldoMonto = 0
    if (configAguinaldo && calculationData.value.diasAguinaldo > 0) {
      diasAguinaldoMonto =
        (baseSalary / 30) * calculationData.value.diasAguinaldo * configAguinaldo.valor
    }

    // Cálculos de deducciones usando configuraciones dinámicas
    let isssEmpleadoMonto = 0
    if (configISSS) {
      isssEmpleadoMonto = baseSalary * (configISSS.valor / 100)
    }

    let afpEmpleadoMonto = 0
    if (configAFP) {
      afpEmpleadoMonto = baseSalary * (configAFP.valor / 100)
    }

    let isrMonto = 0
    if (configISR) {
      if (configISR.unidad === '%') {
        isrMonto = baseSalary * (configISR.valor / 100)
      } else {
        isrMonto = configISR.valor
      }
    }

    // Cálculos de aportes patronales usando configuraciones dinámicas
    let isssPatronalMonto = 0
    if (configISSSPatronal) {
      isssPatronalMonto = baseSalary * (configISSSPatronal.valor / 100)
    }

    let afpPatronalMonto = 0
    if (configAFPPatronal) {
      afpPatronalMonto = baseSalary * (configAFPPatronal.valor / 100)
    }

    // Totales
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

    // Construir conceptos dinámicamente solo si tienen monto
    const conceptos = [{ concepto: 'Salario Base', cantidad: '-', monto: baseSalary }]

    if (horasExtrasDiurnasMonto > 0) {
      conceptos.push({
        concepto: 'Horas Extras Diurnas',
        cantidad: calculationData.value.horasExtrasDiurnas,
        monto: horasExtrasDiurnasMonto,
      })
    }

    if (horasExtrasNocturnasMonto > 0) {
      conceptos.push({
        concepto: 'Horas Extras Nocturnas',
        cantidad: calculationData.value.horasExtrasNocturnas,
        monto: horasExtrasNocturnasMonto,
      })
    }

    if (horasNocturnasMonto > 0) {
      conceptos.push({
        concepto: 'Horas Nocturnas (Recargo)',
        cantidad: calculationData.value.horasNocturnas,
        monto: horasNocturnasMonto,
      })
    }

    if (subsidioAlimentacionMonto > 0) {
      conceptos.push({
        concepto: 'Subsidio por Alimentación',
        cantidad: '-',
        monto: subsidioAlimentacionMonto,
      })
    }

    if (diasVacacionesMonto > 0) {
      conceptos.push({
        concepto: 'Vacaciones',
        cantidad: calculationData.value.diasVacaciones,
        monto: diasVacacionesMonto,
      })
    }

    if (diasAguinaldoMonto > 0) {
      conceptos.push({
        concepto: 'Aguinaldo',
        cantidad: calculationData.value.diasAguinaldo,
        monto: diasAguinaldoMonto,
      })
    }

    // Construir deducciones dinámicamente
    const deducciones = []
    if (isssEmpleadoMonto > 0) {
      deducciones.push({
        concepto: 'ISSS Empleado',
        porcentaje: `${configISSS?.valor || 0}%`,
        monto: isssEmpleadoMonto,
      })
    }

    if (afpEmpleadoMonto > 0) {
      deducciones.push({
        concepto: 'AFP Empleado',
        porcentaje: `${configAFP?.valor || 0}%`,
        monto: afpEmpleadoMonto,
      })
    }

    if (isrMonto > 0) {
      deducciones.push({
        concepto: 'ISR',
        porcentaje: configISR?.unidad === '%' ? `${configISR.valor}%` : '-',
        monto: isrMonto,
      })
    }

    // Construir aportes patronales dinámicamente
    const aportesPatronales = []
    if (isssPatronalMonto > 0) {
      aportesPatronales.push({
        concepto: 'ISSS Patronal',
        porcentaje: `${configISSSPatronal?.valor || 0}%`,
        monto: isssPatronalMonto,
      })
    }

    if (afpPatronalMonto > 0) {
      aportesPatronales.push({
        concepto: 'AFP Patronal',
        porcentaje: `${configAFPPatronal?.valor || 0}%`,
        monto: afpPatronalMonto,
      })
    }

    calculatedBoletaData.value = {
      calculoNo: Math.floor(Math.random() * 100) + 1,
      fecha: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      periodo: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
      salarioBaseMostrado: baseSalary,
      informacionEmpleado: {
        nombre: selectedEmployeeDetails.value.nombre,
        id: selectedEmployee.value,
        puesto: selectedEmployeeDetails.value.puesto,
        salarioBase: selectedEmployeeDetails.value.salario, // Mantener como salarioBase para la boleta
        departamento: selectedEmployeeDetails.value.departamento,
      },
      conceptos: conceptos,
      deducciones: deducciones,
      aportesPatronales: aportesPatronales,
      totalIngresos: totalIngresos,
      totalDeducciones: totalDeducciones,
      totalAportesPatronales: totalAportesPatronales,
      montoADepositarAlEmpleado: montoADepositarAlEmpleado,
      montoADepositarEnPlanillaUnica: totalAportesPatronales,
      estado: 'Pendiente',
    }

    // Crear registro para el historial
    const historialItem = {
      id: Date.now(),
      empleado: selectedEmployeeDetails.value.nombre,
      tipo: 'Salario y Prestaciones',
      fecha: calculatedBoletaData.value.fecha,
      monto: montoADepositarAlEmpleado,
      estado: 'Pendiente',
      boletaDetails: { ...calculatedBoletaData.value },
    }

    // Guardar en localStorage
    const historialActual = JSON.parse(localStorage.getItem('historialPrestaciones') || '[]')
    historialActual.unshift(historialItem)
    localStorage.setItem('historialPrestaciones', JSON.stringify(historialActual))

    // Notificación de éxito
    Notify.create({
      message: `Prestación calculada exitosamente para ${selectedEmployeeDetails.value.nombre}`,
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
    })

    showBoletaDialog.value = true
  } catch (error) {
    console.error('Error al calcular prestación:', error)
    Notify.create({
      message: 'Error al calcular prestación. Verifique los datos e intente nuevamente.',
      color: 'negative',
      icon: 'error',
    })
  }
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
