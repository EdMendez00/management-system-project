<template>
  <div class="boleta-container bg-white rounded-xl my-0 mx-auto" ref="boletaRef">
    <div class="company-header border-b-3 row q-mb-lg">
      <div class="company-logo flex items-center mr-5">
        <q-img
          src="../assets/Header_logo.png"
          style="max-width: 200px; height: auto; min-width: 150px"
          fit="contain"
        />
      </div>
      <div class="company-info text-left">
        <h4 class="text-h5 text-weight-bold">BOLETA DE PAGO</h4>
        <div class="text-subtitle1 text-grey-7">Detalle de la boleta de pago generada</div>
        <div class="text-caption text-grey-6">{{ formatDate(new Date()) }}</div>
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <div class="employee-section q-mb-lg">
      <div class="section-title text-h6 text-weight-bold text-primary q-mb-md">
        <q-icon name="person" class="q-mr-sm" />
        Información del Empleado
      </div>
      <div class="employee-grid flex flex-col bg-white rounded-lg p-8">
        <div class="col">
          <div class="col-12 col-md-6">
            <div class="info-item">
              <span class="label">Nombre Completo:</span>
              <span class="value">{{ mappedBoleta.nombreEmpleado }}</span>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="info-item">
              <span class="label">Cargo:</span>
              <span class="value">{{ mappedBoleta.cargo }}</span>
            </div>
          </div>
        </div>
        <div class="col q-mt-sm">
          <div class="col-12 col-md-6">
            <div class="info-item">
              <span class="label">ID Empleado:</span>
              <span class="value">#{{ String(mappedBoleta.id).padStart(4, '0') }}</span>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="info-item">
              <span class="label">Periodo de Pago:</span>
              <span class="value">{{ mappedBoleta.periodoPago }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <div class="payment-section q-mb-lg">
      <div class="section-title text-h6 text-weight-bold text-primary q-mb-md">
        <q-icon name="payments" class="q-mr-sm" />
        Detalles de Pago
      </div>

      <div class="flex flex-col gap-4">
        <div class="payment-category q-mb-md">
          <div class="category-header">
            <q-icon name="trending_up" color="positive" class="q-mr-sm" />
            <span class="text-weight-medium text-positive">INGRESOS</span>
          </div>
          <div class="payment-items">
            <div v-for="(item, index) in boletaData.conceptos" :key="index" class="payment-item">
              <span class="item-label">{{ item.concepto }}</span>
              <span class="item-amount positive">${{ formatCurrency(item.monto) }}</span>
            </div>
            <div class="payment-item subtotal">
              <span class="item-label text-weight-bold">Total Ingresos</span>
              <span class="item-amount text-weight-bold positive">
                ${{ formatCurrency(boletaData.totalIngresos) }}
              </span>
            </div>
          </div>
        </div>

        <div class="payment-category q-mb-md">
          <div class="category-header">
            <q-icon name="trending_down" color="negative" class="q-mr-sm" />
            <span class="text-weight-medium text-negative">DEDUCCIONES</span>
          </div>
          <div class="payment-items">
            <div v-for="(item, index) in boletaData.deducciones" :key="index" class="payment-item">
              <span class="item-label">{{ item.concepto }} ({{ item.porcentaje }})</span>
              <span class="item-amount negative">-${{ formatCurrency(item.monto) }}</span>
            </div>
            <div class="payment-item subtotal">
              <span class="item-label text-weight-bold">Total Deducciones</span>
              <span class="item-amount text-weight-bold negative">
                -${{ formatCurrency(boletaData.totalDeducciones) }}
              </span>
            </div>
          </div>
        </div>

        <div class="payment-category q-mb-md">
          <div class="category-header">
            <q-icon name="paid" color="info" class="q-mr-sm" />
            <span class="text-weight-medium text-info">APORTES PATRONALES</span>
          </div>
          <div class="payment-items">
            <div
              v-for="(item, index) in boletaData.aportesPatronales"
              :key="index"
              class="payment-item"
            >
              <span class="item-label">{{ item.concepto }} ({{ item.porcentaje }})</span>
              <span class="item-amount text-info">${{ formatCurrency(item.monto) }}</span>
            </div>
            <div class="payment-item subtotal">
              <span class="item-label text-weight-bold">Total Aportes Patronales</span>
              <span class="item-amount text-weight-bold text-info">
                ${{ formatCurrency(boletaData.totalAportesPatronales) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="total-section">
        <q-separator class="q-my-md" />
        <div class="total-final">
          <div class="total-item">
            <span class="total-label text-h6 text-weight-bold">MONTO A DEPOSITAR AL EMPLEADO</span>
            <span class="total-amount text-h5 text-weight-bold text-white">
              ${{ formatCurrency(boletaData.montoADepositarAlEmpleado) }}
            </span>
          </div>
          <div class="total-item q-mt-sm">
            <span class="total-label text-h6 text-weight-bold"
              >MONTO A DEPOSITAR EN PLANILLA ÚNICA</span
            >
            <span class="total-amount text-h5 text-weight-bold text-white">
              ${{ formatCurrency(boletaData.montoADepositarEnPlanillaUnica) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="signatures-section flex flex-col q-mb-lg">
      <div class="section-title text-h6 text-weight-bold text-primary q-mb-md">
        <q-icon name="draw" class="q-mr-sm" />
        Firmas
      </div>
      <div class="signatures-grid row flex justify-between mx-15 mt-15">
        <div class="w-60">
          <div class="border-b-2"></div>
          <div class="signature-label text-center q-mt-sm text-weight-medium">
            Firma del Empleado
          </div>
        </div>
        <div class="w-60">
          <div class="border-b-2"></div>
          <div class="signature-label text-center q-mt-sm text-weight-medium">
            Firma del Jefe de Departamento
          </div>
        </div>
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <div class="additional-info text-center">
      <div class="status-badge q-mb-md">
        <q-chip
          :color="mappedBoleta.estado === 'Pagado' ? 'positive' : 'warning'"
          :text-color="mappedBoleta.estado === 'Pagado' ? 'white' : 'black'"
          :icon="mappedBoleta.estado === 'Pagado' ? 'check_circle' : 'schedule'"
          size="lg"
        >
          {{ mappedBoleta.estado }}
        </q-chip>
      </div>

      <div class="footer-info text-caption text-grey-6">
        <div>Documento generado automáticamente</div>
        <div>Fecha de emisión: {{ formatDate(new Date()) }}</div>
        <div class="q-mt-sm">
          <q-icon name="verified" class="q-mr-xs" />
          Este documento es una constancia oficial de pago de salario.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

// Definimos las props que recibirá el componente.
// Ahora esperamos un 'boletaData' con la estructura de prestaciones.
const props = defineProps({
  boletaData: {
    type: Object,
    required: true,
    default: () => ({
      calculoNo: 0,
      fecha: '',
      periodo: '',
      salarioBaseMostrado: 0,
      informacionEmpleado: {
        nombre: '',
        id: '',
        puesto: '',
        salarioBase: 0,
        departamento: '',
      },
      conceptos: [],
      deducciones: [],
      aportesPatronales: [],
      totalIngresos: 0,
      totalDeducciones: 0,
      totalAportesPatronales: 0,
      montoADepositarAlEmpleado: 0,
      montoADepositarEnPlanillaUnica: 0,
    }),
  },
})

// Emits para cerrar el diálogo
defineEmits(['close'])

// Computed property para mapear los nuevos datos a la estructura antigua del componente
// Esto permite que las secciones de 'Información del Empleado' y 'Información Adicional'
// que ya existían en tu componente sigan funcionando con las propiedades 'boleta.nombreEmpleado', etc.
const mappedBoleta = computed(() => {
  const infoEmp = props.boletaData.informacionEmpleado
  // Use the estado from boletaData if available, otherwise calculate it
  const estadoPago =
    props.boletaData.estado ||
    (props.boletaData.montoADepositarAlEmpleado > 0 ? 'Pagado' : 'Pendiente')

  return {
    id: infoEmp.id,
    nombreEmpleado: infoEmp.nombre,
    cargo: infoEmp.puesto, // Mapeamos 'puesto' a 'cargo'
    fechaPago: props.boletaData.fecha, // Usamos la fecha del cálculo como fecha de pago
    estado: estadoPago,
    salarioBase: infoEmp.salarioBase,
    // Estas propiedades (bonificaciones, deducciones, totalPagar) ya no se usarán directamente
    // en las nuevas tablas de ingresos/deducciones, pero las mantengo por si las usas en otra parte.
    bonificaciones: 0, // O calcula una suma de conceptos que no sean salario base
    deducciones: props.boletaData.totalDeducciones, // Usa el total de deducciones
    totalPagar: props.boletaData.montoADepositarAlEmpleado, // El monto final a depositar
    periodoPago: props.boletaData.periodo, // Usamos el período del cálculo
  }
})

// Funciones de formateo (las que ya tenías)
function formatCurrency(amount) {
  const numAmount = parseFloat(amount)
  if (isNaN(numAmount)) return 'N/A'
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount)
}

function formatDate(date) {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
</script>

<style scoped>
/* Tus estilos existentes */
.boleta-container {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
}

.company-header {
  border-bottom: 3px solid #1976d2;
  padding-bottom: 1rem;
}

.section-title {
  border-left: 4px solid #1976d2;
  padding-left: 12px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #666;
}

.value {
  font-weight: 600;
  color: #333;
}

.payment-section {
  background: #fafafa;
  padding: 20px;
  border-radius: 8px;
}

.payment-category {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #e0e0e0;
}

.category-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.payment-items {
  /* Elimina el flex-col si estaba aquí y causaba problemas */
}

.payment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.payment-item.subtotal {
  border-top: 1px solid #e0e0e0;
  margin-top: 8px;
  padding-top: 8px;
}

.signatures-section {
  background: #fafafa;
  padding: 20px;
}

.item-label {
  color: #555;
}

.item-amount.positive {
  color: #2e7d32;
  font-weight: 600;
}

.item-amount.negative {
  color: #d32f2f;
  font-weight: 600;
}

.total-section {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-top: 16px;
}

.total-final {
  text-align: center;
}

.total-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-amount {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 6px;
  backdrop-filter: blur(10px);
}

.status-badge {
  display: flex;
  justify-content: center;
}

.footer-info {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

/* Estilos para impresión */
@media print {
  body * {
    visibility: hidden;
  }
  .boleta-container,
  .boleta-container * {
    visibility: visible;
  }
  .boleta-container {
    box-shadow: none !important;
    border: 1px solid #ddd;
    page-break-inside: avoid;
    max-width: none !important;
    width: 100% !important;
    margin: 0 !important;
    position: absolute;
    left: 0;
    top: 0;
  }
  .q-card-actions {
    display: none; /* Oculta los botones de acción al imprimir */
  }

  /* Aplica los estilos específicos de impresión que ya tenías */
  .total-section {
    background: #f0f0f0 !important;
    color: #333 !important;
    border: 2px solid #1976d2;
  }

  .total-amount {
    background: none !important;
    border: 1px solid #1976d2;
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
}

/* Estilos específicos para PDF */
.pdf-export {
  background: white !important;
  box-shadow: none !important;
  border: none !important;
  font-size: 12px !important;
}

.pdf-export .company-header {
  border-bottom: 2px solid #1976d2 !important;
}

.pdf-export .total-section {
  background: #f0f0f0 !important;
  color: #333 !important;
  border: 2px solid #1976d2 !important;
}

.pdf-export .total-amount {
  background: white !important;
  border: 1px solid #1976d2 !important;
  color: #1976d2 !important;
}
</style>
