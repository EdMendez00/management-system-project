<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Historial de Prestaciones</div>
      <p>Registro de todas las prestaciones calculadas</p>
    </q-card-section>

    <q-card-section>
      <q-table
        :rows="prestacionesHistory"
        :columns="columns"
        row-key="id"
        flat
        bordered
      >
        <template v-slot:body-cell-Estado="props">
          <q-td :props="props">
            <q-badge :color="props.row.estado === 'Pendiente' ? 'orange' : 'blue'">
              {{ props.row.estado }}
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-Acciones="props">
          <q-td :props="props">
            <q-btn icon="description" flat round dense @click="viewComprobante(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card-section>

    <q-dialog v-model="dialogBoletaPreview">
      <q-card style="width: 700px; max-width: 80vw;">
        <BoletaPagoComponent
          v-if="selectedBoleta"
          :boletaData="selectedBoleta"
          @close="dialogBoletaPreview = false"
        />
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BoletaPagoComponent from 'src/components/BoletaPagoComponent.vue'; // Asegúrate de la ruta correcta

// Definición de columnas para la tabla
const columns = [
  { name: 'id', label: 'ID', align: 'left', field: 'id' },
  { name: 'empleado', label: 'Empleados', align: 'left', field: 'empleado' },
  { name: 'tipo', label: 'Tipo', align: 'left', field: 'tipo' },
  { name: 'fecha', label: 'Fecha', align: 'left', field: 'fecha' },
  { name: 'monto', label: 'Monto', align: 'right', field: 'monto', format: val => `$${parseFloat(val).toFixed(2)}` },
  { name: 'estado', label: 'Estado', align: 'center', field: 'estado' },
  { name: 'acciones', label: 'Acciones', align: 'center', field: 'acciones' },
];

// Datos de ejemplo para el historial (reemplazar con datos reales de tu API)
const prestacionesHistory = ref([
  { id: 1, empleado: 'Juan Perez', tipo: 'Aguinaldo', fecha: '05/04/2025', monto: '1200.0', estado: 'Pendiente',
    // Datos completos de la boleta para el preview (adaptados a la estructura de BoletaPagoComponent.vue)
    boletaDetails: {
      calculoNo: 1, fecha: '05/04/2025', periodo: 'Abril de 2025', salarioBaseMostrado: 1200,
      informacionEmpleado: { nombre: 'Juan Pérez', id: '1', puesto: 'Desarrollador', salarioBase: 1200, departamento: 'IT' },
      conceptos: [{ concepto: 'Salario Base', cantidad: '-', monto: 1200 }],
      deducciones: [{ concepto: 'ISSS Empleado', porcentaje: '3.0%', monto: 36 }],
      aportesPatronales: [{ concepto: 'ISSS Patronal', porcentaje: '7.5%', monto: 90 }],
      totalIngresos: 1200, totalDeducciones: 36, totalAportesPatronales: 90, montoADepositarAlEmpleado: 1164, montoADepositarEnPlanillaUnica: 90,
    }
  },
  { id: 2, empleado: 'Maria Lopez', tipo: 'Aguinaldo', fecha: '05/04/2025', monto: '1000.0', estado: 'Pagado',
    // Datos completos de la boleta para el preview
    boletaDetails: {
      calculoNo: 2, fecha: '05/04/2025', periodo: 'Abril de 2025', salarioBaseMostrado: 1000,
      informacionEmpleado: { nombre: 'Maria López', id: '2', puesto: 'Asistente', salarioBase: 1000, departamento: 'HR' },
      conceptos: [{ concepto: 'Salario Base', cantidad: '-', monto: 1000 }],
      deducciones: [{ concepto: 'ISSS Empleado', porcentaje: '3.0%', monto: 30 }],
      aportesPatronales: [{ concepto: 'ISSS Patronal', porcentaje: '7.5%', monto: 75 }],
      totalIngresos: 1000, totalDeducciones: 30, totalAportesPatronales: 75, montoADepositarAlEmpleado: 970, montoADepositarEnPlanillaUnica: 75,
    }
  },
]);

const dialogBoletaPreview = ref(false);
const selectedBoleta = ref(null);

onMounted(() => {
  // En un caso real, aquí harías una llamada a tu API para obtener el historial
});

// Función para previsualizar la boleta (llamada al hacer clic en el botón de descarga en la tabla)
function viewComprobante(boleta) {
  selectedBoleta.value = { ...boleta.boletaDetails }; // Pasamos los detalles completos
  dialogBoletaPreview.value = true;
}
</script>

<style scoped>
/* Estilos específicos si los necesitas */
</style>