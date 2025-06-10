<template>
  <div class="boleta-container bg-white rounded-xl w-[790px] my-0 mx-auto q-pa-lg" ref="boletaRef">
    <!-- Header de la empresa -->
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

    <!-- Información del empleado -->
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
              <span class="value">{{ boleta.nombreEmpleado }}</span>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="info-item">
              <span class="label">Cargo:</span>
              <span class="value">{{ boleta.cargo }}</span>
            </div>
          </div>
        </div>
        <div class="col q-mt-sm">
          <div class="col-12 col-md-6">
            <div class="info-item">
              <span class="label">ID Empleado:</span>
              <span class="value">#{{ String(boleta.id).padStart(4, '0') }}</span>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="info-item">
              <span class="label">Periodo de Pago:</span>
              <span class="value">{{ formatPeriod(boleta.fechaPago) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <!-- Detalles de pago -->
    <div class="payment-section q-mb-lg">
      <div class="section-title text-h6 text-weight-bold text-primary q-mb-md">
        <q-icon name="payments" class="q-mr-sm" />
        Detalles de Pago
      </div>

      <div class="flex flex-row gap-4">
        <!-- Ingresos -->
        <div class="payment-category q-mb-md">
          <div class="category-header">
            <q-icon name="trending_up" color="positive" class="q-mr-sm" />
            <span class="text-weight-medium text-positive">INGRESOS</span>
          </div>
          <div class="payment-items">
            <div class="payment-item">
              <span class="item-label">Salario Base</span>
              <span class="item-amount positive">${{ formatCurrency(boleta.salarioBase) }}</span>
            </div>
            <div class="payment-item">
              <span class="item-label">Bonificaciones</span>
              <span class="item-amount positive">${{ formatCurrency(boleta.bonificaciones) }}</span>
            </div>
            <div class="payment-item subtotal">
              <span class="item-label text-weight-bold">Subtotal Ingresos</span>
              <span class="item-amount text-weight-bold positive">
                ${{ formatCurrency(boleta.salarioBase + boleta.bonificaciones) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Deducciones -->
        <div class="payment-category q-mb-md">
          <div class="category-header">
            <q-icon name="trending_down" color="negative" class="q-mr-sm" />
            <span class="text-weight-medium text-negative">DEDUCCIONES</span>
          </div>
          <div class="payment-items">
            <div class="payment-item">
              <span class="item-label">Seguridad Social</span>
              <span class="item-amount negative"
                >-${{ formatCurrency(boleta.deducciones * 0.6) }}</span
              >
            </div>
            <div class="payment-item">
              <span class="item-label">Impuesto Renta</span>
              <span class="item-amount negative"
                >-${{ formatCurrency(boleta.deducciones * 0.4) }}</span
              >
            </div>
            <div class="payment-item subtotal">
              <span class="item-label text-weight-bold">Total Deducciones</span>
              <span class="item-amount text-weight-bold negative">
                -${{ formatCurrency(boleta.deducciones) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Total final -->
      <div class="total-section">
        <q-separator class="q-my-md" />
        <div class="total-final">
          <div class="total-item">
            <span class="total-label text-h6 text-weight-bold">TOTAL A PAGAR</span>
            <span class="total-amount text-h5 text-weight-bold text-white">
              ${{ formatCurrency(boleta.totalPagar) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Seccion de Firmas -->
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

    <!-- Información adicional -->
    <div class="additional-info text-center">
      <div class="status-badge q-mb-md">
        <q-chip
          :color="boleta.estado === 'Pagado' ? 'positive' : 'warning'"
          :text-color="boleta.estado === 'Pagado' ? 'white' : 'black'"
          :icon="boleta.estado === 'Pagado' ? 'check_circle' : 'schedule'"
          size="lg"
        >
          {{ boleta.estado }}
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
// Props del componente
defineProps({
  boleta: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      nombreEmpleado: '',
      cargo: '',
      fechaPago: '',
      estado: 'Pendiente',
      salarioBase: 0,
      bonificaciones: 0,
      deducciones: 0,
      totalPagar: 0,
    }),
  },
})

// Funciones de formateo
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date) {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function formatPeriod(fechaPago) {
  const date = new Date(fechaPago)
  const year = date.getFullYear()
  const month = date.toLocaleString('es-CO', { month: 'long' })
  return `${month} ${year}`
}
</script>

<style scoped>
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
  width: 340px;
}

.category-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
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
  .boleta-container {
    box-shadow: none !important;
    border: 1px solid #ddd;
    page-break-inside: avoid;
    max-width: none !important;
    width: 100% !important;
    margin: 0 !important;
  }

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
